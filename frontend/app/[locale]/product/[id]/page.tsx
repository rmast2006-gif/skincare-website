'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Leaf, BookOpen, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

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

interface OrderFormData {
  name: string;
  whatsappNumber: string;
  email: string;
  address: string;
  quantity: number;
  notes: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [finalPrice, setFinalPrice] = useState(0)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderFormData>({
    defaultValues: { quantity: 1 }
  });

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

const handleApplyCoupon = async () => {
    setCouponError('')
    setCouponSuccess('')
    if (!couponCode.trim()) return setCouponError('Enter a coupon code')
    if (!product) return

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, productIds: [product.id] }),
      })
      const data = await res.json()
      if (!res.ok) return setCouponError(data.error || 'Invalid coupon')

      const discounted = product.price * (1 - data.discount / 100)
      setDiscount(data.discount)
      setFinalPrice(discounted)
      setCouponApplied(true)
      setCouponSuccess(`${data.discount}% discount applied!`)
    } catch (e) {
      setCouponError('Failed to apply coupon')
    }
  }
  const onSubmit = async (data: OrderFormData) => {
    if (!product) return;
    const name = getField(product.name, lang);
    const qty = Number(data.quantity) || 1;
    const unitPrice = couponApplied ? finalPrice : product.price
    const total = (unitPrice * qty).toFixed(2);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.name,
          customerPhone: data.whatsappNumber,
          customerEmail: data.email,
          customerAddress: data.address,
          productName: name,
          brand: product.brand,
          quantity: qty,
          price: product.price,
          total: Number(total),
          notes: data.notes,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    const message = `New Order - Topicrem & Novexpert

Customer Information:
Name: ${data.name}
Phone: ${data.whatsappNumber}
Email: ${data.email}
Address: ${data.address}

Order Details:
1. ${name}
   Brand: ${product.brand}
   Quantity: ${qty}
   Price per unit: ${unitPrice.toFixed(2)} JOD
   ${couponApplied ? `Coupon: ${couponCode} (-${discount}%)` : ''}

Total: ${total} JOD
Notes: ${data.notes || '—'}`;

    window.open(`https://wa.me/962780686156?text=${encodeURIComponent(message)}`, '_blank');
   setIsModalOpen(false);
    reset();
    setCouponCode('')
    setCouponApplied(false)
    setCouponSuccess('')
    setCouponError('')
    setDiscount(0)
    setFinalPrice(0)
  };

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

            {/* WhatsApp Order Button */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <button
                  className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: '#ec4899' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Order on WhatsApp
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Order via WhatsApp</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...register("name", { required: "Name is required" })} placeholder="Enter your full name" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                    <Input id="whatsappNumber" {...register("whatsappNumber", { required: "WhatsApp number is required" })} placeholder="e.g. +962 78 123 4567" />
                    {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" {...register("email", { required: "Email is required" })} placeholder="Enter your email" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea id="address" {...register("address", { required: "Address is required" })} placeholder="Enter your delivery address" rows={3} />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      {...register("quantity", {
                        required: "Quantity is required",
                        min: { value: 1, message: "Minimum 1" },
                        valueAsNumber: true
                      })}
                    />
                    {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
                  </div>
                  {/* Coupon Code */}
                  <div>
                    <Label>Coupon Code (optional)</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        disabled={couponApplied}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponApplied}
                        className="px-3 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                        style={{ background: '#c9a96e' }}
                      >
                        {couponApplied ? '✓' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                    {couponSuccess && <p className="text-green-600 text-xs mt-1">{couponSuccess}</p>}
                    {couponApplied && (
                      <div className="flex items-center justify-between mt-2 bg-green-50 px-3 py-2 rounded-lg">
                        <span className="text-xs text-green-700 font-medium">
                          Price after discount: {finalPrice.toFixed(2)} JOD
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCouponApplied(false)
                            setCouponCode('')
                            setCouponSuccess('')
                            setCouponError('')
                            setDiscount(0)
                            setFinalPrice(0)
                          }}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes (optional)</Label>
                    <Textarea id="notes" {...register("notes")} placeholder="Any special instructions" rows={2} />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-pink-500 hover:bg-pink-600 transition-all">
                    Send Order via WhatsApp
                  </button>
                </form>
              </DialogContent>
            </Dialog>

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