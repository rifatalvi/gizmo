"use client";

import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

const STATS = [
    { value: 10000, label: "Products Available", suffix: "+" },
    { value: 50000, label: "Happy Customers", suffix: "+" },
    { value: 99, label: "Satisfaction Rate", suffix: "%" },
    { value: 150, label: "Brands Partnered", suffix: "+" },
];

function useCountUp(target: number, duration = 2000, started = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!started) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration, started]);
    return count;
}

function StatCard({ stat }: { stat: typeof STATS[0] }) {
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);
    const count = useCountUp(stat.value, 2000, started);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
        >
            <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                {count.toLocaleString()}
                <span className="text-red-500">{stat.suffix}</span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
        </motion.div>
    );
}

export default function Statistics() {
    return (
        <section className="bg-slate-50 dark:bg-[#0d0d15] border-y border-slate-200 dark:border-white/5 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-2 uppercase tracking-wider">By the numbers</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Trusted by thousands</h2>
                </motion.div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat) => (
                        <StatCard key={stat.label} stat={stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
