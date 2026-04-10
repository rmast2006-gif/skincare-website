import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const store = readStore()

    if (!store || !store.products) {
      return NextResponse.json({ error: 'Store data missing' }, { status: 500 })
    }

    const product = store.products.find(
      (p: any) => String(p.id) === String(id)
    )

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)

  } catch (e) {
    console.error('GET ERROR:', e)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const store = readStore()
    const productIndex = store.products.findIndex((p: any) => String(p.id) === String(id))

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    store.products[productIndex] = {
      ...store.products[productIndex],
      ...body,
      id: String(id),
      updatedAt: new Date().toISOString()
    }

    // STEP 1: Save to store.json (primary)
    writeStore(store)

    // STEP 2: Sync update to MongoDB via backend (secondary - silent fail)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007'
      // Find MongoDB _id for this product if it exists
      const mongoProduct = store.products[productIndex]
      if ((mongoProduct as any).mongoId) {
        await fetch(`${backendUrl}/api/products/${(mongoProduct as any).mongoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: body.name,
            description: body.description,
            howToUse: body.howToUse,
            price: body.price,
            brand: body.brand,
            category: body.category,
            images: body.images || [],
          }),
        })
      }
    } catch (mongoErr) {
      console.warn('[PUT /api/products/[id]] MongoDB sync failed (non-fatal):', mongoErr)
    }

    return NextResponse.json(store.products[productIndex])

  } catch (e) {
    console.error('PUT ERROR:', e)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const store = readStore()
    const productIndex = store.products.findIndex((p: any) => String(p.id) === String(id))

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const deletedProduct = store.products.splice(productIndex, 1)[0]

    // STEP 1: Delete from store.json (primary)
    writeStore(store)

    // STEP 2: Delete from MongoDB via backend (secondary - silent fail)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007'
      if ((deletedProduct as any).mongoId) {
        await fetch(`${backendUrl}/api/products/${(deletedProduct as any).mongoId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } catch (mongoErr) {
      console.warn('[DELETE /api/products/[id]] MongoDB sync failed (non-fatal):', mongoErr)
    }

    return NextResponse.json({ success: true, product: deletedProduct })

  } catch (e) {
    console.error('DELETE ERROR:', e)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}