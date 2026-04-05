"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import type { Product } from "@/lib/products-data";
import { ProductCard } from "@/components/product-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  products: Product[];
  lines: string[];
}

export function BrandPageClient({
  brand,
  brandInfo,
  products,
  lines,
}: BrandPageClientProps) {
  const t = useTranslations("Product");
  const tBrand = useTranslations("BrandPages");
  const tNav = useTranslations("Nav");
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  // Filter products by selected line
  const filteredProducts = selectedLine
    ? products.filter((p) => p.line === selectedLine)
    : products;

  // Group products by line for display
  const productsByLine = lines.reduce((acc, line) => {
    acc[line] = products.filter((p) => p.line === line);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative w-32 h-32 mx-auto bg-white rounded-2xl shadow-xl p-4"
            >
              <Image
                src={brandInfo.logo}
                alt={`${brandInfo.name} Logo`}
                fill
                className="object-contain p-4"
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

      {/* Product Lines Filter */}
      <section className="border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium mr-2">{t("line")}:</span>
              <Button
                variant={selectedLine === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLine(null)}
              >
                {t("allProducts")} ({products.length})
              </Button>
              {lines.map((line) => (
                <Button
                  key={line}
                  variant={selectedLine === line ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLine(line)}
                >
                  {line} ({productsByLine[line]?.length || 0})
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        {selectedLine === null ? (
          // Show all products grouped by line
          <div className="space-y-16 max-w-7xl mx-auto">
            {lines.map((line, lineIndex) => {
              const lineProducts = productsByLine[line] || [];
              if (lineProducts.length === 0) return null;

              return (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: lineIndex * 0.1 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">{line}</h2>
                    <p className="text-muted-foreground">
                      {lineProducts.length}{" "}
                      {lineProducts.length === 1 ? t("product") : t("products")}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {lineProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Show filtered products
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{selectedLine}</h2>
              <p className="text-muted-foreground">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? t("product") : t("products")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
