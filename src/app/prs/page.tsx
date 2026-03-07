"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, Plus, Trash2, Trophy, Dumbbell, Loader2, History } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface PREntry {
    id: string;
    exercise_name: string;
    weight_kg: number;
    reps: number;
    logged_at: string;
}

const EXERCISES = [
    "Squat", "Bench Press", "Deadlift", "Overhead Press",
    "Barbell Row", "Pull Up", "Dips", "Leg Press",
    "Romanian Deadlift", "Incline Bench Press",
];
const STORAGE_KEY = "forgefit_prs";

function getRecords(): PREntry[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveRecords(records: PREntry[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function PRsPage() {
    const [records, setRecords] = useState<PREntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState("");
    const [formExercise, setFormExercise] = useState("");
    const [formWeight, setFormWeight] = useState("");
    const [formReps, setFormReps] = useState("1");
    const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);

    const refresh = useCallback(() => {
        const data = getRecords();
        setRecords(data);
        setLoading(false);
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const exercises = useMemo(() => [...new Set(records.map((r) => r.exercise_name))].sort(), [records]);

    useEffect(() => {
        if (exercises.length > 0 && !selectedExercise) setSelectedExercise(exercises[0]);
    }, [exercises, selectedExercise]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formExercise || !formWeight) return;
        const entry: PREntry = {
            id: crypto.randomUUID(),
            exercise_name: formExercise,
            weight_kg: parseFloat(formWeight),
            reps: parseInt(formReps) || 1,
            logged_at: new Date(formDate).toISOString(),
        };
        const updated = [entry, ...getRecords()];
        saveRecords(updated);
        setRecords(updated);
        setDialogOpen(false);
        setFormExercise("");
        setFormWeight("");
        setFormReps("1");
        setFormDate(new Date().toISOString().split("T")[0]);
    };

    const handleDelete = (id: string) => {
        const updated = getRecords().filter((r) => r.id !== id);
        saveRecords(updated);
        setRecords(updated);
    };

    const chartData = useMemo(() =>
        records
            .filter((r) => r.exercise_name === selectedExercise)
            .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime())
            .map((r) => ({
                date: new Date(r.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                weight: r.weight_kg,
            })),
        [records, selectedExercise]
    );

    const bestPR = useMemo(() => {
        const filtered = records.filter((r) => r.exercise_name === selectedExercise);
        if (filtered.length === 0) return null;
        return filtered.reduce((max, r) => (r.weight_kg > max.weight_kg ? r : max), filtered[0]);
    }, [records, selectedExercise]);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-forge-orange" /></div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-forge-border bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-forge-orange" />
                            <span className="text-lg font-bold text-white">Forge<span className="text-forge-orange">Fit</span></span>
                        </a>
                        <span className="hidden sm:inline text-slate-600 text-sm">|</span>
                        <span className="hidden sm:inline text-sm text-slate-400">Personal Records</span>
                    </div>
                    <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">← Back to Home</a>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <a href="/" className="text-slate-500 hover:text-slate-300 transition-colors"><ArrowLeft className="h-4 w-4" /></a>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                                <Trophy className="h-7 w-7 text-forge-orange" />
                                Personal Records
                            </h1>
                        </div>
                        <p className="text-sm text-slate-400 ml-6">Track your heaviest lifts and visualize strength gains over time.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger render={<Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25" />}>
                            <Plus className="mr-2 h-4 w-4" />Log PR
                        </DialogTrigger>
                        <DialogContent className="bg-forge-card border-forge-border text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2"><Dumbbell className="h-5 w-5 text-forge-orange" />Log Personal Record</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Exercise</Label>
                                    <Select value={formExercise} onValueChange={(v) => setFormExercise(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange"><SelectValue placeholder="Select exercise" /></SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            {EXERCISES.map((ex) => (<SelectItem key={ex} value={ex} className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">{ex}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Weight (kg)</Label>
                                        <Input type="number" step="0.5" min="0" placeholder="e.g. 100" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} required className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Reps</Label>
                                        <Input type="number" min="1" placeholder="e.g. 5" value={formReps} onChange={(e) => setFormReps(e.target.value)} required className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Date</Label>
                                    <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange scheme-dark" />
                                </div>
                                <Button type="submit" disabled={!formExercise || !formWeight} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                                    <Plus className="mr-2 h-4 w-4" />Save Record
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Chart */}
                <Card className="glass-card border-forge-border">
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <CardTitle className="text-white flex items-center gap-2"><TrendingUp className="h-5 w-5 text-forge-orange" />Strength Progress</CardTitle>
                            <div className="flex items-center gap-3">
                                {bestPR && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Best PR</p>
                                        <p className="text-sm font-bold text-forge-orange">{bestPR.weight_kg} kg × {bestPR.reps}</p>
                                    </div>
                                )}
                                {exercises.length > 0 && (
                                    <Select value={selectedExercise} onValueChange={(v) => setSelectedExercise(v ?? "")}>
                                        <SelectTrigger className="w-[180px] bg-slate-900/50 border-forge-border text-white text-sm focus:border-forge-orange"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            {exercises.map((ex) => (<SelectItem key={ex} value={ex} className="text-slate-300 focus:bg-forge-orange/10 focus:text-white text-sm">{ex}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {exercises.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                <TrendingUp className="h-12 w-12 mb-3 text-slate-600" />
                                <p className="text-lg font-medium">No records yet</p>
                                <p className="text-sm">Log your first PR to see your progress!</p>
                            </div>
                        ) : chartData.length < 2 ? (
                            <div className="flex items-center justify-center py-12 text-slate-500 text-sm">
                                Log at least 2 entries for {selectedExercise} to see the chart
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                                    <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} domain={["auto", "auto"]} unit=" kg" />
                                    <Tooltip contentStyle={{ backgroundColor: "#161b22", borderColor: "#30363d", borderRadius: "12px", color: "#f8fafc", fontSize: "13px" }} labelStyle={{ color: "#94a3b8" }} formatter={(value) => [`${value} kg`, "Weight"]} />
                                    <Line type="monotone" dataKey="weight" stroke="#ff6b2b" strokeWidth={3} dot={{ fill: "#ff6b2b", strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: "#ff8c5a", stroke: "#ff6b2b", strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* History Table */}
                <Card className="glass-card border-forge-border">
                    <CardHeader><CardTitle className="text-white flex items-center gap-2"><History className="h-5 w-5 text-forge-orange" />PR History</CardTitle></CardHeader>
                    <CardContent>
                        {records.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500"><History className="h-10 w-10 mb-2 text-slate-600" /><p className="text-sm">No records logged yet</p></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-forge-border">
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Exercise</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Weight</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Reps</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((r) => (
                                            <tr key={r.id} className="border-b border-forge-border/50 hover:bg-white/2 transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-white">{r.exercise_name}</td>
                                                <td className="px-4 py-3 text-sm text-forge-orange font-semibold">{r.weight_kg} kg</td>
                                                <td className="px-4 py-3 text-sm text-slate-300">{r.reps}</td>
                                                <td className="px-4 py-3 text-sm text-slate-400">{new Date(r.logged_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
