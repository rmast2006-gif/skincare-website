import fs from 'fs'

const store = JSON.parse(fs.readFileSync('./data/store.json', 'utf-8'))

async function translate(text) {
  if (!text || text.trim() === '') return ''
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    return data[0].map((item) => item[0]).join('') || text
  } catch (e) {
    console.error('Translation failed for:', text)
    return text
  }
}

function getText(field) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field.en || ''
}

const affected = [
  'Ultra-Moisturizing Hand Cream',
  'HA Serum Booster 3.2%',
  'LipUp',
  'Micellar Water With HA',
  'Velvety Hydrobiotic Cream',
  'Magnesium Mist',
  'Milky Cleanser Hydro-Biotic',
  'Expert Anti Aging Cream',
  'Expert Anti Aging Fluid',
  'Expert Antiaging Eye Contour',
  'The Caramel Cream light -N 1',
  'The Caramel Cream medium -N 2',
  'Purifying Gel',
  'Express Blemish Care',
  'Clear Skin Foaming Gel',
  'Vitamin C Serum 25%',
  'The Peeling Night Cream',
  'Radiance Lifting Eye Contour',
  'Express Radiant Cleansing Foam',
  'Expert Exfoliator',
]

let count = 0

for (let i = 0; i < store.products.length; i++) {
  const p = store.products[i]
  const nameEn = getText(p.name)

  if (!affected.includes(nameEn)) continue

  console.log(`Translating: ${nameEn}`)

  const [newNameAr, newDescAr, newHowToUseAr, newBenefitsAr, newIngredientsAr] = await Promise.all([
    translate(nameEn),
    translate(getText(p.description)),
    translate(getText(p.howToUse)),
    translate(getText(p.benefits)),
    translate(getText(p.ingredients)),
  ])

  store.products[i] = {
    ...p,
    name: { en: nameEn, ar: newNameAr },
    description: { en: getText(p.description), ar: newDescAr },
    howToUse: { en: getText(p.howToUse), ar: newHowToUseAr },
    benefits: { en: getText(p.benefits), ar: newBenefitsAr },
    ingredients: { en: getText(p.ingredients), ar: newIngredientsAr },
  }

  count++
  await new Promise(r => setTimeout(r, 500))
}

fs.writeFileSync('./data/store.json', JSON.stringify(store, null, 2))
console.log(`Done! Fixed ${count} products.`)