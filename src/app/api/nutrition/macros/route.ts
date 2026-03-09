import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { LOCAL_NUTRITION_DB, calculateMacrosForWeight, calculateCalories } from "@/lib/nutrition-db";

export async function POST(req: NextRequest) {
    try {
        const { foods } = await req.json();

        // 1. Prepare available database keys for the LLM context
        // so it can map free-text entries to our strict deterministic DB.
        const dbContext = Object.values(LOCAL_NUTRITION_DB).map(
            f => `${f.id} (${f.name}, default unit: ${f.defaultUnit}, 1 ${f.defaultUnit} = ${f.unitWeightGrams}g)`
        ).join("\n");

        const foodListString = foods
            .map((f: { name: string; quantity: string; amount: string }) =>
                `Name: "${f.name}", Qty: "${f.quantity}", Amount: "${f.amount}"`)
            .join(" | ");

        // 2. Use LLM ONLY for Natural Language Understanding (Entity Resolution)
        // It does ZERO math. It only outputs the matching ID and the total Grams.
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an NLP parser for a strict deterministic nutrition system.
Your job is to read user food inputs and map them to our internal database IDs.
Do NOT calculate macros. ONLY calculate the exact "totalGrams" requested.

RULES FOR TOTAL GRAMS:
- If a user specifies Qty="6" and Amount="50g", totalGrams = 300.
- If Qty is blank and Amount="60g", totalGrams = 60.
- If Qty="2" and Amount is blank, and the matched DB item has unitWeightGrams=30, totalGrams = 60.

AVAILABLE DATABASE ITEMS:
${dbContext}

OUTPUT STRICT JSON matching this schema:
{
  "matches": [
    { "originalName": "string", "foodId": "string (MUST exactly match a DB ID above)", "totalGrams": number }
  ]
}
Return only JSON.`
                },
                {
                    role: "user",
                    content: `Resolve these inputs: ${foodListString}`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 512,
        });

        const text = completion.choices[0]?.message?.content || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            return NextResponse.json({ error: "Parser failed to return matching IDs." }, { status: 500 });
        }

        const data = JSON.parse(jsonMatch[0]);
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        const breakdown = [];

        // 3. Deterministic execution
        for (const match of data.matches) {
            const result = calculateMacrosForWeight(match.foodId, match.totalGrams);
            if (result) {
                totalProtein += result.protein;
                totalCarbs += result.carbs;
                totalFat += result.fat;
                breakdown.push(result);
            }
        }

        // 4. Guaranteed perfect math calculation
        totalProtein = parseFloat(totalProtein.toFixed(1));
        totalCarbs = parseFloat(totalCarbs.toFixed(1));
        totalFat = parseFloat(totalFat.toFixed(1));
        const totalCalories = calculateCalories(totalProtein, totalCarbs, totalFat);

        return NextResponse.json({
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat,
            calories: totalCalories,
            breakdown
        });

    } catch (error) {
        console.error("Precision Macro formulation error:", error);
        return NextResponse.json(
            { error: "Failed to analyze macros. Please check your inputs." },
            { status: 500 }
        );
    }
}
