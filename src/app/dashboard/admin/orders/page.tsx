import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Order } from "@/lib/api";
import { OrderStatusSelect } from "./OrderStatusSelect";

export default async function AdminOrdersPage() {


    const db = await getDb();
    // Fetch all orders so admin can update their status
    const orders = await db.collection<Order>("orders")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">All Orders</h1>
            
            <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Order ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Customer ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Items</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Total</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {orders.map(order => (
                                <tr key={String(order._id)} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500">#{String(order._id).slice(-8).toUpperCase()}</td>
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{order.userId}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {order.items.slice(0, 3).map((item, i) => (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img key={i} src={item.image} alt={item.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111118] object-cover bg-slate-100" title={item.name} />
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111118] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <OrderStatusSelect orderId={String(order._id)} initialStatus={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
