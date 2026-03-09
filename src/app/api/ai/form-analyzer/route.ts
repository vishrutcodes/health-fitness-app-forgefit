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
  "exercise": "<Name of the exercise being performed, or 'No Exercise' if none>",
  "confidence": <number 0-100>,
  "form_score": <number 1-10>,
  "corrections": ["<correction 1>", "<correction 2>"],
  "positives": ["<positive 1>", "<positive 2>"]
}

RULES:
- "exercise" should be the standard, widely-accepted name of the gym exercise (e.g., "Squat", "Deadlift", "Lat Pulldown", "Bicep Curl", "Cable Crossover", etc.)
- Look carefully at the body position, equipment used, and movement pattern.
- Distinguish closely related exercises:
  - Lat Pulldown vs Pull-Up: Lat Pulldown uses a cable machine while sitting. Pull-up involves hanging from a fixed bar.
  - Lateral Raise vs Bicep Curl: Lateral Raise moves arms OUTWARD with locked elbows. Bicep Curl bends arms AT THE ELBOW.
  - Squat vs Deadlift: Squat aims for upright torso with deep knee bend. Deadlift is a hip hinge with forward torso lean.
- If the person is clearly performing a gym exercise, identify it accurately. Do NOT say "No Exercise" unless there is genuinely no exercise happening.
- For form analysis, provide specific, actionable corrections and positives based on exactly what you observe in the frames.
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
