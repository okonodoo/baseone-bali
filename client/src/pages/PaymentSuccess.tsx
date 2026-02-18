/* PaymentSuccess — Shown after successful Xendit checkout */

import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/i18n";
import { useSubscription } from "@/hooks/useSubscription";

export default function PaymentSuccess() {
  const { t } = useTranslation();
  const { refetch } = useSubscription();

  // Refetch subscription status on mount
  useEffect(() => {
    const timer = setTimeout(() => refetch(), 2000);
    return () => clearTimeout(timer);
  }, [refetch]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      <section className="pt-32 pb-20 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-4">
            {t.pricing.paymentSuccessTitle}
          </h1>
          <p className="text-[#8a8580] text-lg leading-relaxed mb-8">
            {t.pricing.paymentSuccessDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ai-advisor"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-colors"
            >
              {t.pricing.goToAdvisor}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/investment-wizard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-display font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              {t.pricing.goToWizard}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
