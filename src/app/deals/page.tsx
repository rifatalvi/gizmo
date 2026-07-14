"use client";

import { useState, useEffect } from "react";
import { productsApi, type Product } from "@/lib/api";
import ProductCard from "@/component/ProductCard";
import Footer from "@/component/Footer";

function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, targetDate.getTime() - Date.now());
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft({ h, m, s });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return timeLeft;
}

export default function DealsPage() {
    const [deals, setDeals] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Countdown: ends at midnight
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeLeft = useCountdown(midnight);

    useEffect(() => {
        productsApi.deals().then(d => setDeals(d.products)).catch(() => setDeals([])).finally(() => setLoading(false));
    }, []);

    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/60 via-[#0a0a0f] to-orange-950/40 border-b border-rose-500/10">
                <div className="absolute top-0 left-1/3 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Flash Sale — Ends Today</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">🔥 Hot Deals</h1>
                            <p className="text-slate-500 dark:text-gray-400">Massive discounts on premium tech. Don&apos;t miss out.</p>
                        </div>

                        {/* Countdown */}
                        <div className="flex items-center gap-3">
                            {[["Hours", timeLeft.h], ["Minutes", timeLeft.m], ["Seconds", timeLeft.s]].map(([label, val]) => (
                                <div key={label as string} className="flex flex-col items-center">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-rose-500/20 text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                                        {pad(val as number)}
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-gray-500 mt-1 uppercase tracking-wider">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-slate-100 dark:bg-white/5" />
                                <div className="p-4 space-y-3">
                                    <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/3" />
                                    <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-full" />
                                    <div className="h-8 bg-slate-100 dark:bg-white/5 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : deals.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-4xl mb-4">🏷️</p>
                        <p className="text-slate-900 dark:text-white font-semibold text-lg mb-1">No deals right now</p>
                        <p className="text-slate-500 dark:text-gray-500 text-sm">Check back soon for flash sales!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {deals.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
