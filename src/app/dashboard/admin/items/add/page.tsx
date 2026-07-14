"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { productsApi } from "@/lib/api";
import {
    Upload,
    X,
    Image as ImageIcon,
    Package,
    Tag,
    DollarSign,
    FileText,
    ArrowLeft,
    Sparkles,
    CheckCircle2,
    Loader2,
    AlertCircle,
} from "lucide-react";

export default function AddItemPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle image selection
    const handleImageChange = (file: File | null) => {
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleImageChange(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] || null;
        if (file && file.type.startsWith("image/")) {
            handleImageChange(file);
        }
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            const formData = new FormData(e.currentTarget);
            const title = formData.get("title") as string;
            const shortDescription = formData.get("shortDescription") as string;
            const fullDescription = formData.get("fullDescription") as string;
            const price = Number(formData.get("price"));
            let imageUrl = formData.get("imageUrl") as string;

            // 1. Upload to ImgBB if a file is selected
            if (imageFile) {
                const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
                if (!imgbbApiKey) {
                    throw new Error("ImgBB API key is missing. Set NEXT_PUBLIC_IMGBB_API_KEY in .env");
                }

                const imgFormData = new FormData();
                imgFormData.append("image", imageFile);

                const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                    method: "POST",
                    body: imgFormData,
                });

                const data = await res.json();
                if (data.success) {
                    imageUrl = data.data.url;
                } else {
                    throw new Error(data.error?.message || "Failed to upload image to ImgBB");
                }
            }

            // 2. Submit to our products API
            await productsApi.create({
                name: title,
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                description: fullDescription,
                category: shortDescription,
                brand: "Gizmo",
                price: price,
                image: imageUrl || "https://via.placeholder.com/300",
                rating: 0,
                reviewCount: 0,
                stock: 100,
                tags: [title.toLowerCase()],
                featured: false,
            });

            // Show success feedback with a small delay for UX
            await new Promise((resolve) => setTimeout(resolve, 600));
            alert("✨ Item added successfully to Shop/Products!");
            router.push("/dashboard/admin");
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || "Failed to add item");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-6 md:p-10 flex justify-center items-start">
            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/10 rounded-full blur-3xl" />
            </div>

            <Card className="relative w-full max-w-3xl border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-slate-300/60">
                {/* Subtle gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <CardHeader className="pb-4 space-y-3 relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/30">
                            <Package className="h-6 w-6 text-blue-600" strokeWidth={1.8} />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-2">
                                Add New Item
                                <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400/30" strokeWidth={1.8} />
                            </CardTitle>
                            <CardDescription className="text-slate-500 text-base mt-1 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Fill in the details below to add a new product to your shop
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    <form onSubmit={onSubmit} className="space-y-7">
                        {/* Error Message */}
                        {errorMsg && (
                            <div className="flex items-start gap-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-4 text-red-700 animate-in slide-in-from-top-2 fade-in duration-300">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" strokeWidth={1.8} />
                                <p className="text-sm leading-relaxed">{errorMsg}</p>
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-2 group">
                            <Label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Tag className="h-4 w-4 text-blue-500" strokeWidth={1.8} />
                                Product Name
                            </Label>
                            <div className="relative">
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Premium Wireless Headphones"
                                    required
                                    className="pl-4 py-6 text-base border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 rounded-xl"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                    Required
                                </div>
                            </div>
                        </div>

                        {/* Category & Price Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2 group">
                                <Label htmlFor="shortDescription" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <span className="h-4 w-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-[10px] text-white font-bold">C</span>
                                    Category
                                </Label>
                                <Input
                                    id="shortDescription"
                                    name="shortDescription"
                                    placeholder="e.g. Electronics"
                                    required
                                    className="py-6 text-base border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="price" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-emerald-500" strokeWidth={1.8} />
                                    Price
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">$</span>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        required
                                        className="pl-8 py-6 text-base border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Full Description */}
                        <div className="space-y-2 group">
                            <Label htmlFor="fullDescription" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-purple-500" strokeWidth={1.8} />
                                Full Description
                            </Label>
                            <textarea
                                id="fullDescription"
                                name="fullDescription"
                                placeholder="Write a detailed description of your product..."
                                className="flex min-h-[140px] w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3.5 text-base shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200/50 focus-visible:border-blue-400 focus-visible:bg-white transition-all duration-200 resize-y"
                                required
                            />
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                                Provide a compelling description to attract buyers
                            </p>
                        </div>

                        {/* Image Upload Area */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-rose-400" strokeWidth={1.8} />
                                Product Image
                            </Label>

                            {!imagePreview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                                        relative flex flex-col items-center justify-center gap-3 
                                        border-2 border-dashed rounded-2xl p-10 cursor-pointer
                                        transition-all duration-300 ease-in-out
                                        ${isDragging
                                            ? "border-blue-400 bg-blue-50/80 scale-[1.01] shadow-lg shadow-blue-200/40"
                                            : "border-slate-200/70 bg-slate-50/40 hover:bg-slate-100/60 hover:border-blue-300/60"
                                        }
                                    `}
                                >
                                    <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/40 shadow-inner">
                                        <Upload className="h-8 w-8 text-blue-500" strokeWidth={1.6} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-base font-medium text-slate-700">
                                            {isDragging ? "Drop your image here" : "Drag & drop an image"}
                                        </p>
                                        <p className="text-sm text-slate-400 mt-0.5">
                                            or click to browse • PNG, JPG, WEBP up to 5MB
                                        </p>
                                    </div>
                                    <Input
                                        ref={fileInputRef}
                                        id="imageFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInput}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50/50 group">
                                    <div className="relative aspect-video max-h-72 w-full overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-contain bg-slate-100/50"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200/60 text-slate-600 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all duration-200 hover:scale-105"
                                    >
                                        <X className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200/60 text-xs font-medium text-slate-600 flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
                                        Image uploaded
                                    </div>
                                </div>
                            )}

                            {/* Optional URL Input */}
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                            </div>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="pl-4 py-5.5 text-sm border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 rounded-xl"
                            />
                        </div>

                        {/* Actions */}
                        <CardFooter className="px-0 pt-2 pb-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => router.back()}
                                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl px-6 py-5.5 w-full sm:w-auto"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.8} />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto rounded-xl px-8 py-5.5 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-70 disabled:shadow-none"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" strokeWidth={2.5} />
                                        Adding Item...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" strokeWidth={2} />
                                        Add Product
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}