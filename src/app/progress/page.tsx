"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Plus, Trash2, Loader2, LogIn } from "lucide-react";
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

const metrics = ["Body Weight (kg)", "Waist Size (cm)", "Chest Size (cm)", "Arm Size (cm)", "Thigh Size (cm)", "Body Fat (%)"];

interface ProgressEntry {
    id: string;
    metric: string;
    value: number;
    note: string | null;
    date: string;
}

export default function ProgressPage() {
    const [entries, setEntries] = useState<ProgressEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [metric, setMetric] = useState("");
    const [value, setValue] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [filter, setFilter] = useState("Body Weight (kg)");
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    const fetchEntries = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (!user) { setLoading(false); return; }
            const { data } = await supabase.from("progress_records").select("*").order("date", { ascending: false });
            if (data) setEntries(data);
        } catch { /* table may not exist */ }
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchEntries(); }, [fetchEntries]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!metric || !value || !user) return;
        setSaving(true);
        const newEntry: ProgressEntry = { id: crypto.randomUUID(), metric, value: parseFloat(value), note: note || null, date };
        setEntries((prev) => [newEntry, ...prev]);
        setOpen(false);
        await supabase.from("progress_records").insert({ user_id: user.id, metric, value: parseFloat(value), note: note || null, date });
        setMetric(""); setValue(""); setNote(""); setDate(new Date().toISOString().split("T")[0]);
        setSaving(false);
        fetchEntries();
    };

    const handleDelete = async (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        await supabase.from("progress_records").delete().eq("id", id);
    };

    const getUnit = (m: string) => { if (m.includes("kg")) return "kg"; if (m.includes("%")) return "%"; return "cm"; };

    const chartData = entries.filter((e) => e.metric === filter).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((e) => ({
        date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: e.value,
    }));

    if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-forge-orange" /></div>;

    if (!user) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <TrendingUp className="h-16 w-16 text-forge-orange mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Track Your Progress</h2>
                <p className="text-slate-400 mb-6 max-w-sm">Sign in to start logging your body measurements and see your transformation over time.</p>
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
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2"><TrendingUp className="h-7 w-7 text-forge-orange" />Body Progress</h1>
                        <p className="text-slate-400 mt-1">Track your body measurements over time</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25" />}>
                            <Plus className="h-4 w-4 mr-2" />Log Measurement
                        </DialogTrigger>
                        <DialogContent className="bg-[#0d1117] border-forge-border text-white">
                            <DialogHeader><DialogTitle className="text-white">Log Measurement</DialogTitle></DialogHeader>
                            <form onSubmit={handleAdd} className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Metric</Label>
                                    <Select value={metric} onValueChange={(v) => v && setMetric(v)}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white"><SelectValue placeholder="Select metric" /></SelectTrigger>
                                        <SelectContent className="bg-[#0d1117] border-forge-border">{metrics.map((m) => (<SelectItem key={m} value={m} className="text-white hover:bg-forge-orange/10">{m}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2"><Label className="text-slate-300">Value</Label><Input type="number" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0.0" required className="bg-slate-900/50 border-forge-border text-white" /></div>
                                    <div className="space-y-2"><Label className="text-slate-300">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-900/50 border-forge-border text-white" /></div>
                                </div>
                                <div className="space-y-2"><Label className="text-slate-300">Note (optional)</Label><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Morning weight" className="bg-slate-900/50 border-forge-border text-white" /></div>
                                <Button type="submit" disabled={!metric || !value || saving} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-card border-forge-border mb-6">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white text-lg">Progress Chart</CardTitle>
                            <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
                                <SelectTrigger className="w-[180px] bg-slate-900/50 border-forge-border text-white text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-[#0d1117] border-forge-border">{metrics.map((m) => (<SelectItem key={m} value={m} className="text-white hover:bg-forge-orange/10">{m}</SelectItem>))}</SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#161b22", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff" }} />
                                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : <p className="text-center text-slate-500 py-12">No {filter} data yet. Log your first measurement!</p>}
                        </CardContent>
                    </Card>
                </motion.div>

                <Card className="glass-card border-forge-border">
                    <CardHeader><CardTitle className="text-white text-lg">Measurement History</CardTitle></CardHeader>
                    <CardContent>
                        {entries.length > 0 ? (
                            <Table>
                                <TableHeader><TableRow className="border-forge-border"><TableHead className="text-slate-400">Metric</TableHead><TableHead className="text-slate-400">Value</TableHead><TableHead className="text-slate-400">Note</TableHead><TableHead className="text-slate-400">Date</TableHead><TableHead className="text-slate-400 w-10"></TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {entries.map((e) => (
                                        <TableRow key={e.id} className="border-forge-border hover:bg-white/2">
                                            <TableCell className="text-white font-medium">{e.metric}</TableCell>
                                            <TableCell className="text-emerald-400 font-bold">{e.value} {getUnit(e.metric)}</TableCell>
                                            <TableCell className="text-slate-400">{e.note || "—"}</TableCell>
                                            <TableCell className="text-slate-400">{new Date(e.date).toLocaleDateString()}</TableCell>
                                            <TableCell><button onClick={() => handleDelete(e.id)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : <p className="text-center text-slate-500 py-8">No measurements logged yet.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
