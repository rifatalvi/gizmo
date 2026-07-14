"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/api";

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
                    className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-600 fill-gray-600"}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

const CATEGORY_COLORS: Record<string, string> = {
    laptops: "text-blue-400 bg-blue-400/10",
    phones: "text-green-400 bg-green-400/10",
    audio: "text-purple-400 bg-purple-400/10",
    gaming: "text-red-400 bg-red-400/10",
    monitors: "text-cyan-400 bg-cyan-400/10",
    accessories: "text-orange-400 bg-orange-400/10",
};

export default function ProductCard({ product, onAddToCart, onWishlist }: ProductCardProps) {
    const [wishlisted, setWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = () => {
        onAddToCart?.(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    };

    const handleWishlist = () => {
        setWishlisted((v) => !v);
        onWishlist?.(product);
    };

    const catColor = CATEGORY_COLORS[product.category] ?? "text-slate-500 dark:text-gray-400 bg-gray-400/10";

    return (
        <div className="group relative bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
            {/* Deal badge */}
            {product.deal && product.discountPercent && (
                <div className="absolute top-3 left-3 z-10 px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-full shadow-lg">
                    -{product.discountPercent}%
                </div>
            )}

            {/* Wishlist button */}
            <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-200"
                aria-label="Add to wishlist"
            >
                <svg
                    className={`w-4 h-4 transition-colors ${wishlisted ? "text-rose-400 fill-rose-400" : "text-slate-500 dark:text-gray-400 fill-none"}`}
                    stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {/* Image */}
            <Link href={`/product/${product._id}`}>
                <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111118]/40 to-transparent" />
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                {/* Category + Brand */}
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor}`}>
                        {product.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-500">{product.brand}</span>
                </div>

                {/* Name */}
                <Link href={`/product/${product._id}`}>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2 hover:text-red-300 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-slate-500 dark:text-gray-500">({product.reviewCount.toLocaleString()})</span>
                </div>

                {/* Price + Cart */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="ml-1.5 text-xs text-slate-500 dark:text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95
                            ${addedToCart
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : product.stock === 0
                                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white shadow-lg shadow-red-500/20"
                            }
                        `}
                    >
                        {addedToCart ? (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Added
                            </>
                        ) : product.stock === 0 ? "Out of Stock" : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add
                            </>
                        )}
                    </button>
                </div>

                {/* Stock warning */}
                {product.stock > 0 && product.stock <= 5 && (
                    <p className="mt-2 text-[10px] text-orange-400">Only {product.stock} left!</p>
                )}
            </div>
        </div>
    );
}
