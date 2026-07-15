"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import Footer from "@/component/Footer";
import { useWishlist } from "@/components/WishlistContext";

export default function WishlistPage() {
    const { data: session } = useSession();
    const { wishlist, toggleWishlist } = useWishlist();

    if (!session) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
            <p className="text-4xl">❤️</p>
            <p className="text-slate-900 dark:text-white text-xl font-semibold">Sign in to view your wishlist</p>
            <Link href="/login" className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-semibold rounded-xl transition-all">Sign In</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Wishlist</h1>
                    <span className="text-sm text-slate-500 dark:text-gray-500">{wishlist.length} items</span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/10 flex items-center justify-center">
                            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-900 dark:text-white font-semibold text-xl mb-2">Your wishlist is empty</p>
                        <p className="text-slate-500 dark:text-gray-500 mb-6">Click the ❤️ on any product to save it here.</p>
                        <Link href="/shop" className="px-8 py-3 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-semibold rounded-xl transition-all">Browse Shop</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((item, index) => (
                            <div key={item.productId || (item as any).id || index} className="relative bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden group">
                                <button
                                    onClick={() => toggleWishlist({ _id: item.productId || (item as any).id, name: item.name, price: item.price, image: item.image } as any)}
                                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm hover:bg-white dark:hover:bg-black/60 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 text-rose-500 fill-rose-500" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                                <Link href={`/shop/${item.productId || (item as any).id}`} className="block">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                                </Link>
                                <div className="p-4">
                                    <Link href={`/shop/${item.productId || (item as any).id}`}>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2 hover:text-red-500 transition-colors">{item.name}</p>
                                    </Link>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">${item.price.toLocaleString()}</p>
                                    <Link href={`/shop/${item.productId || (item as any).id}`} className="mt-3 flex items-center justify-center w-full py-2 text-sm font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-all">View Product</Link>
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
