export const BATCH2_FOODS: Record<string, any> = {
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
    }
};
