/* LeadFormModal — Collects user info and sends to Odoo CRM via tRPC */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Send, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import { trpc } from "@/lib/trpc";

const COUNTRIES = [
  "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Denmark",
  "Finland", "France", "Germany", "India", "Indonesia", "Ireland", "Israel",
  "Italy", "Japan", "Malaysia", "Netherlands", "New Zealand", "Norway",
  "Poland", "Portugal", "Russia", "Saudi Arabia", "Singapore", "South Korea",
  "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "UAE",
  "United Kingdom", "United States", "Vietnam", "Other",
];

const SECTOR_OPTIONS = [
  "Restaurant & Cafe", "Villa Rental", "Digital Agency", "Wellness & Spa",
  "Import / Export", "Construction", "Education", "Crypto & Fintech",
];

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  type?: "expert" | "report";
  prefillBudget?: string;
  prefillSector?: string;
  contextData?: string; // AI recommendations or wizard results
}

export default function LeadFormModal({
  open,
  onClose,
  type = "expert",
  prefillBudget = "",
  prefillSector = "",
  contextData = "",
}: LeadFormModalProps) {
  const { t, locale } = useTranslation();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    budget: prefillBudget,
    sector: prefillSector,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = trpc.lead.create.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: () => setSubmitted(true), // Graceful — show success anyway
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      source: type === "report" ? "investment_wizard" : "talk_to_expert",
      language: locale,
      ...(type === "report"
        ? { wizardResults: contextData }
        : { aiRecommendations: contextData }),
    });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      country: "",
      budget: prefillBudget,
      sector: prefillSector,
      notes: "",
    });
    mutation.reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#141416] border border-white/10 shadow-2xl shadow-black/50"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8a8580] hover:text-white hover:bg-white/10 transition-colors z-10"
            >
              <X size={16} />
            </button>

            {submitted ? (
              /* Success State */
              <div className="p-8 sm:p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-3">
                  {t.lead.successTitle}
                </h3>
                <p className="text-[#8a8580] leading-relaxed mb-8">
                  {t.lead.successMessage}
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold hover:bg-[#d4b06a] transition-colors"
                >
                  {t.lead.successClose}
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-8 sm:p-10">
                {/* Header */}
                <div className="mb-8">
                  <h3 className="font-display font-bold text-2xl text-white mb-2">
                    {type === "report" ? t.lead.titleReport : t.lead.title}
                  </h3>
                  <p className="text-sm text-[#8a8580]">
                    {type === "report" ? t.lead.subtitleReport : t.lead.subtitle}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                      {t.lead.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/20 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                      {t.lead.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/20 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                      {t.lead.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/20 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                      {t.lead.country} *
                    </label>
                    <select
                      required
                      value={form.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/20 outline-none transition-all text-sm appearance-none"
                    >
                      <option value="" className="bg-[#141416]">{t.lead.selectCountry}</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[#141416]">{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget (auto-filled) */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                      {t.lead.budget}
                    </label>
                    <input
                      type="text"
                      value={form.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#c5a059] placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/20 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Sector (auto-filled) */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                      {t.lead.sector}
                    </label>
                    <select
                      value={form.sector}
                      onChange={(e) => handleChange("sector", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/20 outline-none transition-all text-sm appearance-none"
                    >
                      <option value="" className="bg-[#141416]">{t.lead.selectSector}</option>
                      {SECTOR_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#141416]">{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">
                      {t.lead.notes}
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder={t.lead.notesPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/20 outline-none transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-base hover:bg-[#d4b06a] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#c5a059]/20"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t.lead.submitting}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t.lead.submit}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
