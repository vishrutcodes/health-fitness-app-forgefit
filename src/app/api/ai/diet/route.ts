import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { target_calories, target_protein, target_carbs, target_fat, num_meals, preferences } = await req.json();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert sports nutritionist and registered dietitian. Your task is to generate a highly realistic, delicious, and structurally sound daily meal plan based on the user's exact daily targets.

CRITICAL RULES:
NO EQUAL DIVISION: Do NOT divide the total calories and macros equally across meals. Use a realistic distribution (e.g., Breakfast 25%, Lunch 35%, Dinner 30%, Snack 10% of total daily intake).
COHERENT MEALS: Meals must be real, edible dishes (e.g., 'Grilled Chicken Rice Bowl with Avocado'), not random lists of ingredients.
MACRO MATH MATTERS: The total sum of the meals MUST exactly equal the user's daily target. Furthermore, for every single meal, the math must align: (Protein_g * 4) + (Carbs_g * 4) + (Fat_g * 9) MUST roughly equal the stated calories for that meal.

OUTPUT FORMAT: You must return ONLY valid JSON matching this exact schema:
{
  "meals": [
    { 
      "meal_name": "Breakfast", 
      "dish": "String", 
      "ingredients": ["String"], 
      "protein": Number, 
      "carbs": Number, 
      "fat": Number,
      "calories": Number
    }
  ]
}`
                },
                {
                    role: "user",
                    content: `Target Calories: ${target_calories}
Target Macros: ${target_protein}g P, ${target_carbs}g C, ${target_fat}g F
Number of Meals: ${num_meals}
Preferences/Allergies: ${preferences}`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 2000,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");
        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("AI Diet Generation Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
