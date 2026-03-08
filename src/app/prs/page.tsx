"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Plus, Trash2, Loader2, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const exercises = ["Squat", "Bench Press", "Deadlift", "Overhead Press", "Barbell Row", "Pull Up", "Dips", "Leg Press", "Romanian Deadlift", "Incline Bench Press"];

interface PREntry {
    id: string;
    exercise_name: string;
    weight: number;
    reps: number;
    date: string;
}

export default function PRsPage() {
    const [entries, setEntries] = useState<PREntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [exercise, setExercise] = useState("");
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("1");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [filter, setFilter] = useState("Squat");
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    const fetchEntries = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (!user) { setLoading(false); return; }
            const { data } = await supabase.from("personal_records").select("*").order("date", { ascending: false });
            if (data) setEntries(data);
        } catch { /* table may not exist */ }
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchEntries(); }, [fetchEntries]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exercise || !weight || !user) return;
        setSaving(true);
        const newEntry: PREntry = { id: crypto.randomUUID(), exercise_name: exercise, weight: parseFloat(weight), reps: parseInt(reps), date };
        setEntries((prev) => [newEntry, ...prev]);
        setOpen(false);
        await supabase.from("personal_records").insert({ user_id: user.id, exercise_name: exercise, weight: parseFloat(weight), reps: parseInt(reps), date });
        setExercise(""); setWeight(""); setReps("1"); setDate(new Date().toISOString().split("T")[0]);
        setSaving(false);
        fetchEntries();
    };

    const handleDelete = async (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        await supabase.from("personal_records").delete().eq("id", id);
    };

    const filteredForChart = entries.filter((e) => e.exercise_name === filter).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((e) => ({
        date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), weight: e.weight,
    }));

    const bestPR = entries.filter((e) => e.exercise_name === filter).sort((a, b) => b.weight - a.weight)[0];
    const availableExercises = [...new Set(entries.map((e) => e.exercise_name))];

    if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-forge-orange" /></div>;

    if (!user) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <Trophy className="h-16 w-16 text-forge-orange mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Track Your PRs</h2>
                <p className="text-slate-400 mb-6 max-w-sm">Sign in to start logging your personal records and see your strength gains over time.</p>
                <Link href="/auth"><Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25"><LogIn className="mr-2 h-4 w-4" />Sign In to Track</Button></Link>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] px-4 py-8">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-1 block">← Home</Link>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Trophy className="h-7 w-7 text-forge-orange" />Personal Records</h1>
                        <p className="text-slate-400 mt-1">Track your best lifts</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger>
                            <Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25"><Plus className="h-4 w-4 mr-2" />Log PR</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0d1117] border-forge-border text-white">
                            <DialogHeader><DialogTitle className="text-white">Log Personal Record</DialogTitle></DialogHeader>
                            <form onSubmit={handleAdd} className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Exercise</Label>
                                    <Select value={exercise} onValueChange={(v) => v && setExercise(v)}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white"><SelectValue placeholder="Select exercise" /></SelectTrigger>
                                        <SelectContent className="bg-[#0d1117] border-forge-border">{exercises.map((ex) => (<SelectItem key={ex} value={ex} className="text-white hover:bg-forge-orange/10">{ex}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-2"><Label className="text-slate-300">Weight (kg)</Label><Input type="number" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" required className="bg-slate-900/50 border-forge-border text-white" /></div>
                                    <div className="space-y-2"><Label className="text-slate-300">Reps</Label><Input type="number" min="1" value={reps} onChange={(e) => setReps(e.target.value)} className="bg-slate-900/50 border-forge-border text-white" /></div>
                                    <div className="space-y-2"><Label className="text-slate-300">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-900/50 border-forge-border text-white" /></div>
                                </div>
                                <Button type="submit" disabled={!exercise || !weight || saving} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save PR"}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-card border-forge-border mb-6">
                        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-white text-lg">Strength Progress</CardTitle>
                                {bestPR && <span className="text-xs text-forge-orange bg-forge-orange/10 border border-forge-orange/20 rounded-full px-2.5 py-1">Best: {bestPR.weight} kg × {bestPR.reps}</span>}
                            </div>
                            <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
                                <SelectTrigger className="w-[180px] bg-slate-900/50 border-forge-border text-white text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-[#0d1117] border-forge-border">{(availableExercises.length > 0 ? availableExercises : exercises).map((ex) => (<SelectItem key={ex} value={ex} className="text-white hover:bg-forge-orange/10">{ex}</SelectItem>))}</SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {filteredForChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={filteredForChart}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#161b22", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff" }} />
                                        <Line type="monotone" dataKey="weight" stroke="#ff6b2b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : <p className="text-center text-slate-500 py-12">No {filter} data yet. Log your first PR!</p>}
                        </CardContent>
                    </Card>
                </motion.div>

                <Card className="glass-card border-forge-border">
                    <CardHeader><CardTitle className="text-white text-lg">PR History</CardTitle></CardHeader>
                    <CardContent>
                        {entries.length > 0 ? (
                            <Table>
                                <TableHeader><TableRow className="border-forge-border"><TableHead className="text-slate-400">Exercise</TableHead><TableHead className="text-slate-400">Weight</TableHead><TableHead className="text-slate-400">Reps</TableHead><TableHead className="text-slate-400">Date</TableHead><TableHead className="text-slate-400 w-10"></TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {entries.map((e) => (
                                        <TableRow key={e.id} className="border-forge-border hover:bg-white/2">
                                            <TableCell className="text-white font-medium">{e.exercise_name}</TableCell>
                                            <TableCell className="text-forge-orange font-bold">{e.weight} kg</TableCell>
                                            <TableCell className="text-slate-300">{e.reps}</TableCell>
                                            <TableCell className="text-slate-400">{new Date(e.date).toLocaleDateString()}</TableCell>
                                            <TableCell><button onClick={() => handleDelete(e.id)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : <p className="text-center text-slate-500 py-8">No PRs logged yet.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
