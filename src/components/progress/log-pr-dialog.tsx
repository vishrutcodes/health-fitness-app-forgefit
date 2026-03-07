"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, Dumbbell } from "lucide-react";

const EXERCISES = [
    "Squat", "Bench Press", "Deadlift", "Overhead Press",
    "Barbell Row", "Pull Up", "Dips", "Leg Press",
    "Romanian Deadlift", "Incline Bench Press",
];

interface LogPrDialogProps {
    onSuccess: () => void;
}

export function LogPrDialog({ onSuccess }: LogPrDialogProps) {
    const [open, setOpen] = useState(false);
    const [exercise, setExercise] = useState("");
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("1");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exercise || !weight) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    exercise_name: exercise,
                    weight_kg: weight,
                    reps: reps,
                    logged_at: new Date(date).toISOString(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to log PR");
            }

            setOpen(false);
            setExercise("");
            setWeight("");
            setReps("1");
            setDate(new Date().toISOString().split("T")[0]);
            onSuccess();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={<Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25" />}
            >
                <Plus className="mr-2 h-4 w-4" />
                Log PR
            </DialogTrigger>
            <DialogContent className="bg-forge-card border-forge-border text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-forge-orange" />
                        Log Personal Record
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Exercise</Label>
                        <Select value={exercise} onValueChange={(v) => setExercise(v ?? "")}>
                            <SelectTrigger className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange">
                                <SelectValue placeholder="Select exercise" />
                            </SelectTrigger>
                            <SelectContent className="bg-forge-card border-forge-border">
                                {EXERCISES.map((ex) => (
                                    <SelectItem key={ex} value={ex} className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">{ex}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Weight (kg)</Label>
                            <Input
                                type="number"
                                step="0.5"
                                min="0"
                                placeholder="e.g. 100"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                                className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Reps</Label>
                            <Input
                                type="number"
                                min="1"
                                placeholder="e.g. 5"
                                value={reps}
                                onChange={(e) => setReps(e.target.value)}
                                required
                                className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-slate-900/50 border-forge-border text-white focus:border-forge-orange scheme-dark"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <Button
                        type="submit"
                        disabled={loading || !exercise || !weight}
                        className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        {loading ? "Saving..." : "Save Record"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
