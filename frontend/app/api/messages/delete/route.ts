import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const store = readStore()
    const index = store.messages.findIndex((m: any) => m.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    store.messages.splice(index, 1)
    writeStore(store)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}