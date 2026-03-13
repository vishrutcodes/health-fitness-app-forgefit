export const BATCH1_FOODS: Record<string, any> = {
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
};
