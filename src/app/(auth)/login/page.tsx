"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { motion } from "motion/react";

const DEMO_EMAIL = "demo@gizmo.com";
const DEMO_PASSWORD = "demo123456";

type FieldError = { email?: string; password?: string };

function validate(email: string, password: string): FieldError {
    const errs: FieldError = {};
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldError>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

    const handleBlur = (field: "email" | "password") => {
        setTouched(p => ({ ...p, [field]: true }));
        setFieldErrors(validate(email, password));
    };

    const handleDemoLogin = () => {
        setEmail(DEMO_EMAIL);
        setPassword(DEMO_PASSWORD);
        setFieldErrors({});
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        const errs = validate(email, password);
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setError("");
        setLoading(true);
        try {
            const result = await signIn.email({ email, password });
            if (result.error) {
                setError(result.error.message || "Invalid email or password. Please try again.");
            } else {
                const role = result.data?.user?.role;
                if (role === "admin") {
                    router.push("/dashboard/admin");
                } else {
                    router.push("/dashboard/user");
                }
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const result = await signIn.social({ provider: "google", callbackURL: "/" });
            if (result.error) {
                setError(result.error.message || "Google sign-in failed. Please try again.");
            }
        } catch {
            setError("Google sign-in failed. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 dark:bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-500/5 dark:bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/8 rounded-3xl p-8 shadow-2xl shadow-slate-200/80 dark:shadow-black/60">

                    {/* Logo + Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center justify-center mb-5">
                            <img src="/logo.png" alt="Gizmo" className="h-14 w-auto" />
                        </Link>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your Gizmo account</p>
                    </div>

                    {/* Demo Login Banner */}
                    <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-400">Try Admin Demo</h3>
                                <p className="text-xs text-blue-700 dark:text-blue-500 mt-0.5">Auto-fill credentials to explore</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                            >
                                Fill Demo
                            </button>
                        </div>
                    </div>
                    {/* Google */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 rounded-2xl text-sm font-semibold text-slate-700 dark:text-white transition-all shadow-sm disabled:opacity-60"
                    >
                        {googleLoading ? (
                            <svg className="animate-spin w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        Continue with Google
                    </motion.button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-white/8" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white dark:bg-[#111118] px-3 text-slate-400">or sign in with email</span>
                        </div>
                    </div>

                    {/* Global error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); if (touched.email) setFieldErrors(validate(e.target.value, password)); }}
                                onBlur={() => handleBlur("email")}
                                placeholder="you@example.com"
                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all ${touched.email && fieldErrors.email
                                    ? "border-red-400 dark:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                                    : "border-slate-200 dark:border-white/10 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15"
                                    }`}
                            />
                            {touched.email && fieldErrors.email && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="login-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <Link href="#" className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); if (touched.password) setFieldErrors(validate(email, e.target.value)); }}
                                    onBlur={() => handleBlur("password")}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 pr-11 bg-slate-50 dark:bg-white/5 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all ${touched.password && fieldErrors.password
                                        ? "border-red-400 dark:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                                        : "border-slate-200 dark:border-white/10 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15"
                                        }`}
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        {showPass
                                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                        }
                                    </svg>
                                </button>
                            </div>
                            {touched.password && fieldErrors.password && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            id="login-submit"
                            disabled={loading}
                            className="w-full py-3.5 mt-2 font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-2xl shadow-lg shadow-red-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in…
                                </span>
                            ) : "Sign In"}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-semibold transition-colors">
                            Create one free →
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
