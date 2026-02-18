/* Navbar — Golden Archipelago Design System
 * Sticky dark header with gold accent line, glass effect on scroll, language switcher, auth UI */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, Globe, User, LogOut, ChevronDown, LayoutDashboard, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/components/WhatsAppButton";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, LOCALES, type Locale } from "@/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Navbar({ onTalkToExpert }: { onTalkToExpert?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { locale, setLocale, t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Close dropdowns on location change
  useEffect(() => {
    setUserMenuOpen(false);
    setLangOpen(false);
  }, [location]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/ai-advisor", label: t.nav.aiAdvisor },
    { href: "/investment-wizard", label: t.nav.investmentWizard },
    { href: "/properties", label: t.nav.properties },
    { href: "/blog", label: t.nav.blog || "Blog" },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/contact", label: t.nav.contact || "Contact" },
  ];

  const currentLocale = LOCALES.find((l) => l.code === locale)!;

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await logout();
    window.location.href = "/";
  };

  // Get user initials for avatar
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Check if link is active
  const isLinkActive = (href: string) => {
    return location === href || location.startsWith(href + "/");
  };

  return (
    <>
      {/* Gold accent line at very top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent z-[60]" />

      <header
        className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#b8934a] flex items-center justify-center shadow-lg shadow-[#c5a059]/20 group-hover:shadow-[#c5a059]/40 transition-shadow">
                <span className="text-black font-display font-extrabold text-sm">BO</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  Bali<span className="text-[#c5a059]">ONE</span>
                </span>
                <span className="hidden sm:inline text-[10px] text-[#8a8580] font-mono uppercase tracking-[0.2em] ml-2">
                  Global
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isLinkActive(link.href)
                      ? "text-[#c5a059] bg-[#c5a059]/10"
                      : "text-[#8a8580] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Language Switcher + Auth + CTA + Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#a09a94] hover:text-white hover:bg-white/10 transition-all"
                >
                  <Globe size={14} className="text-[#c5a059]" />
                  <span className="uppercase font-mono text-xs tracking-wider">{currentLocale.code}</span>
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#141416] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      {LOCALES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLocale(l.code);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            locale === l.code
                              ? "text-[#c5a059] bg-[#c5a059]/10"
                              : "text-[#a09a94] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="text-base">{l.flag}</span>
                          <span className="font-medium">{l.label}</span>
                          {locale === l.code && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth: Sign In or User Menu */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#a09a94] hover:text-white hover:bg-white/10 transition-all"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#b8934a] flex items-center justify-center">
                      <span className="text-black text-[10px] font-bold">{getInitials(user.name)}</span>
                    </div>
                    <span className="hidden sm:inline text-xs font-medium max-w-[80px] truncate">{user.name || "User"}</span>
                    <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[#141416] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm text-white font-medium truncate">{user.name || "User"}</p>
                          <p className="text-xs text-[#6b6560] truncate">{user.email || ""}</p>
                        </div>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            window.location.href = "/profile";
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#a09a94] hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User size={14} />
                          <span>{t.nav.profile}</span>
                        </button>
                        {(user as any).role === "admin" && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              window.location.href = "/admin";
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#c5a059] hover:text-[#d4b06a] hover:bg-[#c5a059]/5 transition-colors"
                          >
                            <LayoutDashboard size={14} />
                            <span>{t.nav.admin || "Admin Panel"}</span>
                          </button>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        >
                          <LogOut size={14} />
                          <span>{t.nav.signOut}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#a09a94] hover:text-white hover:bg-white/10 transition-all"
                >
                  <User size={14} />
                  <span className="text-xs font-medium">{t.nav.signIn}</span>
                </button>
              )}

              <a
                href={getWhatsAppUrl("Hi, I'm interested in investing in Bali. Can you help me?")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-display font-semibold hover:bg-[#1da851] transition-colors shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle size={14} fill="white" strokeWidth={0} />
                {t.nav.talkToExpert}
              </a>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[66px] z-40 bg-[#0a0a0b]/98 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-4 rounded-2xl text-base font-display font-medium transition-all ${
                    isLinkActive(link.href)
                      ? "text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/20"
                      : "text-[#8a8580] hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile language selector */}
              <div className="mt-4 flex gap-2">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code);
                      setMobileOpen(false);
                    }}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all text-center ${
                      locale === l.code
                        ? "text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/20"
                        : "text-[#8a8580] bg-white/5 border border-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="block text-[10px] mt-0.5 uppercase">{l.code}</span>
                  </button>
                ))}
              </div>

              {/* Mobile auth */}
              {isAuthenticated && user ? (
                <div className="mt-2 flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#b8934a] flex items-center justify-center">
                    <span className="text-black text-xs font-bold">{getInitials(user.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{user.name || "User"}</p>
                    <p className="text-xs text-[#6b6560] truncate">{user.email || ""}</p>
                  </div>
                  <button onClick={handleSignOut} className="text-red-400 hover:text-red-300">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="mt-2 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-[#a09a94] text-base font-display font-medium hover:text-white hover:bg-white/10 transition-all"
                >
                  <User size={16} />
                  {t.nav.signIn}
                </button>
              )}

              <a
                href={getWhatsAppUrl("Hi, I'm interested in investing in Bali. Can you help me?")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-[#25D366] text-white text-base font-display font-semibold"
              >
                <MessageCircle size={16} fill="white" strokeWidth={0} />
                {t.nav.talkToExpert}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
