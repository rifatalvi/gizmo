"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCart } from "@/components/CartContext";
import { Avatar } from "@heroui/react";
import {
    HiOutlineUser,
    HiOutlineClipboardList,
    HiOutlineCog,
    HiOutlineViewGrid,
    HiOutlineLogout,
    HiOutlineSearch,
    HiOutlineShoppingCart,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineMenu,
    HiOutlineX,
} from "react-icons/hi";

const NAV_LOGGED_OUT = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Deals", href: "/deals" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
];

const NAV_LOGGED_IN = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Deals", href: "/deals" },
    { label: "Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
    const { data: session, isPending } = useSession();
    const { items } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/shop?search=${encodeURIComponent(q)}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };

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
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${scrolled
                    ? "bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm"
                    : "bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md border-b border-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* ✅ Logo + Site Name (বড় করা হয়েছে) */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group hover:opacity-80 transition-opacity duration-300"
                        >
                            <img
                                src="/logo.png"
                                alt="Gizmo Logo"
                                className="h-11 w-auto object-contain" // h-9 → h-11 (বড়)
                            />
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Gizmo
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-500 rounded-full opacity-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 ease-out" />
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all hover:rotate-12"
                                >
                                    {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
                                </button>
                            )}

                            {/* Search */}
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className="hidden sm:flex items-center">
                                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                                        <input
                                            ref={searchInputRef}
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Search products…"
                                            autoFocus
                                            className="pl-4 pr-2 py-1.5 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none w-44"
                                        />
                                        <button type="submit" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <HiOutlineSearch className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                                            <HiOutlineX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700 rounded-full transition-colors"
                                >
                                    <HiOutlineSearch className="w-4 h-4" />
                                    <span className="hidden lg:inline text-xs font-medium">Search</span>
                                </button>
                            )}

                            {/* Cart */}
                            <Link href="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <HiOutlineShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Divider */}
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block mx-1" />

                            {/* Auth */}
                            {isPending ? (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                            ) : session ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-red-500/50 dark:hover:border-red-400/50 transition-colors"
                                    >
                                        <Avatar className="w-7 h-7 text-xs">
                                            {session.user.image && <Avatar.Image alt={session.user.name || "User"} src={session.user.image} />}
                                            <Avatar.Fallback className="bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold shadow-sm">
                                                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <span className="hidden sm:block text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[80px] truncate">
                                            {session.user.name?.split(" ")[0]}
                                        </span>
                                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session.user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                {[
                                                    ...(session.user.role === 'admin' ? [{ label: "Dashboard", href: "/dashboard/admin", icon: HiOutlineViewGrid }] : []),
                                                    { label: "My Profile", href: "/profile", icon: HiOutlineUser },
                                                    { label: "My Orders", href: "/orders", icon: HiOutlineClipboardList },
                                                    { label: "Settings", href: "/settings", icon: HiOutlineCog },
                                                ].map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                    >
                                                        <item.icon className="w-4 h-4 opacity-70" />
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <HiOutlineLogout className="w-4 h-4 opacity-70" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-3">
                                    <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 text-sm font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full transition-all active:scale-95 shadow-sm"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileOpen((v) => !v)}
                                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                aria-expanded={mobileOpen}
                            >
                                {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl ${mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                        } overflow-hidden`}
                >
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!session && !isPending && (
                            <div className="flex flex-col gap-3 pt-4 pb-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center py-3 text-sm font-semibold text-white dark:text-black bg-black dark:bg-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Log In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className="h-16" />
        </>
    );
}