"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const popularExercises = [
    "Barbell Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull-ups",
    "Romanian Deadlift",
    "Lateral Raises",
];

const exerciseDB: Record<string, { muscles: string; tips: string[] }> = {
    "barbell squat": {
        muscles: "Quadriceps, Glutes, Hamstrings, Core",
        tips: ["Keep chest up and back straight", "Drive through heels", "Knees track over toes", "Break parallel for full ROM"],
    },
    "bench press": {
        muscles: "Chest, Triceps, Front Deltoids",
        tips: ["Retract shoulder blades", "Arch the upper back slightly", "Bar path from mid-chest to lockout", "Plant feet firmly on the ground"],
    },
    "deadlift": {
        muscles: "Back, Glutes, Hamstrings, Core",
        tips: ["Keep the bar close to your body", "Hinge at hips, not lower back", "Engage lats before lifting", "Lock out hips at the top"],
    },
    "overhead press": {
        muscles: "Shoulders, Triceps, Upper Chest",
        tips: ["Brace your core throughout", "Press in a slight arc around the face", "Full lockout at the top", "Avoid excessive back lean"],
    },
    "barbell row": {
        muscles: "Upper Back, Lats, Biceps, Rear Delts",
        tips: ["Hinge forward at 45 degrees", "Pull to the lower chest/upper abdomen", "Squeeze shoulder blades together", "Control the eccentric"],
    },
    "pull-ups": {
        muscles: "Lats, Biceps, Rear Delts, Core",
        tips: ["Full dead hang at the bottom", "Drive elbows down and back", "Chin over the bar at the top", "Avoid swinging or kipping"],
    },
    "romanian deadlift": {
        muscles: "Hamstrings, Glutes, Lower Back",
        tips: ["Slight knee bend throughout", "Push hips back as far as possible", "Feel the stretch in hamstrings", "Keep bar close to legs"],
    },
    "lateral raises": {
        muscles: "Side Deltoids",
        tips: ["Lead with the elbows", "Raise to shoulder height", "Control the weight down slowly", "Slight forward lean helps isolation"],
    },
};

export function ExerciseGuide() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (exercise: string) => {
        setSearch(exercise);
        setSelected(exercise.toLowerCase());
    };

    const handleSearch = () => {
        const key = search.toLowerCase().trim();
        if (exerciseDB[key]) {
            setSelected(key);
        }
    };

    const info = selected ? exerciseDB[selected] : null;

    return (
        <section id="exercise-guide" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <BookOpen className="h-4 w-4" />
                        Form Library
                    </div>
                    <h2 className="text-4xl font-bold text-white">Exercise Form Guide</h2>
                    <p className="mt-3 text-slate-400">Search for any exercise to get form tips and muscle targeting info.</p>
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
                                <Search className="h-5 w-5 text-forge-orange" />
                                Search Exercises
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Type an exercise name or click a tag below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Search any exercise..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="flex-1 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange py-6 text-base"
                                />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {popularExercises.map((ex) => (
                                    <Badge
                                        key={ex}
                                        variant="outline"
                                        onClick={() => handleSelect(ex)}
                                        className="cursor-pointer border-forge-border text-slate-300 hover:border-forge-orange hover:text-forge-orange hover:bg-forge-orange/5 transition-all px-3 py-1.5"
                                    >
                                        {ex}
                                    </Badge>
                                ))}
                            </div>

                            {info && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 rounded-xl bg-slate-900/50 border border-forge-border p-6"
                                >
                                    <h3 className="text-lg font-bold text-white capitalize">{selected}</h3>
                                    <p className="mt-2 text-sm text-forge-orange-light">
                                        <span className="font-medium">Muscles:</span> {info.muscles}
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium text-slate-300">Form Tips:</p>
                                        {info.tips.map((tip, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forge-orange/10 text-xs text-forge-orange">{i + 1}</span>
                                                <p className="text-sm text-slate-400">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
