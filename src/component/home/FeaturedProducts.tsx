"use client";

import Link from "next/link";
import ProductCard from "@/component/ProductCard";
import type { Product } from "@/lib/api";
import { motion } from "motion/react";

export default function FeaturedProducts({ products }: { products: Product[] }) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-end justify-between mb-10"
            >
                <div>
                    <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-1 uppercase tracking-wider">Hand-picked</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Products</h2>
                </div>
                <Link href="/shop?featured=true" className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1">
                    See all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </motion.div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center py-20 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10"
                >
                    <p className="text-slate-500 dark:text-slate-400">Start the backend server to see products.</p>
                    <code className="mt-2 block text-xs text-red-500 dark:text-red-400">cd gizmo-server &amp;&amp; npm run dev</code>
                </motion.div>
            )}
        </section>
    );
}
