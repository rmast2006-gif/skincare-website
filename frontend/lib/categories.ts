export const BRAND_CATEGORIES: Record<string, string[]> = {
  Topicrem: [
    'AC CONTROL',
    'AH3 ANTI-AGING',
    'CALM +',
    'CICA',
    'DA',
    'DERMO SPECIFIC',
    'HYDRA +',
    'KARITE',
    'MELA (Anti Dark Spot)',
    'SUN RANGE',
    'UM',
    '1',
  ],
  Novexpert: [
    'HYALURONIC ACID LINE',
    'MAGNESIUM LINE',
    'PRO-COLLAGEN LINE',
    'PRO-MELANIN LINE',
    'TRIO-ZINC LINE',
    'VITAMIN C LINE',
  ],
}

export function getCategoriesForBrand(brand: string): string[] {
  if (!brand) return []
  const normalized = brand.toLowerCase().trim()
  if (normalized === 'topicrem') return BRAND_CATEGORIES['Topicrem']
  if (normalized === 'novexpert') return BRAND_CATEGORIES['Novexpert']
  return []
}

export const ALL_BRANDS = ['Topicrem', 'Novexpert']