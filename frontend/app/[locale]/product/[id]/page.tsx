'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Leaf, BookOpen, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/cart-provider';

interface Product {
  id: string;
  name: string | { en: string; ar: string };
  brand: string;
  category?: string;
  description?: string | { en: string; ar: string };
  howToUse?: string | { en: string; ar: string };
  benefits?: string | { en: string; ar: string };
  ingredients?: string | { en: string; ar: string };
  price: number;
  texture?: string;
  skinType?: string;
  images?: string[];
}

function getField(val: string | { en: string; ar: string } | undefined, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return lang === 'ar' ? val.ar : val.en;
}

function parseBullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/[•\n,]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const locale = useLocale();
  const lang = locale === 'ar' ? 'ar' : 'en';
  const isRTL = lang === 'ar';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false)

  const { addToCart } = useCart()

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-400 text-lg">Product not found.</p>
          <Link href={`/${locale}`} className="mt-4 inline-block text-primary underline">
            Back to Home
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const name = getField(product.name, lang);
  const description = getField(product.description, lang);
  const howToUse = getField(product.howToUse, lang);
  const benefits = getField(product.benefits, lang);
  const ingredients = getField(product.ingredients, lang);
  const images = product.images?.length ? product.images : ['/placeholder.jpg'];
  const brandSlug = product.brand?.toLowerCase() === 'topicrem' ? 'topicrem' : 'novexpert';

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Back link */}
        <Link
          href={`/${locale}/brand/${brandSlug}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to {product.brand}
        </Link>

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">

          {/* Images */}
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm mb-3">
              <Image
                src={images[selectedImage]}
                alt={name}
                fill
                className="object-contain p-6"
                unoptimized={images[selectedImage]?.startsWith('data:')}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === i ? 'border-pink-400' : 'border-gray-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized={img?.startsWith('data:')} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.category && (
                <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-gray-300 text-gray-600">
                  {product.category}
                </span>
              )}
              <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-gray-300 text-gray-600">
                {product.brand}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{name}</h1>
            



            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {product.price}
                </span>
                <span className="text-lg text-gray-400 font-medium">JOD</span>
                {product.texture && (
                  <span className="text-sm text-gray-400 font-medium">/ {product.texture}</span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                addToCart({
                  id: product.id || id,
                  name: getField(product.name, lang),
                  price: product.price,
                  brand: product.brand,
                  image: images[0] || '',
                });
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
              }}
              className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: addedToCart ? '#22c55e' : '#ec4899' }}
            >
              {addedToCart ? (
                <>✓ Added to Cart!</>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            {(product.texture || product.skinType) && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {product.texture && (
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-primary text-base">🧴</span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Texture</p>
                      <p className="text-sm font-semibold text-gray-700">{product.texture}</p>
                    </div>
                  </div>
                )}
                {product.skinType && (
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-primary text-base">✨</span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Skin Type</p>
                      <p className="text-sm font-semibold text-gray-700">{product.skinType}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTIONS */}
        <div className="grid md:grid-cols-2 gap-6">

          {description && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-purple-400" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Description</h2>
              </div>
              <ul className="space-y-2">
                {parseBullets(description).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-purple-400 mt-0.5 font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {benefits && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-pink-400" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Benefits</h2>
              </div>
              <ul className="space-y-2">
                {parseBullets(benefits).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-pink-400 mt-0.5 font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ingredients && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="text-green-400" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Ingredients</h2>
              </div>
              {(() => {
                const match = ingredients.match(/^([\s\S]*?)key\s*ingredient[s]?[^a-z]([\s\S]*)$/i)
                if (match) {
                  const spotlight = match[1].trim()
                  const key = match[2].trim()
                  return (
                    <div className="space-y-4">
                      {spotlight && (
                        <div>
                          <p className="text-sm font-semibold text-primary mb-2">Spotlight Ingredient</p>
                          <ul className="space-y-1">
                            {parseBullets(spotlight).map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-green-400 font-bold mt-0.5">✓</span>{b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {key && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Key Ingredients</p>
                          <div className="flex flex-wrap gap-2">
                            {parseBullets(key).map((b, i) => (
                              <span key={i} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
                return <p className="text-sm text-gray-600 leading-relaxed">{ingredients}</p>
              })()}
            </div>
          )}

          {howToUse && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-blue-400" size={20} />
                <h2 className="text-lg font-bold text-gray-900">How to Use</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{howToUse}</p>
            </div>
          )}

          {product.skinType && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-amber-400" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Skin Type</h2>
              </div>
              <p className="text-sm text-gray-600">{product.skinType}</p>
            </div>
          )}

        </div>
      </div>

      <SiteFooter />
    </div>
  );
}