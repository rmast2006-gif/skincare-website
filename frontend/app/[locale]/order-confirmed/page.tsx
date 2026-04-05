"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function OrderConfirmedPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Confirmation Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
            >
              <CheckCircle className="h-12 w-12 text-primary" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-4xl font-bold text-balance"
          >
            {"Order Sent Successfully!"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg text-muted-foreground text-pretty"
          >
            {
              "Thank you for your order! We've received your details via WhatsApp and will contact you shortly to confirm your purchase."
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="pt-6 space-y-3"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/">
                <Button size="lg" className="w-full">
                  {"Continue Shopping"}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="pt-8 space-y-2"
          >
            <p className="text-sm font-medium">{"What happens next?"}</p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-xs mx-auto">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="flex gap-2"
              >
                <span>{"1."}</span>
                <span>{"We'll review your order details"}</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="flex gap-2"
              >
                <span>{"2."}</span>
                <span>{"You'll receive a confirmation message on WhatsApp"}</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="flex gap-2"
              >
                <span>{"3."}</span>
                <span>{"We'll arrange delivery to your address"}</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
