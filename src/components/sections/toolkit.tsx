"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Scale, Dumbbell, Percent, Droplets, Moon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function BMICalculator() {
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [bmi, setBmi] = useState<string | null>(null);
    const [category, setCategory] = useState("");

    const calculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100;
        if (!w || !h) return;
        const result = w / (h * h);
        setBmi(result.toFixed(1));
        if (result < 18.5) setCategory("Underweight");
        else if (result < 25) setCategory("Normal");
        else if (result < 30) setCategory("Overweight");
        else setCategory("Obese");
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className="text-slate-300">Weight (kg)</Label>
                    <Input type="number" placeholder="e.g. 75" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Height (cm)</Label>
                    <Input type="number" placeholder="e.g. 178" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                Calculate BMI
            </Button>
            {bmi && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-slate-900/50 border border-forge-border p-4 text-center">
                    <p className="text-3xl font-bold text-white">{bmi}</p>
                    <p className={`text-sm font-medium mt-1 ${category === "Normal" ? "text-emerald-400" : category === "Underweight" ? "text-yellow-400" : "text-red-400"}`}>{category}</p>
                </motion.div>
            )}
        </div>
    );
}

function OneRMCalculator() {
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [oneRM, setOneRM] = useState<string | null>(null);

    const calculate = () => {
        const w = parseFloat(weight);
        const r = parseFloat(reps);
        if (!w || !r) return;
        const result = w * (1 + r / 30); // Epley formula
        setOneRM(result.toFixed(1));
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className="text-slate-300">Weight Lifted (kg)</Label>
                    <Input type="number" placeholder="e.g. 100" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Reps Performed</Label>
                    <Input type="number" placeholder="e.g. 5" value={reps} onChange={(e) => setReps(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                Calculate 1RM
            </Button>
            {oneRM && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-slate-900/50 border border-forge-border p-4 text-center">
                    <p className="text-xs text-forge-orange-light uppercase tracking-wider">Estimated 1RM</p>
                    <p className="text-3xl font-bold text-white mt-1">{oneRM} kg</p>
                </motion.div>
            )}
        </div>
    );
}

function BodyFatCalculator() {
    const [gender, setGender] = useState("male");
    const [waist, setWaist] = useState("");
    const [neck, setNeck] = useState("");
    const [height, setHeight] = useState("");
    const [bodyFat, setBodyFat] = useState<string | null>(null);

    const calculate = () => {
        const w = parseFloat(waist);
        const n = parseFloat(neck);
        const h = parseFloat(height);
        if (!w || !n || !h) return;
        const result = gender === "male"
            ? 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450
            : 495 / (1.29579 - 0.35004 * Math.log10(w + 0 - n) + 0.22100 * Math.log10(h)) - 450;
        setBodyFat(Math.max(0, result).toFixed(1));
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                    <Label className="text-slate-300">Gender</Label>
                    <Select value={gender} onValueChange={(v) => setGender(v ?? "male")}>
                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-forge-card border-forge-border">
                            <SelectItem value="male" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Male</SelectItem>
                            <SelectItem value="female" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Waist (cm)</Label>
                    <Input type="number" placeholder="e.g. 85" value={waist} onChange={(e) => setWaist(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Neck (cm)</Label>
                    <Input type="number" placeholder="e.g. 38" value={neck} onChange={(e) => setNeck(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label className="text-slate-300">Height (cm)</Label>
                    <Input type="number" placeholder="e.g. 178" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                Calculate Body Fat
            </Button>
            {bodyFat && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-slate-900/50 border border-forge-border p-4 text-center">
                    <p className="text-xs text-forge-orange-light uppercase tracking-wider">Estimated Body Fat</p>
                    <p className="text-3xl font-bold text-white mt-1">{bodyFat}%</p>
                </motion.div>
            )}
        </div>
    );
}

function WaterCalculator() {
    const [weight, setWeight] = useState("");
    const [activity, setActivity] = useState("moderate");
    const [water, setWater] = useState<string | null>(null);

    const calculate = () => {
        const w = parseFloat(weight);
        if (!w) return;
        const multiplier = activity === "low" ? 0.033 : activity === "moderate" ? 0.04 : 0.045;
        setWater((w * multiplier).toFixed(1));
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className="text-slate-300">Weight (kg)</Label>
                    <Input type="number" placeholder="e.g. 75" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Activity Level</Label>
                    <Select value={activity} onValueChange={(v) => setActivity(v ?? "moderate")}>
                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-forge-card border-forge-border">
                            <SelectItem value="low" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Low Activity</SelectItem>
                            <SelectItem value="moderate" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Moderate Activity</SelectItem>
                            <SelectItem value="high" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">High Activity</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button onClick={calculate} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                Calculate Water Intake
            </Button>
            {water && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-slate-900/50 border border-forge-border p-4 text-center">
                    <p className="text-xs text-forge-orange-light uppercase tracking-wider">Daily Water Intake</p>
                    <p className="text-3xl font-bold text-white mt-1">{water} L</p>
                </motion.div>
            )}
        </div>
    );
}

function SleepCalculator() {
    const [wakeUp, setWakeUp] = useState("");
    const [cycles, setCycles] = useState<string[]>([]);

    const calculate = () => {
        if (!wakeUp) return;
        const [hours, minutes] = wakeUp.split(":").map(Number);
        const results: string[] = [];
        for (let i = 6; i >= 4; i--) {
            const totalMinutes = hours * 60 + minutes - i * 90 - 14;
            const h = ((totalMinutes % 1440) + 1440) % 1440;
            const hStr = Math.floor(h / 60).toString().padStart(2, "0");
            const mStr = (h % 60).toString().padStart(2, "0");
            results.push(`${hStr}:${mStr}`);
        }
        setCycles(results);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-slate-300">Wake-up Time</Label>
                <Input type="time" value={wakeUp} onChange={(e) => setWakeUp(e.target.value)} className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange" />
            </div>
            <Button onClick={calculate} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                Calculate Sleep Times
            </Button>
            {cycles.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    {cycles.map((time, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl bg-slate-900/50 border border-forge-border px-4 py-3">
                            <span className="text-sm text-slate-400">{6 - i} sleep cycles ({((6 - i) * 1.5).toFixed(1)}h)</span>
                            <span className="text-lg font-bold text-white">{time}</span>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

const tabs = [
    { value: "bmi", label: "BMI", icon: Scale, component: BMICalculator },
    { value: "1rm", label: "1RM", icon: Dumbbell, component: OneRMCalculator },
    { value: "bodyfat", label: "Body Fat", icon: Percent, component: BodyFatCalculator },
    { value: "water", label: "Water", icon: Droplets, component: WaterCalculator },
    { value: "sleep", label: "Sleep", icon: Moon, component: SleepCalculator },
];

export function ToolkitSection() {
    return (
        <section id="toolkit" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Wrench className="h-4 w-4" />
                        Essential Tools
                    </div>
                    <h2 className="text-4xl font-bold text-white">Fitness Toolkit</h2>
                    <p className="mt-3 text-slate-400">Five essential calculators in one place.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white">Quick Calculators</CardTitle>
                            <CardDescription className="text-slate-400">Select a calculator to get started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="bmi" className="w-full">
                                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 border border-forge-border">
                                    {tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className="data-[state=active]:bg-forge-orange data-[state=active]:text-white text-slate-400 text-xs sm:text-sm gap-1.5"
                                        >
                                            <tab.icon className="h-4 w-4 hidden sm:block" />
                                            {tab.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                {tabs.map((tab) => (
                                    <TabsContent key={tab.value} value={tab.value} className="mt-6">
                                        <tab.component />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
