"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [countdown, setCountdown] = useState(8);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center shadow-2xl"
            >
                {/* Animated checkmark */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
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
                        Payment Successful! 🎉
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 mb-6">
                        Thank you for your order. Your payment has been confirmed and we're getting your items ready to ship.
                    </p>

                    {sessionId && (
                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 mb-6 border border-slate-200 dark:border-white/5">
                            <p className="text-xs text-slate-400 dark:text-gray-500 mb-1">Order Reference</p>
                            <p className="text-xs font-mono text-slate-600 dark:text-gray-300 truncate">{sessionId}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/orders"
                            className="w-full py-3 px-6 font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
                        >
                            View My Orders
                        </Link>
                        <Link
                            href="/shop"
                            className="w-full py-3 px-6 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
