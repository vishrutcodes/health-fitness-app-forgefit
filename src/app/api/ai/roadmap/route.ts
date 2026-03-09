import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { start, end, personalDetails, timeframe, equipment } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an elite, world-class strength and conditioning coach and clinical nutritionist. 
You do not give generic advice. You program strict, absolute protocols for athletes. 
The user wants a highly detailed, professional combative breakdown. Deliver a response that matches the intense depth, honesty, and specificity of an elite coach dissecting their biometrics and goals.

The user will provide their precise biometrics (Height, Weight, Age, Gender, Activity Level), starting capabilities, and exact goals.

CRITICAL INSTRUCTION: Calculate their required daily calories and macros mathematically based on their specific biometric data. If they want to gain height at 19, give them a stark reality check but offer posture/decompression solutions. Be brutal but highly scientific.

Return ONLY valid JSON matching this exact structure:
{
  "overview": "A detailed, multi-sentence reality check. Analyze their goal vs their reality, address any misconceptions, and set the combative tone for the protocol.",
  "dailyProtocol": {
    "calories": number,
    "proteinGrams": number,
    "carbsGrams": number,
    "fatGrams": number,
    "waterLiters": number,
    "stepsGoal": number,
    "sleepHours": number
  },
  "nutritionStaples": [
    "Proteins: e.g. Chicken breast, eggs, Greek yogurt...",
    "Carbs: e.g. Oats, sweet potatoes...",
    "Fats: e.g. Avocado, olive oil..."
  ],
  "supplementStack": [
    "Supplement 1 with exact dosage (e.g. 'Creatine Monohydrate: 5g daily')",
    "Supplement 2..."
  ],
  "specializedProtocols": [
    {
       "title": "e.g., The 'Height' & Posture Protocol", 
       "description": "Specific daily commands like 'Dead Hangs: 3 sets of 1 minute daily to decompress vertebrae...'"
    }
  ],
  "phases": [
    {
      "phaseName": "Phase 1: [Name]",
      "durationWeeks": "Weeks 1-X",
      "primaryFocus": "What they must achieve in this block",
      "trainingSplit": "e.g. Upper/Lower or Push/Pull/Legs",
      "keyMovements": [
        "Movement 1 (e.g. Barbell Squat: 3x5-8)",
        "Movement 2..."
      ],
      "cardioProtocol": "Exact cardio prescription (e.g. '2x Weekly LISS: 30 mins Zone 2')"
    }
  ]
}
Ensure the math is sound. Output ONLY the JSON object. Do not wrap in markdown tags if possible, just the raw braces.`,
        },
        {
          role: "user",
          content: `Create a ${timeframe}-month elite coaching protocol.
BIOMETRICS & DEMOGRAPHICS: ${personalDetails}
STARTING CAPABILITIES: ${start}
EXACT END GOAL: ${end}
AVAILABLE EQUIPMENT: ${equipment}`,
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
