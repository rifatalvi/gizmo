"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/component/Footer";
import { useEffect } from "react";

export default function ProfilePage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [isPending, session, router]);

    if (isPending) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 text-red-500">
                    <svg fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex flex-col">
            <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Profile</h1>

                <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-8 shadow-xl">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex flex-shrink-0 items-center justify-center text-4xl font-bold text-slate-900 dark:text-white shadow-lg shadow-red-500/30">
                        {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-gray-500 mb-1">Full Name</p>
                            <p className="text-xl font-semibold text-slate-900 dark:text-white">{session.user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-gray-500 mb-1">Email Address</p>
                            <p className="text-lg text-slate-900 dark:text-white">{session.user.email}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Link href="/orders" className="w-full md:w-auto px-6 py-2.5 text-center text-sm font-semibold text-slate-900 dark:text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all">
                            View Orders
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="w-full md:w-auto px-6 py-2.5 text-center text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Additional Sections */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Methods</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Manage your saved credit cards and payment preferences.</p>
                        <button className="text-sm font-semibold text-red-400 hover:text-red-300">Manage Payments →</button>
                    </div>

                    <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Shipping Addresses</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Add, edit, or remove your shipping addresses.</p>
                        <button className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">Manage Addresses →</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
