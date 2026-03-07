"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const restPresets = [
    { label: "30s", seconds: 30 },
    { label: "1m", seconds: 60 },
    { label: "1.5m", seconds: 90 },
    { label: "2m", seconds: 120 },
    { label: "3m", seconds: 180 },
];

const hiitPresets = [
    { label: "20/10", work: 20, rest: 10 },
    { label: "30/15", work: 30, rest: 15 },
    { label: "40/20", work: 40, rest: 20 },
    { label: "45/15", work: 45, rest: 15 },
];

function CircularTimer({ timeLeft, totalTime, label }: { timeLeft: number; totalTime: number; label: string }) {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTime > 0 ? (timeLeft / totalTime) * circumference : circumference;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative h-56 w-56">
                <svg className="h-56 w-56 -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,107,43,0.1)" strokeWidth="8" />
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#ff6b2b"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white tabular-nums">
                        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-forge-orange-light mt-1">{label}</span>
                </div>
            </div>
        </div>
    );
}

function RestTimer() {
    const [totalTime, setTotalTime] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const tick = useCallback(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                setRunning(false);
                return 0;
            }
            return prev - 1;
        });
    }, []);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(tick, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, tick]);

    const selectPreset = (seconds: number) => {
        setTotalTime(seconds);
        setTimeLeft(seconds);
        setRunning(false);
    };

    const reset = () => {
        setTimeLeft(totalTime);
        setRunning(false);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-2">
                {restPresets.map((preset) => (
                    <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => selectPreset(preset.seconds)}
                        className={`border-forge-border ${totalTime === preset.seconds ? "bg-forge-orange text-white border-forge-orange" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>

            <CircularTimer timeLeft={timeLeft} totalTime={totalTime} label="Rest Timer" />

            <div className="flex gap-3">
                <Button
                    onClick={() => setRunning(!running)}
                    className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 px-8"
                >
                    {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {running ? "Pause" : "Start"}
                </Button>
                <Button
                    variant="outline"
                    onClick={reset}
                    className="border-forge-border text-slate-300 hover:bg-white/5 hover:text-white"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>
        </div>
    );
}

function HIITTimer() {
    const [workTime, setWorkTime] = useState(30);
    const [restTime, setRestTime] = useState(15);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isWork, setIsWork] = useState(true);
    const [running, setRunning] = useState(false);
    const [rounds, setRounds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const tick = useCallback(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                setIsWork((wasWork) => {
                    if (wasWork) {
                        setTimeLeft(restTime);
                        setRounds((r) => r + 1);
                    } else {
                        setTimeLeft(workTime);
                    }
                    return !wasWork;
                });
                return prev;
            }
            return prev - 1;
        });
    }, [workTime, restTime]);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(tick, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, tick]);

    const selectPreset = (work: number, rest: number) => {
        setWorkTime(work);
        setRestTime(rest);
        setTimeLeft(work);
        setIsWork(true);
        setRunning(false);
        setRounds(0);
    };

    const reset = () => {
        setTimeLeft(workTime);
        setIsWork(true);
        setRunning(false);
        setRounds(0);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-2">
                {hiitPresets.map((preset) => (
                    <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => selectPreset(preset.work, preset.rest)}
                        className={`border-forge-border ${workTime === preset.work && restTime === preset.rest ? "bg-forge-orange text-white border-forge-orange" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>

            <CircularTimer timeLeft={timeLeft} totalTime={isWork ? workTime : restTime} label={isWork ? "Work" : "Rest"} />

            <div className="text-center">
                <span className="text-sm text-slate-400">Rounds completed: </span>
                <span className="font-bold text-white">{rounds}</span>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={() => setRunning(!running)}
                    className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 px-8"
                >
                    {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {running ? "Pause" : "Start"}
                </Button>
                <Button
                    variant="outline"
                    onClick={reset}
                    className="border-forge-border text-slate-300 hover:bg-white/5 hover:text-white"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>
        </div>
    );
}

export function WorkoutTimer() {
    return (
        <section id="timer" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Timer className="h-4 w-4" />
                        Timer Tools
                    </div>
                    <h2 className="text-4xl font-bold text-white">Stay on Track</h2>
                    <p className="mt-3 text-slate-400">Rest timers and HIIT intervals to keep your workouts consistent.</p>
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
                                <Zap className="h-5 w-5 text-forge-orange" />
                                Workout Timer
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Choose a timer mode and select a duration preset
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="rest" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-forge-border">
                                    <TabsTrigger value="rest" className="data-[state=active]:bg-forge-orange data-[state=active]:text-white text-slate-400">
                                        <Timer className="mr-2 h-4 w-4" />
                                        Rest Timer
                                    </TabsTrigger>
                                    <TabsTrigger value="hiit" className="data-[state=active]:bg-forge-orange data-[state=active]:text-white text-slate-400">
                                        <Zap className="mr-2 h-4 w-4" />
                                        HIIT Timer
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="rest" className="mt-6">
                                    <RestTimer />
                                </TabsContent>
                                <TabsContent value="hiit" className="mt-6">
                                    <HIITTimer />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
