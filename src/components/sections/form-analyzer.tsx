"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, Loader2, Brain, Target, AlertTriangle, CheckCircle, Video, RotateCcw, Star, ChevronDown, BarChart3, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ---------- Types ---------- */
interface PoseLandmark { x: number; y: number; z: number; visibility?: number }
interface AnalysisResult {
    exercise: string;
    score: number;
    corrections: string[];
    positives: string[];
    jointAngles: Record<string, number>;
    allScores: ExerciseScore[];
    frameClassifications: string[];
    modelAccuracy: number;
}
interface ExerciseScore { name: string; confidence: number }

/* ---------- Angle helpers ---------- */
function angle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let deg = Math.abs(radians * 180 / Math.PI);
    if (deg > 180) deg = 360 - deg;
    return Math.round(deg);
}

/* ---------- Helper: torso angle from vertical ---------- */
function torsoAngleFromVertical(landmarks: PoseLandmark[]): number {
    const shoulderMid = { x: (landmarks[11].x + landmarks[12].x) / 2, y: (landmarks[11].y + landmarks[12].y) / 2 };
    const hipMid = { x: (landmarks[23].x + landmarks[24].x) / 2, y: (landmarks[23].y + landmarks[24].y) / 2 };
    // Angle of torso line from vertical (0Â° = upright, 90Â° = horizontal)
    const dx = shoulderMid.x - hipMid.x;
    const dy = shoulderMid.y - hipMid.y; // negative = shoulder above hip
    return Math.abs(Math.atan2(dx, -dy) * 180 / Math.PI);
}

/* ---------- Helper: stance width (normalized) ---------- */
function stanceWidth(landmarks: PoseLandmark[]): number {
    return Math.abs(landmarks[27].x - landmarks[28].x); // ankle-to-ankle
}

/* ---------- Helper: hand height relative to shoulder ---------- */
function handHeightRelShoulder(landmarks: PoseLandmark[]): number {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const handY = (landmarks[15].y + landmarks[16].y) / 2;
    return shoulderY - handY; // positive = hands above shoulders
}

/* ---------- Helper: is body horizontal (e.g. bench, push-up) ---------- */
function isBodyHorizontal(landmarks: PoseLandmark[]): boolean {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;
    const ankleY = (landmarks[27].y + landmarks[28].y) / 2;
    return Math.abs(shoulderY - hipY) < 0.15 && Math.abs(hipY - ankleY) < 0.2;
}

/* ---------- Helper: torso horizontality score (0=vertical, 1=horizontal) ---------- */
function torsoHorizontalScore(landmarks: PoseLandmark[]): number {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;
    const shoulderX = (landmarks[11].x + landmarks[12].x) / 2;
    const hipX = (landmarks[23].x + landmarks[24].x) / 2;
    const dx = Math.abs(shoulderX - hipX);
    const dy = Math.abs(shoulderY - hipY);
    // When dx >> dy the torso is more horizontal
    if (dx + dy === 0) return 0;
    return dx / (dx + dy);
}

/* ---------- Helper: torso incline for bench variants ---------- */
function benchInclineAngle(landmarks: PoseLandmark[]): number {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;
    const shoulderX = (landmarks[11].x + landmarks[12].x) / 2;
    const hipX = (landmarks[23].x + landmarks[24].x) / 2;
    const dx = hipX - shoulderX;
    const dy = hipY - shoulderY;
    return Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
}


/* ---------- Helper: is person standing (feet below hips) vs lying ---------- */
function isStandingOrientation(landmarks: PoseLandmark[]): boolean {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const ankleY = (landmarks[27].y + landmarks[28].y) / 2;
    return (ankleY - shoulderY) > 0.15;
}

/* ---------- Helper: hands near ground / below hips (deadlift grip) ---------- */
function handsNearGround(landmarks: PoseLandmark[]): boolean {
    const handY = (landmarks[15].y + landmarks[16].y) / 2;
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;
    const ankleY = (landmarks[27].y + landmarks[28].y) / 2;
    return handY > hipY && Math.abs(handY - ankleY) < 0.15;
}

/* ---------- Helper: is person seated ---------- */
function isSeatedPosition(landmarks: PoseLandmark[]): boolean {
    const lh = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rh = angle(landmarks[12], landmarks[24], landmarks[26]);
    return ((lh + rh) / 2) > 70 && ((lh + rh) / 2) < 120;
}

/* ---------- Helper: arms hanging straight down ---------- */
function armsHangingStraight(landmarks: PoseLandmark[]): boolean {
    const lV = Math.abs(landmarks[15].x - landmarks[13].x) < 0.04 && landmarks[15].y > landmarks[13].y;
    const rV = Math.abs(landmarks[16].x - landmarks[14].x) < 0.04 && landmarks[16].y > landmarks[14].y;
    return lV && rV;
}

/* ========================================================================
   FOCUSED 10-EXERCISE CONFIDENCE SCORING
   Each exercise: 10-15 signals + cross-exercise penalties
   ======================================================================== */
function scoreAllExercises(landmarks: PoseLandmark[]): ExerciseScore[] {
    const lk = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rk = angle(landmarks[24], landmarks[26], landmarks[28]);
    const le = angle(landmarks[11], landmarks[13], landmarks[15]);
    const re = angle(landmarks[12], landmarks[14], landmarks[16]);
    const lh = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rh = angle(landmarks[12], landmarks[24], landmarks[26]);
    const ls = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rs = angle(landmarks[14], landmarks[12], landmarks[24]);

    const avgKnee = (lk + rk) / 2;
    const avgElbow = (le + re) / 2;
    const avgHip = (lh + rh) / 2;
    const avgShoulder = (ls + rs) / 2;
    const kneeAsym = Math.abs(lk - rk);
    const elbowAsym = Math.abs(le - re);
    const torsoAng = torsoAngleFromVertical(landmarks);
    const stance = stanceWidth(landmarks);
    const handsRel = handHeightRelShoulder(landmarks);
    const horizontal = isBodyHorizontal(landmarks);
    const horizScore = torsoHorizontalScore(landmarks);
    const hkRatio = avgHip / avgKnee;
    const standing = isStandingOrientation(landmarks);
    const lowHands = handsNearGround(landmarks);
    const seated = isSeatedPosition(landmarks);
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;

    const scores: ExerciseScore[] = [];

    // ===================== 1. DEADLIFT =====================
    // UNIQUE SIGNATURE: Standing + significant forward lean (hip hinge) + STRAIGHT arms + hands near floor
    // KEY DIFFERENTIATOR from SQUAT: torso lean > 25° (squat is upright < 35°)
    // KEY DIFFERENTIATOR from BENCH: standing (bench is horizontal/lying)
    {
        let c = 0;

        // ---- EXCLUSIVE SIGNALS (only deadlift has these) ----
        // Forward lean / hip hinge is THE defining feature
        if (torsoAng > 25) c += 20;
        if (torsoAng > 35) c += 15;
        if (torsoAng > 45) c += 10;
        if (torsoAng > 55) c += 5;
        // Arms MUST be straight (holding bar, not curling)
        if (avgElbow > 140) c += 15;
        if (avgElbow > 160) c += 10;
        // Hands near ground / below hips
        if (lowHands) c += 15;
        if (handsRel < -0.05) c += 5;
        if (handsRel < -0.15) c += 5;
        // Arms hanging vertically (gripping bar)
        if (armsHangingStraight(landmarks)) c += 10;

        // ---- SUPPORTING SIGNALS ----
        // Standing orientation required
        if (standing) c += 15; else c -= 80;
        // Hip hinge dominant (hip angle < knee angle)
        if (hkRatio < 0.95) c += 10;
        if (hkRatio < 0.8) c += 5;
        // Hips flexed significantly
        if (avgHip < 140) c += 5;
        if (avgHip < 110) c += 5;
        // Knees moderately bent (NOT squat-deep, NOT locked out)
        if (avgKnee > 100 && avgKnee < 170) c += 5;
        // Symmetric stance
        if (kneeAsym < 15) c += 3;

        // ---- HARD CROSS-EXERCISE PENALTIES ----
        // ANTI-SQUAT: if torso is upright, this is NOT a deadlift
        if (torsoAng < 20) c -= 40;
        if (torsoAng < 10) c -= 20;
        // ANTI-SQUAT: if knees are extremely deep, this is a squat
        if (avgKnee < 90) c -= 30;
        // ANTI-SQUAT: if hip-knee ratio is balanced (squat-like), penalize
        if (hkRatio > 1.0 && hkRatio < 1.2) c -= 15;
        // ANTI-BENCH: if body is horizontal/lying, this is NOT a deadlift
        if (horizontal) c -= 80;
        if (horizScore > 0.5) c -= 40;
        // ANTI-BENCH: if arms are bent (pressing), not deadlift
        if (avgElbow < 100) c -= 30;

        scores.push({ name: "Deadlift", confidence: Math.max(0, c) });
    }

    // ===================== 2. SQUAT =====================
    // UNIQUE SIGNATURE: Standing + UPRIGHT torso + deep knee bend + hip-knee co-flexion
    // KEY DIFFERENTIATOR from DEADLIFT: upright torso (< 35°) vs deadlift's lean (> 25°)
    // KEY DIFFERENTIATOR from BENCH: standing (bench is horizontal/lying)
    {
        let c = 0;

        // ---- EXCLUSIVE SIGNALS (only squat has these) ----
        // UPRIGHT torso is THE defining feature vs deadlift
        if (torsoAng < 35) c += 20;
        if (torsoAng < 25) c += 10;
        if (torsoAng < 15) c += 5;
        // Deep knee bend is required
        if (avgKnee < 150) c += 10;
        if (avgKnee < 130) c += 10;
        if (avgKnee < 110) c += 10;
        if (avgKnee < 90) c += 10;
        if (avgKnee < 70) c += 5;
        // Hip and knee bend TOGETHER (not hip-dominant like deadlift)
        if (hkRatio > 0.85 && hkRatio < 1.2) c += 15;

        // ---- SUPPORTING SIGNALS ----
        // Standing orientation required
        if (standing) c += 15; else c -= 80;
        // Hips flexed
        if (avgHip < 140) c += 5;
        if (avgHip < 110) c += 5;
        // Moderate-wide stance
        if (stance > 0.08 && stance < 0.35) c += 5;
        // Symmetric
        if (kneeAsym < 15) c += 3;
        // Arms NOT straight down (bar on back/front rack)
        if (avgElbow > 60) c += 3;

        // ---- HARD CROSS-EXERCISE PENALTIES ----
        // ANTI-DEADLIFT: if torso is leaning forward a lot, this is deadlift
        if (torsoAng > 40) c -= 30;
        if (torsoAng > 55) c -= 20;
        // ANTI-DEADLIFT: if hip angle << knee angle (hip-dominant), that's a deadlift
        if (hkRatio < 0.75) c -= 25;
        // ANTI-DEADLIFT: if arms are straight and hanging down, that's deadlift grip
        if (armsHangingStraight(landmarks) && lowHands) c -= 30;
        // ANTI-BENCH: if body is horizontal/lying, this is NOT a squat
        if (horizontal) c -= 80;
        if (horizScore > 0.5) c -= 40;
        // Legs straight = just standing, not squatting
        if (avgKnee > 165) c -= 30;

        scores.push({ name: "Squat", confidence: Math.max(0, c) });
    }

    // ===================== 3. BENCH PRESS (FLAT) =====================
    // UNIQUE SIGNATURE: Body HORIZONTAL (lying on bench) + arms pressing up + NOT standing
    // KEY DIFFERENTIATOR from DEADLIFT & SQUAT: horizontal body (neither deadlift nor squat is horizontal)
    {
        let c = 0;

        // ---- EXCLUSIVE SIGNALS (only bench has these) ----
        // Body is HORIZONTAL (lying flat) — THE defining feature
        if (horizontal) c += 35;
        if (horizScore > 0.45) c += 15;
        if (horizScore > 0.6) c += 10;
        // NOT standing (lying on bench)
        if (!standing) c += 20; else c -= 80;
        // Shoulder and hip at same height (flat on bench)
        if (Math.abs(shoulderY - hipY) < 0.12) c += 15;
        if (Math.abs(shoulderY - hipY) < 0.08) c += 5;

        // ---- PRESSING SIGNALS ----
        // Elbows bent (pressing motion)
        if (avgElbow < 140) c += 10;
        if (avgElbow < 110) c += 10;
        if (avgElbow < 80) c += 5;
        // Shoulders in pressing range
        if (avgShoulder > 30 && avgShoulder < 110) c += 5;
        // Elbows symmetric (both arms pressing evenly)
        if (elbowAsym < 20) c += 5;
        // Hands near chest height (pressing up from bench)
        if (handsRel > -0.1 && handsRel < 0.2) c += 5;

        // ---- HARD CROSS-EXERCISE PENALTIES ----
        // ANTI-DEADLIFT/SQUAT: if standing upright, this is NOT bench
        if (standing && torsoAng < 20) c -= 60;
        // ANTI-DEADLIFT: if forward lean while standing, definitely not bench
        if (standing && torsoAng > 25) c -= 60;
        // ANTI-DEADLIFT/SQUAT: if deep knee bend while standing, not bench
        if (standing && avgKnee < 130) c -= 40;
        // Arms fully locked = not actively pressing
        if (avgElbow > 170) c -= 10;

        scores.push({ name: "Bench Press (Flat)", confidence: Math.max(0, c) });
    }


    // ===================== STANDING POSITION (idle) =====================
    {
        let c = 0;
        if (avgKnee > 160) c += 25;
        if (avgHip > 160) c += 25;
        if (torsoAng < 10) c += 15;
        if (avgShoulder < 25) c += 10;
        if (avgElbow > 150) c += 10;
        if (handsRel < -0.1) c += 5;
        scores.push({ name: "Standing Position", confidence: c });
    }

    return scores.sort((a, b) => b.confidence - a.confidence);
}

/* ---------- Exercise detection - relaxed for real-world gym videos ---------- */
function detectExercise(landmarks: PoseLandmark[]): string {
    const scores = scoreAllExercises(landmarks);
    const top = scores[0];
    const second = scores[1];
    const standingScore = scores.find(s => s.name === "Standing Position")?.confidence || 0;

    // Log for debugging (browser console)
    console.log(`[FormAnalyzer] Top: ${top.name}=${top.confidence}, 2nd: ${second.name}=${second.confidence}, Standing=${standingScore}`);

    // Relaxed thresholds - real gym videos have imperfect angles
    if (top.confidence < 25) return "Unknown Exercise";
    if (top.name !== "Standing Position" && (top.confidence - standingScore) < 5) return "Unknown Exercise";
    if (top.name !== "Standing Position" && (top.confidence - second.confidence) < 3) return "Unknown Exercise";

    if (top.name === "Standing Position") return "Unknown Exercise";
    return top.name;
}

/* ---------- Form analysis â€” DEEP per-exercise checks ---------- */
function analyzeForm(landmarks: PoseLandmark[], exercise: string): AnalysisResult {
    const corrections: string[] = [];
    const positives: string[] = [];
    let score = 10;

    const lk = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rk = angle(landmarks[24], landmarks[26], landmarks[28]);
    const le = angle(landmarks[11], landmarks[13], landmarks[15]);
    const re = angle(landmarks[12], landmarks[14], landmarks[16]);
    const lh = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rh = angle(landmarks[12], landmarks[24], landmarks[26]);
    const ls = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rs = angle(landmarks[14], landmarks[12], landmarks[24]);

    const avgKnee = (lk + rk) / 2;
    const avgElbow = (le + re) / 2;
    const avgHip = (lh + rh) / 2;
    const kneeAsym = Math.abs(lk - rk);
    const elbowAsym = Math.abs(le - re);
    const hipAsym = Math.abs(lh - rh);
    const torsoAng = torsoAngleFromVertical(landmarks);

    const jointAngles: Record<string, number> = {
        "Left Knee": lk, "Right Knee": rk,
        "Left Elbow": le, "Right Elbow": re,
        "Left Hip": lh, "Right Hip": rh,
        "Left Shoulder": ls, "Right Shoulder": rs,
        "Torso Angle": Math.round(torsoAng),
    };

    // ---- Universal symmetry ----
    if (kneeAsym > 15) { corrections.push("âš ï¸ Knee asymmetry â€” one knee bending more. Focus on even weight distribution."); score -= 1; }
    else { positives.push("âœ… Good bilateral knee symmetry."); }
    if (hipAsym > 15) { corrections.push("âš ï¸ Hip shift detected â€” hips not level."); score -= 1; }
    else { positives.push("âœ… Hips are level and balanced."); }

    // ===== DEADLIFT =====
    if (exercise === "Deadlift") {
        if (torsoAng > 70) { corrections.push("ðŸ”´ Back nearly horizontal â€” high injury risk. Keep chest proud, engage lats, don't let the bar drift forward."); score -= 2; }
        else if (torsoAng > 55) { corrections.push("âš ï¸ Excessive forward lean â€” brace your core harder, think 'chest up'. You may need to reduce weight."); score -= 1; }
        else { positives.push("âœ… Good back angle â€” spine looks neutral."); }

        if (avgHip < 80) { corrections.push("ðŸ’¡ Hips too low â€” you're squatting the deadlift. Start with hips higher than knees, shoulder blades over the bar."); score -= 1; }
        else { positives.push("âœ… Good hip hinge â€” hips positioned correctly above knees."); }

        if (avgElbow < 150) { corrections.push("ðŸ’ª Arms bending â€” deadlift arms MUST be straight. You're bicep curling the bar, risking a bicep tear. Let arms hang like ropes."); score -= 2; }
        else { positives.push("âœ… Arms straight â€” proper lockout position."); }

        if (avgKnee < 90) { corrections.push("ðŸ¦µ Knees too bent â€” this looks like a squat, not a deadlift. Push hips back more, keep shins more vertical."); score -= 1; }
        if (avgHip > 170) { positives.push("âœ… Full hip extension at lockout â€” excellent finish. Glutes squeezed tight."); }
        if (kneeAsym > 10) { corrections.push("âš ï¸ Uneven knee bend â€” one leg doing more work. Could indicate a hip imbalance."); score -= 1; }
    }

    // ===== SQUAT =====
    if (exercise === "Squat") {
        if (avgKnee > 110) { corrections.push("ðŸ¦µ Squat too shallow â€” thighs should reach parallel (knee ~90Â°). Go lower for full glute/quad activation."); score -= 2; }
        else if (avgKnee > 95) { corrections.push("ðŸ¦µ Almost parallel â€” push a bit deeper for full range of motion."); score -= 1; }
        else { positives.push("âœ… Great squat depth â€” at or below parallel."); }

        const lkX = landmarks[25].x, laX = landmarks[27].x;
        const rkX = landmarks[26].x, raX = landmarks[28].x;
        if (lkX < laX - 0.03 || rkX > raX + 0.03) { corrections.push("ðŸš¨ Knees caving inward (valgus collapse) â€” push knees OUT over toes. Protects ACL and activates glutes. Try band work."); score -= 2; }
        else { positives.push("âœ… Knees tracking well over toes â€” good tracking."); }

        if (torsoAng > 45) { corrections.push("ðŸ”™ Too much forward lean â€” keep chest up, core braced. Bar may be too far forward, or ankle mobility is limited."); score -= 1; }
        else if (torsoAng > 30) { corrections.push("âš ï¸ Slight forward lean â€” acceptable but work on thoracic mobility for a more upright position."); }
        else { positives.push("âœ… Great upright torso position."); }

        if (avgHip > 170 && avgKnee > 160) { positives.push("âœ… Full lockout at top â€” hips and knees extended."); }
    }

    // ===== BENCH PRESS (FLAT) =====
    if (exercise === "Bench Press (Flat)") {
        if (elbowAsym > 20) { corrections.push("âš ï¸ Uneven elbow angles â€” one arm pressing more. Use dumbbells to fix imbalances."); score -= 1; }
        if (avgElbow < 70) { positives.push("âœ… Great range of motion â€” elbows at full depth, bar touching chest."); }
        else if (avgElbow < 100) { positives.push("âœ… Good depth â€” close to chest contact."); }
        else { corrections.push("ðŸ“ Not going deep enough â€” lower bar to chest for full pec activation. Control the eccentric."); score -= 1; }

        if (ls > 90 || rs > 90) { corrections.push("ðŸš¨ Elbows flaring too wide â€” tuck to ~45Â° angle. Think 'arrow shape â†‘' not 'T shape'. Protects your shoulders."); score -= 2; }
        else if (ls > 70 || rs > 70) { corrections.push("âš ï¸ Elbows slightly wide â€” tuck them in a bit more for shoulder safety."); score -= 1; }
        else { positives.push("âœ… Good elbow tuck â€” shoulders in safe position."); }

        if (elbowAsym < 10) { positives.push("âœ… Symmetric pressing â€” both arms working evenly."); }
    }


    if (corrections.length === 0 && positives.length === 0) {
        positives.push("âœ… Pose detected â€” body position looks balanced.");
        positives.push("âœ… No major form issues detected in this frame.");
    }

    score = Math.max(1, Math.min(10, score));
    return { exercise, score, corrections, positives, jointAngles, allScores: [], frameClassifications: [], modelAccuracy: 0 };
}


/* ---------- Skeleton drawing ---------- */
const POSE_CONNECTIONS = [
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
    [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
    [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32],
];

function drawSkeleton(ctx: CanvasRenderingContext2D, landmarks: PoseLandmark[], w: number, h: number) {
    // Draw connections
    ctx.strokeStyle = "#ff6b2b";
    ctx.lineWidth = 3;
    for (const [i, j] of POSE_CONNECTIONS) {
        const a = landmarks[i];
        const b = landmarks[j];
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
    }
    // Draw keypoints
    for (const lm of landmarks) {
        ctx.fillStyle = "#ff6b2b";
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

/* ---------- Component ---------- */
export function FormAnalyzer() {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [progress, setProgress] = useState(0);
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoSrc(URL.createObjectURL(file));
        setResult(null);
        setProgress(0);
    }, []);

    const reset = useCallback(() => {
        setVideoSrc(null);
        setResult(null);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const analyzeVideo = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        setAnalyzing(true);
        setResult(null);
        setProgress(5);

        try {
            // Dynamic import to avoid SSR issues
            const vision = await import("@mediapipe/tasks-vision");
            setProgress(15);

            const { PoseLandmarker, FilesetResolver } = vision;

            const wasmFiles = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            setProgress(30);

            const poseLandmarker = await PoseLandmarker.createFromOptions(wasmFiles, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numPoses: 1,
            });
            setProgress(50);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d")!;

            // Sample multiple frames across the video
            const duration = video.duration;
            const numSamples = 16;
            const allResults: AnalysisResult[] = [];
            const frameClassifications: string[] = [];
            let lastAllScores: ExerciseScore[] = [];

            for (let i = 0; i < numSamples; i++) {
                const time = (duration * (i + 1)) / (numSamples + 1);
                video.currentTime = time;
                await new Promise<void>((resolve) => {
                    video.onseeked = () => resolve();
                });

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                const poseResult = poseLandmarker.detectForVideo(video, performance.now());

                if (poseResult.landmarks && poseResult.landmarks.length > 0) {
                    const landmarks = poseResult.landmarks[0];
                    const exercise = detectExercise(landmarks);
                    const analysis = analyzeForm(landmarks, exercise);
                    allResults.push(analysis);
                    frameClassifications.push(exercise);
                    lastAllScores = scoreAllExercises(landmarks);

                    // Draw final frame skeleton
                    if (i === Math.floor(numSamples / 2)) {
                        ctx.drawImage(video, 0, 0);
                        drawSkeleton(ctx, landmarks, canvas.width, canvas.height);
                    }
                }

                setProgress(50 + Math.round((i / numSamples) * 45));
            }

            poseLandmarker.close();

            // ====== STRICT VALIDATION: Reject non-exercise videos ======
            const poseDetectionRate = allResults.length / numSamples;

            // Gate 1: Not enough frames with a detectable human pose
            if (poseDetectionRate < 0.5) {
                setResult({
                    exercise: "Not an Exercise Video",
                    score: 0,
                    corrections: [
                        "âŒ No exercise detected â€” this doesn't appear to be a workout video.",
                        "ðŸ“¹ Please upload a video where your full body is clearly visible while performing an exercise.",
                        "ðŸ’¡ Ensure good lighting, a clear camera angle, and that at least your torso and limbs are in frame.",
                    ],
                    positives: [],
                    jointAngles: {},
                    allScores: [],
                    frameClassifications: [],
                    modelAccuracy: 0,
                });
                setProgress(100);
                setAnalyzing(false);
                return;
            }

            // Gate 2: Check if most frames are "Standing Position" or "Unknown Exercise" (not exercising)
            const nonExerciseLabels = ["Standing Position", "Unknown Exercise"];
            const nonExerciseCount = frameClassifications.filter(f => nonExerciseLabels.includes(f)).length;
            if (nonExerciseCount > frameClassifications.length * 0.4) {
                setResult({
                    exercise: "No Exercise Detected",
                    score: 0,
                    corrections: [
                        "âŒ This video does not show a recognizable exercise movement.",
                        "ðŸ‹ï¸ Please upload a video of yourself performing an exercise like squats, deadlifts, bench press, curls, etc.",
                        "ðŸ“ The AI needs to see clear joint movement (bending, pressing, pulling) to analyze form.",
                    ],
                    positives: [],
                    jointAngles: {},
                    allScores: [],
                    frameClassifications,
                    modelAccuracy: 0,
                });
                setProgress(100);
                setAnalyzing(false);
                return;
            }

            // Gate 3: Check if confidence is too low (ambiguous/random movement)
            const standingScoreVal = lastAllScores.find(s => s.name === "Standing Position")?.confidence || 0;
            const topScore = lastAllScores.length > 0 ? lastAllScores[0] : null;
            const secondScore = lastAllScores.length > 1 ? lastAllScores[1] : null;
            if (topScore && (
                topScore.confidence < 30 ||
                (topScore.name !== "Standing Position" && (topScore.confidence - standingScoreVal) < 8) ||
                (secondScore && topScore.name !== "Standing Position" && (topScore.confidence - secondScore.confidence) < 5)
            )) {
                setResult({
                    exercise: "Unrecognized Movement",
                    score: 0,
                    corrections: [
                        "âŒ The model could not confidently identify any exercise in this video.",
                        "ðŸŽ¥ Make sure you're performing a clear, standard exercise movement.",
                        "ðŸ’¡ Tips: Face the camera from the side for best results. Avoid loose clothing that hides joint positions.",
                    ],
                    positives: [],
                    jointAngles: {},
                    allScores: lastAllScores,
                    frameClassifications,
                    modelAccuracy: 0,
                });
                setProgress(100);
                setAnalyzing(false);
                return;
            }

            // Aggregate results â€” pick most common exercise, merge all feedback
            if (allResults.length > 0) {
                // Most frequent exercise name
                const exerciseCounts: Record<string, number> = {};
                for (const r of allResults) {
                    exerciseCounts[r.exercise] = (exerciseCounts[r.exercise] || 0) + 1;
                }
                const detectedExercise = Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1])[0][0];

                // Merge unique corrections and positives
                const allCorrections = [...new Set(allResults.flatMap(r => r.corrections))];
                const allPositives = [...new Set(allResults.flatMap(r => r.positives))];
                const avgScore = Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length);
                const lastAngles = allResults[allResults.length - 1].jointAngles;

                const matchCount = frameClassifications.filter(f => f === detectedExercise).length;
                const modelAccuracy = Math.round((matchCount / frameClassifications.length) * 100);

                setResult({
                    exercise: detectedExercise,
                    score: avgScore,
                    corrections: allCorrections,
                    positives: allPositives,
                    jointAngles: lastAngles,
                    allScores: lastAllScores,
                    frameClassifications,
                    modelAccuracy,
                });
            } else {
                setResult({
                    exercise: "No Pose Detected",
                    score: 0,
                    corrections: ["âŒ Could not detect a human pose in the video. Please ensure the full body is visible and the video is well-lit."],
                    positives: [],
                    jointAngles: {},
                    allScores: [],
                    frameClassifications: [],
                    modelAccuracy: 0,
                });
            }

            setProgress(100);
        } catch (err) {
            console.error("Analysis error:", err);
            setResult({
                exercise: "Analysis Error",
                score: 0,
                corrections: ["âŒ An error occurred during analysis. Please try a different video or check your browser compatibility."],
                positives: [],
                jointAngles: {},
                allScores: [],
                frameClassifications: [],
                modelAccuracy: 0,
            });
        }

        setAnalyzing(false);
    }, []);

    // Trigger analysis when video is loaded
    const handleVideoLoaded = useCallback(() => {
        if (videoRef.current) {
            const canvas = canvasRef.current!;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
        }
    }, []);

    const scoreColor = result ? (result.score >= 8 ? "text-emerald-400" : result.score >= 5 ? "text-yellow-400" : "text-red-400") : "";
    const scoreBg = result ? (result.score >= 8 ? "from-emerald-500/20 to-emerald-500/5" : result.score >= 5 ? "from-yellow-500/20 to-yellow-500/5" : "from-red-500/20 to-red-500/5") : "";

    return (
        <section id="form-analyzer" className="relative py-24 px-4">
            <div className="mx-auto max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Brain className="h-4 w-4" />
                        ML-Powered Analysis
                    </div>
                    <h2 className="text-4xl font-bold text-white">AI Form Analyzer</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
                        Upload a video of your exercise and our ML model will identify the movement, analyze your form, and provide real-time corrections â€” like having a personal trainer in your pocket.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left: Video Upload & Preview */}
                        <Card className="glass-card border-forge-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Video className="h-5 w-5 text-forge-orange" />
                                    Video Input
                                </h3>

                                {!videoSrc ? (
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-forge-border rounded-xl cursor-pointer hover:border-forge-orange/50 transition-colors bg-slate-900/30">
                                        <Upload className="h-10 w-10 text-slate-500 mb-3" />
                                        <span className="text-sm text-slate-400 font-medium">Click to upload exercise video</span>
                                        <span className="text-xs text-slate-600 mt-1">MP4, MOV, WebM â€” max 50MB</span>
                                        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
                                    </label>
                                ) : (
                                    <div className="relative">
                                        <video
                                            ref={videoRef}
                                            src={videoSrc}
                                            className="w-full rounded-xl bg-black"
                                            controls
                                            onLoadedMetadata={handleVideoLoaded}
                                        />
                                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-xl pointer-events-none" style={{ display: result ? "block" : "none" }} />
                                    </div>
                                )}

                                {videoSrc && (
                                    <div className="flex gap-3 mt-4">
                                        <Button
                                            onClick={analyzeVideo}
                                            disabled={analyzing}
                                            className="flex-1 bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25"
                                        >
                                            {analyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Play className="h-4 w-4 mr-2" />Analyze Form</>}
                                        </Button>
                                        <Button onClick={reset} variant="outline" className="border-forge-border text-slate-300 hover:text-white">
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                {analyzing && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>Processing...</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <motion.div
                                                className="bg-linear-to-r from-forge-orange to-forge-orange-light h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right: Analysis Results */}
                        <Card className="glass-card border-forge-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-forge-orange" />
                                    Analysis Results
                                </h3>

                                {!result && !analyzing && (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <Brain className="h-12 w-12 text-slate-600 mb-3" />
                                        <p className="text-slate-500 text-sm">Upload a video and click &quot;Analyze Form&quot; to get AI-powered form analysis.</p>
                                        <p className="text-slate-600 text-xs mt-2">Powered by MediaPipe Pose Detection</p>
                                    </div>
                                )}

                                {analyzing && !result && (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <Loader2 className="h-10 w-10 text-forge-orange animate-spin mb-3" />
                                        <p className="text-slate-400 text-sm">Running ML pose detection...</p>
                                        <p className="text-slate-600 text-xs mt-1">Sampling frames and analyzing joint angles</p>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {result && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                            {/* Exercise + Score */}
                                            <div className={`flex items-center justify-between p-4 rounded-xl bg-linear-to-r ${scoreBg}`}>
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Detected Exercise</p>
                                                    <p className="text-xl font-bold text-white">{result.exercise}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Form Score</p>
                                                    <p className={`text-4xl font-black ${scoreColor}`}>{result.score}<span className="text-lg text-slate-500">/10</span></p>
                                                </div>
                                            </div>

                                            {/* Star rating */}
                                            <div className="flex justify-center gap-1">
                                                {[...Array(10)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < result.score ? "text-forge-orange fill-forge-orange" : "text-slate-700"}`} />
                                                ))}
                                            </div>

                                            {/* Positives */}
                                            {result.positives.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />What You&apos;re Doing Right</p>
                                                    <div className="space-y-1.5">
                                                        {result.positives.map((p, i) => (
                                                            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="text-sm text-slate-300">{p}</motion.p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Corrections */}
                                            {result.corrections.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" />Form Corrections</p>
                                                    <div className="space-y-1.5">
                                                        {result.corrections.map((c, i) => (
                                                            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="text-sm text-slate-300">{c}</motion.p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Joint Angles */}
                                            <div>
                                                <p className="text-sm font-semibold text-slate-400 mb-2">Joint Angles (degrees)</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.entries(result.jointAngles).map(([joint, deg]) => (
                                                        <div key={joint} className="flex justify-between px-3 py-1.5 rounded-lg bg-slate-900/50 text-xs">
                                                            <span className="text-slate-400">{joint}</span>
                                                            <span className="text-white font-mono font-semibold">{deg}Â°</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* === Model Diagnostics Toggle === */}
                                            <button
                                                onClick={() => setShowDiagnostics(!showDiagnostics)}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/60 border border-forge-border hover:border-forge-orange/40 transition-colors text-sm"
                                            >
                                                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                                                    <Activity className="h-4 w-4 text-forge-orange" />
                                                    ðŸ”¬ Model Diagnostics
                                                </span>
                                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${showDiagnostics ? "rotate-180" : ""}`} />
                                            </button>

                                            <AnimatePresence>
                                                {showDiagnostics && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-5 overflow-hidden"
                                                    >
                                                        {/* --- Model Accuracy Gauge --- */}
                                                        <div className="p-4 rounded-xl bg-slate-900/60 border border-forge-border">
                                                            <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                                <Target className="h-4 w-4 text-forge-orange" />
                                                                Classification Consistency
                                                            </p>
                                                            <div className="flex items-center gap-6">
                                                                <div className="relative w-24 h-24 shrink-0">
                                                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                                                        <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="8" fill="none" />
                                                                        <circle
                                                                            cx="50" cy="50" r="42"
                                                                            stroke={result.modelAccuracy >= 85 ? "#34d399" : result.modelAccuracy >= 60 ? "#fbbf24" : "#f87171"}
                                                                            strokeWidth="8" fill="none"
                                                                            strokeDasharray={`${result.modelAccuracy * 2.64} 264`}
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <span className={`text-2xl font-black ${result.modelAccuracy >= 85 ? "text-emerald-400" : result.modelAccuracy >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                                                                            {result.modelAccuracy}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs text-slate-500 leading-relaxed">
                                                                    <p>Across <span className="text-white font-semibold">{result.frameClassifications.length}</span> sampled frames,</p>
                                                                    <p><span className="text-white font-semibold">{result.frameClassifications.filter(f => f === result.exercise).length}</span> frames identified as <span className="text-forge-orange font-semibold">{result.exercise}</span>.</p>
                                                                    <p className="mt-1">{result.modelAccuracy >= 85 ? "âœ… High confidence â€” consistent detection." : result.modelAccuracy >= 60 ? "âš ï¸ Moderate â€” some frames show different exercises." : "ðŸ”´ Low consistency â€” model may be uncertain."}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* --- Confidence Predictions Bar Chart --- */}
                                                        {result.allScores.length > 0 && (
                                                            <div className="p-4 rounded-xl bg-slate-900/60 border border-forge-border">
                                                                <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                                    <BarChart3 className="h-4 w-4 text-forge-orange" />
                                                                    Confidence Predictions
                                                                </p>
                                                                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                                                    {result.allScores.filter(s => s.confidence > 0).map((s) => {
                                                                        const maxConf = Math.max(...result.allScores.map(x => x.confidence), 1);
                                                                        const pct = Math.round((s.confidence / maxConf) * 100);
                                                                        const isDetected = s.name === result.exercise;
                                                                        return (
                                                                            <div key={s.name} className="flex items-center gap-2 text-xs">
                                                                                <span className={`w-36 truncate text-right ${isDetected ? "text-forge-orange font-bold" : "text-slate-500"}`}>{s.name}</span>
                                                                                <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                                                                                    <motion.div
                                                                                        initial={{ width: 0 }}
                                                                                        animate={{ width: `${pct}%` }}
                                                                                        transition={{ duration: 0.5, delay: 0.1 }}
                                                                                        className={`h-full rounded-full ${isDetected ? "bg-linear-to-r from-forge-orange to-forge-orange-light" : "bg-slate-600"}`}
                                                                                    />
                                                                                </div>
                                                                                <span className={`w-8 text-right font-mono ${isDetected ? "text-forge-orange font-bold" : "text-slate-500"}`}>{s.confidence}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* --- Confusion Matrix --- */}
                                                        {result.frameClassifications.length > 0 && (
                                                            <div className="p-4 rounded-xl bg-slate-900/60 border border-forge-border">
                                                                <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                                    <Brain className="h-4 w-4 text-forge-orange" />
                                                                    Frame-by-Frame Classification
                                                                </p>
                                                                <div className="space-y-1.5">
                                                                    {result.frameClassifications.map((cls, i) => {
                                                                        const isMatch = cls === result.exercise;
                                                                        return (
                                                                            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${isMatch ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
                                                                                <span className="text-slate-500 font-mono w-16">Frame {i + 1}</span>
                                                                                <span className={`font-semibold ${isMatch ? "text-emerald-400" : "text-amber-400"}`}>{cls}</span>
                                                                                <span className="ml-auto">{isMatch ? "âœ…" : "âš ï¸"}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Supported exercises info */}
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
                        <p className="text-sm text-slate-500 mb-3">Exercises the AI can detect and analyze:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {["Deadlift", "Squat (Barbell)", "Bench Press (Flat)"].map(ex => (
                                <Badge key={ex} className="bg-slate-800/50 text-slate-400 border-forge-border hover:text-forge-orange transition-colors">{ex}</Badge>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
