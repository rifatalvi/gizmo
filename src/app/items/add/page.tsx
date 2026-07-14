"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addItem } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddItemPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const formData = new FormData(e.currentTarget)
            await addItem(formData)
            router.push("/items/manage")
        } catch (err: any) {
            setError(err.message || "Failed to add item")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input id="name" name="name" required placeholder="e.g. MacBook Pro 16" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select name="category" required defaultValue="laptops">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="laptops">Laptops</SelectItem>
                                        <SelectItem value="phones">Phones</SelectItem>
                                        <SelectItem value="audio">Audio</SelectItem>
                                        <SelectItem value="gaming">Gaming</SelectItem>
                                        <SelectItem value="monitors">Monitors</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand</Label>
                                <Input id="brand" name="brand" placeholder="e.g. Apple" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Full Description</Label>
                            <Textarea id="description" name="description" rows={5} placeholder="Detailed product description..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($) *</Label>
                                <Input id="price" name="price" type="number" step="0.01" min="0" required placeholder="999.99" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input id="stock" name="stock" type="number" min="0" defaultValue="10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input id="image" name="image" type="url" placeholder="https://example.com/image.jpg" />
                            <p className="text-xs text-slate-500">Leave blank to use a default placeholder image.</p>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between border-t p-6">
                        <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Add Product"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
