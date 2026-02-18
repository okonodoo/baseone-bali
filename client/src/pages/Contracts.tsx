/* Contracts & Digital Signatures — Golden Archipelago Design */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileSignature,
  Shield,
  Clock,
  CheckCircle2,
  Building2,
  FileText,
  Lock,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { useTranslation } from "@/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

export default function Contracts() {
  const [leadOpen, setLeadOpen] = useState(false);
  const { t } = useTranslation();
  const c = (t as any).contracts || {};

  const contractTypes = [
    {
      icon: <Building2 size={24} />,
      title: c.virtualOffice || "Virtual Office Agreement",
      desc: c.virtualOfficeDesc || "Registered business address in Bali for your PMA company. Required for company registration and licensing.",
      duration: c.virtualOfficeDuration || "12 months",
    },
    {
      icon: <FileText size={24} />,
      title: c.pmaService || "PMA Setup Service Agreement",
      desc: c.pmaServiceDesc || "Comprehensive service agreement covering company deed, notarization, OSS registration, NIB, and business licenses.",
      duration: c.pmaServiceDuration || "Project-based",
    },
    {
      icon: <Lock size={24} />,
      title: c.nda || "NDA - Non-Disclosure Agreement",
      desc: c.ndaDesc || "Confidentiality agreement protecting your investment plans, financial details, and business strategies.",
      duration: c.ndaDuration || "Perpetual",
    },
    {
      icon: <FileSignature size={24} />,
      title: c.consultancy || "Investment Consultancy Agreement",
      desc: c.consultancyDesc || "Advisory agreement for ongoing investment guidance, market analysis, and regulatory compliance support.",
      duration: c.consultancyDuration || "6-12 months",
    },
  ];

  const processSteps = [
    { step: "01", title: c.processStep1 || "Initial Consultation", desc: c.processStep1Desc || "Discuss your investment goals and determine which contracts are needed for your specific situation." },
    { step: "02", title: c.processStep2 || "Document Preparation", desc: c.processStep2Desc || "Our legal team prepares the contracts based on your requirements, with all terms clearly outlined." },
    { step: "03", title: c.processStep3 || "Digital Review", desc: c.processStep3Desc || "Review all documents through the Odoo Portal. Request changes or clarifications before signing." },
    { step: "04", title: c.processStep4 || "Digital Signature", desc: c.processStep4Desc || "Sign contracts digitally through Odoo Sign. Legally binding and compliant with Indonesian e-signature laws." },
  ];

  const faqs = [
    { q: c.faq1Q || "Are digital signatures legally valid in Indonesia?", a: c.faq1A || "Yes. Indonesia recognizes electronic signatures under Government Regulation No. 71/2019 and Law No. 11/2008 on Electronic Information and Transactions (ITE Law). Digital signatures through certified platforms are legally binding." },
    { q: c.faq2Q || "What documents do I need to provide?", a: c.faq2A || "For PMA setup: passport copy, proof of address, and business plan. For virtual office: passport copy and company details. Our team will guide you through the specific requirements." },
    { q: c.faq3Q || "How long does the signing process take?", a: c.faq3A || "Once documents are prepared, the digital signing process takes minutes. Document preparation typically takes 3-5 business days depending on complexity." },
    { q: c.faq4Q || "Can I review contracts before signing?", a: c.faq4A || "Absolutely. All contracts are shared through the Odoo Portal for your review. You can request changes, ask questions, and take as much time as you need before signing." },
    { q: c.faq5Q || "What happens after signing?", a: c.faq5A || "Signed documents are stored securely in the Odoo Portal. You'll receive copies via email. Our team then begins executing the agreed services immediately." },
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
              <FileSignature size={14} className="text-[#c5a059]" />
              <span className="text-xs font-mono text-[#c5a059] uppercase tracking-wider">{c.badge || "Digital Contracts"}</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-6">
              {c.heroTitle || "Contracts &"} <span className="gold-text">{c.heroTitleGold || "Digital Signatures"}</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-[#a09a94] leading-relaxed">
              {c.heroDesc || "All agreements are handled digitally through our secure Odoo Portal. Review, negotiate, and sign contracts from anywhere in the world."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contract Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{c.typesTitle || "Contract Types"}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl tracking-tight">{c.typesSubtitle || "Available Agreements"}</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contractTypes.map((ct, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8 border border-white/5 hover:border-[#c5a059]/20 transition-all">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] shrink-0">{ct.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg mb-2">{ct.title}</h3>
                    <p className="text-sm text-[#6b6560] leading-relaxed mb-3">{ct.desc}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 text-xs font-mono text-[#c5a059]">
                      <Clock size={10} /> {ct.duration}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c5a059]/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{c.processTitle || "Signing Process"}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl tracking-tight">{c.processSubtitle || "How It Works"}</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative">
                <div className="text-6xl font-display font-extrabold text-[#c5a059]/10 mb-2">{s.step}</div>
                <h3 className="font-display font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-sm text-[#6b6560] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Note */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center shrink-0">
              <Shield size={32} className="text-[#c5a059]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl mb-2">{c.securityTitle || "Enterprise-Grade Security"}</h3>
              <p className="text-sm text-[#6b6560] leading-relaxed">
                {c.securityDesc || "All contracts are processed through Odoo's enterprise platform with end-to-end encryption, audit trails, and compliance with Indonesian e-signature regulations. Your documents are stored securely and accessible only to authorized parties."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">{c.faqTitle || "FAQ"}</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl tracking-tight">{c.faqSubtitle || "Frequently Asked Questions"}</motion.h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group glass-card rounded-2xl overflow-hidden">
                <summary className="flex items-center gap-3 p-6 cursor-pointer list-none">
                  <HelpCircle size={18} className="text-[#c5a059] shrink-0" />
                  <span className="font-display font-semibold text-sm flex-1">{faq.q}</span>
                  <ArrowRight size={14} className="text-[#6b6560] group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pl-12">
                  <p className="text-sm text-[#6b6560] leading-relaxed">{faq.a}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display font-bold text-3xl mb-4">{c.ctaTitle || "Ready to Get Started?"}</h2>
            <p className="text-[#8a8580] mb-8">{c.ctaDesc || "Contact our team to discuss your contract requirements and begin the digital signing process."}</p>
            <button onClick={() => setLeadOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#c5a059] text-black font-display font-semibold text-base hover:bg-[#d4b06a] transition-all shadow-lg shadow-[#c5a059]/20">
              {c.ctaButton || "Discuss Contracts"} <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
