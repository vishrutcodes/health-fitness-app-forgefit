"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface PR {
    id: string;
    exercise_name: string;
    weight_kg: number;
    reps: number;
    logged_at: string;
}

interface ProgressChartProps {
    records: PR[];
}

export function ProgressChart({ records }: ProgressChartProps) {
    const exercises = useMemo(() => {
        const unique = [...new Set(records.map((r) => r.exercise_name))];
        return unique.sort();
    }, [records]);

    const [selectedExercise, setSelectedExercise] = useState(exercises[0] || "");

    const chartData = useMemo(() => {
        return records
            .filter((r) => r.exercise_name === selectedExercise)
            .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime())
            .map((r) => ({
                date: new Date(r.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                weight: Number(r.weight_kg),
                reps: r.reps,
            }));
    }, [records, selectedExercise]);

    // Compute best PR for selected exercise
    const bestPR = useMemo(() => {
        const filtered = records.filter((r) => r.exercise_name === selectedExercise);
        if (filtered.length === 0) return null;
        return filtered.reduce((max, r) => (Number(r.weight_kg) > Number(max.weight_kg) ? r : max), filtered[0]);
    }, [records, selectedExercise]);

    if (exercises.length === 0) {
        return (
            <Card className="glass-card border-forge-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-slate-500">
                    <TrendingUp className="h-12 w-12 mb-3 text-slate-600" />
                    <p className="text-lg font-medium">No records yet</p>
                    <p className="text-sm">Log your first PR to see your progress chart!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-card border-forge-border">
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-forge-orange" />
                        Progress Chart
                    </CardTitle>
                    <div className="flex items-center gap-3">
                        {bestPR && (
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Best PR</p>
                                <p className="text-sm font-bold text-forge-orange">{Number(bestPR.weight_kg)} kg × {bestPR.reps}</p>
                            </div>
                        )}
                        <Select value={selectedExercise} onValueChange={(v) => setSelectedExercise(v ?? "")}>
                            <SelectTrigger className="w-[180px] bg-slate-900/50 border-forge-border text-white text-sm focus:border-forge-orange">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-forge-card border-forge-border">
                                {exercises.map((ex) => (
                                    <SelectItem key={ex} value={ex} className="text-slate-300 focus:bg-forge-orange/10 focus:text-white text-sm">{ex}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {chartData.length < 2 ? (
                    <div className="flex items-center justify-center py-12 text-slate-500 text-sm">
                        Log at least 2 entries for {selectedExercise} to see the chart
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                domain={["auto", "auto"]}
                                unit=" kg"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#161b22",
                                    borderColor: "#30363d",
                                    borderRadius: "12px",
                                    color: "#f8fafc",
                                    fontSize: "13px",
                                }}
                                labelStyle={{ color: "#94a3b8" }}
                                formatter={(value) => [`${value} kg`, "Weight"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#ff6b2b"
                                strokeWidth={3}
                                dot={{ fill: "#ff6b2b", strokeWidth: 0, r: 5 }}
                                activeDot={{ r: 7, fill: "#ff8c5a", stroke: "#ff6b2b", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
