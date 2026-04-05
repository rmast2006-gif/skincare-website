"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  const t = useTranslations("About");
  const tNav = useTranslations("Nav");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-balance"
              >
                {t("title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed text-pretty"
              >
                {t("subtitle")}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold mb-4">{t("ourStory")}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("storyContent")}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative h-80 rounded-lg overflow-hidden"
                >
                  <Image
                    src="/luxury-pink-skincare-bottles-elegant-minimal.jpg"
                    alt="Luxury skincare products"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Brands */}
        <section className="bg-muted/30 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Topicrem */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-card border border-border rounded-lg p-8"
                >
                  <div className="mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, type: "spring" }}
                      className="relative w-24 h-24 bg-white rounded-xl p-3 shadow-lg mb-4"
                    >
                      <Image
                        src="/topicremlogo.png"
                        alt="Topicrem Logo"
                        fill
                        className="object-contain p-2"
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">
                      {t("topicrem.title")}
                    </h3>
                    <p className="text-sm text-primary font-semibold mb-4">
                      {t("topicrem.subtitle")}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t("topicrem.description")}
                    </p>
                    <div className="space-y-3">
                      <Link href="/brand/topicrem">
                        <Button className="w-full">{tNav("topicrem")}</Button>
                      </Link>
                      <a
                        href="https://www.instagram.com/topicrem_jordan?igsh=eDgxajhjc3BjZXU2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>{t("topicrem.followOnInstagram")}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Novexpert */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-card border border-border rounded-lg p-8"
                >
                  <div className="mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
                      className="relative w-24 h-24 bg-white rounded-xl p-3 shadow-lg mb-4"
                    >
                      <Image
                        src="/novexpert.png"
                        alt="Novexpert Logo"
                        fill
                        className="object-contain p-2"
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">
                      {t("novexpert.title")}
                    </h3>
                    <p className="text-sm text-accent font-semibold mb-4">
                      {t("novexpert.subtitle")}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t("novexpert.description")}
                    </p>
                    <div className="space-y-3">
                      <Link href="/brand/novexpert">
                        <Button variant="outline" className="w-full">
                          {tNav("novexpert")}
                        </Button>
                      </Link>
                      <a
                        href="https://www.instagram.com/novexpertjo?igsh=c3B0eXJyZWU0b3pi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>{t("novexpert.followOnInstagram")}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-center mb-12"
              >
                {t("whyChoose")}
              </motion.h2>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-3xl">🇫🇷</span>
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">
                    {t("frenchExcellence.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("frenchExcellence.description")}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-3xl">💎</span>
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">
                    {t("expertFormulas.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("expertFormulas.description")}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-3xl">✓</span>
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">
                    {t("provenResults.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("provenResults.description")}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring", delay: 0.3 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-3xl">🌸</span>
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">
                    {t("forAllSkin.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("forAllSkin.description")}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
