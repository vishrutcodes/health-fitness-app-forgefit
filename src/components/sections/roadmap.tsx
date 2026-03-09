"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Target, Loader2, Dumbbell, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DailyProtocol {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    waterLiters: number;
    stepsGoal: number;
    sleepHours: number;
}

interface Phase {
    phaseName: string;
    durationWeeks: string;
    primaryFocus: string;
    trainingSplit: string;
    keyMovements: string[];
    cardioProtocol: string;
}

interface AdvancedRoadmap {
    overview: string;
    dailyProtocol: DailyProtocol;
    supplementStack: string[];
    phases: Phase[];
}

export function RoadmapSection() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [personalDetails, setPersonalDetails] = useState("");
    const [timeframe, setTimeframe] = useState("");
    const [equipment, setEquipment] = useState("");
    const [roadmap, setRoadmap] = useState<AdvancedRoadmap | null>(null);
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
                body: JSON.stringify({ start, end, personalDetails, timeframe, equipment }),
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

    const phaseColors = [
        "from-forge-orange/20 to-forge-orange/5",
        "from-blue-500/20 to-blue-500/5",
        "from-emerald-500/20 to-emerald-500/5",
        "from-purple-500/20 to-purple-500/5"
    ];
    const phaseBorders = [
        "border-forge-orange/30",
        "border-blue-500/30",
        "border-emerald-500/30",
        "border-purple-500/30"
    ];
    const phaseTextColors = [
        "text-forge-orange",
        "text-blue-400",
        "text-emerald-400",
        "text-purple-400"
    ];

    return (
        <section id="roadmap" className="relative py-24 px-4">
            <div className="mx-auto max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm font-semibold text-forge-orange-light">
                        <Trophy className="h-4 w-4" />
                        Elite Coaching Protocol
                    </div>
                    <h2 className="text-4xl font-bold text-white">Advanced Master Plan</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl mx-auto">Skip the generic advice. Get a ruthless, highly-specific protocol covering your exact macros, training split, and supplement stack.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="glass-card border-forge-border mb-8">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><Target className="h-5 w-5 text-forge-orange" />Athlete Dossier</CardTitle>
                            <CardDescription className="text-slate-400">Define your current state and ultimate objective.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2 space-y-2">
                                    <Label className="text-slate-300">Biometrics & Demographics (Crucial for Precision)</Label>
                                    <Input placeholder="Enter your height, weight, age, gender, current activity level for better results" value={personalDetails} onChange={(e) => setPersonalDetails(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Detailed Starting Point</Label>
                                    <Input placeholder="e.g. Can bench 60kg, can run 1 mile, sedentary job" value={start} onChange={(e) => setStart(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Exact End Goal</Label>
                                    <Input placeholder="e.g. 75kg, 12% bf, visible abs, pull-ups" value={end} onChange={(e) => setEnd(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Timeframe</Label>
                                    <Select value={timeframe} onValueChange={(v) => setTimeframe(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange"><SelectValue placeholder="Select timeframe" /></SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            <SelectItem value="3" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">3 Months (Aggressive)</SelectItem>
                                            <SelectItem value="6" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">6 Months (Moderate)</SelectItem>
                                            <SelectItem value="12" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">12 Months (Sustainable)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Training Facility</Label>
                                    <Select value={equipment} onValueChange={(v) => setEquipment(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange"><SelectValue placeholder="Select equipment" /></SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            <SelectItem value="commercial" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Full Commercial Gym</SelectItem>
                                            <SelectItem value="home" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Home Gym (Dumbbells/Bench)</SelectItem>
                                            <SelectItem value="bodyweight" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Calisthenics/Bodyweight Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="sm:col-span-2">
                                    <Button onClick={generate} disabled={loading} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 py-6 text-base">
                                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Map className="mr-2 h-5 w-5" />}
                                        {loading ? "Programming Protocol..." : "Generate Coaching Protocol"}
                                    </Button>
                                </div>
                            </div>

                            {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}
                        </CardContent>
                    </Card>

                    {roadmap && (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">

                            {/* Overview Box */}
                            <div className="bg-slate-900/80 border-l-4 border-forge-orange p-6 rounded-r-xl shadow-lg">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-forge-orange" /> Coach's Assessment
                                </h3>
                                <p className="text-slate-300 leading-relaxed italic">"{roadmap.overview}"</p>
                            </div>

                            {/* Daily Non-Negotiables Dashboard */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Daily Non-Negotiables</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-slate-900/60 border border-forge-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                        <span className="text-xs font-bold text-forge-orange uppercase tracking-wider mb-2">Nutrition</span>
                                        <span className="text-3xl font-black text-white">{roadmap.dailyProtocol.calories}</span>
                                        <span className="text-xs text-slate-500 mt-1">kcal / day</span>
                                        <div className="flex gap-2 mt-3 text-xs font-mono">
                                            <span className="text-blue-400">{roadmap.dailyProtocol.proteinGrams}P</span>
                                            <span className="text-emerald-400">{roadmap.dailyProtocol.carbsGrams}C</span>
                                            <span className="text-amber-400">{roadmap.dailyProtocol.fatGrams}F</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/60 border border-forge-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Hydration</span>
                                        <span className="text-3xl font-black text-white">{roadmap.dailyProtocol.waterLiters}</span>
                                        <span className="text-xs text-slate-500 mt-1">Liters / day</span>
                                    </div>

                                    <div className="bg-slate-900/60 border border-forge-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Activity</span>
                                        <span className="text-3xl font-black text-white">{(roadmap.dailyProtocol.stepsGoal / 1000).toFixed(1)}k</span>
                                        <span className="text-xs text-slate-500 mt-1">Steps / day</span>
                                    </div>

                                    <div className="bg-slate-900/60 border border-forge-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Recovery</span>
                                        <span className="text-3xl font-black text-white">{roadmap.dailyProtocol.sleepHours}+</span>
                                        <span className="text-xs text-slate-500 mt-1">Hours Sleep</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Supplement Stack */}
                                <div className="md:col-span-1">
                                    <h3 className="text-xl font-bold text-white mb-4">Supplement Stack</h3>
                                    <div className="bg-slate-900/60 border border-forge-border rounded-xl p-5 space-y-4 h-full">
                                        {roadmap.supplementStack.map((supp, i) => (
                                            <div key={i} className="flex gap-3 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                <div className="mt-0.5 h-2 w-2 rounded-full bg-forge-orange shrink-0"></div>
                                                <p className="text-sm text-slate-300">{supp}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Training Phases Timeline */}
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-bold text-white mb-4">Training Architecture</h3>
                                    <div className="space-y-4">
                                        {roadmap.phases.map((phase, i) => (
                                            <div key={i} className={`rounded-xl bg-linear-to-r ${phaseColors[i % phaseColors.length]} border ${phaseBorders[i % phaseBorders.length]} p-6 relative overflow-hidden`}>

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Dumbbell className={`h-4 w-4 ${phaseTextColors[i % phaseTextColors.length]}`} />
                                                            <h4 className={`text-lg font-bold ${phaseTextColors[i % phaseTextColors.length]}`}>{phase.phaseName}</h4>
                                                        </div>
                                                        <p className="text-sm font-semibold text-white">{phase.primaryFocus}</p>
                                                    </div>
                                                    <div className="bg-black/40 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 w-fit shrink-0">
                                                        {phase.durationWeeks}
                                                    </div>
                                                </div>

                                                <div className="grid sm:grid-cols-2 gap-4 mt-4 bg-slate-900/40 p-4 rounded-lg border border-white/5">
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Protocol</span>
                                                        <p className="text-sm text-white font-medium">{phase.trainingSplit}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Cardio</span>
                                                        <p className="text-sm text-white font-medium">{phase.cardioProtocol}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-5">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Key Movements</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {phase.keyMovements.map((move, min) => (
                                                            <span key={min} className="px-2.5 py-1 text-xs font-medium bg-white/10 text-slate-200 rounded-md border border-white/5">
                                                                {move}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
