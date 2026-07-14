"use client";

import Link from "next/link";
import { motion } from "motion/react";

const CATEGORIES = [
    { name: "Laptops", href: "/shop?category=laptops", icon: "M4 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h12V4H6z M8 18h8v2H8z M11 18v2h2v-2z", lightColor: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100", darkColor: "dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-blue-600/5 dark:border-blue-500/20 dark:hover:border-blue-500/50", iconColor: "text-blue-500 dark:text-blue-400", count: "500+ items" },
    { name: "Phones", href: "/shop?category=phones", icon: "M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 18a1 1 0 110-2 1 1 0 010 2z", lightColor: "bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100", darkColor: "dark:bg-gradient-to-br dark:from-emerald-500/10 dark:to-emerald-600/5 dark:border-emerald-500/20 dark:hover:border-emerald-500/50", iconColor: "text-emerald-500 dark:text-emerald-400", count: "200+ items" },
    { name: "Audio", href: "/shop?category=audio", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3", lightColor: "bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100", darkColor: "dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-purple-600/5 dark:border-purple-500/20 dark:hover:border-purple-500/50", iconColor: "text-purple-500 dark:text-purple-400", count: "150+ items" },
    { name: "Gaming", href: "/shop?category=gaming", icon: "M6 11l6-9 6 9M3.5 16a4.5 4.5 0 009 0M11.5 16a4.5 4.5 0 009 0M8 16h.01M16 16h.01", lightColor: "bg-rose-50 border-rose-200 hover:border-rose-400 hover:bg-rose-100", darkColor: "dark:bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 dark:border-rose-500/20 dark:hover:border-rose-500/50", iconColor: "text-rose-500 dark:text-rose-400", count: "300+ items" },
    { name: "Monitors", href: "/shop?category=monitors", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", lightColor: "bg-cyan-50 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-100", darkColor: "dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-cyan-600/5 dark:border-cyan-500/20 dark:hover:border-cyan-500/50", iconColor: "text-cyan-500 dark:text-cyan-400", count: "80+ items" },
    { name: "Accessories", href: "/shop?category=accessories", icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z", lightColor: "bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100", darkColor: "dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-orange-600/5 dark:border-orange-500/20 dark:hover:border-orange-500/50", iconColor: "text-orange-500 dark:text-orange-400", count: "400+ items" },
];

export default function Categories() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-end justify-between mb-10"
            >
                <div>
                    <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-1 uppercase tracking-wider">Browse by</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Categories</h2>
                </div>
                <Link href="/shop" className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1">
                    View all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {CATEGORIES.map((cat, i) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                        <Link
                            href={cat.href}
                            className={`group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${cat.lightColor} ${cat.darkColor}`}
                        >
                            <div className={`mb-3 ${cat.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-white">{cat.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{cat.count}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
