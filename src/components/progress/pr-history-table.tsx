"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, History } from "lucide-react";

interface PR {
    id: string;
    exercise_name: string;
    weight_kg: number;
    reps: number;
    logged_at: string;
}

interface PrHistoryTableProps {
    records: PR[];
    onDelete: () => void;
}

export function PrHistoryTable({ records, onDelete }: PrHistoryTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/progress/${id}`, { method: "DELETE" });
            if (res.ok) {
                onDelete();
            }
        } catch {
            // silently fail
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Card className="glass-card border-forge-border">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-forge-orange" />
                    Recent History
                </CardTitle>
            </CardHeader>
            <CardContent>
                {records.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <History className="h-10 w-10 mb-2 text-slate-600" />
                        <p className="text-sm">No records logged yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-forge-border">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Exercise</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Weight</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Reps</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr key={r.id} className="border-b border-forge-border/50 hover:bg-white/2 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-white">{r.exercise_name}</td>
                                        <td className="px-4 py-3 text-sm text-forge-orange font-semibold">{Number(r.weight_kg)} kg</td>
                                        <td className="px-4 py-3 text-sm text-slate-300">{r.reps}</td>
                                        <td className="px-4 py-3 text-sm text-slate-400">
                                            {new Date(r.logged_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(r.id)}
                                                disabled={deletingId === r.id}
                                                className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                                            >
                                                {deletingId === r.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
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
    );
}
