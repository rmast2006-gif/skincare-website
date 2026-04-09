import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

function readRawStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { coupons: [], couponSettings: { globalEnabled: false } }
  }
}

export async function POST(req: Request) {
  try {
    const { code, productIds } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const store = readRawStore()
    const coupons = store.coupons || []
    const settings = store.couponSettings || { globalEnabled: false }

    if (!settings.globalEnabled) {
      return NextResponse.json({ error: 'Coupon system is disabled' }, { status: 400 })
    }

    const coupon = coupons.find((c: any) => c.code === code.toUpperCase())

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Coupon is inactive' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      discount: coupon.discount,
      appliesToAll: coupon.appliesToAll,
    })

  } catch (e) {
    console.error('[POST /api/coupons/validate]', e)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}
