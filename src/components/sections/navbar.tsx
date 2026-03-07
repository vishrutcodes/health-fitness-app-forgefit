"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronDown, Menu, X, LogIn, LayoutDashboard, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Calculator", href: "#calculator" },
    { label: "Toolkit", href: "#toolkit" },
    { label: "Diet Plan", href: "#diet" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Progress", href: "/progress" },
    { label: "PRs", href: "/prs" },
];

const moreLinks = [
    { label: "Exercise Guide", href: "#exercise-guide" },
    { label: "Workout Timer", href: "#timer" },
    { label: "Phase Planner", href: "#planner" },
    { label: "Knowledge Base", href: "#knowledge" },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showFlash, setShowFlash] = useState(false);
    const [flashName, setFlashName] = useState("");

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);
            // Flash welcome toast on sign-in
            if (event === "SIGNED_IN" && newUser) {
                const name = newUser.user_metadata?.full_name || newUser.email?.split("@")[0] || "Athlete";
                setFlashName(name);
                setShowFlash(true);
                setTimeout(() => setShowFlash(false), 4000);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            {/* Login Flash Toast */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0, y: -60, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -60, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-2xl bg-linear-to-r from-forge-orange to-forge-orange-light px-6 py-3 shadow-2xl shadow-forge-orange/30"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Flame className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Welcome back, {flashName}! 🔥</p>
                            <p className="text-xs text-white/70">Ready to forge your best self</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 glass-nav"
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <a href="#home" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-forge-orange to-forge-orange-light shadow-lg shadow-forge-orange/20 transition-shadow group-hover:shadow-forge-orange/40">
                            <Flame className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Forge<span className="text-forge-orange">Fit</span>
                        </span>
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                {link.label}
                            </a>
                        ))}
                        {/* More Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setMoreOpen(!moreOpen)}
                                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                More
                                <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                            </button>
                            {moreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute right-0 top-full mt-2 w-48 rounded-xl glass-card p-2 shadow-xl"
                                >
                                    {moreLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            onClick={() => setMoreOpen(false)}
                                            className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-3 md:flex">
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/signin">
                                <Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold shadow-lg shadow-forge-orange/25 hover:shadow-forge-orange/40 transition-all border-0">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="text-slate-300 md:hidden"
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-white/5 px-4 pb-4 md:hidden"
                    >
                        {[...navLinks, ...moreLinks].map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
                            {user ? (
                                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                                    <Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold w-full">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                                    <Button className="bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold w-full">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.nav>
        </>
    );
}
