"use client";

import { motion } from "motion/react";

export default function Newsletter() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative rounded-3xl bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 border border-red-200 dark:border-red-500/20 p-10 md:p-16 overflow-hidden text-center"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-400/10 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Stay in the loop</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        Get exclusive deals, early access to new products, and tech news delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 focus:border-red-500 dark:focus:border-red-500/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-red-500/20 transition-all shadow-sm"
                        />
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            className="px-6 py-3 font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200 whitespace-nowrap"
                        >
                            Subscribe Free
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
