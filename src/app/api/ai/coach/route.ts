import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are ForgeFit AI Coach — an expert fitness, nutrition, and wellness advisor. You provide personalized, evidence-based advice on:
- Workout programming and exercise selection
- Nutrition planning and macro calculations
- Recovery, sleep optimization, and injury prevention
- Supplement recommendations
- Body composition and fat loss / muscle gain strategies

Keep responses concise but informative. Use bullet points and structure for clarity. Be motivational and supportive. Always recommend consulting a healthcare professional for medical concerns.`,
                },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        return NextResponse.json({
            message: completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.",
        });
    } catch (error) {
        console.error("AI Coach error:", error);
        return NextResponse.json(
            { error: "Failed to get AI response. Please try again." },
            { status: 500 }
        );
    }
}
