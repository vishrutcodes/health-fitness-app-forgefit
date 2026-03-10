"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Send, X, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function AiCoachDialog() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hey! 💪 I'm your ForgeFit AI Coach. Ask me anything about workouts, nutrition, supplements, or your fitness goals!" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg: Message = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai/coach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
            });
            const data = await res.json();
            setMessages([...newMessages, { role: "assistant", content: data.message || data.error || "Something went wrong." }]);
        } catch {
            setMessages([...newMessages, { role: "assistant", content: "Network error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating trigger button */}
            <button
                id="ai-coach-trigger"
                onClick={() => setOpen(true)}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-14 items-center justify-center gap-2 rounded-full px-5 bg-linear-to-br from-forge-orange to-forge-orange-light text-white shadow-xl shadow-forge-orange/30 hover:shadow-forge-orange/50 transition-all hover:scale-105"
            >
                <Flame className="h-5 w-5" />
                <span className="font-semibold text-sm">AI Coach</span>
            </button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-[500px] max-h-[80vh] w-[calc(100vw-2rem)] sm:h-[520px] sm:w-[380px] sm:max-h-none flex-col rounded-2xl border border-forge-border bg-[#0c1118] shadow-2xl shadow-black/50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-forge-border bg-forge-surface px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-forge-orange to-forge-orange-light">
                                    <Flame className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">AI Coach</p>
                                    <p className="text-xs text-emerald-400">● Online</p>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === "assistant" ? "bg-forge-orange/20 text-forge-orange" : "bg-blue-500/20 text-blue-400"}`}>
                                        {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                    </div>
                                    <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm leading-relaxed ${msg.role === "assistant" ? "bg-slate-800/80 text-slate-200" : "bg-forge-orange/20 text-white"}`}>
                                        {msg.content.split("\n").map((line, j) => (
                                            <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forge-orange/20 text-forge-orange">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="rounded-xl bg-slate-800/80 px-3 py-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-forge-orange" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-forge-border bg-forge-surface p-3">
                            <form
                                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask your AI Coach..."
                                    className="flex-1 bg-slate-900/50 border-forge-border text-white placeholder:text-slate-500 text-sm"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    size="icon"
                                    className="bg-forge-orange hover:bg-forge-orange-dark text-white shrink-0 border-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
