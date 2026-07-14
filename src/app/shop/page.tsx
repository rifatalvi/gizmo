"use client";

import { useState, useEffect, useCallback } from "react";
import { productsApi, type Product } from "@/lib/api";
import ProductCard from "@/component/ProductCard";
import Footer from "@/component/Footer";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = ["all", "laptops", "phones", "audio", "gaming", "monitors", "accessories"];
const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Top Rated", value: "rating" },
];
const PRICE_RANGES = [
    { label: "All Prices", min: 0, max: 999999 },
    { label: "Under $100", min: 0, max: 100 },
    { label: "$100 – $500", min: 100, max: 500 },
    { label: "$500 – $1000", min: 500, max: 1000 },
    { label: "$1000 – $2000", min: 1000, max: 2000 },
    { label: "Over $2000", min: 2000, max: 999999 },
];
const RATING_OPTIONS = [
    { label: "All Ratings", value: 0 },
    { label: "4★ & above", value: 4 },
    { label: "4.5★ & above", value: 4.5 },
];

const ITEMS_PER_PAGE = 8;

function SkeletonCard() {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden animate-pulse">
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
    );
}

function PaginationBar({
    page,
    totalPages,
    total,
    onPage,
}: {
    page: number;
    totalPages: number;
    total: number;
    onPage: (p: number) => void;
}) {
    const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(page * ITEMS_PER_PAGE, total);

    const getPages = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];
        if (totalPages <= 1) return [];
        pages.push(1);
        if (page > 3) pages.push("ellipsis");
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (page < totalPages - 2) pages.push("ellipsis");
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-700 dark:text-white">{startItem}–{endItem}</span> of <span className="font-semibold text-slate-700 dark:text-white">{total}</span> results
            </p>

            <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-red-400 dark:hover:border-red-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                {/* Pages */}
                <div className="flex items-center gap-1">
                    {getPages().map((p, i) =>
                        p === "ellipsis" ? (
                            <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400">…</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPage(p as number)}
                                className={`w-9 h-9 text-sm font-semibold rounded-xl transition-all ${
                                    p === page
                                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25"
                                        : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-red-400 dark:hover:border-red-500/40"
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-red-400 dark:hover:border-red-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Reset page on any filter change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, category, priceRange, minRating, sortBy]);

    // Fetch from MongoDB API — all filtering/sorting/pagination done server-side
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {
                page: String(page),
                limit: String(ITEMS_PER_PAGE),
                sort: sortBy,
                priceMin: String(priceRange.min),
                priceMax: String(priceRange.max),
            };
            if (debouncedSearch) params.search = debouncedSearch;
            if (category !== "all") params.category = category;
            if (minRating > 0) params.minRating = String(minRating);

            const data = await productsApi.list(params);
            setProducts(data.products);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch {
            setProducts([]);
            setTotal(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, category, priceRange, minRating, sortBy]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const activeFilterCount = [
        category !== "all",
        priceRange !== PRICE_RANGES[0],
        minRating !== 0,
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
            {/* Header */}
            <div className="bg-white dark:bg-[#0d0d18] border-b border-slate-200 dark:border-white/5 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Shop</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {loading ? "Loading…" : `${total.toLocaleString()} product${total !== 1 ? "s" : ""} found`}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search + Sort + Filter toggle */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    {/* Search */}
                    <div className="relative flex-1">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search products, brands…"
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-red-500/40 dark:focus:border-red-500/40 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all shadow-sm"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white outline-none focus:border-red-500/40 transition-all shadow-sm"
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setFiltersOpen(v => !v)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shadow-sm ${
                            filtersOpen || activeFilterCount > 0
                                ? "bg-red-600 text-white border-transparent shadow-red-500/20"
                                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:border-red-400"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
                        </svg>
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 w-5 h-5 bg-white text-red-600 rounded-full text-xs flex items-center justify-center font-bold">{activeFilterCount}</span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {filtersOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 grid sm:grid-cols-3 gap-5 shadow-sm">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                                                    category === cat
                                                        ? "bg-red-600 text-white shadow-sm"
                                                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                                                }`}
                                            >
                                                {cat === "all" ? "All" : cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Price Range</label>
                                    <div className="flex flex-col gap-2">
                                        {PRICE_RANGES.map(r => (
                                            <button
                                                key={r.label}
                                                onClick={() => setPriceRange(r)}
                                                className={`text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                    priceRange.label === r.label
                                                        ? "bg-red-600 text-white"
                                                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                                                }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Min Rating</label>
                                    <div className="flex flex-col gap-2">
                                        {RATING_OPTIONS.map(r => (
                                            <button
                                                key={r.label}
                                                onClick={() => setMinRating(r.value)}
                                                className={`text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                    minRating === r.value
                                                        ? "bg-red-600 text-white"
                                                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                                                }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Reset all */}
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={() => {
                                                setCategory("all");
                                                setPriceRange(PRICE_RANGES[0]);
                                                setMinRating(0);
                                            }}
                                            className="mt-4 text-xs text-red-500 hover:underline font-semibold"
                                        >
                                            Reset all filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category quick tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 text-sm font-semibold rounded-xl capitalize transition-all ${
                                category === cat
                                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20"
                                    : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-red-400 dark:hover:border-red-500/30"
                            }`}
                        >
                            {cat === "all" ? "All" : cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-slate-900 dark:text-white font-semibold text-lg mb-1">No products found</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearch(""); setCategory("all"); setPriceRange(PRICE_RANGES[0]); setMinRating(0); }}
                            className="text-red-500 font-semibold text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        key={`${page}-${category}-${sortBy}-${debouncedSearch}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {!loading && (
                    <PaginationBar
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        onPage={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    />
                )}
            </div>

            <Footer />
        </div>
    );
}
