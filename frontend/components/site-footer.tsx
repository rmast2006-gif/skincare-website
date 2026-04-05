"use client";

import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { Instagram, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-bold text-xl">{t("tagline")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
            <div className="space-y-2">
              <motion.a
                href="mailto:info@mazayaunited.com"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@mazayaunited.com</span>
              </motion.a>
              <motion.a
                href="tel:+962780686156"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+962 78 068 6156</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h4 className="font-bold text-sm">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav("home")}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav("about")}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav("contact")}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/cart"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav("cart")}
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Our Brands */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <h4 className="font-bold text-sm">{t("ourBrands")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/brand/topicrem"
                    className="text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {tNav("topicrem")}
                  </Link>
                </motion.div>
                <motion.a
                  href="https://www.instagram.com/topicrem_jordan?igsh=eDgxajhjc3BjZXU2"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@topicrem_jordan</span>
                </motion.a>
              </li>
              <li className="pt-2">
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/brand/novexpert"
                    className="text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {tNav("novexpert")}
                  </Link>
                </motion.div>
                <motion.a
                  href="https://www.instagram.com/novexpertjo?igsh=c3B0eXJyZWU0b3pi"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@novexpertjo</span>
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3"
          >
            <h4 className="font-bold text-sm">{t("followUs")}</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {tNav("topicrem")}
                </p>
                <motion.a
                  href="https://www.instagram.com/topicrem_jordan?igsh=eDgxajhjc3BjZXU2"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </motion.a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {tNav("novexpert")}
                </p>
                <motion.a
                  href="https://www.instagram.com/novexpertjo?igsh=c3B0eXJyZWU0b3pi"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-border pt-8"
        >
          <p className="text-center text-muted-foreground text-sm">
            © 2026 {t("tagline")}. {t("rights")}.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
