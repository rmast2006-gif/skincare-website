"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/navigation";
import type { Product } from "@/lib/products";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface OrderFormData {
  name: string;
  whatsappNumber: string;
  email: string;
  address: string;
  notes: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("Product");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderFormData>();

  const name = locale === "ar" ? product.name.ar : product.name.en;
  const description = locale === "ar" ? product.description.ar : product.description.en;
  const image = product.images[0] || "/placeholder.jpg";

  const onSubmit = async (data: OrderFormData) => {
    try {
      const orderData = {
        customerName: data.name,
        customerPhone: data.whatsappNumber,
        customerEmail: data.email,
        customerAddress: data.address,
        productName: name,
        brand: product.brand,
        quantity: 1,
        price: product.price,
        notes: data.notes,
      };
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      console.error('Error saving order:', error);
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
   Quantity: 1
   Price: ${product.price} JOD

Total: ${product.price} JOD
Suggestion: ${data.notes || ''}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+962780686156?text=${encodedMessage}`, '_blank');
    setIsModalOpen(false);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">

        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gray-50">
          <Link href={`/product/${product.id}`}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          {product.category && (
            <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide uppercase"
              style={{ background: '#f3f4f6', color: '#374151' }}>
              {product.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
            <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
              {name}
            </Link>
          </h3>

          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{description}</p>

          {product.skinType && (
            <p className="text-xs text-gray-400 mb-3">
              <span className="font-medium text-gray-500">FOR:</span> {product.skinType.toUpperCase()}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold" style={{ color: '#c9a96e' }}>
              {product.price} <span className="text-sm font-medium text-gray-400">JOD</span>
            </span>
          </div>

          <div className="flex gap-2 mt-3">
            <Link
              href={`/product/${product.id}`}
              className="flex-1 text-center text-xs font-medium py-2.5 rounded-xl transition-all"
              style={{ background: '#ec4899', color: '#fff' }}
            >
              View Details
            </Link>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <button
                  className="flex-1 text-xs font-medium py-2.5 rounded-xl transition-all hover:opacity-90"
                  style={{ background: '#22c55e', color: '#fff' }}
                >
                  {t("orderWhatsApp")}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Order via WhatsApp</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                    <Input
                      id="whatsappNumber"
                      {...register("whatsappNumber", { required: "WhatsApp number is required" })}
                      placeholder="e.g. +962 78 123 4567"
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      {...register("address", { required: "Address is required" })}
                      placeholder="Enter your delivery address"
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="Any special instructions or notes"
                      rows={2}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Send Order via WhatsApp
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}