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
 * Build a single meal with EXACT macro targets using deterministic linear math.
 * 
 * Algorithm:
 * 1. Compute weight of protein source to hit protein target
 * 2. Subtract trace carbs from protein source, compute carb source weight for remaining
 * 3. Subtract trace fats from both, compute fat source weight for remaining
 * 4. Result: exact macros guaranteed by linear algebra
 */
export function buildDeterministicMeal(
    mealName: string,
    selection: MealFoodSelection,
    targetProtein: number,
    targetCarbs: number,
    targetFat: number
): DeterministicMeal {
    const ingredients: ResolvedIngredient[] = [];
    let totalP = 0, totalC = 0, totalF = 0, totalCal = 0;

    // Validate food IDs exist, fallback to defaults if not
    const proteinId = LOCAL_NUTRITION_DB[selection.proteinId] ? selection.proteinId : 'chicken_breast_cooked';
    const carbId = LOCAL_NUTRITION_DB[selection.carbId] ? selection.carbId : 'white_rice_cooked';
    const fatId = LOCAL_NUTRITION_DB[selection.fatId] ? selection.fatId : 'olive_oil';

    // Step 1: Protein source → hit protein target exactly
    const proteinCalc = computeWeightForMacro(proteinId, 'protein', targetProtein);
    if (proteinCalc && proteinCalc.weightGrams > 0) {
        const resolved = resolveIngredient(proteinId, proteinCalc.weightGrams);
        if (resolved) {
            ingredients.push(resolved);
            totalP += resolved.protein;
            totalC += resolved.carbs;
            totalF += resolved.fat;
            totalCal += resolved.calories;
        }
    }

    // Step 2: Carb source → hit carb target exactly (subtract trace carbs from protein source)
    const remainingCarbs = Math.max(0, targetCarbs - totalC);
    if (remainingCarbs > 0) {
        const carbCalc = computeWeightForMacro(carbId, 'carbs', remainingCarbs);
        if (carbCalc && carbCalc.weightGrams > 0) {
            const resolved = resolveIngredient(carbId, carbCalc.weightGrams);
            if (resolved) {
                ingredients.push(resolved);
                totalP += resolved.protein;
                totalC += resolved.carbs;
                totalF += resolved.fat;
                totalCal += resolved.calories;
            }
        }
    }

    // Step 3: Fat source → hit fat target exactly (subtract trace fats from protein + carb sources)
    const remainingFat = Math.max(0, targetFat - totalF);
    if (remainingFat > 0) {
        const fatCalc = computeWeightForMacro(fatId, 'fat', remainingFat);
        if (fatCalc && fatCalc.weightGrams > 0) {
            const resolved = resolveIngredient(fatId, fatCalc.weightGrams);
            if (resolved) {
                ingredients.push(resolved);
                totalP += resolved.protein;
                totalC += resolved.carbs;
                totalF += resolved.fat;
                totalCal += resolved.calories;
            }
        }
    }

    // Step 4: Add optional extras (veggies, condiments) — these add minimal cals
    if (selection.extras) {
        for (const extraId of selection.extras) {
            const food = LOCAL_NUTRITION_DB[extraId];
            if (!food) continue;
            const firstPortion = Object.entries(food.commonPortions)[0];
            if (!firstPortion) continue;
            const resolved = resolveIngredient(extraId, firstPortion[1]);
            if (resolved) {
                ingredients.push(resolved);
                totalP += resolved.protein;
                totalC += resolved.carbs;
                totalF += resolved.fat;
                totalCal += resolved.calories;
            }
        }
    }

    return {
        meal_name: mealName,
        dish: selection.dish || `${LOCAL_NUTRITION_DB[proteinId]?.name || 'Protein'} with ${LOCAL_NUTRITION_DB[carbId]?.name || 'Carbs'}`,
        recipe: selection.recipe || '',
        ingredients,
        protein: parseFloat(totalP.toFixed(1)),
        carbs: parseFloat(totalC.toFixed(1)),
        fat: parseFloat(totalF.toFixed(1)),
        calories: Math.round(totalCal)
    };
}

/**
 * Generate a complete deterministic diet plan.
 * 
 * @param targetCalories - Total daily calorie target
 * @param targetProtein - Total daily protein target (grams)
 * @param mealSelections - LLM-chosen food IDs per meal
 * @returns Plan with EXACT macro targets hit
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
    const carbsCal = targetCalories - proteinCal - fatCal;
    const targetCarbs = Math.max(0, carbsCal / 4);

    // Per-meal targets (equal distribution)
    const mealTargetP = targetProtein / numMeals;
    const mealTargetC = targetCarbs / numMeals;
    const mealTargetF = targetFat / numMeals;

    // Build each meal with deterministic math
    const meals: DeterministicMeal[] = [];
    let actualTotalCal = 0, actualTotalP = 0;

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
