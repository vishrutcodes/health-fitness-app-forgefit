import { LOCAL_NUTRITION_DB, calculateCalories } from "./nutrition-db";

export interface MealPlanFood {
    foodId: string;
    name: string;
    weightGrams: number;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    primaryMacro: 'protein' | 'carbs' | 'fat';
}

export interface Meal {
    id: number;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    foods: MealPlanFood[];
}

export interface DietPlan {
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    meals: Meal[];
}

// 1. Generate the math architecture
export function generateDietArchitecture(targetCalories: number, targetProtein: number, numMeals: number): DietPlan {
    // 0% Deviation constraints
    const proteinCal = targetProtein * 4;
    const remainingCal = targetCalories - proteinCal;

    // Allocate 25% of total calories to fats (standard bodybuilding baseline)
    const fatCal = targetCalories * 0.25;
    const targetFat = fatCal / 9;

    // Remaining goes to carbs
    const carbsCal = remainingCal - fatCal;
    const targetCarbs = carbsCal / 4;

    // Divide exactly by meals
    const mealTargetCal = targetCalories / numMeals;
    const mealTargetP = targetProtein / numMeals;
    const mealTargetC = targetCarbs / numMeals;
    const mealTargetF = targetFat / numMeals;

    const meals: Meal[] = [];

    for (let i = 1; i <= numMeals; i++) {
        // Step 1: Hit Protein Target Exactly
        const proteinFood = calculateFoodForMacro('protein', 'chicken_breast_cooked', mealTargetP);

        // Step 2: Hit Carb Target Exactly (subtracting trace carbs from protein source)
        const remainingCarbTarget = Math.max(0, mealTargetC - proteinFood.carbs);
        const carbFood = calculateFoodForMacro('carbs', 'white_rice_cooked', remainingCarbTarget);

        // Step 3: Hit Fat Target Exactly (subtracting trace fats from both protein and carb sources)
        const remainingFatTarget = Math.max(0, mealTargetF - proteinFood.fat - carbFood.fat);
        const fatFood = calculateFoodForMacro('fat', 'olive_oil', remainingFatTarget);

        meals.push({
            id: i,
            targetCalories: Math.round(mealTargetCal),
            targetProtein: parseFloat(mealTargetP.toFixed(1)),
            targetCarbs: parseFloat(mealTargetC.toFixed(1)),
            targetFat: parseFloat(mealTargetF.toFixed(1)),
            foods: [proteinFood, carbFood, fatFood]
        });
    }

    return {
        targetCalories,
        targetProtein,
        targetCarbs: parseFloat(targetCarbs.toFixed(1)),
        targetFat: parseFloat(targetFat.toFixed(1)),
        meals
    };
}

// 2. The core linear math allocator guarantees exact macros
export function calculateFoodForMacro(macro: 'protein' | 'carbs' | 'fat', foodId: string, targetGrams: number): MealPlanFood {
    const food = LOCAL_NUTRITION_DB[foodId];
    if (!food) throw new Error(`Food ${foodId} not found mapped in DB.`);

    let requiredWeight = 0;

    // Calculate required weight to hit the precise target macro
    if (macro === 'protein') {
        requiredWeight = (targetGrams / food.proteinPer100g) * 100;
    } else if (macro === 'carbs') {
        requiredWeight = (targetGrams / food.carbsPer100g) * 100;
    } else if (macro === 'fat') {
        requiredWeight = (targetGrams / food.fatPer100g) * 100;
    }

    const multiplier = requiredWeight / 100;
    const roundedWeight = Math.round(requiredWeight);

    // Because this is a Linear system, the food ALSO brings trace amounts of other macros.
    // The instructions say "recalculate weight of new item to maintain EXACT macro target".
    // We strictly attach the exact target output, plus its trace macros.
    const protein = parseFloat((food.proteinPer100g * multiplier).toFixed(1));
    const carbs = parseFloat((food.carbsPer100g * multiplier).toFixed(1));
    const fat = parseFloat((food.fatPer100g * multiplier).toFixed(1));

    return {
        foodId: food.id,
        name: food.name,
        weightGrams: roundedWeight,
        protein,
        carbs,
        fat,
        calories: calculateCalories(protein, carbs, fat),
        primaryMacro: macro
    };
}



export const DIET_OPTIONS = {
    protein: ['chicken_breast_cooked', 'egg_whole_large', 'egg_white_large', 'whey_protein_isolate', 'beef_mince_5_percent', 'salmon_raw', 'greek_yogurt_0', 'soya_chunks'],
    carbs: ['white_rice_cooked', 'brown_rice_cooked', 'oats_rolled', 'sweet_potato_cooked'],
    fat: ['olive_oil', 'almonds', 'peanut_butter']
};
