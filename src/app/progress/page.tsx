"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, Plus, Trash2, Scale, Ruler, Loader2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ProgressEntry {
    id: string;
    metric: string;
    value: number;
    notes: string;
    logged_at: string;
}

const METRICS = ["Body Weight", "Waist Size", "Chest Size", "Arm Size", "Thigh Size", "Body Fat %"];
const STORAGE_KEY = "forgefit_progress";

function getEntries(): ProgressEntry[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveEntries(entries: ProgressEntry[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function ProgressPage() {
    const [entries, setEntries] = useState<ProgressEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedChart, setSelectedChart] = useState("Body Weight");
    const [formMetric, setFormMetric] = useState("");
    const [formValue, setFormValue] = useState("");
    const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
    const [formNotes, setFormNotes] = useState("");

    const refresh = useCallback(() => {
        setEntries(getEntries());
        setLoading(false);
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formMetric || !formValue) return;
        const entry: ProgressEntry = {
            id: crypto.randomUUID(),
            metric: formMetric,
            value: parseFloat(formValue),
            notes: formNotes,
            logged_at: new Date(formDate).toISOString(),
        };
        const updated = [entry, ...getEntries()];
        saveEntries(updated);
        setEntries(updated);
        setDialogOpen(false);
        setFormMetric("");
        setFormValue("");
        setFormNotes("");
        setFormDate(new Date().toISOString().split("T")[0]);
    };

    const handleDelete = (id: string) => {
        const updated = getEntries().filter((e) => e.id !== id);
        saveEntries(updated);
        setEntries(updated);
    };

    const chartData = useMemo(() =>
        entries
            .filter((e) => e.metric === selectedChart)
            .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime())
            .map((e) => ({
                date: new Date(e.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                value: e.value,
            })),
        [entries, selectedChart]
    );

    const getUnit = (metric: string) => {
        if (metric === "Body Fat %") return "%";
        if (metric === "Body Weight") return "kg";
        return "cm";
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-forge-orange" /></div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-forge-border bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-forge-orange" />
                            <span className="text-lg font-bold text-white">Forge<span className="text-forge-orange">Fit</span></span>
                        </a>
                        <span className="hidden sm:inline text-slate-600 text-sm">|</span>
                        <span className="hidden sm:inline text-sm text-slate-400">Body Progress</span>
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
                                <Scale className="h-7 w-7 text-forge-orange" />
                                Body Progress
                            </h1>
                        </div>
                        <p className="text-sm text-slate-400 ml-6">Track body weight, waist size, measurements, and body fat over time.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger render={<Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25" />}>
                            <Plus className="mr-2 h-4 w-4" />Log Measurement
                        </DialogTrigger>
                        <DialogContent className="bg-forge-card border-forge-border text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2"><Ruler className="h-5 w-5 text-forge-orange" />Log Body Measurement</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Metric</Label>
                                    <Select value={formMetric} onValueChange={(v) => setFormMetric(v ?? "")}>
                                        <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange"><SelectValue placeholder="Select metric" /></SelectTrigger>
                                        <SelectContent className="bg-forge-card border-forge-border">
                                            {METRICS.map((m) => (<SelectItem key={m} value={m} className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">{m}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Value ({formMetric ? getUnit(formMetric) : ""})</Label>
                                        <Input type="number" step="0.1" min="0" placeholder="e.g. 75.5" value={formValue} onChange={(e) => setFormValue(e.target.value)} required className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Date</Label>
                                        <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange scheme-dark" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Notes (optional)</Label>
                                    <Input placeholder="e.g. Morning, fasted" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange" />
                                </div>
                                <Button type="submit" disabled={!formMetric || !formValue} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">
                                    <Plus className="mr-2 h-4 w-4" />Save Measurement
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Chart */}
                <Card className="glass-card border-forge-border">
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <CardTitle className="text-white flex items-center gap-2"><TrendingUp className="h-5 w-5 text-forge-orange" />Progress Chart</CardTitle>
                            <Select value={selectedChart} onValueChange={(v) => setSelectedChart(v ?? "Body Weight")}>
                                <SelectTrigger className="w-[160px] bg-slate-900/50 border-forge-border text-white text-sm focus:border-forge-orange"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-forge-card border-forge-border">
                                    {METRICS.map((m) => (<SelectItem key={m} value={m} className="text-slate-300 focus:bg-forge-orange/10 focus:text-white text-sm">{m}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {chartData.length < 2 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                <Scale className="h-12 w-12 mb-3 text-slate-600" />
                                <p className="text-sm">Log at least 2 {selectedChart} entries to see the chart</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                                    <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} domain={["auto", "auto"]} unit={` ${getUnit(selectedChart)}`} />
                                    <Tooltip contentStyle={{ backgroundColor: "#161b22", borderColor: "#30363d", borderRadius: "12px", color: "#f8fafc", fontSize: "13px" }} labelStyle={{ color: "#94a3b8" }} formatter={(value) => [`${value} ${getUnit(selectedChart)}`, selectedChart]} />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" name={selectedChart} stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: "#34d399", stroke: "#10b981", strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* History Table */}
                <Card className="glass-card border-forge-border">
                    <CardHeader><CardTitle className="text-white flex items-center gap-2"><Ruler className="h-5 w-5 text-forge-orange" />Measurement History</CardTitle></CardHeader>
                    <CardContent>
                        {entries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500"><Ruler className="h-10 w-10 mb-2 text-slate-600" /><p className="text-sm">No measurements logged yet</p></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-forge-border">
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Metric</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Value</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.map((e) => (
                                            <tr key={e.id} className="border-b border-forge-border/50 hover:bg-white/2 transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-white">{e.metric}</td>
                                                <td className="px-4 py-3 text-sm text-emerald-400 font-semibold">{e.value} {getUnit(e.metric)}</td>
                                                <td className="px-4 py-3 text-sm text-slate-400">{e.notes || "—"}</td>
                                                <td className="px-4 py-3 text-sm text-slate-400">{new Date(e.logged_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10">
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
