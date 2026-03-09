"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Utensils, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AIMeal {
    meal_name: string;
    dish: string;
    ingredients: string[];
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
}

interface AIDietPlan {
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    meals: AIMeal[];
}

export function DietArchitect() {
    const [targetCalories, setTargetCalories] = useState("2500");
    const [targetProtein, setTargetProtein] = useState("180");
    const [numMeals, setNumMeals] = useState("4");
    const [preferences, setPreferences] = useState("");

    const [plan, setPlan] = useState<AIDietPlan | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        const cals = parseInt(targetCalories);
        const pro = parseInt(targetProtein);
        const meals = parseInt(numMeals);

        if (cals > 0 && pro > 0 && meals > 0) {
            setLoading(true);
            try {
                // Calculate implicit targets to show in the UI header
                const proteinCal = pro * 4;
                const remainingCal = cals - proteinCal;
                const fatCal = cals * 0.25;
                const fat = Math.round(fatCal / 9);
                const carbs = Math.round((remainingCal - fatCal) / 4);

                const res = await fetch("/api/ai/diet", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        target_calories: cals,
                        target_protein: pro,
                        target_carbs: carbs,
                        target_fat: fat,
                        num_meals: meals,
                        preferences: preferences || "No specific preferences"
                    })
                });
                const responseData = await res.json();

                if (responseData.success && responseData.data.meals) {
                    setPlan({
                        targetCalories: cals,
                        targetProtein: pro,
                        targetCarbs: carbs,
                        targetFat: fat,
                        meals: responseData.data.meals
                    });
                }
            } catch (error) {
                console.error("Failed to generate diet:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section id="diet" className="relative py-24 px-4">
            <div className="mx-auto max-w-5xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-orange/10 text-forge-orange text-sm font-medium mb-4 border border-forge-orange/20">
                        <ShieldCheck className="h-4 w-4" />
                        AI-Powered Macro Precision
                    </div>
                    <h2 className="text-4xl font-bold text-white">Diet Architect</h2>
                    <p className="mt-3 text-slate-400">Generative AI creates mathematically sound, realistic dishes tailored to your exact targets.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Controls Sidebar */}
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                        <Card className="glass-card border-forge-border sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-forge-orange" />
                                    Target Architecture
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Set your strict targets. We will mathematically align your meals.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Target Calories (kcal)</Label>
                                    <Input
                                        type="number"
                                        value={targetCalories}
                                        onChange={(e) => setTargetCalories(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Target Protein (g)</Label>
                                    <Input
                                        type="number"
                                        value={targetProtein}
                                        onChange={(e) => setTargetProtein(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Number of Meals</Label>
                                    <Input
                                        type="number"
                                        min="1" max="8"
                                        value={numMeals}
                                        onChange={(e) => setNumMeals(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Preferences / Allergies</Label>
                                    <Input
                                        placeholder="e.g. 'Vegan, high volume' or 'No nuts'"
                                        value={preferences}
                                        onChange={(e) => setPreferences(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange"
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-bold h-12 text-lg shadow-lg shadow-forge-orange/20 mt-4"
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Compiling AI Plan...</>
                                    ) : (
                                        <><Sparkles className="mr-2 h-5 w-5" /> Generate Diet Plan</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Generated Plan Execution */}
                    <div className="md:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {!plan ? (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center p-12 glass-card rounded-2xl border border-forge-border">
                                    <Utensils className="h-16 w-16 text-slate-600 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-300">No Blueprint Active</h3>
                                    <p className="text-slate-500 mt-2">Enter your constraints and compile your AI-generated meal plan.</p>
                                </motion.div>
                            ) : (
                                <motion.div key="plan" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                    {/* Summary Banner */}
                                    <div className="grid grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-forge-orange/30 shadow-lg shadow-forge-orange/10">
                                        <div className="text-center border-r border-white/10 last:border-0">
                                            <p className="text-xs font-bold text-forge-orange uppercase tracking-wider mb-1">Calories</p>
                                            <p className="text-2xl font-black text-white">{plan.targetCalories}</p>
                                        </div>
                                        <div className="text-center border-r border-white/10">
                                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Protein</p>
                                            <p className="text-2xl font-black text-white">{plan.targetProtein}g</p>
                                        </div>
                                        <div className="text-center border-r border-white/10">
                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Carbs</p>
                                            <p className="text-2xl font-black text-white">{plan.targetCarbs}g</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Fat</p>
                                            <p className="text-2xl font-black text-white">{plan.targetFat}g</p>
                                        </div>
                                    </div>

                                    {/* Meals Array */}
                                    <div className="space-y-4">
                                        {plan.meals.map((meal, mIdx) => (
                                            <div key={mIdx} className="glass-card rounded-2xl border border-forge-border overflow-hidden">
                                                <div className="bg-slate-900/50 px-5 py-4 border-b border-forge-border flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{meal.meal_name}</h3>
                                                        <p className="text-sm font-medium text-forge-orange mt-0.5">{meal.dish}</p>
                                                    </div>
                                                    <div className="flex gap-2 items-center shrink-0">
                                                        <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-md border border-emerald-400/20 shadow-sm">
                                                            {meal.calories} kcal | {meal.protein}g P, {meal.carbs}g C, {meal.fat}g F
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <Utensils className="h-3 w-3" /> Ingredients
                                                    </h4>
                                                    <div className="bg-slate-900/40 rounded-xl p-4 border border-white/5 line-clamp-none">
                                                        <ul className="space-y-2">
                                                            {meal.ingredients.map((ing, iIdx) => (
                                                                <li key={iIdx} className="flex gap-3 items-start text-sm text-slate-300">
                                                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-500 shrink-0"></div>
                                                                    <span>{ing}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
