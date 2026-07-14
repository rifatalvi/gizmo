"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setStatus("")
        
        // Simulate sending a message
        setTimeout(() => {
            setLoading(false)
            setStatus("success")
            e.currentTarget.reset()
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-red-500/5 dark:bg-red-600/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-rose-500/5 dark:bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        Have questions about a product, warranty, or order? Send us a message and our support team will reply within 24 hours.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Information */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-5 bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8"
                    >
                        <div>
                            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Reach out via email, phone, or stop by our office directly. We are happy to answer all inquiries.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: "Customer Support", value: "support@gizmo.com", sub: "For order updates, returns, and tech assistance." },
                                { title: "Business Inquiries", value: "info@gizmo.com", sub: "For vendor applications, media, and marketing partnerships." },
                                { title: "Call Us", value: "+1 (800) 555-GIZMO", sub: "Mon-Fri: 9 AM - 6 PM EST" },
                            ].map((info, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{info.title}</div>
                                    <div className="text-base font-bold text-red-500">{info.value}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{info.sub}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-7 bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <h2 className="text-xl font-bold mb-6">Send Message</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" required placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" required placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" required placeholder="How can we help?" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <textarea 
                                    id="message" 
                                    required 
                                    rows={4}
                                    placeholder="Type your message here..."
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 dark:border-white/10"
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Sending..." : "Send Message"}
                            </Button>

                            {status === "success" && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm text-center"
                                >
                                    Thank you! Your message has been sent successfully. We will respond soon.
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
