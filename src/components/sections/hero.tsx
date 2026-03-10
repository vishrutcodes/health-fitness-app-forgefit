"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, BarChart3, Users, ArrowRight, Sparkles } from "lucide-react";

const stats = [
    { icon: Zap, value: "10,000+", label: "Workouts Generated" },
    { icon: BarChart3, value: "5,000+", label: "Macro Plans Built" },
    { icon: Users, value: "2,500+", label: "Active Users" },
];

export function HeroSection() {
    return (
        <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
            {/* Radial glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-forge-orange/5 blur-[120px]" />

            <div className="mx-auto max-w-5xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Sparkles className="h-4 w-4" />
                        AI-Powered Fitness Platform
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                >
                    <span className="text-gradient-forge glow-text">Forge Your</span>
                    <br />
                    <span className="text-white">Dream Physique</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
                >
                    Stop guessing. Start evolving. Get personalized workout plans, diet strategies, and real-time guidance — powered by advanced AI.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Button
                        size="lg"
                        className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold text-base px-8 py-6 shadow-xl shadow-forge-orange/25 hover:shadow-forge-orange/50 transition-all glow-orange border-0"
                        onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Start Forging
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-forge-orange/30 text-forge-orange-light hover:bg-forge-orange/10 hover:text-forge-orange text-base px-8 py-6 transition-all"
                        onClick={() => document.getElementById('ai-coach-trigger')?.click()}
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Talk to AI Coach
                    </Button>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-orange/10 text-forge-orange">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                            <span className="text-sm text-slate-400">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
