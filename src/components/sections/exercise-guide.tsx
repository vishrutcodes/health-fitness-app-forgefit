"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Dumbbell, AlertTriangle, Star, Volume2, VolumeOff, Pause, Play, SkipForward } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const popularExercises = [
    "Squat", "Bench Press", "Deadlift", "Pull Up", "Overhead Press", "Barbell Row", "Lunge", "Dips",
    "Romanian Deadlift", "Incline Bench Press", "Leg Press", "Lat Pulldown", "Cable Fly",
    "Seated Row", "Front Squat", "Hip Thrust", "Face Pull", "Tricep Pushdown",
    "Hammer Curl", "Lateral Raise", "Bulgarian Split Squat", "Rack Pull", "T-Bar Row",
    "Close Grip Bench Press", "Leg Curl", "Calf Raise", "Preacher Curl", "Skull Crusher",
    "Pendlay Row", "Sumo Deadlift", "Arnold Press", "Chest Dip", "Cable Lateral Raise",
    "Goblet Squat", "Deficit Deadlift", "Reverse Fly", "Concentration Curl", "Hack Squat",
];

interface ExerciseData {
    name: string;
    muscles: string[];
    formTips: string[];
    commonMistakes: string[];
    variations: string[];
    difficulty: string;
}

export function ExerciseGuide() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState<ExerciseData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Voice guidance state
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeStep, setActiveStep] = useState(-1);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const stepsQueueRef = useRef<string[]>([]);
    const currentIndexRef = useRef(0);

    useEffect(() => {
        setVoiceSupported(typeof window !== "undefined" && "speechSynthesis" in window);
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Stop speech when new exercise is loaded
    useEffect(() => {
        stopVoice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const speakStep = useCallback((index: number) => {
        if (!voiceSupported || index >= stepsQueueRef.current.length) {
            setIsSpeaking(false);
            setIsPaused(false);
            setActiveStep(-1);
            return;
        }

        currentIndexRef.current = index;
        setActiveStep(index);

        const utterance = new SpeechSynthesisUtterance(stepsQueueRef.current[index]);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to pick a good English voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find((v) =>
            v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
        ) || voices.find((v) => v.lang.startsWith("en"));
        if (preferred) utterance.voice = preferred;

        utterance.onend = () => {
            speakStep(index + 1);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            setActiveStep(-1);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [voiceSupported]);

    const startVoice = useCallback(() => {
        if (!data || !voiceSupported) return;

        window.speechSynthesis.cancel();

        // Build the full script: intro → form tips → mistakes
        const steps: string[] = [];
        steps.push(`${data.name}. Here are the form tips for this exercise.`);
        data.formTips.forEach((tip, i) => {
            steps.push(`Step ${i + 1}. ${tip}`);
        });
        if (data.commonMistakes.length > 0) {
            steps.push("Now, here are common mistakes to avoid.");
            data.commonMistakes.forEach((m) => {
                steps.push(`Avoid: ${m}`);
            });
        }
        steps.push("That's all. Good luck with your workout!");

        stepsQueueRef.current = steps;
        currentIndexRef.current = 0;
        setIsSpeaking(true);
        setIsPaused(false);
        speakStep(0);
    }, [data, voiceSupported, speakStep]);

    const pauseVoice = useCallback(() => {
        if (!voiceSupported) return;
        window.speechSynthesis.pause();
        setIsPaused(true);
    }, [voiceSupported]);

    const resumeVoice = useCallback(() => {
        if (!voiceSupported) return;
        window.speechSynthesis.resume();
        setIsPaused(false);
    }, [voiceSupported]);

    const stopVoice = useCallback(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveStep(-1);
    }, []);

    const skipStep = useCallback(() => {
        if (!voiceSupported) return;
        window.speechSynthesis.cancel();
        speakStep(currentIndexRef.current + 1);
    }, [voiceSupported, speakStep]);

    const fetchExercise = async (name: string) => {
        if (!name.trim()) return;
        setLoading(true);
        setError("");
        setData(null);
        setSearch(name);

        try {
            const res = await fetch("/api/ai/exercise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ exercise: name }),
            });
            const result = await res.json();
            if (result.error) {
                setError(result.error);
            } else {
                setData(result);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Determine which form tip index is active (offset by 1 because step 0 is the intro)
    const activeFormTipIndex = activeStep >= 1 && activeStep <= (data?.formTips.length ?? 0)
        ? activeStep - 1
        : -1;

    return (
        <section id="exercise-guide" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Dumbbell className="h-4 w-4" />
                        Form Guide
                    </div>
                    <h2 className="text-4xl font-bold text-white">Exercise Guide</h2>
                    <p className="mt-3 text-slate-400">Search any exercise to get AI-powered form tips, muscle targeting info, and <span className="text-forge-orange font-medium">voice guidance</span>.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><Dumbbell className="h-5 w-5 text-forge-orange" />Exercise Lookup</CardTitle>
                            <CardDescription className="text-slate-400">Search or click a popular exercise below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); fetchExercise(search); }} className="flex gap-3">
                                <Input
                                    placeholder="Search any exercise..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                />
                                <Button type="submit" disabled={loading} className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                </Button>
                            </form>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {popularExercises.map((ex) => (
                                    <button
                                        key={ex}
                                        onClick={() => fetchExercise(ex)}
                                        className="rounded-full border border-forge-border bg-slate-900/30 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-forge-orange/30 hover:text-forge-orange"
                                    >
                                        {ex}
                                    </button>
                                ))}
                            </div>

                            {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

                            {loading && (
                                <div className="mt-8 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-forge-orange" />
                                </div>
                            )}

                            {data && !loading && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-xl font-bold text-white">{data.name}</h3>
                                            <Badge variant="outline" className="border-forge-orange/30 text-forge-orange text-xs">{data.difficulty}</Badge>
                                        </div>

                                        {/* Voice Guidance Controls */}
                                        {voiceSupported && (
                                            <div className="flex items-center gap-2">
                                                {!isSpeaking ? (
                                                    <Button
                                                        onClick={startVoice}
                                                        size="sm"
                                                        className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 text-xs gap-1.5 transition-all"
                                                    >
                                                        <Volume2 className="h-3.5 w-3.5" />
                                                        Voice Guide
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            onClick={isPaused ? resumeVoice : pauseVoice}
                                                            size="icon"
                                                            className="h-8 w-8 bg-slate-800/50 border border-forge-border text-slate-300 hover:text-white hover:bg-slate-700/50"
                                                        >
                                                            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                                                        </Button>
                                                        <Button
                                                            onClick={skipStep}
                                                            size="icon"
                                                            className="h-8 w-8 bg-slate-800/50 border border-forge-border text-slate-300 hover:text-white hover:bg-slate-700/50"
                                                        >
                                                            <SkipForward className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            onClick={stopVoice}
                                                            size="icon"
                                                            className="h-8 w-8 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                                        >
                                                            <VolumeOff className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <span className="text-xs text-slate-500 hidden sm:inline animate-pulse">
                                                            {isPaused ? "Paused" : "🔊 Speaking..."}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Muscles */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-forge-orange-light mb-2">Target Muscles</p>
                                        <div className="flex flex-wrap gap-2">
                                            {data.muscles.map((m, i) => (
                                                <Badge key={i} variant="outline" className={`text-xs ${i === 0 ? "border-emerald-500/30 text-emerald-400" : "border-slate-600 text-slate-400"}`}>{m}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Form Tips — with active step highlighting */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-forge-orange-light mb-2 flex items-center gap-1"><Star className="h-3 w-3" />Form Tips</p>
                                        <div className="space-y-2">
                                            {data.formTips.map((tip, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-300 ${activeFormTipIndex === i
                                                        ? "bg-forge-orange/10 border-forge-orange/40 text-white shadow-lg shadow-forge-orange/5"
                                                        : "bg-slate-900/30 border-forge-border text-slate-300"
                                                        }`}
                                                >
                                                    <span className={`font-bold shrink-0 ${activeFormTipIndex === i ? "text-forge-orange" : "text-forge-orange"}`}>{i + 1}.</span>
                                                    {tip}
                                                    {activeFormTipIndex === i && (
                                                        <Volume2 className="h-4 w-4 text-forge-orange shrink-0 ml-auto animate-pulse" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Common Mistakes */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Common Mistakes</p>
                                        <div className="space-y-2">
                                            {data.commonMistakes.map((m, i) => {
                                                const mistakeStartIndex = 1 + (data?.formTips.length ?? 0) + 1; // intro + tips + "mistakes" intro
                                                const isActiveMistake = activeStep === mistakeStartIndex + i;
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`flex gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-300 ${isActiveMistake
                                                            ? "bg-red-500/10 border-red-500/30 text-white shadow-lg shadow-red-500/5"
                                                            : "bg-red-500/5 border-red-500/10 text-slate-300"
                                                            }`}
                                                    >
                                                        <span className="text-red-400 shrink-0">✗</span>
                                                        {m}
                                                        {isActiveMistake && (
                                                            <Volume2 className="h-4 w-4 text-red-400 shrink-0 ml-auto animate-pulse" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Variations */}
                                    {data.variations.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Variations</p>
                                            <div className="flex flex-wrap gap-2">
                                                {data.variations.map((v, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => fetchExercise(v)}
                                                        className="rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
