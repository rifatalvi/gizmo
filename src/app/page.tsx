import { productsApi, type Product } from "@/lib/api";
import Footer from "@/component/Footer";
import Hero from "@/component/home/Hero";
import FeatureStrips from "@/component/home/FeatureStrips";
import Categories from "@/component/home/Categories";
import FeaturedProducts from "@/component/home/FeaturedProducts";
import HotDeals from "@/component/home/HotDeals";
import Newsletter from "@/component/home/Newsletter";

async function getFeaturedProducts(): Promise<Product[]> {
    try {
        const data = await productsApi.featured();
        return data.products;
    } catch {
        return [];
    }
}

async function getDealProducts(): Promise<Product[]> {
    try {
        const data = await productsApi.deals();
        return data.products.slice(0, 4);
    } catch {
        return [];
    }
}

export default async function HomePage() {
    const [featuredProducts, dealProducts] = await Promise.all([
        getFeaturedProducts(),
        getDealProducts(),
    ]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
            <Hero />
            <FeatureStrips />
            <Categories />
            <FeaturedProducts products={featuredProducts} />
            <HotDeals products={dealProducts} />
            <Newsletter />
            <Footer />
        </div>
    );
}
