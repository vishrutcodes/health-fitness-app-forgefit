import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { calories, protein, goal, meals, restrictions } = await req.json();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a nutrition planning AI. Generate a practical, detailed meal plan. Return ONLY valid JSON in this exact format, no extra text:
{"planName": "Plan Name", "summary": "Brief description", "meals": [{"name": "Meal Name", "time": "8:00 AM", "foods": [{"item": "food name", "amount": "quantity", "calories": number, "protein": number}], "totalCalories": number, "totalProtein": number}], "dailyTotals": {"calories": number, "protein": number, "carbs": number, "fat": number}, "tips": ["tip 1", "tip 2"]}`,
                },
                {
                    role: "user",
                    content: `Create a meal plan with: ${calories} daily calories, ${protein}g protein target, goal: ${goal}, ${meals} meals per day. Restrictions: ${restrictions || "none"}.`,
                },
            ],
            temperature: 0.5,
            max_tokens: 1024,
        });

        const text = completion.choices[0]?.message?.content || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return NextResponse.json(data);
        }

        return NextResponse.json(
            { error: "Could not generate meal plan" },
            { status: 500 }
        );
    } catch (error) {
        console.error("Diet plan error:", error);
        return NextResponse.json(
            { error: "Failed to generate meal plan. Please try again." },
            { status: 500 }
        );
    }
}
