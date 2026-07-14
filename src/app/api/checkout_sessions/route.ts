import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ObjectId } from 'mongodb'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import Stripe from 'stripe'

interface CheckoutItem {
    productId: string;
    quantity: number;
}

interface Product {
    _id: ObjectId;
    name: string;
    description?: string;
    image?: string;
    price: number;
}

export async function POST(req: Request) {
    try {
        // 1. Authenticate user
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // 2. Parse request body
        const body = await req.json()
        const items = body.items as CheckoutItem[]

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items provided' }, { status: 400 })
        }

        // 3. Fetch items from MongoDB to ensure prices are secure
        const db = await getDb()
        const productIds = items.map(item => new ObjectId(item.productId))
        const products = await db
            .collection<Product>('products') // Assuming the collection is named 'products' based on api.ts
            .find({ _id: { $in: productIds } })
            .toArray()

        if (products.length === 0) {
            return NextResponse.json({ error: 'Products not found' }, { status: 404 })
        }

        const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

        // 4. Create Stripe Line Items
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(cartItem => {
            const product = products.find(p => String(p._id) === cartItem.productId)
            if (!product) throw new Error(`Product ${cartItem.productId} not found`)

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: product.image ? [product.image] : [],
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: cartItem.quantity,
            }
        })

        // 5. Create Stripe Checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            customer_email: session.user.email,
            line_items,
            metadata: {
                userId: session.user.id,
                userEmail: session.user.email,
            },
            success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/cart`,
        })

        // 6. Save order to database so it shows up on "My Orders" page
        try {
            const total = products.reduce((acc, p) => {
                const qty = items.find(i => i.productId === String(p._id))?.quantity || 1;
                return acc + (p.price * qty);
            }, 0);

            const orderItems = products.map(p => {
                const qty = items.find(i => i.productId === String(p._id))?.quantity || 1;
                return {
                    productId: String(p._id),
                    name: p.name,
                    price: p.price,
                    image: p.image || '',
                    quantity: qty,
                };
            });

            await db.collection('orders').insertOne({
                userId: session.user.id,
                items: orderItems,
                total: total,
                status: 'processing', // Since we don't have webhooks, set to processing immediately
                stripeSessionId: checkoutSession.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Clear the cart
            await db.collection('carts').updateOne(
                { userId: session.user.id },
                { $set: { items: [], updatedAt: new Date() } }
            );
        } catch (dbErr) {
            console.error('Failed to save order to DB:', dbErr);
            // We still return the checkout URL even if saving fails
        }

        return NextResponse.json({ url: checkoutSession.url })
    } catch (err) {
        const error = err as { message?: string; statusCode?: number }
        console.error('Stripe checkout error:', err)
        return NextResponse.json(
            { error: error.message ?? 'Failed to create checkout session' },
            { status: error.statusCode ?? 500 }
        )
    }
}
