"use server"

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function addItem(data: FormData) {
    const title = data.get("title") as string;
    const shortDesc = data.get("shortDesc") as string;
    const fullDesc = data.get("fullDesc") as string;
    const price = Number(data.get("price"));
    const imageUrl = data.get("imageUrl") as string;

    if (!title || !shortDesc) {
        throw new Error("Title and Short Description are required.");
    }

    const db = await getDb();
    
    await db.collection("items").insertOne({
        title,
        shortDesc,
        fullDesc,
        price,
        imageUrl,
        createdAt: new Date(),
    });

    revalidatePath("/items/manage");
    return { success: true };
}

export async function deleteItem(id: string) {
    const db = await getDb();
    await db.collection("items").deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/items/manage");
    return { success: true };
}

export async function getItems() {
    const db = await getDb();
    const items = await db.collection("items").find().sort({ createdAt: -1 }).toArray();
    return items.map(item => ({
        ...item,
        _id: item._id.toString()
    }));
}
