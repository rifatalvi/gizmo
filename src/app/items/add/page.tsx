"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addItem } from "../actions"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddItemPage() {
    const { data: session, isPending } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    if (isPending) {
        return <div className="p-8 text-center text-slate-500">Loading...</div>
    }

    if (!session) {
        router.push("/login")
        return null
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData(e.currentTarget)
            await addItem(formData)
            router.push("/items/manage")
        } catch (error) {
            console.error("Failed to add item:", error)
            alert("Failed to add item")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Item</CardTitle>
                    <CardDescription>Fill out the form below to add a new product to the catalog.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required placeholder="Product Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shortDesc">Short Description</Label>
                            <Input id="shortDesc" name="shortDesc" required placeholder="Brief description" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullDesc">Full Description</Label>
                            <Input id="fullDesc" name="fullDesc" placeholder="Detailed product description" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                            <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
