import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Order } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    shipped: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
};

export default async function AdminTransactionsPage() {


    const db = await getDb();
    // For Transactions, we want all orders (including pending)
    const transactions = await db.collection<Order>("orders")
        .find()
        .sort({ createdAt: -1 })
        .toArray();

    const totalRevenue = transactions
        .filter(t => ['processing', 'shipped', 'delivered'].includes(t.status))
        .reduce((sum, t) => sum + (t.total || 0), 0);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">All Transactions</h1>
            <p className="text-slate-500 mb-8">Total Revenue (Completed): <span className="font-bold text-green-600 dark:text-green-400">${totalRevenue.toFixed(2)}</span></p>
            
            <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Transaction ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Customer ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Stripe Session</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {transactions.map(tx => (
                                <tr key={String(tx._id)} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500">#{String(tx._id).slice(-8).toUpperCase()}</td>
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{tx.userId}</td>
                                    <td className="px-6 py-4 font-mono text-slate-400 text-xs">{(tx as any).stripeSessionId || 'N/A'}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                        ${tx.total?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_STYLES[tx.status]}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No transactions found.
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
