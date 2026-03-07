import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { exercise } = await req.json();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert exercise science AI. Given an exercise name, provide detailed form guidance. Return ONLY valid JSON in this exact format, no extra text:
{"name": "Exercise Name", "muscles": ["primary muscle", "secondary muscle"], "formTips": ["tip 1", "tip 2", "tip 3", "tip 4"], "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"], "variations": ["variation 1", "variation 2"], "difficulty": "Beginner|Intermediate|Advanced"}`,
                },
                {
                    role: "user",
                    content: `Give me detailed form guidance for: ${exercise}`,
                },
            ],
            temperature: 0.3,
            max_tokens: 512,
        });

        const text = completion.choices[0]?.message?.content || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return NextResponse.json(data);
        }

        return NextResponse.json(
            { error: "Could not parse exercise data" },
            { status: 500 }
        );
    } catch (error) {
        console.error("Exercise guide error:", error);
        return NextResponse.json(
            { error: "Failed to get exercise info. Please try again." },
            { status: 500 }
        );
    }
}
