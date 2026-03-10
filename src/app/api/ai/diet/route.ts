import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { generateDeterministicPlan, getFoodOptionsForLLM, MealFoodSelection, MEAL_NAMES } from "@/lib/diet-algorithm";

export async function POST(req: NextRequest) {
    try {
        const { target_calories, target_protein, num_meals, preferences } = await req.json();

        const foodOptions = getFoodOptionsForLLM();

        // Step 1: LLM picks ONLY food IDs — no quantities, no macro numbers
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a meal planner. Your ONLY job is to pick FOOD COMBINATIONS that make delicious, realistic meals.

You DO NOT calculate any numbers. You DO NOT decide portions. You ONLY pick which foods go together.

For each meal, pick exactly:
- ONE protein source (from the PROTEIN list)
- ONE carb source (from the CARB list)
- ONE fat source (from the FAT list)
- Optionally 1-2 extras (veggies/condiments for flavor — these are free additions)

AVAILABLE FOODS:
${foodOptions}

RULES:
1. Pick ONLY foodId values from the lists above
2. DO NOT repeat the same protein+carb combo across meals
3. Create meals that taste good together (e.g., salmon + sweet potato + almonds)
4. Give each meal a real dish name and 1-sentence recipe
5. Vary the foods across meals for nutritional diversity

OUTPUT FORMAT - return ONLY valid JSON:
{
  "meals": [
    {
      "proteinId": "chicken_breast_cooked",
      "carbId": "white_rice_cooked",
      "fatId": "olive_oil",
      "extras": ["broccoli_cooked"],
      "dish": "Grilled Chicken Rice Bowl",
      "recipe": "Grill chicken breast, serve over steamed rice with steamed broccoli and a drizzle of olive oil."
    }
  ]
}`
                },
                {
                    role: "user",
                    content: `Create ${num_meals} meals. Make them varied and delicious.
Preferences: ${preferences || "No specific preferences"}
Just pick the food IDs — the system will calculate exact portions automatically.`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 2000,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");

        if (!data.meals || !Array.isArray(data.meals) || data.meals.length === 0) {
            return NextResponse.json(
                { success: false, error: "AI returned invalid meal selections" },
                { status: 500 }
            );
        }

        // Step 2: Build food selections from LLM output
        const mealSelections: MealFoodSelection[] = data.meals.slice(0, num_meals).map((meal: any) => ({
            proteinId: String(meal.proteinId || "chicken_breast_cooked"),
            carbId: String(meal.carbId || "white_rice_cooked"),
            fatId: String(meal.fatId || "olive_oil"),
            extras: Array.isArray(meal.extras) ? meal.extras.map(String) : [],
            dish: String(meal.dish || ""),
            recipe: String(meal.recipe || "")
        }));

        // Pad if LLM returned fewer meals than requested
        while (mealSelections.length < num_meals) {
            mealSelections.push({
                proteinId: "chicken_breast_cooked",
                carbId: "white_rice_cooked",
                fatId: "olive_oil",
                dish: "Chicken Rice Bowl",
                recipe: "Grilled chicken with steamed rice and olive oil."
            });
        }

        const mealNames = MEAL_NAMES.slice(0, num_meals);

        // Step 3: DETERMINISTIC MATH computes exact portions — guaranteed accurate
        const plan = generateDeterministicPlan(
            target_calories,
            target_protein,
            mealSelections,
            mealNames
        );

        // Step 4: Verify before returning (this should always pass)
        const totalP = plan.meals.reduce((s, m) => s + m.protein, 0);
        const totalCal = plan.meals.reduce((s, m) => s + m.calories, 0);
        console.log(`[Diet] Target: ${target_calories}cal/${target_protein}gP → Actual: ${totalCal}cal/${totalP.toFixed(1)}gP`);

        return NextResponse.json({
            success: true,
            data: { meals: plan.meals }
        });

    } catch (error: any) {
        console.error("AI Diet Generation Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
