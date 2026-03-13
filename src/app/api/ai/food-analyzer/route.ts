import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { LOCAL_NUTRITION_DB, getFoodCatalog, calculateCalories } from "@/lib/nutrition-db";
import { findBestMatch, detectCookingMethod } from "@/lib/food-matcher";

const SYSTEM_PROMPT = `You are a world-class Food Forensics Expert and AI Nutritionist with deep knowledge of global cuisines.
Your task is to analyze an image of food and identify EVERY distinct ingredient, including hidden ones like cooking oils, sauces, or dressings.

CRITICAL INSTRUCTIONS:
1. Estimate the TOTAL weight in grams for ALL pieces of that item combined based on visual references (plate/bowl size).
2. Detect the cooking method if visible (fried, grilled, steamed, baked, raw).
3. Assign a confidence score (0 to 1) for your identification of the item.
4. Provide AI-estimated macros PER 100g for ANY food item. Do your best to estimate these scientifically.

CULTURAL AWARENESS (VERY IMPORTANT):
You MUST correctly identify foods from ALL cuisines. Pay attention to:
- **Indian cuisine**: Biryani is NOT fried rice. Biryani has layered long-grain basmati rice with saffron/turmeric (yellow-white layers), whole spices (cardamom, cinnamon sticks, bay leaves), and marinated meat. Fried rice has shorter grain rice, soy sauce (darker uniform color), and stir-fried vegetables.
- **Visual cues for Biryani**: Yellow/orange saffron-tinted rice, garnished with fried onions (birista), mint/cilantro, whole spices visible, often served in a deep dish/handi.
- **Visual cues for Fried Rice**: Uniform color (often brown from soy sauce), visible wok-tossed vegetables (peas, carrots, corn), scrambled egg pieces, no whole spices.
- Distinguish: Pulao vs Biryani vs Fried Rice — all are rice dishes but they are very different.
- Distinguish: Naan vs Roti vs Paratha — naan is thick/fluffy/charred, roti is thin/flat, paratha is layered/flaky.
- Distinguish: Dosa vs Crepe vs Pancake — dosa is thin/crispy/golden from rice batter, crepes are delicate, pancakes are fluffy/thick.
- Distinguish: Samosa vs Spring Roll vs Empanada — different shapes, doughs, and fillings.
- Distinguish: Tikka vs Kebab vs Grilled meat — tikka has tandoori red/orange marinade.
- Distinguish: Curry vs Stew vs Soup — curries have spice-rich thick gravies.

COMMONLY CONFUSED FOODS — PAY EXTRA ATTENTION:
| Often Misidentified As | Correct Identification | Key Visual Difference |
|------------------------|------------------------|----------------------|
| Chicken Fried Rice | Chicken Biryani | Saffron layers, whole spices, fried onions, no soy sauce |
| Pancake | Dosa | Thin, crispy, golden, large diameter |
| Flatbread | Naan | Charred bubbles, teardrop shape, thick |
| Flatbread | Roti/Chapati | Thin, round, no char marks |
| Wrap | Burrito | Thick flour tortilla, cylindrical |
| Stew | Curry | Rich spiced gravy, bright colors |
| Dumpling | Momo | Pleated top, Nepali/Tibetan style |

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
    "cookingMethod": "<fried|grilled|steamed|raw|baked|none>",
    "confidence": <0.0 to 1.0>,
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
            max_tokens: 1500,
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

        // Pass 2: Server-side processing, merging with Fuzzy Matcher
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
                match = { food: LOCAL_NUTRITION_DB[item.food_id], confidence: item.confidence || 0.9, matched: true, source: LOCAL_NUTRITION_DB[item.food_id].source };
            }

            // Step 2: Use Fuzzy Matcher if no exact ID or invalid
            if (!match) {
                const fuzzyResult = findBestMatch(item.name);
                if (fuzzyResult.foodId && fuzzyResult.confidence > 0.6) {
                    match = { 
                        food: fuzzyResult.food, 
                        confidence: Math.max(item.confidence || 0, fuzzyResult.confidence), 
                        matched: true,
                        source: fuzzyResult.food.source
                    };
                }
            }

            // Step 3: Compute macros
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
                displayConfidence = match.confidence;
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
