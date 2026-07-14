"use server"

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const db = await getDb();
    const users = await db.collection("user").find().sort({ createdAt: -1 }).toArray();
    return users.map(user => ({
        ...user,
        _id: user._id.toString()
    }));
}

export async function deleteUser(id: string) {
    const db = await getDb();
    await db.collection("user").deleteOne({ id: id }); // better-auth uses string id usually, but let's check.
    // wait, if we are not sure, we can delete by the string 'id' or ObjectId '_id'. better-auth stores an 'id' string field usually in mongo adapter.
    // Let's delete by both to be safe.
    await db.collection("user").deleteOne({ $or: [{ id: id }, { _id: id as any }] });
    revalidatePath("/dashboard/user");
    return { success: true };
}

export async function updateUserRole(id: string, role: string) {
    const db = await getDb();
    await db.collection("user").updateOne(
        { $or: [{ id: id }, { _id: id as any }] },
        { $set: { role: role } }
    );
    revalidatePath("/dashboard/user");
    return { success: true };
}
