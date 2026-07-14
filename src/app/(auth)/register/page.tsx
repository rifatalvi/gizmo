"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthLabel = ["", "Weak", "Good", "Strong"];
    const strengthColor = ["", "bg-rose-500", "bg-amber-500", "bg-green-500"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signUp.email({ name, email, password });
            router.push("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md">
                <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                            <img src="/logo.png" alt="Gizmo Logo" className="h-16 w-auto" />
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
                        <p className="text-slate-500 dark:text-gray-500 text-sm mt-1">Join thousands of tech enthusiasts</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">Full Name</label>
                            <input
                                id="register-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">Email</label>
                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-3 pr-10 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500 hover:text-slate-600 dark:text-gray-300 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                            {/* Strength meter */}
                            {password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex gap-1 flex-1">
                                        {[1, 2, 3].map((s) => (
                                            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= strength ? strengthColor[strength] : "bg-slate-200 dark:bg-white/10"}`} />
                                        ))}
                                    </div>
                                    <span className={`text-[11px] font-medium ${strength === 1 ? "text-rose-400" : strength === 2 ? "text-amber-400" : "text-green-400"}`}>
                                        {strengthLabel[strength]}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            id="register-submit"
                            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account…
                                </span>
                            ) : "Create Free Account"}
                        </button>

                        <p className="text-center text-[11px] text-gray-600 mt-1">
                            By signing up, you agree to our{" "}
                            <Link href="#" className="text-red-400 hover:underline">Terms</Link> and{" "}
                            <Link href="#" className="text-red-400 hover:underline">Privacy Policy</Link>
                        </p>
                    </form>

                    <p className="text-center text-sm text-slate-500 dark:text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
