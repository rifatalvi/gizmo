"use server"

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function addItem(data: FormData) {
    const name = data.get("name") as string;
    const category = data.get("category") as string;
    const brand = data.get("brand") as string;
    const description = data.get("description") as string;
    const price = Number(data.get("price"));
    const stock = Number(data.get("stock") || "10");
    const image = data.get("image") as string;

    if (!name || !category || !price) {
        throw new Error("Name, category, and price are required.");
    }

    const db = await getDb();
    
    // Slugify the name for the slug field
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    await db.collection("products").insertOne({
        name,
        slug,
        category,
        brand: brand || "Gizmo",
        description,
        price,
        stock,
        image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
        rating: 0,
        reviewCount: 0,
        tags: [category, brand].filter(Boolean),
        featured: false,
        createdAt: new Date(),
    });

    revalidatePath("/items/manage");
    revalidatePath("/shop");
    return { success: true };
}

export async function deleteItem(id: string) {
    const db = await getDb();
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/items/manage");
    revalidatePath("/shop");
    return { success: true };
}

export async function getItems() {
    const db = await getDb();
    const items = await db.collection("products").find().sort({ createdAt: -1 }).toArray();
    return items.map(item => ({
        ...item,
        _id: item._id.toString()
    }));
}
