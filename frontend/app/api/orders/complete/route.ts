import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const store = readStore()
    const index = store.orders.findIndex(o => o.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    store.orders.splice(index, 1)
    writeStore(store)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to complete order' }, { status: 500 })
  }
}