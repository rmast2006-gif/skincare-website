import json
import copy

# Translation dictionaries for common terms
TEXTURE_TRANSLATIONS = {
    "Light texture": "ملمس خفيف",
    "Creamy texture": "ملمس كريمي",
    "Balm texture": "ملمس بلسم",
    "Cream texture": "ملمس كريمي",
    "Fresh and pleasant water": "ماء منعش ولطيف",
    "Gel texture": "ملمس جل",
    "Fluid texture": "ملمس سائل",
    "Rich texture": "ملمس غني",
    "Serum texture": "ملمس سيروم",
    "Oil texture": "ملمس زيتي",
    "Foam": "رغوة",
    "Lotion": "لوشن"
}

SKIN_TYPE_TRANSLATIONS = {
    "All Skin Types": "جميع أنواع البشرة",
    "Sensitive Skin": "البشرة الحساسة",
    "Sensitive all Skin types": "جميع أنواع البشرة الحساسة",
    "Sensitive dry Skin": "البشرة الجافة الحساسة",
    "Sensitive lips": "الشفاه الحساسة",
    "Hypersensitive Skin": "البشرة شديدة الحساسة",
    "intolerant skin": "البشرة غير المتحملة",
    "Dry Skin": "البشرة الجافة",
    "Very dry skin": "البشرة شديدة الجفاف",
    "Oily Skin": "البشرة الدهنية",
    "Combination Skin": "البشرة المختلطة",
    "Mature Skin": "البشرة الناضجة",
    "Acne-prone skin": "البشرة المعرضة لحب الشباب"
}

BENEFIT_TRANSLATIONS = {
    "Non comedogenic": "لا يسبب انسداد المسام",
    "Good makeup base": "أساس مكياج ممتاز",
    "Fragrance free": "خالٍ من العطور",
    "No white marks": "لا يترك علامات بيضاء",
    "Visibly reduces redness": "يقلل الاحمرار بشكل ملحوظ",
    "Acts on inflammation and vascularisation": "يعمل على الالتهاب والأوعية الدموية",
    "Excellente makeup base": "أساس مكياج ممتاز",
    "Non comodegenic": "لا يسبب انسداد المسام",
    "Delicate vanilla flavor": "نكهة الفانيليا اللطيفة",
    "Apply as often as necessary": "يوضع حسب الحاجة",
    "Cleanses and removes makeup": "ينظف ويزيل المكياج",
    "Efficient even on waterproof makeup": "فعّال حتى على المكياج المقاوم للماء",
    "Face and eyes": "للوجه والعينين",
    "Nourishes": "يغذي",
    "Protects": "يحمي",
    "Moisturizes": "يرطب",
    "Soothes": "يهدئ",
    "Repairs": "يرمم",
    "Hypoallergenic": "مضاد للحساسية",
    "Paraben-free": "خالٍ من البارابين",
    "Dermatologically tested": "مختبر جلدياً"
}

def translate_texture(texture):
    if isinstance(texture, dict):
        return texture
    if not texture:
        return texture
    
    # Try exact match
    texture_clean = texture.strip()
    if texture_clean in TEXTURE_TRANSLATIONS:
        return {
            "en": texture_clean,
            "ar": TEXTURE_TRANSLATIONS[texture_clean]
        }
    
    # Try partial match
    for en, ar in TEXTURE_TRANSLATIONS.items():
        if en.lower() in texture_clean.lower():
            return {
                "en": texture,
                "ar": ar
            }
    
    # Return as-is if no translation found
    return texture

def translate_skin_type(skin_type):
    if isinstance(skin_type, dict):
        return skin_type
    if not skin_type:
        return skin_type
    
    # Handle compound skin types
    parts = [p.strip() for p in skin_type.split(',')]
    translated_parts = []
    
    for part in parts:
        translated = False
        for en, ar in SKIN_TYPE_TRANSLATIONS.items():
            if en.lower() == part.lower():
                translated_parts.append(ar)
                translated = True
                break
        if not translated:
            # Try partial match
            for en, ar in SKIN_TYPE_TRANSLATIONS.items():
                if en.lower() in part.lower():
                    translated_parts.append(ar)
                    translated = True
                    break
            if not translated:
                translated_parts.append(part)
    
    return {
        "en": skin_type,
        "ar": "، ".join(translated_parts)
    }

def translate_benefits(benefits):
    if isinstance(benefits, dict):
        return benefits
    if not benefits:
        return benefits
    
    if isinstance(benefits, str):
        benefits = [benefits]
    
    translated = []
    for benefit in benefits:
        if benefit in BENEFIT_TRANSLATIONS:
            translated.append(BENEFIT_TRANSLATIONS[benefit])
        else:
            # Try partial match
            found = False
            for en, ar in BENEFIT_TRANSLATIONS.items():
                if en.lower() in benefit.lower():
                    translated.append(ar)
                    found = True
                    break
            if not found:
                # Keep English if no translation
                translated.append(benefit)
    
    return {
        "en": benefits,
        "ar": translated
    }

def translate_ingredients_main(ingredients_main):
    if isinstance(ingredients_main, dict):
        return ingredients_main
    if not ingredients_main:
        return ingredients_main
    
    # For now, keep English names for ingredients as they are technical terms
    # But format them properly
    return {
        "en": ingredients_main,
        "ar": ingredients_main  # Keep same for technical terms
    }

def translate_spotlight(spotlight):
    if isinstance(spotlight, dict):
        return spotlight
    if not spotlight:
        return spotlight
    
    # Basic translation patterns
    translations = {
        "maximum hydration": "ترطيب قصوى",
        "sun protection": "حماية من الشمس",
        "prevent redness": "يمنع الاحمرار",
        "soothes": "يهدئ البشرة",
        "anti-aging": "مكافحة الشيخوخة",
        "repairs": "يرمم",
        "nourishes": "يغذي",
        "cleanses": "ينظف",
        "removes make-up": "يزيل المكياج",
        "moisturizes": "يرطب",
        "intensively repairs": "يرمم بشكل مكثف",
        "against dryness": "ضد الجفاف"
    }
    
    ar_translation = spotlight.lower()
    for en, ar in translations.items():
        ar_translation = ar_translation.replace(en, ar)
    
    return {
        "en": spotlight,
        "ar": ar_translation
    }

def process_product(product):
    """Add Arabic translations to a product"""
    # Texture
    if 'texture' in product and product['texture']:
        product['texture'] = translate_texture(product['texture'])
    
    # Skin Type
    if 'skinType' in product and product['skinType']:
        product['skinType'] = translate_skin_type(product['skinType'])
    
    # Benefits
    if 'benefits' in product and product['benefits']:
        product['benefits'] = translate_benefits(product['benefits'])
    
    # Ingredients
    if 'ingredients' in product and product['ingredients']:
        if 'main' in product['ingredients'] and product['ingredients']['main']:
            product['ingredients']['main'] = translate_ingredients_main(product['ingredients']['main'])
        
        if 'spotlight' in product['ingredients'] and product['ingredients']['spotlight']:
            product['ingredients']['spotlight'] = translate_spotlight(product['ingredients']['spotlight'])
    
    return product

# Load the JSON file
print("Loading brands_cleaned.json...")
with open('brands_cleaned.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Found {len(products)} products")

# Process each product
for i, product in enumerate(products):
    products[i] = process_product(product)
    if (i + 1) % 10 == 0:
        print(f"Processed {i + 1}/{len(products)} products...")

# Save back to file
print("Saving translated products...")
with open('brands_cleaned.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("✓ Translation complete!")
print(f"Total products processed: {len(products)}")
