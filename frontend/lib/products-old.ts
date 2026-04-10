export interface Product {
  _id: string;
  brand: 'Topicrem' | 'Novexpert';
  category: string;
  images: string[];
  price: number;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  howToUse: {
    en: string;
    ar: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5007/api';

export const fetchProducts = async (brand?: string, category?: string): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (brand) params.append('brand', brand);
  if (category) params.append('category', category);

  const res = await fetch(`${API_BASE}/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

const products = [
  {
    id: "rg-mask-001",
    name: "Overnight Renewal Mask",
    description:
      "Wake up to transformed skin with this overnight treatment mask. Infused with peptides and hyaluronic acid.",
    detailedDescription:
      "This intensive overnight treatment works while you sleep to repair, rejuvenate, and restore. Packed with peptides, retinol alternative (bakuchiol), and three molecular weights of hyaluronic acid. The lightweight gel-cream texture absorbs quickly and won't transfer to pillowcases.",
    price: 95.0,
    brand: "topicrem",
    category: "Masks",
    image: "/pink-mask-jar-luxury.jpg",
    benefits: ["Overnight repair technology", "Intense hydration boost", "Firms and lifts skin", "Reduces fine lines"],
  },
  {
    id: "rg-eye-001",
    name: "Bright Eyes Cream",
    description: "Targeted eye treatment that reduces puffiness and dark circles. Gentle yet effective formula.",
    detailedDescription:
      "Our award-winning eye cream combines caffeine, vitamin K, and light-reflecting pearls to instantly brighten and depuff. The cooling metal applicator massages the delicate eye area while the formula works to reduce dark circles and smooth fine lines. Ophthalmologist-tested and safe for contact lens wearers.",
    price: 68.0,
    brand: "topicrem",
    category: "Eye Care",
    image: "/pink-eye-cream-tube.jpg",
    benefits: [
      "Reduces puffiness instantly",
      "Brightens dark circles",
      "Smooths crow's feet",
      "Cooling metal applicator",
    ],
  },
  {
    id: "rg-toner-001",
    name: "Balancing Rose Toner",
    description: "Refreshing toner with rose water that balances and preps skin for better product absorption.",
    detailedDescription:
      "A luxurious alcohol-free toner infused with Bulgarian rose water, witch hazel, and niacinamide. This hydrating mist balances skin pH, minimizes pores, and prepares skin for optimal serum and moisturizer absorption. The delicate rose scent provides a spa-like aromatherapy experience.",
    price: 45.0,
    brand: "topicrem",
    category: "Toners",
    image: "/pink-toner-bottle-spray.jpg",
    benefits: ["Balances skin pH", "Hydrates and refreshes", "Prepares for treatment", "Soothes irritation"],
  },
  {
    id: "rg-sunscreen-001",
    name: "Radiance Shield SPF 50",
    description: "Lightweight daily sunscreen with broad-spectrum protection that enhances your natural glow.",
    detailedDescription:
      "Protect and perfect with this invisible, weightless sunscreen. Broad-spectrum SPF 50 shields against UVA/UVB rays while antioxidants defend against pollution. The silky formula contains light-reflecting minerals for an instant radiance boost. No white cast, no greasy feel - just protected, glowing skin.",
    price: 58.0,
    brand: "topicrem",
    category: "Sunscreen",
    image: "/pink-sunscreen-tube.jpg",
    benefits: ["SPF 50 protection", "No white cast", "Radiance-boosting", "Water-resistant 80 min"],
  },
  {
    id: "rg-lip-001",
    name: "Plumping Lip Treatment",
    description: "Nourishing lip treatment that hydrates, plumps, and enhances natural lip color.",
    detailedDescription:
      "This multi-tasking lip treatment combines hyaluronic acid spheres with peptides and vitamin E to visibly plump and smooth lips. The tinted formula enhances natural lip color while providing long-lasting hydration. Minty fresh sensation provides a gentle plumping effect without irritation.",
    price: 38.0,
    brand: "topicrem",
    category: "Lip Care",
    image: "/pink-lip-treatment.jpg",
    benefits: ["Instant plumping", "Long-lasting hydration", "Subtle tint", "Smooths fine lines"],
  },

  // PureEssence Products
  {
    id: "pe-serum-001",
    name: "Botanical Repair Serum",
    description:
      "Concentrated plant-based serum that repairs and protects. Packed with natural antioxidants and vitamins.",
    detailedDescription:
      "This potent botanical concentrate features 20+ plant extracts including sea buckthorn, rosehip, and marula oil. Rich in vitamins A, C, and E, it repairs environmental damage while strengthening skin's natural barrier. The fast-absorbing oil-serum hybrid delivers visible results with 98% natural ingredients.",
    price: 92.0,
    brand: "novexpert",
    category: "Serums",
    image: "/black-serum-dropper-botanical.jpg",
    benefits: ["Repairs skin damage", "100% plant-based actives", "Anti-aging properties", "Rich in vitamins A, C, E"],
  },
  {
    id: "pe-moisturizer-001",
    name: "Deep Nourish Balm",
    description:
      "Ultra-rich balm with organic ingredients that deeply nourishes and protects. Perfect for dry, mature skin.",
    detailedDescription:
      "Our signature balm melts into skin delivering intensive nourishment with organic shea butter, cupuaçu butter, and ceramides. This concentrated treatment creates a protective barrier that locks in moisture for up to 48 hours. Ideal for dry, mature, or compromised skin. Certified organic and vegan.",
    price: 82.0,
    brand: "novexpert",
    category: "Moisturizers",
    image: "/black-balm-jar-organic.jpg",
    benefits: ["Deep nourishment", "Organic certified", "48-hour hydration", "Protective barrier"],
  },
  {
    id: "pe-cleanser-001",
    name: "Purifying Clay Cleanser",
    description: "Natural clay-based cleanser that detoxifies and purifies pores. Removes excess oil and impurities.",
    detailedDescription:
      "This creamy clay cleanser harnesses the power of French green clay, activated charcoal, and tea tree oil to deeply cleanse without over-drying. Draws out impurities, balances oil production, and refines pores. The mineral-rich formula leaves skin feeling fresh, clean, and balanced.",
    price: 58.0,
    brand: "novexpert",
    category: "Cleansers",
    image: "/black-cleanser-tube-clay.jpg",
    benefits: ["Detoxifies skin", "Purifies pores", "Controls excess oil", "French green clay"],
  },
  {
    id: "pe-mask-001",
    name: "Clarifying Charcoal Mask",
    description:
      "Activated charcoal mask that draws out impurities and refines pores. Leaves skin clear and refreshed.",
    detailedDescription:
      "Experience a deep detox with this powerful activated charcoal and bentonite clay mask. Enhanced with salicylic acid and tea tree oil, it draws out impurities, unclogs pores, and absorbs excess sebum. Use weekly for clearer, more refined skin. Suitable for oily and combination skin types.",
    price: 88.0,
    brand: "novexpert",
    category: "Masks",
    image: "/black-mask-jar-charcoal.jpg",
    benefits: ["Deep pore cleansing", "Refines texture", "Detoxifies", "Mattifies skin"],
  },
  {
    id: "pe-oil-001",
    name: "Pure Botanical Face Oil",
    description: "Luxurious blend of organic oils that nourishes and restores skin's natural balance. Non-comedogenic.",
    detailedDescription:
      "A harmonious blend of seven precious oils including jojoba, argan, rosehip, and squalane. This lightweight yet nourishing oil absorbs quickly to balance, repair, and protect all skin types. The non-comedogenic formula won't clog pores. Use day or night for radiant, healthy-looking skin.",
    price: 98.0,
    brand: "novexpert",
    category: "Oils",
    image: "/black-face-oil-dropper.jpg",
    benefits: ["100% natural oils", "Balances all skin types", "Non-greasy absorption", "Multi-purpose use"],
  },
  {
    id: "pe-exfoliant-001",
    name: "Gentle Enzyme Exfoliant",
    description: "Natural fruit enzyme exfoliant that gently removes dead skin cells. Reveals smooth, glowing skin.",
    detailedDescription:
      "This powder-to-foam exfoliant uses papaya and pineapple enzymes combined with rice powder for gentle yet effective exfoliation. Unlike harsh scrubs, enzymes dissolve dead skin cells without irritation. Use 2-3 times weekly for brighter, smoother, more even-toned skin. Suitable for sensitive skin.",
    price: 72.0,
    brand: "novexpert",
    category: "Exfoliants",
    image: "/black-exfoliant-tube.jpg",
    benefits: ["Gentle enzyme action", "Natural fruit enzymes", "Brightens complexion", "Smooths texture"],
  },
  {
    id: "pe-mist-001",
    name: "Hydrating Herbal Mist",
    description: "Botanical face mist that hydrates, soothes, and refreshes skin anytime, anywhere.",
    detailedDescription:
      "This multi-purpose mist combines aloe vera, lavender, and chamomile in a hydrating base. Spritz to set makeup, refresh throughout the day, or soothe irritated skin. The fine mist delivers instant hydration without disturbing makeup. Keep in your bag for on-the-go refreshment.",
    price: 42.0,
    brand: "novexpert",
    category: "Mists",
    image: "/black-mist-bottle-herbal.jpg",
    benefits: ["Instant hydration", "Soothes irritation", "Sets makeup", "Calming botanicals"],
  },
  {
    id: "pe-retinol-001",
    name: "Plant-Based Retinol Alternative",
    description: "Gentle retinol alternative derived from bakuchiol. Delivers anti-aging results without irritation.",
    detailedDescription:
      "Get all the benefits of retinol without the sensitivity. This serum features bakuchiol, a plant-derived ingredient clinically proven to reduce wrinkles and improve firmness like retinol - but without irritation or sun sensitivity. Enhanced with peptides and niacinamide for maximum anti-aging results.",
    price: 105.0,
    brand: "novexpert",
    category: "Treatments",
    image: "/black-retinol-bottle.jpg",
    benefits: ["Retinol alternative", "No irritation", "Reduces wrinkles", "Improves firmness"],
  },
]

export function getProductsByBrand(brand: "topicrem" | "novexpert") {
  return products.filter((p) => p.brand === brand)
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function getBrandInfo(brand: "topicrem" | "novexpert") {
  const brands = {
    "topicrem": {
      name: "Topicrem",
      tagline: "Dermatological Expertise for All Skin Types",
      description:
        "Topicrem offers dermatologically tested skincare solutions designed for sensitive and demanding skin. Trusted by dermatologists worldwide for over 20 years.",
      color: "primary",
      logo: "/topicremlogo.png",
      instagram: "https://www.instagram.com/topicrem_jordan?igsh=eDgxajhjc3BjZXU2",
    },
    "novexpert": {
      name: "Novexpert",
      tagline: "Expert Science, Natural Innovation",
      description:
        "Novexpert combines scientific expertise with natural ingredients to create powerful anti-aging and skin health solutions. Made in France with proven efficacy.",
      color: "accent",
      logo: "/novexpert.png",
      instagram: "https://www.instagram.com/novexpertjo?igsh=c3B0eXJyZWU0b3pi",
    },
  }
  return brands[brand]
}
