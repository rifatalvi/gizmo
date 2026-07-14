import Link from "next/link";
import ProductCard from "@/component/ProductCard";
import type { Product } from "@/lib/api";

export default function FeaturedProducts({ products }: { products: Product[] }) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-sm font-semibold text-red-400 mb-1 uppercase tracking-wider">Hand-picked</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Products</h2>
                </div>
                <Link href="/shop?featured=true" className="text-sm text-slate-500 dark:text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                    See all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-slate-500 dark:text-gray-500">
                    <p>Start the backend server to see products.</p>
                    <code className="mt-2 block text-xs text-red-400">cd gizmo-server && npm run dev</code>
                </div>
            )}
        </section>
    );
}
