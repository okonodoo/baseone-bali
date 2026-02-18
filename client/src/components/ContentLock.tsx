/* ContentLock — Blurred overlay with upgrade CTA for locked content */

import { Lock, Crown, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Link } from "wouter";

interface ContentLockProps {
  requiredTier: "premium" | "vip";
  children: React.ReactNode;
  /** Show blurred preview of children */
  showPreview?: boolean;
}

export default function ContentLock({ requiredTier, children, showPreview = true }: ContentLockProps) {
  const { t } = useTranslation();

  const isPremium = requiredTier === "premium";
  const price = isPremium ? "$19.90 (Rp 315K)" : "$200 (Rp 3.15M)";
  const icon = isPremium ? <Sparkles size={24} /> : <Crown size={24} />;
  const label = isPremium ? t.pricing.unlockPremium : t.pricing.unlockVip;

  return (
    <div className="relative">
      {/* Blurred content preview */}
      {showPreview && (
        <div className="select-none pointer-events-none blur-[6px] opacity-50">
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <div className={`${showPreview ? "absolute inset-0" : ""} flex items-center justify-center`}>
        <div className="text-center p-8 rounded-3xl bg-[#141416]/90 backdrop-blur-xl border border-white/10 shadow-2xl max-w-sm mx-4">
          <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center mx-auto mb-4 text-[#c5a059]">
            {icon}
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock size={14} className="text-[#c5a059]" />
            <span className="text-xs font-mono text-[#c5a059] uppercase tracking-wider">
              {isPremium ? "Premium" : "VIP"} {t.pricing.contentLocked}
            </span>
          </div>
          <p className="text-sm text-[#8a8580] mb-5 leading-relaxed">
            {isPremium ? t.pricing.premiumLockDesc : t.pricing.vipLockDesc}
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-colors shadow-lg shadow-[#c5a059]/20"
          >
            {label} — {price}
          </Link>
        </div>
      </div>
    </div>
  );
}
