"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ordersApi, type Order } from "@/lib/api";
import Footer from "@/component/Footer";

const STATUS_STYLES: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    processing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    delivered: "text-green-400 bg-green-400/10 border-green-400/20",
    cancelled: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const STATUS_ICONS: Record<string, string> = {
    pending: "⏳", processing: "⚙️", shipped: "📦", delivered: "✅", cancelled: "❌",
};

export default function OrdersPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user.id) { setLoading(false); return; }
        ordersApi.list(session.user.id).then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
    }, [session]);

    if (!session) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
            <p className="text-4xl">📦</p>
            <p className="text-slate-900 dark:text-white text-xl font-semibold">Sign in to view your orders</p>
            <Link href="/login" className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-semibold rounded-xl transition-all">Sign In</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Orders</h1>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 rounded-2xl" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-5xl mb-4">📦</p>
                        <p className="text-slate-900 dark:text-white font-semibold text-xl mb-2">No orders yet</p>
                        <p className="text-slate-500 dark:text-gray-500 mb-6">Your orders will appear here after you checkout.</p>
                        <Link href="/shop" className="px-8 py-3 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-semibold rounded-xl transition-all">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-gray-500 mb-1">Order ID</p>
                                        <p className="text-sm font-mono text-slate-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-gray-500 mb-1">Date</p>
                                        <p className="text-sm text-slate-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-gray-500 mb-1">Total</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${STATUS_STYLES[order.status] ?? ""}`}>
                                        {STATUS_ICONS[order.status]} {order.status}
                                    </span>
                                </div>

                                {/* Items preview */}
                                <div className="flex flex-wrap gap-3">
                                    {order.items.slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover" />
                                            <span className="text-xs text-slate-600 dark:text-gray-300 max-w-[120px] truncate">{item.name}</span>
                                            <span className="text-xs text-slate-500 dark:text-gray-500">×{item.quantity}</span>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <span className="text-xs text-slate-500 dark:text-gray-500 self-center">+{order.items.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
