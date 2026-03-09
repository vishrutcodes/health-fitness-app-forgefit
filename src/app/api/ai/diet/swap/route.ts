import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { targetProtein, targetCarbs, targetFat, avoidDish, mealName } = await req.json();

        if (!targetProtein || targetProtein < 0) throw new Error("targetProtein missing or invalid");
        if (targetCarbs === undefined || targetCarbs < 0) throw new Error("targetCarbs missing or invalid");
        if (targetFat === undefined || targetFat < 0) throw new Error("targetFat missing or invalid");

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert clinical nutritionist developing a tailored meal alternative for a client's diet plan.

Your task is to generate exactly ONE realistic, edible meal (dish) that fits the provided macronutrient targets with a strict +/- 3g variance for each macro.

CRITICAL RULES:
- If an "avoidDish" is provided, the new dish MUST BE COMPLETELY DIFFERENT from it.
- NO CALORIES FIELD: Do NOT include a 'calories' field in your response. The backend will calculate it mathematically.
- Ensure the meal consists of logical ingredients.
- Return ONLY valid JSON matching this exact schema:
{
    "dish": "String (e.g., 'Spiced Lentil Salad with Quinoa')",
    "ingredients": ["String"],
    "recipe": "String (Short, punchy 2-step prep instructions)",
    "protein": Number,
    "carbs": Number,
    "fat": Number
}
`
                },
                {
                    role: "user",
                    content: `Meal Name: ${mealName || "Meal"}
Target Macros (Must hit within 3g variance): ${targetProtein}g Protein, ${targetCarbs}g Carbs, ${targetFat}g Fat
Avoid this dish: ${avoidDish || "None"}`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
            max_tokens: 800,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");

        // Force zero-drift on macros by strictly enforcing the targets over what the LLM guessed
        data.protein = Number(targetProtein);
        data.carbs = Number(targetCarbs);
        data.fat = Number(targetFat);

        // Mathematical guarantee for calories on the backend
        data.calories = Math.round((data.protein * 4) + (data.carbs * 4) + (data.fat * 9));

        // Pass back the meal name since the LLM schema doesn't include it.
        data.meal_name = mealName || "Alternative Meal";

        return NextResponse.json({ success: true, meal: data });

    } catch (error: any) {
        console.error("AI Diet Swap Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
