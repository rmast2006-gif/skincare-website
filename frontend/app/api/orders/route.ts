import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function GET() {
  try {
    const store = readStore()
    return NextResponse.json(store.orders)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const store = readStore()
    const order = { ...body, id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() }
    store.orders.push(order)
    writeStore(store)
    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    const store = readStore()
    const index = store.orders.findIndex(o => o.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    store.orders.splice(index, 1)
    writeStore(store)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}