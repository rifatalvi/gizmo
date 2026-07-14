import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-slate-50 to-rose-50 dark:from-red-950/50 dark:via-[#0a0a0f] dark:to-rose-950/30" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/20 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        New Arrivals — Summer 2026
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                        Next-gen tech.{" "}
                        <span className="bg-gradient-to-r from-red-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                            Delivered fast.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
                        Discover the latest laptops, phones, audio, and gaming gear from the world&apos;s top brands — all in one place, at the best prices.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 active:scale-95"
                        >
                            Shop All Products
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            href="/deals"
                            className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-200 active:scale-95"
                        >
                            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Today&apos;s Deals
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
                        {[["10K+", "Products"], ["50K+", "Happy Customers"], ["4.9★", "Average Rating"]].map(([num, label]) => (
                            <div key={label}>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{num}</div>
                                <div className="text-sm text-slate-500 dark:text-gray-500">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
