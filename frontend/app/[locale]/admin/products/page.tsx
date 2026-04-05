'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface Product {
  id: string;
  name: string | { en: string; ar: string };
  brand: string | { en: string; ar: string };
  type?: string;
  category?: string;
  description?: string | { en: string; ar: string };
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

export default function ProductsPage() {
  const locale = useLocale();
  const lang = locale === 'ar' ? 'ar' : 'en';
  const isRTL = lang === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const brands = ['all', 'Topicrem', 'Novexpert'];

  const filtered = products.filter(p => {
    const name = getField(p.name, lang).toLowerCase();
    const brand = getField(p.brand, lang).toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || brand.includes(search.toLowerCase());
    const matchBrand =
      activeBrand === 'all' ||
      getField(p.brand, 'en').toLowerCase() === activeBrand.toLowerCase();
    return matchSearch && matchBrand;
  });

  const t = {
    title: lang === 'ar' ? 'منتجاتنا' : 'Our Products',
    subtitle: lang === 'ar' ? 'اكتشف مجموعتنا من منتجات العناية بالبشرة' : 'Discover our curated skincare collection',
    search: lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...',
    all: lang === 'ar' ? 'الكل' : 'All',
    noProducts: lang === 'ar' ? 'لا توجد منتجات' : 'No products found',
    viewDetails: lang === 'ar' ? 'عرض التفاصيل' : 'View Details',
    skinType: lang === 'ar' ? 'نوع البشرة' : 'Skin Type',
    addToCart: lang === 'ar' ? 'أضف للسلة' : 'Add to Cart',
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* HERO BANNER */}
      <div className="py-16 px-6 text-center" style={{ background: '#0a0a0a' }}>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c9a96e' }}>
          Topicrem · Novexpert
        </p>
        <h1 className="text-4xl font-bold text-white mb-3">{t.title}</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">{t.subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* FILTERS ROW */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            {brands.map(b => (
              <button
                key={b}
                onClick={() => setActiveBrand(b)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  activeBrand === b
                    ? { background: '#c9a96e', color: '#fff' }
                    : { background: '#fff', color: '#71717a', border: '1px solid #e5e7eb' }
                }
              >
                {b === 'all' ? t.all : b}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg text-sm border border-gray-200 bg-white outline-none focus:border-amber-300 transition-all"
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 text-gray-300 text-sm">{t.noProducts}</div>
        )}

        {/* PRODUCT GRID */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={getField(product.name, lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs">
                      No image
                    </div>
                  )}
                  <span
                    className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#0a0a0a', color: '#c9a96e' }}
                  >
                    {getField(product.brand, lang)}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-0.5">{product.type || product.skinType || ''}</p>
                  <h3 className="font-semibold text-sm text-gray-900 leading-snug mb-1 line-clamp-2">
                    {getField(product.name, lang)}
                  </h3>
                  {product.skinType && (
                    <p className="text-xs text-gray-400 mb-2">{t.skinType}: {product.skinType}</p>
                  )}
                  <p className="text-base font-bold mb-3" style={{ color: '#c9a96e' }}>
                    {product.price} JOD
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/product/${product.id}`}
                      className="flex-1 text-center text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      {t.viewDetails}
                    </Link>
                    <button
                      className="flex-1 text-xs py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
                      style={{ background: '#c9a96e' }}
                      onClick={() => {
                        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                        const existing = cart.find((i: any) => i.id === product.id);
                        if (existing) {
                          existing.quantity += 1;
                        } else {
                          cart.push({
                            id: product.id,
                            name: getField(product.name, lang),
                            brand: getField(product.brand, lang),
                            price: product.price,
                            image: product.images?.[0] || '',
                            quantity: 1,
                          });
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.dispatchEvent(new Event('cartUpdated'));
                      }}
                    >
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}