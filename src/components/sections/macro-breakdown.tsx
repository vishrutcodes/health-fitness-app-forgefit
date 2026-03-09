"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FoodItem {
    name: string;
    quantity: string;
    amount: string;
}

interface MacroResult {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    breakdown?: { foodName: string; source: string; calories: number; protein: number; carbs: number; fat: number }[];
}

export function MacroBreakdown() {
    const [foods, setFoods] = useState<FoodItem[]>([{ name: "", quantity: "", amount: "" }]);
    const [result, setResult] = useState<MacroResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const addFood = () => setFoods([...foods, { name: "", quantity: "", amount: "" }]);
    const removeFood = (i: number) => setFoods(foods.filter((_, idx) => idx !== i));
    const updateFood = (i: number, field: keyof FoodItem, value: string) => {
        const updated = [...foods];
        updated[i][field] = value;
        setFoods(updated);
    };

    const analyze = async () => {
        const validFoods = foods.filter(f => f.name.trim() && f.amount.trim());
        if (validFoods.length === 0) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch("/api/nutrition/macros", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foods: validFoods }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="macros" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-orange/10 text-forge-orange text-sm font-medium mb-4 border border-forge-orange/20">
                        <ShieldCheck className="h-4 w-4" />
                        100% Deterministic Precision Math
                    </div>
                    <h2 className="text-4xl font-bold text-white">Precision Macro Breakdown</h2>
                    <p className="mt-3 text-slate-400">Calculated strictly against rigid USDA and Lab-Verified nutritional constants. Zero AI calculation error.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Scan className="h-5 w-5 text-forge-orange" />
                                    Food Analyzer
                                </span>
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Enter your distinct portions. Quantities are perfectly multiplied against standard DB constants.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {foods.map((food, i) => (
                                    <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 items-end">
                                        <div className="flex-1 min-w-[140px] space-y-1">
                                            <Label className="text-slate-300 text-xs text-left w-full block">Food Name</Label>
                                            <Input
                                                placeholder="e.g. Boiled egg"
                                                value={food.name}
                                                onChange={(e) => updateFood(i, "name", e.target.value)}
                                                className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                            />
                                        </div>
                                        <div className="w-[80px] sm:w-[100px] shrink-0 space-y-1">
                                            <Label className="text-slate-300 text-xs text-left w-full block text-nowrap truncate">Qty (Optional)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="e.g. 6"
                                                value={food.quantity}
                                                onChange={(e) => updateFood(i, "quantity", e.target.value)}
                                                className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                            />
                                        </div>
                                        <div className="w-[100px] sm:w-[124px] shrink-0 space-y-1">
                                            <Label className="text-slate-300 text-xs text-left w-full block text-nowrap truncate">Amount / Weight</Label>
                                            <Input
                                                placeholder="e.g. 50g"
                                                value={food.amount}
                                                onChange={(e) => updateFood(i, "amount", e.target.value)}
                                                className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                            />
                                        </div>
                                        {foods.length > 1 && (
                                            <Button variant="ghost" size="icon" onClick={() => removeFood(i)} className="shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-400/10 self-end mt-2 sm:mt-0">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Button variant="outline" onClick={addFood} className="border-forge-border text-slate-300 hover:bg-white/5 flex-1 h-11 sm:h-10 text-sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Another Food
                                </Button>
                                <Button
                                    onClick={analyze}
                                    disabled={loading}
                                    className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 flex-1 h-11 sm:h-10 text-sm sm:text-base"
                                >
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Scan className="mr-2 h-5 w-5" />}
                                    {loading ? "Calculating..." : "Analyze Macros"}
                                </Button>
                            </div>

                            {error && (
                                <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
                            )}

                            {result && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-slate-900/80 rounded-2xl p-4 border border-forge-border text-center">
                                            <p className="text-xs font-bold text-forge-orange tracking-widest uppercase mb-1">Calories</p>
                                            <p className="text-3xl font-black text-white">{result.calories}</p>
                                            <p className="text-xs text-slate-500 mt-1">kcal</p>
                                        </div>
                                        <div className="bg-slate-900/80 rounded-2xl p-4 border border-forge-border text-center">
                                            <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-1">Protein</p>
                                            <p className="text-3xl font-black text-white">{result.protein}</p>
                                            <p className="text-xs text-slate-500 mt-1">g</p>
                                        </div>
                                        <div className="bg-slate-900/80 rounded-2xl p-4 border border-forge-border text-center">
                                            <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-1">Carbs</p>
                                            <p className="text-3xl font-black text-white">{result.carbs}</p>
                                            <p className="text-xs text-slate-500 mt-1">g</p>
                                        </div>
                                        <div className="bg-slate-900/80 rounded-2xl p-4 border border-forge-border text-center">
                                            <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-1">Fat</p>
                                            <p className="text-3xl font-black text-white">{result.fat}</p>
                                            <p className="text-xs text-slate-500 mt-1">g</p>
                                        </div>
                                    </div>

                                    {result.breakdown && result.breakdown.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-forge-orange tracking-widest uppercase mb-4">Precision Breakdown</h4>
                                            {result.breakdown.map((item, idx) => (
                                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                                    <div>
                                                        <span className="text-white font-medium">{item.foodName}</span>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <ShieldCheck className="h-3 w-3 text-emerald-400" />
                                                            <span className="text-xs text-emerald-400">Verified by {item.source}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm mt-3 sm:mt-0">
                                                        <span className="text-slate-400">{item.calories} kcal</span>
                                                        <span className="text-blue-400 font-medium">{item.protein}g P</span>
                                                        <span className="text-emerald-400 font-medium">{item.carbs}g C</span>
                                                        <span className="text-amber-400 font-medium">{item.fat}g F</span>
                                                    </div>
                                                </div>
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
