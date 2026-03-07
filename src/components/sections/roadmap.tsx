"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Target, Clock, Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RoadmapSection() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [timeframe, setTimeframe] = useState("");
    const [equipment, setEquipment] = useState("");
    const [generated, setGenerated] = useState(false);

    return (
        <section id="roadmap" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Map className="h-4 w-4" />
                        Personal Roadmap
                    </div>
                    <h2 className="text-4xl font-bold text-white">Career Roadmap</h2>
                    <p className="mt-3 text-slate-400">Get a structured fitness transformation plan from your starting point to your goal.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Target className="h-5 w-5 text-forge-orange" />
                                Your Journey
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Define your starting point, end goal, and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Current Starting Point</Label>
                                    <Input
                                        placeholder="e.g. Beginner, 80kg, 25% body fat"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">End Goal</Label>
                                    <Input
                                        placeholder="e.g. Lean physique, 70kg, 12% body fat"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Timeframe</Label>
                                    <Select value={timeframe} onValueChange={(v) => setTimeframe(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange">
                                            <SelectValue placeholder="Select timeframe" />
                                        </SelectTrigger>
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
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange">
                                            <SelectValue placeholder="Select equipment" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            <SelectItem value="commercial" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Commercial Gym</SelectItem>
                                            <SelectItem value="home" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Home Gym</SelectItem>
                                            <SelectItem value="bodyweight" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Bodyweight Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="sm:col-span-2">
                                    <Button
                                        onClick={() => setGenerated(true)}
                                        className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 py-6 text-base"
                                    >
                                        <Map className="mr-2 h-5 w-5" />
                                        Generate Roadmap
                                    </Button>
                                </div>
                            </div>

                            {generated && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 space-y-4"
                                >
                                    {[
                                        { phase: "Phase 1", title: "Foundation Building", weeks: "Weeks 1-4", icon: Dumbbell, desc: "Build base strength and establish training habits" },
                                        { phase: "Phase 2", title: "Progressive Overload", weeks: "Weeks 5-8", icon: Target, desc: "Increase intensity and volume progressively" },
                                        { phase: "Phase 3", title: "Peak Optimization", weeks: "Weeks 9-12", icon: Clock, desc: "Fine-tune nutrition and maximize results" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 rounded-xl bg-slate-900/50 border border-forge-border p-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forge-orange/10 text-forge-orange">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold uppercase text-forge-orange-light">{item.phase}</span>
                                                    <span className="text-xs text-slate-500">• {item.weeks}</span>
                                                </div>
                                                <p className="text-sm font-semibold text-white mt-0.5">{item.title}</p>
                                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
