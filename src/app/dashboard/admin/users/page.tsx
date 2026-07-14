import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {


    const db = await getDb();
    const users = await db.collection("user").find().sort({ createdAt: -1 }).toArray();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Manage Users</h1>
            
            <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Role</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {users.map(user => (
                                <tr key={String(user._id)} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                                                {user.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            {user.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No users found.
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
