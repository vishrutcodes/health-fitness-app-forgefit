"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const activityLevels = [
    { value: "1.2", label: "Sedentary (little or no exercise)" },
    { value: "1.375", label: "Lightly Active (1-3 days/week)" },
    { value: "1.55", label: "Moderately Active (3-5 days/week)" },
    { value: "1.725", label: "Very Active (6-7 days/week)" },
    { value: "1.9", label: "Extra Active (very hard exercise)" },
];

interface CalculatorResult {
    bmr: number;
    tdee: number;
    protein: number;
    carbs: number;
    fat: number;
}

export function CalculatorSection() {
    const [gender, setGender] = useState("male");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [activity, setActivity] = useState("");
    const [result, setResult] = useState<CalculatorResult | null>(null);

    const calculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseFloat(age);
        const act = parseFloat(activity);
        if (!w || !h || !a || !act) return;

        const bmr = gender === "male"
            ? 10 * w + 6.25 * h - 5 * a + 5
            : 10 * w + 6.25 * h - 5 * a - 161;

        const tdee = bmr * act;
        const protein = w * 2.2;
        const fat = (tdee * 0.25) / 9;
        const carbs = (tdee - protein * 4 - fat * 9) / 4;

        setResult({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat),
        });
    };

    return (
        <section id="calculator" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Calculator className="h-4 w-4" />
                        BMR & TDEE Calculator
                    </div>
                    <h2 className="text-4xl font-bold text-white">Know Your Numbers</h2>
                    <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                        Calculate your BMR, TDEE, and optimal macros using the Mifflin-St Jeor equation.
                    </p>
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
                                <Activity className="h-5 w-5 text-forge-orange" />
                                Body Metrics
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Enter your details to calculate your daily caloric needs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Gender */}
                                <div className="space-y-3 sm:col-span-2">
                                    <Label className="text-slate-300">Gender</Label>
                                    <RadioGroup
                                        value={gender}
                                        onValueChange={setGender}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" className="border-forge-orange text-forge-orange" />
                                            <Label htmlFor="male" className="text-slate-300 cursor-pointer">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" className="border-forge-orange text-forge-orange" />
                                            <Label htmlFor="female" className="text-slate-300 cursor-pointer">Female</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Age */}
                                <div className="space-y-2">
                                    <Label htmlFor="age" className="text-slate-300">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="e.g. 25"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange focus:ring-forge-orange/20"
                                    />
                                </div>

                                {/* Weight */}
                                <div className="space-y-2">
                                    <Label htmlFor="weight" className="text-slate-300">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        placeholder="e.g. 75"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange focus:ring-forge-orange/20"
                                    />
                                </div>

                                {/* Height */}
                                <div className="space-y-2">
                                    <Label htmlFor="height" className="text-slate-300">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        placeholder="e.g. 178"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange focus:ring-forge-orange/20"
                                    />
                                </div>

                                {/* Activity Level */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Activity Level</Label>
                                    <Select value={activity} onValueChange={(v) => setActivity(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange focus:ring-forge-orange/20">
                                            <SelectValue placeholder="Select activity level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            {activityLevels.map((level) => (
                                                <SelectItem key={level.value} value={level.value} className="text-slate-300 hover:text-white focus:bg-forge-orange/10 focus:text-white">
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="sm:col-span-2">
                                    <Button
                                        onClick={calculate}
                                        className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 py-6 text-base"
                                    >
                                        <Calculator className="mr-2 h-5 w-5" />
                                        Calculate
                                    </Button>
                                </div>
                            </div>

                            {/* Results */}
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
                                >
                                    {[
                                        { label: "BMR", value: `${result.bmr}`, unit: "kcal" },
                                        { label: "TDEE", value: `${result.tdee}`, unit: "kcal" },
                                        { label: "Protein", value: `${result.protein}`, unit: "g" },
                                        { label: "Carbs", value: `${result.carbs}`, unit: "g" },
                                        { label: "Fat", value: `${result.fat}`, unit: "g" },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-xl bg-slate-900/50 border border-forge-border p-4 text-center">
                                            <p className="text-xs font-medium uppercase tracking-wider text-forge-orange-light">{item.label}</p>
                                            <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
                                            <p className="text-xs text-slate-500">{item.unit}</p>
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
