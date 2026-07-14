"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/api";
import { useCart } from "@/components/CartContext";

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onWishlist?: (product: Product) => void;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-gray-600 fill-currentColor"}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

const CATEGORY_COLORS: Record<string, string> = {
    laptops: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
    phones: "text-green-500 bg-green-50 dark:bg-green-500/10 dark:text-green-400",
    audio: "text-purple-500 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400",
    gaming: "text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400",
    monitors: "text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 dark:text-cyan-400",
    accessories: "text-orange-500 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400",
};

export default function ProductCard({ product, onAddToCart, onWishlist }: ProductCardProps) {
    const [wishlisted, setWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { items, addToCart } = useCart();

    const isAlreadyAdded = items.some(item => item.productId === product._id);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.(product);
        
        await addToCart(product);
        
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlisted((v) => !v);
        onWishlist?.(product);
    };

    const catColor = CATEGORY_COLORS[product.category] ?? "text-slate-500 bg-slate-100 dark:text-gray-400 dark:bg-gray-400/10";

    return (
        <div className="group relative flex flex-col h-full bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
            {/* Deal badge */}
            {product.deal && product.discountPercent && (
                <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-full shadow-lg">
                    -{product.discountPercent}%
                </div>
            )}

            {/* Wishlist button */}
            <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm hover:bg-white dark:hover:bg-black/60 transition-all duration-200"
                aria-label="Add to wishlist"
            >
                <svg
                    className={`w-4 h-4 transition-colors ${wishlisted ? "text-rose-500 fill-rose-500" : "text-slate-400 dark:text-gray-400 fill-none"}`}
                    stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {/* Image */}
            <Link href={`/shop/${product._id}`} className="relative h-52 flex-shrink-0 bg-slate-100 dark:bg-[#161622] overflow-hidden block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                {/* Meta info (Category, Rating) */}
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${catColor}`}>
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <StarRating rating={product.rating} />
                        <span className="text-[11px] text-slate-500 dark:text-gray-400">({product.reviewCount})</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/shop/${product._id}`} className="mb-2 block">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-red-500 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Short Description */}
                <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 mb-5 flex-1">
                    {product.description || "Experience top-tier performance with this premium tech product, designed to enhance your daily workflow and entertainment."}
                </p>

                {/* Bottom area: Price & Buttons */}
                <div className="mt-auto">
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">${product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 dark:text-gray-500 line-through mb-0.5">${product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/shop/${product._id}`}
                            className="flex-1 flex justify-center items-center py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
                        >
                            View Details
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAlreadyAdded}
                            className={`flex justify-center items-center p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                                isAlreadyAdded || addedToCart
                                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20 cursor-not-allowed"
                                    : product.stock === 0
                                        ? "bg-slate-200 dark:bg-gray-800 text-slate-400 dark:text-gray-600 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20"
                            }`}
                            aria-label="Add to cart"
                            title={isAlreadyAdded ? "Already added" : product.stock === 0 ? "Out of Stock" : "Add to cart"}
                        >
                            {isAlreadyAdded || addedToCart ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
