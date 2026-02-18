/* Become a Partner / Affiliate Program — Golden Archipelago Design */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  TrendingUp,
  Globe,
  Users,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Send,
  BarChart3,
  Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { CountrySelect, PhoneInput } from "@/components/CountrySelect";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

export default function BecomePartner() {
  const { t } = useTranslation();
  const p = t.partner || ({} as any);

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    website: "",
    howYouRefer: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const leadMutation = trpc.lead.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leadMutation.mutateAsync({
        fullName: form.contactName,
        email: form.email,
        phone: form.phone || undefined,
        country: form.country,
        budget: "Partner Application",
        sector: "affiliate",
        source: "become-partner",
        notes: `${form.companyName ? `Company: ${form.companyName}\n` : ""}Website: ${form.website}\nReferral Strategy: ${form.howYouRefer}`,
      });
      setSubmitted(true);
      toast.success(p.successTitle || "Application submitted!");
    } catch {
      toast.error(p.submitError || "Failed to submit. Please try again.");
    }
  };

  const commissionTiers = [
    { rate: "8%", label: p.tierLocal || "Local Agent", desc: p.tierLocalDesc || "Property agents and local consultants in Bali" },
    { rate: "10%", label: p.tierRegional || "Regional Partner", desc: p.tierRegionalDesc || "Business consultants and agencies in Southeast Asia" },
    { rate: "12%", label: p.tierGlobal || "Global Network", desc: p.tierGlobalDesc || "International networks, digital platforms, and communities" },
  ];

  const benefits = [
    { icon: <DollarSign size={24} />, title: p.benefit1Title || "Competitive Commissions", desc: p.benefit1Desc || "Earn 8-12% on every successful referral that converts to a paying client." },
    { icon: <BarChart3 size={24} />, title: p.benefit2Title || "Real-time Dashboard", desc: p.benefit2Desc || "Track your referrals, conversions, and earnings through the Odoo Partner Portal." },
    { icon: <Shield size={24} />, title: p.benefit3Title || "Dedicated Support", desc: p.benefit3Desc || "Get priority access to our investment experts for your referred clients." },
    { icon: <Globe size={24} />, title: p.benefit4Title || "Global Reach", desc: p.benefit4Desc || "Access our network of international investors looking to invest in Bali." },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c5a059]/[0.03] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 mb-8">
              <Handshake size={14} className="text-[#c5a059]" />
              <span className="text-xs font-mono text-[#c5a059] uppercase tracking-wider">{p.badge || "Partner Program"}</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-6">
              {p.heroTitle || "Become a"} <span className="gold-text">{p.heroTitleGold || "BaseOne Partner"}</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-[#a09a94] leading-relaxed mb-10">
              {p.heroDesc || "Join our affiliate network and earn commissions by referring investors to Bali's premier investment platform."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{p.commissionTitle || "Commission Structure"}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl tracking-tight">{p.commissionSubtitle || "Transparent Earnings"}</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commissionTiers.map((tier, i) => (
              <motion.div key={tier.rate} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 text-center border border-white/5 hover:border-[#c5a059]/20 transition-all">
                <div className="text-5xl font-display font-extrabold text-[#c5a059] mb-3">{tier.rate}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{tier.label}</h3>
                <p className="text-sm text-[#6b6560]">{tier.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c5a059]/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{p.benefitsSubtitle || "Why Partner With Us"}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl tracking-tight">{p.benefitsTitle || "Partner Benefits"}</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] mb-5">{b.icon}</div>
                <h3 className="font-display font-semibold text-base mb-2">{b.title}</h3>
                <p className="text-sm text-[#6b6560] leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{p.howTitle || "How It Works"}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl tracking-tight">{p.howSubtitle || "Simple Process"}</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: p.step1 || "Apply", desc: p.step1Desc || "Fill out the partner application form with your details and marketing plan." },
              { step: "02", title: p.step2 || "Get Approved", desc: p.step2Desc || "Our team reviews your application and sets up your unique affiliate tracking code." },
              { step: "03", title: p.step3 || "Share & Earn", desc: p.step3Desc || "Share your referral link. When your referrals invest, you earn commissions automatically." },
              { step: "04", title: p.step4 || "Get Paid", desc: p.step4Desc || "Receive monthly payouts via bank transfer or Payoneer. Minimum payout: $100." },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative">
                <div className="text-7xl font-display font-extrabold text-[#c5a059]/10 absolute -top-4 -left-2">{s.step}</div>
                <div className="relative pt-10 pl-2">
                  <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-[#6b6560] leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center glass-card rounded-3xl p-12">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-3">{p.successTitle || "Application Received!"}</h2>
              <p className="text-[#8a8580] mb-6">{p.successMessage || "Our partnership team will review your application and contact you within 48 hours."}</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-center mb-10">
                <p className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{p.formTitle || "Apply Now"}</p>
                <h2 className="font-display font-bold text-3xl tracking-tight">{p.formSubtitle || "Partner Application"}</h2>
              </div>

              <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 sm:p-10 space-y-6">
                {/* Contact Name (required) */}
                <div>
                  <label className="block text-xs font-mono text-[#8a8580] uppercase tracking-wider mb-2">
                    {p.contactName || "Full Name"} *
                  </label>
                  <input type="text" required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>

                {/* Company Name (optional) */}
                <div>
                  <label className="block text-xs font-mono text-[#8a8580] uppercase tracking-wider mb-2">
                    {p.companyName || "Company Name"} <span className="text-[#6b6560]">({p.optional || "optional"})</span>
                  </label>
                  <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-[#8a8580] uppercase tracking-wider mb-2">
                      {p.email || "Email Address"} *
                    </label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                  </div>

                  {/* Country Dropdown */}
                  <CountrySelect
                    value={form.country}
                    onChange={(val) => setForm({ ...form, country: val })}
                    label={p.country || "Country"}
                    required
                  />
                </div>

                {/* Phone with country code */}
                <PhoneInput
                  value={form.phone}
                  onChange={(val) => setForm({ ...form, phone: val })}
                  countryCode={form.country}
                  label={p.phone || "Phone Number"}
                  placeholder={p.phonePlaceholder || "Phone number"}
                />

                {/* Website (optional) */}
                <div>
                  <label className="block text-xs font-mono text-[#8a8580] uppercase tracking-wider mb-2">
                    {p.website || "Website"} <span className="text-[#6b6560]">({p.optional || "optional"})</span>
                  </label>
                  <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>

                {/* How will you refer */}
                <div>
                  <label className="block text-xs font-mono text-[#8a8580] uppercase tracking-wider mb-2">
                    {p.howRefer || "How will you refer clients?"} *
                  </label>
                  <textarea rows={3} required value={form.howYouRefer} onChange={(e) => setForm({ ...form, howYouRefer: e.target.value })}
                    placeholder={p.howReferPlaceholder || "Describe your marketing channels, audience, and strategy..."}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors resize-none" />
                </div>

                <button type="submit" disabled={leadMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#c5a059] text-black font-display font-semibold text-base hover:bg-[#d4b06a] transition-all shadow-lg shadow-[#c5a059]/20 disabled:opacity-50">
                  {leadMutation.isPending ? (
                    <span>{p.submitting || "Submitting..."}</span>
                  ) : (
                    <>
                      <Send size={16} />
                      {p.submit || "Submit Application"}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Existing Partners CTA */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
            <p className="text-sm text-[#6b6560] mb-4">{p.existingPartner || "Already a partner?"}</p>
            <a href="https://pt-telkon-one-group.odoo.com/my" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[#c5a059] font-display font-semibold text-sm hover:bg-white/10 transition-all">
              {p.loginPortal || "Login to Partner Portal"} <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
