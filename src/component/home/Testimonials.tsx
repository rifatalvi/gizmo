"use client";

import { motion } from "motion/react";

const TESTIMONIALS = [
    { name: "Sarah Mitchell", role: "Tech Enthusiast", avatar: "SM", rating: 5, text: "Gizmo has become my go-to for all tech purchases. The selection is incredible and delivery is always on time. Highly recommended!" },
    { name: "James Rodriguez", role: "Software Engineer", avatar: "JR", rating: 5, text: "Best prices I've found anywhere online. My new laptop arrived in perfect condition with great packaging. Will definitely order again." },
    { name: "Priya Sharma", role: "Content Creator", avatar: "PS", rating: 5, text: "The audio equipment here is top-notch. Got my studio headphones at a price I couldn't believe. Customer support was also very helpful." },
    { name: "Mike Thompson", role: "Gamer", avatar: "MT", rating: 5, text: "Amazing gaming gear collection! Got my setup completely kitted out from Gizmo. The deals section alone saved me hundreds of dollars." },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-2 uppercase tracking-wider">What people say</p>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Customer Reviews</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TESTIMONIALS.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:border-white/20 transition-all duration-300"
                    >
                        <Stars count={t.rating} />
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                            &ldquo;{t.text}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {t.avatar}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
