"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { productsApi, type Product } from "@/lib/api";
import { Loader2, Trash2, Eye, Package, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ManageItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const data = await productsApi.list({ limit: "100" }); // Fetch up to 100 for admin
      setProducts(data.products);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      setErrorMsg(error.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      await productsApi.delete(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      alert(error.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] p-6 md:p-10">
      <Card className="max-w-6xl mx-auto border-none shadow-md">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Package className="h-6 w-6 text-blue-500" />
              Manage Items
            </CardTitle>
            <CardDescription>
              View and manage all products in your shop inventory.
            </CardDescription>
          </div>
          <Link href="/dashboard/admin/items/add">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              + Add New Item
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="pt-6">
          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                <Package className="h-10 w-10 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">No products found</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your shop is currently empty.</p>
              </div>
              <Link href="/dashboard/admin/items/add">
                <Button variant="outline" className="mt-2">
                  Add your first item
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} className="group">
                      <TableCell>
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-white">
                          <Image
                            src={product.image || "https://via.placeholder.com/150"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-slate-200">
                        {product.name}
                        <div className="md:hidden text-xs text-slate-500 font-normal mt-1">
                          {product.category}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-800 dark:text-slate-200">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/shop/${product.slug}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                              title="View in Shop"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete Item"
                          >
                            {deletingId === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
