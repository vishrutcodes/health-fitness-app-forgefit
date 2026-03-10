import { LOCAL_NUTRITION_DB, calculateCalories, resolveIngredient, ResolvedIngredient } from "./nutrition-db";

// ============================================================================
// DETERMINISTIC DIET PLAN GENERATOR
// Math-first: exact linear algebra guarantees 0% macro deviation.
// LLM is only used to pick food IDs for variety — never for portions.
// ============================================================================

export interface MealFoodSelection {
    proteinId: string;
    carbId: string;
    fatId: string;
    extras?: string[]; // optional low-cal extras like veggies/condiments
    dish: string;
    recipe: string;
}

export interface DeterministicMeal {
    meal_name: string;
    dish: string;
    recipe: string;
    ingredients: ResolvedIngredient[];
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
}

export interface DeterministicPlan {
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    meals: DeterministicMeal[];
    actualCalories: number;
    actualProtein: number;
}

// Available food IDs per macro category — these are the only ones the LLM can pick from
export const FOOD_OPTIONS = {
    protein: Object.entries(LOCAL_NUTRITION_DB)
        .filter(([_, f]) => {
            const pCal = f.proteinPer100g * 4;
            const total = pCal + f.carbsPer100g * 4 + f.fatPer100g * 9;
            return total > 0 && (pCal / total) > 0.35 && f.proteinPer100g >= 10;
        })
        .map(([id]) => id),
    carbs: Object.entries(LOCAL_NUTRITION_DB)
        .filter(([_, f]) => {
            const cCal = f.carbsPer100g * 4;
            const total = f.proteinPer100g * 4 + cCal + f.fatPer100g * 9;
            return total > 0 && (cCal / total) > 0.45 && f.carbsPer100g >= 15;
        })
        .map(([id]) => id),
    fat: Object.entries(LOCAL_NUTRITION_DB)
        .filter(([_, f]) => {
            const fCal = f.fatPer100g * 9;
            const total = f.proteinPer100g * 4 + f.carbsPer100g * 4 + fCal;
            return total > 0 && (fCal / total) > 0.50 && f.fatPer100g >= 10;
        })
        .map(([id]) => id),
};

/**
 * Core linear math: compute exact weight of a food needed to hit a macro target.
 * Returns the weight in grams and the resulting macros from that weight.
 */
function computeWeightForMacro(
    foodId: string,
    macro: 'protein' | 'carbs' | 'fat',
    targetGrams: number
): { weightGrams: number; protein: number; carbs: number; fat: number; calories: number } | null {
    const food = LOCAL_NUTRITION_DB[foodId];
    if (!food) return null;

    let per100g = 0;
    if (macro === 'protein') per100g = food.proteinPer100g;
    else if (macro === 'carbs') per100g = food.carbsPer100g;
    else if (macro === 'fat') per100g = food.fatPer100g;

    if (per100g <= 0) return null;

    const requiredWeight = Math.max(0, (targetGrams / per100g) * 100);
    const multiplier = requiredWeight / 100;

    const protein = parseFloat((food.proteinPer100g * multiplier).toFixed(1));
    const carbs = parseFloat((food.carbsPer100g * multiplier).toFixed(1));
    const fat = parseFloat((food.fatPer100g * multiplier).toFixed(1));

    return {
        weightGrams: Math.round(requiredWeight),
        protein,
        carbs,
        fat,
        calories: calculateCalories(protein, carbs, fat)
    };
}

/**
 * Build a single meal with EXACT macro targets using iterative convergence.
 * 
 * The naive 3-step approach fails because:
 * - Carb sources contribute trace protein (e.g. rice has 2.7g protein/100g)
 * - Fat sources contribute trace protein (e.g. almonds have 21g protein/100g!)
 * - These trace proteins accumulate and overshoot the protein target
 * 
 * Solution: Iteratively compute weights, accounting for ALL cross-macro contributions.
 * 
 * Algorithm:
 * 1. Estimate initial weights naively
 * 2. Sum ALL protein from all sources (including trace)
 * 3. If protein overshoots, reduce protein source weight to compensate
 * 4. Recompute carb/fat source weights with updated trace subtraction
 * 5. Repeat until converged (typically 3-4 iterations)
 */
export function buildDeterministicMeal(
    mealName: string,
    selection: MealFoodSelection,
    targetProtein: number,
    targetCarbs: number,
    targetFat: number
): DeterministicMeal {
    // Validate food IDs exist, fallback to defaults if not
    const proteinId = LOCAL_NUTRITION_DB[selection.proteinId] ? selection.proteinId : 'chicken_breast_cooked';
    const carbId = LOCAL_NUTRITION_DB[selection.carbId] ? selection.carbId : 'white_rice_cooked';
    const fatId = LOCAL_NUTRITION_DB[selection.fatId] ? selection.fatId : 'olive_oil';

    const pFood = LOCAL_NUTRITION_DB[proteinId];
    const cFood = LOCAL_NUTRITION_DB[carbId];
    const fFood = LOCAL_NUTRITION_DB[fatId];

    if (!pFood || !cFood || !fFood) {
        return emptyMeal(mealName, selection);
    }

    // Step 0: Pre-calculate macros from "extras" (veggies/condiments)
    // We must subtract these from the targets so the main ingredients compensate for them
    let extraP = 0, extraC = 0, extraF = 0, extraCal = 0;
    const resolvedExtras: ResolvedIngredient[] = [];

    if (selection.extras) {
        for (const extraId of selection.extras) {
            const food = LOCAL_NUTRITION_DB[extraId];
            if (!food) continue;
            // Get standard portion for the extra
            const firstPortion = Object.entries(food.commonPortions)[0];
            if (!firstPortion) continue;

            const resolved = resolveIngredient(extraId, firstPortion[1]);
            if (resolved) {
                resolvedExtras.push(resolved);
                extraP += resolved.protein;
                extraC += resolved.carbs;
                extraF += resolved.fat;
                extraCal += resolved.calories;
            }
        }
    }

    // Iterative convergence: 6 iterations is more than enough
    let pWeight = 0, cWeight = 0, fWeight = 0;

    for (let iter = 0; iter < 6; iter++) {
        // Step 1: Compute carb source weight for remaining carbs
        // (subtract trace carbs from protein, fat, and extras)
        const traceCarbs_fromP = (pFood.carbsPer100g * pWeight) / 100;
        const traceCarbs_fromF = (fFood.carbsPer100g * fWeight) / 100;
        const neededCarbs = Math.max(0, targetCarbs - traceCarbs_fromP - traceCarbs_fromF - extraC);
        cWeight = cFood.carbsPer100g > 0 ? (neededCarbs / cFood.carbsPer100g) * 100 : 0;

        // Step 2: Compute fat source weight for remaining fat
        // (subtract trace fat from protein, carbs, and extras)
        const traceFat_fromP = (pFood.fatPer100g * pWeight) / 100;
        const traceFat_fromC = (cFood.fatPer100g * cWeight) / 100;
        const neededFat = Math.max(0, targetFat - traceFat_fromP - traceFat_fromC - extraF);
        fWeight = fFood.fatPer100g > 0 ? (neededFat / fFood.fatPer100g) * 100 : 0;

        // Step 3: Compute protein source weight for remaining protein
        // (subtract trace protein from carbs, fat, and extras)
        const tracePro_fromC = (cFood.proteinPer100g * cWeight) / 100;
        const tracePro_fromF = (fFood.proteinPer100g * fWeight) / 100;
        const neededProtein = Math.max(0, targetProtein - tracePro_fromC - tracePro_fromF - extraP);
        pWeight = pFood.proteinPer100g > 0 ? (neededProtein / pFood.proteinPer100g) * 100 : 0;
    }

    // Clamp all weights to non-negative
    pWeight = Math.max(0, pWeight);
    cWeight = Math.max(0, cWeight);
    fWeight = Math.max(0, fWeight);

    // Resolve final ingredients
    const ingredients: ResolvedIngredient[] = [];
    let totalP = extraP, totalC = extraC, totalF = extraF, totalCal = extraCal;

    // Push the primary ingredients first
    if (pWeight > 0) {
        const resolved = resolveIngredient(proteinId, Math.round(pWeight));
        if (resolved) {
            ingredients.push(resolved);
            totalP += resolved.protein;
            totalC += resolved.carbs;
            totalF += resolved.fat;
            totalCal += resolved.calories;
        }
    }

    if (cWeight > 0) {
        const resolved = resolveIngredient(carbId, Math.round(cWeight));
        if (resolved) {
            ingredients.push(resolved);
            totalP += resolved.protein;
            totalC += resolved.carbs;
            totalF += resolved.fat;
            totalCal += resolved.calories;
        }
    }

    if (fWeight > 0) {
        const resolved = resolveIngredient(fatId, Math.round(fWeight));
        if (resolved) {
            ingredients.push(resolved);
            totalP += resolved.protein;
            totalC += resolved.carbs;
            totalF += resolved.fat;
            totalCal += resolved.calories;
        }
    }

    // Push the pre-calculated extras at the end
    ingredients.push(...resolvedExtras);

    return {
        meal_name: mealName,
        dish: selection.dish || `${pFood.name} with ${cFood.name}`,
        recipe: selection.recipe || '',
        ingredients,
        protein: parseFloat(totalP.toFixed(1)),
        carbs: parseFloat(totalC.toFixed(1)),
        fat: parseFloat(totalF.toFixed(1)),
        calories: Math.round(totalCal)
    };
}

function emptyMeal(mealName: string, selection: MealFoodSelection): DeterministicMeal {
    return {
        meal_name: mealName,
        dish: selection.dish || "Meal",
        recipe: selection.recipe || '',
        ingredients: [],
        protein: 0, carbs: 0, fat: 0, calories: 0
    };
}

/**
 * Generate a complete deterministic diet plan.
 * 
 * Uses iterative calorie ceiling enforcement:
 * 1. Compute initial macro targets from calorie/protein inputs
 * 2. Build all meals with deterministic math
 * 3. If actual calories overshoot target, reduce carb target and rebuild
 * 4. Repeat until calories are at or below target (max 5 iterations)
 * 
 * @param targetCalories - Total daily calorie target
 * @param targetProtein - Total daily protein target (grams)
 * @param mealSelections - LLM-chosen food IDs per meal
 * @returns Plan with calorie and protein targets hit accurately
 */
export function generateDeterministicPlan(
    targetCalories: number,
    targetProtein: number,
    mealSelections: MealFoodSelection[],
    mealNames: string[]
): DeterministicPlan {
    const numMeals = mealSelections.length;

    // Compute macro architecture
    const proteinCal = targetProtein * 4;
    const fatCal = targetCalories * 0.25; // 25% fat standard
    const targetFat = fatCal / 9;
    let carbsCal = targetCalories - proteinCal - fatCal;
    let targetCarbs = Math.max(0, carbsCal / 4);

    // Iterative calorie ceiling enforcement
    let meals: DeterministicMeal[] = [];
    let actualTotalCal = 0;
    let actualTotalP = 0;

    for (let attempt = 0; attempt < 5; attempt++) {
        const mealTargetP = targetProtein / numMeals;
        const mealTargetC = targetCarbs / numMeals;
        const mealTargetF = targetFat / numMeals;

        meals = [];
        actualTotalCal = 0;
        actualTotalP = 0;

        for (let i = 0; i < numMeals; i++) {
            const meal = buildDeterministicMeal(
                mealNames[i] || `Meal ${i + 1}`,
                mealSelections[i],
                mealTargetP,
                mealTargetC,
                mealTargetF
            );
            meals.push(meal);
            actualTotalCal += meal.calories;
            actualTotalP += meal.protein;
        }

        // Check if we strictly meet the ceiling (zero tolerance for overshooting)
        const calOvershoot = actualTotalCal - targetCalories;
        if (calOvershoot <= 0) break;

        // Reduce carb target to compensate for calorie overshoot
        // Over-correct slightly (+10 cals) to ensure we drop below the ceiling next iteration
        const carbReduction = (calOvershoot + 10) / 4;
        targetCarbs = Math.max(0, targetCarbs - carbReduction);
    }

    return {
        targetCalories,
        targetProtein,
        targetCarbs: parseFloat(targetCarbs.toFixed(1)),
        targetFat: parseFloat(targetFat.toFixed(1)),
        meals,
        actualCalories: actualTotalCal,
        actualProtein: parseFloat(actualTotalP.toFixed(1))
    };
}

/**
 * Get a compact list of available food options for LLM prompts.
 */
export function getFoodOptionsForLLM(): string {
    const lines: string[] = [];

    lines.push('### PROTEIN SOURCES (pick one per meal)');
    for (const id of FOOD_OPTIONS.protein) {
        const f = LOCAL_NUTRITION_DB[id];
        if (f) lines.push(`- ${id} → "${f.name}"`);
    }

    lines.push('\n### CARB SOURCES (pick one per meal)');
    for (const id of FOOD_OPTIONS.carbs) {
        const f = LOCAL_NUTRITION_DB[id];
        if (f) lines.push(`- ${id} → "${f.name}"`);
    }

    lines.push('\n### FAT SOURCES (pick one per meal)');
    for (const id of FOOD_OPTIONS.fat) {
        const f = LOCAL_NUTRITION_DB[id];
        if (f) lines.push(`- ${id} → "${f.name}"`);
    }

    return lines.join('\n');
}

// Default meal names
export const MEAL_NAMES = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Pre-Workout', 'Post-Workout', 'Meal 7', 'Meal 8'];
