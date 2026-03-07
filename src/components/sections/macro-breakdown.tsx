"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Plus, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FoodItem {
    id: string;
    name: string;
    amount: string;
}

export function MacroBreakdown() {
    const [foods, setFoods] = useState<FoodItem[]>([
        { id: "1", name: "", amount: "" },
    ]);
    const [analyzed, setAnalyzed] = useState(false);

    const addFood = () => {
        setFoods([...foods, { id: Date.now().toString(), name: "", amount: "" }]);
    };

    const removeFood = (id: string) => {
        if (foods.length > 1) {
            setFoods(foods.filter((f) => f.id !== id));
        }
    };

    const updateFood = (id: string, field: "name" | "amount", value: string) => {
        setFoods(foods.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
    };

    return (
        <section id="macros" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <PieChart className="h-4 w-4" />
                        AI-Powered Analysis
                    </div>
                    <h2 className="text-4xl font-bold text-white">Macro Breakdown</h2>
                    <p className="mt-3 text-slate-400">List your foods and let AI analyze the macros for you.</p>
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
                                <PieChart className="h-5 w-5 text-forge-orange" />
                                Food List
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Add your foods and portions, then analyze the macros
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {foods.map((food, index) => (
                                    <motion.div
                                        key={food.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forge-orange/10 text-xs font-bold text-forge-orange">
                                            {index + 1}
                                        </span>
                                        <Input
                                            placeholder="Food item (e.g. Chicken breast)"
                                            value={food.name}
                                            onChange={(e) => updateFood(food.id, "name", e.target.value)}
                                            className="flex-1 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                        />
                                        <Input
                                            placeholder="Amount (e.g. 200g)"
                                            value={food.amount}
                                            onChange={(e) => updateFood(food.id, "amount", e.target.value)}
                                            className="w-32 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFood(food.id)}
                                            className="shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                                            disabled={foods.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    variant="outline"
                                    onClick={addFood}
                                    className="border-forge-border text-slate-300 hover:bg-white/5 hover:text-white flex-1"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Another Food
                                </Button>
                                <Button
                                    onClick={() => setAnalyzed(true)}
                                    className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 flex-1"
                                >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Analyze Macros
                                </Button>
                            </div>

                            {analyzed && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 grid gap-4 sm:grid-cols-4"
                                >
                                    {[
                                        { label: "Calories", value: "~2,100", color: "text-forge-orange" },
                                        { label: "Protein", value: "~165g", color: "text-emerald-400" },
                                        { label: "Carbs", value: "~230g", color: "text-blue-400" },
                                        { label: "Fat", value: "~65g", color: "text-yellow-400" },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-xl bg-slate-900/50 border border-forge-border p-4 text-center">
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{item.label}</p>
                                            <p className={`mt-1 text-2xl font-bold ${item.color}`}>{item.value}</p>
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
