"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Dumbbell, AlertTriangle, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const popularExercises = ["Squat", "Bench Press", "Deadlift", "Pull Up", "Overhead Press", "Barbell Row", "Lunge", "Dips"];

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

    return (
        <section id="exercise-guide" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Dumbbell className="h-4 w-4" />
                        Form Guide
                    </div>
                    <h2 className="text-4xl font-bold text-white">Exercise Guide</h2>
                    <p className="mt-3 text-slate-400">Search any exercise to get AI-powered form tips and muscle targeting info.</p>
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
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-xl font-bold text-white">{data.name}</h3>
                                        <Badge variant="outline" className="border-forge-orange/30 text-forge-orange text-xs">{data.difficulty}</Badge>
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

                                    {/* Form Tips */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-forge-orange-light mb-2 flex items-center gap-1"><Star className="h-3 w-3" />Form Tips</p>
                                        <div className="space-y-2">
                                            {data.formTips.map((tip, i) => (
                                                <div key={i} className="flex gap-2 rounded-lg bg-slate-900/30 border border-forge-border px-3 py-2 text-sm text-slate-300">
                                                    <span className="text-forge-orange font-bold shrink-0">{i + 1}.</span>
                                                    {tip}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Common Mistakes */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Common Mistakes</p>
                                        <div className="space-y-2">
                                            {data.commonMistakes.map((m, i) => (
                                                <div key={i} className="flex gap-2 rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2 text-sm text-slate-300">
                                                    <span className="text-red-400 shrink-0">✗</span>
                                                    {m}
                                                </div>
                                            ))}
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
