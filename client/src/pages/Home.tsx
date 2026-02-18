/* ============================================================
 * Home / Landing Page — Golden Archipelago Design — i18n + Lead Modal
 * ============================================================ */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Lightbulb, Compass, ShieldCheck, TrendingUp,
  Building2, Globe, Heart, Ship, HardHat, GraduationCap,
  Cpu, UtensilsCrossed, CheckCircle2, Users, FileText, Zap,
  PenTool, Handshake, Target, LineChart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { getWhatsAppUrl } from "@/components/WhatsAppButton";
import { HERO_IMAGE, AI_ADVISOR_IMAGE, WIZARD_IMAGE, CTA_IMAGE, SECTORS } from "@/lib/investmentData";
import { useTranslation } from "@/i18n";
import { MessageCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const sectorIcons: Record<string, React.ReactNode> = {
  restaurant: <UtensilsCrossed size={22} />,
  villa: <Building2 size={22} />,
  digital: <Globe size={22} />,
  wellness: <Heart size={22} />,
  "import-export": <Ship size={22} />,
  construction: <HardHat size={22} />,
  education: <GraduationCap size={22} />,
  crypto: <Cpu size={22} />,
};

// Map sector IDs to translation keys
const sectorTranslationMap: Record<string, { labelKey: keyof typeof import("@/i18n/en").default.sectors; descKey: keyof typeof import("@/i18n/en").default.sectors }> = {
  restaurant: { labelKey: "restaurant", descKey: "restaurantDesc" },
  villa: { labelKey: "villa", descKey: "villaDesc" },
  digital: { labelKey: "digital", descKey: "digitalDesc" },
  wellness: { labelKey: "wellness", descKey: "wellnessDesc" },
  "import-export": { labelKey: "importExport", descKey: "importExportDesc" },
  construction: { labelKey: "construction", descKey: "constructionDesc" },
  education: { labelKey: "education", descKey: "educationDesc" },
  crypto: { labelKey: "crypto", descKey: "cryptoDesc" },
};

export default function Home() {
  const { t } = useTranslation();
  const [leadOpen, setLeadOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useSEO({
    title: "Invest in Bali with Confidence",
    description: "AI-powered investment platform for foreign investors in Bali. PMA company setup, real estate, KITAS processing, and 8 investment sectors. Navigate Indonesia's regulations with expert guidance.",
    keywords: "Bali investment, invest in Bali, PMA company setup, foreign investment Indonesia, Bali real estate, KITAS Bali, PT PMA, villa investment, business setup Bali, investment advisory, PropTech, Southeast Asia investment",
    ogUrl: "https://baseoneglobal.com/",
    canonicalUrl: "https://baseoneglobal.com/",
  });

  // Scroll-based section tracking for navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "hero", offset: 0 },
        { id: "approaches", offset: 100 },
        { id: "trust", offset: 100 },
        { id: "sectors", offset: 100 },
        { id: "cta", offset: 100 },
      ];

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop - sections[i].offset;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar onTalkToExpert={() => setLeadOpen(true)} />

      {/* ===== HERO ===== */}
      <section id="hero" className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Bali coastline aerial view" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/60 to-[#0a0a0b]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
              <span className="text-xs font-mono text-[#c5a059] uppercase tracking-wider">{t.hero.badge}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight mb-6">
              {t.hero.title1}<br /><span className="gold-text">{t.hero.title2}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#a09a94] leading-relaxed max-w-2xl mb-10">
              {t.hero.subtitle}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4">
              <Link href="/ai-advisor"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#c5a059] text-black font-display font-semibold text-base hover:bg-[#d4b06a] transition-all shadow-lg shadow-[#c5a059]/20 hover:shadow-[#c5a059]/40">
                <Lightbulb size={18} />{t.hero.ctaAdvisor}
              </Link>
              <Link href="/investment-wizard"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-display font-semibold text-base hover:bg-white/10 hover:border-[#c5a059]/30 transition-all">
                <PenTool size={18} />{t.hero.ctaWizard}
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/5">
              {[
                { value: "500+", label: t.hero.stat1 },
                { value: "$50M+", label: t.hero.stat2 },
                { value: "8", label: t.hero.stat3 },
                { value: "98%", label: t.hero.stat4 },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-bold text-2xl text-[#c5a059]">{stat.value}</div>
                  <div className="text-xs text-[#6b6560] font-mono uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none hidden sm:flex">
          <span className="text-[10px] text-[#6b6560] font-mono uppercase tracking-widest">{t.hero.scroll}</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#c5a059] to-transparent" />
        </motion.div>
      </section>

      {/* ===== TWO SCENARIO CARDS ===== */}
      <section id="approaches" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{t.scenarios.badge}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">{t.scenarios.title}</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#8a8580] text-lg max-w-2xl mx-auto">{t.scenarios.subtitle}</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: AI Advisor */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Link href="/ai-advisor">
                <div className="group relative rounded-3xl overflow-hidden border border-white/5 hover:border-[#c5a059]/30 transition-all duration-500 h-full">
                  <div className="absolute inset-0">
                    <img src={AI_ADVISOR_IMAGE} alt="AI Advisor" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/80 to-[#0a0a0b]/40" />
                  </div>
                  <div className="relative p-8 sm:p-10 lg:p-12 flex flex-col min-h-[400px]">
                    <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center mb-6 group-hover:bg-[#c5a059]/20 transition-colors">
                      <Target size={26} className="text-[#c5a059]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em]">{t.scenarios.scenario1}</span>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl mt-2 mb-4 group-hover:text-[#c5a059] transition-colors">{t.scenarios.aiTitle}</h3>
                      <p className="text-[#8a8580] leading-relaxed mb-6">{t.scenarios.aiDesc}</p>
                      <ul className="space-y-2 mb-8">
                        {t.scenarios.aiFeatures.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-[#a09a94]">
                            <CheckCircle2 size={14} className="text-[#c5a059] shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 text-[#c5a059] font-display font-semibold text-sm group-hover:gap-3 transition-all">
                      {t.scenarios.aiCta} <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Card 2: Investment Wizard */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
              <Link href="/investment-wizard">
                <div className="group relative rounded-3xl overflow-hidden border border-white/5 hover:border-[#c5a059]/30 transition-all duration-500 h-full">
                  <div className="absolute inset-0">
                    <img src={WIZARD_IMAGE} alt="Investment Wizard" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/80 to-[#0a0a0b]/40" />
                  </div>
                  <div className="relative p-8 sm:p-10 lg:p-12 flex flex-col min-h-[400px]">
                    <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center mb-6 group-hover:bg-[#c5a059]/20 transition-colors">
                      <PenTool size={26} className="text-[#c5a059]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em]">{t.scenarios.scenario2}</span>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl mt-2 mb-4 group-hover:text-[#c5a059] transition-colors">{t.scenarios.wizardTitle}</h3>
                      <p className="text-[#8a8580] leading-relaxed mb-6">{t.scenarios.wizardDesc}</p>
                      <ul className="space-y-2 mb-8">
                        {t.scenarios.wizardFeatures.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-[#a09a94]">
                            <CheckCircle2 size={14} className="text-[#c5a059] shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 text-[#c5a059] font-display font-semibold text-sm group-hover:gap-3 transition-all">
                      {t.scenarios.wizardCta} <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAND ===== */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#c5a059]/5 via-[#c5a059]/10 to-[#c5a059]/5" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #c5a059 40px, #c5a059 41px)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Handshake size={24} className="text-[#c5a059]" />
              <span className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em]">{t.foundation?.badge || "Our Foundation"}</span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl mb-3">
              <span className="gold-text">{t.foundation?.title1 || "Human Expertise"}</span> {t.foundation?.title2 || "Amplified by Analytical Intelligence"}
            </h3>
            <p className="text-[#8a8580] max-w-3xl mx-auto text-base sm:text-lg">
              {t.foundation?.description || "We don't replace human judgment with algorithms — we enhance it. Every insight is crafted by experienced analysts, powered by data, and refined through strategic thinking."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== TRUST / WHY BASEONE ===== */}
      <section id="trust" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c5a059]/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{t.trust.badge}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">{t.trust.title}</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#8a8580] text-lg max-w-2xl mx-auto">{t.trust.subtitle}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={24} />, title: t.trust.legalTitle, desc: t.trust.legalDesc },
              { icon: <LineChart size={24} />, title: t.trust.marketTitle, desc: t.trust.marketDesc },
              { icon: <Handshake size={24} />, title: t.trust.networkTitle, desc: t.trust.networkDesc },
              { icon: <FileText size={24} />, title: t.trust.processTitle, desc: t.trust.processDesc },
            ].map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} custom={i} className="glass-card glass-card-hover rounded-2xl p-7 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] mb-5">{item.icon}</div>
                <h3 className="font-display font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-[#6b6560] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTORS ===== */}
      <section id="sectors" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{t.sectors.badge}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">{t.sectors.title}</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#8a8580] text-lg max-w-2xl mx-auto">{t.sectors.subtitle}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECTORS.map((sector, i) => {
              const mapping = sectorTranslationMap[sector.id];
              const label = mapping ? (t.sectors as Record<string, string>)[mapping.labelKey] : sector.label;
              const desc = mapping ? (t.sectors as Record<string, string>)[mapping.descKey] : sector.description;
              return (
                <motion.div key={sector.id} variants={fadeUp} custom={i * 0.5}>
                  <Link href="/investment-wizard">
                    <div className="group glass-card glass-card-hover rounded-2xl p-6 transition-all duration-300 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059]/20 transition-colors">
                          {sectorIcons[sector.id]}
                        </div>
                        <span className="font-mono text-[10px] text-[#6b6560] uppercase">KBLI {sector.kbli}</span>
                      </div>
                      <h3 className="font-display font-semibold text-sm mb-1.5 group-hover:text-[#c5a059] transition-colors">{label}</h3>
                      <p className="text-xs text-[#6b6560] leading-relaxed">{desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section id="cta" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0">
              <img src={CTA_IMAGE} alt="Luxury Bali villa" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-[#0a0a0b]/90 to-[#0a0a0b]/70" />
            </div>
            <div className="relative p-10 sm:p-14 lg:p-20">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 mb-6">
                  <Zap size={12} className="text-[#c5a059]" />
                  <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">{t.cta.badge}</span>
                </div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-5">
                  {t.cta.title1}<br /><span className="gold-text">{t.cta.title2}</span>
                </h2>
                <p className="text-[#8a8580] text-lg leading-relaxed mb-8">{t.cta.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setLeadOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#c5a059] text-black font-display font-semibold text-base hover:bg-[#d4b06a] transition-all shadow-lg shadow-[#c5a059]/20">
                    <MessageCircle size={18} />
                    {t.cta.talkToExpert}
                  </button>
                  <Link href="/ai-advisor"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-display font-semibold text-base hover:bg-white/10 transition-all">
                    {t.cta.tryAdvisor}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <LeadFormModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        type="expert"
        contextData="Source: Landing Page CTA"
      />
    </div>
  );
}
