export const BATCH4_FOODS: Record<string, any> = {
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
