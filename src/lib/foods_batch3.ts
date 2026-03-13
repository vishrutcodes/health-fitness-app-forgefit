export const BATCH3_FOODS: Record<string, any> = {
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
    }
};
