"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, RefreshCw, Layers, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateDietArchitecture, swapDietFood, DietPlan, DIET_OPTIONS } from "@/lib/diet-algorithm";
import { LOCAL_NUTRITION_DB } from "@/lib/nutrition-db";

export function DietArchitect() {
    const [targetCalories, setTargetCalories] = useState("2500");
    const [targetProtein, setTargetProtein] = useState("180");
    const [numMeals, setNumMeals] = useState("4");

    const [plan, setPlan] = useState<DietPlan | null>(null);

    const handleGenerate = () => {
        const cals = parseInt(targetCalories);
        const pro = parseInt(targetProtein);
        const meals = parseInt(numMeals);
        if (cals > 0 && pro > 0 && meals > 0) {
            setPlan(generateDietArchitecture(cals, pro, meals));
        }
    };

    const handleSwap = (mealIndex: number, foodIndex: number, currentMacroType: 'protein' | 'carbs' | 'fat') => {
        if (!plan) return;

        // Pick next random food of same exact macro category
        const options = DIET_OPTIONS[currentMacroType];
        const currentFoodId = plan.meals[mealIndex].foods[foodIndex].foodId;

        let newFoodId = options[Math.floor(Math.random() * options.length)];
        while (newFoodId === currentFoodId && options.length > 1) {
            newFoodId = options[Math.floor(Math.random() * options.length)];
        }

        const newFood = swapDietFood(plan.meals[mealIndex], foodIndex, newFoodId);

        const newPlan = { ...plan };
        newPlan.meals[mealIndex].foods[foodIndex] = newFood;
        setPlan(newPlan);
    };

    return (
        <section id="diet" className="relative py-24 px-4">
            <div className="mx-auto max-w-5xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-orange/10 text-forge-orange text-sm font-medium mb-4 border border-forge-orange/20">
                        <ShieldCheck className="h-4 w-4" />
                        0% Math Deviation Verified
                    </div>
                    <h2 className="text-4xl font-bold text-white">Diet Architect</h2>
                    <p className="mt-3 text-slate-400">Deterministic linear programming guarantees exactly 100% macro compliance.</p>
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
                                <Button
                                    onClick={handleGenerate}
                                    className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-bold h-12 text-lg shadow-lg shadow-forge-orange/20 mt-4"
                                >
                                    <Utensils className="mr-2 h-5 w-5" /> Compile Diet Plan
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
                                    <p className="text-slate-500 mt-2">Enter your constraints and compile your plan to generate a mathematically perfect diet structure.</p>
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
                                            <div key={meal.id} className="glass-card rounded-2xl border border-forge-border overflow-hidden">
                                                <div className="bg-slate-900/50 px-5 py-3 border-b border-forge-border flex justify-between items-center">
                                                    <h3 className="font-bold text-white text-lg">Meal {meal.id}</h3>
                                                    <span className="text-xs font-mono text-slate-400 bg-black/50 px-2 py-1 rounded-md">
                                                        {meal.targetCalories} kcal | {meal.targetProtein}P {meal.targetCarbs}C {meal.targetFat}F
                                                    </span>
                                                </div>
                                                <div className="p-2 space-y-2">
                                                    {meal.foods.map((food, fIdx) => (
                                                        <div key={fIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors gap-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-white font-medium">{food.name}</span>
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-forge-orange/20 text-forge-orange font-mono">
                                                                        {food.weightGrams}g
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-1 text-xs font-mono">
                                                                    <span className="text-blue-400">{food.protein}P</span>
                                                                    <span className="text-emerald-400">{food.carbs}C</span>
                                                                    <span className="text-amber-400">{food.fat}F</span>
                                                                    <span className="text-slate-500">• {food.calories}kcal</span>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleSwap(mIdx, fIdx, food.primaryMacro)}
                                                                className="shrink-0 text-slate-400 hover:text-white hover:bg-white/10 text-xs"
                                                            >
                                                                <RefreshCw className="mr-1 h-3 w-3" /> Swap Match
                                                            </Button>
                                                        </div>
                                                    ))}
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
