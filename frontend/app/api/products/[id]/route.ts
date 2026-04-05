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

    writeStore(store)
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
    writeStore(store)

    return NextResponse.json({ success: true, product: deletedProduct })

  } catch (e) {
    console.error('DELETE ERROR:', e)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}