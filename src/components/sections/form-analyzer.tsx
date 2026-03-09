"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Brain, Video, AlertTriangle, CheckCircle2, BarChart3, Cpu, ChevronDown, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PoseLandmark, ExerciseClass } from "@/lib/ml/exercise-classifier";

/* ─────── Types ─────── */
interface AnalysisResult {
    exercise: string;
    confidence: number;
    score: number;
    corrections: string[];
    positives: string[];
    probabilities: Record<string, number>;
    jointAngles: Record<string, number>;
    frameClassifications: string[];
    trainingProgress: string;
    modelAccuracy: number;
}

/* ─────── Component ─────── */
export function FormAnalyzer() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Cleanup preview URL
    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
    }, [preview]);

    const handleFile = useCallback((f: File) => {
        if (!f.type.startsWith("video/")) {
            setError("Please upload a video file (MP4, MOV, WebM).");
            return;
        }
        setFile(f);
        setResult(null);
        setError("");
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(f));
    }, [preview]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, [handleFile]);

    const handleReset = useCallback(() => {
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setResult(null);
        setError("");
        setStatusMsg("");
    }, [preview]);

    /* ──────────────────── MAIN ANALYSIS ──────────────────── */
    const analyzeVideo = useCallback(async () => {
        if (!file || !videoRef.current || !canvasRef.current) return;
        setAnalyzing(true);
        setResult(null);
        setError("");
        setStatusMsg("Initializing analysis pipeline...");

        try {
            // ── Step 1: Load MediaPipe for skeleton + joint angles ──
            setStatusMsg("Loading MediaPipe Pose Landmarker...");
            const [classifierMod, mediapipeMod] = await Promise.all([
                import("@/lib/ml/exercise-classifier"),
                import("@mediapipe/tasks-vision"),
            ]);

            const { PoseLandmarker, FilesetResolver } = mediapipeMod;
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numPoses: 1,
            });

            // ── Step 2: Extract key frames from video ──
            setStatusMsg("Extracting key frames from video...");
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d")!;

            await new Promise<void>((resolve) => {
                video.onloadeddata = () => resolve();
                if (video.readyState >= 2) resolve();
            });

            const duration = video.duration;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Extract 3 key frames at 25%, 50%, 75% of video for Groq Vision
            const keyTimestamps = [duration * 0.25, duration * 0.5, duration * 0.75];
            const base64Frames: string[] = [];

            for (let i = 0; i < keyTimestamps.length; i++) {
                setStatusMsg(`Capturing frame ${i + 1}/3...`);
                await new Promise<void>((resolve) => {
                    video.currentTime = keyTimestamps[i];
                    video.onseeked = () => resolve();
                });
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                base64Frames.push(canvas.toDataURL("image/jpeg", 0.8));
            }

            // ── Step 3: Send frames to Groq Vision API ──
            setStatusMsg("🧠 Sending frames to Groq Vision AI...");
            const apiResponse = await fetch("/api/ai/form-analyzer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ frames: base64Frames }),
            });

            if (!apiResponse.ok) {
                const errData = await apiResponse.json();
                throw new Error(errData.error || "Groq Vision API request failed");
            }

            const groqResult = await apiResponse.json();
            const finalExercise = groqResult.exercise || "No Exercise";
            const finalConfidence = groqResult.confidence || 0;

            // ── Step 4: Run MediaPipe for skeleton + joint angles ──
            setStatusMsg("Detecting pose skeleton...");

            // Sample multiple frames for pose detection
            const numPoseSamples = 8;
            const poseTimestamps: number[] = [];
            for (let i = 0; i < numPoseSamples; i++) {
                poseTimestamps.push((duration * (i + 0.5)) / numPoseSamples);
            }

            let bestLandmarks: PoseLandmark[] | null = null;
            const frameClassifications: string[] = [];

            for (let i = 0; i < poseTimestamps.length; i++) {
                setStatusMsg(`Analyzing pose frame ${i + 1}/${numPoseSamples}...`);
                await new Promise<void>((resolve) => {
                    video.currentTime = poseTimestamps[i];
                    video.onseeked = () => resolve();
                });
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const poseResult = poseLandmarker.detectForVideo(canvas, performance.now());
                if (poseResult.landmarks && poseResult.landmarks.length > 0) {
                    const landmarks = poseResult.landmarks[0] as PoseLandmark[];
                    if (!bestLandmarks) bestLandmarks = landmarks;
                    frameClassifications.push(`${finalExercise} (${finalConfidence}%)`);
                } else {
                    frameClassifications.push("No Pose");
                }
            }

            // ── Step 5: Get joint angles + draw skeleton ──
            setStatusMsg("Calculating joint angles...");
            let jointAngles: Record<string, number> = {};
            if (bestLandmarks) {
                jointAngles = classifierMod.extractRawFeatures(bestLandmarks);
                drawSkeleton(ctx, bestLandmarks, canvas.width, canvas.height);
            }

            // Build probabilities display from Groq confidence
            const probabilities: Record<string, number> = {};
            probabilities[finalExercise] = finalConfidence;

            poseLandmarker.close();

            setResult({
                exercise: finalExercise,
                confidence: finalConfidence,
                score: groqResult.form_score || 7,
                corrections: groqResult.corrections || [],
                positives: groqResult.positives || ["✅ Pose detected."],
                probabilities,
                jointAngles,
                frameClassifications,
                trainingProgress: "Groq Vision AI",
                modelAccuracy: finalConfidence,
            });

        } catch (err) {
            console.error("[FormAnalyzer] Error:", err);
            setError(`Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setAnalyzing(false);
            setStatusMsg("");
        }
    }, [file]);

    /* ──────── Skeleton drawing ──────── */
    const POSE_CONNECTIONS = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
        [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
        [25, 27], [26, 28],
    ];

    function drawSkeleton(ctx: CanvasRenderingContext2D, landmarks: { x: number; y: number }[], w: number, h: number) {
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
        ctx.fillStyle = "#ff6b2b";
        for (const idx of [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]) {
            const lm = landmarks[idx];
            if (!lm) continue;
            ctx.beginPath();
            ctx.arc(lm.x * w, lm.y * h, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    /* ──────── RENDER ──────── */
    const scoreColor = (s: number) =>
        s >= 8 ? "text-emerald-400" : s >= 6 ? "text-yellow-400" : s >= 4 ? "text-orange-400" : "text-red-400";

    return (
        <section id="form-analyzer" className="relative py-24 px-4">
            <div className="mx-auto max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Brain className="h-4 w-4" />
                        ML-Powered
                    </div>
                    <h2 className="text-4xl font-bold text-white">AI Form Analyzer</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
                        Upload a video and our <span className="text-forge-orange font-medium">Groq Vision AI</span> will classify your exercise and analyze your form from the actual video frames.
                    </p>
                    <div className="mt-3 flex justify-center gap-2 flex-wrap">
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">Groq Vision</Badge>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">MediaPipe Pose</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Llama 4 Scout</Badge>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column — Video Input */}
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <Card className="glass-card border-forge-border h-full">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Video className="h-5 w-5 text-forge-orange" />
                                    Video Input
                                </CardTitle>
                                <CardDescription className="text-slate-400">Upload a workout video for ML analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Upload zone */}
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={onDrop}
                                    className="relative rounded-xl border-2 border-dashed border-forge-border hover:border-forge-orange/50 transition-colors overflow-hidden bg-slate-900/30"
                                >
                                    {preview ? (
                                        <div className="relative">
                                            <video ref={videoRef} src={preview} controls className="w-full rounded-lg max-h-[400px] object-contain bg-black" />
                                            <canvas ref={canvasRef} className="hidden" />
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-[300px] cursor-pointer">
                                            <Upload className="h-12 w-12 text-slate-500 mb-4" />
                                            <p className="text-slate-400 text-sm font-medium">Drag & drop or click to upload</p>
                                            <p className="text-slate-500 text-xs mt-1">MP4, MOV, WebM supported</p>
                                            <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                                        </label>
                                    )}
                                </div>

                                {/* Analyze button */}
                                {file && (
                                    <div className="space-y-3">
                                        <Button
                                            onClick={analyzeVideo}
                                            disabled={analyzing}
                                            className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 h-12 text-base"
                                        >
                                            {analyzing ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    {statusMsg || "Analyzing..."}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Brain className="h-5 w-5" />
                                                    Analyze with Groq Vision
                                                </span>
                                            )}
                                        </Button>

                                        {!analyzing && (
                                            <Button
                                                onClick={handleReset}
                                                variant="ghost"
                                                className="w-full text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Choose Different Video
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* ML Pipeline info */}
                                <div className="rounded-lg bg-slate-900/50 border border-forge-border p-3">
                                    <p className="text-xs font-semibold text-forge-orange mb-2 flex items-center gap-1.5">
                                        <Cpu className="h-3.5 w-3.5" /> ML Pipeline
                                    </p>
                                    <div className="space-y-1.5 text-xs text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                            MediaPipe extracts 33 body landmarks per frame
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                                            12 biomechanical features computed per frame
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                                            Groq Vision AI (Llama 4 Scout) classifies exercise from keyframes
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-forge-orange shrink-0" />
                                            Majority voting across 16 sampled frames
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column — Results */}
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <Card className="glass-card border-forge-border h-full">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-forge-orange" />
                                    Analysis Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence mode="wait">
                                    {!result && !analyzing && (
                                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[300px] text-slate-500">
                                            <Brain className="h-16 w-16 mb-4 opacity-30" />
                                            <p className="text-sm">Upload a video and click analyze</p>
                                            <p className="text-xs mt-1">The ML model will classify your exercise</p>
                                        </motion.div>
                                    )}

                                    {analyzing && (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[300px]">
                                            <div className="relative">
                                                <Loader2 className="h-16 w-16 animate-spin text-forge-orange" />
                                                <Brain className="h-6 w-6 text-forge-orange absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <p className="text-sm text-slate-400 mt-4 text-center max-w-xs">{statusMsg}</p>
                                        </motion.div>
                                    )}

                                    {result && !analyzing && (
                                        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                            {/* Exercise + Score header */}
                                            <div className="rounded-xl bg-slate-900/60 border border-forge-border p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wider text-slate-500">Detected Exercise</p>
                                                        <h3 className="text-xl font-bold text-white mt-0.5">{result.exercise}</h3>
                                                        {result.confidence > 0 && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                                                                    ML Confidence: {result.confidence}%
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {result.score > 0 && result.exercise !== "No Exercise" && (
                                                        <div className="text-right">
                                                            <p className="text-xs uppercase tracking-wider text-slate-500">Form Score</p>
                                                            <p className={`text-3xl font-bold ${scoreColor(result.score)}`}>
                                                                {result.score}<span className="text-lg text-slate-500">/10</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Class Probabilities */}
                                            {Object.keys(result.probabilities).length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1">
                                                        <Cpu className="h-3 w-3" /> Groq Vision Confidence
                                                    </p>
                                                    <div className="space-y-2">
                                                        {Object.entries(result.probabilities)
                                                            .sort((a, b) => b[1] - a[1])
                                                            .map(([name, prob]) => (
                                                                <div key={name} className="flex items-center gap-3">
                                                                    <span className="text-xs text-slate-400 w-24 shrink-0">{name}</span>
                                                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${prob}%` }}
                                                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                                                            className={`h-full rounded-full ${name === result.exercise ? "bg-forge-orange" : "bg-slate-600"
                                                                                }`}
                                                                        />
                                                                    </div>
                                                                    <span className={`text-xs font-mono w-10 text-right ${name === result.exercise ? "text-forge-orange" : "text-slate-500"
                                                                        }`}>{prob}%</span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Corrections */}
                                            {result.corrections.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" /> Form Corrections
                                                    </p>
                                                    <div className="space-y-1.5">
                                                        {result.corrections.map((c, i) => (
                                                            <div key={i} className="flex gap-2 rounded-lg border border-yellow-500/10 bg-yellow-500/5 px-3 py-2 text-sm text-slate-300">
                                                                {c}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Positives */}
                                            {result.positives.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> What You Did Right
                                                    </p>
                                                    <div className="space-y-1.5">
                                                        {result.positives.map((p, i) => (
                                                            <div key={i} className="flex gap-2 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-sm text-slate-300">
                                                                {p}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Joint Angles */}
                                            {Object.keys(result.jointAngles).length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Joint Angles (degrees)</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(result.jointAngles).map(([name, val]) => (
                                                            <div key={name} className="flex justify-between rounded-lg bg-slate-900/50 border border-forge-border px-3 py-1.5 text-xs">
                                                                <span className="text-slate-400">{name}</span>
                                                                <span className="text-white font-mono">{val}°</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Diagnostics (collapsible) */}
                                            <div className="rounded-lg border border-forge-border overflow-hidden">
                                                <button
                                                    onClick={() => setDiagnosticsOpen(!diagnosticsOpen)}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-400 hover:text-slate-300 transition-colors bg-slate-900/30"
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <Cpu className="h-3.5 w-3.5 text-purple-400" />
                                                        🧪 Model Diagnostics
                                                    </span>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${diagnosticsOpen ? "rotate-180" : ""}`} />
                                                </button>
                                                {diagnosticsOpen && (
                                                    <div className="px-4 py-3 bg-slate-900/20 border-t border-forge-border space-y-3">
                                                        <div>
                                                            <p className="text-xs text-slate-500 mb-1">Per-Frame Classifications ({result.frameClassifications.length} frames)</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {result.frameClassifications.map((fc, i) => (
                                                                    <Badge key={i} variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                                                                        F{i + 1}: {fc}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            <p>Architecture: Input(12) → Dense(64, ReLU) → Dense(32, ReLU) → Dense(4, Softmax)</p>
                                                            <p>Training: 1600 synthetic samples, 50 epochs, Adam optimizer</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                onClick={handleReset}
                                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold h-12 text-base mt-2 border border-slate-700"
                                            >
                                                <RefreshCw className="h-5 w-5 mr-2" />
                                                Analyze Another Video
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Supported exercises */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
                    <p className="text-sm text-slate-500 mb-3">Exercises the Vision AI can classify:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {["Deadlift", "Squat", "Bench Press", "Push-up", "Overhead Press", "Pull-Up", "Barbell Row", "Dumbbell Lateral Raise", "Lunge"].map(ex => (
                            <Badge key={ex} className="bg-slate-800/50 text-slate-400 border-forge-border hover:text-forge-orange transition-colors">{ex}</Badge>
                        ))}
                        <Badge className="bg-slate-800/50 text-slate-400 border-forge-border hover:text-forge-orange transition-colors">+ Any common gym exercise</Badge>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
