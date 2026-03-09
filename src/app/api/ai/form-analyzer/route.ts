import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const { frames } = await req.json();

        if (!frames || !Array.isArray(frames) || frames.length === 0) {
            return NextResponse.json({ error: "No frames provided." }, { status: 400 });
        }

        // Build vision messages with up to 3 frames
        const imageContent = frames.slice(0, 3).map((base64: string) => ({
            type: "image_url" as const,
            image_url: { url: base64 },
        }));

        const completion = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `You are an expert fitness coach and exercise classifier. Analyze these frames from a workout video.

TASK: Identify the exercise and analyze the form.

You MUST respond in EXACTLY this JSON format, nothing else:
{
  "exercise": "<one of: Squat, Deadlift, Bench Press, Push-up, Dumbbell Overhead Press, Pull-Up, Barbell Row, Lunge, Dumbbell Lateral Raise, Bicep Curl, No Exercise>",
  "confidence": <number 0-100>,
  "form_score": <number 1-10>,
  "corrections": ["<correction 1>", "<correction 2>"],
  "positives": ["<positive 1>", "<positive 2>"]
}

RULES:
- "exercise" must be EXACTLY one of the listed names
- Look at the body position, equipment, and movement pattern
- Squat: bar on back/shoulders, person bending knees and hips together, upright torso
- Deadlift: bar in hands hanging down, hip hinge, forward lean, straight arms
- Bench Press: person lying flat on bench, pressing bar upward
- Push-up: person face down, pushing body up from floor
- Dumbbell Overhead Press: standing/seated, pressing weights overhead
- Pull-Up: hanging from bar, pulling body upward
- Dumbbell Lateral Raise: standing, raising arms OUTWARD and sideways away from body to shoulder height. Elbows are only slightly bent, locked in place.
- Bicep Curl: standing/seated, holding dumbbells/barbell, bending arms AT THE ELBOW to curl weight UP toward shoulders. Upper arm stays still.
- If the person is clearly performing a gym exercise, identify it. Do NOT say "No Exercise" unless there is genuinely no exercise happening.
- For form analysis, provide specific, actionable corrections and positives based on what you see.
- For Dumbbell Lateral Raise, check: controlled tempo, slight elbow bend, arms not going above shoulder height, no excessive body swinging/momentum, shoulders not shrugging up
- For Bicep Curl, check: elbows pinned to sides, no body swing/momentum, full range of motion
- Respond with ONLY the JSON, no markdown, no backticks, no explanation.`,
                        },
                        ...imageContent,
                    ],
                },
            ],
            temperature: 0.1,
            max_tokens: 512,
        });

        const rawResponse = completion.choices[0]?.message?.content || "";

        // Parse the JSON response
        try {
            // Clean up any markdown formatting
            let cleaned = rawResponse.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }

            const parsed = JSON.parse(cleaned);

            return NextResponse.json({
                exercise: parsed.exercise || "No Exercise",
                confidence: Math.min(100, Math.max(0, parsed.confidence || 0)),
                form_score: Math.min(10, Math.max(1, parsed.form_score || 5)),
                corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
                positives: Array.isArray(parsed.positives) ? parsed.positives : [],
            });
        } catch (parseErr) {
            console.error("[FormAnalyzer API] Failed to parse Groq response:", rawResponse);
            return NextResponse.json({
                exercise: "No Exercise",
                confidence: 0,
                form_score: 5,
                corrections: ["Could not parse AI response. Please try again."],
                positives: [],
                raw: rawResponse,
            });
        }
    } catch (error: unknown) {
        console.error("[FormAnalyzer API] Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Groq Vision API failed: ${message}` },
            { status: 500 }
        );
    }
}
