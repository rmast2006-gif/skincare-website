"use client";

import type React from "react";

import { useState } from "react";
import { Link, useRouter } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("Checkout");
  const tCart = useTranslations("Cart");
  const { items, total, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [discount, setDiscount] = useState(0)
  const [applicableProductIds, setApplicableProductIds] = useState<string[]>([])
  const [couponApplied, setCouponApplied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader showBackButton />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-24"
        >
          <div className="max-w-md mx-auto text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto"
            >
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold"
            >
              {tCart("empty")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              {tCart("emptyDescription")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/">
                <Button size="lg">{t("continueShopping")}</Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create order message for WhatsApp
    let message = `*${t("title")} - Topicrem & Novexpert*\n\n`;
    message += `*${t("customerInformation")}:*\n`;
    message += `${t("fullName")}: ${formData.name}\n`;
    message += `${t("phone")}: ${formData.phone}\n`;
    message += `${t("email")}: ${formData.email}\n`;
    message += `${t("address")}: ${formData.address}, ${formData.city}\n\n`;

    message += `*${t("orderSummary")}:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   ${t("qty")}: ${item.quantity}\n`;
      message += `   ${(item.price * item.quantity).toFixed(2)} ${tCart(
        "jod"
      )}\n\n`;
    });

    message += `*${t("total")}: ${total.toFixed(2)} ${tCart("jod")}*\n`;

    if (formData.notes) {
      message += `\n${t("notes")}: ${formData.notes}`;
    }

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "+962780686156";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Clear cart and redirect
    clearCart();

    // Open WhatsApp in new tab
    window.open(whatsappURL, "_blank");

    // Redirect to confirmation page
    router.push("/order-confirmed");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleApplyCoupon = async () => {
    setCouponError('')
    setCouponSuccess('')
    if (!couponCode.trim()) return setCouponError('Enter a coupon code')

    const productIds = items.map(item => item.id)

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, productIds }),
      })
      const data = await res.json()

      if (!res.ok) return setCouponError(data.error || 'Invalid coupon')

      setDiscount(data.discount)
      setApplicableProductIds(data.applicableProductIds)
      setCouponApplied(true)
      setCouponSuccess(`Coupon applied! ${data.discount}% off`)
    } catch (e) {
      setCouponError('Failed to apply coupon')
    }
  }

  const discountedTotal = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity
    if (couponApplied && (applicableProductIds.includes(item.id) || applicableProductIds.length === items.length)) {
      return acc + itemTotal * (1 - discount / 100)
    }
    return acc + itemTotal
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showBackButton backHref="/cart" />

      {/* Checkout Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold mb-8"
          >
            {t("title")}
          </motion.h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Customer Information Form */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("customerInformation")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("fullName")} *</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("phone")} *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+962 7X XXX XXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t("email")} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">{t("address")} *</Label>
                        <Input
                          id="address"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">{t("city")} *</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">{t("notes")}</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder={t("notesPlaceholder")}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>{t("orderSummary")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="flex justify-between text-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-muted-foreground text-xs">{`${t(
                                "qty"
                              )}: ${item.quantity}`}</p>
                            </div>
                            <span className="font-medium ml-2">{`${(
                              item.price * item.quantity
                            ).toFixed(2)} ${tCart("jod")}`}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Coupon Input */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Coupon Code</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
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
                        {couponError && (
                          <p className="text-red-500 text-xs">{couponError}</p>
                        )}
                        {couponSuccess && (
                          <p className="text-green-600 text-xs">{couponSuccess}</p>
                        )}
                        {couponApplied && (
                          <button
                            type="button"
                            onClick={() => {
                              setCouponApplied(false)
                              setDiscount(0)
                              setCouponCode('')
                              setCouponSuccess('')
                              setApplicableProductIds([])
                            }}
                            className="text-xs text-red-400 hover:text-red-600"
                          >
                            Remove coupon
                          </button>
                        )}
                      </div>

                      <div className="border-t border-border pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t("subtotal")}
                          </span>
                          <span className="font-medium">{`${total.toFixed(2)} ${tCart("jod")}`}</span>
                        </div>
                        {couponApplied && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">Discount ({discount}%)</span>
                            <span className="text-green-600 font-medium">
                              -{(total - discountedTotal).toFixed(2)} {tCart("jod")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t("shipping")}
                          </span>
                          <span className="font-medium">{t("free")}</span>
                        </div>
                        <div className="border-t border-border pt-2">
                          <div className="flex justify-between">
                            <span className="font-bold text-lg">
                              {t("total")}
                            </span>
                            <span className="font-bold text-2xl">
                              {`${discountedTotal.toFixed(2)} ${tCart("jod")}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button type="submit" size="lg" className="w-full">
                          {t("placeOrder")}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
