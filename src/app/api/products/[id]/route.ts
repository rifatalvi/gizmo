import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const db = await getDb();
        const col = db.collection("products");

        // Try ObjectId first, then fallback to slug
        let product = null;
        if (ObjectId.isValid(id)) {
            product = await col.findOne({ _id: new ObjectId(id) });
        }
        if (!product) {
            product = await col.findOne({ slug: id });
        }

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ ...product, _id: product._id.toString() });
    } catch (err) {
        console.error("[/api/products/[id]] Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
