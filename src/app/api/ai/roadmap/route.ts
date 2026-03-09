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
                    content: `You are an elite, world-class strength and conditioning coach and clinical nutritionist. 
You do not give generic advice. You program strict, absolute protocols for athletes.
The user will provide their starting point, their exact goal, their timeframe, and available equipment.

Provide a ruthlessly effective, highly specific roadmap.

Return ONLY valid JSON matching this exact structure:
{
  "overview": "A 2-3 sentence authoritative, no-nonsense opening statement setting the tone.",
  "dailyProtocol": {
    "calories": number,
    "proteinGrams": number,
    "carbsGrams": number,
    "fatGrams": number,
    "waterLiters": number,
    "stepsGoal": number,
    "sleepHours": number
  },
  "supplementStack": [
    "Supplement 1 with exact dosage (e.g. 'Creatine Monohydrate: 5g daily')",
    "Supplement 2...",
    "Supplement 3..."
  ],
  "phases": [
    {
      "phaseName": "Phase 1: [Name]",
      "durationWeeks": "Weeks 1-X",
      "primaryFocus": "What they must achieve in this block",
      "trainingSplit": "e.g. Upper/Lower 4x Week",
      "keyMovements": [
        "Movement 1 (e.g. Barbell Squat: 3x5-8)",
        "Movement 2...",
        "Movement 3..."
      ],
      "cardioProtocol": "Exact cardio prescription (e.g. '2x Weekly LISS: 30 mins Zone 2')"
    }
  ]
}
Ensure the math is sound. Output ONLY the JSON object. Do not wrap in markdown tags if possible, just the raw braces.`,
                },
                {
                    role: "user",
                    content: `Create a ${timeframe}-month elite coaching protocol. Starting point: ${start}. Goal: ${end}. Equipment: ${equipment}.`,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 2048,
        });

        const text = completion.choices[0]?.message?.content || "";
        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return NextResponse.json(data);
        }

        return NextResponse.json(
            { error: "Protocol generation failed. Invalid schema returned." },
            { status: 500 }
        );
    } catch (error) {
        console.error("Advanced Roadmap error:", error);
        return NextResponse.json(
            { error: "Failed to program roadmap. Please try again." },
            { status: 500 }
        );
    }
}
