"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface TrainingPhase {
    id: string;
    name: string;
    type: string;
    weeks: string;
    calories: string;
}

const phaseColors: Record<string, string> = {
    cutting: "bg-red-500/10 text-red-400 border-red-500/20",
    bulking: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    maintaining: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    deload: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export function PhasePlanner() {
    const [phases, setPhases] = useState<TrainingPhase[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newPhase, setNewPhase] = useState({
        name: "", type: "", weeks: "", calories: "",
    });

    const addPhase = () => {
        if (newPhase.name && newPhase.type && newPhase.weeks) {
            setPhases([...phases, { ...newPhase, id: Date.now().toString() }]);
            setNewPhase({ name: "", type: "", weeks: "", calories: "" });
            setDialogOpen(false);
        }
    };

    const removePhase = (id: string) => setPhases(phases.filter((p) => p.id !== id));

    return (
        <section id="planner" className="relative py-24 px-4">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <CalendarDays className="h-4 w-4" />
                        Periodization
                    </div>
                    <h2 className="text-4xl font-bold text-white">Phase Planner</h2>
                    <p className="mt-3 text-slate-400 max-w-xl mx-auto">Program your training phases with cutting, bulking, maintaining, and deload blocks with calorie targets.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="glass-card border-forge-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><CalendarDays className="h-5 w-5 text-forge-orange" />Training Phases</CardTitle>
                            <CardDescription className="text-slate-400">Build your periodized training program</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {phases.length > 0 ? (
                                <div className="mb-6 space-y-3">
                                    {phases.map((phase, i) => (
                                        <motion.div key={phase.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-forge-border p-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forge-orange/10 text-sm font-bold text-forge-orange">{i + 1}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-white text-sm">{phase.name}</span>
                                                    <Badge variant="outline" className={`text-xs ${phaseColors[phase.type] || ""}`}>{phase.type}</Badge>
                                                </div>
                                                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                                                    <span>{phase.weeks} weeks</span>
                                                    {phase.calories && <span>• {phase.calories} kcal/day</span>}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removePhase(phase.id)} className="shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-400/10"><X className="h-4 w-4" /></Button>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mb-6 rounded-xl border border-dashed border-forge-border p-8 text-center">
                                    <CalendarDays className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                                    <p className="text-sm text-slate-400">No training phases added yet.</p>
                                </div>
                            )}

                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger
                                    render={<Button className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 py-6 text-base" />}
                                >
                                    <Plus className="mr-2 h-5 w-5" />Add Training Phase
                                </DialogTrigger>
                                <DialogContent className="bg-forge-surface border-forge-border text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">New Training Phase</DialogTitle>
                                        <DialogDescription className="text-slate-400">Configure your training block</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Phase Name</Label>
                                            <Input placeholder="e.g. Summer Cut" value={newPhase.name} onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Phase Type</Label>
                                            <Select value={newPhase.type} onValueChange={(v) => setNewPhase({ ...newPhase, type: v ?? "" })}>
                                                <SelectTrigger className="bg-slate-900/50 border-forge-border text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                                                <SelectContent className="bg-forge-card border-forge-border">
                                                    <SelectItem value="cutting" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Cutting</SelectItem>
                                                    <SelectItem value="bulking" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Bulking</SelectItem>
                                                    <SelectItem value="maintaining" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Maintaining</SelectItem>
                                                    <SelectItem value="deload" className="text-slate-300 focus:bg-forge-orange/10 focus:text-white">Deload</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-4 grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Weeks</Label>
                                                <Input type="number" placeholder="e.g. 6" value={newPhase.weeks} onChange={(e) => setNewPhase({ ...newPhase, weeks: e.target.value })} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Calories/day</Label>
                                                <Input type="number" placeholder="e.g. 2200" value={newPhase.calories} onChange={(e) => setNewPhase({ ...newPhase, calories: e.target.value })} className="bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500" />
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={addPhase} className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0">Add Phase</Button>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
