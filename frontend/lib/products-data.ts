// Complete product data from brands_cleaned.json
import productsJson from "../brands_cleaned.json";

export interface ProductVariant {
  size: string;
  price: string | number;
}

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface LocalizedArray {
  en: string[];
  ar: string[];
}

export interface ProductIngredients {
  main: string[] | LocalizedArray;
  spotlight: string | LocalizedText;
}

export interface ProductDescription {
  en: string | string[];
  ar: string;
}

export interface ProductUsage {
  en: string;
  ar: string;
}

export interface Product {
  id: string;
  brand: "topicrem" | "novexpert";
  line: string;
  name: string;
  variants: ProductVariant[];
  description: ProductDescription;
  texture: string | LocalizedText;
  skinType: string | LocalizedText;
  benefits: string[] | string | LocalizedArray;
  ingredients: ProductIngredients;
  usage: ProductUsage;
  image: string;
}

// Helper function to generate product ID
function generateProductId(brand: string, name: string, index: number): string {
  const brandPrefix = brand === "TOPICREM" ? "tc" : "nx";
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30);
  return `${brandPrefix}-${cleanName}-${index}`;
}

// Helper function to map product image - EXACT 1-to-1 mapping
function mapProductImage(
  productName: string,
  brand: string,
  line?: string
): string {
  // Clean the product name - trim spaces
  const cleanName = productName.trim();

  // Create a unique key combining line and name for duplicates
  const uniqueKey = line ? `${line}|${cleanName}` : cleanName;

  // NOVEXPERT: EXACT mapping - 19 products to 19 images
  // Image names from public/novexpertimage/ folder (WebP format)
  const novexpertImageMap: Record<string, string> = {
    "Vitamin C Serum 25%": "BOOSTER WITH VITAMIN C_2000x2000px.webp",
    "The Peeling Night Cream": "THE PEELING NIGHT CREAM_2000x2000px.webp",
    "HA Serum Booster 3.2%": "BOOSTER SERUM WITH HA_2000x2000px.webp",
    "Expert Anti Aging Cream": "THE EXPERT ANTI-AGING CREAM_2000x2000px.webp",
    "Expert Anti Aging Fluid": "THE EXPERT ANTI-AGING FLUID_2000x2000px.webp",
    LipUp: "LIP'UP_2000x2000px.webp",
    "Expert Antiaging Eye Contour":
      "EXPERT ANTI-AGING EYE CONTOUR_2000x2000px.webp",
    "Radiance Lifting Eye Contour":
      "RADIANCE LIFTING EYE CONTOUR_2000x2000px.webp",
    "Express Radiant Cleansing Foam":
      "EXPRESS RADIANT CLEANSING FOAM_2000x2000px.webp",
    "Expert Exfoliator": "THE EXPERT EXFOLIATOR_2000x2000px.webp",
    "Velvety Hydrobiotic Cream": "VELVETY HYDRO-BIOTIC CREAM_2000x2000px.webp",
    "Magnesium Mist": "MAGNESIUM MIST_2000x2000px.webp",
    "Milky Cleanser Hydro-Biotic":
      "MILKY CLEANSER HYDRO-BIOTIC_2000x2000px.webp",
    "Purifying Gel": "PURIFYING GEL_2000x2000px.webp",
    "Express Blemish Care": "EXPRESS BLEMISH CARE_2000x2000px.webp",
    "Clear Skin Foaming Gel": "CLEAR SKIN FOAMING GEL_2000x2000px.webp",
    "The Caramel Cream light -N 1": "THE CARAMEL CREAM N°1_2000x2000px.webp",
    "The Caramel Cream medium -N 2": "THE CARAMEL CREAM N°2_2000x2000px.webp",
    "Micellar Water With HA": "MICELLAR WATER WITH HA_2000x2000px.webp",
  };

  // TOPICREM: COMPLETE mapping - all products to their specific images
  // Image names from public/topicremimage/ folder (WebP format)
  const topicremImageMap: Record<string, string> = {
    // HYDRA + Line
    "Protective Day Cream SPF50+ 40ml": "HYDRA_PROTECTIVE_DAY_CREAM__40ML.webp",
    "Lip Balm": "HYDRA_LIP_BALM_4G.webp",
    "Gentle Micellar Water": "HYDRA_GENTLE_MICELLAR_WATER_200ML.webp",
    "Gentle Cleansing Milk": "HYDRA_GENTLE_CLEANSING_MILK_200ML.webp",
    "Radiance Tinted   Cream SPF50+   LIGHT":
      "HYDRA_RADIANCE_TINTED_CREAM_LIGHT_40ML.webp",
    "Radiance Tinted   Cream SPF50+   MEDIUM":
      "HYDRA_RADIANCE_TINTED_CREAM_MEDIUM_40ML.webp",
    "Gentle Cleansing Gel": "HYDRA_GENTLE_CLEANSING_GEL_200ML.webp",
    "Radiance Eye Contour": "HYDRA_RADIANCE_EYE_CONTOUR_15ML.webp",
    "Light  Radiance  Cream": "HYDRA_LIGHT_RADIANCE_CREAM_40ML.webp",
    "Rich  Radiance  Cream": "HYDRA_RICH_RADIANCE_CREAM_40ML.webp",
    "Radiance Cream Gel": "HYDRA_RADIANCE_CREAM_GEL_40ML.webp",
    "Moisturizing Radiance Serum":
      "HYDRA_MOISTURIZING_RADIANCE_SERUM_30ML.webp",

    // CALM + Line
    "AR Anti- Redness Daily Cream SPF50+":
      "CALM_AR_ANTI-REDNESS_DAILY_CREAM_40ML (1).webp",
    "Soothing Fluid": "CALM_SOOTHING_FLUID_40ML.webp",
    "CALM +|Soothing Cream": "CALM_SOOTHING_CREAM_40ML.webp",

    // MELA Line
    "Intensive Radiance Serum": "MELA_ANTI-DARK_SPOT_RADIANCE_SERUM_30ML.webp",
    "Unifying Day Cream SPF 50+":
      "MELA_ANTI-DARK_SPOT_UNIFYING_DAY_CREAM_40ML.webp",
    "Gentle Peeling Night Cream":
      "MELA_ANTI-DARK_SPOT_GENTLE_PEELING_NIGHT_CREAM_40ML.webp",
    "Unifying Exfoliating Bar": "MELA_UNIFYING_EXFOLIATING_BAR.webp",
    "Unifying Ultra-Moisturizing Milk SPF 15+":
      "MELA_UNIFYING_ULTRA-MOISTURIZING_MILK_500ML.webp",

    // AC CONTROL Line
    "AC Purifying Cleansing Gel": "AC_CONTROL_PURIFYING_CLEANSING_GEL.webp",
    "Mattifying Fluid": "AC_CONTROL_MATTIFYING_FLUID_40ML.webp",
    "Compensating Moisturizing Cream":
      "AC_CONTROL_COMPENSATING_MOISTURIZING_CREAM_40ML.webp",
    "Balancing Anti-Blemish Care":
      "AC_CONTROL_BALANCING_ANTI_BLEMISH_CARE_40ML.webp",
    "Intensive Serum": "AC_CONTROL_INTENSIVE_SERUM_34ML.webp",

    // AH3 ANTI-AGING Line
    "Anti-Aging Global Serum": "AH3_ANTI-AGING_GLOBAL_SERUM.webp",
    "Global Anti-Aging Fluid": "AH3_GLOBAL_ANTI-AGING_FLUID_FACE.webp",
    "Global Anti-Aging Cream": "AH3_GLOBAL_ANTI-AGIN_CREAM.webp",
    "Global Anti- Aging Eye Contour": "AH3_GLOBAL_ANTI-AGING_EYE_CONTOUR.webp",

    // CICA Line
    "CICA|Soothing Cream": "CICA_SOOTHING_CREAM.webp",

    // DERMO SPECIFIC Line
    "UR10 - Anti-calluses Foot Cream":
      "DERMO_SPECIFIC_UR-10_ANTI-CALLUSES_FOOT_CREAM_BACK_75ML.webp",
    "UR10 Anti-Roughness Smoothing Cream":
      "DERMO_SPECIFIC_UR-10_ANTI-ROUGHNESS_SMOOTHING_CREAM_200ML.webp",
    "PV/DS Cleansing Gel":
      "DERMO_SPECIFIC_PV-DS_CLEANSING_TREATMENT_GEL_200ML.webp",
    "PH5 Gentle Shampoo": "DERMO_SPECIFIC_PH5_GENTLE_SHAMPOO_500ML.webp",

    // DA Line
    "Emollient Balm": "DA_PROTECT_EMOLLIENT_BALM_500ML.webp",
    "Ultra- Rich Cleansing Gel":
      "DA_PROTECT_ULTRA-RICH_CLEANSING_GEL_500ML.webp",

    // KARITE Line
    "Gentle Fortifying Shampoo": "KARITE_GENTLE_FORTIFYING_SHAMPOO_200ML.webp",
    "Nourishing Fortifying Cream":
      "KARITE_NOURISHING_FORTIFYING_CREAM_200ML.webp",
    "Intense Fortifying Mask": "KARITE_INTENSE_FORTIFYING_MASK_250ML.webp",

    // SUN RANGE
    "Moisturizing Sun Milk SPF50+":
      "SUN_PROTECT_MOISTURIZING_SUN_MILK_200ML.webp",

    // UM Line
    "Ultra-Moisturizing 3-IN-1 Gentle Scrub": "UM_3IN1_GENTLE_SCRUB_200ML.webp",
    "Ultra-Moisturizing Hand Cream": "UM_HAND_CREAM_50ML.webp",
  };

  // For NOVEXPERT - return image path from /novexpertimage/ folder
  if (brand === "NOVEXPERT") {
    const imageName = novexpertImageMap[cleanName];
    if (imageName) {
      return `/novexpertimage/${imageName}`;
    }
    // If no image found, return placeholder
    return "/placeholder.jpg";
  }

  // For TOPICREM, first try specific image map, then fall back to category-based placeholders
  if (brand === "TOPICREM") {
    // Try unique key first (for duplicates like "Soothing Cream")
    const specificImage =
      topicremImageMap[uniqueKey] || topicremImageMap[cleanName];
    if (specificImage) {
      return `/topicremimage/${specificImage}`;
    }

    const upperName = cleanName.toUpperCase();
    if (upperName.includes("SPF") || upperName.includes("SUN")) {
      return "/pink-sunscreen-tube.jpg";
    } else if (upperName.includes("SERUM")) {
      return "/pink-serum-bottle-luxury.jpg";
    } else if (upperName.includes("CREAM") || upperName.includes("BALM")) {
      return "/pink-cream-jar-elegant.jpg";
    } else if (
      upperName.includes("CLEANSER") ||
      upperName.includes("GEL") ||
      upperName.includes("FOAM")
    ) {
      return "/pink-cleanser-bottle.jpg";
    } else if (upperName.includes("MASK")) {
      return "/pink-mask-jar-luxury.jpg";
    } else if (upperName.includes("EYE")) {
      return "/pink-eye-cream-tube.jpg";
    } else if (upperName.includes("LIP")) {
      return "/pink-lip-treatment.jpg";
    } else if (
      upperName.includes("TONER") ||
      upperName.includes("MIST") ||
      upperName.includes("WATER")
    ) {
      return "/pink-toner-bottle-spray.jpg";
    }
  }

  // Default fallback
  return "/placeholder.jpg";
}

// Products to EXCLUDE - no images available
const excludedProducts = [
  // Novexpert products without images
  "Booster Serum Polyphenols",
  "Targeted Dark Spot Corrector",
  "Pro Collagen Booster Serum",
  // Topicrem products without images
  "Ultra Moisturizing Body Milk",
];

// Transform the JSON data - FILTER OUT products without images
export const allProducts: Product[] = productsJson
  .filter((item: any) => {
    // Remove products that don't have images (both brands)
    return !excludedProducts.includes(item.name.trim());
  })
  .map((item: any, index: number) => {
    const brand = item.brand === "TOPICREM" ? "topicrem" : "novexpert";

    return {
      id: generateProductId(item.brand, item.name, index),
      brand,
      line: item.line,
      name: item.name.trim(),
      variants: item.variants,
      description: item.description,
      texture: item.texture || "",
      skinType: item.skinType || "",
      benefits: item.benefits,
      ingredients: item.ingredients,
      usage: item.usage,
      image: mapProductImage(item.name, item.brand, item.line),
    };
  });

// Get products by brand
export function getProductsByBrand(brand: "topicrem" | "novexpert"): Product[] {
  return allProducts.filter((p) => p.brand === brand);
}

// Get products by brand and line
export function getProductsByLine(
  brand: "topicrem" | "novexpert",
  line: string
): Product[] {
  return allProducts.filter((p) => p.brand === brand && p.line === line);
}

// Get unique lines for a brand
export function getLinesByBrand(brand: "topicrem" | "novexpert"): string[] {
  const products = getProductsByBrand(brand);
  const lines = [...new Set(products.map((p) => p.line))];
  return lines.sort();
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

// Get brand info
export function getBrandInfo(brand: "topicrem" | "novexpert") {
  const brands = {
    topicrem: {
      name: "Topicrem",
      tagline: "Dermatological Expertise for All Skin Types",
      description:
        "Topicrem offers dermatologically tested skincare solutions designed for sensitive and demanding skin. Trusted by dermatologists worldwide for over 20 years.",
      color: "primary",
      logo: "/topicremlogo.png",
      instagram:
        "https://www.instagram.com/topicrem_jordan?igsh=eDgxajhjc3BjZXU2",
    },
    novexpert: {
      name: "Novexpert",
      tagline: "Expert Science, Natural Innovation",
      description:
        "Novexpert combines scientific expertise with natural ingredients to create powerful anti-aging and skin health solutions. Made in France with proven efficacy.",
      color: "accent",
      logo: "/novexpert.png",
      instagram: "https://www.instagram.com/novexpertjo?igsh=c3B0eXJyZWU0b3pi",
    },
  };
  return brands[brand];
}
