import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

const categoryMap: Record<string, string> = {
  // AC CONTROL
  'AC Purifying Cleansing Gel': 'AC CONTROL',
  'Mattifying Fluid': 'AC CONTROL',
  'Compensating Moisturizing Cream': 'AC CONTROL',
  'Balancing Anti-Blemish Care': 'AC CONTROL',
  'Intensive Serum': 'AC CONTROL',
  // AH3 ANTI-AGING
  'Anti-Aging Global Serum': 'AH3 ANTI-AGING',
  'Global Anti-Aging Fluid': 'AH3 ANTI-AGING',
  'Global Anti-Aging Cream': 'AH3 ANTI-AGING',
  'Global Anti- Aging Eye Contour': 'AH3 ANTI-AGING',
  // CALM +
  'AR Anti- Redness Daily Cream SPF50+': 'CALM +',
  'Soothing Fluid': 'CALM +',
  'Soothing Cream': 'CALM +',
  // DA
  'Emollient Balm': 'DA',
  // UM
  'Ultra- Rich Cleansing Gel': 'UM',
  'UR10 - Anti-calluses Foot Cream': 'UM',
  'UR10 Anti-Roughness Smoothing Cream': 'UM',
  'Ultra-Moisturizing 3-IN-1 Gentle Scrub': 'UM',
  'Ultra-Moisturizing Hand Cream': 'UM',
  // DERMO SPECIFIC
  'PV/DS Cleansing Gel': 'DERMO SPECIFIC',
  'PH5 Gentle Shampoo': 'DERMO SPECIFIC',
  // SUN RANGE
  'Protective Day Cream SPF50+ 40ml': 'SUN RANGE',
  'Moisturizing Sun Milk SPF50+': 'SUN RANGE',
  // HYDRA +
  'Lip Balm': 'HYDRA +',
  'Gentle Micellar Water': 'HYDRA +',
  'Radiance Tinted Cream SPF50+ MEDIUM': 'HYDRA +',
  'Gentle Cleansing Milk': 'HYDRA +',
  'Radiance Tinted Cream SPF50+ LIGHT': 'HYDRA +',
  'Gentle Cleansing Gel': 'HYDRA +',
  'Radiance Eye Contour': 'HYDRA +',
  'Light Radiance Cream': 'HYDRA +',
  'Rich Radiance Cream': 'HYDRA +',
  'Radiance Cream Gel': 'HYDRA +',
  'Moisturizing Radiance Serum': 'HYDRA +',
  // KARITE
  'Gentle Fortifying Shampoo': 'KARITE',
  'Nourishing Fortifying Cream': 'KARITE',
  'Intense Fortifying Mask': 'KARITE',
  // MELA
  'Intensive Radiance Serum': 'MELA (Anti Dark Spot)',
  'Unifying Day Cream SPF 50+': 'MELA (Anti Dark Spot)',
  'Gentle Peeling Night Cream': 'MELA (Anti Dark Spot)',
  'Unifying Exfoliating Bar': 'MELA (Anti Dark Spot)',
  'Unifying Ultra-Moisturizing Milk SPF 15+': 'MELA (Anti Dark Spot)',
  // Novexpert
  'HA Serum Booster 3.2%': 'HYALURONIC ACID LINE',
  'LipUp': 'HYALURONIC ACID LINE',
  'Micellar Water With HA': 'HYALURONIC ACID LINE',
  'Velvety Hydrobiotic Cream': 'MAGNESIUM LINE',
  'Magnesium Mist': 'MAGNESIUM LINE',
  'Milky Cleanser Hydro-Biotic': 'MAGNESIUM LINE',
  'Expert Anti Aging Cream': 'PRO-COLLAGEN LINE',
  'Expert Anti Aging Fluid': 'PRO-COLLAGEN LINE',
  'Expert Antiaging Eye Contour': 'PRO-COLLAGEN LINE',
  'The Caramel Cream light -N 1': 'PRO-MELANIN LINE',
  'The Caramel Cream medium -N 2': 'PRO-MELANIN LINE',
  'Purifying Gel': 'TRIO-ZINC LINE',
  'Express Blemish Care': 'TRIO-ZINC LINE',
  'Clear Skin Foaming Gel': 'TRIO-ZINC LINE',
  'Vitamin C Serum 25%': 'VITAMIN C LINE',
  'The Peeling Night Cream': 'VITAMIN C LINE',
  'Radiance Lifting Eye Contour': 'VITAMIN C LINE',
  'Express Radiant Cleansing Foam': 'VITAMIN C LINE',
  'Expert Exfoliator': 'VITAMIN C LINE',
}

export async function GET() {
  try {
    const store = readStore()
    let fixed = 0
    store.products = store.products.map((p: any) => {
      const name = typeof p.name === 'string' ? p.name : p.name?.en || ''
      const correctCategory = categoryMap[name]
      if (correctCategory && p.category !== correctCategory) {
        fixed++
        return { ...p, category: correctCategory }
      }
      return p
    })
    writeStore(store)
    return NextResponse.json({ success: true, fixed })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}