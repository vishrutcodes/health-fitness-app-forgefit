import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { start, end, timeframe, equipment } = await req.json();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a fitness programming AI. Generate a structured training roadmap. Return ONLY valid JSON in this exact format, no extra text:
{"title": "Roadmap Title", "phases": [{"phase": "Phase 1", "title": "Phase Name", "weeks": "Weeks 1-4", "focus": "Brief focus description", "workouts": ["workout 1 description", "workout 2 description", "workout 3 description"], "nutrition": "Brief nutrition guidance", "targets": {"weeklyWorkouts": number, "calorieAdjustment": "string"}}], "milestones": ["milestone 1", "milestone 2", "milestone 3"], "tips": ["tip 1", "tip 2"]}`,
                },
                {
                    role: "user",
                    content: `Create a ${timeframe}-month fitness roadmap. Starting point: ${start}. Goal: ${end}. Equipment: ${equipment}.`,
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
            { error: "Could not generate roadmap" },
            { status: 500 }
        );
    } catch (error) {
        console.error("Roadmap error:", error);
        return NextResponse.json(
            { error: "Failed to generate roadmap. Please try again." },
            { status: 500 }
        );
    }
}
