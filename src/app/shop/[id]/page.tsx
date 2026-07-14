"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { productsApi, checkoutApi, type Product } from "@/lib/api";
import ProductCard from "@/component/ProductCard";
import Footer from "@/component/Footer";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/components/CartContext";

import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
    const [activeImage, setActiveImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const { items, addToCart } = useCart();

    const isAlreadyAdded = product ? items.some(item => item.productId === product._id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productsApi.get(id);
                setProduct(data);
                
                // Fetch related products from same category
                const relatedData = await productsApi.list({ category: data.category, limit: "4" });
                setRelated(relatedData.products.filter(p => p._id !== data._id).slice(0, 4));
            } catch (err) {
                console.error("Failed to load product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] pt-24 pb-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Product Not Found</h1>
                <Link href="/shop" className="text-red-500 hover:underline">Back to Shop</Link>
            </div>
        );
    }

    // Mock multiple images for the gallery
    const images = [
        product.image,
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    ];

    const handleAddToCart = async () => {
        if (product) {
            await addToCart(product);
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = async () => {
        if (!product) return;
        setBuyingNow(true);
        try {
            const session = await checkoutApi.createSession([{
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
            }]);
            if (session.url) {
                window.location.href = session.url;
            }
        } catch (err) {
            console.error('Checkout failed:', err);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setBuyingNow(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
            {/* Breadcrumbs */}
            <div className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm">
                    <Link href="/shop" className="text-slate-500 hover:text-red-500 transition-colors">Shop</Link>
                    <span className="mx-2 text-slate-400">/</span>
                    <Link href={`/shop?category=${product.category}`} className="text-slate-500 hover:text-red-500 transition-colors capitalize">{product.category}</Link>
                    <span className="mx-2 text-slate-400">/</span>
                    <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{product.name}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Product Overview Section */}
                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    {/* Media Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-[#111118] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                            {product.deal && product.discountPercent && (
                                <div className="absolute top-4 left-4 px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-full shadow-lg">
                                    {product.discountPercent}% OFF
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-red-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10 rounded-full">
                                {product.brand}
                            </span>
                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                <StarRating rating={product.rating} />
                                <span>({product.reviewCount} Reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">${product.price.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-lg text-slate-400 line-through mb-1">${product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                            {product.description || "Experience top-tier performance with this premium tech product, designed to enhance your daily workflow and entertainment."}
                        </p>

                        <div className="mt-auto space-y-4">
                            {product.stock > 0 ? (
                                <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    In Stock (Ships immediately)
                                </div>
                            ) : (
                                <div className="text-sm font-medium text-red-500 mb-2">Out of Stock</div>
                            )}

                            <div className="flex gap-3">
                                <motion.button
                                    whileTap={!isAlreadyAdded && product.stock > 0 ? { scale: 0.97 } : {}}
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || isAlreadyAdded}
                                    className={`flex-1 flex justify-center items-center gap-2 py-4 px-4 rounded-2xl font-bold transition-all ${
                                        isAlreadyAdded || addedToCart
                                            ? "bg-green-500 text-white shadow-lg shadow-green-500/30 border-transparent cursor-not-allowed"
                                            : product.stock === 0
                                                ? "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 border-transparent cursor-not-allowed"
                                                : "bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10"
                                    }`}
                                >
                                    {isAlreadyAdded || addedToCart ? "Already Added" : "Add to Cart"}
                                </motion.button>

                                <motion.button
                                    whileTap={product.stock > 0 && !buyingNow ? { scale: 0.97 } : {}}
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0 || buyingNow}
                                    className={`flex-1 flex justify-center items-center gap-2 py-4 px-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
                                        product.stock === 0
                                            ? "bg-slate-300 dark:bg-slate-800 text-slate-500 shadow-none cursor-not-allowed"
                                            : buyingNow
                                                ? "bg-gradient-to-r from-red-700 to-rose-700 opacity-80 cursor-wait shadow-red-500/30"
                                                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-500/30"
                                    }`}
                                >
                                    {buyingNow ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Redirecting...
                                        </>
                                    ) : "Buy Now"}
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="flex-shrink-0 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors border border-slate-200 dark:border-white/10"
                                    title="Add to Wishlist"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section (Description, Specs, Reviews) */}
                <div className="mb-20">
                    <div className="flex border-b border-slate-200 dark:border-white/10 gap-8 mb-8">
                        {(["description", "specs", "reviews"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-lg font-bold capitalize transition-colors relative ${
                                    activeTab === tab ? "text-red-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[200px]">
                        <AnimatePresence mode="wait">
                            {activeTab === "description" && (
                                <motion.div
                                    key="desc"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                                >
                                    <p>{product.description || "Detailed description coming soon..."}</p>
                                </motion.div>
                            )}

                            {activeTab === "specs" && (
                                <motion.div
                                    key="specs"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {product.specs ? (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {Object.entries(product.specs).map(([key, value]) => (
                                                <div key={key} className="flex flex-col p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                                                    <span className="text-sm text-slate-500 capitalize mb-1">{key}</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500">No specifications available for this product.</p>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "reviews" && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 mb-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{product.rating}</div>
                                            <StarRating rating={product.rating} />
                                            <div className="text-sm text-slate-500 mt-2">Based on {product.reviewCount} reviews</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-center py-8">Review system integration coming soon.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Items */}
                {related.length > 0 && (
                    <section className="pt-12 border-t border-slate-200 dark:border-white/5">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Related Products</h2>
                            <Link href={`/shop?category=${product.category}`} className="text-red-500 font-semibold hover:underline">View all</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-gray-600 fill-currentColor"}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}
