"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const FAQS = [
    { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days. Orders over $99 qualify for free shipping. Express delivery (1–2 days) is available at checkout for an additional fee." },
    { q: "What is your return policy?", a: "We offer a hassle-free 30-day return policy on all products. Items must be in original condition and packaging. Simply initiate a return from your Orders page and we'll arrange a pickup." },
    { q: "Are the products covered by warranty?", a: "Yes! All products come with the manufacturer's original warranty. We also offer extended warranty plans for select products at an additional cost." },
    { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with a tracking number. You can also view real-time tracking from the Orders section in your account dashboard." },
    { q: "Do you offer bulk or business pricing?", a: "Absolutely! We have special pricing tiers for businesses and bulk orders. Contact our sales team at business@gizmo.com for a custom quote." },
    { q: "Which payment methods do you accept?", a: "We accept all major credit/debit cards, PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with 256-bit SSL encryption." },
];

function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/8 transition-colors duration-200"
            >
                <span className="text-sm font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-5 h-5 text-red-500 dark:text-red-400"
                >
                    <svg fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/3 border-t border-slate-200 dark:border-white/5 leading-relaxed">
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQ() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-2 uppercase tracking-wider">Got questions?</p>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked</h2>
            </motion.div>

            <div className="max-w-3xl mx-auto flex flex-col gap-3">
                {FAQS.map((faq, i) => (
                    <FAQItem key={faq.q} faq={faq} index={i} />
                ))}
            </div>
        </section>
    );
}
