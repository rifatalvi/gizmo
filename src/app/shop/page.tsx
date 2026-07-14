"use client";

import { useState, useEffect, useCallback } from "react";
import { productsApi, type Product } from "@/lib/api";
import ProductCard from "@/component/ProductCard";
import Footer from "@/component/Footer";

const CATEGORIES = ["all", "laptops", "phones", "audio", "gaming", "monitors", "accessories"];

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page), limit: "12" };
            if (category !== "all") params.category = category;
            if (search) params.search = search;
            const data = await productsApi.list(params);
            setProducts(data.products);
            setTotalPages(data.pages);
            setTotal(data.total);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [category, search, page]);

    useEffect(() => {
        const id = setTimeout(fetchProducts, 300);
        return () => clearTimeout(id);
    }, [fetchProducts]);

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0d0d18] to-[#0a0a0f] border-b border-slate-200 dark:border-white/5 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Shop</h1>
                    <p className="text-slate-500 dark:text-gray-500 text-sm">{total.toLocaleString()} products available</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search products, brands…"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-red-500/40 rounded-xl text-sm text-slate-900 dark:text-white placeholder-gray-500 outline-none transition-all"
                        />
                    </div>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                                    category === cat
                                        ? "bg-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-500/20"
                                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:bg-white/10 hover:text-slate-900 dark:text-white border border-slate-200 dark:border-white/5"
                                }`}
                            >
                                {cat === "all" ? "All" : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex flex-col h-full bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-52 flex-shrink-0 bg-slate-100 dark:bg-white/5" />
                                <div className="flex flex-col flex-1 p-5">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-16" />
                                        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-20" />
                                    </div>
                                    <div className="h-5 bg-slate-100 dark:bg-white/5 rounded w-3/4 mb-3" />
                                    <div className="space-y-2 mb-5 flex-1">
                                        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-full" />
                                        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-4/5" />
                                    </div>
                                    <div className="mt-auto">
                                        <div className="h-6 bg-slate-100 dark:bg-white/5 rounded w-24 mb-4" />
                                        <div className="flex gap-2">
                                            <div className="h-10 flex-1 bg-slate-100 dark:bg-white/5 rounded-xl" />
                                            <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-slate-900 dark:text-white font-semibold text-lg mb-1">No products found</p>
                        <p className="text-slate-500 dark:text-gray-500 text-sm">Try a different search or category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            ← Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 text-sm font-medium rounded-lg transition-all ${p === page ? "bg-red-600 text-slate-900 dark:text-white" : "text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10"}`}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Next →
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
