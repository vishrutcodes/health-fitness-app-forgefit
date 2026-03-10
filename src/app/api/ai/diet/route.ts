import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getFoodCatalog, LOCAL_NUTRITION_DB, resolveMeal, scaleMealsToTarget } from "@/lib/nutrition-db";

export async function POST(req: NextRequest) {
    try {
        const { target_calories, target_protein, target_carbs, target_fat, num_meals, preferences } = await req.json();

        const foodCatalog = getFoodCatalog();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert sports nutritionist. Your task is to create a realistic, delicious daily meal plan.

CRITICAL: You MUST ONLY use foods from the database below. Each ingredient must reference a valid foodId and a portionKey or weightGrams.

AVAILABLE FOOD DATABASE:
${foodCatalog}

RULES:
1. Use ONLY foodId values that appear in the database above
2. For each ingredient, specify either a "portionKey" (exact match from the Portions list) OR a "weightGrams" value
3. Use "qty" to multiply portions (e.g., qty:2 with portionKey "1 large egg" = 2 large eggs)
4. Create coherent, real dishes — not random ingredient lists
5. Try to get close to the user's macro targets by choosing appropriate foods and quantities, but DO NOT fabricate numbers
6. Distribute meals realistically (breakfast lighter, lunch/dinner heavier)

OUTPUT FORMAT — return ONLY valid JSON:
{
  "meals": [
    {
      "meal_name": "Breakfast",
      "dish": "Descriptive Dish Name",
      "recipe": "Short 1-2 sentence cooking instructions",
      "ingredients": [
        { "foodId": "egg_whole_large", "portionKey": "1 large egg", "qty": 3 },
        { "foodId": "bread_whole_wheat", "portionKey": "2 slices", "qty": 1 },
        { "foodId": "avocado", "portionKey": "1/2 avocado (75g)", "qty": 1 },
        { "foodId": "olive_oil", "portionKey": "1 tsp (5ml)", "qty": 1 }
      ]
    }
  ]
}`
                },
                {
                    role: "user",
                    content: `Create a meal plan targeting approximately:
- Calories: ${target_calories} kcal
- Protein: ${target_protein}g
- Carbs: ${target_carbs}g
- Fat: ${target_fat}g
- Number of Meals: ${num_meals}
- Preferences/Allergies: ${preferences || "No specific preferences"}

Pick food combinations and quantities that get as close to these targets as possible using the available database.`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
            max_tokens: 3000,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");

        if (!data.meals || !Array.isArray(data.meals)) {
            return NextResponse.json(
                { success: false, error: "AI returned invalid meal structure" },
                { status: 500 }
            );
        }

        // Resolve all macros from the REAL nutrition database — NO LLM numbers used
        const rawResolved = data.meals.map((meal: any, idx: number) => {
            const rawIngredients = (meal.ingredients || []).map((ing: any) => ({
                foodId: String(ing.foodId || ""),
                portionKey: ing.portionKey ? String(ing.portionKey) : undefined,
                weightGrams: ing.weightGrams ? Number(ing.weightGrams) : undefined,
                qty: ing.qty ? Number(ing.qty) : 1
            })).filter((ing: any) => LOCAL_NUTRITION_DB[ing.foodId]); // Filter out any invalid IDs

            return {
                meal_name: meal.meal_name || `Meal ${idx + 1}`,
                resolved: resolveMeal(
                    meal.dish || `Meal ${idx + 1}`,
                    meal.recipe || "",
                    rawIngredients
                )
            };
        });

        // Scale portions proportionally so total calories hit the user's target
        const scaledMeals = scaleMealsToTarget(
            rawResolved.map((m: any) => m.resolved),
            target_calories,
            target_protein
        );

        const resolvedMeals = rawResolved.map((m: any, idx: number) => ({
            meal_name: m.meal_name,
            dish: scaledMeals[idx].dish,
            recipe: scaledMeals[idx].recipe,
            ingredients: scaledMeals[idx].ingredients,
            protein: scaledMeals[idx].totalProtein,
            carbs: scaledMeals[idx].totalCarbs,
            fat: scaledMeals[idx].totalFat,
            calories: scaledMeals[idx].totalCalories
        }));

        return NextResponse.json({
            success: true,
            data: { meals: resolvedMeals }
        });

    } catch (error: any) {
        console.error("AI Diet Generation Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
