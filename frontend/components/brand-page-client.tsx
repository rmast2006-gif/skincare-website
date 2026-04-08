"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { BRAND_CATEGORIES } from "@/lib/categories";

interface DBProduct {
  _id?: string;
  id?: string;
  name: { en: string; ar: string } | string;
  description: { en: string; ar: string } | string;
  brand: string;
  price: number;
  images: string[];
  category?: string;
  skinType?: string;
  howToUse?: { en: string; ar: string } | string;
}

interface BrandPageClientProps {
  brand: "topicrem" | "novexpert";
  brandInfo: {
    name: string;
    tagline: string;
    description: string;
    color: string;
    logo: string;
    instagram: string;
  };
  products: any[];
  lines: string[];
}

function getField(
  val: string | { en: string; ar: string } | undefined,
  lang = "en"
): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "ar" ? val.ar : val.en;
}

function DBProductCard({
  product,
  lang,
}: {
  product: DBProduct;
  lang: string;
}) {
  const id = product._id || product.id || "";
  const name = getField(product.name, lang);
  const description = getField(product.description, lang);
  const image = product.images?.[0] || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">

      {/* Image */}
      <Link href={`/product/${id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-white">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">

        {/* Category badge */}
        {product.category && (
          <span className="inline-block self-start text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide mb-3 border border-gray-200 text-gray-500 bg-white">
            {product.category}
          </span>
        )}

        {/* Name */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{description}</p>

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold text-gray-900">
              {product.price}
            </span>
            <span className="text-sm font-medium text-gray-400">JOD</span>
          </div>

          {/* Skin Type */}
          {product.skinType && (
            <p className="text-xs text-gray-500 mb-4">
              <span className="font-semibold">FOR:</span> {product.skinType.toUpperCase()}
            </p>
          )}

          {/* View Details button only */}
          <Link
            href={`/product/${id}`}
            className="block w-full text-center text-sm font-semibold py-3 rounded-xl transition-all hover:opacity-90 text-white"
            style={{ background: '#ec4899' }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export function BrandPageClient({
  brand,
  brandInfo,
  products,
}: BrandPageClientProps) {
  const tBrand = useTranslations("BrandPages");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get available categories from products
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories).sort();
  }, [products]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Group products by category for "all" view
  const productsByCategory = useMemo(() => {
    if (selectedCategory !== 'all') return {};
    
    const grouped: Record<string, DBProduct[]> = {};
    filteredProducts.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [filteredProducts, selectedCategory]);

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    >
      <SiteHeader />

      {/* Brand Hero */}
      <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-32 h-32 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden"
            >
              <Image
                src={brandInfo.logo}
                alt={`${brandInfo.name} Logo`}
                width={96}
                height={96}
                className="object-contain"
                priority
                onError={(e) => {
                  console.error(`Failed to load logo: ${brandInfo.logo}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold tracking-tight"
            >
              {brandInfo.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-xl md:text-2xl font-semibold ${
                brand === "topicrem" ? "text-primary" : "text-accent"
              }`}
            >
              {brandInfo.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {brandInfo.description}
            </motion.p>

            {/* ✅ FIXED PART */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href={brandInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  brand === "topicrem"
                    ? "bg-primary/10 hover:bg-primary/20 text-primary"
                    : "bg-accent/10 hover:bg-accent/20 text-accent"
                }`}
              >
                <Instagram className="w-5 h-5" />
                <span className="font-medium">
                  {tBrand(`${brand}.followButton`)}
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter Pills */}
          {availableCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Products ({products.length})
                </button>
                {availableCategories.map(category => {
                  const count = products.filter(p => p.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products Display */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No products found for this brand yet.
            </div>
          ) : selectedCategory === 'all' ? (
            // Grouped by category view
            Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category} className="mb-12">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{category}</h2>
                  <p className="text-muted-foreground">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <DBProductCard
                      key={product._id || product.id}
                      product={product}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Single category view
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{selectedCategory}</h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <DBProductCard
                    key={product._id || product.id}
                    product={product}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}