export default function Newsletter() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 border border-red-500/20 p-10 md:p-16 overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
                <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Stay in the loop</h2>
                    <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Get exclusive deals, early access to new products, and tech news delivered to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                        />
                        <button type="button" className="px-6 py-3 font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200 active:scale-95 whitespace-nowrap">
                            Subscribe Free
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
