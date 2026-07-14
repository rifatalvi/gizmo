import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const sortBy = searchParams.get("sort") ?? "newest";
    const priceMin = Number(searchParams.get("priceMin") ?? 0);
    const priceMax = Number(searchParams.get("priceMax") ?? 999999);
    const minRating = Number(searchParams.get("minRating") ?? 0);
    const featured = searchParams.get("featured");
    const deal = searchParams.get("deal");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Number(searchParams.get("limit") ?? 12));

    try {
        const db = await getDb();
        const col = db.collection("products");

        // ── Build query ─────────────────────────────────────────
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $elemMatch: { $regex: search, $options: "i" } } },
            ];
        }

        if (category && category !== "all") {
            query.category = category;
        }

        query.price = { $gte: priceMin, $lte: priceMax };

        if (minRating > 0) {
            query.rating = { $gte: minRating };
        }

        if (featured === "true") {
            query.featured = true;
        }

        if (deal === "true") {
            query.deal = true;
        }

        // ── Sort ──────────────────────────────────────────────────
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sort: Record<string, any> = { createdAt: -1 };
        if (sortBy === "price_asc") sort = { price: 1 };
        else if (sortBy === "price_desc") sort = { price: -1 };
        else if (sortBy === "rating") sort = { rating: -1 };

        // ── Paginate ───────────────────────────────────────────────
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            col.find(query).sort(sort).skip(skip).limit(limit).toArray(),
            col.countDocuments(query),
        ]);

        // Convert _id to string
        const serialized = products.map((p) => ({
            ...p,
            _id: p._id.toString(),
        }));

        return NextResponse.json({
            products: serialized,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("[/api/products] Error:", err);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
