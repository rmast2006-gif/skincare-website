import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

function readRawStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { coupons: [] }
  }
}

function writeRawStore(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const store = readRawStore()
    store.coupons = (store.coupons || []).filter((c: any) => c._id !== params.id)
    writeRawStore(store)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const store = readRawStore()
    const coupon = (store.coupons || []).find((c: any) => c._id === params.id)
    if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    coupon.isActive = !coupon.isActive
    writeRawStore(store)
    return NextResponse.json({ success: true, isActive: coupon.isActive })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle coupon' }, { status: 500 })
  }
}