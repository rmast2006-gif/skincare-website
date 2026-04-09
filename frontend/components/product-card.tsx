
"use client";

import { Link } from "@/src/i18n/navigation";
import type { Product } from "@/lib/products";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from '@/components/cart-provider';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  hideCartButton?: boolean;
}

export function ProductCard({ product, hideCartButton }: ProductCardProps) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const name = locale === "ar" ? product.name.ar : product.name.en;
  const description = locale === "ar" ? product.description.ar : product.description.en;
  const image = product.images[0] || "/placeholder.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">

        <Link href={`/product/${product.id}`} className="block shrink-0">
          <div className="relative overflow-hidden bg-gray-50" style={{ height: '200px' }}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-1">

          {product.category && (
            <span className="inline-block self-start text-xs px-3 py-1 rounded-full font-semibold tracking-wide uppercase mb-2 border border-gray-200 text-gray-500 bg-white">
              {product.category}
            </span>
          )}

          <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2">
            <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
              {name}
            </Link>
          </h3>

          <p className="text-sm text-gray-400 mb-2 line-clamp-2">{description}</p>

          <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-gray-900">
                {product.price}
              </span>
              <span className="text-sm font-medium text-gray-400">JOD</span>
            </div>

            {product.skinType && (
              <p className="text-xs text-gray-500 mb-3">
                <span className="font-semibold">FOR:</span> {product.skinType.toUpperCase()}
              </p>
            )}

            <div className="flex gap-2 mt-3">
              <Link
                href={`/product/${product.id}`}
                className="flex-1 text-center text-xs font-medium py-2.5 rounded-xl transition-all"
                style={{ background: '#ec4899', color: '#fff' }}
              >
                View Details
              </Link>
              {!hideCartButton && (
                <button
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      name: name,
                      price: product.price,
                      brand: product.brand,
                      image: image,
                    });
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                  }}
                  className="flex-1 text-xs font-medium py-2.5 rounded-xl transition-all hover:opacity-90"
                  style={{ background: added ? '#22c55e' : '#ec4899', color: '#fff' }}
                >
                  {added ? '✓ Added!' : '+ Cart'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}