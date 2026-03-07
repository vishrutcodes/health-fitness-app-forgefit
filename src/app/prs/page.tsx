"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { LogPrDialog } from "@/components/progress/log-pr-dialog";
import { ProgressChart } from "@/components/progress/progress-chart";
import { PrHistoryTable } from "@/components/progress/pr-history-table";
import { Button } from "@/components/ui/button";
import { Flame, LogOut, Loader2, ArrowLeft, Trophy } from "lucide-react";

interface PR {
    id: string;
    exercise_name: string;
    weight_kg: number;
    reps: number;
    logged_at: string;
}

export default function ProgressPage() {
    const [records, setRecords] = useState<PR[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const fetchRecords = useCallback(async () => {
        try {
            const res = await fetch("/api/progress");
            if (res.ok) {
                const data = await res.json();
                setRecords(data);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserEmail(user.email || "");
        });
    }, [fetchRecords, supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-forge-orange" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 border-b border-forge-border bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-2 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-forge-orange to-forge-orange-light">
                                <Flame className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">Forge<span className="text-forge-orange">Fit</span></span>
                        </a>
                        <span className="hidden sm:inline text-slate-600 text-sm">|</span>
                        <span className="hidden sm:inline text-sm text-slate-400">Personal Records</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-xs text-slate-500">{userEmail}</span>
                        <Button variant="ghost" onClick={handleSignOut} className="text-slate-400 hover:text-white hover:bg-white/5 text-sm gap-2">
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <a href="/" className="text-slate-500 hover:text-slate-300 transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                            </a>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                                <Trophy className="h-7 w-7 text-forge-orange" />
                                Personal Records
                            </h1>
                        </div>
                        <p className="text-sm text-slate-400 ml-6">Track your heaviest lifts and visualize strength gains over time.</p>
                    </div>
                    <LogPrDialog onSuccess={fetchRecords} />
                </div>

                {/* Chart */}
                <ProgressChart records={records} />

                {/* History Table */}
                <PrHistoryTable records={records} onDelete={fetchRecords} />
            </main>
        </div>
    );
}
