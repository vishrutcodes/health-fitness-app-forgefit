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
                    content: `You are a nutrition analysis AI. Given a list of foods, estimate the macronutrient breakdown. 
CRITICAL: Prioritize the 'amount' field to determine the serving size. IGNORE conflicting quantities in the food name string itself (e.g. if name is 'boiled eggs 6' but amount is '50g', calculate for exactly 50g of boiled eggs).
Return ONLY valid JSON in this exact format, no extra text:
{"protein": number, "carbs": number, "fat": number, "fiber": number, "breakdown": [{"food": "name", "protein": number, "carbs": number, "fat": number}]}
All values should be reasonable estimates in grams. Do not include calories.`,
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
