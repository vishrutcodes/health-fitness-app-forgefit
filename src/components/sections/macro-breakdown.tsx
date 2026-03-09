"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Plus, Trash2, Loader2 } from "lucide-react";
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
    fiber?: number;
    breakdown?: { food: string; calories: number; protein: number; carbs: number; fat: number }[];
}

export function MacroBreakdown() {
    const [foods, setFoods] = useState<FoodItem[]>([{ name: "", quantity: "1", amount: "" }]);
    const [result, setResult] = useState<MacroResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const addFood = () => setFoods([...foods, { name: "", quantity: "1", amount: "" }]);
    const removeFood = (i: number) => setFoods(foods.filter((_, idx) => idx !== i));
    const updateFood = (i: number, field: keyof FoodItem, value: string) => {
        const updated = [...foods];
        updated[i][field] = value;
        setFoods(updated);
    };

    const analyze = async () => {
        const validFoods = foods.filter(f => f.name.trim() && f.amount.trim());
        if (validFoods.length === 0) return;

        // Concatenate quantity and name before sending to API 
        // Example: { name: "boiled eggs", quantity: "6" } becomes { name: "6 boiled eggs", amount: "50g" }
        const payloadFoods = validFoods.map(f => ({
            name: `${f.quantity.trim() || "1"} ${f.name.trim()}`.trim(),
            amount: f.amount.trim()
        }));

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch("/api/ai/macros", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foods: payloadFoods }),
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
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Scan className="h-4 w-4" />
                        AI-Powered Analysis
                    </div>
                    <h2 className="text-4xl font-bold text-white">Macro Breakdown</h2>
                    <p className="mt-3 text-slate-400">List your foods and let AI analyze the macros for you.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Scan className="h-5 w-5 text-forge-orange" />
                                Food Analyzer
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Add foods with approximate amounts and get an AI-powered macro breakdown
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
                                            <Label className="text-slate-300 text-xs text-left w-full block text-nowrap truncate">Qty (Items)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="e.g. 6"
                                                value={food.quantity}
                                                onChange={(e) => updateFood(i, "quantity", e.target.value)}
                                                className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                            />
                                        </div>
                                        <div className="w-[100px] sm:w-[120px] shrink-0 space-y-1">
                                            <Label className="text-slate-300 text-xs text-left w-full block text-nowrap truncate">Grams per item</Label>
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
                                    {loading ? "Analyzing..." : "Analyze Macros"}
                                </Button>
                            </div>

                            {error && (
                                <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
                            )}

                            {result && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                                    <div className="grid gap-3 sm:grid-cols-4">
                                        {[
                                            { label: "Calories", value: `${result.calories}`, unit: "kcal", color: "text-forge-orange" },
                                            { label: "Protein", value: `${result.protein}`, unit: "g", color: "text-blue-400" },
                                            { label: "Carbs", value: `${result.carbs}`, unit: "g", color: "text-emerald-400" },
                                            { label: "Fat", value: `${result.fat}`, unit: "g", color: "text-yellow-400" },
                                        ].map((item) => (
                                            <div key={item.label} className="rounded-xl bg-slate-900/50 border border-forge-border p-4 text-center">
                                                <p className={`text-xs font-medium uppercase tracking-wider ${item.color}`}>{item.label}</p>
                                                <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
                                                <p className="text-xs text-slate-500">{item.unit}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {result.breakdown && result.breakdown.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs font-semibold uppercase text-forge-orange-light tracking-wider">Per-food breakdown</p>
                                            {result.breakdown.map((item, i) => (
                                                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-slate-900/30 border border-forge-border px-4 py-2.5 text-sm gap-2">
                                                    <span className="text-white font-medium">{item.food}</span>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                                        <span>{item.calories} kcal</span>
                                                        <span className="text-blue-400">{item.protein}g P</span>
                                                        <span className="text-emerald-400">{item.carbs}g C</span>
                                                        <span className="text-yellow-400">{item.fat}g F</span>
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
