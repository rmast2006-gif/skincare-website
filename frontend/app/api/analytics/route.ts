import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function GET() {
  try {
    const store = readStore()
    const orders = store.orders || []
    const products = store.products || []
    const messages = store.messages || []
    const visitors = store.visitors || []

    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length

    // Today's date string
    const todayStr = new Date().toISOString().split('T')[0]

    // Total visitors = only today's visits
    const todayVisitors = visitors.filter((v: any) => v.timestamp?.startsWith(todayStr)).length

    // Last 7 days for chart — each day shows that day's visit count
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      const count = visitors.filter((v: any) => v.timestamp?.startsWith(dateStr)).length
      return { date: dateStr, visitors: count }
    })

    // Page visits — only today
    const pageVisits: Record<string, number> = {}
    visitors
      .filter((v: any) => v.timestamp?.startsWith(todayStr))
      .forEach((v: any) => {
        pageVisits[v.page] = (pageVisits[v.page] || 0) + 1
      })

    return NextResponse.json({
      totalVisitors: todayVisitors,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalMessages: messages.length,
      pendingOrders,
      visitorTrends: last7Days,
      pageVisits,
      recentOrders: orders.slice(-5).reverse()
    })
  } catch (e) {
    return NextResponse.json({
      totalVisitors: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalMessages: 0,
      pendingOrders: 0,
      visitorTrends: [],
      pageVisits: {},
      recentOrders: []
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const store = readStore()
    if (!store.visitors) store.visitors = []
    store.visitors.push({
      page: body.page || '/',
      timestamp: new Date().toISOString(),
      userAgent: body.userAgent || ''
    })
    writeStore(store)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false })
  }
}