import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { LOCAL_NUTRITION_DB, getFoodCatalog, calculateCalories } from "@/lib/nutrition-db";
import { findBestMatch, findTopMatches, detectCookingMethod } from "@/lib/food-matcher";

const SYSTEM_PROMPT = `You are a world-class Food Forensics Expert and AI Nutritionist with encyclopedic knowledge of 200+ global cuisines.
Your task is to analyze an image of food and identify EVERY distinct ingredient, including hidden ones like cooking oils, sauces, dressings, and garnishes.

CRITICAL INSTRUCTIONS:
1. Estimate the TOTAL weight in grams for ALL pieces of that item combined based on visual references.
2. Detect the cooking method if visible (fried, grilled, steamed, baked, raw, roasted, braised, smoked).
3. Assign a confidence score (0 to 1) for your identification of the item.
4. Provide AI-estimated macros PER 100g for ANY food item. Do your best to estimate these scientifically.
5. ALWAYS return estimatedMacrosPer100g even when you provide a food_id — this serves as a fallback validation.

PORTION ESTIMATION CALIBRATION (VERY IMPORTANT):
Use these reference objects to calibrate your weight estimates:
- Standard dinner plate diameter: ~26cm (10 inches)
- Standard bowl: ~15cm diameter, 350ml capacity
- Palm-sized piece of protein: ~100g
- Fist-sized amount of carbs (rice/pasta): ~150g cooked
- Thumb-sized piece of fat/cheese: ~15g
- Cupped hand of snacks/nuts: ~30g
- Standard slice of bread: ~25-30g
- 1 chapati/roti: ~40g, 1 naan: ~90g
- Tea/coffee cup: ~200-240ml
- If you see a standard Indian thali plate, each katori (small bowl) holds ~120-150g of curry/dal

VISUAL ANALYSIS METHODOLOGY:
Before naming each food, mentally note:
- Color palette (saffron yellow? soy sauce brown? tomato red? cream white?)
- Texture (crispy? layered? smooth gravy? dry? wet?)
- Shape and presentation (flat? mounded? skewered? in a bowl?)
- Garnishes and accompaniments (fried onions? cilantro? sesame? lime?)
- Plate/vessel type (thali? ceramic? banana leaf? bowl? takeout box?)

CULTURAL AWARENESS — COMMONLY CONFUSED FOODS:
| Often Misidentified As | Correct Identification | Key Visual Difference |
|------------------------|------------------------|----------------------|
| Chicken Fried Rice | Chicken Biryani | Saffron layers, whole spices, fried onions, no soy sauce |
| Fried Rice | Pulao / Pilaf | Lighter color, distinct grain separation, whole spices |
| Pancake | Dosa | Thin, crispy, golden, large diameter, rice batter |
| Flatbread | Naan | Charred bubbles, teardrop shape, thick & fluffy |
| Flatbread | Roti/Chapati | Thin, round, no char marks, brown spots |
| Flatbread | Paratha | Layered/flaky, golden, sometimes stuffed |
| Wrap | Burrito | Thick flour tortilla, cylindrical, sealed ends |
| Stew | Curry | Rich spiced gravy, bright colors (red/yellow/green) |
| Dumpling | Momo | Pleated top, Nepali/Tibetan style, steamed or fried |
| Dumpling | Gyoza | Crescent shape, crispy bottom, pan-fried |
| Dumpling | Dim Sum | Various shapes, bamboo steamer |
| Soup | Ramen | Visible noodles, rich broth, specific toppings (egg, nori, chashu) |
| Soup | Pho | Clear broth, fresh herbs, rice noodles, bean sprouts |
| Soup | Laksa | Coconut curry broth, thick noodles |
| Rice Bowl | Bibimbap | Colorful toppings arranged in sections, gochujang, egg on top |
| Pasta | Chow Mein / Lo Mein | Asian noodles, stir-fried, soy-based sauce |
| Grilled Meat | Kebab/Tikka | Marinated (red/orange tandoori color), skewered |
| Grilled Meat | Satay | Small skewers, peanut sauce, Southeast Asian |
| Grilled Meat | Suya | West African spice coating, small pieces on sticks |
| Cake | Tiramisu | Layers of coffee-soaked ladyfingers + mascarpone |
| Ice Cream | Gelato | Denser, often served in a flat tray not scooped high |
| Fried Snack | Samosa | Triangular shape, pastry shell, potato filling |
| Fried Snack | Spring Roll | Cylindrical, thin crispy wrapper |
| Fried Snack | Empanada | Half-moon shape, thicker crust, crimped edges |
| Lentil Dish | Dal Makhani | Creamy black dal with butter |
| Lentil Dish | Dal Tadka | Yellow lentils with tempering (tadka) |
| Cottage Cheese Curry | Palak Paneer | Green spinach gravy with white paneer cubes |
| Chickpea Dish | Chole/Chana Masala | Brown gravy, whole chickpeas visible |
| Rice Cake | Idli | White, round, soft, spongy, steamed |
| Rice Cake | Tteokbokki | Korean, cylindrical, in red sauce |
| Steamed Bun | Vada Pav | Fried potato ball in a bread bun, Indian |
| Coffee | Cappuccino | Foam art, smaller cup, 1/3 espresso + 1/3 steam + 1/3 foam |
| Coffee | Latte | Larger cup, more milk, thinner foam layer |

Try to find the closest match from this database of known foods. If you find a very close match, output its exact ID in the "food_id" field. If there's no good match, leave "food_id" null.
--- DATABASE CATALOG ---
${getFoodCatalog()}
-------------------------

You MUST respond in EXACTLY this JSON format, nothing else. Do not use markdown blocks (\`\`\`json). Just the raw array.
[
  {
    "name": "<Descriptive name of the food>",
    "food_id": "<Exact ID from the catalog if matched, otherwise null>",
    "quantity": <Count of items, eg 2>,
    "weight_g": <Total estimated weight in grams>,
    "cookingMethod": "<fried|grilled|steamed|raw|baked|roasted|braised|smoked|none>",
    "confidence": <0.0 to 1.0>,
    "category": "<protein|carbs|fat|dairy|fruit|vegetable|condiment|grain|legume|nut|beverage|dessert|prepared|snack>",
    "estimatedMacrosPer100g": {
        "protein": <number>,
        "carbs": <number>,
        "fat": <number>,
        "fiber": <number>,
        "sugar": <number>,
        "sodiumMg": <number>
    }
  }
]`;

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided." }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: SYSTEM_PROMPT },
                        { type: "image_url", image_url: { url: image } }
                    ]
                }
            ],
            temperature: 0.1,
            max_tokens: 2500,
        });

        const rawResponse = completion.choices[0]?.message?.content || "[]";

        // Parse JSON
        let parsedItems: any[] = [];
        try {
            let cleaned = rawResponse.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }
            parsedItems = JSON.parse(cleaned);
            if (!Array.isArray(parsedItems)) parsedItems = [];
        } catch (parseErr) {
            console.error("[FoodScanner API] Failed to parse Groq response:", rawResponse);
            return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
        }

        if (parsedItems.length === 0) {
            return NextResponse.json({
                totalMacros: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodiumMg: 0 },
                items: [],
                message: "No recognizable food items found."
            });
        }

        // Pass 2: Server-side processing with Advanced Fuzzy Matcher v2
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let totalFiber = 0;
        let totalSugar = 0;
        let totalSodium = 0;

        const detailedItems = parsedItems.map(item => {
            const weightMultiplier = (item.weight_g || 100) / 100;
            const fallbackMethod = detectCookingMethod(item.name);
            const method = item.cookingMethod !== "none" ? item.cookingMethod : fallbackMethod;

            // Step 1: Check if the AI provided a valid DB ID
            let match = null;
            if (item.food_id && LOCAL_NUTRITION_DB[item.food_id]) {
                match = {
                    food: LOCAL_NUTRITION_DB[item.food_id],
                    confidence: item.confidence || 0.9,
                    matched: true,
                    source: LOCAL_NUTRITION_DB[item.food_id].source
                };
            }

            // Step 2: Use Advanced Fuzzy Matcher v2 with category hint
            if (!match) {
                const categoryHint = item.category || undefined;
                const topMatches = findTopMatches(item.name, 3, categoryHint);
                const bestFuzzy = topMatches[0];

                if (bestFuzzy.foodId && bestFuzzy.confidence > 0.55) {
                    match = {
                        food: bestFuzzy.food,
                        confidence: Math.max(item.confidence || 0, bestFuzzy.confidence),
                        matched: true,
                        source: bestFuzzy.food.source
                    };
                }
            }

            // Step 3: Multi-pass confidence merging
            // When both AI and fuzzy matcher agree, boost confidence
            // When they disagree, use DB values but lower the confidence
            let pro = 0, car = 0, fat = 0, fib = 0, sug = 0, sod = 0, cals = 0;
            let source = "AI-Estimated";
            let matched = false;
            let displayConfidence = item.confidence || 0.5;

            if (match) {
                // Use DB Verified Macros
                pro = match.food.proteinPer100g * weightMultiplier;
                car = match.food.carbsPer100g * weightMultiplier;
                fat = match.food.fatPer100g * weightMultiplier;
                fib = (match.food.fiberPer100g || 0) * weightMultiplier;
                sug = (match.food.sugarPer100g || 0) * weightMultiplier;
                sod = (match.food.sodiumMg || 0) * weightMultiplier;
                cals = calculateCalories(pro, car, fat);
                source = match.source;
                matched = true;

                // Multi-pass confidence: if AI confidence and matcher confidence are both high, boost
                const aiConf = item.confidence || 0.5;
                const matchConf = match.confidence;
                if (aiConf > 0.8 && matchConf > 0.8) {
                    displayConfidence = Math.min(0.98, (aiConf + matchConf) / 2 + 0.05);
                } else if (aiConf > 0.6 && matchConf > 0.6) {
                    displayConfidence = Math.max(aiConf, matchConf);
                } else {
                    // One of them is low — potential misidentification, use DB but lower confidence
                    displayConfidence = Math.min(aiConf, matchConf) * 0.9 + 0.1;
                }

                // Validate AI estimates against DB if available (detect wild discrepancies)
                if (item.estimatedMacrosPer100g) {
                    const aiP = item.estimatedMacrosPer100g.protein || 0;
                    const dbP = match.food.proteinPer100g;
                    const proteinRatio = dbP > 0 ? Math.abs(aiP - dbP) / dbP : 0;
                    // If AI protein estimate is more than 100% off from DB, lower confidence
                    if (proteinRatio > 1.0) {
                        displayConfidence = Math.max(0.3, displayConfidence - 0.15);
                    }
                }

                item.name = match.food.name; // Use verified name
            } else if (item.estimatedMacrosPer100g) {
                // Use AI Estimated Macros
                pro = (item.estimatedMacrosPer100g.protein || 0) * weightMultiplier;
                car = (item.estimatedMacrosPer100g.carbs || 0) * weightMultiplier;
                fat = (item.estimatedMacrosPer100g.fat || 0) * weightMultiplier;
                fib = (item.estimatedMacrosPer100g.fiber || 0) * weightMultiplier;
                sug = (item.estimatedMacrosPer100g.sugar || 0) * weightMultiplier;
                sod = (item.estimatedMacrosPer100g.sodiumMg || 0) * weightMultiplier;
                cals = calculateCalories(pro, car, fat);
            }

            totalCalories += cals;
            totalProtein += pro;
            totalCarbs += car;
            totalFats += fat;
            totalFiber += fib;
            totalSugar += sug;
            totalSodium += sod;

            return {
                name: item.name,
                detectedName: item.name,
                quantity: item.quantity || 1,
                weight_g: item.weight_g || 100,
                calories: Math.round(cals),
                protein: Math.round(pro * 10) / 10,
                carbs: Math.round(car * 10) / 10,
                fats: Math.round(fat * 10) / 10,
                fiber: Math.round(fib * 10) / 10,
                sugar: Math.round(sug * 10) / 10,
                sodiumMg: Math.round(sod),
                cookingMethod: method,
                confidence: Number(displayConfidence.toFixed(2)),
                matched,
                source
            };
        });

        return NextResponse.json({
            totalMacros: {
                calories: Math.round(totalCalories),
                protein: Math.round(totalProtein * 10) / 10,
                carbs: Math.round(totalCarbs * 10) / 10,
                fats: Math.round(totalFats * 10) / 10,
                fiber: Math.round(totalFiber * 10) / 10,
                sugar: Math.round(totalSugar * 10) / 10,
                sodiumMg: Math.round(totalSodium)
            },
            items: detailedItems
        });
    } catch (error: any) {
        console.error("[FoodScanner API] Error:", error);
        return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
    }
}
