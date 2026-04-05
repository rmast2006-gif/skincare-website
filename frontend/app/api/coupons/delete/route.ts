import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

function readRawStore() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return { coupons: [] }
  }
}

function writeRawStore(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const store = readRawStore()
    store.coupons = (store.coupons || []).filter((c: any) => c._id !== id)
    writeRawStore(store)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}