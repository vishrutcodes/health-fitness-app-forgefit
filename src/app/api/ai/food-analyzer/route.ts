import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { LOCAL_NUTRITION_DB } from "@/lib/nutrition-db";

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
                        {
                            type: "text",
                            text: `You are an expert nutritionist and computer vision AI. Analyze this image of a plate of food.

TASK: Identify every distinct food item on the plate and strictly estimate its weight in grams.

You MUST respond in EXACTLY this JSON format, nothing else:
[
  {
    "name": "<Standard name of the food item>",
    "weight_g": <Estimated weight in grams>
  }
]

RULES:
- "name" should be the basic ingredient name (e.g., "Apple", "Chicken Breast", "Brown Rice", "Olive Oil", "Walnuts").
- Be incredibly observant. Look for hidden calories like oils, sauces, or butter that might be mixed in.
- "weight_g" must be a number representing your best anatomical estimate of the volume in grams based on plate size.
- If you see nothing resembling food, return an empty array [].
- Respond with ONLY the JSON array, no markdown formatting (\`\`\`json), no backticks, no explanation. Just the raw array.`,
                        },
                        {
                            type: "image_url",
                            image_url: { url: image },
                        }
                    ],
                },
            ],
            temperature: 0.1,
            max_tokens: 512,
        });

        const rawResponse = completion.choices[0]?.message?.content || "[]";

        // Parse the JSON response
        try {
            let cleaned = rawResponse.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }

            const parsedItems: { name: string, weight_g: number }[] = JSON.parse(cleaned);
            
            if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
                 return NextResponse.json({
                    totalMacros: { calories: 0, protein: 0, carbs: 0, fats: 0 },
                    items: [],
                    message: "No recognizable food items found."
                });
            }

            // Calculate macros strictly using our deterministic database
            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFats = 0;
            
            const detailedItems = parsedItems.map(item => {
                // Find the closest match in our DB by scanning keys/names
                const searchTerm = item.name.toLowerCase();
                let bestMatchKey = null;

                for (const key of Object.keys(LOCAL_NUTRITION_DB)) {
                    const dbItem = LOCAL_NUTRITION_DB[key];
                    if (dbItem.name.toLowerCase().includes(searchTerm) || searchTerm.includes(dbItem.name.toLowerCase())) {
                        bestMatchKey = key;
                        break;
                    }
                }
                
                if (bestMatchKey) {
                    const dbMatch = LOCAL_NUTRITION_DB[bestMatchKey];
                    // Calculate exact macros based on the detected weight
                    const multiplier = item.weight_g / 100;
                    const cals = Math.round((dbMatch.proteinPer100g * 4 + dbMatch.carbsPer100g * 4 + dbMatch.fatPer100g * 9) * multiplier);
                    const pro = Math.round(dbMatch.proteinPer100g * multiplier * 10) / 10;
                    const car = Math.round(dbMatch.carbsPer100g * multiplier * 10) / 10;
                    const fat = Math.round(dbMatch.fatPer100g * multiplier * 10) / 10;
                    
                    totalCalories += cals;
                    totalProtein += pro;
                    totalCarbs += car;
                    totalFats += fat;
                    
                    return {
                        name: dbMatch.name, // Use the DB's official name
                        detectedName: item.name,
                        weight_g: item.weight_g,
                        calories: cals,
                        protein: pro,
                        carbs: car,
                        fats: fat,
                        matched: true
                    };
                } else {
                    // If no match in DB, we still include it but signal it's unmatched
                    return {
                        name: item.name,
                        detectedName: item.name,
                        weight_g: item.weight_g,
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fats: 0,
                        matched: false
                    };
                }
            });

            return NextResponse.json({
                totalMacros: {
                    calories: totalCalories,
                    protein: Math.round(totalProtein * 10) / 10,
                    carbs: Math.round(totalCarbs * 10) / 10,
                    fats: Math.round(totalFats * 10) / 10
                },
                items: detailedItems
            });

        } catch (parseErr) {
            console.error("[FoodScanner API] Failed to parse Groq response:", rawResponse);
            return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
        }
    } catch (error: unknown) {
        console.error("[FoodScanner API] Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Groq Vision API failed: ${message}` },
            { status: 500 }
        );
    }
}
