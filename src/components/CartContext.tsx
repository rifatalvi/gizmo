"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { cartApi, type CartItem, type Product } from "@/lib/api";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => Promise<void>;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending: sessionLoading } = useSession();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadLocalCart = () => {
        try {
            const local = localStorage.getItem("gizmo_cart");
            return local ? JSON.parse(local) as CartItem[] : [];
        } catch {
            return [];
        }
    };

    const saveLocalCart = (newItems: CartItem[]) => {
        localStorage.setItem("gizmo_cart", JSON.stringify(newItems));
        setItems(newItems);
    };

    const fetchUserCart = useCallback(async (userId: string) => {
        try {
            const cart = await cartApi.get(userId);
            setItems(cart.items || []);
        } catch (err) {
            console.error("Failed to load user cart:", err);
        }
    }, []);

    const syncLocalToDb = async (userId: string) => {
        const localItems = loadLocalCart();
        if (localItems.length > 0) {
            // Push each local item to the DB
            for (const item of localItems) {
                try {
                    await cartApi.addItem(userId, item);
                } catch (e) {
                    console.error("Failed to sync item to DB:", e);
                }
            }
            // Clear local cart after syncing
            localStorage.removeItem("gizmo_cart");
            // Refresh from DB
            await fetchUserCart(userId);
        }
    };

    useEffect(() => {
        if (sessionLoading) return;

        const initializeCart = async () => {
            setIsLoading(true);
            if (session?.user?.id) {
                await syncLocalToDb(session.user.id);
                await fetchUserCart(session.user.id);
            } else {
                setItems(loadLocalCart());
            }
            setIsLoading(false);
        };

        initializeCart();
    }, [session?.user?.id, sessionLoading, fetchUserCart]);

    const addToCart = async (product: Product) => {
        const cartItem: CartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        };

        if (session?.user?.id) {
            // User is logged in, send to backend
            try {
                // Optimistic update
                setItems((prev) => {
                    const existing = prev.find(i => i.productId === cartItem.productId);
                    if (existing) {
                        return prev.map(i => i.productId === cartItem.productId ? { ...i, quantity: i.quantity + 1 } : i);
                    }
                    return [...prev, cartItem];
                });
                await cartApi.addItem(session.user.id, cartItem);
                // Refresh to ensure exact state
                await fetchUserCart(session.user.id);
            } catch (err) {
                console.error("Failed to add item to DB cart:", err);
                // Revert or refresh
                await fetchUserCart(session.user.id);
            }
        } else {
            // Guest user, save to local storage
            const currentItems = loadLocalCart();
            const existing = currentItems.find(i => i.productId === cartItem.productId);
            let newItems;
            if (existing) {
                newItems = currentItems.map(i => 
                    i.productId === cartItem.productId ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                newItems = [...currentItems, cartItem];
            }
            saveLocalCart(newItems);
        }
    };

    return (
        <CartContext.Provider value={{ items, addToCart, isLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
