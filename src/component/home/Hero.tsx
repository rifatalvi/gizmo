"use client";

import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";

const TYPING_WORDS = ["Delivered fast.", "At best prices.", "With top brands.", "All in one place."];

// Showcase slides for hero right panel
const SLIDES = [
    {
        label: "🔥 Hot Deal",
        name: "Sony WH-1000XM5",
        category: "Audio",
        price: "$279",
        originalPrice: "$399",
        discount: "30% OFF",
        rating: "4.9",
        reviews: "2.4k",
        color: "from-violet-500/20 to-purple-600/10",
        iconBg: "bg-violet-500",
        icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    },
    {
        label: "⭐ Top Rated",
        name: "MacBook Pro M4",
        category: "Laptops",
        price: "$1,799",
        originalPrice: "$1,999",
        discount: "10% OFF",
        rating: "5.0",
        reviews: "8.1k",
        color: "from-blue-500/20 to-cyan-600/10",
        iconBg: "bg-blue-500",
        icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
        label: "🆕 New Arrival",
        name: "Samsung Galaxy S25 Ultra",
        category: "Phones",
        price: "$1,199",
        originalPrice: "$1,299",
        discount: "8% OFF",
        rating: "4.8",
        reviews: "5.2k",
        color: "from-emerald-500/20 to-green-600/10",
        iconBg: "bg-emerald-500",
        icon: "M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 18a1 1 0 110-2 1 1 0 010 2z",
    },
    {
        label: "🎮 Best Seller",
        name: "ASUS ROG Zephyrus G16",
        category: "Gaming",
        price: "$2,199",
        originalPrice: "$2,599",
        discount: "15% OFF",
        rating: "4.9",
        reviews: "3.7k",
        color: "from-rose-500/20 to-red-600/10",
        iconBg: "bg-rose-500",
        icon: "M6 11l6-9 6 9M3.5 16a4.5 4.5 0 009 0M11.5 16a4.5 4.5 0 009 0M8 16h.01M16 16h.01",
    },
];

type Direction = "next" | "prev";

const variants = {
    enter: (dir: Direction) => ({
        x: dir === "next" ? 120 : -120,
        opacity: 0,
        scale: 0.9,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (dir: Direction) => ({
        x: dir === "next" ? -120 : 120,
        opacity: 0,
        scale: 0.9,
    }),
};

function HeroSlideshow() {
    const [idx, setIdx] = useState(0);
    const [dir, setDir] = useState<Direction>("next");

    useEffect(() => {
        const t = setInterval(() => {
            setDir("next");
            setIdx((i) => (i + 1) % SLIDES.length);
        }, 3200);
        return () => clearInterval(t);
    }, []);

    const goTo = (newIdx: number) => {
        setDir(newIdx > idx ? "next" : "prev");
        setIdx(newIdx);
    };

    const slide = SLIDES[idx];

    return (
        <div className="relative flex flex-col items-center gap-4 select-none">
            {/* Main animated card */}
            <div className="relative w-72 h-auto" style={{ minHeight: 260 }}>
                <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                        key={idx}
                        custom={dir}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                        className={`absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10 bg-gradient-to-br ${slide.color} bg-white dark:bg-white/5 backdrop-blur-sm p-5 shadow-xl`}
                    >
                        {/* Label badge */}
                        <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white mb-3">
                            {slide.label}
                        </span>

                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl ${slide.iconBg} flex items-center justify-center mb-4 shadow-lg`}>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={slide.icon} />
                            </svg>
                        </div>

                        {/* Product info */}
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{slide.category}</div>
                        <div className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-3">{slide.name}</div>

                        {/* Pricing */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{slide.price}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 line-through">{slide.originalPrice}</span>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-md">{slide.discount}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{slide.rating} ({slide.reviews} reviews)</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`transition-all duration-300 rounded-full ${i === idx ? "w-6 h-2 bg-red-500" : "w-2 h-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Trust badges floating below */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex gap-3 flex-wrap justify-center mt-1"
            >
                {[["✓ Free Shipping", ""], ["✓ 30-Day Returns", ""], ["✓ Secure Pay", ""]].map(([t]) => (
                    <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                        {t}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

function useTypewriter(words: string[], speed = 75, pause = 2000) {
    const [text, setText] = useState("");
    const [wordIdx, setWordIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = words[wordIdx];
        let timeout: ReturnType<typeof setTimeout>;
        if (!deleting && charIdx <= current.length) {
            timeout = setTimeout(() => { setText(current.slice(0, charIdx)); setCharIdx(c => c + 1); }, speed);
        } else if (!deleting && charIdx > current.length) {
            timeout = setTimeout(() => setDeleting(true), pause);
        } else if (deleting && charIdx >= 0) {
            timeout = setTimeout(() => { setText(current.slice(0, charIdx)); setCharIdx(c => c - 1); }, speed / 2);
        } else {
            setDeleting(false);
            setWordIdx(w => (w + 1) % words.length);
        }
        return () => clearTimeout(timeout);
    }, [charIdx, deleting, wordIdx, words, speed, pause]);

    return text;
}

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" } }),
};

export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
    const typedText = useTypewriter(TYPING_WORDS);

    return (
        <section ref={ref} className="relative overflow-hidden flex items-center" style={{ minHeight: "65vh" }}>
            {/* Parallax background */}
            <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-red-950/60 dark:via-[#0a0a0f] dark:to-rose-950/40" />
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-400/8 dark:bg-red-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-400/8 dark:bg-rose-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.2s" }} />
                <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl" />
            </motion.div>

            <motion.div
                style={{ opacity }}
                className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
            >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Text Content */}
                    <div>
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-semibold text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-full"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                            New Arrivals — Summer 2026
                        </motion.div>

                        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5"
                        >
                            Next-gen tech.{" "}
                            <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                                {typedText}
                                <span className="animate-pulse text-red-500">|</span>
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                            className="text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg"
                        >
                            Discover the latest laptops, phones, audio, and gaming gear from the world&apos;s top brands — all in one place, at the best prices.
                        </motion.p>

                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-wrap gap-3 mb-10">
                            <Link href="/shop" className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 active:scale-95">
                                Shop All Products
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="/deals" className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-slate-700 dark:text-white bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 hover:border-red-400 dark:hover:border-red-500/30 rounded-xl shadow-sm transition-all duration-200 active:scale-95">
                                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Today&apos;s Deals
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                            className="flex flex-wrap gap-8 pt-8 border-t border-slate-200 dark:border-white/5"
                        >
                            {[["10K+", "Products"], ["50K+", "Customers"], ["4.9★", "Rating"], ["99%", "Satisfaction"]].map(([num, label]) => (
                                <div key={label}>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{num}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — Animated Slideshow */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="hidden lg:flex justify-center items-center"
                    >
                        <HeroSlideshow />
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            >
                <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-widest uppercase">Scroll</span>
                <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    className="w-5 h-5 text-slate-400 dark:text-slate-500"
                >
                    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
