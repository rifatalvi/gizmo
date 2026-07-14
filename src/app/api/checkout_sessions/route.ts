import 'server-only'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ObjectId } from 'mongodb'

import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Item {
  _id: ObjectId
  title: string
  shortDescription?: string
  imageUrl?: string
  price: number
}

interface PaymentRecord {
  itemId: string
  itemName: string
  userId: string
  userEmail: string
  amount: number
  currency: string
  stripeSessionId: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

// ── POST /api/checkout_sessions ───────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await req.json()
    const { itemId } = body as { itemId?: string }

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId' }, { status: 400 })
    }

    // 3. Fetch item from MongoDB
    const db = await getDb()
    const item = await db
      .collection<Item>('items')
      .findOne({ _id: new ObjectId(itemId) })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    // 4. Create Stripe Checkout session
    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              ...(item.shortDescription && { description: item.shortDescription }),
              ...(item.imageUrl && { images: [item.imageUrl] }),
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        itemId: String(item._id),
        itemName: item.title,
        userId: session.user.id,
        userEmail: session.user.email,
      },
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancel`,
    })

    // 5. Save payment record immediately (webhook is the fallback)
    try {
      const payment: PaymentRecord = {
        itemId: String(item._id),
        itemName: item.title,
        userId: session.user.id,
        userEmail: session.user.email ?? '',
        amount: item.price,
        currency: 'usd',
        stripeSessionId: checkout.id,
        status: 'pending',   // mark completed only after webhook confirmation
        createdAt: new Date(),
      }
      await db.collection<PaymentRecord>('payments').insertOne(payment)
    } catch {
      // Non-fatal — webhook will create the record if this fails
      console.warn('Failed to pre-save payment record; webhook will handle it')
    }

    return NextResponse.json({ url: checkout.url })
  } catch (err) {
    const error = err as { message?: string; statusCode?: number }
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: error.message ?? 'Failed to create checkout session' },
      { status: error.statusCode ?? 500 }
    )
  }
}
