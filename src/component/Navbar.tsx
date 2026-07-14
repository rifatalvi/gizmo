"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useCart } from "@/components/CartContext";

const NAV_LOGGED_OUT = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Deals", href: "/deals" },
];

const NAV_LOGGED_IN = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Deals", href: "/deals" },
    { label: "Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
];

export default function Navbar() {
    const { data: session, isPending } = useSession();
    const { items } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const navLinks = session ? NAV_LOGGED_IN : NAV_LOGGED_OUT;

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setUserMenuOpen(false);
    };

    return (
        <>
            {/* ── Navbar ── */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${scrolled
                    ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm"
                    : "bg-slate-100 dark:bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-b border-transparent dark:border-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-2.5 group hover:opacity-80 transition-opacity duration-300">
                            <img src="/logo.png" alt="Gizmo Logo" className="h-9 w-auto object-contain" />
                        </Link>

                        {/* ── Desktop Nav Links ── */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white rounded-md transition-colors duration-300 group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-500 rounded-full opacity-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 ease-out" />
                                </Link>
                            ))}
                        </nav>

                        {/* ── Right Actions ── */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-300 hover:rotate-12"
                                    aria-label="Toggle theme"
                                >
                                    {theme === "dark" ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                        </svg>
                                    )}
                                </button>
                            )}

                            {/* Search */}
                            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 rounded-full transition-colors duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                </svg>
                                <span className="hidden lg:inline text-xs font-medium">Search</span>
                            </button>

                            {/* Cart */}
                            <Link href="/cart" className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors duration-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute 0 right-0 w-4 h-4 text-[10px] font-bold bg-red-500 text-slate-900 dark:text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950 transition-all duration-300">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                            {/* Divider */}
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1 transition-colors duration-300" />

                            {/* Auth Section */}
                            {isPending ? (
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            ) : session ? (
                                /* User Menu */
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500/50 dark:hover:border-red-400/50 transition-colors duration-300"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold shadow-sm">
                                            {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                                        </div>
                                        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[80px] truncate">
                                            {session.user.name?.split(" ")[0]}
                                        </span>
                                        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>

                                    {/* Dropdown */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{session.user.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session.user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                {[
                                                    { label: "My Profile", href: "/profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
                                                    { label: "My Orders", href: "/orders", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
                                                    { label: "Settings", href: "/settings", icon: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
                                                ].map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-300"
                                                    >
                                                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                            <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                                                >
                                                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Logged out: Login + Register */
                                <div className="hidden sm:flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white transition-colors duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full transition-all duration-300 active:scale-95 shadow-sm"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileOpen((v) => !v)}
                                className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors duration-300"
                                aria-expanded={mobileOpen}
                                aria-label="Toggle navigation menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    {mobileOpen
                                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile Drawer ── */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl ${mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                        } overflow-hidden`}
                >
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-300"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile auth buttons */}
                        {!session && !isPending && (
                            <div className="flex flex-col gap-3 pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 mt-2 transition-colors duration-300">
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center py-3 text-sm font-semibold text-slate-900 dark:text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl transition-colors duration-300 hover:bg-slate-800 dark:hover:bg-slate-200"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300"
                                >
                                    Log In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Spacer so content doesn't hide under fixed navbar */}
            <div className="h-16" />
        </>
    );
}