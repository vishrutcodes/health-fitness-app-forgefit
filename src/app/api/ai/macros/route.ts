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
                    content: `You are a nutrition analysis AI. Given a list of foods, estimate the macronutrient breakdown. Return ONLY valid JSON in this exact format, no extra text:
{"calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "breakdown": [{"food": "name", "calories": number, "protein": number, "carbs": number, "fat": number}]}
All values should be reasonable estimates in grams (except calories in kcal).`,
                },
                {
                    role: "user",
                    content: `Analyze the macros for: ${foodList}`,
                },
            ],
            temperature: 0.3,
            max_tokens: 512,
        });

        const text = completion.choices[0]?.message?.content || "";
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
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
