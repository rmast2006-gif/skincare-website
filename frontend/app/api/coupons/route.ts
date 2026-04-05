import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

function readRawStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { products: [], orders: [], messages: [], visitors: [], customCategories: {}, coupons: [], couponSettings: { globalEnabled: false } }
  }
}

function writeRawStore(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const store = readRawStore()
    return NextResponse.json({
      coupons: store.coupons || [],
      globalEnabled: store.couponSettings?.globalEnabled || false
    })
  } catch (e) {
    return NextResponse.json({ coupons: [], globalEnabled: false })
  }
}

export async function POST(req: Request) {
  try {
    const { code, discount, appliesToAll, products } = await req.json()

    if (!code || !discount) {
      return NextResponse.json({ error: 'Code and discount are required' }, { status: 400 })
    }
    if (discount < 1 || discount > 100) {
      return NextResponse.json({ error: 'Discount must be between 1 and 100' }, { status: 400 })
    }
    if (!appliesToAll && (!products || products.length === 0)) {
      return NextResponse.json({ error: 'Select at least one product or choose All Products' }, { status: 400 })
    }

    const store = readRawStore()
    if (!store.coupons) store.coupons = []
    if (!store.couponSettings) store.couponSettings = { globalEnabled: false }

    const existing = store.coupons.find((c: any) => c.code === code.toUpperCase())
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
    }

    const selectedProducts = appliesToAll
      ? []
      : (store.products || [])
          .filter((p: any) => products.includes(p.id))
          .map((p: any) => ({ id: p.id, name: p.name, brand: p.brand }))

    const coupon = {
      _id: Date.now().toString(),
      code: code.toUpperCase(),
      discount,
      appliesToAll: !!appliesToAll,
      products: selectedProducts,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    store.coupons.push(coupon)
    writeRawStore(store)

    return NextResponse.json({ success: true, coupon }, { status: 201 })
  } catch (e) {
    console.error('[POST /api/coupons]', e)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}