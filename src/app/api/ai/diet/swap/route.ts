import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { buildDeterministicMeal, getFoodOptionsForLLM, MealFoodSelection } from "@/lib/diet-algorithm";

export async function POST(req: NextRequest) {
    try {
        const { targetProtein, targetCarbs, targetFat, avoidDish, mealName } = await req.json();

        if (!targetProtein || targetProtein < 0) throw new Error("targetProtein missing or invalid");
        if (targetCarbs === undefined || targetCarbs < 0) throw new Error("targetCarbs missing or invalid");
        if (targetFat === undefined || targetFat < 0) throw new Error("targetFat missing or invalid");

        const foodOptions = getFoodOptionsForLLM();

        // Step 1: LLM picks ONLY food IDs for a replacement meal
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a meal planner. Pick food IDs for ONE replacement meal.

AVAILABLE FOODS:
${foodOptions}

Pick exactly ONE proteinId, ONE carbId, ONE fatId from the lists above.
Make it COMPLETELY DIFFERENT from the dish to avoid.
Give it a dish name and short recipe.

OUTPUT FORMAT - ONLY valid JSON:
{
    "proteinId": "string",
    "carbId": "string",
    "fatId": "string",
    "extras": [],
    "dish": "Dish Name",
    "recipe": "Short cooking instructions."
}`
                },
                {
                    role: "user",
                    content: `Meal: ${mealName || "Meal"}
AVOID this dish: ${avoidDish || "None"}
Pick DIFFERENT foods for a replacement. Only pick food IDs.`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
            max_tokens: 500,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");

        // Step 2: Build selection from LLM output
        const selection: MealFoodSelection = {
            proteinId: String(data.proteinId || "chicken_breast_cooked"),
            carbId: String(data.carbId || "brown_rice_cooked"),
            fatId: String(data.fatId || "peanut_butter"),
            extras: Array.isArray(data.extras) ? data.extras.map(String) : [],
            dish: String(data.dish || "Alternative Meal"),
            recipe: String(data.recipe || "")
        };

        // Step 3: DETERMINISTIC MATH — exact same targets, guaranteed accurate
        const meal = buildDeterministicMeal(
            mealName || "Alternative Meal",
            selection,
            targetProtein,
            targetCarbs,
            targetFat
        );

        return NextResponse.json({ success: true, meal });

    } catch (error: any) {
        console.error("AI Diet Swap Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
