"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ChefHat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

export function DietArchitect() {
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [goal, setGoal] = useState("");
    const [meals, setMeals] = useState([3]);
    const [restrictions, setRestrictions] = useState("");
    const [generated, setGenerated] = useState(false);

    const handleGenerate = () => {
        if (calories && protein && goal) {
            setGenerated(true);
        }
    };

    return (
        <section id="diet" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <UtensilsCrossed className="h-4 w-4" />
                        Nutrition Planning
                    </div>
                    <h2 className="text-4xl font-bold text-white">Diet Architect</h2>
                    <p className="mt-3 text-slate-400">Design your perfect meal plan based on your goals and preferences.</p>
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
                                <ChefHat className="h-5 w-5 text-forge-orange" />
                                Meal Plan Builder
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Configure your nutrition targets and generate a personalized meal plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Daily Calories</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 2500"
                                        value={calories}
                                        onChange={(e) => setCalories(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Protein Target (g)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 180"
                                        value={protein}
                                        onChange={(e) => setProtein(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                                    />
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
                                    <Slider
                                        value={meals}
                                        onValueChange={(v) => setMeals(Array.isArray(v) ? [...v] : [v])}
                                        min={2}
                                        max={6}
                                        step={1}
                                        className="py-2"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-slate-300">Restrictions / Preferences</Label>
                                    <Textarea
                                        placeholder="e.g. No dairy, vegetarian, gluten-free..."
                                        value={restrictions}
                                        onChange={(e) => setRestrictions(e.target.value)}
                                        className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange min-h-[80px]"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Button
                                        onClick={handleGenerate}
                                        className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 py-6 text-base"
                                    >
                                        <ChefHat className="mr-2 h-5 w-5" />
                                        Generate Meal Plan
                                    </Button>
                                </div>
                            </div>

                            {generated && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 rounded-xl bg-slate-900/50 border border-forge-border p-6"
                                >
                                    <p className="text-center text-slate-400">
                                        🍽️ Your personalized meal plan with <span className="text-white font-semibold">{calories} kcal</span> and <span className="text-white font-semibold">{protein}g protein</span> across <span className="text-white font-semibold">{meals[0]} meals</span> would be generated by the AI Coach. Click &quot;Talk to AI Coach&quot; to get started!
                                    </p>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
