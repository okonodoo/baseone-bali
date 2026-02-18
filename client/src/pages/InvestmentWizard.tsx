/* ============================================================
 * Investment Wizard — Scenario 2 — i18n + Lead Modal + VIP Lock
 * ============================================================ */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, CheckCircle2, DollarSign, MapPin,
  FileText, Shield, Clock, TrendingUp, Building2, Globe,
  Heart, Ship, HardHat, GraduationCap, Cpu, UtensilsCrossed,
  Compass, ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { getWhatsAppUrl } from "@/components/WhatsAppButton";
import ContentLock from "@/components/ContentLock";
import { BUDGET_RANGES, SECTORS, WIZARD_IMAGE, getWizardResult } from "@/lib/investmentData";
import type { WizardResult } from "@/lib/investmentData";
import { useTranslation } from "@/i18n";
import { useSubscription } from "@/hooks/useSubscription";
import { useSEO } from "@/hooks/useSEO";

const sectorIconMap: Record<string, React.ReactNode> = {
  restaurant: <UtensilsCrossed size={24} />,
  villa: <Building2 size={24} />,
  digital: <Globe size={24} />,
  wellness: <Heart size={24} />,
  "import-export": <Ship size={24} />,
  construction: <HardHat size={24} />,
  education: <GraduationCap size={24} />,
  crypto: <Cpu size={24} />,
};

export default function InvestmentWizard() {
  const { t } = useTranslation();
  const { isVip } = useSubscription();

  useSEO({
    title: "Investment Wizard — Step-by-Step Bali Business Guide",
    description: "3-step guided wizard for Bali investment. Select your budget, choose a sector, and get comprehensive results including CAPEX breakdown, KBLI codes, permits, regulations, and regional recommendations.",
    keywords: "Bali investment wizard, Bali business guide, KBLI codes Indonesia, Bali permits, PMA investment cost, Bali sector analysis, Indonesia business regulations, Bali CAPEX calculator",
    ogUrl: "https://baseoneglobal.com/investment-wizard",
    canonicalUrl: "https://baseoneglobal.com/investment-wizard",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadType, setLeadType] = useState<"expert" | "report">("expert");

  const steps = [
    { id: 1, label: t.wizard.stepBudget, icon: DollarSign },
    { id: 2, label: t.wizard.stepSector, icon: Compass },
    { id: 3, label: t.wizard.stepResults, icon: FileText },
  ];

  const result: WizardResult | null = useMemo(() => {
    if (selectedBudget && selectedSector) {
      return getWizardResult(selectedBudget, selectedSector);
    }
    return null;
  }, [selectedBudget, selectedSector]);

  const canProceed = () => {
    if (currentStep === 1) return !!selectedBudget;
    if (currentStep === 2) return !!selectedSector;
    return false;
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceed()) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedBudget(null);
    setSelectedSector(null);
  };

  const openLeadModal = (type: "expert" | "report") => {
    setLeadType(type);
    setLeadOpen(true);
  };

  const budgetLabel = BUDGET_RANGES.find((b) => b.id === selectedBudget)?.label ?? "";
  const sectorLabel = SECTORS.find((s) => s.id === selectedSector)?.label ?? "";
  const contextData = result
    ? `Budget: ${budgetLabel}\nSector: ${sectorLabel}\nTotal CAPEX: $${result.totalCapex.toLocaleString()}\nROI: ${result.estimatedROI}\nBreak-even: ${result.breakEvenMonths} months`
    : "";

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar onTalkToExpert={() => openLeadModal("expert")} />

      {/* Hero Banner */}
      <div className="relative pt-20">
        <div className="absolute inset-0 h-48">
          <img src={WIZARD_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/60 to-[#0a0a0b]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors mb-6">
            <ArrowLeft size={14} /> {t.wizard.backHome}
          </Link>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center">
              <Compass size={24} className="text-[#c5a059]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl">{t.wizard.title}</h1>
              <p className="text-sm text-[#6b6560]">{t.wizard.subtitle}</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 sm:gap-4">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-display font-medium transition-all ${
                    currentStep === step.id
                      ? "bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059]"
                      : currentStep > step.id
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border border-white/5 text-[#6b6560]"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle2 size={14} /> : <step.icon size={14} />}
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.id}</span>
                </button>
                {i < steps.length - 1 && <ChevronRight size={14} className="text-[#6b6560]/30" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <AnimatePresence mode="wait">
          {/* STEP 1: Budget Selection */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="py-10">
              <h2 className="font-display font-bold text-xl sm:text-2xl mb-2">{t.wizard.selectBudget}</h2>
              <p className="text-sm text-[#6b6560] mb-8">{t.wizard.selectBudgetDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUDGET_RANGES.map((range) => (
                  <button key={range.id} onClick={() => setSelectedBudget(range.id)}
                    className={`group text-left p-6 rounded-2xl border transition-all duration-300 ${
                      selectedBudget === range.id ? "bg-[#c5a059]/10 border-[#c5a059]/40 gold-border-glow" : "glass-card glass-card-hover"
                    }`}>
                    <div className="flex items-center justify-between mb-3">
                      <DollarSign size={20} className={selectedBudget === range.id ? "text-[#c5a059]" : "text-[#6b6560] group-hover:text-[#c5a059]"} />
                      {selectedBudget === range.id && <CheckCircle2 size={16} className="text-[#c5a059]" />}
                    </div>
                    <div className="font-display font-bold text-lg">{range.label}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={handleNext} disabled={!canProceed()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#c5a059]/20">
                  {t.wizard.nextSector} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Sector Selection */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="py-10">
              <h2 className="font-display font-bold text-xl sm:text-2xl mb-2">{t.wizard.selectSector}</h2>
              <p className="text-sm text-[#6b6560] mb-8">{t.wizard.selectSectorDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SECTORS.map((sector) => {
                  const sectorKey = sector.id.replace(/-/g, '');
                  const sectorName = (t.sectors as any)[sectorKey] || sector.label;
                  const sectorDesc = (t.sectors as any)[`${sectorKey}Desc`] || sector.description;
                  return (
                    <button key={sector.id} onClick={() => setSelectedSector(sector.id)}
                      className={`group text-left p-5 rounded-2xl border transition-all duration-300 ${
                        selectedSector === sector.id ? "bg-[#c5a059]/10 border-[#c5a059]/40 gold-border-glow" : "glass-card glass-card-hover"
                      }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          selectedSector === sector.id ? "bg-[#c5a059]/20 text-[#c5a059]" : "bg-white/5 text-[#6b6560] group-hover:text-[#c5a059] group-hover:bg-[#c5a059]/10"
                        }`}>{sectorIconMap[sector.id]}</div>
                        {selectedSector === sector.id && <CheckCircle2 size={16} className="text-[#c5a059]" />}
                      </div>
                      <h3 className="font-display font-semibold text-sm mb-1">{sectorName}</h3>
                      <p className="text-[11px] text-[#6b6560] leading-relaxed">{sectorDesc}</p>
                      <div className="mt-2 font-mono text-[10px] text-[#c5a059]/60">KBLI {sector.kbli}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={handleBack}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-display font-medium text-sm hover:bg-white/10 transition-colors">
                  <ArrowLeft size={14} /> {t.wizard.back}
                </button>
                <button onClick={handleNext} disabled={!canProceed()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#c5a059]/20">
                  {t.wizard.seeResults} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Results */}
          {currentStep === 3 && result && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="py-10 space-y-8">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl mb-2">{t.wizard.yourPlan}</h2>
                <p className="text-sm text-[#6b6560]">
                  {BUDGET_RANGES.find((b) => b.id === selectedBudget)?.label} &middot;{" "}
                  {SECTORS.find((s) => s.id === selectedSector)?.label}
                </p>
              </div>

              {/* Overview Cards — visible to all */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: t.wizard.totalCapex, value: `$${result.totalCapex.toLocaleString()}`, icon: DollarSign, color: "text-[#c5a059]" },
                  { label: t.wizard.estROI, value: result.estimatedROI, icon: TrendingUp, color: "text-emerald-400" },
                  { label: t.wizard.breakEven, value: `${result.breakEvenMonths} mo`, icon: Clock, color: "text-amber-400" },
                  { label: t.wizard.monthlyOpex, value: `$${result.monthlyOperational.toLocaleString()}`, icon: DollarSign, color: "text-blue-400" },
                ].map((card) => (
                  <div key={card.label} className="glass-card rounded-2xl p-5 text-center">
                    <card.icon size={16} className={`${card.color} mb-2`} />
                    <div className={`font-mono font-bold text-lg ${card.color}`}>{card.value}</div>
                    <div className="text-[10px] text-[#6b6560] uppercase tracking-wider mt-1">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* VIP-gated detailed content */}
              {isVip ? (
                <>
                  {/* CAPEX Breakdown */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <DollarSign size={16} className="text-[#c5a059]" /> {t.wizard.capexBreakdown}
                    </h3>
                    <div className="space-y-3">
                      {result.capex.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                          <div>
                            <span className="text-sm text-[#e8e4dc]">{item.item}</span>
                            <p className="text-[11px] text-[#6b6560]">{item.description}</p>
                          </div>
                          <span className="font-mono text-sm text-[#c5a059] shrink-0 ml-4">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-3 border-t border-[#c5a059]/20">
                        <span className="font-display font-semibold text-sm">{t.wizard.totalEstCapex}</span>
                        <span className="font-mono font-bold text-base text-[#c5a059]">${result.totalCapex.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Region Recommendations */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <MapPin size={16} className="text-[#c5a059]" /> {t.wizard.recommendedRegions}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.regions.map((region) => (
                        <div key={region.id} className="bg-white/5 rounded-xl p-5 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-display font-semibold text-sm">{region.name}</h4>
                            <span className="text-[10px] font-mono text-[#c5a059] uppercase bg-[#c5a059]/10 px-2 py-0.5 rounded">{region.type}</span>
                          </div>
                          <p className="text-xs text-[#6b6560] leading-relaxed mb-2">{region.description}</p>
                          <span className="font-mono text-xs text-[#8a8580]">{region.avgRent}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regulations & Tax */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <Shield size={16} className="text-[#c5a059]" /> {t.wizard.taxRegulations}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.regulations.map((reg) => (
                        <div key={reg.label} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                          <div>
                            <span className="text-sm text-[#e8e4dc]">{reg.label}</span>
                            <p className="text-[11px] text-[#6b6560]">{reg.description}</p>
                          </div>
                          <span className="font-mono font-bold text-lg text-[#c5a059] ml-4">{reg.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KBLI Codes */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <FileText size={16} className="text-[#c5a059]" /> {t.wizard.kbliPermits}
                    </h3>
                    <div className="space-y-3 mb-6">
                      {result.kbliCodes.map((code) => (
                        <div key={code.code} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                          <span className="font-mono text-sm text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-lg">{code.code}</span>
                          <span className="text-sm text-[#a09a94]">{code.description}</span>
                        </div>
                      ))}
                    </div>
                    <h4 className="text-xs font-display font-semibold text-[#8a8580] uppercase tracking-wider mb-3">{t.wizard.requiredPermits}</h4>
                    <ul className="space-y-2">
                      {result.permits.map((permit) => (
                        <li key={permit} className="flex items-start gap-2 text-sm text-[#a09a94]">
                          <CheckCircle2 size={14} className="text-[#c5a059] mt-0.5 shrink-0" />{permit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PMA Process */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <Clock size={16} className="text-[#c5a059]" /> {t.wizard.pmaProcess}
                    </h3>
                    <div className="space-y-0">
                      {result.pmaProcess.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-xs font-mono text-[#c5a059] shrink-0">{i + 1}</div>
                            {i < result.pmaProcess.length - 1 && <div className="w-[1px] h-full min-h-[40px] bg-[#c5a059]/20 my-1" />}
                          </div>
                          <div className="pb-6">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-display font-semibold text-sm">{step.step}</h4>
                              <span className="font-mono text-[10px] text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded">{step.duration}</span>
                            </div>
                            <p className="text-xs text-[#6b6560]">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Locked VIP content with blurred preview */
                <ContentLock requiredTier="vip" showPreview={true}>
                  {/* CAPEX Breakdown preview */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <DollarSign size={16} className="text-[#c5a059]" /> {t.wizard.capexBreakdown}
                    </h3>
                    <div className="space-y-3">
                      {result.capex.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                          <div>
                            <span className="text-sm text-[#e8e4dc]">{item.item}</span>
                            <p className="text-[11px] text-[#6b6560]">{item.description}</p>
                          </div>
                          <span className="font-mono text-sm text-[#c5a059] shrink-0 ml-4">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Region preview */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <MapPin size={16} className="text-[#c5a059]" /> {t.wizard.recommendedRegions}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.regions.map((region) => (
                        <div key={region.id} className="bg-white/5 rounded-xl p-5 border border-white/5">
                          <h4 className="font-display font-semibold text-sm">{region.name}</h4>
                          <p className="text-xs text-[#6b6560] leading-relaxed">{region.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regulations preview */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display font-semibold text-base mb-5 flex items-center gap-2">
                      <Shield size={16} className="text-[#c5a059]" /> {t.wizard.taxRegulations}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.regulations.map((reg) => (
                        <div key={reg.label} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                          <span className="text-sm text-[#e8e4dc]">{reg.label}</span>
                          <span className="font-mono font-bold text-lg text-[#c5a059] ml-4">{reg.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ContentLock>
              )}

              {/* CTA — always visible */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => window.location.href = '/pricing?action=scouting'}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#c5a059] text-black font-display font-semibold text-base hover:bg-[#d4b06a] transition-colors shadow-lg shadow-[#c5a059]/20">
                  <DollarSign size={16} /> {(t as any).scouting?.startButton || "Start Scouting \u2014 $500"}
                </button>
                <button onClick={() => openLeadModal("expert")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#25D366] text-white font-display font-semibold text-base hover:bg-[#1da851] transition-colors shadow-lg shadow-[#25D366]/20">
                  {t.nav.talkToExpert} <ArrowRight size={16} />
                </button>
                <button onClick={() => openLeadModal("report")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-display font-semibold text-base hover:bg-white/10 transition-colors">
                  <FileText size={16} /> {t.wizard.getReport}
                </button>
                <button onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-[#6b6560] font-display font-medium text-sm hover:text-white transition-colors">
                  {t.wizard.startOver}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      <LeadFormModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        type={leadType}
        prefillBudget={budgetLabel}
        prefillSector={sectorLabel}
        contextData={contextData}
      />
    </div>
  );
}
