// Points to the Express backend server (gizmo-server) running on port 5000.
// Set NEXT_PUBLIC_API_URL in .env to override (e.g. in production).
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    brand: string;
    image: string;
    rating: number;
    reviewCount: number;
    stock: number;
    tags: string[];
    featured: boolean;
    deal?: boolean;
    discountPercent?: number;
    specs?: Record<string, string>;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export interface Cart {
    userId: string;
    items: CartItem[];
}

export interface Order {
    _id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
}

// ── Products ──────────────────────────────────────────────────────
export const productsApi = {
    list: (params?: Record<string, string>) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiFetch<{ products: Product[]; total: number; pages: number }>(`/api/products${qs}`);
    },
    get: (id: string) => apiFetch<Product>(`/api/products/${id}`),
    featured: () => apiFetch<{ products: Product[] }>('/api/products?featured=true&limit=8'),
    deals: () => apiFetch<{ products: Product[] }>('/api/products?deal=true&limit=12'),
};

// ── Cart ──────────────────────────────────────────────────────────
export const cartApi = {
    get: (userId: string) => apiFetch<Cart>(`/api/cart/${userId}`),
    addItem: (userId: string, item: CartItem) =>
        apiFetch<Cart>(`/api/cart/${userId}`, { method: 'POST', body: JSON.stringify(item) }),
    removeItem: (userId: string, productId: string) =>
        apiFetch<Cart>(`/api/cart/${userId}/${productId}`, { method: 'DELETE' }),
    clear: (userId: string) =>
        apiFetch<{ success: boolean }>(`/api/cart/${userId}`, { method: 'DELETE' }),
};

// ── Orders ────────────────────────────────────────────────────────
export const ordersApi = {
    list: (userId: string) => apiFetch<Order[]>(`/api/orders/user/${userId}`),
    get: (id: string) => apiFetch<Order>(`/api/orders/${id}`),
    place: (order: Omit<Order, '_id' | 'createdAt' | 'status'>) =>
        apiFetch<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),
};

// ── Checkout ───────────────────────────────────────────────────────
export const checkoutApi = {
    createSession: async (items: CartItem[]) => {
        const res = await fetch('/api/checkout_sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
        });
        if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
        return res.json() as Promise<{ url: string }>;
    },
};

