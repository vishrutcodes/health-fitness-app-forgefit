"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, Trophy, LogOut, Loader2, Flame, Activity, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProgressEntry {
    metric: string;
    value: number;
    date: string;
}

interface PREntry {
    exercise_name: string;
    weight: number;
    reps: number;
    date: string;
}

export default function DashboardPage() {
    const [userName, setUserName] = useState("");
    const [progress, setProgress] = useState<ProgressEntry[]>([]);
    const [prs, setPRs] = useState<PREntry[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Athlete");
        }

        const { data: progressData } = await supabase
            .from("progress_records")
            .select("metric, value, date")
            .order("date", { ascending: true });

        const { data: prData } = await supabase
            .from("personal_records")
            .select("exercise_name, weight, reps, date")
            .order("date", { ascending: false })
            .limit(20);

        if (progressData) setProgress(progressData);
        if (prData) setPRs(prData);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    // Body weight chart data
    const weightChartData = progress
        .filter((p) => p.metric === "Body Weight (kg)")
        .map((p) => ({
            date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            weight: p.value,
        }));

    // PR bar chart — latest PR per exercise
    const latestPRs = new Map<string, number>();
    prs.forEach((pr) => {
        if (!latestPRs.has(pr.exercise_name)) {
            latestPRs.set(pr.exercise_name, pr.weight);
        }
    });
    const prBarData = Array.from(latestPRs.entries())
        .slice(0, 6)
        .map(([name, weight]) => ({ name: name.length > 10 ? name.slice(0, 10) + "…" : name, weight }));

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-forge-orange" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] px-4 py-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <LayoutDashboard className="h-7 w-7 text-forge-orange" />
                            Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">Welcome back, <span className="text-forge-orange font-medium">{userName}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="outline" className="border-forge-border text-slate-300 hover:text-white hover:bg-slate-800/50">
                                <Flame className="h-4 w-4 mr-2" />Home
                            </Button>
                        </Link>
                        <Button onClick={handleSignOut} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                            <LogOut className="h-4 w-4 mr-2" />Sign Out
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                        <Card className="glass-card border-forge-border hover:border-forge-orange/30 transition-all">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{progress.length}</p>
                                    <p className="text-sm text-slate-400">Measurements</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="glass-card border-forge-border hover:border-forge-orange/30 transition-all">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-orange/10 text-forge-orange">
                                    <Dumbbell className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{prs.length}</p>
                                    <p className="text-sm text-slate-400">PRs Logged</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="glass-card border-forge-border hover:border-forge-orange/30 transition-all">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                    <Trophy className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{latestPRs.size}</p>
                                    <p className="text-sm text-slate-400">Exercises Tracked</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Body Weight Line Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="glass-card border-forge-border">
                            <CardHeader>
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-400" />Body Weight Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {weightChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={weightChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                                            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                                            <Tooltip contentStyle={{ backgroundColor: "#161b22", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff" }} />
                                            <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center text-slate-500 py-8">No body weight data yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* PR Bar Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="glass-card border-forge-border">
                            <CardHeader>
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-forge-orange" />PR Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {prBarData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={prBarData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                                            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                                            <Tooltip contentStyle={{ backgroundColor: "#161b22", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff" }} />
                                            <Bar dataKey="weight" fill="#ff6b2b" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center text-slate-500 py-8">No PRs logged yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/progress">
                        <Card className="glass-card border-forge-border hover:border-emerald-500/30 transition-all cursor-pointer group">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Body Progress</h3>
                                    <p className="text-sm text-slate-400">Log measurements & track trends</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/prs">
                        <Card className="glass-card border-forge-border hover:border-forge-orange/30 transition-all cursor-pointer group">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-forge-orange/10 text-forge-orange group-hover:scale-110 transition-transform">
                                    <Trophy className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white group-hover:text-forge-orange transition-colors">Personal Records</h3>
                                    <p className="text-sm text-slate-400">Log PRs & visualize strength gains</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
