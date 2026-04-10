import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

function normalizeBrand(value: string | undefined | null): string {
  if (!value) return ''
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

async function translateToArabic(text: string): Promise<string> {
  if (!text || text.trim() === '') return ''
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    return data[0].map((item: any) => item[0]).join('') || text
  } catch (e) {
    return text
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const brandQuery = searchParams.get('brand')
    const categoryQuery = searchParams.get('category')

    const store = readStore()

    let filtered = store.products

    if (brandQuery) {
      const normalizedBrandQuery = normalizeBrand(brandQuery)
      filtered = filtered.filter(product => {
        const productBrand = typeof product.brand === 'string'
          ? product.brand
          : (product.brand?.en || '')
        return normalizeBrand(productBrand) === normalizedBrandQuery
      })
    }

    if (categoryQuery) {
      filtered = filtered.filter(product => (product.category || product.type || '').toLowerCase() === categoryQuery.toLowerCase())
    }

    return NextResponse.json(filtered)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const store = readStore()

    const nameEn = typeof body.name === 'string' ? body.name : body.name?.en || ''
    const descEn = typeof body.description === 'string' ? body.description : body.description?.en || ''
    const howToUseEn = typeof body.howToUse === 'string' ? body.howToUse : body.howToUse?.en || ''
    const benefitsEn = typeof body.benefits === 'string' ? body.benefits : body.benefits?.en || ''
    const ingredientsEn = typeof body.ingredients === 'string' ? body.ingredients : body.ingredients?.en || ''

    const [nameAr, descAr, howToUseAr, benefitsAr, ingredientsAr] = await Promise.all([
      translateToArabic(nameEn),
      translateToArabic(descEn),
      translateToArabic(howToUseEn),
      translateToArabic(benefitsEn),
      translateToArabic(ingredientsEn),
    ])

    const product = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      name: { en: nameEn, ar: nameAr },
      description: { en: descEn, ar: descAr },
      howToUse: { en: howToUseEn, ar: howToUseAr },
      benefits: { en: benefitsEn, ar: benefitsAr },
      ingredients: { en: ingredientsEn, ar: ingredientsAr },
    }

    // STEP 1: Save to store.json (primary)
    store.products.push(product)
    writeStore(store)

    // STEP 2: Save to MongoDB via backend (secondary - silent fail)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007'
      
      // Get admin token first
      const loginRes = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL || 'a.altawil@mazayaunited.com',
          password: process.env.ADMIN_PASSWORD || 'Ammar',
        }),
      })
      const loginData = await loginRes.json()
      const adminToken = loginData.token || ''

      // Save to MongoDB with token
      await fetch(`${backendUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          howToUse: product.howToUse,
          price: product.price,
          brand: product.brand,
          category: product.category || 'general',
          images: product.images && product.images.length > 0
            ? product.images
            : ['https://placehold.co/400x400?text=No+Image'],
        }),
      })
    } catch (mongoErr) {
      console.warn('[POST /api/products] MongoDB sync failed (non-fatal):', mongoErr)
    }

    return NextResponse.json(product, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}