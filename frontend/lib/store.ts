import fs from 'fs'
import path from 'path'

export interface Product {
  id: string
  name: string | { en: string; ar: string }
  brand: string | { en: string; ar: string }
  type?: string
  category?: string
  description?: string | { en: string; ar: string }
  howToUse?: string | { en: string; ar: string }
  benefits?: string | { en: string; ar: string }
  ingredients?: string | { en: string; ar: string }
  price: number
  texture?: string
  skinType?: string
  images?: string[]
}

export interface Order {
  id: string
  customerName: string
  phone: string
  email: string
  address: string
  notes?: string
  items: { productName: string; brand: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'confirmed' | 'delivered'
  createdAt: string
}

export interface Message {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export interface Visitor {
  page: string
  timestamp: string
  userAgent?: string
}

export interface StoreData {
  products: Product[]
  orders: Order[]
  messages: Message[]
  visitors: Visitor[]
  customCategories: Record<string, string[]>
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'store.json')

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(
        {
          products: [],
          orders: [],
          messages: [],
          visitors: [],
          customCategories: { Topicrem: [], Novexpert: [] }
        },
        null,
        2
      )
    )
  }
}

export function readStore(): StoreData {
  ensureFile()
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')

    if (!raw || raw.trim() === '') {
      return {
        products: [],
        orders: [],
        messages: [],
        visitors: [],
        customCategories: { Topicrem: [], Novexpert: [] }
      }
    }

    const parsed = JSON.parse(raw)

    return {
      products: parsed.products || [],
      orders: parsed.orders || [],
      messages: parsed.messages || [],
      visitors: parsed.visitors || [],
      customCategories: parsed.customCategories || { Topicrem: [], Novexpert: [] }
    }
  } catch (e) {
    console.error('readStore error:', e)
    return {
      products: [],
      orders: [],
      messages: [],
      visitors: [],
      customCategories: { Topicrem: [], Novexpert: [] }
    }
  }
}

export function writeStore(data: StoreData) {
  ensureFile()
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('writeStore error:', e)
  }
}