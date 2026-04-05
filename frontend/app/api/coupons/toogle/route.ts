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
    const coupon = (store.coupons || []).find((c: any) => c._id === id)
    if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    coupon.isActive = !coupon.isActive
    writeRawStore(store)
    return NextResponse.json({ success: true, isActive: coupon.isActive })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle coupon' }, { status: 500 })
  }
}