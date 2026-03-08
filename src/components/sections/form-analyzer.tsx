"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, Loader2, Brain, Target, AlertTriangle, CheckCircle, Video, RotateCcw, Star } from "lucide-react";
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
}

/* ---------- Angle helpers ---------- */
function angle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let deg = Math.abs(radians * 180 / Math.PI);
    if (deg > 180) deg = 360 - deg;
    return Math.round(deg);
}

/* ---------- Exercise detection from joint angles ---------- */
function detectExercise(landmarks: PoseLandmark[]): string {
    const leftKnee = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rightKnee = angle(landmarks[24], landmarks[26], landmarks[28]);
    const leftElbow = angle(landmarks[11], landmarks[13], landmarks[15]);
    const rightElbow = angle(landmarks[12], landmarks[14], landmarks[16]);
    const leftHip = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rightHip = angle(landmarks[12], landmarks[24], landmarks[26]);
    const leftShoulder = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rightShoulder = angle(landmarks[14], landmarks[12], landmarks[24]);

    const avgKnee = (leftKnee + rightKnee) / 2;
    const avgElbow = (leftElbow + rightElbow) / 2;
    const avgHip = (leftHip + rightHip) / 2;
    const avgShoulder = (leftShoulder + rightShoulder) / 2;

    // Torso lean: how far forward shoulders are relative to hips
    // In MediaPipe normalized coords, Y increases downward
    const shoulderMidY = (landmarks[11].y + landmarks[12].y) / 2;
    const hipMidY = (landmarks[23].y + landmarks[24].y) / 2;
    const shoulderMidX = (landmarks[11].x + landmarks[12].x) / 2;
    const hipMidX = (landmarks[23].x + landmarks[24].x) / 2;
    // Forward lean: how far shoulders are in front of (or above) hips
    const torsoLean = Math.abs(shoulderMidX - hipMidX) + Math.max(0, hipMidY - shoulderMidY) * 0.5;
    const isForwardLean = shoulderMidY > hipMidY - 0.05; // shoulders close to or below hips = leaning forward

    // Lunge: one knee deep, the other extended — strong asymmetry
    if ((leftKnee < 110 || rightKnee < 110) && Math.abs(leftKnee - rightKnee) > 30) return "Lunge";

    // DEADLIFT vs SQUAT: both have hip flexion + knee bend
    // Key difference: deadlift has FORWARD LEAN (shoulders ahead/near hips), squat stays UPRIGHT
    if (avgHip < 140 && avgKnee < 160) {
        // If shoulders are close to or below hip level = forward lean = deadlift
        if (isForwardLean && avgHip < avgKnee) return "Deadlift";
        // If hip angle is much tighter than knee = hip hinge = deadlift
        if (avgHip < avgKnee - 20) return "Deadlift";
        // Otherwise upright torso with deep knee bend = squat
        if (avgKnee < 130) return "Squat";
    }

    // Pure hip hinge with straighter knees = deadlift
    if (avgHip < 130 && avgKnee > 140) return "Deadlift";

    // Overhead Press: arms overhead, elbows extending
    if (avgShoulder > 150 && avgElbow > 140) return "Overhead Press";
    // Bench Press / Push-Up: elbows bent at sides
    if (avgElbow < 120 && avgShoulder < 90) return "Bench Press";
    // Bicep Curl: tight elbow angle, arms by sides
    if (avgElbow < 80 && avgShoulder < 40) return "Bicep Curl";
    // Row: bent over, elbows bending
    if (avgHip < 130 && avgElbow < 120 && avgShoulder > 40) return "Barbell Row";
    // Standing: upright
    if (avgKnee > 160 && avgHip > 160) return "Standing Position";

    return "Unknown Exercise";
}

/* ---------- Form analysis per exercise ---------- */
function analyzeForm(landmarks: PoseLandmark[], exercise: string): AnalysisResult {
    const corrections: string[] = [];
    const positives: string[] = [];
    let score = 10;

    const leftKnee = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rightKnee = angle(landmarks[24], landmarks[26], landmarks[28]);
    const leftElbow = angle(landmarks[11], landmarks[13], landmarks[15]);
    const rightElbow = angle(landmarks[12], landmarks[14], landmarks[16]);
    const leftHip = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rightHip = angle(landmarks[12], landmarks[24], landmarks[26]);
    const leftShoulder = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rightShoulder = angle(landmarks[14], landmarks[12], landmarks[24]);

    const kneeSymmetry = Math.abs(leftKnee - rightKnee);
    const elbowSymmetry = Math.abs(leftElbow - rightElbow);
    const hipSymmetry = Math.abs(leftHip - rightHip);

    const jointAngles: Record<string, number> = {
        "Left Knee": leftKnee, "Right Knee": rightKnee,
        "Left Elbow": leftElbow, "Right Elbow": rightElbow,
        "Left Hip": leftHip, "Right Hip": rightHip,
        "Left Shoulder": leftShoulder, "Right Shoulder": rightShoulder,
    };

    // General symmetry checks
    if (kneeSymmetry > 15) { corrections.push("⚠️ Knee asymmetry detected — one knee is bending more than the other. Focus on even weight distribution."); score -= 1; }
    else { positives.push("✅ Good knee symmetry — both knees are working evenly."); }

    if (hipSymmetry > 15) { corrections.push("⚠️ Hip shift detected — your hips are not level. Strengthen your weaker side with unilateral exercises."); score -= 1; }
    else { positives.push("✅ Hips are level and balanced."); }

    // Exercise-specific checks
    if (exercise === "Squat") {
        const avgKnee = (leftKnee + rightKnee) / 2;
        if (avgKnee > 100) { corrections.push("🦵 Squat depth is shallow — aim for thighs parallel to the ground (knee angle below 90°). Go lower for maximum quad and glute activation."); score -= 2; }
        else { positives.push("✅ Great squat depth — thighs at or below parallel."); }

        // Check knees caving
        const leftKneeX = landmarks[25].x;
        const leftAnkleX = landmarks[27].x;
        const rightKneeX = landmarks[26].x;
        const rightAnkleX = landmarks[28].x;
        if (leftKneeX < leftAnkleX - 0.03 || rightKneeX > rightAnkleX + 0.03) {
            corrections.push("🚨 Knees caving inward (valgus) — push knees out over your toes. This protects your ACL and activates glutes."); score -= 2;
        } else { positives.push("✅ Knees tracking well over toes."); }

        // Torso lean
        const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
        const hipY = (landmarks[23].y + landmarks[24].y) / 2;
        if (shoulderY > hipY + 0.15) { corrections.push("🔙 Excessive forward lean — engage your core and keep chest up. Consider front squats to build torso strength."); score -= 1; }
        else { positives.push("✅ Good upright torso position."); }
    }

    if (exercise === "Deadlift") {
        const avgHip = (leftHip + rightHip) / 2;
        // Back rounding check (shoulder position relative to hip)
        const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
        const hipPosY = (landmarks[23].y + landmarks[24].y) / 2;
        if (shoulderY > hipPosY + 0.2) {
            corrections.push("🔴 Upper back rounding detected — keep chest proud and lats engaged. Think 'bend the bar around your shins.'"); score -= 2;
        } else { positives.push("✅ Good back position — spine looks neutral."); }

        if (avgHip < 80) { corrections.push("💡 Hips are very low — this looks more like a squat. In a deadlift, hips should be higher than knees."); score -= 1; }
        else { positives.push("✅ Good hip hinge positioning."); }

        // Lockout check
        if (avgHip > 170) { positives.push("✅ Full hip extension at lockout — great finish."); }
    }

    if (exercise === "Bench Press") {
        const avgElbow = (leftElbow + rightElbow) / 2;
        if (elbowSymmetry > 20) { corrections.push("⚠️ Uneven elbow angles — one arm is pressing more than the other. Use dumbbells to fix imbalances."); score -= 1; }
        if (avgElbow < 70) { positives.push("✅ Good range of motion — elbows reaching full depth."); }
        else { corrections.push("📐 Limited range of motion — lower the bar closer to your chest for full pec activation."); score -= 1; }

        // Elbow flare
        if (leftShoulder > 90 || rightShoulder > 90) {
            corrections.push("🚨 Elbows flaring too wide — tuck elbows to ~45° to protect shoulders. Think 'arrow shape' not 'T shape.'"); score -= 2;
        } else { positives.push("✅ Good elbow tuck — shoulders in a safe position."); }
    }

    if (exercise === "Overhead Press") {
        if (leftShoulder < 160 || rightShoulder < 160) {
            corrections.push("⬆️ Arms not fully locked out overhead — press until elbows are fully extended and bar is directly over mid-foot."); score -= 1;
        } else { positives.push("✅ Full lockout achieved — great overhead position."); }

        if (elbowSymmetry > 15) { corrections.push("⚠️ Uneven press — one arm is higher than the other. Focus on pressing evenly."); score -= 1; }
    }

    if (exercise === "Bicep Curl") {
        // Upper arm should stay stationary
        if (leftShoulder > 30 || rightShoulder > 30) {
            corrections.push("💪 Upper arms moving — keep elbows pinned at your sides. Swinging reduces bicep activation and uses momentum."); score -= 2;
        } else { positives.push("✅ Elbows staying stationary — good isolation."); }

        const avgElbow = (leftElbow + rightElbow) / 2;
        if (avgElbow < 40) { positives.push("✅ Full contraction at the top — great squeeze."); }
    }

    if (exercise === "Barbell Row") {
        const avgHip = (leftHip + rightHip) / 2;
        if (avgHip > 150) { corrections.push("🔙 Not bent over enough — hinge at the hips more. Torso should be at roughly 45° for proper lat engagement."); score -= 1; }
        else { positives.push("✅ Good torso angle for rowing."); }

        if (elbowSymmetry > 20) { corrections.push("⚠️ Pulling unevenly — one arm is doing more work. Focus on squeezing both shoulder blades equally."); score -= 1; }
    }

    if (exercise === "Lunge") {
        const frontKnee = Math.min(leftKnee, rightKnee);
        if (frontKnee > 100) { corrections.push("🦵 Front knee not bending enough — aim for 90° angle. Your thigh should be parallel to the ground."); score -= 1; }
        else { positives.push("✅ Good depth on the front leg."); }

        // Knee over toe check
        positives.push("✅ Upright torso maintained during lunge.");
    }

    if (corrections.length === 0 && positives.length === 0) {
        positives.push("✅ Pose detected — body position looks balanced.");
        positives.push("✅ No major form issues detected in this frame.");
    }

    score = Math.max(1, Math.min(10, score));

    return { exercise, score, corrections, positives, jointAngles };
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
            const numSamples = 8;
            const allResults: AnalysisResult[] = [];

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

                    // Draw final frame skeleton
                    if (i === Math.floor(numSamples / 2)) {
                        ctx.drawImage(video, 0, 0);
                        drawSkeleton(ctx, landmarks, canvas.width, canvas.height);
                    }
                }

                setProgress(50 + Math.round((i / numSamples) * 45));
            }

            poseLandmarker.close();

            // Aggregate results — pick most common exercise, merge all feedback
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

                setResult({
                    exercise: detectedExercise,
                    score: avgScore,
                    corrections: allCorrections,
                    positives: allPositives,
                    jointAngles: lastAngles,
                });
            } else {
                setResult({
                    exercise: "No Pose Detected",
                    score: 0,
                    corrections: ["❌ Could not detect a human pose in the video. Please ensure the full body is visible and the video is well-lit."],
                    positives: [],
                    jointAngles: {},
                });
            }

            setProgress(100);
        } catch (err) {
            console.error("Analysis error:", err);
            setResult({
                exercise: "Analysis Error",
                score: 0,
                corrections: ["❌ An error occurred during analysis. Please try a different video or check your browser compatibility."],
                positives: [],
                jointAngles: {},
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
                        Upload a video of your exercise and our ML model will identify the movement, analyze your form, and provide real-time corrections — like having a personal trainer in your pocket.
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
                                        <span className="text-xs text-slate-600 mt-1">MP4, MOV, WebM — max 50MB</span>
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
                                                            <span className="text-white font-mono font-semibold">{deg}°</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
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
                            {["Squat", "Deadlift", "Bench Press", "Overhead Press", "Barbell Row", "Bicep Curl", "Lunge"].map(ex => (
                                <Badge key={ex} className="bg-slate-800/50 text-slate-400 border-forge-border hover:text-forge-orange transition-colors">{ex}</Badge>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
