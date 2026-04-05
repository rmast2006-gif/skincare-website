import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function GET() {
  try {
    const store = readStore()
    return NextResponse.json(store.messages)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const store = readStore()
    const message = { ...body, id: Date.now().toString(), createdAt: new Date().toISOString() }
    store.messages.push(message)
    writeStore(store)
    return NextResponse.json(message, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}