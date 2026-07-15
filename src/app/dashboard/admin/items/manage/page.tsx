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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getItems, deleteItem } from "@/app/items/actions";
import type { Product } from "@/lib/api";
import {
  Loader2,
  Trash2,
  Eye,
  Package,
  AlertCircle,
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ManageItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      // getItems() is a server action — reads JWT cookie server-side
      const data = await getItems();
      setProducts(data as unknown as Product[]);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to load products";
      console.error("Failed to fetch products:", error);
      setErrorMsg(msg);
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
      // deleteItem() is a server action — reads JWT cookie server-side
      await deleteItem(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to delete product";
      console.error("Failed to delete product:", error);
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-6 md:p-10">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative max-w-6xl mx-auto border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-slate-300/60">
        {/* Accent gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <CardHeader className="pb-4 space-y-3 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/30">
                <Package className="h-6 w-6 text-blue-600" strokeWidth={1.8} />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Manage Items
                </CardTitle>
                <CardDescription className="text-slate-500 text-base flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {products.length} product{products.length !== 1 ? "s" : ""} in your inventory
                </CardDescription>
              </div>
            </div>
            <Link href="/dashboard/admin/items/add">
              <Button className="rounded-xl px-6 py-5.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                Add New Item
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Search & Refresh */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-5.5 text-sm border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 rounded-xl"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchProducts}
              className="rounded-xl p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.8} />
            </Button>
            <div className="flex-1" />
            <div className="text-sm text-slate-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-4 text-red-700 animate-in slide-in-from-top-2 fade-in duration-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" strokeWidth={1.8} />
              <p className="text-sm leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-72 gap-4 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" strokeWidth={2} />
              <p className="text-sm font-medium">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 gap-4 text-center">
              <div className="p-5 rounded-full bg-gradient-to-br from-slate-100 to-blue-50/50 border border-slate-200/50">
                <Package className="h-12 w-12 text-slate-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-800">
                  {searchTerm ? "No matching products" : "No products found"}
                </p>
                <p className="text-sm text-slate-500">
                  {searchTerm
                    ? "Try adjusting your search term"
                    : "Your shop is currently empty."}
                </p>
              </div>
              {!searchTerm && (
                <Link href="/dashboard/admin/items/add">
                  <Button variant="outline" className="mt-2 rounded-xl px-6">
                    Add your first item
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-slate-50/80 to-blue-50/40">
                  <TableRow className="hover:bg-transparent border-b-slate-200/60">
                    <TableHead className="w-[80px] text-slate-600 font-semibold">Image</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Name</TableHead>
                    <TableHead className="hidden md:table-cell text-slate-600 font-semibold">Category</TableHead>
                    <TableHead className="text-right text-slate-600 font-semibold">Price</TableHead>
                    <TableHead className="text-right w-[120px] text-slate-600 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, index) => (
                    <TableRow
                      key={product._id}
                      className={`group transition-colors duration-150 ${index % 2 === 0 ? "bg-white/50" : "bg-slate-50/30"
                        } hover:bg-blue-50/40`}
                    >
                      <TableCell>
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-200/60 bg-white shadow-sm group-hover:shadow-md transition-all duration-200">
                          <Image
                            src={product.image || "https://via.placeholder.com/150"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {product.name}
                        <div className="md:hidden text-xs text-slate-500 font-normal mt-1 flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {product.category || "Uncategorized"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50/70 text-blue-700 text-xs font-medium border border-blue-200/40">
                          {product.category || "Uncategorized"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/shop/${product.slug}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200"
                              title="View in Shop"
                            >
                              <Eye className="h-4 w-4" strokeWidth={1.8} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
                            title="Delete Item"
                          >
                            {deletingId === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
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

          {/* Footer with count */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-slate-400 px-1">
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-slate-600 font-medium text-xs">1</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

