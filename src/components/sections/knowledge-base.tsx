"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp, Dumbbell, Pill, Award, ChevronDown, Heart, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const guides = [
    {
        title: "Bulking Guide",
        desc: "Lean mass gain strategies",
        icon: TrendingUp,
        color: "text-emerald-400",
        content: [
            "🎯 Caloric Surplus: Aim for 300–500 calories above your TDEE for lean gains. Larger surpluses lead to more fat accumulation without extra muscle benefit.",
            "🥩 Protein Intake: Consume 1.6–2.2g of protein per kg of bodyweight daily. Spread intake across 4–5 meals for optimal muscle protein synthesis.",
            "🍚 Carb Loading: Prioritize complex carbs (oats, rice, sweet potatoes) around workouts. Carbs fuel intense training and replenish glycogen stores.",
            "⏱️ Progressive Overload: Increase weight, reps, or sets each week. This is the #1 driver of hypertrophy — without it, your body has no reason to grow.",
            "😴 Sleep 7–9 Hours: Growth hormone peaks during deep sleep. Poor sleep reduces testosterone by up to 15% and impairs recovery.",
            "📅 Bulk Duration: Plan 12–16 week bulk phases. Short bulks don't allow enough time for meaningful muscle growth.",
        ]
    },
    {
        title: "Fat Loss Guide",
        desc: "Sustainable cutting methods",
        icon: Award,
        color: "text-red-400",
        content: [
            "📉 Caloric Deficit: Target 400–600 calories below TDEE. Aggressive deficits (1000+ cal) cause muscle loss, metabolic adaptation, and binge eating.",
            "🥗 High Protein is Non-Negotiable: Keep protein at 2.0–2.4g/kg during cuts. This preserves lean mass while in a deficit — the single most important nutritional strategy.",
            "🏋️ Maintain Training Intensity: Keep lifting heavy. Reducing weight signals your body that muscle is no longer needed. Volume can drop 30% but intensity should stay.",
            "🚶 NEAT Matters More Than Cardio: Non-exercise activity thermogenesis (walking, fidgeting, standing) accounts for 15–30% of daily burn. Aim for 8,000–12,000 steps/day.",
            "📊 Track Everything: Use a food scale for 2 weeks to calibrate your portion awareness. Most people underestimate intake by 30–50%.",
            "🔄 Diet Breaks: Every 8–12 weeks, eat at maintenance for 1–2 weeks. This reverses metabolic adaptation and improves long-term adherence.",
        ]
    },
    {
        title: "Muscle Building",
        desc: "Hypertrophy fundamentals",
        icon: Dumbbell,
        color: "text-blue-400",
        content: [
            "📐 Rep Range: 6–12 reps per set is optimal for hypertrophy. Use 3–5 sets per exercise, targeting 10–20 sets per muscle group per week.",
            "⏳ Time Under Tension: Control the eccentric (lowering) phase for 2–3 seconds. Muscles grow from tension, not momentum.",
            "🔗 Mind-Muscle Connection: Consciously squeeze the target muscle through the full range of motion. Studies show this increases muscle activation by up to 20%.",
            "📋 Exercise Selection: Prioritize compound movements (squat, bench, row, press) for mass, then isolations (curls, flies, extensions) for detail work.",
            "🔄 Training Split: For intermediates, PPL (Push/Pull/Legs) 6 days or Upper/Lower 4 days provides optimal frequency — hitting each muscle 2x per week.",
            "⚡ Mechanical Tension: The primary driver of muscle growth. Lift challenging weights through full ROM — it beats pump-chasing and drop sets every time.",
        ]
    },
    {
        title: "Supplementation",
        desc: "Evidence-based supplements",
        icon: Pill,
        color: "text-purple-400",
        content: [
            "💪 Creatine Monohydrate: The most researched supplement in history. 3–5g daily increases strength, power, and lean mass. No loading phase needed.",
            "🥤 Whey Protein: Convenient way to hit protein targets. 25–40g post-workout. Not magic — whole food protein is equally effective if you can eat enough.",
            "☕ Caffeine: 3–6mg/kg body weight 30 min pre-workout improves strength, endurance, and focus. Cycle off for 1–2 weeks every 8 weeks to maintain sensitivity.",
            "🐟 Omega-3 Fish Oil: 2–3g EPA+DHA daily reduces inflammation, supports joint health, and may improve muscle protein synthesis. Crucial if you don't eat fatty fish 2x/week.",
            "☀️ Vitamin D3: 2000–5000 IU daily if you're deficient (most people are). Low vitamin D is linked to reduced testosterone, poor recovery, and weaker bones.",
            "⚠️ Skip These: Fat burners, BCAAs (redundant if you eat enough protein), testosterone boosters, and most pre-workout blends are overpriced placebos.",
        ]
    },
    {
        title: "Best Exercises",
        desc: "Top compound movements",
        icon: Dumbbell,
        color: "text-yellow-400",
        content: [
            "👑 Squat (King of Legs): Targets quads, glutes, hamstrings, and core. Back squat for mass, front squat for quad emphasis. Nothing replaces it.",
            "🏋️ Deadlift (Full-Body Power): Builds entire posterior chain — glutes, hamstrings, erectors, traps, grip. Conventional for overall mass, sumo for hip-dominant lifters.",
            "💎 Bench Press (Chest Foundation): The primary chest builder. Flat for overall mass, incline (30°) for upper chest development. Use full ROM — touch your chest.",
            "🔝 Overhead Press (Shoulder Mass): Standing barbell press builds all three delt heads plus core stability. The best shoulder exercise, period.",
            "🔙 Barbell Row (Back Thickness): Bent-over rows build lat width and upper back thickness. Keep your torso at 45°, pull to your lower chest.",
            "⬆️ Pull-Up (V-Taper Builder): The ultimate lat exercise. Can't do one? Use assisted machine or lat pulldowns. Aim for 3 sets of 8–12 before adding weight.",
        ]
    },
    {
        title: "Recovery & Mobility",
        desc: "Optimize rest and prevent injury",
        icon: Heart,
        color: "text-pink-400",
        content: [
            "🧊 Active Recovery: Light movement on rest days (walking, swimming, yoga) increases blood flow and speeds recovery without adding training stress.",
            "🧘 Dynamic Stretching Pre-Workout: 5–10 minutes of leg swings, arm circles, and hip openers prepares joints and muscles. Static stretching before lifting reduces power output.",
            "🤸 Static Stretching Post-Workout: Hold stretches 30–60 seconds per muscle group after training. This improves flexibility and reduces next-day soreness.",
            "💆 Foam Rolling: 1–2 minutes per muscle group reduces muscle tightness. Focus on quads, IT band, lats, and thoracic spine. It won't break up scar tissue — but it reduces perceived soreness.",
            "🩹 Deload Weeks: Every 4–6 weeks, reduce volume by 40–50% and intensity by 10–15%. This lets connective tissue recover and prevents overtraining burnout.",
            "💧 Hydration & Electrolytes: Dehydration of just 2% reduces strength by up to 20%. Drink 3–4 liters daily. Add sodium, potassium, and magnesium if you sweat heavily.",
        ]
    },
];

export function KnowledgeBase() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleGuide = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section id="knowledge" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <BookOpen className="h-4 w-4" />
                        Learn & Grow
                    </div>
                    <h2 className="text-4xl font-bold text-white">Fitness Guides</h2>
                    <p className="mt-3 text-slate-400">Expert-curated guides to level up your training knowledge. Click any card to explore.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {guides.map((guide, i) => (
                            <motion.div key={guide.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={expandedIndex === i ? "sm:col-span-2 lg:col-span-3" : ""}>
                                <Card
                                    className={`glass-card border-forge-border hover:border-forge-orange/30 transition-all cursor-pointer group h-full ${expandedIndex === i ? "border-forge-orange/40 bg-forge-orange/5" : ""}`}
                                    onClick={() => toggleGuide(i)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900/50 ${guide.color} group-hover:scale-110 transition-transform`}>
                                                <guide.icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-white group-hover:text-forge-orange transition-colors">{guide.title}</h3>
                                                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${expandedIndex === i ? "rotate-180 text-forge-orange" : ""}`} />
                                                </div>
                                                <p className="mt-1 text-sm text-slate-400">{guide.desc}</p>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {expandedIndex === i && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-5 pt-5 border-t border-forge-border/50 space-y-3">
                                                        {guide.content.map((tip, j) => (
                                                            <motion.div
                                                                key={j}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: j * 0.05 }}
                                                                className="text-sm text-slate-300 leading-relaxed pl-1"
                                                            >
                                                                {tip}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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
