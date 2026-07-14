import Link from "next/link";

const LINKS = {
    shop: [
        { label: "All Products", href: "/shop" },
        { label: "Laptops", href: "/shop?category=laptops" },
        { label: "Phones", href: "/shop?category=phones" },
        { label: "Audio", href: "/shop?category=audio" },
        { label: "Gaming", href: "/shop?category=gaming" },
        { label: "Accessories", href: "/shop?category=accessories" },
    ],
    account: [
        { label: "My Orders", href: "/orders" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Cart", href: "/cart" },
        { label: "Profile", href: "/profile" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-slate-100 dark:bg-[#080810] border-t border-slate-200 dark:border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <img src="/logo.png" alt="Gizmo Logo" className="h-12 w-auto" />
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-gray-500 leading-relaxed max-w-xs">
                            Your one-stop destination for the latest and greatest in tech. Premium gadgets, unbeatable prices.
                        </p>
                        {/* Socials */}
                        <div className="flex gap-3 mt-5">
                            {[
                                { icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z", label: "Twitter" },
                                { icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z", label: "LinkedIn" },
                                { icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22", label: "GitHub" },
                            ].map((s) => (
                                <button key={s.label} aria-label={s.label} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-500 dark:text-gray-500 transition-all duration-200">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Shop</h4>
                        <ul className="space-y-2.5">
                            {LINKS.shop.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-sm text-slate-500 dark:text-gray-500 hover:text-red-400 transition-colors duration-150">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Account</h4>
                        <ul className="space-y-2.5">
                            {LINKS.account.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-sm text-slate-500 dark:text-gray-500 hover:text-red-400 transition-colors duration-150">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            {LINKS.company.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-sm text-slate-500 dark:text-gray-500 hover:text-red-400 transition-colors duration-150">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">© {new Date().getFullYear()} Gizmo. All rights reserved.</p>
                    <div className="flex gap-5">
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
                            <Link key={t} href="#" className="text-xs text-gray-600 hover:text-slate-500 dark:text-gray-400 transition-colors">{t}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
