import { notFound } from "next/navigation";
import { getBrandInfo } from "@/lib/products";
import { BrandPageClient } from "@/components/brand-page-client";
import { getTranslations, setRequestLocale } from "next-intl/server";

// ✅ Allow ISR without static generation during build
export const revalidate = 60; // Revalidate every 60 seconds

type BrandSlug = "topicrem" | "novexpert";
type BrandName = "Topicrem" | "Novexpert";

export function generateStaticParams() {
  return [{ slug: "topicrem" }, { slug: "novexpert" }];
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  // ✅ FIX 1: unwrap params (Next.js 16 requirement)
  const { slug, locale } = await params;

  // ✅ FIX 2: set locale properly
  setRequestLocale(locale);

  if (slug !== "topicrem" && slug !== "novexpert") {
    notFound();
  }

  const brandSlug: BrandSlug = slug;

  const brandMap: Record<BrandSlug, BrandName> = {
    topicrem: "Topicrem",
    novexpert: "Novexpert",
  };

  const brand: BrandName = brandMap[brandSlug];

  const baseBrandInfo = getBrandInfo(brand);

  const t = await getTranslations("BrandPages");

  const brandInfo = {
    ...baseBrandInfo,
    name: baseBrandInfo.name,
    tagline: t(`${brandSlug}.tagline`),
    description: t(`${brandSlug}.description`),
  };

  // ✅ FIX: Use relative API path for server-side fetch during build
  let products = [];
try {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(
    `${baseUrl}/api/products?brand=${brand}`,
    { cache: 'no-store' }
  );
  if (response.ok) {
    products = await response.json();
  }
} catch (err) {
  console.error('Error fetching products:', err);
  products = [];
}
  const lines: string[] = [];

  return (
    <BrandPageClient
      brand={brandSlug}
      brandInfo={brandInfo}
      products={products}
      lines={lines}
    />
  );
}