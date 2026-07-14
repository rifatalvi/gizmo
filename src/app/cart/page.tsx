"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { cartApi, checkoutApi, type Cart, type CartItem } from "@/lib/api";
import Footer from "@/component/Footer";

export default function CartPage() {
    const { data: session } = useSession();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        if (!session?.user.id) { setLoading(false); return; }
        cartApi.get(session.user.id).then(setCart).catch(() => setCart(null)).finally(() => setLoading(false));
    }, [session]);

    const updateQuantity = async (item: CartItem, qty: number) => {
        if (!session?.user.id) return;
        if (qty <= 0) return removeItem(item.productId);
        const updated = await cartApi.addItem(session.user.id, { ...item, quantity: qty });
        setCart(updated);
    };

    const removeItem = async (productId: string) => {
        if (!session?.user.id) return;
        const updated = await cartApi.removeItem(session.user.id, productId);
        setCart(updated);
    };

    const subtotal = cart?.items.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
    const shipping = subtotal > 99 ? 0 : 9.99;
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        if (!cart?.items.length) return;
        setCheckingOut(true);
        try {
            const session = await checkoutApi.createSession(cart.items);
            if (session.url) {
                window.location.href = session.url;
            }
        } catch (err) {
            console.error('Checkout failed:', err);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setCheckingOut(false);
        }
    };

    if (!session) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
            <p className="text-4xl">🛒</p>
            <p className="text-slate-900 dark:text-white text-xl font-semibold">Sign in to view your cart</p>
            <Link href="/login" className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-semibold rounded-xl transition-all">Sign In</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-white/5 rounded-xl" />)}
                    </div>
                ) : !cart?.items.length ? (
                    <div className="text-center py-24">
                        <p className="text-5xl mb-4">🛒</p>
                        <p className="text-slate-900 dark:text-white font-semibold text-xl mb-2">Your cart is empty</p>
                        <p className="text-slate-500 dark:text-gray-500 mb-6">Add some awesome tech to get started!</p>
                        <Link href="/shop" className="px-8 py-3 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-semibold rounded-xl transition-all">Browse Shop</Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.productId} className="flex gap-4 p-4 bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-[#1a1a2e] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">${item.price.toLocaleString()}</p>
                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <button onClick={() => updateQuantity(item, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-all text-lg leading-none">−</button>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-all text-lg leading-none">+</button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">${(item.price * item.quantity).toLocaleString()}</span>
                                        <button onClick={() => removeItem(item.productId)} className="text-rose-400 hover:text-rose-300 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl p-6 h-fit sticky top-20">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-500 dark:text-gray-400">
                                    <span>Subtotal</span><span className="text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-green-400" : "text-slate-900 dark:text-white"}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                {shipping > 0 && <p className="text-[11px] text-gray-600">Free shipping on orders over $99</p>}
                                <div className="border-t border-slate-200 dark:border-white/5 pt-3 flex justify-between font-bold text-base">
                                    <span className="text-slate-900 dark:text-white">Total</span><span className="text-slate-900 dark:text-white">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut || !cart?.items.length}
                                className={`mt-6 w-full py-3 text-center font-semibold text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                    checkingOut
                                        ? "bg-gradient-to-r from-red-700 to-rose-700 opacity-80 cursor-wait shadow-red-500/20"
                                        : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-500/20"
                                }`}
                            >
                                {checkingOut ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Redirecting to Stripe...
                                    </>
                                ) : "Proceed to Checkout"}
                            </button>
                            <Link href="/shop" className="mt-3 block text-center text-sm text-slate-500 dark:text-gray-500 hover:text-red-400 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
