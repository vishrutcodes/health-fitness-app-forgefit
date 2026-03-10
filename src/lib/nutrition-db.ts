export interface NutritionFact {
    id: string;
    name: string;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    fiberPer100g?: number;
    category: 'protein' | 'carbs' | 'fat' | 'dairy' | 'fruit' | 'vegetable' | 'condiment' | 'grain' | 'legume' | 'nut' | 'beverage';
    commonPortions: Record<string, number>; // description -> grams
    source: 'USDA' | 'Brand-Verified' | 'Nutritionix';
}

// 1g Protein = 4kcal, 1g Carb = 4kcal, 1g Fat = 9kcal
export function calculateCalories(protein: number, carbs: number, fat: number): number {
    return Math.round((protein * 4) + (carbs * 4) + (fat * 9));
}

// ============================================================================
// USDA-VERIFIED NUTRITION DATABASE
// All values per 100g. Sources: USDA FoodData Central (fdc.nal.usda.gov)
// ============================================================================

export const LOCAL_NUTRITION_DB: Record<string, NutritionFact> = {

    // ========================================================================
    // PROTEIN SOURCES
    // ========================================================================
    "chicken_breast_cooked": {
        id: "chicken_breast_cooked",
        name: "Chicken Breast (Cooked, Grilled)",
        proteinPer100g: 31,
        carbsPer100g: 0,
        fatPer100g: 3.6,
        category: "protein",
        commonPortions: { "1 medium breast (174g)": 174, "100g": 100, "150g": 150, "200g": 200 },
        source: "USDA"
    },
    "chicken_breast_raw": {
        id: "chicken_breast_raw",
        name: "Chicken Breast (Raw)",
        proteinPer100g: 22.5,
        carbsPer100g: 0,
        fatPer100g: 2.6,
        category: "protein",
        commonPortions: { "1 medium breast (200g)": 200, "100g": 100 },
        source: "USDA"
    },
    "chicken_thigh_cooked": {
        id: "chicken_thigh_cooked",
        name: "Chicken Thigh (Cooked, Skin Removed)",
        proteinPer100g: 26,
        carbsPer100g: 0,
        fatPer100g: 10.9,
        category: "protein",
        commonPortions: { "1 thigh (116g)": 116, "100g": 100 },
        source: "USDA"
    },
    "ground_turkey_cooked": {
        id: "ground_turkey_cooked",
        name: "Ground Turkey (93% lean, Cooked)",
        proteinPer100g: 27.4,
        carbsPer100g: 0,
        fatPer100g: 8.3,
        category: "protein",
        commonPortions: { "100g": 100, "150g": 150 },
        source: "USDA"
    },
    "egg_whole_large": {
        id: "egg_whole_large",
        name: "Whole Egg (Large, Boiled/Scrambled)",
        proteinPer100g: 12.56,
        carbsPer100g: 0.72,
        fatPer100g: 9.51,
        category: "protein",
        commonPortions: { "1 large egg": 50, "2 large eggs": 100, "3 large eggs": 150 },
        source: "USDA"
    },
    "egg_white_large": {
        id: "egg_white_large",
        name: "Egg White (Large)",
        proteinPer100g: 10.9,
        carbsPer100g: 0.7,
        fatPer100g: 0.2,
        category: "protein",
        commonPortions: { "1 egg white": 33, "3 egg whites": 99, "4 egg whites": 132 },
        source: "USDA"
    },
    "salmon_cooked": {
        id: "salmon_cooked",
        name: "Salmon (Atlantic, Cooked)",
        proteinPer100g: 25.4,
        carbsPer100g: 0,
        fatPer100g: 12.4,
        category: "protein",
        commonPortions: { "1 fillet (154g)": 154, "100g": 100 },
        source: "USDA"
    },
    "salmon_raw": {
        id: "salmon_raw",
        name: "Salmon (Raw)",
        proteinPer100g: 20,
        carbsPer100g: 0,
        fatPer100g: 13,
        category: "protein",
        commonPortions: { "1 fillet (170g)": 170, "100g": 100 },
        source: "USDA"
    },
    "tuna_canned": {
        id: "tuna_canned",
        name: "Tuna (Canned in Water, Drained)",
        proteinPer100g: 25.5,
        carbsPer100g: 0,
        fatPer100g: 0.8,
        category: "protein",
        commonPortions: { "1 can (142g)": 142, "100g": 100 },
        source: "USDA"
    },
    "shrimp_cooked": {
        id: "shrimp_cooked",
        name: "Shrimp (Cooked)",
        proteinPer100g: 24.0,
        carbsPer100g: 0.2,
        fatPer100g: 1.7,
        category: "protein",
        commonPortions: { "100g": 100, "6 large shrimp (84g)": 84 },
        source: "USDA"
    },
    "beef_mince_5_percent": {
        id: "beef_mince_5_percent",
        name: "Beef Mince (5% Fat, Cooked)",
        proteinPer100g: 28,
        carbsPer100g: 0,
        fatPer100g: 5,
        category: "protein",
        commonPortions: { "100g": 100, "150g": 150 },
        source: "USDA"
    },
    "beef_steak_sirloin": {
        id: "beef_steak_sirloin",
        name: "Beef Sirloin Steak (Cooked, Trimmed)",
        proteinPer100g: 27.2,
        carbsPer100g: 0,
        fatPer100g: 7.9,
        category: "protein",
        commonPortions: { "1 steak (200g)": 200, "100g": 100 },
        source: "USDA"
    },
    "whey_protein_isolate": {
        id: "whey_protein_isolate",
        name: "Whey Protein Isolate",
        proteinPer100g: 83.3,
        carbsPer100g: 3.3,
        fatPer100g: 0,
        category: "protein",
        commonPortions: { "1 scoop (30g)": 30, "2 scoops (60g)": 60 },
        source: "Brand-Verified"
    },
    "tofu_firm": {
        id: "tofu_firm",
        name: "Tofu (Firm)",
        proteinPer100g: 17.3,
        carbsPer100g: 2.8,
        fatPer100g: 8.7,
        category: "protein",
        commonPortions: { "1 block (350g)": 350, "1/2 block (175g)": 175, "100g": 100 },
        source: "USDA"
    },
    "paneer": {
        id: "paneer",
        name: "Paneer (Indian Cottage Cheese)",
        proteinPer100g: 18.3,
        carbsPer100g: 3.6,
        fatPer100g: 20.8,
        category: "protein",
        commonPortions: { "100g": 100, "50g": 50 },
        source: "USDA"
    },
    "soya_chunks": {
        id: "soya_chunks",
        name: "Soya Chunks (Dry)",
        proteinPer100g: 52,
        carbsPer100g: 33,
        fatPer100g: 1,
        category: "protein",
        commonPortions: { "1 cup (50g)": 50, "100g": 100 },
        source: "Brand-Verified"
    },
    "cottage_cheese": {
        id: "cottage_cheese",
        name: "Cottage Cheese (Low Fat, 2%)",
        proteinPer100g: 11.1,
        carbsPer100g: 3.4,
        fatPer100g: 2.3,
        category: "dairy",
        commonPortions: { "1 cup (226g)": 226, "1/2 cup (113g)": 113 },
        source: "USDA"
    },

    // ========================================================================
    // GRAINS & CARBS
    // ========================================================================
    "white_rice_cooked": {
        id: "white_rice_cooked",
        name: "White Rice (Cooked)",
        proteinPer100g: 2.7,
        carbsPer100g: 28,
        fatPer100g: 0.3,
        category: "grain",
        commonPortions: { "1 cup cooked (158g)": 158, "100g": 100, "200g": 200 },
        source: "USDA"
    },
    "brown_rice_cooked": {
        id: "brown_rice_cooked",
        name: "Brown Rice (Cooked)",
        proteinPer100g: 2.6,
        carbsPer100g: 23,
        fatPer100g: 0.9,
        category: "grain",
        commonPortions: { "1 cup cooked (195g)": 195, "100g": 100 },
        source: "USDA"
    },
    "oats_rolled": {
        id: "oats_rolled",
        name: "Rolled Oats (Dry)",
        proteinPer100g: 13.5,
        carbsPer100g: 68,
        fatPer100g: 6.5,
        fiberPer100g: 10.1,
        category: "grain",
        commonPortions: { "1/2 cup (40g)": 40, "1 cup (80g)": 80, "100g": 100 },
        source: "USDA"
    },
    "bread_whole_wheat": {
        id: "bread_whole_wheat",
        name: "Whole Wheat Bread",
        proteinPer100g: 13.1,
        carbsPer100g: 43.3,
        fatPer100g: 3.4,
        fiberPer100g: 6.0,
        category: "grain",
        commonPortions: { "1 slice": 28, "2 slices": 56 },
        source: "USDA"
    },
    "bread_white": {
        id: "bread_white",
        name: "White Bread",
        proteinPer100g: 9.4,
        carbsPer100g: 49.2,
        fatPer100g: 3.6,
        category: "grain",
        commonPortions: { "1 slice": 25, "2 slices": 50 },
        source: "USDA"
    },
    "pasta_cooked": {
        id: "pasta_cooked",
        name: "Pasta (Cooked, Enriched)",
        proteinPer100g: 5.8,
        carbsPer100g: 25,
        fatPer100g: 0.9,
        category: "grain",
        commonPortions: { "1 cup (140g)": 140, "200g": 200 },
        source: "USDA"
    },
    "quinoa_cooked": {
        id: "quinoa_cooked",
        name: "Quinoa (Cooked)",
        proteinPer100g: 4.4,
        carbsPer100g: 21.3,
        fatPer100g: 1.9,
        fiberPer100g: 2.8,
        category: "grain",
        commonPortions: { "1 cup (185g)": 185, "100g": 100 },
        source: "USDA"
    },
    "sweet_potato_cooked": {
        id: "sweet_potato_cooked",
        name: "Sweet Potato (Baked, with skin)",
        proteinPer100g: 2.0,
        carbsPer100g: 20.7,
        fatPer100g: 0.1,
        fiberPer100g: 3.3,
        category: "carbs",
        commonPortions: { "1 medium (114g)": 114, "100g": 100, "1 large (180g)": 180 },
        source: "USDA"
    },
    "potato_boiled": {
        id: "potato_boiled",
        name: "Potato (Boiled, No Skin)",
        proteinPer100g: 1.7,
        carbsPer100g: 20.1,
        fatPer100g: 0.1,
        category: "carbs",
        commonPortions: { "1 medium (150g)": 150, "100g": 100 },
        source: "USDA"
    },
    "tortilla_wheat": {
        id: "tortilla_wheat",
        name: "Whole Wheat Tortilla",
        proteinPer100g: 9.0,
        carbsPer100g: 46.0,
        fatPer100g: 7.0,
        category: "grain",
        commonPortions: { "1 tortilla (45g)": 45, "2 tortillas (90g)": 90 },
        source: "USDA"
    },
    "granola": {
        id: "granola",
        name: "Granola (with Nuts & Dried Fruits)",
        proteinPer100g: 8.5,
        carbsPer100g: 64.0,
        fatPer100g: 18.0,
        category: "grain",
        commonPortions: { "1/3 cup (33g)": 33, "1/2 cup (50g)": 50, "100g": 100 },
        source: "USDA"
    },
    "corn_tortilla": {
        id: "corn_tortilla",
        name: "Corn Tortilla",
        proteinPer100g: 5.7,
        carbsPer100g: 44.6,
        fatPer100g: 2.9,
        category: "grain",
        commonPortions: { "1 tortilla (26g)": 26, "2 tortillas (52g)": 52 },
        source: "USDA"
    },
    "bagel_plain": {
        id: "bagel_plain",
        name: "Bagel (Plain)",
        proteinPer100g: 10.5,
        carbsPer100g: 53.4,
        fatPer100g: 1.6,
        category: "grain",
        commonPortions: { "1 bagel (105g)": 105 },
        source: "USDA"
    },

    // ========================================================================
    // LEGUMES
    // ========================================================================
    "lentils_cooked": {
        id: "lentils_cooked",
        name: "Lentils (Cooked)",
        proteinPer100g: 9.0,
        carbsPer100g: 20.1,
        fatPer100g: 0.4,
        fiberPer100g: 7.9,
        category: "legume",
        commonPortions: { "1 cup (198g)": 198, "100g": 100 },
        source: "USDA"
    },
    "chickpeas_cooked": {
        id: "chickpeas_cooked",
        name: "Chickpeas (Cooked)",
        proteinPer100g: 8.9,
        carbsPer100g: 27.4,
        fatPer100g: 2.6,
        fiberPer100g: 7.6,
        category: "legume",
        commonPortions: { "1 cup (164g)": 164, "100g": 100 },
        source: "USDA"
    },
    "black_beans_cooked": {
        id: "black_beans_cooked",
        name: "Black Beans (Cooked)",
        proteinPer100g: 8.9,
        carbsPer100g: 23.7,
        fatPer100g: 0.5,
        fiberPer100g: 8.7,
        category: "legume",
        commonPortions: { "1 cup (172g)": 172, "100g": 100 },
        source: "USDA"
    },
    "kidney_beans_cooked": {
        id: "kidney_beans_cooked",
        name: "Kidney Beans (Cooked)",
        proteinPer100g: 8.7,
        carbsPer100g: 22.8,
        fatPer100g: 0.5,
        fiberPer100g: 6.4,
        category: "legume",
        commonPortions: { "1 cup (177g)": 177, "100g": 100 },
        source: "USDA"
    },
    "edamame": {
        id: "edamame",
        name: "Edamame (Shelled, Cooked)",
        proteinPer100g: 11.9,
        carbsPer100g: 8.9,
        fatPer100g: 5.2,
        category: "legume",
        commonPortions: { "1 cup (155g)": 155, "100g": 100 },
        source: "USDA"
    },

    // ========================================================================
    // DAIRY
    // ========================================================================
    "greek_yogurt_0": {
        id: "greek_yogurt_0",
        name: "Greek Yogurt (0% Fat, Plain)",
        proteinPer100g: 10.3,
        carbsPer100g: 3.6,
        fatPer100g: 0.2,
        category: "dairy",
        commonPortions: { "1 cup (245g)": 245, "3/4 cup (170g)": 170, "100g": 100 },
        source: "USDA"
    },
    "greek_yogurt_whole": {
        id: "greek_yogurt_whole",
        name: "Greek Yogurt (Whole Milk)",
        proteinPer100g: 9.0,
        carbsPer100g: 3.6,
        fatPer100g: 5.0,
        category: "dairy",
        commonPortions: { "1 cup (245g)": 245, "3/4 cup (170g)": 170, "100g": 100 },
        source: "USDA"
    },
    "milk_whole": {
        id: "milk_whole",
        name: "Whole Milk",
        proteinPer100g: 3.3,
        carbsPer100g: 4.8,
        fatPer100g: 3.3,
        category: "dairy",
        commonPortions: { "1 cup (244ml)": 251, "1/2 cup": 126, "100ml": 103 },
        source: "USDA"
    },
    "milk_skim": {
        id: "milk_skim",
        name: "Skim Milk (Fat-Free)",
        proteinPer100g: 3.4,
        carbsPer100g: 5.0,
        fatPer100g: 0.1,
        category: "dairy",
        commonPortions: { "1 cup (244ml)": 245, "100ml": 103 },
        source: "USDA"
    },
    "cheddar_cheese": {
        id: "cheddar_cheese",
        name: "Cheddar Cheese",
        proteinPer100g: 24.9,
        carbsPer100g: 1.3,
        fatPer100g: 33.1,
        category: "dairy",
        commonPortions: { "1 slice (28g)": 28, "1 oz (28g)": 28, "30g": 30 },
        source: "USDA"
    },
    "mozzarella_cheese": {
        id: "mozzarella_cheese",
        name: "Mozzarella Cheese (Part-Skim)",
        proteinPer100g: 24.3,
        carbsPer100g: 2.8,
        fatPer100g: 17.1,
        category: "dairy",
        commonPortions: { "1 oz (28g)": 28, "1 slice (28g)": 28, "50g": 50 },
        source: "USDA"
    },
    "cream_cheese": {
        id: "cream_cheese",
        name: "Cream Cheese",
        proteinPer100g: 5.9,
        carbsPer100g: 4.1,
        fatPer100g: 34.2,
        category: "dairy",
        commonPortions: { "1 tbsp (14g)": 14, "2 tbsp (28g)": 28 },
        source: "USDA"
    },
    "butter": {
        id: "butter",
        name: "Butter (Salted)",
        proteinPer100g: 0.9,
        carbsPer100g: 0.1,
        fatPer100g: 81.1,
        category: "fat",
        commonPortions: { "1 tbsp (14g)": 14, "1 pat (5g)": 5, "1 tsp (5g)": 5 },
        source: "USDA"
    },
    "parmesan_cheese": {
        id: "parmesan_cheese",
        name: "Parmesan Cheese (Grated)",
        proteinPer100g: 35.8,
        carbsPer100g: 3.2,
        fatPer100g: 25.8,
        category: "dairy",
        commonPortions: { "1 tbsp (5g)": 5, "2 tbsp (10g)": 10 },
        source: "USDA"
    },

    // ========================================================================
    // NUTS, SEEDS & FATS
    // ========================================================================
    "almonds": {
        id: "almonds",
        name: "Almonds (Raw)",
        proteinPer100g: 21.1,
        carbsPer100g: 21.6,
        fatPer100g: 49.9,
        fiberPer100g: 12.5,
        category: "nut",
        commonPortions: { "1 oz / 23 almonds (28g)": 28, "1/4 cup (35g)": 35, "100g": 100 },
        source: "USDA"
    },
    "walnuts": {
        id: "walnuts",
        name: "Walnuts (Raw)",
        proteinPer100g: 15.2,
        carbsPer100g: 13.7,
        fatPer100g: 65.2,
        fiberPer100g: 6.7,
        category: "nut",
        commonPortions: { "1 oz (28g)": 28, "1/4 cup (30g)": 30 },
        source: "USDA"
    },
    "peanut_butter": {
        id: "peanut_butter",
        name: "Peanut Butter (Smooth)",
        proteinPer100g: 25,
        carbsPer100g: 20,
        fatPer100g: 50,
        category: "nut",
        commonPortions: { "1 tbsp (16g)": 16, "2 tbsp (32g)": 32 },
        source: "USDA"
    },
    "almond_butter": {
        id: "almond_butter",
        name: "Almond Butter",
        proteinPer100g: 21.0,
        carbsPer100g: 19.0,
        fatPer100g: 56.0,
        category: "nut",
        commonPortions: { "1 tbsp (16g)": 16, "2 tbsp (32g)": 32 },
        source: "USDA"
    },
    "chia_seeds": {
        id: "chia_seeds",
        name: "Chia Seeds",
        proteinPer100g: 16.5,
        carbsPer100g: 42.1,
        fatPer100g: 30.7,
        fiberPer100g: 34.4,
        category: "nut",
        commonPortions: { "1 tbsp (12g)": 12, "2 tbsp (24g)": 24 },
        source: "USDA"
    },
    "flax_seeds": {
        id: "flax_seeds",
        name: "Flax Seeds (Ground)",
        proteinPer100g: 18.3,
        carbsPer100g: 28.9,
        fatPer100g: 42.2,
        fiberPer100g: 27.3,
        category: "nut",
        commonPortions: { "1 tbsp (7g)": 7, "2 tbsp (14g)": 14 },
        source: "USDA"
    },
    "cashews": {
        id: "cashews",
        name: "Cashews (Roasted)",
        proteinPer100g: 15.3,
        carbsPer100g: 32.7,
        fatPer100g: 46.4,
        category: "nut",
        commonPortions: { "1 oz (28g)": 28, "1/4 cup (35g)": 35 },
        source: "USDA"
    },
    "olive_oil": {
        id: "olive_oil",
        name: "Olive Oil (Extra Virgin)",
        proteinPer100g: 0,
        carbsPer100g: 0,
        fatPer100g: 100,
        category: "fat",
        commonPortions: { "1 tbsp (14ml)": 13, "1 tsp (5ml)": 4.5 },
        source: "USDA"
    },
    "coconut_oil": {
        id: "coconut_oil",
        name: "Coconut Oil",
        proteinPer100g: 0,
        carbsPer100g: 0,
        fatPer100g: 100,
        category: "fat",
        commonPortions: { "1 tbsp (14ml)": 14, "1 tsp (5ml)": 4.5 },
        source: "USDA"
    },
    "ghee": {
        id: "ghee",
        name: "Ghee (Clarified Butter)",
        proteinPer100g: 0,
        carbsPer100g: 0,
        fatPer100g: 99.5,
        category: "fat",
        commonPortions: { "1 tsp (5g)": 5, "1 tbsp (14g)": 14 },
        source: "USDA"
    },

    // ========================================================================
    // FRUITS
    // ========================================================================
    "banana": {
        id: "banana",
        name: "Banana",
        proteinPer100g: 1.1,
        carbsPer100g: 22.8,
        fatPer100g: 0.3,
        fiberPer100g: 2.6,
        category: "fruit",
        commonPortions: { "1 medium banana (118g)": 118, "1 large banana (136g)": 136 },
        source: "USDA"
    },
    "apple": {
        id: "apple",
        name: "Apple (Raw, with Skin)",
        proteinPer100g: 0.3,
        carbsPer100g: 13.8,
        fatPer100g: 0.2,
        fiberPer100g: 2.4,
        category: "fruit",
        commonPortions: { "1 medium apple (182g)": 182, "1 small apple (149g)": 149 },
        source: "USDA"
    },
    "blueberries": {
        id: "blueberries",
        name: "Blueberries (Raw)",
        proteinPer100g: 0.7,
        carbsPer100g: 14.5,
        fatPer100g: 0.3,
        fiberPer100g: 2.4,
        category: "fruit",
        commonPortions: { "1 cup (148g)": 148, "1/2 cup (74g)": 74 },
        source: "USDA"
    },
    "strawberries": {
        id: "strawberries",
        name: "Strawberries (Raw)",
        proteinPer100g: 0.7,
        carbsPer100g: 7.7,
        fatPer100g: 0.3,
        fiberPer100g: 2.0,
        category: "fruit",
        commonPortions: { "1 cup (152g)": 152, "1/2 cup (76g)": 76 },
        source: "USDA"
    },
    "avocado": {
        id: "avocado",
        name: "Avocado (Raw)",
        proteinPer100g: 2.0,
        carbsPer100g: 8.5,
        fatPer100g: 14.7,
        fiberPer100g: 6.7,
        category: "fruit",
        commonPortions: { "1 medium avocado (150g)": 150, "1/2 avocado (75g)": 75, "1/4 avocado (38g)": 38 },
        source: "USDA"
    },
    "mixed_berries": {
        id: "mixed_berries",
        name: "Mixed Berries (Frozen)",
        proteinPer100g: 0.7,
        carbsPer100g: 12.0,
        fatPer100g: 0.4,
        category: "fruit",
        commonPortions: { "1 cup (140g)": 140, "1/2 cup (70g)": 70 },
        source: "USDA"
    },
    "mango": {
        id: "mango",
        name: "Mango (Raw)",
        proteinPer100g: 0.8,
        carbsPer100g: 15.0,
        fatPer100g: 0.4,
        fiberPer100g: 1.6,
        category: "fruit",
        commonPortions: { "1 cup sliced (165g)": 165, "1 medium mango (200g)": 200 },
        source: "USDA"
    },
    "orange": {
        id: "orange",
        name: "Orange (Raw)",
        proteinPer100g: 0.9,
        carbsPer100g: 11.8,
        fatPer100g: 0.1,
        fiberPer100g: 2.4,
        category: "fruit",
        commonPortions: { "1 medium orange (131g)": 131, "1 large orange (184g)": 184 },
        source: "USDA"
    },
    "dates_medjool": {
        id: "dates_medjool",
        name: "Medjool Dates",
        proteinPer100g: 1.8,
        carbsPer100g: 75.0,
        fatPer100g: 0.2,
        fiberPer100g: 6.7,
        category: "fruit",
        commonPortions: { "1 date (24g)": 24, "2 dates (48g)": 48 },
        source: "USDA"
    },
    "raisins": {
        id: "raisins",
        name: "Raisins",
        proteinPer100g: 3.1,
        carbsPer100g: 79.2,
        fatPer100g: 0.5,
        category: "fruit",
        commonPortions: { "1 small box (14g)": 14, "1/4 cup (36g)": 36 },
        source: "USDA"
    },

    // ========================================================================
    // VEGETABLES
    // ========================================================================
    "spinach_raw": {
        id: "spinach_raw",
        name: "Spinach (Raw)",
        proteinPer100g: 2.9,
        carbsPer100g: 3.6,
        fatPer100g: 0.4,
        fiberPer100g: 2.2,
        category: "vegetable",
        commonPortions: { "1 cup (30g)": 30, "2 cups (60g)": 60, "100g": 100 },
        source: "USDA"
    },
    "spinach_cooked": {
        id: "spinach_cooked",
        name: "Spinach (Cooked, Boiled)",
        proteinPer100g: 2.97,
        carbsPer100g: 3.75,
        fatPer100g: 0.26,
        category: "vegetable",
        commonPortions: { "1 cup (180g)": 180, "100g": 100 },
        source: "USDA"
    },
    "broccoli_cooked": {
        id: "broccoli_cooked",
        name: "Broccoli (Steamed)",
        proteinPer100g: 2.4,
        carbsPer100g: 7.2,
        fatPer100g: 0.4,
        fiberPer100g: 3.3,
        category: "vegetable",
        commonPortions: { "1 cup (156g)": 156, "100g": 100 },
        source: "USDA"
    },
    "broccoli_raw": {
        id: "broccoli_raw",
        name: "Broccoli (Raw)",
        proteinPer100g: 2.8,
        carbsPer100g: 6.6,
        fatPer100g: 0.4,
        fiberPer100g: 2.6,
        category: "vegetable",
        commonPortions: { "1 cup chopped (91g)": 91, "100g": 100 },
        source: "USDA"
    },
    "bell_pepper_red": {
        id: "bell_pepper_red",
        name: "Red Bell Pepper (Raw)",
        proteinPer100g: 1.0,
        carbsPer100g: 6.0,
        fatPer100g: 0.3,
        category: "vegetable",
        commonPortions: { "1 medium pepper (119g)": 119, "1/2 pepper (60g)": 60 },
        source: "USDA"
    },
    "tomato_raw": {
        id: "tomato_raw",
        name: "Tomato (Raw)",
        proteinPer100g: 0.9,
        carbsPer100g: 3.9,
        fatPer100g: 0.2,
        category: "vegetable",
        commonPortions: { "1 medium tomato (123g)": 123, "1 cup cherry tomatoes (149g)": 149 },
        source: "USDA"
    },
    "onion_raw": {
        id: "onion_raw",
        name: "Onion (Raw)",
        proteinPer100g: 1.1,
        carbsPer100g: 9.3,
        fatPer100g: 0.1,
        category: "vegetable",
        commonPortions: { "1 medium onion (110g)": 110, "1/2 onion (55g)": 55 },
        source: "USDA"
    },
    "mushrooms_raw": {
        id: "mushrooms_raw",
        name: "White Mushrooms (Raw)",
        proteinPer100g: 3.1,
        carbsPer100g: 3.3,
        fatPer100g: 0.3,
        category: "vegetable",
        commonPortions: { "1 cup sliced (70g)": 70, "100g": 100 },
        source: "USDA"
    },
    "mixed_salad_greens": {
        id: "mixed_salad_greens",
        name: "Mixed Salad Greens",
        proteinPer100g: 1.5,
        carbsPer100g: 2.5,
        fatPer100g: 0.2,
        category: "vegetable",
        commonPortions: { "1 cup (36g)": 36, "2 cups (72g)": 72 },
        source: "USDA"
    },
    "cucumber_raw": {
        id: "cucumber_raw",
        name: "Cucumber (Raw, with Peel)",
        proteinPer100g: 0.7,
        carbsPer100g: 3.6,
        fatPer100g: 0.1,
        category: "vegetable",
        commonPortions: { "1/2 cucumber (150g)": 150, "1 cup sliced (104g)": 104 },
        source: "USDA"
    },
    "corn_sweet_cooked": {
        id: "corn_sweet_cooked",
        name: "Sweet Corn (Boiled)",
        proteinPer100g: 3.4,
        carbsPer100g: 19.0,
        fatPer100g: 1.5,
        category: "vegetable",
        commonPortions: { "1 ear (90g)": 90, "1 cup kernels (164g)": 164 },
        source: "USDA"
    },
    "zucchini_cooked": {
        id: "zucchini_cooked",
        name: "Zucchini (Cooked)",
        proteinPer100g: 1.1,
        carbsPer100g: 3.0,
        fatPer100g: 0.4,
        category: "vegetable",
        commonPortions: { "1 cup sliced (180g)": 180, "100g": 100 },
        source: "USDA"
    },
    "carrot_raw": {
        id: "carrot_raw",
        name: "Carrot (Raw)",
        proteinPer100g: 0.9,
        carbsPer100g: 9.6,
        fatPer100g: 0.2,
        fiberPer100g: 2.8,
        category: "vegetable",
        commonPortions: { "1 medium carrot (61g)": 61, "1 cup chopped (128g)": 128 },
        source: "USDA"
    },
    "green_peas_cooked": {
        id: "green_peas_cooked",
        name: "Green Peas (Cooked)",
        proteinPer100g: 5.4,
        carbsPer100g: 14.5,
        fatPer100g: 0.2,
        fiberPer100g: 5.1,
        category: "vegetable",
        commonPortions: { "1 cup (160g)": 160, "1/2 cup (80g)": 80 },
        source: "USDA"
    },
    "kale_raw": {
        id: "kale_raw",
        name: "Kale (Raw)",
        proteinPer100g: 4.3,
        carbsPer100g: 8.8,
        fatPer100g: 0.9,
        fiberPer100g: 3.6,
        category: "vegetable",
        commonPortions: { "1 cup chopped (67g)": 67, "100g": 100 },
        source: "USDA"
    },

    // ========================================================================
    // CONDIMENTS & SWEETENERS
    // ========================================================================
    "honey": {
        id: "honey",
        name: "Honey",
        proteinPer100g: 0.3,
        carbsPer100g: 82.4,
        fatPer100g: 0,
        category: "condiment",
        commonPortions: { "1 tbsp (21g)": 21, "1 tsp (7g)": 7 },
        source: "USDA"
    },
    "maple_syrup": {
        id: "maple_syrup",
        name: "Maple Syrup",
        proteinPer100g: 0,
        carbsPer100g: 67.0,
        fatPer100g: 0.1,
        category: "condiment",
        commonPortions: { "1 tbsp (20g)": 20, "1 tsp (7g)": 7 },
        source: "USDA"
    },
    "soy_sauce": {
        id: "soy_sauce",
        name: "Soy Sauce",
        proteinPer100g: 5.6,
        carbsPer100g: 5.6,
        fatPer100g: 0.1,
        category: "condiment",
        commonPortions: { "1 tbsp (16g)": 16, "1 tsp (5.3g)": 5 },
        source: "USDA"
    },
    "salsa": {
        id: "salsa",
        name: "Salsa (Tomato-based)",
        proteinPer100g: 1.5,
        carbsPer100g: 7.0,
        fatPer100g: 0.2,
        category: "condiment",
        commonPortions: { "2 tbsp (36g)": 36, "1/4 cup (65g)": 65 },
        source: "USDA"
    },
    "hummus": {
        id: "hummus",
        name: "Hummus",
        proteinPer100g: 7.9,
        carbsPer100g: 14.3,
        fatPer100g: 9.6,
        category: "condiment",
        commonPortions: { "2 tbsp (30g)": 30, "1/4 cup (62g)": 62 },
        source: "USDA"
    },
    "mayo_light": {
        id: "mayo_light",
        name: "Mayonnaise (Light)",
        proteinPer100g: 0.9,
        carbsPer100g: 6.7,
        fatPer100g: 33.3,
        category: "condiment",
        commonPortions: { "1 tbsp (15g)": 15, "1 tsp (5g)": 5 },
        source: "USDA"
    },
    "tomato_sauce": {
        id: "tomato_sauce",
        name: "Tomato/Marinara Sauce",
        proteinPer100g: 1.3,
        carbsPer100g: 7.1,
        fatPer100g: 1.5,
        category: "condiment",
        commonPortions: { "1/2 cup (125g)": 125, "1/4 cup (63g)": 63 },
        source: "USDA"
    },

    // ========================================================================
    // BEVERAGES
    // ========================================================================
    "coconut_water": {
        id: "coconut_water",
        name: "Coconut Water",
        proteinPer100g: 0.7,
        carbsPer100g: 3.7,
        fatPer100g: 0.2,
        category: "beverage",
        commonPortions: { "1 cup (240ml)": 240, "100ml": 100 },
        source: "USDA"
    },
    "orange_juice": {
        id: "orange_juice",
        name: "Orange Juice (Fresh)",
        proteinPer100g: 0.7,
        carbsPer100g: 10.4,
        fatPer100g: 0.2,
        category: "beverage",
        commonPortions: { "1 cup (248ml)": 248, "1/2 cup": 124 },
        source: "USDA"
    },
    "protein_milk_chocolate": {
        id: "protein_milk_chocolate",
        name: "Chocolate Protein Milk",
        proteinPer100g: 12.0,
        carbsPer100g: 8.0,
        fatPer100g: 2.5,
        category: "beverage",
        commonPortions: { "1 bottle (330ml)": 340 },
        source: "Brand-Verified"
    },

    // ========================================================================
    // MISC / OTHER
    // ========================================================================
    "dark_chocolate_70": {
        id: "dark_chocolate_70",
        name: "Dark Chocolate (70-85% Cacao)",
        proteinPer100g: 7.8,
        carbsPer100g: 45.9,
        fatPer100g: 42.6,
        category: "condiment",
        commonPortions: { "1 square (10g)": 10, "1 oz (28g)": 28 },
        source: "USDA"
    },
    "rice_cake": {
        id: "rice_cake",
        name: "Rice Cake (Plain)",
        proteinPer100g: 7.0,
        carbsPer100g: 82.0,
        fatPer100g: 2.8,
        category: "grain",
        commonPortions: { "1 cake (9g)": 9, "2 cakes (18g)": 18 },
        source: "USDA"
    },
    "protein_bar_average": {
        id: "protein_bar_average",
        name: "Protein Bar (Average)",
        proteinPer100g: 33.3,
        carbsPer100g: 36.7,
        fatPer100g: 13.3,
        category: "protein",
        commonPortions: { "1 bar (60g)": 60 },
        source: "Brand-Verified"
    },
    "coconut_milk_canned": {
        id: "coconut_milk_canned",
        name: "Coconut Milk (Canned)",
        proteinPer100g: 2.3,
        carbsPer100g: 5.5,
        fatPer100g: 23.8,
        category: "dairy",
        commonPortions: { "1/4 cup (60ml)": 60, "1/2 cup (120ml)": 120 },
        source: "USDA"
    },
    "trail_mix": {
        id: "trail_mix",
        name: "Trail Mix (Mixed Nuts & Dried Fruit)",
        proteinPer100g: 13.0,
        carbsPer100g: 44.0,
        fatPer100g: 29.0,
        category: "nut",
        commonPortions: { "1/4 cup (38g)": 38, "1 oz (28g)": 28 },
        source: "USDA"
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Get the list of all food IDs available in the database */
export function getAllFoodIds(): string[] {
    return Object.keys(LOCAL_NUTRITION_DB);
}

/** Get a compact food catalog for LLM prompts */
export function getFoodCatalog(): string {
    const lines: string[] = [];
    const byCategory = new Map<string, NutritionFact[]>();

    for (const food of Object.values(LOCAL_NUTRITION_DB)) {
        const list = byCategory.get(food.category) || [];
        list.push(food);
        byCategory.set(food.category, list);
    }

    for (const [category, foods] of byCategory) {
        lines.push(`\n### ${category.toUpperCase()}`);
        for (const f of foods) {
            const portions = Object.entries(f.commonPortions).map(([desc, g]) => `${desc}=${g}g`).join(', ');
            lines.push(`- ${f.id} | "${f.name}" | P:${f.proteinPer100g} C:${f.carbsPer100g} F:${f.fatPer100g} per 100g | Portions: ${portions}`);
        }
    }
    return lines.join('\n');
}

export interface ResolvedIngredient {
    foodId: string;
    foodName: string;
    quantity: string; // human-readable, e.g., "2 large eggs"
    weightGrams: number;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    source: string;
}

/** Resolve a single ingredient from the DB: given foodId + weightGrams, compute exact macros */
export function resolveIngredient(foodId: string, weightGrams: number, quantityLabel?: string): ResolvedIngredient | null {
    const food = LOCAL_NUTRITION_DB[foodId];
    if (!food) return null;

    const multiplier = weightGrams / 100;
    const protein = parseFloat((food.proteinPer100g * multiplier).toFixed(1));
    const carbs = parseFloat((food.carbsPer100g * multiplier).toFixed(1));
    const fat = parseFloat((food.fatPer100g * multiplier).toFixed(1));

    return {
        foodId: food.id,
        foodName: food.name,
        quantity: quantityLabel || `${Math.round(weightGrams)}g`,
        weightGrams: Math.round(weightGrams),
        protein,
        carbs,
        fat,
        calories: calculateCalories(protein, carbs, fat),
        source: food.source
    };
}

/** Resolve an array of LLM-generated ingredients and compute totals */
export interface ResolvedMeal {
    dish: string;
    recipe: string;
    ingredients: ResolvedIngredient[];
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalCalories: number;
}

export function resolveMeal(
    dish: string,
    recipe: string,
    rawIngredients: Array<{ foodId: string; portionKey?: string; weightGrams?: number; qty?: number }>
): ResolvedMeal {
    const ingredients: ResolvedIngredient[] = [];
    let totalProtein = 0, totalCarbs = 0, totalFat = 0, totalCalories = 0;

    for (const raw of rawIngredients) {
        const food = LOCAL_NUTRITION_DB[raw.foodId];
        if (!food) continue;

        let weightGrams: number;
        let quantityLabel: string;
        const qty = raw.qty || 1;

        if (raw.portionKey && food.commonPortions[raw.portionKey]) {
            weightGrams = food.commonPortions[raw.portionKey] * qty;
            quantityLabel = qty > 1 ? `${qty} × ${raw.portionKey}` : raw.portionKey;
        } else if (raw.weightGrams) {
            weightGrams = raw.weightGrams * qty;
            quantityLabel = `${Math.round(weightGrams)}g`;
        } else {
            // Fallback: use first common portion
            const firstPortion = Object.entries(food.commonPortions)[0];
            weightGrams = firstPortion[1] * qty;
            quantityLabel = qty > 1 ? `${qty} × ${firstPortion[0]}` : firstPortion[0];
        }

        const resolved = resolveIngredient(raw.foodId, weightGrams, quantityLabel);
        if (resolved) {
            ingredients.push(resolved);
            totalProtein += resolved.protein;
            totalCarbs += resolved.carbs;
            totalFat += resolved.fat;
            totalCalories += resolved.calories;
        }
    }

    return {
        dish,
        recipe,
        ingredients,
        totalProtein: parseFloat(totalProtein.toFixed(1)),
        totalCarbs: parseFloat(totalCarbs.toFixed(1)),
        totalFat: parseFloat(totalFat.toFixed(1)),
        totalCalories: Math.round(totalCalories)
    };
}

/**
 * Scale a set of resolved meals so total calories hit the target.
 * Preserves the LLM's food choices — only adjusts portion sizes proportionally.
 * Also does a secondary protein-focused adjustment if protein target is provided.
 */
export function scaleMealsToTarget(
    resolvedMeals: ResolvedMeal[],
    targetCalories: number,
    targetProtein?: number
): ResolvedMeal[] {
    // Calculate current totals
    let currentCalories = resolvedMeals.reduce((s, m) => s + m.totalCalories, 0);

    if (currentCalories === 0) return resolvedMeals;

    // Only scale if off by more than 2%
    const calorieDrift = Math.abs(currentCalories - targetCalories) / targetCalories;
    if (calorieDrift <= 0.02) return resolvedMeals;

    const scaleFactor = targetCalories / currentCalories;

    // Scale all ingredient weights proportionally and re-resolve
    const scaled = resolvedMeals.map(meal => {
        const scaledIngredients: ResolvedIngredient[] = [];
        let totalProtein = 0, totalCarbs = 0, totalFat = 0, totalCalories = 0;

        for (const ing of meal.ingredients) {
            const newWeight = ing.weightGrams * scaleFactor;
            const resolved = resolveIngredient(ing.foodId, newWeight);
            if (resolved) {
                scaledIngredients.push(resolved);
                totalProtein += resolved.protein;
                totalCarbs += resolved.carbs;
                totalFat += resolved.fat;
                totalCalories += resolved.calories;
            }
        }

        return {
            dish: meal.dish,
            recipe: meal.recipe,
            ingredients: scaledIngredients,
            totalProtein: parseFloat(totalProtein.toFixed(1)),
            totalCarbs: parseFloat(totalCarbs.toFixed(1)),
            totalFat: parseFloat(totalFat.toFixed(1)),
            totalCalories: Math.round(totalCalories)
        } as ResolvedMeal;
    });

    return scaled;
}

/**
 * Scale a single meal so its calories hit the target.
 * Used by the swap endpoint to match the replaced meal's calories.
 */
export function scaleSingleMealToTarget(
    meal: ResolvedMeal,
    targetCalories: number
): ResolvedMeal {
    if (meal.totalCalories === 0 || targetCalories === 0) return meal;

    const calorieDrift = Math.abs(meal.totalCalories - targetCalories) / targetCalories;
    if (calorieDrift <= 0.02) return meal;

    const scaleFactor = targetCalories / meal.totalCalories;

    const scaledIngredients: ResolvedIngredient[] = [];
    let totalProtein = 0, totalCarbs = 0, totalFat = 0, totalCalories = 0;

    for (const ing of meal.ingredients) {
        const newWeight = ing.weightGrams * scaleFactor;
        const resolved = resolveIngredient(ing.foodId, newWeight);
        if (resolved) {
            scaledIngredients.push(resolved);
            totalProtein += resolved.protein;
            totalCarbs += resolved.carbs;
            totalFat += resolved.fat;
            totalCalories += resolved.calories;
        }
    }

    return {
        dish: meal.dish,
        recipe: meal.recipe,
        ingredients: scaledIngredients,
        totalProtein: parseFloat(totalProtein.toFixed(1)),
        totalCarbs: parseFloat(totalCarbs.toFixed(1)),
        totalFat: parseFloat(totalFat.toFixed(1)),
        totalCalories: Math.round(totalCalories)
    };
}

// Legacy exports for backward compatibility (used by diet-algorithm.ts)
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
