/* Pricing Page — 3 Tier Cards: Free, Premium ($19.90), VIP ($200) */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Crown,
  Sparkles,
  Eye,
  CreditCard,
  Banknote,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { useTranslation } from "@/i18n";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
};

const PAYONEER_LINK = "https://link.payoneer.com/Token?t=39FF207BDC3A4D49AD951E34D7D3CCEB&src=pl";

function formatIDR(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function Pricing() {
  const { t } = useTranslation();
  const { tier, isAuthenticated } = useSubscription();
  const { user } = useAuth();

  useSEO({
    title: "Pricing — Premium & VIP Membership Plans",
    description: "Unlock exclusive Bali investment insights with BaseOne Premium or VIP membership. Access property prices, detailed ROI analysis, priority expert consultations, and legal document templates.",
    keywords: "BaseOne pricing, Bali investment membership, premium investment plan, VIP investor access, Bali property prices, investment advisory pricing",
    ogUrl: "https://baseoneglobal.com/pricing",
    canonicalUrl: "https://baseoneglobal.com/pricing",
  });
  const [leadOpen, setLeadOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"xendit" | "payoneer">("xendit");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<"premium" | "vip" | null>(null);

  // Fetch dynamic prices from Odoo
  const { data: priceData } = trpc.subscription.prices.useQuery(undefined, {
    staleTime: 1000 * 60 * 30, // 30 min
    refetchOnWindowFocus: false,
  });

  // Dynamic price helpers
  const odooPrices = priceData?.prices || {};
  const exchangeRate = priceData?.exchangeRate?.usdToIdr || 15750;

  const getPriceUSD = (key: string, fallback: number): string => {
    const price = odooPrices[key];
    if (price && price > 0) {
      // Odoo stores in IDR (company currency), convert to USD
      const usd = price / exchangeRate;
      return usd < 1 ? `$${usd.toFixed(2)}` : `$${Math.round(usd).toLocaleString()}`;
    }
    return `$${fallback}`;
  };

  const getPriceIDR = (key: string, fallback: number): string => {
    const price = odooPrices[key];
    if (price && price > 0) return formatIDR(price);
    return formatIDR(fallback);
  };

  const checkoutMutation = trpc.subscription.checkout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
        toast.info(t.pricing.redirectingToCheckout);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Payment error");
    },
  });

  const handlePurchase = (productKey: "premium" | "vip") => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    setPendingProduct(productKey);
    setPaymentModalOpen(true);
  };

  const confirmPayment = () => {
    if (!pendingProduct) return;
    setPaymentModalOpen(false);

    if (selectedPayment === "payoneer") {
      window.open(PAYONEER_LINK, "_blank");
      toast.info(t.pricing.redirectingToPayoneer);
      return;
    }

    // Xendit checkout — creates invoice and redirects to hosted payment page
    checkoutMutation.mutate({ productKey: pendingProduct });
  };

  const plans = [
    {
      key: "free" as const,
      name: t.pricing.freeName,
      price: "$0",
      priceIDR: "",
      period: "",
      description: t.pricing.freeDesc,
      features: [
        t.pricing.freeF1,
        t.pricing.freeF2,
        t.pricing.freeF3,
        t.pricing.freeF4,
      ],
      cta: isAuthenticated ? t.pricing.currentPlan : t.pricing.signUpFree,
      disabled: isAuthenticated,
      highlight: false,
    },
    {
      key: "premium" as const,
      name: t.pricing.premiumName,
      price: getPriceUSD("premium", 19.90),
      priceIDR: getPriceIDR("premium", 315000),
      period: t.pricing.oneTime,
      description: t.pricing.premiumDesc,
      features: [
        t.pricing.premiumF1,
        t.pricing.premiumF2,
        t.pricing.premiumF3,
        t.pricing.premiumF4,
        t.pricing.premiumF5,
      ],
      cta: tier === "premium" || tier === "vip" ? t.pricing.currentPlan : t.pricing.getPremium,
      disabled: tier === "premium" || tier === "vip",
      highlight: true,
    },
    {
      key: "vip" as const,
      name: t.pricing.vipName,
      price: getPriceUSD("vip", 200),
      priceIDR: getPriceIDR("vip", 3150000),
      period: t.pricing.oneTime,
      description: t.pricing.vipDesc,
      features: [
        t.pricing.vipF1,
        t.pricing.vipF2,
        t.pricing.vipF3,
        t.pricing.vipF4,
        t.pricing.vipF5,
        t.pricing.vipF6,
      ],
      cta: tier === "vip" ? t.pricing.currentPlan : t.pricing.getVip,
      disabled: tier === "vip",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar onTalkToExpert={() => setLeadOpen(true)} />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home */}
          <Link href="/">
            <button className="inline-flex items-center gap-2 text-sm text-[#8a8580] hover:text-[#c5a059] transition-colors mb-8">
              <ArrowLeft size={16} />
              {t.pricing.backHome}
            </button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">
              {t.pricing.badge}
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
              {t.pricing.title}
            </h1>
            <p className="text-[#8a8580] text-lg max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </motion.div>

          {/* Plan Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 max-w-5xl mx-auto"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.key}
                variants={fadeUp}
                custom={i}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-[#c5a059]/10 to-[#141416] border-2 border-[#c5a059]/40 shadow-xl shadow-[#c5a059]/10"
                    : "bg-[#141416] border border-white/10 hover:border-white/20"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c5a059] text-black text-xs font-display font-bold uppercase tracking-wider">
                    {t.pricing.popular}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    {plan.key === "free" && <Eye size={20} className="text-[#8a8580]" />}
                    {plan.key === "premium" && <Sparkles size={20} className="text-[#c5a059]" />}
                    {plan.key === "vip" && <Crown size={20} className="text-[#c5a059]" />}
                    <h3 className="font-display font-bold text-xl">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-display font-extrabold text-4xl text-white">
                      {plan.price}
                    </span>
                    {plan.priceIDR && plan.priceIDR !== "Rp 0" && (
                      <span className="text-xs text-[#8a8580] ml-1">({plan.priceIDR})</span>
                    )}
                    {plan.period && (
                      <span className="text-sm text-[#6b6560]">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-[#8a8580] leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#a09a94]">
                      <Check size={16} className="text-[#c5a059] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.key === "free") {
                      if (!isAuthenticated) window.location.href = "/login";
                    } else {
                      handlePurchase(plan.key);
                    }
                  }}
                  disabled={plan.disabled || checkoutMutation.isPending}
                  className={`w-full py-3.5 rounded-xl font-display font-semibold text-sm transition-all ${
                    plan.disabled
                      ? "bg-white/5 text-[#6b6560] cursor-not-allowed"
                      : plan.highlight
                      ? "bg-[#c5a059] text-black hover:bg-[#d4b06a] shadow-lg shadow-[#c5a059]/20"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#c5a059]/30"
                  }`}
                >
                  {checkoutMutation.isPending ? t.pricing.processing : plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Scouting Fee Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-[#c5a059]/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center shrink-0">
                  <Eye size={28} className="text-[#c5a059]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display font-bold text-xl mb-2">{(t as any).scouting?.title || "Professional Scouting Service"}</h3>
                  <p className="text-sm text-[#6b6560] leading-relaxed mb-3">
                    {(t as any).scouting?.description || "Our team visits locations, analyzes the market, and delivers a detailed investment report tailored to your goals. Includes site visits, competitor analysis, and regulatory assessment."}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {[(t as any).scouting?.feat1 || "On-ground site visits", (t as any).scouting?.feat2 || "Market & competitor analysis", (t as any).scouting?.feat3 || "Detailed investment report", (t as any).scouting?.feat4 || "Regulatory assessment"].map((f: string) => (
                      <span key={f} className="inline-flex items-center gap-1 text-xs text-[#a09a94]"><Check size={10} className="text-[#c5a059]" />{f}</span>
                    ))}
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className="font-display font-bold text-2xl text-[#c5a059]">{getPriceUSD("scoutingFee", 500)}</div>
                  <div className="text-xs text-[#6b6560] font-mono">{getPriceIDR("scoutingFee", 7875000)}</div>
                  <button
                    onClick={() => handlePurchase("scoutingFee" as any)}
                    disabled={checkoutMutation.isPending}
                    className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-colors disabled:opacity-50"
                  >
                    {checkoutMutation.isPending ? t.pricing.processing : ((t as any).scouting?.startButton || "Start Scouting")}
                  </button>
                  {tier === "vip" && (
                    <div className="text-[10px] text-[#c5a059] mt-1">{(t as any).scouting?.vipNote || "VIP members: contact us for priority scouting"}</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-center font-display font-semibold text-lg mb-6">
              {t.pricing.paymentMethods}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Xendit — Primary */}
              <button
                onClick={() => setSelectedPayment("xendit")}
                className={`p-5 rounded-2xl border transition-all text-center ${
                  selectedPayment === "xendit"
                    ? "border-[#c5a059]/50 bg-[#c5a059]/10"
                    : "border-white/10 bg-[#141416] hover:border-white/20"
                }`}
              >
                <CreditCard size={24} className="mx-auto mb-2 text-[#c5a059]" />
                <div className="font-display font-semibold text-sm mb-1">Xendit</div>
                <div className="text-[10px] text-[#6b6560] font-mono uppercase">
                  {t.pricing.creditCard} &middot; {t.pricing.localPayment}
                </div>
              </button>

              {/* Payoneer */}
              <button
                onClick={() => setSelectedPayment("payoneer")}
                className={`p-5 rounded-2xl border transition-all text-center ${
                  selectedPayment === "payoneer"
                    ? "border-[#c5a059]/50 bg-[#c5a059]/10"
                    : "border-white/10 bg-[#141416] hover:border-white/20"
                }`}
              >
                <ExternalLink size={24} className="mx-auto mb-2 text-[#c5a059]" />
                <div className="font-display font-semibold text-sm mb-1">Payoneer</div>
                <div className="text-[10px] text-[#6b6560] font-mono uppercase">
                  {t.pricing.bankTransfer}
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <LeadFormModal open={leadOpen} onClose={() => setLeadOpen(false)} />

      {/* Payment Method Selection Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setPaymentModalOpen(false)}>
          <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-xl mb-2 text-center">
              {t.pricing.paymentMethods}
            </h3>
            <p className="text-sm text-[#8a8580] text-center mb-6">
              {pendingProduct === "vip" ? t.pricing.vipName : t.pricing.premiumName}
            </p>

            <div className="space-y-3 mb-6">
              {/* Xendit — Primary */}
              <button
                onClick={() => setSelectedPayment("xendit")}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  selectedPayment === "xendit"
                    ? "border-[#c5a059]/50 bg-[#c5a059]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <CreditCard size={24} className="text-[#c5a059] shrink-0" />
                <div className="text-left">
                  <div className="font-display font-semibold text-sm">Xendit</div>
                  <div className="text-[10px] text-[#6b6560] font-mono uppercase">{t.pricing.creditCard} &middot; {t.pricing.localPayment}</div>
                </div>
              </button>

              {/* Payoneer */}
              <button
                onClick={() => setSelectedPayment("payoneer")}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  selectedPayment === "payoneer"
                    ? "border-[#c5a059]/50 bg-[#c5a059]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <ExternalLink size={24} className="text-[#c5a059] shrink-0" />
                <div className="text-left">
                  <div className="font-display font-semibold text-sm">Payoneer</div>
                  <div className="text-[10px] text-[#6b6560] font-mono uppercase">{t.pricing.bankTransfer}</div>
                </div>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-display font-semibold hover:bg-white/5 transition-all"
              >
                {t.pricing.backHome || "Cancel"}
              </button>
              <button
                onClick={confirmPayment}
                disabled={checkoutMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-[#c5a059] text-black text-sm font-display font-bold hover:bg-[#d4b06a] transition-all shadow-lg shadow-[#c5a059]/20"
              >
                {checkoutMutation.isPending ? t.pricing.processing : t.pricing.payNow || "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
