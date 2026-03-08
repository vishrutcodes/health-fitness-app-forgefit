"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";

export default function AuthPage() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const supabase = createClient();

        if (mode === "signup") {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } },
            });
            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
            // Auto sign-in after signup
            const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
            if (signInErr) {
                setError(signInErr.message);
                setLoading(false);
                return;
            }
            window.location.href = "/";
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
            window.location.href = "/";
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-forge-orange/5 blur-[150px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-forge-orange/3 blur-[100px]" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-forge-orange to-forge-orange-light">
                            <Flame className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">ForgeFit</span>
                    </Link>
                </div>

                <Card className="glass-card border-forge-border backdrop-blur-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold text-white">
                            {mode === "signin" ? "Welcome Back" : "Create Account"}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {mode === "signin" ? "Sign in to continue forging your physique" : "Start your fitness transformation today"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Mode Toggle */}
                        <div className="flex rounded-lg bg-slate-900/50 p-1 mb-6">
                            <button
                                onClick={() => { setMode("signin"); setError(""); }}
                                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${mode === "signin" ? "bg-forge-orange text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMode("signup"); setError(""); }}
                                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${mode === "signup" ? "bg-forge-orange text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name field — only for signup */}
                            {mode === "signup" && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-300 text-sm">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                        <Input id="name" type="text" placeholder="Rajit Gupta" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange h-11" />
                                    </div>
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange h-11" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <Input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 focus:border-forge-orange h-11" />
                                </div>
                            </div>

                            {error && (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</motion.p>
                            )}

                            <Button type="submit" disabled={loading} className="w-full h-11 bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0 text-base">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span>{mode === "signin" ? "Sign In" : "Create Account"}</span><ArrowRight className="ml-2 h-4 w-4" /></>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-600 mt-6">
                    {mode === "signin" ? "By signing in, you agree to start forging a better you 🔥" : "By creating an account, you agree to forge a better version of yourself 🔥"}
                </p>
            </motion.div>
        </div>
    );
}
