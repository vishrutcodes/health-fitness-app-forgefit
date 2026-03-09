import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { foods } = await req.json();

        const foodList = foods
            .map((f: { name: string; amount: string }) => `${f.amount} of ${f.name}`)
            .join(", ");

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a highly accurate nutrition analysis AI. Given a list of foods, estimate the total macronutrient breakdown for the exact specified quantity. 
CRITICAL RULES FOR QUANTITIES:
1. Prioritize the 'amount' field (e.g. "50g", "1 cup") to determine the exact serving size to calculate for.
2. If the food name contains a count (e.g., "6 boiled eggs") AND the amount is a weight (e.g., "50g"), you MUST assume the weight is PER ITEM and multiply them (6 eggs * 50g = 300g total).
3. PROPORTIONAL SCALING: You MUST mathematically scale your base knowledge to the exact weight provided. A standard large boiled egg is ~50g and contains ~6.3g of protein. If the user asks for 50g of boiled egg, you MUST return ~6.3g. Do not return 12.5g (which is for 100g). If the user asks for 200g of chicken, scale the 100g values by 2.
Return ONLY valid JSON in this exact format, no extra text:
{"protein": number, "carbs": number, "fat": number, "fiber": number, "breakdown": [{"food": "name", "protein": number, "carbs": number, "fat": number}]}
All values should be accurate estimates in grams. Do not include calories.`,
                },
                {
                    role: "user",
                    content: `Analyze the macros for: ${foodList}`,
                },
            ],
            temperature: 0.1,
            max_tokens: 512,
        });

        const text = completion.choices[0]?.message?.content || "";
        console.log("RAW LLM OUTPUT:", text);
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);

            // Programmatically calculate calories (P*4 + C*4 + F*9)
            if (data.breakdown) {
                data.breakdown = data.breakdown.map((item: any) => ({
                    ...item,
                    calories: Math.round((item.protein * 4) + (item.carbs * 4) + (item.fat * 9))
                }));
            }

            data.calories = Math.round((data.protein * 4) + (data.carbs * 4) + (data.fat * 9));

            return NextResponse.json(data);
        }

        return NextResponse.json(
            { error: "Could not parse nutrition data" },
            { status: 500 }
        );
    } catch (error) {
        console.error("Macro analysis error:", error);
        return NextResponse.json(
            { error: "Failed to analyze macros. Please try again." },
            { status: 500 }
        );
    }
}
