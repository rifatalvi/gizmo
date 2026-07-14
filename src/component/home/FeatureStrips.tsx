const FEATURES = [
    { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", title: "Free Shipping", desc: "On orders over $99" },
    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Secure Payment", desc: "100% secure transactions" },
    { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "Easy Returns", desc: "30-day return policy" },
    { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "24/7 Support", desc: "Always here to help" },
];

export default function FeatureStrips() {
    return (
        <section className="border-y border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#0d0d15]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="flex items-center gap-3">
                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{f.title}</div>
                                <div className="text-xs text-slate-500 dark:text-gray-500">{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
