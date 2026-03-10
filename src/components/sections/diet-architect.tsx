"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Utensils, Layers, ShieldCheck, Sparkles, RefreshCw, ChevronDown, ChevronUp, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AIMealIngredient {
    foodId: string;
    foodName: string;
    quantity: string;
    weightGrams: number;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    source: string;
}

interface AIMeal {
    meal_name: string;
    dish: string;
    ingredients: AIMealIngredient[];
    recipe: string;
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
    const [swappingIndex, setSwappingIndex] = useState<number | null>(null);
    const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set());

    const toggleExpand = (idx: number) => {
        setExpandedMeals(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const handleGenerate = async () => {
        const cals = parseInt(targetCalories);
        const pro = parseInt(targetProtein);
        const meals = parseInt(numMeals);

        if (cals > 0 && pro > 0 && meals > 0) {
            setLoading(true);
            try {
                const res = await fetch("/api/ai/diet", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        target_calories: cals,
                        target_protein: pro,
                        num_meals: meals,
                        preferences: preferences || "No specific preferences"
                    })
                });
                const responseData = await res.json();

                if (responseData.success && responseData.data.meals) {
                    // Calculate actual totals from the resolved meals
                    const actualMeals = responseData.data.meals;
                    const actualTotalP = actualMeals.reduce((s: number, m: any) => s + m.protein, 0);
                    const actualTotalC = actualMeals.reduce((s: number, m: any) => s + m.carbs, 0);
                    const actualTotalF = actualMeals.reduce((s: number, m: any) => s + m.fat, 0);
                    const actualTotalCal = actualMeals.reduce((s: number, m: any) => s + m.calories, 0);

                    setPlan({
                        targetCalories: actualTotalCal,
                        targetProtein: parseFloat(actualTotalP.toFixed(1)),
                        targetCarbs: parseFloat(actualTotalC.toFixed(1)),
                        targetFat: parseFloat(actualTotalF.toFixed(1)),
                        meals: actualMeals
                    });
                    // Expand all meals by default
                    setExpandedMeals(new Set(actualMeals.map((_: any, i: number) => i)));
                }
            } catch (error) {
                console.error("Failed to generate diet:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSwap = async (mIdx: number, mealToReplace: AIMeal) => {
        if (!plan) return;
        setSwappingIndex(mIdx);

        try {
            const res = await fetch("/api/ai/diet/swap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetProtein: mealToReplace.protein,
                    targetCarbs: mealToReplace.carbs,
                    targetFat: mealToReplace.fat,
                    avoidDish: mealToReplace.dish,
                    mealName: mealToReplace.meal_name
                })
            });
            const responseData = await res.json();

            if (responseData.success && responseData.meal) {
                const newMeals = [...plan.meals];
                newMeals[mIdx] = responseData.meal;

                // Recalculate total
                const actualTotalP = newMeals.reduce((s, m) => s + m.protein, 0);
                const actualTotalC = newMeals.reduce((s, m) => s + m.carbs, 0);
                const actualTotalF = newMeals.reduce((s, m) => s + m.fat, 0);
                const actualTotalCal = newMeals.reduce((s, m) => s + m.calories, 0);

                setPlan({
                    ...plan,
                    targetCalories: actualTotalCal,
                    targetProtein: parseFloat(actualTotalP.toFixed(1)),
                    targetCarbs: parseFloat(actualTotalC.toFixed(1)),
                    targetFat: parseFloat(actualTotalF.toFixed(1)),
                    meals: newMeals,
                });
                // Expand the swapped meal
                setExpandedMeals(prev => new Set(prev).add(mIdx));
            }
        } catch (error) {
            console.error("Failed to swap meal:", error);
        } finally {
            setSwappingIndex(null);
        }
    };

    return (
        <section id="diet" className="relative py-24 px-4">
            <div className="mx-auto max-w-5xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-orange/10 text-forge-orange text-sm font-medium mb-4 border border-forge-orange/20">
                        <ShieldCheck className="h-4 w-4" />
                        USDA-Verified Macro Precision
                    </div>
                    <h2 className="text-4xl font-bold text-white">Diet Architect</h2>
                    <p className="mt-3 text-slate-400">AI creates realistic dishes from our verified food database. Every macro is calculated from real USDA data — not AI estimates.</p>
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
                                    Set your targets. AI picks foods from our USDA database.
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

                    {/* Generated Plan */}
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
                                    <div className="rounded-2xl bg-slate-900/80 border border-forge-orange/30 shadow-lg shadow-forge-orange/10 overflow-hidden">
                                        <div className="grid grid-cols-4 gap-4 p-4">
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
                                        <div className="px-4 pb-3 flex items-center justify-center gap-2 border-t border-white/5 pt-3">
                                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                            <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">All values calculated from USDA FoodData Central</span>
                                        </div>
                                    </div>

                                    {/* Meals */}
                                    <div className="space-y-4">
                                        {plan.meals.map((meal, mIdx) => (
                                            <div key={mIdx} className="glass-card rounded-2xl border border-forge-border overflow-hidden">
                                                {/* Meal Header */}
                                                <div className="bg-slate-900/50 px-5 py-4 border-b border-forge-border flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="font-bold text-white text-lg">{meal.meal_name}</h3>
                                                            {swappingIndex === mIdx && (
                                                                <span className="flex items-center text-xs text-forge-orange font-medium animate-pulse">
                                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Swapping...
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-medium text-forge-orange mt-0.5">{meal.dish}</p>
                                                    </div>
                                                    <div className="flex gap-2 items-center flex-wrap shrink-0">
                                                        <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-md border border-emerald-400/20 shadow-sm">
                                                            {meal.calories} kcal | {meal.protein}g P, {meal.carbs}g C, {meal.fat}g F
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={swappingIndex !== null}
                                                            onClick={() => handleSwap(mIdx, meal)}
                                                            className="h-8 shrink-0 text-slate-400 hover:text-white hover:bg-white/10 text-xs border border-transparent hover:border-white/10"
                                                        >
                                                            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${swappingIndex === mIdx ? 'animate-spin' : ''}`} /> Swap
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Meal Body */}
                                                <div className="p-5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            <Scale className="h-3 w-3" /> Ingredients with Verified Macros
                                                        </h4>
                                                        <button
                                                            onClick={() => toggleExpand(mIdx)}
                                                            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                                                        >
                                                            {expandedMeals.has(mIdx) ? (
                                                                <><ChevronUp className="h-3 w-3" /> Collapse</>
                                                            ) : (
                                                                <><ChevronDown className="h-3 w-3" /> Details</>
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className="bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden">
                                                        {/* Ingredient rows */}
                                                        {meal.ingredients && meal.ingredients.length > 0 ? (
                                                            <div className="divide-y divide-white/5">
                                                                {meal.ingredients.map((ing: AIMealIngredient, iIdx: number) => (
                                                                    <div key={iIdx} className="px-4 py-3">
                                                                        <div className="flex justify-between items-start">
                                                                            <div className="flex gap-3 items-start flex-1 min-w-0">
                                                                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                                                <div className="min-w-0">
                                                                                    <span className="text-sm text-slate-200 font-medium">{ing.foodName}</span>
                                                                                    <span className="text-xs text-slate-500 ml-2">({ing.quantity} • {ing.weightGrams}g)</span>
                                                                                </div>
                                                                            </div>
                                                                            {expandedMeals.has(mIdx) && (
                                                                                <div className="flex gap-3 text-[11px] font-mono text-slate-500 shrink-0 ml-2">
                                                                                    <span className="text-blue-400/70">{ing.protein}p</span>
                                                                                    <span className="text-emerald-400/70">{ing.carbs}c</span>
                                                                                    <span className="text-amber-400/70">{ing.fat}f</span>
                                                                                    <span className="text-slate-400">{ing.calories}cal</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 text-sm text-slate-500 italic">No ingredients data</div>
                                                        )}

                                                        {/* Recipe */}
                                                        {meal.recipe && (
                                                            <div className="p-4 bg-slate-900/20 border-t border-white/5">
                                                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Instructions</h4>
                                                                <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-slate-700 pl-3">
                                                                    {meal.recipe}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Source badge per meal */}
                                                        <div className="px-4 py-2 bg-slate-900/30 border-t border-white/5 flex items-center gap-1.5">
                                                            <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                                            <span className="text-[10px] text-emerald-500/80 font-medium tracking-wider uppercase">
                                                                Macros from USDA FoodData Central — {meal.ingredients?.length || 0} verified ingredients
                                                            </span>
                                                        </div>
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
