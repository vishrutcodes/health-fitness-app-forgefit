import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getFoodCatalog, LOCAL_NUTRITION_DB, resolveMeal, scaleSingleMealToTarget } from "@/lib/nutrition-db";

export async function POST(req: NextRequest) {
    try {
        const { targetProtein, targetCarbs, targetFat, avoidDish, mealName } = await req.json();

        if (!targetProtein || targetProtein < 0) throw new Error("targetProtein missing or invalid");
        if (targetCarbs === undefined || targetCarbs < 0) throw new Error("targetCarbs missing or invalid");
        if (targetFat === undefined || targetFat < 0) throw new Error("targetFat missing or invalid");

        const foodCatalog = getFoodCatalog();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert nutritionist creating ONE alternative meal.

CRITICAL: You MUST ONLY use foods from the database below. Each ingredient must reference a valid foodId and portionKey or weightGrams.

AVAILABLE FOOD DATABASE:
${foodCatalog}

RULES:
1. Use ONLY foodId values from the database above
2. For each ingredient, specify a "portionKey" (exact match) OR "weightGrams"
3. Use "qty" to multiply portions
4. The meal MUST BE COMPLETELY DIFFERENT from the avoidDish
5. Try to approximate the target macros using appropriate food choices and quantities

OUTPUT FORMAT — return ONLY valid JSON:
{
    "dish": "Descriptive Dish Name",
    "recipe": "Short 1-2 sentence cooking instructions",
    "ingredients": [
        { "foodId": "string", "portionKey": "string", "qty": number }
    ]
}
`
                },
                {
                    role: "user",
                    content: `Meal Name: ${mealName || "Meal"}
Approximate Target: ${targetProtein}g Protein, ${targetCarbs}g Carbs, ${targetFat}g Fat
Avoid this dish: ${avoidDish || "None"}
Generate a COMPLETELY DIFFERENT dish that gets close to these targets.`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.6,
            max_tokens: 1200,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");

        // Resolve macros from the real database
        const rawIngredients = (data.ingredients || []).map((ing: any) => ({
            foodId: String(ing.foodId || ""),
            portionKey: ing.portionKey ? String(ing.portionKey) : undefined,
            weightGrams: ing.weightGrams ? Number(ing.weightGrams) : undefined,
            qty: ing.qty ? Number(ing.qty) : 1
        })).filter((ing: any) => LOCAL_NUTRITION_DB[ing.foodId]);

        const resolved = resolveMeal(
            data.dish || "Alternative Meal",
            data.recipe || "",
            rawIngredients
        );

        // Scale portions to match the original meal's calorie target
        const targetMealCalories = Math.round(
            (targetProtein * 4) + (targetCarbs * 4) + (targetFat * 9)
        );
        const scaledResolved = scaleSingleMealToTarget(resolved, targetMealCalories, targetProtein);

        const meal = {
            meal_name: mealName || "Alternative Meal",
            dish: scaledResolved.dish,
            recipe: scaledResolved.recipe,
            ingredients: scaledResolved.ingredients,
            protein: scaledResolved.totalProtein,
            carbs: scaledResolved.totalCarbs,
            fat: scaledResolved.totalFat,
            calories: scaledResolved.totalCalories
        };

        return NextResponse.json({ success: true, meal });

    } catch (error: any) {
        console.error("AI Diet Swap Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
