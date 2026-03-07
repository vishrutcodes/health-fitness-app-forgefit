"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Target, Loader2, Dumbbell, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoadmapPhase {
    phase: string;
    title: string;
    weeks: string;
    focus: string;
    workouts: string[];
    nutrition: string;
    targets: { weeklyWorkouts: number; calorieAdjustment: string };
}

interface RoadmapData {
    title: string;
    phases: RoadmapPhase[];
    milestones: string[];
    tips: string[];
}

export function RoadmapSection() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [timeframe, setTimeframe] = useState("");
    const [equipment, setEquipment] = useState("");
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generate = async () => {
        if (!start || !end || !timeframe || !equipment) return;
        setLoading(true);
        setError("");
        setRoadmap(null);

        try {
            const res = await fetch("/api/ai/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ start, end, timeframe, equipment }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setRoadmap(data);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const phaseColors = ["from-forge-orange/20 to-forge-orange/5", "from-blue-500/20 to-blue-500/5", "from-emerald-500/20 to-emerald-500/5", "from-purple-500/20 to-purple-500/5"];
    const phaseTextColors = ["text-forge-orange", "text-blue-400", "text-emerald-400", "text-purple-400"];

    return (
        <section id="roadmap" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Map className="h-4 w-4" />
                        Personal Roadmap
                    </div>
                    <h2 className="text-4xl font-bold text-white">Fitness Roadmap</h2>
                    <p className="mt-3 text-slate-400">Get an AI-powered structured fitness transformation plan from your starting point to your goal.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><Target className="h-5 w-5 text-forge-orange" />Your Journey</CardTitle>
                            <CardDescription className="text-slate-400">Define your starting point, end goal, and preferences</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Current Starting Point</Label>
                                    <Input placeholder="e.g. Beginner, 80kg, 25% body fat" value={start} onChange={(e) => setStart(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">End Goal</Label>
                                    <Input placeholder="e.g. Lean physique, 70kg, 12% body fat" value={end} onChange={(e) => setEnd(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Timeframe</Label>
                                    <Select value={timeframe} onValueChange={(v) => setTimeframe(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange"><SelectValue placeholder="Select timeframe" /></SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            <SelectItem value="3" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">3 Months</SelectItem>
                                            <SelectItem value="6" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">6 Months</SelectItem>
                                            <SelectItem value="12" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">12 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Equipment</Label>
                                    <Select value={equipment} onValueChange={(v) => setEquipment(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange"><SelectValue placeholder="Select equipment" /></SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            <SelectItem value="commercial" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Commercial Gym</SelectItem>
                                            <SelectItem value="home" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Home Gym</SelectItem>
                                            <SelectItem value="bodyweight" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Bodyweight Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="sm:col-span-2">
                                    <Button onClick={generate} disabled={loading} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 py-6 text-base">
                                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Map className="mr-2 h-5 w-5" />}
                                        {loading ? "Generating..." : "Generate Roadmap"}
                                    </Button>
                                </div>
                            </div>

                            {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

                            {roadmap && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-5">
                                    <h3 className="text-lg font-bold text-white">{roadmap.title}</h3>

                                    {/* Phases */}
                                    {roadmap.phases.map((phase, i) => (
                                        <div key={i} className={`rounded-xl bg-gradient-to-r ${phaseColors[i % phaseColors.length]} border border-forge-border p-5`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900/50 ${phaseTextColors[i % phaseTextColors.length]}`}>
                                                    <Dumbbell className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-bold uppercase ${phaseTextColors[i % phaseTextColors.length]}`}>{phase.phase}</span>
                                                        <span className="text-xs text-slate-500">• {phase.weeks}</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-white">{phase.title}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-300 mb-3">{phase.focus}</p>
                                            <div className="space-y-1.5">
                                                {phase.workouts.map((w, j) => (
                                                    <p key={j} className="text-xs text-slate-400 flex gap-2"><span className="text-forge-orange">▸</span>{w}</p>
                                                ))}
                                            </div>
                                            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                                                <span>📅 {phase.targets.weeklyWorkouts}x/week</span>
                                                <span>🔥 {phase.targets.calorieAdjustment}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Milestones */}
                                    {roadmap.milestones.length > 0 && (
                                        <div className="rounded-xl bg-forge-orange/5 border border-forge-orange/10 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-forge-orange mb-2 flex items-center gap-1"><Trophy className="h-3 w-3" />Milestones</p>
                                            {roadmap.milestones.map((m, i) => (
                                                <p key={i} className="text-sm text-slate-300 mt-1">🏆 {m}</p>
                                            ))}
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
