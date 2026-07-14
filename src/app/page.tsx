import { productsApi, type Product } from "@/lib/api";
import Footer from "@/component/Footer";
import Hero from "@/component/home/Hero";
import FeatureStrips from "@/component/home/FeatureStrips";
import Categories from "@/component/home/Categories";
import FeaturedProducts from "@/component/home/FeaturedProducts";
import Statistics from "@/component/home/Statistics";
import Testimonials from "@/component/home/Testimonials";
import HotDeals from "@/component/home/HotDeals";
import FAQ from "@/component/home/FAQ";
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
        <div className="min-h-screen bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
            {/* Section 1: Hero — 65vh, typewriter, parallax, scroll cue */}
            <Hero />

            {/* Section 2: Feature Strips — Free Shipping, Secure Payment, Returns, Support */}
            <FeatureStrips />

            {/* Section 3: Categories */}
            <Categories />

            {/* Section 4: Featured Products */}
            <FeaturedProducts products={featuredProducts} />

            {/* Section 5: Statistics — count-up animation */}
            <Statistics />

            {/* Section 6: Testimonials */}
            <Testimonials />

            {/* Section 7: Hot Deals */}
            <HotDeals products={dealProducts} />

            {/* Section 8: FAQ — animated accordion */}
            <FAQ />

            {/* Section 9: Newsletter — CTA */}
            <Newsletter />

            <Footer />
        </div>
    );
}
