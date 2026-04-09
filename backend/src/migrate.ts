import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!

const ProductSchema = new mongoose.Schema({
  localId: String,
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  howToUse: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  images: [String],
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const raw = fs.readFileSync(
      path.join(process.cwd(), '../frontend/data/store.json'),
      'utf-8'
    )
    const store = JSON.parse(raw)
    const products = store.products || []

    console.log(`📦 Found ${products.length} products to migrate`)

    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    let success = 0
    let failed = 0

    for (const p of products) {
      try {
        // Handle both flat strings and {en, ar} objects
        const getName = (val: any) =>
          typeof val === 'string' ? { en: val, ar: val } : val

        await Product.create({
          localId: p.id,
          name: getName(p.name),
          description: getName(p.description),
          howToUse: getName(p.howToUse) || { en: '', ar: '' },
          price: p.price,
          brand: p.brand,
          category: p.category || 'general',
          images: (p.images || []).filter((img: string) =>
            img.startsWith('http') || img.startsWith('/')
          ),
        })
        console.log(`✅ Migrated: ${typeof p.name === 'string' ? p.name : p.name?.en}`)
        success++
      } catch (e: any) {
        console.log(`❌ Failed: ${JSON.stringify(p.name)} — ${e.message}`)
        failed++
      }
    }

    console.log(`\n🎉 Migration complete!`)
    console.log(`✅ Success: ${success}`)
    console.log(`❌ Failed: ${failed}`)
    process.exit(0)

  } catch (e) {
    console.error('Migration failed:', e)
    process.exit(1)
  }
}

migrate()