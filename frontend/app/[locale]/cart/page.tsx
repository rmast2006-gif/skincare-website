"use client";

import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CartPage() {
  const t = useTranslations("Cart");
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const VALID_COUPON = "SKIN20";
  const DISCOUNT_PERCENTAGE = 20;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === VALID_COUPON) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError(t("invalidCoupon"));
      setCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
    setCouponError("");
  };

  const discount = couponApplied ? (total * DISCOUNT_PERCENTAGE) / 100 : 0;
  const finalTotal = total - discount;

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
              {t("empty")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              {t("emptyDescription")}
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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showBackButton />

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">{`${itemCount} ${
              itemCount === 1 ? t("itemsInCart") : t("itemsInCartPlural")
            }`}</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-24 h-24 rounded-lg bg-secondary overflow-hidden flex-shrink-0"
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-4 mb-2">
                              <div>
                                <h3 className="font-bold leading-tight">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {item.brand.replace("-", " ")}
                                </p>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.id)}
                                  className="flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                                <motion.span
                                  key={item.quantity}
                                  initial={{ scale: 1.2 }}
                                  animate={{ scale: 1 }}
                                  className="w-8 text-center font-medium"
                                >
                                  {item.quantity}
                                </motion.span>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <motion.p
                                  key={item.quantity}
                                  initial={{ scale: 1.1 }}
                                  animate={{ scale: 1 }}
                                  className="font-bold text-lg"
                                >
                                  {`${(item.price * item.quantity).toFixed(
                                    2
                                  )} ${t("jod")}`}
                                </motion.p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-muted-foreground">{`${item.price.toFixed(
                                    2
                                  )} ${t("jod")} ${t("each")}`}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-xl font-bold">{t("orderSummary")}</h2>

                    {/* Coupon Code Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {t("haveCoupon")}
                        </span>
                      </div>

                      {!couponApplied ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder={t("enterCode")}
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                setCouponError("");
                              }}
                              className="flex-1"
                            />
                            <Button
                              onClick={handleApplyCoupon}
                              variant="outline"
                              className="whitespace-nowrap"
                            >
                              {t("apply")}
                            </Button>
                          </div>
                          {couponError && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 text-red-500 text-sm"
                            >
                              <X className="h-4 w-4" />
                              <span>{couponError}</span>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              {t("couponApplied")}
                            </span>
                          </div>
                          <Button
                            onClick={handleRemoveCoupon}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            {t("remove")}
                          </Button>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-3 border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("subtotal")}
                        </span>
                        <motion.span
                          key={total}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          className="font-medium"
                        >
                          {`${total.toFixed(2)} ${t("jod")}`}
                        </motion.span>
                      </div>

                      {couponApplied && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-green-600 dark:text-green-400">
                            {`${t("discount")} (${DISCOUNT_PERCENTAGE}%)`}
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {`-${discount.toFixed(2)} ${t("jod")}`}
                          </span>
                        </motion.div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("shipping")}
                        </span>
                        <span className="font-medium">{t("free")}</span>
                      </div>

                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg">
                            {t("total")}
                          </span>
                          <motion.span
                            key={finalTotal}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="font-bold text-2xl"
                          >
                            {`${finalTotal.toFixed(2)} ${t("jod")}`}
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/checkout">
                        <Button size="lg" className="w-full">
                          {t("proceedToCheckout")}
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          {t("continueShopping")}
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
