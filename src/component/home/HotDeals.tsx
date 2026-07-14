import Link from "next/link";
import ProductCard from "@/component/ProductCard";
import type { Product } from "@/lib/api";

export default function HotDeals({ products }: { products: Product[] }) {
    if (products.length === 0) return null;

    return (
        <section className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/80 dark:to-rose-950/80 border-y border-red-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                            <p className="text-sm font-semibold text-rose-400 uppercase tracking-wider">Limited Time</p>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">🔥 Hot Deals</h2>
                    </div>
                    <Link href="/deals" className="text-sm text-slate-500 dark:text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                        All deals
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
