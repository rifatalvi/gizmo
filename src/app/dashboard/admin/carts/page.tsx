import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Cart {
    userId: string;
    items: {
        productId: string;
        name: string;
        price: number;
        image: string;
        quantity: number;
    }[];
    updatedAt: Date;
}

export default async function AdminCartsPage() {


    const db = await getDb();
    // Only fetch carts that have at least one item
    const carts = await db.collection<Cart>("carts")
        .find({ items: { $not: { $size: 0 } } })
        .sort({ updatedAt: -1 })
        .toArray();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Active Carts</h1>
            <p className="text-slate-500 mb-8">Users who currently have items in their shopping carts.</p>
            
            <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Customer ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Total Value</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Items</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {carts.map(cart => {
                                const cartTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                                
                                return (
                                <tr key={String(cart.userId)} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{cart.userId}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                        ${cartTotal.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs">{totalItems} units</span>
                                            <div className="flex -space-x-2">
                                                {cart.items.slice(0, 3).map((item, i) => (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img key={i} src={item.image} alt={item.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111118] object-cover bg-slate-100" title={`${item.name} (x${item.quantity})`} />
                                                ))}
                                                {cart.items.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111118] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        +{cart.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {new Date(cart.updatedAt).toLocaleString()}
                                    </td>
                                </tr>
                            )})}
                            {carts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No active carts found.
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
