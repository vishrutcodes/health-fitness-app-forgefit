export interface NutritionFact {
    id: string;
    name: string;
    aliases?: string[];
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    fiberPer100g?: number;
    sugarPer100g?: number;
    sodiumMg?: number;
    cholesterolMg?: number;
    vitaminA_mcg?: number;
    vitaminC_mg?: number;
    ironMg?: number;
    calciumMg?: number;
    category: 'protein' | 'carbs' | 'fat' | 'dairy' | 'fruit' | 'vegetable' | 'condiment' | 'grain' | 'legume' | 'nut' | 'beverage' | 'dessert' | 'prepared' | 'snack';
    commonPortions: Record<string, number>;
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
        aliases: ["grilled chicken", "chicken breast", "chicken fillet"],
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
        aliases: ["chicken breast"],
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
        aliases: ["chicken thigh"],
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
        aliases: ["ground turkey"],
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
        aliases: ["egg", "boiled egg", "scrambled egg", "fried egg", "omelette", "omelet"],
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
        aliases: ["egg white"],
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
        aliases: ["salmon fillet", "grilled salmon", "baked salmon"],
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
        aliases: ["salmon"],
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
        aliases: ["tuna"],
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
        aliases: ["shrimp"],
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
        aliases: ["beef mince"],
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
        aliases: ["beef sirloin steak"],
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
        aliases: ["whey protein isolate"],
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
        aliases: ["tofu"],
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
        aliases: ["cottage cheese indian", "panir"],
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
        aliases: ["soya chunks"],
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
        aliases: ["cottage cheese"],
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
        aliases: ["rice", "steamed rice", "plain rice", "basmati rice"],
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
        aliases: ["brown rice"],
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
        aliases: ["rolled oats"],
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
        aliases: ["whole wheat bread"],
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
        aliases: ["white bread"],
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
        aliases: ["spaghetti", "penne", "macaroni", "fettuccine", "linguine", "noodles"],
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
        aliases: ["quinoa"],
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
        aliases: ["sweet potato"],
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
        aliases: ["potato"],
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
        aliases: ["whole wheat tortilla"],
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
        aliases: ["granola"],
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
        aliases: ["corn tortilla"],
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
        aliases: ["bagel"],
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
        aliases: ["lentils"],
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
        aliases: ["chickpeas"],
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
        aliases: ["black beans"],
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
        aliases: ["kidney beans"],
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
        aliases: ["edamame"],
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
        aliases: ["greek yogurt"],
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
        aliases: ["greek yogurt"],
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
        aliases: ["whole milk"],
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
        aliases: ["skim milk"],
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
        aliases: ["cheddar cheese"],
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
        aliases: ["mozzarella cheese"],
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
        aliases: ["cream cheese"],
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
        aliases: ["butter"],
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
        aliases: ["parmesan cheese"],
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
        aliases: ["almonds"],
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
        aliases: ["walnuts"],
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
        aliases: ["peanut butter"],
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
        aliases: ["almond butter"],
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
        aliases: ["chia seeds"],
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
        aliases: ["flax seeds"],
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
        aliases: ["cashews"],
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
        aliases: ["olive oil"],
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
        aliases: ["coconut oil"],
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
        aliases: ["ghee"],
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
        aliases: ["plantain", "bananas"],
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
        aliases: ["apple"],
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
        aliases: ["blueberries"],
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
        aliases: ["strawberries"],
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
        aliases: ["avocado"],
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
        aliases: ["mixed berries"],
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
        aliases: ["mango"],
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
        aliases: ["orange"],
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
        aliases: ["medjool dates"],
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
        aliases: ["raisins"],
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
        aliases: ["spinach"],
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
        aliases: ["spinach"],
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
        aliases: ["broccoli"],
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
        aliases: ["broccoli"],
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
        aliases: ["red bell pepper"],
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
        aliases: ["tomato"],
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
        aliases: ["onion"],
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
        aliases: ["white mushrooms"],
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
        aliases: ["mixed salad greens"],
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
        aliases: ["cucumber"],
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
        aliases: ["sweet corn"],
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
        aliases: ["zucchini"],
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
        aliases: ["carrot"],
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
        aliases: ["green peas"],
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
        aliases: ["kale"],
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
        aliases: ["honey"],
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
        aliases: ["maple syrup"],
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
        aliases: ["soy sauce"],
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
        aliases: ["salsa"],
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
        aliases: ["houmous", "humus", "hommus"],
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
        aliases: ["mayonnaise"],
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
        aliases: ["tomato/marinara sauce"],
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
        aliases: ["coconut water"],
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
        aliases: ["orange juice"],
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
        aliases: ["chocolate protein milk"],
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
        aliases: ["dark chocolate"],
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
        aliases: ["rice cake"],
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
        aliases: ["protein bar"],
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
        aliases: ["coconut milk"],
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
        aliases: ["trail mix"],
        proteinPer100g: 13.0,
        carbsPer100g: 44.0,
        fatPer100g: 29.0,
        category: "nut",
        commonPortions: { "1/4 cup (38g)": 38, "1 oz (28g)": 28 },
        source: "USDA"
    },

    // ========================================================================
    // INDIAN CUISINE
    // ========================================================================
    "roti": {
        id: "roti",
        name: "Roti (Chapati, Whole Wheat)",
        aliases: ["chapati", "chapatti", "flatbread", "phulka", "rotli"],
        proteinPer100g: 8.7,
        carbsPer100g: 50.0,
        fatPer100g: 3.7,
        fiberPer100g: 4.0,
        category: "grain",
        commonPortions: { "1 roti (40g)": 40, "2 rotis (80g)": 80 },
        source: "USDA"
    },
    "naan": {
        id: "naan",
        name: "Naan Bread",
        aliases: ["naan bread"],
        proteinPer100g: 9.1,
        carbsPer100g: 50.7,
        fatPer100g: 3.3,
        category: "grain",
        commonPortions: { "1 naan (90g)": 90, "1/2 naan (45g)": 45 },
        source: "USDA"
    },
    "paratha": {
        id: "paratha",
        name: "Paratha (Plain, Pan-Fried)",
        aliases: ["paratha"],
        proteinPer100g: 7.5,
        carbsPer100g: 45.0,
        fatPer100g: 10.0,
        category: "grain",
        commonPortions: { "1 paratha (80g)": 80, "2 parathas (160g)": 160 },
        source: "Nutritionix"
    },
    "dal_cooked": {
        id: "dal_cooked",
        name: "Dal (Lentil Curry, Cooked)",
        aliases: ["dal"],
        proteinPer100g: 5.1,
        carbsPer100g: 10.0,
        fatPer100g: 2.7,
        fiberPer100g: 3.5,
        category: "legume",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "USDA"
    },
    "rajma_cooked": {
        id: "rajma_cooked",
        name: "Rajma (Kidney Bean Curry)",
        aliases: ["rajma"],
        proteinPer100g: 5.5,
        carbsPer100g: 13.0,
        fatPer100g: 2.5,
        category: "legume",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "chole_cooked": {
        id: "chole_cooked",
        name: "Chole (Chickpea Curry)",
        aliases: ["chole"],
        proteinPer100g: 5.3,
        carbsPer100g: 15.0,
        fatPer100g: 3.5,
        category: "legume",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "chicken_curry": {
        id: "chicken_curry",
        name: "Chicken Curry (Indian Style)",
        aliases: ["chicken curry"],
        proteinPer100g: 14.0,
        carbsPer100g: 4.5,
        fatPer100g: 8.0,
        category: "protein",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "biryani_chicken": {
        id: "biryani_chicken",
        name: "Chicken Biryani",
        aliases: ["chicken biryani"],
        proteinPer100g: 8.5,
        carbsPer100g: 22.0,
        fatPer100g: 5.5,
        category: "grain",
        commonPortions: { "1 plate (300g)": 300, "1/2 plate (150g)": 150 },
        source: "Nutritionix"
    },
    "idli": {
        id: "idli",
        name: "Idli (Steamed Rice Cake)",
        aliases: ["idli"],
        proteinPer100g: 3.9,
        carbsPer100g: 26.0,
        fatPer100g: 0.4,
        category: "grain",
        commonPortions: { "1 idli (40g)": 40, "2 idlis (80g)": 80, "3 idlis (120g)": 120 },
        source: "USDA"
    },
    "dosa_plain": {
        id: "dosa_plain",
        name: "Dosa (Plain)",
        aliases: ["dosa"],
        proteinPer100g: 4.0,
        carbsPer100g: 30.0,
        fatPer100g: 5.0,
        category: "grain",
        commonPortions: { "1 dosa (100g)": 100, "1 masala dosa (150g)": 150 },
        source: "Nutritionix"
    },
    "samosa": {
        id: "samosa",
        name: "Samosa (Fried, Potato Filling)",
        aliases: ["samosa"],
        proteinPer100g: 4.5,
        carbsPer100g: 32.0,
        fatPer100g: 18.0,
        category: "grain",
        commonPortions: { "1 samosa (80g)": 80, "2 samosas (160g)": 160 },
        source: "Nutritionix"
    },
    "upma": {
        id: "upma",
        name: "Upma (Semolina Porridge)",
        aliases: ["upma"],
        proteinPer100g: 3.5,
        carbsPer100g: 18.0,
        fatPer100g: 4.0,
        category: "grain",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "poha": {
        id: "poha",
        name: "Poha (Flattened Rice, Cooked)",
        aliases: ["poha"],
        proteinPer100g: 2.5,
        carbsPer100g: 22.0,
        fatPer100g: 3.5,
        category: "grain",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "palak_paneer": {
        id: "palak_paneer",
        name: "Palak Paneer (Spinach & Cottage Cheese)",
        aliases: ["palak paneer"],
        proteinPer100g: 6.5,
        carbsPer100g: 4.0,
        fatPer100g: 8.0,
        category: "protein",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "butter_chicken": {
        id: "butter_chicken",
        name: "Butter Chicken (Murgh Makhani)",
        aliases: ["butter chicken"],
        proteinPer100g: 12.0,
        carbsPer100g: 5.0,
        fatPer100g: 10.0,
        category: "protein",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "raita": {
        id: "raita",
        name: "Raita (Yogurt Condiment)",
        aliases: ["raita"],
        proteinPer100g: 3.0,
        carbsPer100g: 5.0,
        fatPer100g: 2.5,
        category: "dairy",
        commonPortions: { "1/2 cup (100g)": 100, "1/4 cup (50g)": 50 },
        source: "Nutritionix"
    },
    "puri": {
        id: "puri",
        name: "Puri (Deep Fried Bread)",
        aliases: ["puri"],
        proteinPer100g: 7.0,
        carbsPer100g: 40.0,
        fatPer100g: 20.0,
        category: "grain",
        commonPortions: { "1 puri (30g)": 30, "2 puris (60g)": 60 },
        source: "Nutritionix"
    },
    "khichdi": {
        id: "khichdi",
        name: "Khichdi (Rice & Lentil Porridge)",
        aliases: ["khichdi"],
        proteinPer100g: 3.5,
        carbsPer100g: 14.0,
        fatPer100g: 2.0,
        category: "grain",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "aloo_gobi": {
        id: "aloo_gobi",
        name: "Aloo Gobi (Potato & Cauliflower)",
        aliases: ["aloo gobi"],
        proteinPer100g: 2.5,
        carbsPer100g: 10.0,
        fatPer100g: 5.0,
        category: "vegetable",
        commonPortions: { "1 cup (200g)": 200, "1/2 cup (100g)": 100 },
        source: "Nutritionix"
    },
    "curd_plain": {
        id: "curd_plain",
        name: "Curd / Dahi (Plain Yogurt)",
        aliases: ["curd / dahi"],
        proteinPer100g: 3.5,
        carbsPer100g: 4.7,
        fatPer100g: 3.3,
        category: "dairy",
        commonPortions: { "1 cup (245g)": 245, "1/2 cup (122g)": 122 },
        source: "USDA"
    },

    // ========================================================================
    // MORE FRUITS
    // ========================================================================
    "watermelon": {
        id: "watermelon",
        name: "Watermelon",
        aliases: ["watermelon"],
        proteinPer100g: 0.6,
        carbsPer100g: 7.6,
        fatPer100g: 0.2,
        category: "fruit",
        commonPortions: { "1 cup diced (152g)": 152, "1 wedge (286g)": 286 },
        source: "USDA"
    },
    "grapes": {
        id: "grapes",
        name: "Grapes (Red/Green, Raw)",
        aliases: ["grapes"],
        proteinPer100g: 0.7,
        carbsPer100g: 18.1,
        fatPer100g: 0.2,
        category: "fruit",
        commonPortions: { "1 cup (151g)": 151, "10 grapes (50g)": 50 },
        source: "USDA"
    },
    "pineapple": {
        id: "pineapple",
        name: "Pineapple (Raw)",
        aliases: ["pineapple"],
        proteinPer100g: 0.5,
        carbsPer100g: 13.1,
        fatPer100g: 0.1,
        category: "fruit",
        commonPortions: { "1 cup chunks (165g)": 165, "1 slice (84g)": 84 },
        source: "USDA"
    },
    "papaya": {
        id: "papaya",
        name: "Papaya (Raw)",
        aliases: ["papaya"],
        proteinPer100g: 0.5,
        carbsPer100g: 10.8,
        fatPer100g: 0.3,
        category: "fruit",
        commonPortions: { "1 cup cubed (145g)": 145, "1 small papaya (157g)": 157 },
        source: "USDA"
    },
    "guava": {
        id: "guava",
        name: "Guava (Raw)",
        aliases: ["guava"],
        proteinPer100g: 2.6,
        carbsPer100g: 14.3,
        fatPer100g: 1.0,
        fiberPer100g: 5.4,
        category: "fruit",
        commonPortions: { "1 guava (55g)": 55, "1 cup (165g)": 165 },
        source: "USDA"
    },
    "pomegranate": {
        id: "pomegranate",
        name: "Pomegranate Seeds",
        aliases: ["pomegranate seeds"],
        proteinPer100g: 1.7,
        carbsPer100g: 18.7,
        fatPer100g: 1.2,
        fiberPer100g: 4.0,
        category: "fruit",
        commonPortions: { "1/2 cup (87g)": 87, "1 cup (174g)": 174 },
        source: "USDA"
    },
    "pear": {
        id: "pear",
        name: "Pear (Raw)",
        aliases: ["pear"],
        proteinPer100g: 0.4,
        carbsPer100g: 15.2,
        fatPer100g: 0.1,
        fiberPer100g: 3.1,
        category: "fruit",
        commonPortions: { "1 medium pear (178g)": 178, "100g": 100 },
        source: "USDA"
    },
    "kiwi": {
        id: "kiwi",
        name: "Kiwi (Raw)",
        aliases: ["kiwi"],
        proteinPer100g: 1.1,
        carbsPer100g: 14.7,
        fatPer100g: 0.5,
        fiberPer100g: 3.0,
        category: "fruit",
        commonPortions: { "1 kiwi (69g)": 69, "2 kiwis (138g)": 138 },
        source: "USDA"
    },
    "lychee": {
        id: "lychee",
        name: "Lychee (Raw)",
        aliases: ["lychee"],
        proteinPer100g: 0.8,
        carbsPer100g: 16.5,
        fatPer100g: 0.4,
        category: "fruit",
        commonPortions: { "1 cup (190g)": 190, "5 lychees (50g)": 50 },
        source: "USDA"
    },
    "coconut_fresh": {
        id: "coconut_fresh",
        name: "Coconut Meat (Fresh)",
        aliases: ["coconut meat"],
        proteinPer100g: 3.3,
        carbsPer100g: 15.2,
        fatPer100g: 33.5,
        fiberPer100g: 9.0,
        category: "fruit",
        commonPortions: { "1 cup shredded (80g)": 80, "1 piece (45g)": 45 },
        source: "USDA"
    },
    "chiku": {
        id: "chiku",
        name: "Chikoo / Sapodilla",
        aliases: ["chikoo / sapodilla"],
        proteinPer100g: 0.4,
        carbsPer100g: 20.0,
        fatPer100g: 1.1,
        category: "fruit",
        commonPortions: { "1 chikoo (170g)": 170, "100g": 100 },
        source: "USDA"
    },

    // ========================================================================
    // FAST FOOD & PREPARED FOODS
    // ========================================================================
    "pizza_cheese": {
        id: "pizza_cheese",
        name: "Pizza (Cheese, Regular Crust)",
        aliases: ["pizza", "cheese pizza", "pizza slice", "margherita pizza"],
        proteinPer100g: 11.4,
        carbsPer100g: 33.6,
        fatPer100g: 10.4,
        category: "grain",
        commonPortions: { "1 slice (107g)": 107, "2 slices (214g)": 214 },
        source: "USDA"
    },
    "burger_beef": {
        id: "burger_beef",
        name: "Hamburger (Single Patty, with Bun)",
        aliases: ["burger", "hamburger", "beef burger", "cheeseburger"],
        proteinPer100g: 13.3,
        carbsPer100g: 24.2,
        fatPer100g: 11.8,
        category: "protein",
        commonPortions: { "1 burger (215g)": 215, "100g": 100 },
        source: "USDA"
    },
    "french_fries": {
        id: "french_fries",
        name: "French Fries (Fried)",
        aliases: ["fries", "chips", "potato fries", "freedom fries"],
        proteinPer100g: 3.4,
        carbsPer100g: 41.4,
        fatPer100g: 14.7,
        category: "carbs",
        commonPortions: { "small (71g)": 71, "medium (117g)": 117, "large (154g)": 154 },
        source: "USDA"
    },
    "fried_chicken": {
        id: "fried_chicken",
        name: "Fried Chicken (Breaded)",
        aliases: ["fried chicken"],
        proteinPer100g: 18.5,
        carbsPer100g: 11.0,
        fatPer100g: 15.8,
        category: "protein",
        commonPortions: { "1 piece (100g)": 100, "2 pieces (200g)": 200 },
        source: "USDA"
    },
    "sandwich_turkey": {
        id: "sandwich_turkey",
        name: "Turkey Sandwich (Whole Wheat)",
        aliases: ["turkey sandwich"],
        proteinPer100g: 11.0,
        carbsPer100g: 22.0,
        fatPer100g: 5.0,
        category: "protein",
        commonPortions: { "1 sandwich (200g)": 200, "100g": 100 },
        source: "Nutritionix"
    },
    "wrap_chicken": {
        id: "wrap_chicken",
        name: "Chicken Wrap",
        aliases: ["chicken wrap"],
        proteinPer100g: 10.5,
        carbsPer100g: 20.0,
        fatPer100g: 7.5,
        category: "protein",
        commonPortions: { "1 wrap (250g)": 250, "100g": 100 },
        source: "Nutritionix"
    },

    // ========================================================================
    // SNACKS & SWEETS
    // ========================================================================
    "popcorn_plain": {
        id: "popcorn_plain",
        name: "Popcorn (Air-Popped, Plain)",
        aliases: ["popcorn"],
        proteinPer100g: 12.9,
        carbsPer100g: 77.9,
        fatPer100g: 4.5,
        fiberPer100g: 14.5,
        category: "grain",
        commonPortions: { "1 cup (8g)": 8, "3 cups (24g)": 24 },
        source: "USDA"
    },
    "chips_potato": {
        id: "chips_potato",
        name: "Potato Chips (Regular)",
        aliases: ["potato chips"],
        proteinPer100g: 5.7,
        carbsPer100g: 52.9,
        fatPer100g: 34.6,
        category: "grain",
        commonPortions: { "1 oz (28g)": 28, "small bag (42g)": 42 },
        source: "USDA"
    },
    "biscuit_digestive": {
        id: "biscuit_digestive",
        name: "Digestive Biscuit",
        aliases: ["digestive biscuit"],
        proteinPer100g: 7.0,
        carbsPer100g: 66.0,
        fatPer100g: 20.0,
        category: "grain",
        commonPortions: { "1 biscuit (14g)": 14, "3 biscuits (42g)": 42 },
        source: "Brand-Verified"
    },
    "ice_cream_vanilla": {
        id: "ice_cream_vanilla",
        name: "Ice Cream (Vanilla)",
        aliases: ["ice cream"],
        proteinPer100g: 3.5,
        carbsPer100g: 23.6,
        fatPer100g: 11.0,
        category: "dairy",
        commonPortions: { "1/2 cup (66g)": 66, "1 cup (132g)": 132 },
        source: "USDA"
    },
    "jalebi": {
        id: "jalebi",
        name: "Jalebi (Indian Sweet)",
        aliases: ["jalebi"],
        proteinPer100g: 2.0,
        carbsPer100g: 55.0,
        fatPer100g: 14.0,
        category: "condiment",
        commonPortions: { "1 piece (30g)": 30, "3 pieces (90g)": 90 },
        source: "Nutritionix"
    },
    "gulab_jamun": {
        id: "gulab_jamun",
        name: "Gulab Jamun",
        aliases: ["gulab jamun"],
        proteinPer100g: 3.5,
        carbsPer100g: 50.0,
        fatPer100g: 12.0,
        category: "condiment",
        commonPortions: { "1 piece (40g)": 40, "2 pieces (80g)": 80 },
        source: "Nutritionix"
    },
    "ladoo_besan": {
        id: "ladoo_besan",
        name: "Besan Ladoo",
        aliases: ["besan ladoo"],
        proteinPer100g: 8.0,
        carbsPer100g: 42.0,
        fatPer100g: 25.0,
        category: "condiment",
        commonPortions: { "1 ladoo (30g)": 30, "2 ladoos (60g)": 60 },
        source: "Nutritionix"
    },

    // ========================================================================
    // MORE PROTEINS
    // ========================================================================
    "lamb_cooked": {
        id: "lamb_cooked",
        name: "Lamb (Cooked, Lean)",
        aliases: ["lamb"],
        proteinPer100g: 25.5,
        carbsPer100g: 0,
        fatPer100g: 14.5,
        category: "protein",
        commonPortions: { "100g": 100, "150g": 150 },
        source: "USDA"
    },
    "pork_loin_cooked": {
        id: "pork_loin_cooked",
        name: "Pork Loin (Cooked, Lean)",
        aliases: ["pork loin"],
        proteinPer100g: 27.3,
        carbsPer100g: 0,
        fatPer100g: 7.1,
        category: "protein",
        commonPortions: { "1 chop (145g)": 145, "100g": 100 },
        source: "USDA"
    },
    "fish_tilapia_cooked": {
        id: "fish_tilapia_cooked",
        name: "Tilapia (Cooked)",
        aliases: ["tilapia"],
        proteinPer100g: 26.2,
        carbsPer100g: 0,
        fatPer100g: 2.7,
        category: "protein",
        commonPortions: { "1 fillet (117g)": 117, "100g": 100 },
        source: "USDA"
    },
    "turkey_breast_cooked": {
        id: "turkey_breast_cooked",
        name: "Turkey Breast (Roasted)",
        aliases: ["turkey breast"],
        proteinPer100g: 29.0,
        carbsPer100g: 0,
        fatPer100g: 1.0,
        category: "protein",
        commonPortions: { "3 slices (84g)": 84, "100g": 100 },
        source: "USDA"
    },
    "bacon_cooked": {
        id: "bacon_cooked",
        name: "Bacon (Pan-Fried)",
        aliases: ["bacon"],
        proteinPer100g: 37.0,
        carbsPer100g: 1.4,
        fatPer100g: 42.0,
        category: "protein",
        commonPortions: { "2 slices (16g)": 16, "3 slices (24g)": 24 },
        source: "USDA"
    },
    "prawns_cooked": {
        id: "prawns_cooked",
        name: "Prawns (Cooked)",
        aliases: ["prawns"],
        proteinPer100g: 24.0,
        carbsPer100g: 0.2,
        fatPer100g: 1.7,
        category: "protein",
        commonPortions: { "100g": 100, "6 prawns (84g)": 84 },
        source: "USDA"
    },

    // ========================================================================
    // MORE VEGETABLES
    // ========================================================================
    "cauliflower_cooked": {
        id: "cauliflower_cooked",
        name: "Cauliflower (Cooked)",
        aliases: ["cauliflower"],
        proteinPer100g: 1.8,
        carbsPer100g: 4.1,
        fatPer100g: 0.5,
        category: "vegetable",
        commonPortions: { "1 cup (124g)": 124, "100g": 100 },
        source: "USDA"
    },
    "cabbage_raw": {
        id: "cabbage_raw",
        name: "Cabbage (Raw)",
        aliases: ["cabbage"],
        proteinPer100g: 1.3,
        carbsPer100g: 5.8,
        fatPer100g: 0.1,
        category: "vegetable",
        commonPortions: { "1 cup shredded (89g)": 89, "100g": 100 },
        source: "USDA"
    },
    "eggplant_cooked": {
        id: "eggplant_cooked",
        name: "Eggplant / Brinjal (Cooked)",
        aliases: ["eggplant / brinjal"],
        proteinPer100g: 0.8,
        carbsPer100g: 8.7,
        fatPer100g: 0.2,
        category: "vegetable",
        commonPortions: { "1 cup (99g)": 99, "100g": 100 },
        source: "USDA"
    },
    "okra_cooked": {
        id: "okra_cooked",
        name: "Okra / Bhindi (Cooked)",
        aliases: ["okra / bhindi"],
        proteinPer100g: 1.9,
        carbsPer100g: 7.5,
        fatPer100g: 0.3,
        category: "vegetable",
        commonPortions: { "1 cup (160g)": 160, "100g": 100 },
        source: "USDA"
    },
    "bitter_gourd": {
        id: "bitter_gourd",
        name: "Bitter Gourd / Karela (Cooked)",
        aliases: ["bitter gourd / karela"],
        proteinPer100g: 1.0,
        carbsPer100g: 3.7,
        fatPer100g: 0.2,
        category: "vegetable",
        commonPortions: { "1 cup (124g)": 124, "100g": 100 },
        source: "USDA"
    },
    "bottle_gourd": {
        id: "bottle_gourd",
        name: "Bottle Gourd / Lauki (Cooked)",
        aliases: ["bottle gourd / lauki"],
        proteinPer100g: 0.6,
        carbsPer100g: 3.4,
        fatPer100g: 0.0,
        category: "vegetable",
        commonPortions: { "1 cup (146g)": 146, "100g": 100 },
        source: "USDA"
    },
    "beetroot_raw": {
        id: "beetroot_raw",
        name: "Beetroot (Raw)",
        aliases: ["beetroot"],
        proteinPer100g: 1.6,
        carbsPer100g: 9.6,
        fatPer100g: 0.2,
        category: "vegetable",
        commonPortions: { "1 beet (82g)": 82, "1 cup (136g)": 136 },
        source: "USDA"
    },
    "lettuce_raw": {
        id: "lettuce_raw",
        name: "Lettuce (Iceberg, Raw)",
        aliases: ["lettuce"],
        proteinPer100g: 0.9,
        carbsPer100g: 3.0,
        fatPer100g: 0.1,
        category: "vegetable",
        commonPortions: { "1 cup shredded (72g)": 72, "1 leaf (20g)": 20 },
        source: "USDA"
    },

    // ========================================================================
    // MORE GRAINS & CEREALS
    // ========================================================================
    "cornflakes": {
        id: "cornflakes",
        name: "Cornflakes (Cereal)",
        aliases: ["cornflakes"],
        proteinPer100g: 7.5,
        carbsPer100g: 84.0,
        fatPer100g: 0.4,
        category: "grain",
        commonPortions: { "1 cup (30g)": 30, "100g": 100 },
        source: "USDA"
    },
    "muesli": {
        id: "muesli",
        name: "Muesli (Dry)",
        aliases: ["muesli"],
        proteinPer100g: 9.7,
        carbsPer100g: 66.0,
        fatPer100g: 6.0,
        category: "grain",
        commonPortions: { "1/2 cup (45g)": 45, "1 cup (90g)": 90 },
        source: "Brand-Verified"
    },
    "vermicelli_cooked": {
        id: "vermicelli_cooked",
        name: "Vermicelli / Seviyan (Cooked)",
        aliases: ["vermicelli / seviyan"],
        proteinPer100g: 4.0,
        carbsPer100g: 25.0,
        fatPer100g: 0.5,
        category: "grain",
        commonPortions: { "1 cup (140g)": 140, "100g": 100 },
        source: "USDA"
    },
    "semolina_dry": {
        id: "semolina_dry",
        name: "Semolina / Rava / Suji (Dry)",
        aliases: ["semolina / rava / suji"],
        proteinPer100g: 12.7,
        carbsPer100g: 72.8,
        fatPer100g: 1.1,
        category: "grain",
        commonPortions: { "1/4 cup (42g)": 42, "1/2 cup (84g)": 84 },
        source: "USDA"
    },

    // ========================================================================
    // MORE BEVERAGES
    // ========================================================================
    "chai_tea": {
        id: "chai_tea",
        name: "Chai / Tea (with Milk & Sugar)",
        aliases: ["chai / tea"],
        proteinPer100g: 1.2,
        carbsPer100g: 5.5,
        fatPer100g: 1.2,
        category: "beverage",
        commonPortions: { "1 cup (150ml)": 155, "1 small cup (100ml)": 103 },
        source: "Nutritionix"
    },
    "coffee_milk_sugar": {
        id: "coffee_milk_sugar",
        name: "Coffee (with Milk & Sugar)",
        aliases: ["coffee"],
        proteinPer100g: 1.0,
        carbsPer100g: 6.0,
        fatPer100g: 1.0,
        category: "beverage",
        commonPortions: { "1 cup (240ml)": 245, "100ml": 103 },
        source: "Nutritionix"
    },
    "lassi_sweet": {
        id: "lassi_sweet",
        name: "Lassi (Sweet, Yogurt Drink)",
        aliases: ["lassi"],
        proteinPer100g: 2.5,
        carbsPer100g: 12.0,
        fatPer100g: 2.0,
        category: "beverage",
        commonPortions: { "1 glass (200ml)": 210, "100ml": 105 },
        source: "Nutritionix"
    },
    "sugarcane_juice": {
        id: "sugarcane_juice",
        name: "Sugarcane Juice",
        aliases: ["sugarcane juice"],
        proteinPer100g: 0.0,
        carbsPer100g: 11.5,
        fatPer100g: 0.0,
        category: "beverage",
        commonPortions: { "1 glass (250ml)": 260, "100ml": 104 },
        source: "Nutritionix"
    },
    "buttermilk": {
        id: "buttermilk",
        name: "Buttermilk / Chaas",
        aliases: ["buttermilk / chaas"],
        proteinPer100g: 3.3,
        carbsPer100g: 4.8,
        fatPer100g: 0.9,
        category: "beverage",
        commonPortions: { "1 cup (245ml)": 245, "100ml": 100 },
        source: "USDA"
    }
,

    // === NEW BATCH ADDITIONS ===
// Chinese
    "kung_pao_chicken": {
        id: "kung_pao_chicken", name: "Kung Pao Chicken", aliases: ["kung pao", "gong bao", "spicy chinese chicken"],
        proteinPer100g: 13, carbsPer100g: 8, fatPer100g: 10, fiberPer100g: 1.5, sugarPer100g: 2.5, sodiumMg: 350,
        category: "protein", commonPortions: { "1 cup (220g)": 220, "100g": 100 }, source: "USDA"
    },
    "sweet_and_sour_pork": {
        id: "sweet_and_sour_pork", name: "Sweet and Sour Pork", aliases: ["sweet & sour pork", "battered pork"],
        proteinPer100g: 9, carbsPer100g: 22, fatPer100g: 13, fiberPer100g: 0.8, sugarPer100g: 15, sodiumMg: 280,
        category: "protein", commonPortions: { "1 cup (230g)": 230, "100g": 100 }, source: "USDA"
    },
    "mapo_tofu": {
        id: "mapo_tofu", name: "Mapo Tofu", aliases: ["spicy tofu", "mabo dofu"],
        proteinPer100g: 7, carbsPer100g: 5, fatPer100g: 9, fiberPer100g: 1.2, sodiumMg: 310,
        category: "protein", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "peking_duck": {
        id: "peking_duck", name: "Peking Duck", aliases: ["roast duck", "chinese duck"],
        proteinPer100g: 18, carbsPer100g: 4, fatPer100g: 28, fiberPer100g: 0, sodiumMg: 350,
        category: "protein", commonPortions: { "3 slices (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "dim_sum_shumai": {
        id: "dim_sum_shumai", name: "Pork Shumai (Dim Sum)", aliases: ["siu mai", "shao mai", "dumplings"],
        proteinPer100g: 10, carbsPer100g: 15, fatPer100g: 8, fiberPer100g: 1, sodiumMg: 400,
        category: "protein", commonPortions: { "4 pieces (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "spring_rolls": {
        id: "spring_rolls", name: "Spring Rolls (Fried)", aliases: ["egg rolls", "crispy rolls"],
        proteinPer100g: 5, carbsPer100g: 24, fatPer100g: 11, fiberPer100g: 2, sodiumMg: 380,
        category: "carbs", commonPortions: { "2 rolls (100g)": 100, "1 roll (50g)": 50 }, source: "USDA"
    },
    "chow_mein": {
        id: "chow_mein", name: "Chow Mein (Stir-fried Noodles)", aliases: ["lo mein", "fried noodles"],
        proteinPer100g: 8, carbsPer100g: 26, fatPer100g: 9, fiberPer100g: 2.5, sodiumMg: 450,
        category: "grain", commonPortions: { "1 cup (180g)": 180, "100g": 100 }, source: "USDA"
    },
    "fried_rice": {
        id: "fried_rice", name: "Fried Rice (Chicken/Pork)", aliases: ["chinese fried rice", "egg fried rice"],
        proteinPer100g: 6, carbsPer100g: 30, fatPer100g: 7, fiberPer100g: 1.5, sodiumMg: 390,
        category: "grain", commonPortions: { "1 cup (190g)": 190, "100g": 100 }, source: "USDA"
    },
    // Japanese
    "sushi_salmon": {
        id: "sushi_salmon", name: "Salmon Nigiri Sushi", aliases: ["salmon sushi", "sake nigiri"],
        proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 3, fiberPer100g: 0.5, sodiumMg: 210,
        category: "protein", commonPortions: { "2 pieces (70g)": 70, "100g": 100 }, source: "USDA"
    },
    "sushi_tuna": {
        id: "sushi_tuna", name: "Tuna Nigiri Sushi", aliases: ["maguro nigiri", "tuna sushi"],
        proteinPer100g: 10, carbsPer100g: 20, fatPer100g: 1, fiberPer100g: 0.5, sodiumMg: 210,
        category: "protein", commonPortions: { "2 pieces (70g)": 70, "100g": 100 }, source: "USDA"
    },
    "miso_soup": {
        id: "miso_soup", name: "Miso Soup", aliases: ["tofu soup", "seaweed soup"],
        proteinPer100g: 2, carbsPer100g: 3, fatPer100g: 1, fiberPer100g: 0.5, sodiumMg: 420,
        category: "prepared", commonPortions: { "1 bowl (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "ramen_tonkotsu": {
        id: "ramen_tonkotsu", name: "Tonkotsu Ramen", aliases: ["pork ramen", "ramen noodles"],
        proteinPer100g: 6, carbsPer100g: 12, fatPer100g: 8, fiberPer100g: 1, sodiumMg: 500,
        category: "prepared", commonPortions: { "1 large bowl (600g)": 600, "100g": 100 }, source: "USDA"
    },
    "udon_noodles": {
        id: "udon_noodles", name: "Udon Noodles (Cooked)", aliases: ["thick noodles", "kake udon"],
        proteinPer100g: 3, carbsPer100g: 21, fatPer100g: 0.5, fiberPer100g: 1, sodiumMg: 150,
        category: "grain", commonPortions: { "1 bowl (250g)": 250, "100g": 100 }, source: "USDA"
    },
    "tempura_shrimp": {
        id: "tempura_shrimp", name: "Shrimp Tempura", aliases: ["fried shrimp", "battered shrimp"],
        proteinPer100g: 8, carbsPer100g: 15, fatPer100g: 12, fiberPer100g: 0.5, sodiumMg: 300,
        category: "protein", commonPortions: { "3 pieces (100g)": 100 }, source: "USDA"
    },
    "yakitori": {
        id: "yakitori", name: "Yakitori (Chicken Skewers)", aliases: ["grilled chicken skewer", "japanese chicken"],
        proteinPer100g: 18, carbsPer100g: 4, fatPer100g: 6, fiberPer100g: 0, sodiumMg: 350,
        category: "protein", commonPortions: { "2 skewers (80g)": 80, "100g": 100 }, source: "USDA"
    },
    "edamame_pods": {
        id: "edamame_pods", name: "Edamame Pods (Steamed, Salted)", aliases: ["soybeans", "steamed edamame"],
        proteinPer100g: 11, carbsPer100g: 9, fatPer100g: 5, fiberPer100g: 5, sodiumMg: 150,
        category: "legume", commonPortions: { "1 cup pods (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "takoyaki": {
        id: "takoyaki", name: "Takoyaki (Octopus Balls)", aliases: ["octopus dumplings"],
        proteinPer100g: 6, carbsPer100g: 18, fatPer100g: 8, fiberPer100g: 1, sodiumMg: 380,
        category: "prepared", commonPortions: { "6 pieces (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "gyoza": {
        id: "gyoza", name: "Gyoza (Pan-Fried Dumplings)", aliases: ["potstickers", "japanese dumplings"],
        proteinPer100g: 8, carbsPer100g: 20, fatPer100g: 10, fiberPer100g: 1.5, sodiumMg: 350,
        category: "prepared", commonPortions: { "5 pieces (125g)": 125, "100g": 100 }, source: "USDA"
    },
    "tonkatsu": {
        id: "tonkatsu", name: "Tonkatsu (Breaded Pork Cutlet)", aliases: ["fried pork", "pork cutlet"],
        proteinPer100g: 14, carbsPer100g: 12, fatPer100g: 18, fiberPer100g: 1, sodiumMg: 280,
        category: "protein", commonPortions: { "1 cutlet (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "matcha_ice_cream": {
        id: "matcha_ice_cream", name: "Matcha Ice Cream", aliases: ["green tea ice cream"],
        proteinPer100g: 3, carbsPer100g: 25, fatPer100g: 12, fiberPer100g: 0, sodiumMg: 50,
        category: "dessert", commonPortions: { "1 scoop (90g)": 90, "100g": 100 }, source: "USDA"
    },

    // Thai
    "pad_thai": {
        id: "pad_thai", name: "Pad Thai (Chicken/Shrimp)", aliases: ["thai fried noodles"],
        proteinPer100g: 8, carbsPer100g: 25, fatPer100g: 10, fiberPer100g: 2, sodiumMg: 420,
        category: "prepared", commonPortions: { "1 plate (350g)": 350, "100g": 100 }, source: "USDA"
    },
    "tom_yum_soup": {
        id: "tom_yum_soup", name: "Tom Yum Soup", aliases: ["spicy thai soup", "shrimp soup"],
        proteinPer100g: 4, carbsPer100g: 3, fatPer100g: 2, fiberPer100g: 1, sodiumMg: 550,
        category: "prepared", commonPortions: { "1 bowl (250g)": 250, "100g": 100 }, source: "USDA"
    },
    "green_curry_chicken": {
        id: "green_curry_chicken", name: "Thai Green Curry (Chicken)", aliases: ["green curry"],
        proteinPer100g: 7, carbsPer100g: 6, fatPer100g: 11, fiberPer100g: 1.5, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "red_curry_chicken": {
        id: "red_curry_chicken", name: "Thai Red Curry (Chicken)", aliases: ["red curry"],
        proteinPer100g: 7, carbsPer100g: 6, fatPer100g: 10, fiberPer100g: 1.5, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "mango_sticky_rice": {
        id: "mango_sticky_rice", name: "Mango Sticky Rice", aliases: ["thai dessert", "sticky rice coconut"],
        proteinPer100g: 2, carbsPer100g: 30, fatPer100g: 5, fiberPer100g: 1.5, sodiumMg: 150,
        category: "dessert", commonPortions: { "1 serving (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "som_tum": {
        id: "som_tum", name: "Som Tum (Papaya Salad)", aliases: ["green papaya salad"],
        proteinPer100g: 2, carbsPer100g: 10, fatPer100g: 3, fiberPer100g: 2.5, sodiumMg: 450,
        category: "vegetable", commonPortions: { "1 plate (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "massaman_curry": {
        id: "massaman_curry", name: "Massaman Curry", aliases: ["thai beef curry", "masaman"],
        proteinPer100g: 6, carbsPer100g: 8, fatPer100g: 12, fiberPer100g: 2, sodiumMg: 380,
        category: "prepared", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },

    // Mexican
    "taco_beef_hard": {
        id: "taco_beef_hard", name: "Beef Taco (Hard Shell)", aliases: ["crispy taco", "ground beef taco"],
        proteinPer100g: 11, carbsPer100g: 15, fatPer100g: 12, fiberPer100g: 2, sodiumMg: 350,
        category: "prepared", commonPortions: { "2 tacos (160g)": 160, "1 taco (80g)": 80 }, source: "USDA"
    },
    "taco_chicken_soft": {
        id: "taco_chicken_soft", name: "Chicken Taco (Soft Shell)", aliases: ["soft taco", "fajita taco"],
        proteinPer100g: 13, carbsPer100g: 16, fatPer100g: 8, fiberPer100g: 1.5, sodiumMg: 320,
        category: "prepared", commonPortions: { "2 tacos (200g)": 200, "1 taco (100g)": 100 }, source: "USDA"
    },
    "burrito_chicken_rice": {
        id: "burrito_chicken_rice", name: "Chicken & Rice Burrito", aliases: ["large burrito"],
        proteinPer100g: 9, carbsPer100g: 26, fatPer100g: 7, fiberPer100g: 2.5, sodiumMg: 400,
        category: "prepared", commonPortions: { "1 large burrito (400g)": 400, "100g": 100 }, source: "USDA"
    },
    "quesadilla_cheese": {
        id: "quesadilla_cheese", name: "Cheese Quesadilla", aliases: ["cheese tortilla fold"],
        proteinPer100g: 11, carbsPer100g: 24, fatPer100g: 16, fiberPer100g: 1.5, sodiumMg: 450,
        category: "prepared", commonPortions: { "1 quesadilla (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "fajitas_chicken_mixed": {
        id: "fajitas_chicken_mixed", name: "Chicken Fajitas (No Tortilla)", aliases: ["sizzling fajitas"],
        proteinPer100g: 14, carbsPer100g: 6, fatPer100g: 5, fiberPer100g: 1.5, sodiumMg: 280,
        category: "prepared", commonPortions: { "1 cup (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "guacamole": {
        id: "guacamole", name: "Guacamole", aliases: ["avocado dip", "guac"],
        proteinPer100g: 2, carbsPer100g: 8, fatPer100g: 14, fiberPer100g: 6, sodiumMg: 200,
        category: "fat", commonPortions: { "2 tbsp (30g)": 30, "1/2 cup (120g)": 120 }, source: "USDA"
    },
    "nachos_cheese_jalapeno": {
        id: "nachos_cheese_jalapeno", name: "Nachos with Cheese", aliases: ["tortilla chips with cheese"],
        proteinPer100g: 8, carbsPer100g: 35, fatPer100g: 18, fiberPer100g: 3, sodiumMg: 480,
        category: "prepared", commonPortions: { "1 plate (250g)": 250, "100g": 100 }, source: "USDA"
    },
    "churros": {
        id: "churros", name: "Churros (Fried Dough)", aliases: ["mexican donut"],
        proteinPer100g: 4, carbsPer100g: 42, fatPer100g: 22, fiberPer100g: 1.5, sugarPer100g: 20, sodiumMg: 350,
        category: "dessert", commonPortions: { "1 churro (40g)": 40, "100g": 100 }, source: "USDA"
    },
    "tamal_pork": {
        id: "tamal_pork", name: "Pork Tamale", aliases: ["tamales"],
        proteinPer100g: 6, carbsPer100g: 18, fatPer100g: 11, fiberPer100g: 2, sodiumMg: 300,
        category: "prepared", commonPortions: { "1 tamale (140g)": 140, "100g": 100 }, source: "USDA"
    },

    // Italian
    "spaghetti_bolognese": {
        id: "spaghetti_bolognese", name: "Spaghetti Bolognese", aliases: ["meat sauce pasta"],
        proteinPer100g: 7, carbsPer100g: 16, fatPer100g: 5, fiberPer100g: 1.5, sodiumMg: 250,
        category: "prepared", commonPortions: { "1 plate (350g)": 350, "100g": 100 }, source: "USDA"
    },
    "fettuccine_alfredo": {
        id: "fettuccine_alfredo", name: "Fettuccine Alfredo", aliases: ["creamy pasta", "alfredo sauce pasta"],
        proteinPer100g: 6, carbsPer100g: 16, fatPer100g: 12, fiberPer100g: 1, sodiumMg: 380,
        category: "prepared", commonPortions: { "1 plate (300g)": 300, "100g": 100 }, source: "USDA"
    },
    "lasagna_meat": {
        id: "lasagna_meat", name: "Meat Lasagna", aliases: ["lasagne", "baked pasta"],
        proteinPer100g: 9, carbsPer100g: 14, fatPer100g: 8, fiberPer100g: 1.5, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 piece (250g)": 250, "100g": 100 }, source: "USDA"
    },
    "pizza_pepperoni": {
        id: "pizza_pepperoni", name: "Pepperoni Pizza", aliases: ["meat pizza", "pepperoni slice"],
        proteinPer100g: 12, carbsPer100g: 31, fatPer100g: 13, fiberPer100g: 2, sodiumMg: 600,
        category: "prepared", commonPortions: { "1 slice (110g)": 110, "2 slices (220g)": 220 }, source: "USDA"
    },
    "risotto_mushroom": {
        id: "risotto_mushroom", name: "Mushroom Risotto", aliases: ["italian rice dish"],
        proteinPer100g: 4, carbsPer100g: 20, fatPer100g: 7, fiberPer100g: 1.5, sodiumMg: 300,
        category: "prepared", commonPortions: { "1 plate (280g)": 280, "100g": 100 }, source: "USDA"
    },
    "caprese_salad": {
        id: "caprese_salad", name: "Caprese Salad (Tomato, Mozzarella, Basil)", aliases: ["mozzarella salad", "tomato salad"],
        proteinPer100g: 8, carbsPer100g: 4, fatPer100g: 14, fiberPer100g: 1, sodiumMg: 150,
        category: "prepared", commonPortions: { "1 plate (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "tiramisu": {
        id: "tiramisu", name: "Tiramisu", aliases: ["coffee dessert", "italian cake"],
        proteinPer100g: 5, carbsPer100g: 28, fatPer100g: 18, fiberPer100g: 0.5, sugarPer100g: 18, sodiumMg: 100,
        category: "dessert", commonPortions: { "1 slice (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "gelato_chocolate": {
        id: "gelato_chocolate", name: "Chocolate Gelato", aliases: ["italian ice cream", "choc gelato"],
        proteinPer100g: 4, carbsPer100g: 25, fatPer100g: 8, fiberPer100g: 1, sugarPer100g: 20, sodiumMg: 60,
        category: "dessert", commonPortions: { "1 scoop (90g)": 90, "100g": 100 }, source: "USDA"
    },
    "gnocchi_potato": {
        id: "gnocchi_potato", name: "Potato Gnocchi (Cooked, Plain)", aliases: ["potato pasta"],
        proteinPer100g: 3, carbsPer100g: 30, fatPer100g: 0.5, fiberPer100g: 2, sodiumMg: 200,
        category: "grain", commonPortions: { "1 cup (150g)": 150, "100g": 100 }, source: "USDA"
    },

    // Mediterranean
    "falafel": {
        id: "falafel", name: "Falafel (Fried)", aliases: ["chickpea fritter", "fried falafel"],
        proteinPer100g: 13, carbsPer100g: 31, fatPer100g: 17, fiberPer100g: 8, sodiumMg: 290,
        category: "prepared", commonPortions: { "3 patties (50g)": 50, "100g": 100 }, source: "USDA"
    },
    "shawarma_chicken": {
        id: "shawarma_chicken", name: "Chicken Shawarma (Meat Only)", aliases: ["doner meat", "gyro meat"],
        proteinPer100g: 18, carbsPer100g: 3, fatPer100g: 12, fiberPer100g: 0.5, sodiumMg: 350,
        category: "protein", commonPortions: { "1 cup (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "gyro_pita": {
        id: "gyro_pita", name: "Gyro Pita Wrap", aliases: ["lamb gyro", "doner kebab"],
        proteinPer100g: 10, carbsPer100g: 20, fatPer100g: 10, fiberPer100g: 1.5, sodiumMg: 450,
        category: "prepared", commonPortions: { "1 wrap (250g)": 250, "100g": 100 }, source: "USDA"
    },
    "greek_salad": {
        id: "greek_salad", name: "Greek Salad", aliases: ["feta salad", "mediterranean salad"],
        proteinPer100g: 3, carbsPer100g: 5, fatPer100g: 8, fiberPer100g: 1.5, sodiumMg: 300,
        category: "prepared", commonPortions: { "1 large bowl (300g)": 300, "100g": 100 }, source: "USDA"
    },
    "baba_ganoush": {
        id: "baba_ganoush", name: "Baba Ganoush (Eggplant Dip)", aliases: ["eggplant spread", "mutabal"],
        proteinPer100g: 2, carbsPer100g: 8, fatPer100g: 9, fiberPer100g: 3, sodiumMg: 250,
        category: "condiment", commonPortions: { "2 tbsp (30g)": 30, "100g": 100 }, source: "USDA"
    },
    "tabbouleh": {
        id: "tabbouleh", name: "Tabbouleh (Parsley & Bulgur Salad)", aliases: ["tabouli", "parsley salad"],
        proteinPer100g: 3, carbsPer100g: 15, fatPer100g: 6, fiberPer100g: 4, sodiumMg: 200,
        category: "prepared", commonPortions: { "1/2 cup (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "pita_bread": {
        id: "pita_bread", name: "Pita Bread", aliases: ["arabic bread", "pocket bread"],
        proteinPer100g: 9, carbsPer100g: 55, fatPer100g: 1.5, fiberPer100g: 2, sodiumMg: 500,
        category: "grain", commonPortions: { "1 large pita (60g)": 60, "100g": 100 }, source: "USDA"
    },
    "baklava": {
        id: "baklava", name: "Baklava", aliases: ["sweet pastry", "honey nut pastry"],
        proteinPer100g: 5, carbsPer100g: 45, fatPer100g: 25, fiberPer100g: 2, sugarPer100g: 25, sodiumMg: 120,
        category: "dessert", commonPortions: { "1 piece (45g)": 45, "100g": 100 }, source: "USDA"
    },

    // American
    "hot_dog_bun": {
        id: "hot_dog_bun", name: "Hot Dog (with Bun)", aliases: ["frankfurter bun", "weiner bun"],
        proteinPer100g: 10, carbsPer100g: 20, fatPer100g: 15, fiberPer100g: 1, sodiumMg: 450,
        category: "prepared", commonPortions: { "1 hot dog (115g)": 115, "100g": 100 }, source: "USDA"
    },
    "mac_and_cheese": {
        id: "mac_and_cheese", name: "Macaroni and Cheese", aliases: ["mac n cheese", "macaroni cheese"],
        proteinPer100g: 8, carbsPer100g: 24, fatPer100g: 10, fiberPer100g: 1.5, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 cup (190g)": 190, "100g": 100 }, source: "USDA"
    },
    "buffalo_wings": {
        id: "buffalo_wings", name: "Buffalo Wings (Bone-in, Sauce)", aliases: ["hot wings", "chicken wings"],
        proteinPer100g: 14, carbsPer100g: 3, fatPer100g: 18, fiberPer100g: 0, sodiumMg: 600,
        category: "prepared", commonPortions: { "6 wings (180g)": 180, "100g": 100 }, source: "USDA"
    },
    "bbq_ribs": {
        id: "bbq_ribs", name: "BBQ Pork Ribs", aliases: ["pork ribs", "barbecue ribs"],
        proteinPer100g: 15, carbsPer100g: 8, fatPer100g: 22, fiberPer100g: 0.5, sodiumMg: 400,
        category: "prepared", commonPortions: { "1/2 rack (250g)": 250, "100g": 100 }, source: "USDA"
    },
    "clam_chowder": {
        id: "clam_chowder", name: "Clam Chowder (New England)", aliases: ["creamy clam soup", "white chowder"],
        proteinPer100g: 4, carbsPer100g: 9, fatPer100g: 5, fiberPer100g: 1, sodiumMg: 320,
        category: "prepared", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "grilled_cheese": {
        id: "grilled_cheese", name: "Grilled Cheese Sandwich", aliases: ["cheese toastie", "toasted cheese"],
        proteinPer100g: 12, carbsPer100g: 25, fatPer100g: 18, fiberPer100g: 2, sodiumMg: 500,
        category: "prepared", commonPortions: { "1 sandwich (130g)": 130, "100g": 100 }, source: "USDA"
    },
    "cornbread": {
        id: "cornbread", name: "Cornbread", aliases: ["baked cornbread"],
        proteinPer100g: 6, carbsPer100g: 45, fatPer100g: 11, fiberPer100g: 2, sodiumMg: 450,
        category: "grain", commonPortions: { "1 piece (60g)": 60, "100g": 100 }, source: "USDA"
    },
    "brownie": {
        id: "brownie", name: "Chocolate Brownie", aliases: ["fudge brownie"],
        proteinPer100g: 4, carbsPer100g: 52, fatPer100g: 25, fiberPer100g: 3, sugarPer100g: 35, sodiumMg: 200,
        category: "dessert", commonPortions: { "1 square (50g)": 50, "100g": 100 }, source: "USDA"
    },
    "apple_pie": {
        id: "apple_pie", name: "Apple Pie", aliases: ["fruit pie", "baked pie"],
        proteinPer100g: 2, carbsPer100g: 32, fatPer100g: 12, fiberPer100g: 2, sugarPer100g: 15, sodiumMg: 200,
        category: "dessert", commonPortions: { "1 slice (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "pancakes_syrup": {
        id: "pancakes_syrup", name: "Pancakes (with Syrup & Butter)", aliases: ["flapjacks", "hotcakes"],
        proteinPer100g: 5, carbsPer100g: 38, fatPer100g: 8, fiberPer100g: 1, sugarPer100g: 18, sodiumMg: 400,
        category: "prepared", commonPortions: { "3 pancakes (200g)": 200, "100g": 100 }, source: "USDA"
    },

    // Korean
    "kimchi": {
        id: "kimchi", name: "Kimchi (Cabbage)", aliases: ["fermented cabbage", "spicy cabbage"],
        proteinPer100g: 2, carbsPer100g: 4, fatPer100g: 0.5, fiberPer100g: 1.5, sodiumMg: 600,
        category: "vegetable", commonPortions: { "1/2 cup (80g)": 80, "100g": 100 }, source: "USDA"
    },
    "bibimbap": {
        id: "bibimbap", name: "Bibimbap", aliases: ["korean mixed rice", "rice bowl"],
        proteinPer100g: 7, carbsPer100g: 20, fatPer100g: 4, fiberPer100g: 2, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 large bowl (400g)": 400, "100g": 100 }, source: "USDA"
    },
    "bulgogi_beef": {
        id: "bulgogi_beef", name: "Beef Bulgogi", aliases: ["korean bbq beef", "marinated beef"],
        proteinPer100g: 16, carbsPer100g: 10, fatPer100g: 8, fiberPer100g: 0.5, sodiumMg: 450,
        category: "protein", commonPortions: { "1 cup (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "tteokbokki": {
        id: "tteokbokki", name: "Tteokbokki (Spicy Rice Cakes)", aliases: ["korean rice cakes", "spicy ddeokbokki"],
        proteinPer100g: 4, carbsPer100g: 35, fatPer100g: 2, fiberPer100g: 1.5, sodiumMg: 400,
        category: "prepared", commonPortions: { "1 bowl (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "japchae": {
        id: "japchae", name: "Japchae (Glass Noodles)", aliases: ["sweet potato noodles", "korean noodles"],
        proteinPer100g: 2, carbsPer100g: 25, fatPer100g: 6, fiberPer100g: 2, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 plate (250g)": 250, "100g": 100 }, source: "USDA"
    },
// Breakfast Cuisines
    "scrambled_eggs_cheese": {
        id: "scrambled_eggs_cheese", name: "Scrambled Eggs with Cheese", aliases: ["cheesy eggs", "egg scramble"],
        proteinPer100g: 13, carbsPer100g: 2, fatPer100g: 15, fiberPer100g: 0, sodiumMg: 350,
        category: "protein", commonPortions: { "2 eggs scrambled (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "bacon_egg_cheese_biscuit": {
        id: "bacon_egg_cheese_biscuit", name: "Bacon, Egg, & Cheese Biscuit", aliases: ["breakfast sandwich", "biscuit sandwich"],
        proteinPer100g: 14, carbsPer100g: 25, fatPer100g: 22, fiberPer100g: 1.5, sodiumMg: 850,
        category: "prepared", commonPortions: { "1 sandwich (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "hash_browns": {
        id: "hash_browns", name: "Hash Browns (Fried Potatoes)", aliases: ["breakfast potatoes", "potato patty"],
        proteinPer100g: 2, carbsPer100g: 25, fatPer100g: 15, fiberPer100g: 2.5, sodiumMg: 350,
        category: "carbs", commonPortions: { "1 patty (60g)": 60, "1 cup (150g)": 150 }, source: "USDA"
    },
    "waffles_syrup": {
        id: "waffles_syrup", name: "Waffles (with Syrup & Butter)", aliases: ["belgian waffle", "breakfast waffle"],
        proteinPer100g: 6, carbsPer100g: 45, fatPer100g: 12, fiberPer100g: 1, sugarPer100g: 20, sodiumMg: 450,
        category: "prepared", commonPortions: { "2 waffles (180g)": 180, "100g": 100 }, source: "USDA"
    },
    "french_toast": {
        id: "french_toast", name: "French Toast (with Syrup)", aliases: ["egg bread", "sweet toast"],
        proteinPer100g: 7, carbsPer100g: 35, fatPer100g: 9, fiberPer100g: 2, sugarPer100g: 15, sodiumMg: 380,
        category: "prepared", commonPortions: { "2 slices (160g)": 160, "100g": 100 }, source: "USDA"
    },
    "bagel_cream_cheese": {
        id: "bagel_cream_cheese", name: "Bagel with Cream Cheese", aliases: ["breakfast bagel"],
        proteinPer100g: 10, carbsPer100g: 45, fatPer100g: 12, fiberPer100g: 2, sodiumMg: 500,
        category: "prepared", commonPortions: { "1 bagel (140g)": 140, "100g": 100 }, source: "USDA"
    },
    "avocado_toast": {
        id: "avocado_toast", name: "Avocado Toast (Whole Wheat)", aliases: ["avo toast", "healthy toast"],
        proteinPer100g: 6, carbsPer100g: 25, fatPer100g: 11, fiberPer100g: 6, sodiumMg: 280,
        category: "prepared", commonPortions: { "1 slice (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "oatmeal_fruit_nuts": {
        id: "oatmeal_fruit_nuts", name: "Oatmeal with Fruit & Nuts", aliases: ["porridge bowl"],
        proteinPer100g: 5, carbsPer100g: 20, fatPer100g: 6, fiberPer100g: 4, sodiumMg: 150,
        category: "prepared", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "eggs_benedict": {
        id: "eggs_benedict", name: "Eggs Benedict", aliases: ["poached egg muffin", "hollandaise egg"],
        proteinPer100g: 11, carbsPer100g: 15, fatPer100g: 18, fiberPer100g: 1, sodiumMg: 650,
        category: "prepared", commonPortions: { "1 serving (220g)": 220, "100g": 100 }, source: "USDA"
    },
    "cereal_milk": {
        id: "cereal_milk", name: "Cereal with Milk", aliases: ["breakfast cereal", "corn flakes milk"],
        proteinPer100g: 4, carbsPer100g: 22, fatPer100g: 2, fiberPer100g: 1.5, sugarPer100g: 10, sodiumMg: 200,
        category: "prepared", commonPortions: { "1 bowl (200g)": 200, "100g": 100 }, source: "USDA"
    },

    // Soups, Salads & Bowls
    "caesar_salad_chicken": {
        id: "caesar_salad_chicken", name: "Chicken Caesar Salad", aliases: ["caesar salad with chicken"],
        proteinPer100g: 11, carbsPer100g: 5, fatPer100g: 12, fiberPer100g: 1.5, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 large bowl (300g)": 300, "100g": 100 }, source: "USDA"
    },
    "cobb_salad": {
        id: "cobb_salad", name: "Cobb Salad", aliases: ["egg bacon salad", "ranch salad"],
        proteinPer100g: 10, carbsPer100g: 4, fatPer100g: 15, fiberPer100g: 2, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 large bowl (350g)": 350, "100g": 100 }, source: "USDA"
    },
    "pho_beef": {
        id: "pho_beef", name: "Beef Pho (Noodle Soup)", aliases: ["vietnamese soup", "pho tai"],
        proteinPer100g: 6, carbsPer100g: 14, fatPer100g: 3, fiberPer100g: 1, sodiumMg: 300,
        category: "prepared", commonPortions: { "1 large bowl (500g)": 500, "100g": 100 }, source: "USDA"
    },
    "poke_bowl_tuna": {
        id: "poke_bowl_tuna", name: "Tuna Poke Bowl", aliases: ["hawaiian raw fish bowl", "poke"],
        proteinPer100g: 10, carbsPer100g: 18, fatPer100g: 5, fiberPer100g: 2, sodiumMg: 350,
        category: "prepared", commonPortions: { "1 bowl (350g)": 350, "100g": 100 }, source: "USDA"
    },
    "acai_bowl": {
        id: "acai_bowl", name: "Açaí Bowl", aliases: ["acai smoothie bowl", "fruit bowl"],
        proteinPer100g: 2, carbsPer100g: 22, fatPer100g: 5, fiberPer100g: 4, sugarPer100g: 15, sodiumMg: 50,
        category: "dessert", commonPortions: { "1 bowl (300g)": 300, "100g": 100 }, source: "USDA"
    },

    // Desserts & Sweets
    "cheesecake": {
        id: "cheesecake", name: "Cheesecake (New York Style)", aliases: ["cream cheese cake"],
        proteinPer100g: 6, carbsPer100g: 25, fatPer100g: 22, fiberPer100g: 0.5, sugarPer100g: 20, sodiumMg: 300,
        category: "dessert", commonPortions: { "1 slice (130g)": 130, "100g": 100 }, source: "USDA"
    },
    "chocolate_chip_cookie": {
        id: "chocolate_chip_cookie", name: "Chocolate Chip Cookie", aliases: ["choc chip cookie"],
        proteinPer100g: 5, carbsPer100g: 65, fatPer100g: 25, fiberPer100g: 2, sugarPer100g: 35, sodiumMg: 350,
        category: "dessert", commonPortions: { "1 medium cookie (30g)": 30, "100g": 100 }, source: "USDA"
    },
    "donut_glazed": {
        id: "donut_glazed", name: "Glazed Donut", aliases: ["doughnut", "sweet donut"],
        proteinPer100g: 5, carbsPer100g: 50, fatPer100g: 20, fiberPer100g: 1.5, sugarPer100g: 25, sodiumMg: 300,
        category: "dessert", commonPortions: { "1 donut (60g)": 60, "100g": 100 }, source: "USDA"
    },
    "muffin_blueberry": {
        id: "muffin_blueberry", name: "Blueberry Muffin", aliases: ["fruit muffin"],
        proteinPer100g: 5, carbsPer100g: 52, fatPer100g: 16, fiberPer100g: 1.5, sugarPer100g: 28, sodiumMg: 350,
        category: "dessert", commonPortions: { "1 medium muffin (110g)": 110, "100g": 100 }, source: "USDA"
    },
    "macaron": {
        id: "macaron", name: "French Macaron", aliases: ["almond cookie"],
        proteinPer100g: 6, carbsPer100g: 60, fatPer100g: 20, fiberPer100g: 3, sugarPer100g: 45, sodiumMg: 50,
        category: "dessert", commonPortions: { "1 macaron (20g)": 20, "100g": 100 }, source: "USDA"
    },
    "cupcake_vanilla": {
        id: "cupcake_vanilla", name: "Vanilla Cupcake (with Frosting)", aliases: ["frosted cake"],
        proteinPer100g: 3, carbsPer100g: 55, fatPer100g: 18, fiberPer100g: 0.5, sugarPer100g: 40, sodiumMg: 250,
        category: "dessert", commonPortions: { "1 cupcake (80g)": 80, "100g": 100 }, source: "USDA"
    },

    // Fast Food Additions
    "chicken_nuggets": {
        id: "chicken_nuggets", name: "Chicken Nuggets (Fried)", aliases: ["chicken tenders", "fried chicken bites"],
        proteinPer100g: 15, carbsPer100g: 15, fatPer100g: 18, fiberPer100g: 1, sodiumMg: 500,
        category: "protein", commonPortions: { "6 nuggets (96g)": 96, "100g": 100 }, source: "USDA"
    },
    "onion_rings": {
        id: "onion_rings", name: "Onion Rings (Fried)", aliases: ["fried onions"],
        proteinPer100g: 4, carbsPer100g: 45, fatPer100g: 20, fiberPer100g: 3, sodiumMg: 550,
        category: "carbs", commonPortions: { "1 medium order (110g)": 110, "100g": 100 }, source: "USDA"
    },
    "mozzarella_sticks": {
        id: "mozzarella_sticks", name: "Mozzarella Sticks (Fried)", aliases: ["cheese sticks", "fried cheese"],
        proteinPer100g: 15, carbsPer100g: 25, fatPer100g: 20, fiberPer100g: 2, sodiumMg: 650,
        category: "prepared", commonPortions: { "4 sticks (100g)": 100, "100g": 100 }, source: "USDA"
    },
    "curly_fries": {
        id: "curly_fries", name: "Curly Fries", aliases: ["seasoned fries"],
        proteinPer100g: 3, carbsPer100g: 42, fatPer100g: 18, fiberPer100g: 4, sodiumMg: 700,
        category: "carbs", commonPortions: { "1 medium order (120g)": 120, "100g": 100 }, source: "USDA"
    },

    // Drinks
    "coca_cola": {
        id: "coca_cola", name: "Coca-Cola (Regular)", aliases: ["coke", "soda", "cola"],
        proteinPer100g: 0, carbsPer100g: 10.6, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 10.6, sodiumMg: 10,
        category: "beverage", commonPortions: { "1 can (355ml)": 368, "100ml": 103 }, source: "USDA"
    },
    "diet_coke": {
        id: "diet_coke", name: "Diet Coke / Zero Sugar", aliases: ["coke zero", "diet soda"],
        proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 0, sodiumMg: 12,
        category: "beverage", commonPortions: { "1 can (355ml)": 355, "100ml": 100 }, source: "USDA"
    },
    "orange_juice_carton": {
        id: "orange_juice_carton", name: "Orange Juice (Carton, No Pulp)", aliases: ["oj"],
        proteinPer100g: 0.7, carbsPer100g: 10.4, fatPer100g: 0.2, fiberPer100g: 0.2, sugarPer100g: 8.5, sodiumMg: 2,
        category: "beverage", commonPortions: { "1 cup (248g)": 248, "100g": 100 }, source: "USDA"
    },
    "apple_juice": {
        id: "apple_juice", name: "Apple Juice", aliases: ["fruit juice apple"],
        proteinPer100g: 0.1, carbsPer100g: 11.3, fatPer100g: 0.1, fiberPer100g: 0.2, sugarPer100g: 10.5, sodiumMg: 4,
        category: "beverage", commonPortions: { "1 cup (248g)": 248, "100g": 100 }, source: "USDA"
    },
    "lemonade": {
        id: "lemonade", name: "Lemonade (Sweetened)", aliases: ["lemon juice sugar"],
        proteinPer100g: 0.1, carbsPer100g: 10.5, fatPer100g: 0, fiberPer100g: 0.1, sugarPer100g: 10, sodiumMg: 5,
        category: "beverage", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "kombucha": {
        id: "kombucha", name: "Kombucha", aliases: ["fermented tea"],
        proteinPer100g: 0.2, carbsPer100g: 3.5, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 3, sodiumMg: 5,
        category: "beverage", commonPortions: { "1 bottle (473ml)": 473, "100g": 100 }, source: "USDA"
    },
    "beer_regular": {
        id: "beer_regular", name: "Beer (Regular)", aliases: ["lager", "ale", "ipa"],
        proteinPer100g: 0.5, carbsPer100g: 3.6, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 0, sodiumMg: 4,
        category: "beverage", commonPortions: { "1 can/bottle (355ml)": 355, "100g": 100 }, source: "USDA"
    },
    "wine_red": {
        id: "wine_red", name: "Red Wine", aliases: ["cabernet", "merlot", "pinot noir"],
        proteinPer100g: 0.1, carbsPer100g: 2.6, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 0.6, sodiumMg: 4,
        category: "beverage", commonPortions: { "1 glass (147ml)": 147, "100g": 100 }, source: "USDA"
    },
    "wine_white": {
        id: "wine_white", name: "White Wine", aliases: ["chardonnay", "pinot grigio"],
        proteinPer100g: 0.1, carbsPer100g: 2.6, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 1, sodiumMg: 5,
        category: "beverage", commonPortions: { "1 glass (147ml)": 147, "100g": 100 }, source: "USDA"
    },
    "iced_tea_sweet": {
        id: "iced_tea_sweet", name: "Sweet Iced Tea", aliases: ["sweet tea"],
        proteinPer100g: 0, carbsPer100g: 9, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 8.5, sodiumMg: 5,
        category: "beverage", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "USDA"
    },
    "water_sparkling": {
        id: "water_sparkling", name: "Sparkling Water (Plain)", aliases: ["club soda", "seltzer"],
        proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 0, sodiumMg: 2,
        category: "beverage", commonPortions: { "1 can (355ml)": 355, "100g": 100 }, source: "USDA"
    },

    // Misc
    "margarita": {
        id: "margarita", name: "Margarita Cocktail", aliases: ["tequila drink"],
        proteinPer100g: 0, carbsPer100g: 15, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 13, sodiumMg: 20,
        category: "beverage", commonPortions: { "1 glass (150ml)": 150, "100g": 100 }, source: "USDA"
    },
    "protein_shake_bottled": {
        id: "protein_shake_bottled", name: "Protein Shake (RTD)", aliases: ["core power", "muscle milk"],
        proteinPer100g: 7, carbsPer100g: 3, fatPer100g: 1.5, fiberPer100g: 0.5, sugarPer100g: 1, sodiumMg: 150,
        category: "beverage", commonPortions: { "1 bottle (330ml)": 330, "100g": 100 }, source: "USDA"
    },
// Street Food & Snacks
    "pani_puri": {
        id: "pani_puri", name: "Pani Puri / Golgappa", aliases: ["puchka", "gol gappa"],
        proteinPer100g: 3, carbsPer100g: 22, fatPer100g: 8, fiberPer100g: 2, sodiumMg: 350,
        category: "snack", commonPortions: { "6 pieces (150g)": 150, "100g": 100 }, source: "Nutritionix"
    },
    "bhel_puri": {
        id: "bhel_puri", name: "Bhel Puri", aliases: ["bhel", "indian puffed rice snack"],
        proteinPer100g: 4, carbsPer100g: 35, fatPer100g: 10, fiberPer100g: 3, sodiumMg: 400,
        category: "snack", commonPortions: { "1 plate (150g)": 150, "100g": 100 }, source: "Nutritionix"
    },
    "vada_pav": {
        id: "vada_pav", name: "Vada Pav", aliases: ["mumbai burger", "batata vada pav"],
        proteinPer100g: 5, carbsPer100g: 30, fatPer100g: 15, fiberPer100g: 2.5, sodiumMg: 500,
        category: "snack", commonPortions: { "1 vada pav (150g)": 150, "100g": 100 }, source: "Nutritionix"
    },
    "pav_bhaji": {
        id: "pav_bhaji", name: "Pav Bhaji (with Butter)", aliases: ["masala bread bhaji"],
        proteinPer100g: 4, carbsPer100g: 25, fatPer100g: 15, fiberPer100g: 3, sodiumMg: 600,
        category: "snack", commonPortions: { "1 plate (300g)": 300, "100g": 100 }, source: "Nutritionix"
    },
    "chana_masala": {
        id: "chana_masala", name: "Chana Masala (Chickpea Curry)", aliases: ["punjabi chole"],
        proteinPer100g: 6, carbsPer100g: 18, fatPer100g: 5, fiberPer100g: 5, sodiumMg: 380,
        category: "legume", commonPortions: { "1 cup (240g)": 240, "100g": 100 }, source: "Nutritionix"
    },
    "kobi_machi": {
        id: "kobi_machi", name: "Fish Curry (Indian Style)", aliases: ["machli curry", "fish masala"],
        proteinPer100g: 12, carbsPer100g: 4, fatPer100g: 8, fiberPer100g: 1, sodiumMg: 350,
        category: "protein", commonPortions: { "1 cup (200g)": 200, "100g": 100 }, source: "Nutritionix"
    },
    "mutton_curry": {
        id: "mutton_curry", name: "Mutton Curry", aliases: ["goat curry", "lamb curry indian"],
        proteinPer100g: 14, carbsPer100g: 5, fatPer100g: 12, fiberPer100g: 1, sodiumMg: 400,
        category: "protein", commonPortions: { "1 cup (220g)": 220, "100g": 100 }, source: "Nutritionix"
    },
    "paneer_tikka": {
        id: "paneer_tikka", name: "Paneer Tikka (Dry)", aliases: ["grilled paneer", "tandoori paneer"],
        proteinPer100g: 15, carbsPer100g: 5, fatPer100g: 14, fiberPer100g: 1, sodiumMg: 350,
        category: "protein", commonPortions: { "6 pieces (150g)": 150, "100g": 100 }, source: "Nutritionix"
    },
    "chicken_tikka": {
        id: "chicken_tikka", name: "Chicken Tikka (Dry)", aliases: ["tandoori chicken morsels"],
        proteinPer100g: 22, carbsPer100g: 3, fatPer100g: 5, fiberPer100g: 0.5, sodiumMg: 400,
        category: "protein", commonPortions: { "6 pieces (150g)": 150, "100g": 100 }, source: "Nutritionix"
    },
    "tandoori_chicken": {
        id: "tandoori_chicken", name: "Tandoori Chicken (Bone-in)", aliases: ["roasted indian chicken"],
        proteinPer100g: 20, carbsPer100g: 2, fatPer100g: 7, fiberPer100g: 0, sodiumMg: 450,
        category: "protein", commonPortions: { "1 leg/thigh (150g)": 150, "100g": 100 }, source: "Nutritionix"
    },

    // More Middle Eastern
    "hummus_pita": {
        id: "hummus_pita", name: "Hummus with Pita Break", aliases: ["pita dip"],
        proteinPer100g: 8, carbsPer100g: 35, fatPer100g: 10, fiberPer100g: 4, sodiumMg: 450,
        category: "prepared", commonPortions: { "1 serving (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "shish_tawook": {
        id: "shish_tawook", name: "Shish Tawook (Chicken Skewer)", aliases: ["lebanese chicken skewer"],
        proteinPer100g: 20, carbsPer100g: 2, fatPer100g: 6, fiberPer100g: 0, sodiumMg: 350,
        category: "protein", commonPortions: { "2 skewers (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "fattoush": {
        id: "fattoush", name: "Fattoush Salad", aliases: ["lebanese salad with pita"],
        proteinPer100g: 2, carbsPer100g: 12, fatPer100g: 8, fiberPer100g: 2.5, sodiumMg: 250,
        category: "prepared", commonPortions: { "1 bowl (250g)": 250, "100g": 100 }, source: "USDA"
    },

    // More American / Western
    "steak_ribeye": {
        id: "steak_ribeye", name: "Ribeye Steak (Cooked, Trimmed)", aliases: ["beef ribeye", "grilled steak"],
        proteinPer100g: 24, carbsPer100g: 0, fatPer100g: 15, fiberPer100g: 0, sodiumMg: 80,
        category: "protein", commonPortions: { "1 steak (250g)": 250, "100g": 100 }, source: "USDA"
    },
    "mashed_potatoes": {
        id: "mashed_potatoes", name: "Mashed Potatoes (with Butter/Milk)", aliases: ["mash potato"],
        proteinPer100g: 2, carbsPer100g: 15, fatPer100g: 4, fiberPer100g: 1.5, sodiumMg: 300,
        category: "carbs", commonPortions: { "1 cup (210g)": 210, "100g": 100 }, source: "USDA"
    },
    "macadamia_nuts": {
        id: "macadamia_nuts", name: "Macadamia Nuts (Roasted)", aliases: ["hawaiian nut"],
        proteinPer100g: 8, carbsPer100g: 14, fatPer100g: 76, fiberPer100g: 8.5, sodiumMg: 5,
        category: "nut", commonPortions: { "1 oz (28g)": 28, "100g": 100 }, source: "USDA"
    },
    "pine_nuts": {
        id: "pine_nuts", name: "Pine Nuts", aliases: ["pignoli"],
        proteinPer100g: 14, carbsPer100g: 13, fatPer100g: 68, fiberPer100g: 3.5, sodiumMg: 2,
        category: "nut", commonPortions: { "1 oz (28g)": 28, "100g": 100 }, source: "USDA"
    },

    // Smoothies & Shakes
    "smoothie_berry": {
        id: "smoothie_berry", name: "Mixed Berry Smoothie", aliases: ["fruit smoothie"],
        proteinPer100g: 2, carbsPer100g: 15, fatPer100g: 1, fiberPer100g: 2, sugarPer100g: 12, sodiumMg: 30,
        category: "beverage", commonPortions: { "1 cup (240ml)": 240, "100g": 100 }, source: "USDA"
    },
    "smoothie_green": {
        id: "smoothie_green", name: "Green Smoothie (Spinach/Apple/Banana)", aliases: ["detox smoothie"],
        proteinPer100g: 1.5, carbsPer100g: 11, fatPer100g: 0.5, fiberPer100g: 2, sugarPer100g: 8, sodiumMg: 20,
        category: "beverage", commonPortions: { "1 cup (240ml)": 240, "100g": 100 }, source: "USDA"
    },
    "protein_shake_whey": {
        id: "protein_shake_whey", name: "Whey Protein Shake (with Water)", aliases: ["protein water"],
        proteinPer100g: 8, carbsPer100g: 1, fatPer100g: 0.5, fiberPer100g: 0, sodiumMg: 50,
        category: "beverage", commonPortions: { "1 shake (350ml)": 350, "100g": 100 }, source: "USDA"
    },
    "milkshake_chocolate": {
        id: "milkshake_chocolate", name: "Chocolate Milkshake", aliases: ["choc thickshake", "chocolate shake"],
        proteinPer100g: 3.5, carbsPer100g: 22, fatPer100g: 6, fiberPer100g: 0.5, sugarPer100g: 18, sodiumMg: 120,
        category: "dessert", commonPortions: { "1 medium (350ml)": 350, "100g": 100 }, source: "USDA"
    },

    // Additional Fruits & Veg
    "grapefruit": {
        id: "grapefruit", name: "Grapefruit (Raw)", aliases: ["pink grapefruit"],
        proteinPer100g: 0.8, carbsPer100g: 10.7, fatPer100g: 0.1, fiberPer100g: 1.6, sugarPer100g: 7, sodiumMg: 0,
        category: "fruit", commonPortions: { "1/2 grapefruit (123g)": 123, "100g": 100 }, source: "USDA"
    },
    "peach": {
        id: "peach", name: "Peach (Raw)", aliases: ["fresh peach"],
        proteinPer100g: 0.9, carbsPer100g: 9.5, fatPer100g: 0.3, fiberPer100g: 1.5, sugarPer100g: 8, sodiumMg: 0,
        category: "fruit", commonPortions: { "1 medium (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "plum": {
        id: "plum", name: "Plum (Raw)", aliases: ["fresh plum"],
        proteinPer100g: 0.7, carbsPer100g: 11.4, fatPer100g: 0.3, fiberPer100g: 1.4, sugarPer100g: 10, sodiumMg: 0,
        category: "fruit", commonPortions: { "1 plum (66g)": 66, "100g": 100 }, source: "USDA"
    },
    "apricot": {
        id: "apricot", name: "Apricot (Raw)", aliases: ["fresh apricot"],
        proteinPer100g: 1.4, carbsPer100g: 11, fatPer100g: 0.4, fiberPer100g: 2, sugarPer100g: 9, sodiumMg: 1,
        category: "fruit", commonPortions: { "1 apricot (35g)": 35, "100g": 100 }, source: "USDA"
    },
    "cantaloupe": {
        id: "cantaloupe", name: "Cantaloupe / Rockmelon (Raw)", aliases: ["rock melon", "muskmelon"],
        proteinPer100g: 0.8, carbsPer100g: 8.2, fatPer100g: 0.2, fiberPer100g: 0.9, sugarPer100g: 8, sodiumMg: 16,
        category: "fruit", commonPortions: { "1 cup cubed (160g)": 160, "1 wedge (69g)": 69 }, source: "USDA"
    },
    "honeydew": {
        id: "honeydew", name: "Honeydew Melon (Raw)", aliases: ["honeydew melon"],
        proteinPer100g: 0.5, carbsPer100g: 9.1, fatPer100g: 0.1, fiberPer100g: 0.8, sugarPer100g: 8, sodiumMg: 18,
        category: "fruit", commonPortions: { "1 cup cubed (170g)": 170, "1 wedge (125g)": 125 }, source: "USDA"
    },
    "artichoke": {
        id: "artichoke", name: "Artichoke (Boiled)", aliases: ["globe artichoke"],
        proteinPer100g: 2.9, carbsPer100g: 11.9, fatPer100g: 0.3, fiberPer100g: 5.4, sugarPer100g: 1, sodiumMg: 94,
        category: "vegetable", commonPortions: { "1 medium (120g)": 120, "100g": 100 }, source: "USDA"
    },
    "asparagus": {
        id: "asparagus", name: "Asparagus (Cooked)", aliases: ["grilled asparagus", "steamed asparagus"],
        proteinPer100g: 2.4, carbsPer100g: 4.1, fatPer100g: 0.2, fiberPer100g: 2, sugarPer100g: 1.3, sodiumMg: 14,
        category: "vegetable", commonPortions: { "4 spears (60g)": 60, "1 cup (180g)": 180 }, source: "USDA"
    },
    "brussels_sprouts": {
        id: "brussels_sprouts", name: "Brussels Sprouts (Cooked)", aliases: ["roasted brussels"],
        proteinPer100g: 2.6, carbsPer100g: 7.1, fatPer100g: 0.5, fiberPer100g: 2.6, sugarPer100g: 1.7, sodiumMg: 21,
        category: "vegetable", commonPortions: { "1 cup (156g)": 156, "100g": 100 }, source: "USDA"
    },
    "celery": {
        id: "celery", name: "Celery (Raw)", aliases: ["celery sticks"],
        proteinPer100g: 0.7, carbsPer100g: 3, fatPer100g: 0.2, fiberPer100g: 1.6, sugarPer100g: 1.3, sodiumMg: 80,
        category: "vegetable", commonPortions: { "1 large stalk (64g)": 64, "1 cup chopped (101g)": 101 }, source: "USDA"
    },
    "radish": {
        id: "radish", name: "Radish (Raw)", aliases: ["salad radish"],
        proteinPer100g: 0.7, carbsPer100g: 3.4, fatPer100g: 0.1, fiberPer100g: 1.6, sugarPer100g: 1.9, sodiumMg: 39,
        category: "vegetable", commonPortions: { "1 large (9g)": 9, "1 cup sliced (116g)": 116 }, source: "USDA"
    },
    
    // Some basic baking & pantry
    "flour_all_purpose": {
        id: "flour_all_purpose", name: "All-Purpose Flour (Wheat)", aliases: ["white flour", "ap flour"],
        proteinPer100g: 10, carbsPer100g: 76, fatPer100g: 1, fiberPer100g: 2.7, sugarPer100g: 0.3, sodiumMg: 2,
        category: "grain", commonPortions: { "1 cup (125g)": 125, "1 tbsp (8g)": 8 }, source: "USDA"
    },
    "sugar_white": {
        id: "sugar_white", name: "White Sugar (Granulated)", aliases: ["table sugar", "cane sugar"],
        proteinPer100g: 0, carbsPer100g: 100, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 100, sodiumMg: 1,
        category: "condiment", commonPortions: { "1 tbsp (12.5g)": 12.5, "1 tsp (4.2g)": 4.2 }, source: "USDA"
    },
    "sugar_brown": {
        id: "sugar_brown", name: "Brown Sugar", aliases: ["dark brown sugar", "light brown sugar"],
        proteinPer100g: 0.1, carbsPer100g: 98, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 97, sodiumMg: 28,
        category: "condiment", commonPortions: { "1 tbsp unpacked (11g)": 11, "1 cup packed (220g)": 220 }, source: "USDA"
    },
    "salt_table": {
        id: "salt_table", name: "Table Salt", aliases: ["iodized salt", "sodium chloride"],
        proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 0, sodiumMg: 38758,
        category: "condiment", commonPortions: { "1 tsp (6g)": 6, "1 packet (1g)": 1 }, source: "USDA"
    },
    "ketchup": {
        id: "ketchup", name: "Tomato Ketchup", aliases: ["catsup", "tomato sauce packet"],
        proteinPer100g: 1, carbsPer100g: 27, fatPer100g: 0.1, fiberPer100g: 0.3, sugarPer100g: 22, sodiumMg: 900,
        category: "condiment", commonPortions: { "1 tbsp (17g)": 17, "1 packet (9g)": 9 }, source: "USDA"
    },
    "mustard": {
        id: "mustard", name: "Yellow Mustard", aliases: ["mustard sauce"],
        proteinPer100g: 4.4, carbsPer100g: 5.8, fatPer100g: 3.3, fiberPer100g: 1.8, sugarPer100g: 0.9, sodiumMg: 1100,
        category: "condiment", commonPortions: { "1 packet (5g)": 5, "1 tbsp (15g)": 15 }, source: "USDA"
    },
// Healthy / Vegan / Specialty
    "tofu_scramble": {
        id: "tofu_scramble", name: "Tofu Scramble (Vegan)", aliases: ["vegan eggs", "scrambled tofu"],
        proteinPer100g: 14, carbsPer100g: 4, fatPer100g: 10, fiberPer100g: 2, sodiumMg: 250,
        category: "protein", commonPortions: { "1 cup (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "tempeh": {
        id: "tempeh", name: "Tempeh (Cooked)", aliases: ["fermented soy", "soycake"],
        proteinPer100g: 20, carbsPer100g: 9, fatPer100g: 11, fiberPer100g: 9, sodiumMg: 15,
        category: "protein", commonPortions: { "1 cup (166g)": 166, "1/2 cup (83g)": 83 }, source: "USDA"
    },
    "seitan": {
        id: "seitan", name: "Seitan (Wheat Meat)", aliases: ["mock meat", "wheat gluten"],
        proteinPer100g: 75, carbsPer100g: 14, fatPer100g: 2, fiberPer100g: 0.5, sodiumMg: 29,
        category: "protein", commonPortions: { "3 oz (85g)": 85, "100g": 100 }, source: "USDA"
    },
    "quinoa_salad": {
        id: "quinoa_salad", name: "Quinoa Salad (with Veggies)", aliases: ["superfood salad"],
        proteinPer100g: 5, carbsPer100g: 20, fatPer100g: 8, fiberPer100g: 3, sodiumMg: 200,
        category: "prepared", commonPortions: { "1 cup (180g)": 180, "100g": 100 }, source: "USDA"
    },
    "kale_salad": {
        id: "kale_salad", name: "Kale Salad (with Vinaigrette)", aliases: ["raw kale salad"],
        proteinPer100g: 3, carbsPer100g: 10, fatPer100g: 12, fiberPer100g: 3, sodiumMg: 250,
        category: "prepared", commonPortions: { "1 bowl (150g)": 150, "100g": 100 }, source: "USDA"
    },
    "chia_pudding": {
        id: "chia_pudding", name: "Chia Seed Pudding", aliases: ["vegan pudding"],
        proteinPer100g: 5, carbsPer100g: 12, fatPer100g: 9, fiberPer100g: 8, sugarPer100g: 5, sodiumMg: 50,
        category: "dessert", commonPortions: { "1 jar (200g)": 200, "100g": 100 }, source: "USDA"
    },
    "matcha_latte": {
        id: "matcha_latte", name: "Matcha Latte (Oat Milk)", aliases: ["green tea latte"],
        proteinPer100g: 1.5, carbsPer100g: 9, fatPer100g: 2, fiberPer100g: 0.5, sugarPer100g: 5, sodiumMg: 45,
        category: "beverage", commonPortions: { "1 cup (240ml)": 240, "100g": 100 }, source: "USDA"
    },
    "oat_milk": {
        id: "oat_milk", name: "Oat Milk (Unsweetened)", aliases: ["vegan milk", "dairy free milk oat"],
        proteinPer100g: 1.2, carbsPer100g: 6.5, fatPer100g: 1.5, fiberPer100g: 0.8, sugarPer100g: 1, sodiumMg: 40,
        category: "dairy", commonPortions: { "1 cup (240ml)": 240, "100g": 100 }, source: "USDA"
    },
    "almond_milk": {
        id: "almond_milk", name: "Almond Milk (Unsweetened)", aliases: ["dairy free milk almond"],
        proteinPer100g: 0.5, carbsPer100g: 1.5, fatPer100g: 1.2, fiberPer100g: 0.4, sugarPer100g: 0, sodiumMg: 65,
        category: "dairy", commonPortions: { "1 cup (240ml)": 240, "100g": 100 }, source: "USDA"
    },
    "soy_milk": {
        id: "soy_milk", name: "Soy Milk (Unsweetened)", aliases: ["vegan bean milk"],
        proteinPer100g: 3.3, carbsPer100g: 1.8, fatPer100g: 1.8, fiberPer100g: 0.6, sugarPer100g: 0.4, sodiumMg: 47,
        category: "dairy", commonPortions: { "1 cup (240ml)": 240, "100g": 100 }, source: "USDA"
    },

    // More Snacks / Confectionary
    "pretzels": {
        id: "pretzels", name: "Pretzels (Hard, Salty)", aliases: ["snack pretzels"],
        proteinPer100g: 10, carbsPer100g: 80, fatPer100g: 2.5, fiberPer100g: 3, sugarPer100g: 2, sodiumMg: 1200,
        category: "snack", commonPortions: { "1 oz (28g)": 28, "100g": 100 }, source: "USDA"
    },
    "tortilla_chips": {
        id: "tortilla_chips", name: "Tortilla Chips (Corn)", aliases: ["corn chips", "nacho chips"],
        proteinPer100g: 7, carbsPer100g: 64, fatPer100g: 21, fiberPer100g: 5, sugarPer100g: 1, sodiumMg: 350,
        category: "snack", commonPortions: { "1 oz (28g)": 28, "100g": 100 }, source: "USDA"
    },
    "peanut_butter_cups": {
        id: "peanut_butter_cups", name: "Chocolate Peanut Butter Cups", aliases: ["reeses", "choc PB bar"],
        proteinPer100g: 10, carbsPer100g: 55, fatPer100g: 30, fiberPer100g: 4, sugarPer100g: 45, sodiumMg: 300,
        category: "dessert", commonPortions: { "2 cups (42g)": 42, "100g": 100 }, source: "USDA"
    },
    "gummy_bears": {
        id: "gummy_bears", name: "Gummy Bears", aliases: ["fruit gummies", "gummy worms"],
        proteinPer100g: 5, carbsPer100g: 75, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 50, sodiumMg: 50,
        category: "dessert", commonPortions: { "1 oz (28g)": 28, "100g": 100 }, source: "USDA"
    },
    "marshmallows": {
        id: "marshmallows", name: "Marshmallows", aliases: ["fluff", "s'mores marsh"],
        proteinPer100g: 2, carbsPer100g: 80, fatPer100g: 0.2, fiberPer100g: 0.1, sugarPer100g: 57, sodiumMg: 80,
        category: "dessert", commonPortions: { "1 oz (28g)": 28, "1 cup (50g)": 50 }, source: "USDA"
    },

    // More Basic Meats & Seafood
    "scallops": {
        id: "scallops", name: "Scallops (Cooked)", aliases: ["seared scallops"],
        proteinPer100g: 20, carbsPer100g: 5, fatPer100g: 1, fiberPer100g: 0, sodiumMg: 260,
        category: "protein", commonPortions: { "3 oz (85g)": 85, "100g": 100 }, source: "USDA"
    },
    "crab_meat": {
        id: "crab_meat", name: "Crab Meat (Cooked)", aliases: ["lump crab", "king crab"],
        proteinPer100g: 19, carbsPer100g: 0, fatPer100g: 1.5, fiberPer100g: 0, sodiumMg: 395,
        category: "protein", commonPortions: { "3 oz (85g)": 85, "100g": 100 }, source: "USDA"
    },
    "lobster": {
        id: "lobster", name: "Lobster (Cooked)", aliases: ["lobster tail", "boiled lobster"],
        proteinPer100g: 19, carbsPer100g: 1, fatPer100g: 1.2, fiberPer100g: 0, sodiumMg: 480,
        category: "protein", commonPortions: { "3 oz (85g)": 85, "100g": 100 }, source: "USDA"
    },
    "oysters_raw": {
        id: "oysters_raw", name: "Oysters (Raw)", aliases: ["raw oysters", "half shell"],
        proteinPer100g: 9, carbsPer100g: 5, fatPer100g: 2.5, fiberPer100g: 0, sodiumMg: 211,
        category: "protein", commonPortions: { "6 medium (84g)": 84, "100g": 100 }, source: "USDA"
    },
    "trout_cooked": {
        id: "trout_cooked", name: "Trout (Cooked)", aliases: ["rainbow trout", "grilled trout"],
        proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 8, fiberPer100g: 0, sodiumMg: 60,
        category: "protein", commonPortions: { "1 fillet (150g)": 150, "100g": 100 }, source: "USDA"
    },

    // A few more veggies & sides
    "green_beans": {
        id: "green_beans", name: "Green Beans (Cooked)", aliases: ["string beans", "snap beans"],
        proteinPer100g: 1.9, carbsPer100g: 7, fatPer100g: 0.1, fiberPer100g: 3.2, sugarPer100g: 1.6, sodiumMg: 1,
        category: "vegetable", commonPortions: { "1 cup (125g)": 125, "100g": 100 }, source: "USDA"
    },
    "snow_peas": {
        id: "snow_peas", name: "Snow Peas (Raw)", aliases: ["mange tout", "sugar snap peas"],
        proteinPer100g: 2.8, carbsPer100g: 7.5, fatPer100g: 0.2, fiberPer100g: 2.6, sugarPer100g: 4, sodiumMg: 4,
        category: "vegetable", commonPortions: { "1 cup (98g)": 98, "100g": 100 }, source: "USDA"
    },
    "bamboo_shoots": {
        id: "bamboo_shoots", name: "Bamboo Shoots (Canned)", aliases: ["canned shoots"],
        proteinPer100g: 1.7, carbsPer100g: 3.2, fatPer100g: 0.4, fiberPer100g: 1.4, sugarPer100g: 1.3, sodiumMg: 9,
        category: "vegetable", commonPortions: { "1 cup (131g)": 131, "100g": 100 }, source: "USDA"
    },
    "water_chestnuts": {
        id: "water_chestnuts", name: "Water Chestnuts (Canned)", aliases: ["chinese water chestnuts"],
        proteinPer100g: 0.9, carbsPer100g: 12.2, fatPer100g: 0.1, fiberPer100g: 3, sugarPer100g: 2.3, sodiumMg: 14,
        category: "vegetable", commonPortions: { "1/2 cup (70g)": 70, "100g": 100 }, source: "USDA"
    },
    "bok_choy": {
        id: "bok_choy", name: "Bok Choy (Cooked)", aliases: ["pak choi", "chinese cabbage"],
        proteinPer100g: 1.6, carbsPer100g: 2.4, fatPer100g: 0.2, fiberPer100g: 1.2, sugarPer100g: 1, sodiumMg: 34,
        category: "vegetable", commonPortions: { "1 cup (170g)": 170, "100g": 100 }, source: "USDA"
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
