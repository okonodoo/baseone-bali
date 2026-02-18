/* ============================================================
 * AI Investment Advisor — Scenario 1 — i18n + Lead Modal
 * ============================================================ */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, ArrowRight, DollarSign, TrendingUp,
  AlertTriangle, CheckCircle2, Loader2, ArrowLeft, MessageSquare,
} from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { getWhatsAppUrl } from "@/components/WhatsAppButton";
import { getAIAdvisorResponse, AI_ADVISOR_IMAGE } from "@/lib/investmentData";
import type { AIAdvisorResponse } from "@/lib/investmentData";
import { useTranslation } from "@/i18n";
import { useSubscription } from "@/hooks/useSubscription";
import ContentLock from "@/components/ContentLock";
import { useSEO } from "@/hooks/useSEO";

interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  data?: AIAdvisorResponse;
  budget?: number;
  timestamp: Date;
}

export default function AIAdvisor() {
  const { t, locale } = useTranslation();
  const { isPremium } = useSubscription();

  useSEO({
    title: "AI Investment Advisor — Personalized Bali Investment Analysis",
    description: "Get instant AI-powered investment analysis for Bali. Enter your budget and receive personalized sector recommendations, PMA setup costs, ROI projections, and regulatory guidance.",
    keywords: "AI investment advisor, Bali investment analysis, PMA cost calculator, Bali ROI calculator, foreign investment advisor Indonesia, Bali business cost, investment budget Bali",
    ogUrl: "https://baseoneglobal.com/ai-advisor",
    canonicalUrl: "https://baseoneglobal.com/ai-advisor",
  });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [lastBudget, setLastBudget] = useState("");
  const [lastContext, setLastContext] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  // Initialize welcome message with current locale
  useEffect(() => {
    setMessages([{
      id: "welcome",
      type: "system",
      content: t.advisor.welcome,
      timestamp: new Date(),
    }]);
  }, [t.advisor.welcome]);

  useEffect(() => {
    // Only scroll when explicitly triggered and user is near bottom
    if (shouldAutoScroll) {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        if (isNearBottom || messages.length <= 2) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
      setShouldAutoScroll(false);
    }
  }, [messages, isTyping, shouldAutoScroll]);

  const parseBudget = (text: string): number | null => {
    const cleaned = text.replace(/[^0-9.,kKmM]/g, "");
    let num = parseFloat(cleaned.replace(/,/g, ""));
    if (cleaned.toLowerCase().endsWith("k")) {
      num = parseFloat(cleaned.slice(0, -1).replace(/,/g, "")) * 1000;
    } else if (cleaned.toLowerCase().endsWith("m")) {
      num = parseFloat(cleaned.slice(0, -1).replace(/,/g, "")) * 1000000;
    }
    return isNaN(num) ? null : num;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const budget = parseBudget(input);
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setShouldAutoScroll(true);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      if (budget === null || budget < 5000) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: t.advisor.parseError,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } else {
        const response = getAIAdvisorResponse(budget, locale);
        setLastBudget(`$${budget.toLocaleString()}`);
        setLastContext(
          `Budget: $${budget.toLocaleString()}\nROI: ${response.estimatedROI}\nRisk: ${response.riskLevel}\nRecommendations: ${response.recommendations.join(", ")}`
        );
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: response.summary,
          data: response,
          budget,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
      setShouldAutoScroll(true);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const quickBudgets = ["$25,000", "$45,000", "$75,000", "$150,000", "$250,000"];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Navbar onTalkToExpert={() => setLeadOpen(true)} />

      {/* Hero Banner */}
      <div className="relative pt-20">
        <div className="absolute inset-0 h-64">
          <img src={AI_ADVISOR_IMAGE} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/60 to-[#0a0a0b]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors mb-6">
            <ArrowLeft size={14} /> {t.advisor.backToHome}
          </Link>
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center">
                <Bot size={24} className="text-[#c5a059]" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl">{t.advisor.title}</h1>
                <p className="text-sm text-[#6b6560]">{t.advisor.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={messagesContainerRef} className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-4 overflow-y-auto">
        <div className="space-y-6 py-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {msg.type === "system" && (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare size={14} className="text-[#c5a059]" />
                    </div>
                    <div className="glass-card rounded-2xl rounded-tl-md px-5 py-4 max-w-[85%]">
                      <p className="text-sm text-[#a09a94] leading-relaxed">{msg.content}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {quickBudgets.map((b) => (
                          <button key={b} onClick={() => { setInput(b); inputRef.current?.focus(); }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#c5a059] hover:bg-[#c5a059]/10 hover:border-[#c5a059]/30 transition-all">
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {msg.type === "user" && (
                  <div className="flex justify-end mb-4">
                    <div className="bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-2xl rounded-tr-md px-5 py-3 max-w-[75%]">
                      <p className="text-sm font-medium text-[#e8e4dc]">{msg.content}</p>
                    </div>
                  </div>
                )}

                {msg.type === "ai" && (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-[#c5a059]" />
                    </div>
                    <div className="glass-card rounded-2xl rounded-tl-md px-5 py-4 max-w-[90%] space-y-5">
                      <p className="text-sm text-[#e8e4dc] leading-relaxed">{msg.content}</p>

                      {msg.data && (
                        <>
                          {/* Free users see teaser, Premium+ see full details */}
                          {isPremium ? (
                            <>
                              <div>
                                <h4 className="text-xs font-display font-semibold text-[#c5a059] uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <DollarSign size={12} /> {t.advisor.costBreakdown}
                                </h4>
                                <div className="space-y-2">
                                  {msg.data.breakdown.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                      <div>
                                        <span className="text-sm text-[#e8e4dc]">{item.item}</span>
                                        <p className="text-[11px] text-[#6b6560]">{item.description}</p>
                                      </div>
                                      <span className="font-mono text-sm text-[#c5a059] shrink-0 ml-4">{item.cost}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <TrendingUp size={14} className="text-emerald-400 mx-auto mb-1" />
                                  <div className="font-mono text-sm font-bold text-emerald-400">{msg.data.estimatedROI}</div>
                                  <div className="text-[10px] text-[#6b6560] uppercase">{t.advisor.estROI}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <AlertTriangle size={14} className="text-amber-400 mx-auto mb-1" />
                                  <div className="font-mono text-sm font-bold text-amber-400">{msg.data.riskLevel}</div>
                                  <div className="text-[10px] text-[#6b6560] uppercase">{t.advisor.risk}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <DollarSign size={14} className="text-[#c5a059] mx-auto mb-1" />
                                  <div className="font-mono text-sm font-bold text-[#c5a059]">{msg.data.remainingBudget}</div>
                                  <div className="text-[10px] text-[#6b6560] uppercase">{t.advisor.reserve}</div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xs font-display font-semibold text-[#c5a059] uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <CheckCircle2 size={12} /> {t.advisor.recommendations}
                                </h4>
                                <ul className="space-y-2">
                                  {msg.data.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-[#a09a94]">
                                      <span className="text-[#c5a059] mt-1 shrink-0">•</span>{rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          ) : (
                            <ContentLock requiredTier="premium" showPreview={true}>
                              <div>
                                <h4 className="text-xs font-display font-semibold text-[#c5a059] uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <DollarSign size={12} /> {t.advisor.costBreakdown}
                                </h4>
                                <div className="space-y-2">
                                  {msg.data.breakdown.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                      <div>
                                        <span className="text-sm text-[#e8e4dc]">{item.item}</span>
                                        <p className="text-[11px] text-[#6b6560]">{item.description}</p>
                                      </div>
                                      <span className="font-mono text-sm text-[#c5a059] shrink-0 ml-4">{item.cost}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <TrendingUp size={14} className="text-emerald-400 mx-auto mb-1" />
                                  <div className="font-mono text-sm font-bold text-emerald-400">{msg.data.estimatedROI}</div>
                                  <div className="text-[10px] text-[#6b6560] uppercase">{t.advisor.estROI}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <AlertTriangle size={14} className="text-amber-400 mx-auto mb-1" />
                                  <div className="font-mono text-sm font-bold text-amber-400">{msg.data.riskLevel}</div>
                                  <div className="text-[10px] text-[#6b6560] uppercase">{t.advisor.risk}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <DollarSign size={14} className="text-[#c5a059] mx-auto mb-1" />
                                  <div className="font-mono text-sm font-bold text-[#c5a059]">{msg.data.remainingBudget}</div>
                                  <div className="text-[10px] text-[#6b6560] uppercase">{t.advisor.reserve}</div>
                                </div>
                              </div>
                            </ContentLock>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              onClick={() => {
                                const sub = (window as any).__trpcSubscription;
                                if (sub) {
                                  sub.checkout({ productKey: "scoutingFee" });
                                } else {
                                  window.location.href = "/pricing?action=scouting";
                                }
                              }}
                              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-colors shadow-lg shadow-[#c5a059]/20">
                              <DollarSign size={14} /> {(t as any).scouting?.startButton || "Start Scouting — $500"}
                            </button>
                            <button onClick={() => setLeadOpen(true)}
                              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-display font-semibold text-sm hover:bg-[#1da851] transition-colors">
                              {t.advisor.talkToExpert} <ArrowRight size={14} />
                            </button>
                            <Link href="/investment-wizard"
                              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-display font-medium text-sm hover:bg-white/10 transition-colors">
                              {t.advisor.tryWizard}
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-[#c5a059]" />
              </div>
              <div className="glass-card rounded-2xl rounded-tl-md px-5 py-4">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="text-[#c5a059] animate-spin" />
                  <span className="text-sm text-[#6b6560]">{t.advisor.analyzing}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 bg-[#0a0a0b]/90 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560]" />
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={t.advisor.placeholder}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#6b6560] focus:outline-none focus:border-[#c5a059]/40 focus:ring-1 focus:ring-[#c5a059]/20 transition-all font-mono"
                disabled={isTyping} />
            </div>
            <button type="submit" disabled={isTyping || !input.trim()}
              className="w-12 h-12 rounded-xl bg-[#c5a059] text-black flex items-center justify-center hover:bg-[#d4b06a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#c5a059]/20">
              <Send size={18} />
            </button>
          </form>
          <p className="text-[10px] text-[#6b6560] mt-2 text-center font-mono">{t.advisor.disclaimer}</p>
        </div>
      </div>

      <Footer />

      <LeadFormModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        type="expert"
        prefillBudget={lastBudget}
        contextData={lastContext}
      />
    </div>
  );
}
