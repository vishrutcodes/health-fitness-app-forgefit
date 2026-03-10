"use client";

import { Flame } from "lucide-react";

const platformLinks = [
    { label: "Calculator", href: "#calculator" },
    { label: "Fitness Toolkit", href: "#toolkit" },
    { label: "Diet Architect", href: "#diet" },
    { label: "Macro Breakdown", href: "#macros" },
    { label: "Exercise Guide", href: "#exercise-guide" },
];

const quickLinks = [
    { label: "Workout Timer", href: "#timer" },
    { label: "Phase Planner", href: "#planner" },
    { label: "Career Roadmap", href: "#roadmap" },
    { label: "AI Form Analyzer", href: "#form-analyzer" },
    { label: "AI Coach", href: "#home" },
];

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <a href="#home" className="flex items-center gap-2 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-forge-orange to-forge-orange-light">
                                <Flame className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Forge<span className="text-forge-orange">Fit</span></span>
                        </a>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            ForgeFit: AI-powered personal training and nutrition coaching. Transform your fitness journey with data-driven insights.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-forge-orange-light">Platform</h3>
                        <ul className="space-y-2.5">
                            {platformLinks.map((link) => (
                                <li key={link.label}><a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">{link.label}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Start */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-forge-orange-light">Quick Start</h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.label}><a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">{link.label}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8 text-center">
                    <p className="text-sm text-slate-500">
                        © 2026 ForgeFit. Built for lifters. Powered by Groq AI.
                    </p>
                </div>
            </div>
        </footer>
    );
}
