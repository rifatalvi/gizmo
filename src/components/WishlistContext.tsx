"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { wishlistApi, type WishlistItem } from "@/lib/api";
import type { Product } from "@/lib/api";

interface WishlistContextType {
    wishlist: WishlistItem[];
    toggleWishlist: (product: Product) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending: sessionLoading } = useSession();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadLocalWishlist = () => {
        try {
            const local = localStorage.getItem("gizmo_wishlist");
            return local ? JSON.parse(local) as WishlistItem[] : [];
        } catch {
            return [];
        }
    };

    const saveLocalWishlist = (newItems: WishlistItem[]) => {
        localStorage.setItem("gizmo_wishlist", JSON.stringify(newItems));
        setWishlist(newItems);
    };

    const fetchUserWishlist = useCallback(async (userId: string) => {
        try {
            const data = await wishlistApi.get(userId);
            setWishlist(data.items || []);
        } catch (err) {
            console.error("Failed to load user wishlist:", err);
        }
    }, []);

    const syncLocalToDb = async (userId: string) => {
        const localItems = loadLocalWishlist();
        if (localItems.length > 0) {
            for (const item of localItems) {
                try {
                    await wishlistApi.addItem(userId, item);
                } catch (e) {
                    console.error("Failed to sync wishlist item to DB:", e);
                }
            }
            localStorage.removeItem("gizmo_wishlist");
            await fetchUserWishlist(userId);
        }
    };

    useEffect(() => {
        if (sessionLoading) return;

        const initializeWishlist = async () => {
            setIsLoading(true);
            if (session?.user?.id) {
                await syncLocalToDb(session.user.id);
                await fetchUserWishlist(session.user.id);
            } else {
                setWishlist(loadLocalWishlist());
            }
            setIsLoading(false);
        };

        initializeWishlist();
    }, [session?.user?.id, sessionLoading, fetchUserWishlist]);

    const toggleWishlist = async (product: Product) => {
        const item: WishlistItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
        };

        const isAdding = !wishlist.some(w => w.productId === product._id);

        if (session?.user?.id) {
            try {
                // Optimistic UI update
                setWishlist(prev => {
                    if (isAdding) return [...prev, item];
                    return prev.filter(w => w.productId !== product._id);
                });

                if (isAdding) {
                    await wishlistApi.addItem(session.user.id, item);
                } else {
                    await wishlistApi.removeItem(session.user.id, product._id);
                }
                await fetchUserWishlist(session.user.id);
            } catch (err) {
                console.error("Failed to update DB wishlist:", err);
                await fetchUserWishlist(session.user.id); // Revert
            }
        } else {
            // Guest mode
            const current = loadLocalWishlist();
            let next;
            if (isAdding) {
                next = [...current, item];
            } else {
                next = current.filter(w => w.productId !== product._id);
            }
            saveLocalWishlist(next);
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.productId === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, isLoading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
