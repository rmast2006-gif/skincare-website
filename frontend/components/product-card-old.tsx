"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/navigation";
import type { Product } from "@/lib/products";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("Product");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  // Get localized name and description
  const name = locale === "ar" ? product.name.ar : product.name.en;
  const description = locale === "ar" ? product.description.ar : product.description.en;

  // Get first image
  const image = product.images[0] || "/placeholder.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <Link href={`/product/${product.id}`}>
              <Image
                src={image}
                alt={name}
                width={400}
                height={400}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {product.brand}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              <Link
                href={`/product/${product.id}`}
                className="hover:text-primary transition-colors"
              >
                {name}
              </Link>
            </h3>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">
                  {product.price} {tCommon("currency")}
                </span>
              </div>

              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                <Link href={`https://wa.me/+962780686156?text=${encodeURIComponent(`I want to order: ${name}`)}`}>
                  {t("orderWhatsApp")}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
