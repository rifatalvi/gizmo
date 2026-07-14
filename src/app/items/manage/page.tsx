"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getItems, deleteItem } from "../actions"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ManageItemsPage() {
    const { data: session, isPending } = useSession()
    const router = useRouter()
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login")
        }
    }, [session, isPending, router])

    useEffect(() => {
        if (session) {
            fetchItems()
        }
    }, [session])

    async function fetchItems() {
        setLoading(true)
        try {
            const data = await getItems()
            setItems(data)
        } catch (error) {
            console.error("Failed to load items:", error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await deleteItem(id)
            setItems(items.filter(item => item._id !== id))
        } catch (error) {
            console.error("Failed to delete item:", error)
        }
    }

    if (isPending || (!session && loading)) {
        return (
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i} className="flex flex-col">
                            <Skeleton className="h-48 w-full rounded-t-xl" />
                            <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
                            <CardContent><Skeleton className="h-4 w-full" /></CardContent>
                            <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!session) return null

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <Button onClick={() => router.push("/items/add")}>Add New Product</Button>
            </div>

            {items.length === 0 && !loading ? (
                <div className="text-center py-12 text-slate-500">No products found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map(item => (
                        <Card key={item._id} className="flex flex-col h-full">
                            <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden relative">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                    Stock: {item.stock}
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg line-clamp-1" title={item.name}>{item.name}</CardTitle>
                                <div className="text-sm font-semibold text-red-500">${item.price?.toFixed(2) || "0.00"}</div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300 capitalize">{item.category}</span>
                                    {item.brand && <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300">{item.brand}</span>}
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => router.push(`/shop`)}>
                                    View in Shop
                                </Button>
                                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(item._id)}>
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
