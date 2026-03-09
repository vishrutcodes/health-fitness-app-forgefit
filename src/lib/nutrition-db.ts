export interface NutritionFact {
    id: string;
    name: string;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    defaultUnit: 'g' | 'item' | 'scoop' | 'ml';
    unitWeightGrams: number; // e.g., 1 large egg = 50g
    source: 'USDA' | 'Brand-Verified' | 'Nutritionix' | 'Edamam';
}

// 1g Protein = 4kcal, 1g Carb = 4kcal, 1g Fat = 9kcal.
// We strictly enforce this math across the entire app.
export function calculateCalories(protein: number, carbs: number, fat: number): number {
    return Math.round((protein * 4) + (carbs * 4) + (fat * 9));
}

// Lab-verified deterministic database for bodybuilding staples
export const LOCAL_NUTRITION_DB: Record<string, NutritionFact> = {
    "egg_whole_large": {
        id: "egg_whole_large",
        name: "Boiled Egg (Large)",
        proteinPer100g: 12.56,
        carbsPer100g: 0.72,
        fatPer100g: 9.51,
        defaultUnit: "item",
        unitWeightGrams: 50, // 50g per large egg (=> 6.28g protein)
        source: "USDA"
    },
    "egg_white_large": {
        id: "egg_white_large",
        name: "Egg Whites (Large)",
        proteinPer100g: 10.9,
        carbsPer100g: 0.7,
        fatPer100g: 0.2,
        defaultUnit: "item",
        unitWeightGrams: 33, // 33g per large egg white
        source: "USDA"
    },
    "chicken_breast_raw": {
        id: "chicken_breast_raw",
        name: "Chicken Breast (Raw)",
        proteinPer100g: 22.5,
        carbsPer100g: 0,
        fatPer100g: 2.6,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "chicken_breast_cooked": {
        id: "chicken_breast_cooked",
        name: "Chicken Breast (Cooked)",
        proteinPer100g: 31,
        carbsPer100g: 0,
        fatPer100g: 3.6,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "whey_protein_isolate": {
        id: "whey_protein_isolate",
        name: "Whey Protein Isolate",
        proteinPer100g: 83.3, // 25g protein per 30g scoop
        carbsPer100g: 3.3,    // 1g per scoop
        fatPer100g: 0,
        defaultUnit: "scoop",
        unitWeightGrams: 30,
        source: "Brand-Verified"
    },
    "soya_chunks": {
        id: "soya_chunks",
        name: "Soya Chunks",
        proteinPer100g: 52,
        carbsPer100g: 33,
        fatPer100g: 1,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "Brand-Verified"
    },
    "white_rice_cooked": {
        id: "white_rice_cooked",
        name: "White Rice (Cooked)",
        proteinPer100g: 2.7,
        carbsPer100g: 28,
        fatPer100g: 0.3,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "brown_rice_cooked": {
        id: "brown_rice_cooked",
        name: "Brown Rice (Cooked)",
        proteinPer100g: 2.6,
        carbsPer100g: 23,
        fatPer100g: 0.9,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "oats_rolled": {
        id: "oats_rolled",
        name: "Rolled Oats",
        proteinPer100g: 13.5,
        carbsPer100g: 68,
        fatPer100g: 6.5,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "almonds": {
        id: "almonds",
        name: "Almonds",
        proteinPer100g: 21.1,
        carbsPer100g: 21.6,
        fatPer100g: 49.9,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "peanut_butter": {
        id: "peanut_butter",
        name: "Peanut Butter",
        proteinPer100g: 25,
        carbsPer100g: 20,
        fatPer100g: 50,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "olive_oil": {
        id: "olive_oil",
        name: "Olive Oil",
        proteinPer100g: 0,
        carbsPer100g: 0,
        fatPer100g: 100,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "broccoli_raw": {
        id: "broccoli_raw",
        name: "Broccoli (Raw)",
        proteinPer100g: 2.8,
        carbsPer100g: 6.6,
        fatPer100g: 0.4,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "sweet_potato_cooked": {
        id: "sweet_potato_cooked",
        name: "Sweet Potato (Cooked)",
        proteinPer100g: 2,
        carbsPer100g: 20.7,
        fatPer100g: 0.1,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "beef_mince_5_percent": {
        id: "beef_mince_5_percent",
        name: "Beef Mince (5% Fat, Cooked)",
        proteinPer100g: 28,
        carbsPer100g: 0,
        fatPer100g: 5,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "salmon_raw": {
        id: "salmon_raw",
        name: "Salmon (Raw)",
        proteinPer100g: 20,
        carbsPer100g: 0,
        fatPer100g: 13,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "greek_yogurt_0": {
        id: "greek_yogurt_0",
        name: "Greek Yogurt (0% Fat)",
        proteinPer100g: 10.3,
        carbsPer100g: 3.6,
        fatPer100g: 0.2,
        defaultUnit: "g",
        unitWeightGrams: 1,
        source: "USDA"
    },
    "milk_whole": {
        id: "milk_whole",
        name: "Whole Milk",
        proteinPer100g: 3.3,
        carbsPer100g: 4.8,
        fatPer100g: 3.3,
        defaultUnit: "ml",
        unitWeightGrams: 1.03, // 1 ml = ~1.03g
        source: "USDA"
    }
};

export interface ResolvedMacroTarget {
    foodId: string;
    foodName: string;
    source: string;
    totalWeightGrams: number;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
}

export function calculateMacrosForWeight(foodId: string, weightGrams: number): ResolvedMacroTarget | null {
    const food = LOCAL_NUTRITION_DB[foodId];
    if (!food) return null;

    const multiplier = weightGrams / 100;

    // Strict deterministic math 
    const protein = parseFloat((food.proteinPer100g * multiplier).toFixed(1));
    const carbs = parseFloat((food.carbsPer100g * multiplier).toFixed(1));
    const fat = parseFloat((food.fatPer100g * multiplier).toFixed(1));
    const calories = calculateCalories(protein, carbs, fat);

    return {
        foodId: food.id,
        foodName: food.name,
        source: food.source,
        totalWeightGrams: weightGrams,
        protein,
        carbs,
        fat,
        calories
    };
}
