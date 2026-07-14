"use client";

import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";

const TYPING_WORDS = ["Delivered fast.", "At best prices.", "With top brands.", "All in one place."];

const SLIDES = [
    {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
        alt: "MacBook Pro on a desk",
    },
    {
        src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
        alt: "Sony headphones",
    },
    {
        src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
        alt: "Modern smartphone",
    },
    {
        src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
        alt: "Gaming laptop",
    },
];

type Direction = "next" | "prev";

const variants = {
    enter: (dir: Direction) => ({
        x: dir === "next" ? 160 : -160,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (dir: Direction) => ({
        x: dir === "next" ? -160 : 160,
        opacity: 0,
        scale: 0.95,
    }),
};

function HeroSlideshow() {
    const [idx, setIdx] = useState(0);
    const [dir, setDir] = useState<Direction>("next");

    useEffect(() => {
        const t = setInterval(() => {
            setDir("next");
            setIdx((i) => (i + 1) % SLIDES.length);
        }, 3500);
        return () => clearInterval(t);
    }, []);

    const goTo = (newIdx: number) => {
        setDir(newIdx > idx ? "next" : "prev");
        setIdx(newIdx);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {/* Image container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 ring-1 ring-slate-200 dark:ring-white/10">
                <AnimatePresence mode="wait" custom={dir}>
                    <motion.img
                        key={idx}
                        src={SLIDES[idx].src}
                        alt={SLIDES[idx].alt}
                        custom={dir}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                    />
                </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`transition-all duration-300 rounded-full ${
                            i === idx
                                ? "w-6 h-2 bg-red-500"
                                : "w-2 h-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
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
