"use client"

import { motion } from "motion/react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/5 dark:bg-red-600/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-rose-500/5 dark:bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 mb-4"
                    >
                        About Gizmo
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        Our mission is to bring the latest technology innovations right to your doorstep, with premium quality and unmatched prices.
                    </motion.p>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {/* Story Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Founded in 2026, Gizmo started with a simple belief: high-quality technology shouldn&apos;t be a luxury. We began as a small team of tech enthusiasts curation laptops, smartphones, and accessories. Today, we serves thousands of tech lovers worldwide.
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We partner directly with leading manufacturers to bypass unnecessary retail markups, passing the savings directly on to you. We verify every product to meet our rigorous standards of performance and design.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { value: "10K+", label: "Happy Customers" },
                            { value: "500+", label: "Premium Products" },
                            { value: "24/7", label: "Dedicated Support" },
                        ].map((stat, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl p-6 text-center shadow-lg shadow-slate-100 dark:shadow-none"
                            >
                                <div className="text-3xl font-extrabold text-red-500 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Core Values */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <h2 className="text-2xl font-bold mb-6">Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Quality First", desc: "Every gadget in our store goes through hands-on testing by developers and gear experts." },
                                { title: "Customer Success", desc: "Our tech support team is always standing by to help solve setup problems, warranty claims, and returns." },
                                { title: "Innovation Focused", desc: "We are constantly scanning the horizon to bring the newest releases and hardware upgrades to you first." },
                                { title: "Eco-Friendly Tech", desc: "We support carbon neutral shipping initiatives and strive to partner with sustainable packaging brands." },
                            ].map((value, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                        {value.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
