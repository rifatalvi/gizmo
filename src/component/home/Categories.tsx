import Link from "next/link";

const CATEGORIES = [
    { name: "Laptops", href: "/shop?category=laptops", icon: "M4 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h12V4H6z M8 18h8v2H8z M11 18v2h2v-2z", color: "from-blue-500/20 to-blue-600/5 border-blue-500/20 hover:border-blue-500/50", iconColor: "text-blue-400", count: "500+ items" },
    { name: "Phones", href: "/shop?category=phones", icon: "M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 18a1 1 0 110-2 1 1 0 010 2z", color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/50", iconColor: "text-emerald-400", count: "200+ items" },
    { name: "Audio", href: "/shop?category=audio", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3", color: "from-purple-500/20 to-purple-600/5 border-purple-500/20 hover:border-purple-500/50", iconColor: "text-purple-400", count: "150+ items" },
    { name: "Gaming", href: "/shop?category=gaming", icon: "M6 11l6-9 6 9M3.5 16a4.5 4.5 0 009 0M11.5 16a4.5 4.5 0 009 0M8 16h.01M16 16h.01", color: "from-rose-500/20 to-rose-600/5 border-rose-500/20 hover:border-rose-500/50", iconColor: "text-rose-400", count: "300+ items" },
    { name: "Monitors", href: "/shop?category=monitors", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/50", iconColor: "text-cyan-400", count: "80+ items" },
    { name: "Accessories", href: "/shop?category=accessories", icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z", color: "from-orange-500/20 to-orange-600/5 border-orange-500/20 hover:border-orange-500/50", iconColor: "text-orange-400", count: "400+ items" },
];

export default function Categories() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-sm font-semibold text-red-400 mb-1 uppercase tracking-wider">Browse by</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Categories</h2>
                </div>
                <Link href="/shop" className="text-sm text-slate-500 dark:text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                    View all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br ${cat.color} border transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                        <div className={`mb-3 ${cat.iconColor}`}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{cat.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5">{cat.count}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
