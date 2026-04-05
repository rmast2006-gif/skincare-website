"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/src/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { fetchProductById, type Product } from "@/lib/products";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ArrowLeft,
  Package,
  Droplets,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("Product");
  const tCommon = useTranslations("Common");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProductById(id)
      .then(setProduct)
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) notFound();

  const name = locale === "ar" ? product.name.ar : product.name.en;
  const description = locale === "ar" ? product.description.ar : product.description.en;
  const howToUse = locale === "ar" ? product.howToUse.ar : product.howToUse.en;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {tNav("backToHome")}
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1).map((img, i) => (
                      <div key={i} className="aspect-square bg-white rounded-lg overflow-hidden">
                        <Image
                          src={img}
                          alt={`${name} ${i + 2}`}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.brand}
                  </Badge>
                  <h1 className="text-4xl font-bold mb-4">{name}</h1>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-primary">
                      {product.price}
                    </span>
                    <span className="text-xl text-muted-foreground">
                      {tCommon("jod")}
                    </span>
                  </div>
                </div>

                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-semibold mb-2">{t("description")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                </div>

                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-semibold mb-2">{t("howToUse")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{howToUse}</p>
                </div>

                {/* Order Button */}
                <div className="pt-6 border-t">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
                    asChild
                  >
                    <Link href={`https://wa.me/+962780686156?text=${encodeURIComponent(`I want to order: ${name}`)}`}>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {t("orderWhatsApp")}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}