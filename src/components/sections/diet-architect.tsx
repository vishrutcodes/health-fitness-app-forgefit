"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ChefHat, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface MealPlan {
    planName: string;
    summary: string;
    meals: { name: string; time: string; foods: { item: string; amount: string; calories: number; protein: number }[]; totalCalories: number; totalProtein: number }[];
    dailyTotals: { calories: number; protein: number; carbs: number; fat: number };
    tips: string[];
}

export function DietArchitect() {
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [goal, setGoal] = useState("");
    const [meals, setMeals] = useState([3]);
    const [restrictions, setRestrictions] = useState("");
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!calories || !protein || !goal) return;
        setLoading(true);
        setError("");
        setPlan(null);

        try {
            const res = await fetch("/api/ai/diet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ calories, protein, goal, meals: meals[0], restrictions }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setPlan(data);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="diet" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <UtensilsCrossed className="h-4 w-4" />
                        Nutrition Planning
                    </div>
                    <h2 className="text-4xl font-bold text-white">Diet Architect</h2>
                    <p className="mt-3 text-slate-400">Design your perfect AI-generated meal plan based on your goals and preferences.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><ChefHat className="h-5 w-5 text-forge-orange" />Meal Plan Builder</CardTitle>
                            <CardDescription className="text-slate-400">Configure your nutrition targets and generate a personalized meal plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Daily Calories</Label>
                                    <Input type="number" placeholder="e.g. 2500" value={calories} onChange={(e) => setCalories(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Protein Target (g)</Label>
                                    <Input type="number" placeholder="e.g. 180" value={protein} onChange={(e) => setProtein(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Goal</Label>
                                    <Select value={goal} onValueChange={(v) => setGoal(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange">
                                            <SelectValue placeholder="Select your goal" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            <SelectItem value="cut" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Fat Loss (Cut)</SelectItem>
                                            <SelectItem value="bulk" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Muscle Gain (Bulk)</SelectItem>
                                            <SelectItem value="maintain" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Meals per Day: {meals[0]}</Label>
                                    <Slider value={meals} onValueChange={(v) => setMeals(Array.isArray(v) ? [...v] : [v])} min={2} max={6} step={1} className="py-2" />
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-slate-300">Restrictions / Preferences</Label>
                                    <Textarea placeholder="e.g. No dairy, vegetarian, gluten-free..." value={restrictions} onChange={(e) => setRestrictions(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange min-h-[80px]" />
                                </div>
                                <div className="sm:col-span-2">
                                    <Button onClick={handleGenerate} disabled={loading} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 py-6 text-base">
                                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ChefHat className="mr-2 h-5 w-5" />}
                                        {loading ? "Generating..." : "Generate Meal Plan"}
                                    </Button>
                                </div>
                            </div>

                            {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

                            {plan && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
                                    <div className="rounded-xl bg-slate-900/50 border border-forge-border p-4">
                                        <h3 className="text-lg font-bold text-white">{plan.planName}</h3>
                                        <p className="mt-1 text-sm text-slate-400">{plan.summary}</p>
                                    </div>

                                    {/* Daily Totals */}
                                    <div className="grid gap-3 sm:grid-cols-4">
                                        {[
                                            { label: "Calories", value: plan.dailyTotals.calories, unit: "kcal", color: "text-forge-orange" },
                                            { label: "Protein", value: plan.dailyTotals.protein, unit: "g", color: "text-blue-400" },
                                            { label: "Carbs", value: plan.dailyTotals.carbs, unit: "g", color: "text-emerald-400" },
                                            { label: "Fat", value: plan.dailyTotals.fat, unit: "g", color: "text-yellow-400" },
                                        ].map((item) => (
                                            <div key={item.label} className="rounded-xl bg-slate-900/50 border border-forge-border p-3 text-center">
                                                <p className={`text-xs font-medium uppercase tracking-wider ${item.color}`}>{item.label}</p>
                                                <p className="mt-1 text-xl font-bold text-white">{item.value}</p>
                                                <p className="text-xs text-slate-500">{item.unit}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Meals */}
                                    {plan.meals.map((meal, i) => (
                                        <div key={i} className="rounded-xl bg-slate-900/30 border border-forge-border p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">{meal.name}</h4>
                                                    <p className="text-xs text-slate-500">{meal.time}</p>
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    <span className="text-forge-orange font-semibold">{meal.totalCalories}</span> kcal · <span className="text-blue-400 font-semibold">{meal.totalProtein}g</span> protein
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                {meal.foods.map((food, j) => (
                                                    <div key={j} className="flex justify-between text-sm text-slate-300">
                                                        <span>{food.item} <span className="text-slate-500">({food.amount})</span></span>
                                                        <span className="text-xs text-slate-500">{food.calories} kcal</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Tips */}
                                    {plan.tips && plan.tips.length > 0 && (
                                        <div className="rounded-xl bg-forge-orange/5 border border-forge-orange/10 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-forge-orange mb-2">💡 Tips</p>
                                            {plan.tips.map((tip, i) => (
                                                <p key={i} className="text-sm text-slate-300 mt-1">• {tip}</p>
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
