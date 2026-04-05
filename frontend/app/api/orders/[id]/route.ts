import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const store = readStore()
    const index = store.orders.findIndex(o => o.id === params.id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    store.orders[index] = { ...store.orders[index], ...body }
    writeStore(store)
    return NextResponse.json(store.orders[index])
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const store = readStore()
    const index = store.orders.findIndex(o => o.id === params.id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    store.orders.splice(index, 1)
    writeStore(store)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}