"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Instagram, Shield, Sparkles, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const HERO_SLIDES = [
  {
    src: "/top1.jpeg",
    alt: "Topicrem hydrating skincare",
    brand: "topicrem" as const,
  },
  {
    src: "/nove1.jpeg",
    alt: "Novexpert booster skincare",
    brand: "novexpert" as const,
  },
];

export default function HomePage() {
  const t = useTranslations("Home");
  const tNav = useTranslations("Nav");
  const tCommon = useTranslations("Common");

  const [bannerVisible, setBannerVisible] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [topicremProducts, setTopicremProducts] = useState<Product[]>([]);
  const [novexpertProducts, setNovexpertProducts] = useState<Product[]>([]);
  const bestsellersScrollRef = useRef<HTMLDivElement>(null);

  const closeBanner = () => setBannerVisible(false);

  const scrollBestsellers = (direction: "left" | "right") => {
    const el = bestsellersScrollRef.current;
    if (!el) return;
    const step = 296; // ~one card (280px) + gap (16px)
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching products...');
        const [topicrem, novexpert] = await Promise.all([
          fetchProducts('Topicrem'),
          fetchProducts('Novexpert')
        ]);

        console.log('Topicrem products:', topicrem.length);
        console.log('Novexpert products:', novexpert.length);

        setTopicremProducts(topicrem);
        setNovexpertProducts(novexpert);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Combine products for bestsellers section
  useEffect(() => {
    setAllProducts([...topicremProducts, ...novexpertProducts]);
  }, [topicremProducts, novexpertProducts]);

  const currentSlide = HERO_SLIDES[heroIndex];

  return (
    <div className="min-h-screen bg-background font-gotham">
      {/* Discount Announcement Banner - one row, scrolling on mobile */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-pink-500 via-primary to-pink-600 text-white py-2.5 px-4 sm:py-3 text-center z-50 shadow-lg overflow-hidden"
          >
            <div className="container mx-auto relative flex items-center min-h-[2.5rem] sm:min-h-0">
              {/* Close button - right side, above marquee on mobile */}
              <button
                type="button"
                onClick={closeBanner}
                aria-label="Close banner"
                className="absolute top-1/2 -translate-y-1/2 end-0 sm:end-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-10 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Mobile: single row with scrolling marquee */}
              <div className="flex-1 min-w-0 pe-10 sm:pe-10 overflow-hidden">
                <div className="md:hidden overflow-hidden">
                  <div className="flex animate-marquee w-max">
                    <div className="flex items-center gap-2 shrink-0 text-sm font-semibold whitespace-nowrap pl-4">
                      <span>🎉 <span className="font-bold">{t("specialOffer")}</span> {t("discount")}</span>
                      <span className="bg-white text-primary px-2 py-0.5 rounded font-bold">SKIN20</span>
                      <span>{t("atCheckout")} 🎉</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-sm font-semibold whitespace-nowrap pl-8">
                      <span>🎉 <span className="font-bold">{t("specialOffer")}</span> {t("discount")}</span>
                      <span className="bg-white text-primary px-2 py-0.5 rounded font-bold">SKIN20</span>
                      <span>{t("atCheckout")} 🎉</span>
                    </div>
                  </div>
                </div>
                {/* Desktop: static one row, no scroll */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="hidden md:flex flex-row flex-nowrap items-center justify-center gap-2 text-base font-semibold"
                >
                  <span>🎉 <span className="font-bold">{t("specialOffer")}</span> {t("discount")}</span>
                  <span className="bg-white text-primary px-3 py-1 rounded-md font-bold shrink-0">SKIN20</span>
                  <span>{t("atCheckout")} 🎉</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteHeader />

      {/* Hero Section - full-bleed like reference: text left, product carousel right, DISCOVER + dots, brand strip */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden bg-gradient-to-r from-primary/10 via-background to-background">
        {/* Left side: darker overlay for text readability */}
        <div className="absolute inset-0 md:w-[48%] bg-gradient-to-r from-primary/5 to-transparent pointer-events-none z-0" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center min-h-[70vh] md:min-h-[75vh]">
            {/* Left: words move with the picture – one slide index drives both */}
            <div className="order-2 md:order-1 flex flex-col justify-center max-w-xl mx-auto md:mx-0 text-center md:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {currentSlide.brand === "topicrem" && (
                    <>
                      <p className="text-base md:text-lg text-muted-foreground">
                        {t("hero.slideTopicremSubtitle")}
                      </p>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
                        {t("hero.slideTopicremTitle")}
                      </h1>
                      <p className="text-muted-foreground">
                        {t("hero.slideTopicremDesc")}
                      </p>
                    </>
                  )}
                  {currentSlide.brand === "novexpert" && (
                    <>
                      <p className="text-base md:text-lg text-muted-foreground">
                        {t("hero.slideNovexpertSubtitle")}
                      </p>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
                        {t("hero.slideNovexpertTitle")}
                      </h1>
                      <p className="text-muted-foreground">
                        {t("hero.slideNovexpertDesc")}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Single DISCOVER button + dots below (like reference) */}
              <div className="mt-8 flex flex-col items-center md:items-start gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 border-2 rounded-md font-medium"
                  asChild
                >
                  <Link
                    href={
                      currentSlide.brand === "topicrem"
                        ? "/brand/topicrem"
                        : "/brand/novexpert"
                    }
                  >
                    {t("hero.discover")}
                  </Link>
                </Button>
                <div className="flex gap-2">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHeroIndex(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        i === heroIndex
                          ? "bg-primary scale-110"
                          : "bg-gray-300 dark:bg-gray-600 border border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Topicrem + Novexpert product carousel – LTR so images show in Arabic (RTL) */}
            <motion.div
              dir="ltr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="order-1 md:order-2 relative w-full min-w-0 md:-mr-8 lg:-mr-12 md:self-stretch flex items-center justify-center md:justify-end"
            >
              <div className="relative w-full h-[280px] sm:h-[320px] md:h-[420px] md:min-h-[380px] overflow-hidden rounded-lg md:transform md:-rotate-1">
                <div
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{
                    width: `${HERO_SLIDES.length * 100}%`,
                    transform: `translateX(-${heroIndex * (100 / HERO_SLIDES.length)}%)`,
                  }}
                >
                  {HERO_SLIDES.map((slide, i) => (
                    <div
                      key={slide.src}
                      className="relative shrink-0 h-full"
                      style={{ width: `${100 / HERO_SLIDES.length}%` }}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-contain"
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom brand strip – gentle marquee (inline animation so it always runs) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 backdrop-blur-sm py-2 overflow-hidden">
          <div
            className="flex items-center gap-8 md:gap-12 text-xs text-muted-foreground whitespace-nowrap"
            style={{
              width: "max-content",
              animation: "brand-strip-marquee 28s linear infinite",
              willChange: "transform",
            }}
          >
            {[1, 2].map((copy) => (
              <div key={copy} className="flex items-center gap-8 md:gap-12 shrink-0">
                <span>{t("hero.brandStrip.laboratory")}</span>
                <span>{t("hero.brandStrip.since")}</span>
                <span className="text-primary font-medium">{t("hero.brandStrip.forSkin")}</span>
                <span>{t("hero.brandStrip.madeIn")}</span>
                <span>{t("hero.brandStrip.paris")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers - horizontal carousel with left/right arrows beside title */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold shrink-0">
              {t("bestsellers")}
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => scrollBestsellers("left")}
                aria-label="Scroll bestsellers left"
                className="p-2 rounded-full border border-border bg-card hover:bg-muted transition-colors touch-manipulation"
              >
                <ChevronLeft className="h-6 w-6 text-foreground" />
              </button>
              <button
                type="button"
                onClick={() => scrollBestsellers("right")}
                aria-label="Scroll bestsellers right"
                className="p-2 rounded-full border border-border bg-card hover:bg-muted transition-colors touch-manipulation"
              >
                <ChevronRight className="h-6 w-6 text-foreground" />
              </button>
            </div>
          </div>
          <div
            ref={bestsellersScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory scrollbar-none"
          >
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Products loading from API...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Error: {error}
              </div>
            ) : allProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products available
              </div>
            ) : (
              allProducts.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="relative shrink-0 w-[260px] sm:w-[280px] snap-start"
                >
                  <span className="absolute top-2 left-2 z-10 rounded-full bg-white/95 px-2 py-0.5 text-xs font-medium text-gray-700 shadow-sm">
                    BESTSELLER
                  </span>
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            {t("whyChoose.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-8 bg-card border border-border rounded-xl hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">
                {t("whyChoose.dermatologicallyTested.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("whyChoose.dermatologicallyTested.description")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center p-8 bg-card border border-border rounded-xl hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">
                {t("whyChoose.frenchExpertise.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("whyChoose.frenchExpertise.description")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-8 bg-card border border-border rounded-xl hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">
                {t("whyChoose.naturalInnovation.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("whyChoose.naturalInnovation.description")}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {topicremProducts.length + novexpertProducts.length}+
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {t("trustIndicators.premiumProducts")}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                2
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {t("trustIndicators.trustedBrands")}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                100%
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {t("trustIndicators.freeShipping")}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                ✓
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {t("trustIndicators.onAllOrders")}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Sections */}
      <section id="our-brands" className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            {t("ourBrands")}
          </h2>

          {/* Topicrem Brand */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <Link
                  href="/brand/topicrem"
                  className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20 relative overflow-hidden group"
                >
                  <Image
                    src="/topicremimage/HYDRA_PROTECTIVE_DAY_CREAM__40ML.webp"
                    alt="Topicrem Collection"
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" />
                </Link>

                <div className="p-10 md:p-12 flex flex-col justify-center space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-white rounded-xl p-2 shadow-lg">
                      <Image
                        src="/topicremlogo.png"
                        alt="Topicrem Logo"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold">{tNav("topicrem")}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("madeInFrance")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-primary">
                      {t("topicrem.tagline")}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("topicrem.description")}
                    </p>
                  </div>

                  <div className="flex gap-4 items-center pt-4">
                    <Button asChild>
                      <Link href="/brand/topicrem">
                        {t("topicrem.exploreCollection")}
                      </Link>
                    </Button>
                    <a
                      href="https://www.instagram.com/topicrem_jordan?igsh=eDgxajhjc3BjZXU2" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                      
                    
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm">
                        {t("topicrem.followOnInstagram")}
                        </span>
                        </a>
                       
                      
                    
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Novexpert Brand */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-accent/50 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <Link
                  href="/brand/novexpert"
                  className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20 relative overflow-hidden md:order-2 group"
                >
                  <Image
                    src="/novexpertimage/BOOSTER WITH VITAMIN C_2000x2000px.webp"
                    alt="Novexpert Collection"
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" />
                </Link>

                <div className="p-10 md:p-12 flex flex-col justify-center space-y-6 md:order-1">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-white rounded-xl p-2 shadow-lg">
                      <Image
                        src="/novexpert.png"
                        alt="Novexpert Logo"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold">
                        {tNav("novexpert")}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("madeInFrance")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-primary">
                      {t("novexpert.tagline")}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("novexpert.description")}
                    </p>
                  </div>

                  <div className="flex gap-4 items-center pt-4">
                    <Button asChild>
                      <Link href="/brand/novexpert">
                        {t("novexpert.exploreCollection")}
                      </Link>
                    </Button>
                    <a
                      href="https://www.instagram.com/novexpertjo?igsh=c3B0eXJyZWU0b3pi" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                      
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm">
                        {t("novexpert.followOnInstagram")}
                        </span>
                        </a>
                        
                      
                    
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
