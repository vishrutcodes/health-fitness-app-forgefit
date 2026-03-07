"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp, Dumbbell, Pill, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const guides = [
    { title: "Bulking Guide", desc: "Lean mass gain strategies", icon: TrendingUp, color: "text-emerald-400" },
    { title: "Fat Loss Guide", desc: "Sustainable cutting methods", icon: Award, color: "text-red-400" },
    { title: "Muscle Building", desc: "Hypertrophy fundamentals", icon: Dumbbell, color: "text-blue-400" },
    { title: "Supplementation", desc: "Evidence-based supplements", icon: Pill, color: "text-purple-400" },
    { title: "Best Exercises", desc: "Top compound movements", icon: Dumbbell, color: "text-yellow-400" },
];

export function KnowledgeBase() {
    return (
        <section id="knowledge" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <BookOpen className="h-4 w-4" />
                        Learn & Grow
                    </div>
                    <h2 className="text-4xl font-bold text-white">Fitness Guides</h2>
                    <p className="mt-3 text-slate-400">Expert-curated guides to level up your training knowledge.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {guides.map((guide, i) => (
                            <motion.div key={guide.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="glass-card border-forge-border hover:border-forge-orange/30 transition-all cursor-pointer group h-full">
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900/50 ${guide.color} group-hover:scale-110 transition-transform`}>
                                            <guide.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white group-hover:text-forge-orange transition-colors">{guide.title}</h3>
                                            <p className="mt-1 text-sm text-slate-400">{guide.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 px-8 py-6 text-base">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Ask AI Coach
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
