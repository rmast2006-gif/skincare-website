import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'
import { BRAND_CATEGORIES } from '@/lib/categories'

export async function GET() {
  try {
    const store = readStore()
    const customCategories = store.customCategories || { Topicrem: [], Novexpert: [] }

    const merged: Record<string, string[]> = {}
    for (const brand of ['Topicrem', 'Novexpert']) {
      const defaults = BRAND_CATEGORIES[brand] || []
      const custom = customCategories[brand] || []
      merged[brand] = [...defaults, ...custom]
    }

    return NextResponse.json(merged)
  } catch (e) {
    return NextResponse.json({ Topicrem: [], Novexpert: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { brand, category } = await req.json()

    if (!brand || !category) {
      return NextResponse.json({ error: 'Brand and category are required' }, { status: 400 })
    }

    const store = readStore()
    if (!store.customCategories) {
      store.customCategories = { Topicrem: [], Novexpert: [] }
    }
    if (!store.customCategories[brand]) {
      store.customCategories[brand] = []
    }

    if (!store.customCategories[brand].includes(category)) {
      store.customCategories[brand].push(category)
      writeStore(store)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { brand, category } = await req.json()
    const store = readStore()

    if (store.customCategories?.[brand]) {
      store.customCategories[brand] = store.customCategories[brand].filter(
        (c: string) => c !== category
      )
      writeStore(store)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}