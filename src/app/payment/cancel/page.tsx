"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center shadow-2xl"
            >
                {/* Animated X icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30"
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Payment Cancelled
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 mb-8">
                        No worries — your payment was cancelled and you have not been charged. You can go back and try again anytime.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/shop"
                            className="w-full py-3 px-6 font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
                        >
                            Back to Shop
                        </Link>
                        <Link
                            href="/"
                            className="w-full py-3 px-6 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95"
                        >
                            Go to Home
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
