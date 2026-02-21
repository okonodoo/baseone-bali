/* Login — Modern Auth with Turkish translations */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Mail, Lock, Eye, EyeOff, User, AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export default function Login() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Load Cloudflare Turnstile
  useEffect(() => {
    const renderTurnstile = () => {
      if (turnstileRef.current && window.turnstile && !turnstileWidgetId.current) {
        try {
          turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
  sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
            callback: (token: string) => setTurnstileToken(token),
            "error-callback": () => setTurnstileToken(null),
            theme: "dark",
          });
        } catch (e) {
          console.error("Turnstile render error:", e);
        }
      }
    };

    // Check if script is already loaded
    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    // Check if script element already exists
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existingScript) {
      existingScript.addEventListener("load", renderTurnstile);
      return () => {
        existingScript.removeEventListener("load", renderTurnstile);
      };
    }

    // Load the script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderTurnstile;
    document.head.appendChild(script);

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
          turnstileWidgetId.current = null;
        } catch (e) {
          console.error("Turnstile cleanup error:", e);
        }
      }
    };
  }, []);

  const handleGoogleLogin = () => {
    const loginUrl = getLoginUrl();
    const url = new URL(loginUrl);
    url.searchParams.set("provider", "google");
    window.location.href = url.toString();
  };

  const registerMutation = trpc.auth.register.useMutation();
  const loginMutation = trpc.auth.login.useMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "register" && !name.trim()) {
      newErrors.name = t.login?.nameRequired || "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = t.login?.emailRequired || "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t.login?.emailInvalid || "Invalid email format";
    }

    if (!password) {
      newErrors.password = t.login?.passwordRequired || "Password is required";
    } else if (mode === "register" && password.length < 8) {
      newErrors.password = t.login?.passwordTooShort || "Password must be at least 8 characters";
    }

    if (!turnstileToken) {
      newErrors.general = t.login?.securityVerificationRequired || "Please complete the security verification";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (mode === "register") {
        await registerMutation.mutateAsync({
          name,
          email,
          password,
          turnstileToken: turnstileToken || "",
        });
        toast.success(t.login?.registrationSuccess || "Account created successfully!");
        window.location.href = "/";
      } else {
        await loginMutation.mutateAsync({
          email,
          password,
          turnstileToken: turnstileToken || "",
        });
        toast.success(t.login?.loginSuccess || "Login successful!");
        window.location.href = "/";
      }
    } catch (error: any) {
      const errorMessage = error?.message || t.login?.loginError || "An error occurred. Please try again.";
      setErrors({ general: errorMessage });
      setIsSubmitting(false);

      // Reset turnstile
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
        setTurnstileToken(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/20 via-[#0a0a0b] to-[#0a0a0b]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/50" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="space-y-6">
            {/* Back Button */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#8a8580] hover:text-[#c5a059] hover:bg-white/5 transition-all group w-fit"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">{t.nav.home}</span>
            </Link>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#b8934a] flex items-center justify-center shadow-lg shadow-[#c5a059]/20">
                <span className="text-black font-display font-extrabold text-base">BO</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-xl tracking-tight">
                  Bali<span className="text-[#c5a059]">ONE</span>
                </span>
                <span className="text-[10px] text-[#8a8580] font-mono uppercase tracking-[0.2em] ml-2">
                  Global
                </span>
              </div>
            </Link>
          </div>

          <div className="max-w-md">
            <h1 className="font-display font-extrabold text-4xl xl:text-5xl text-white leading-tight mb-6">
              {t.hero.title1}
              <br />
              <span className="gold-text">{t.hero.title2}</span>
            </h1>
            <p className="text-[#a09a94] text-lg leading-relaxed mb-8">
              {t.hero.subtitle}
            </p>

            <div className="space-y-4">
              {[
                t.login.exploreAI,
                t.login.fullPMA,
                t.login.eightSectors,
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c5a059]/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} className="text-[#c5a059]" />
                  </div>
                  <span className="text-sm text-[#a09a94]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#6b6560] text-xs font-mono">
            <Shield size={12} className="text-[#c5a059]" />
            <span>{t.login.securedBy}</span>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo + Back button */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#8a8580] hover:text-[#c5a059] hover:bg-white/5 transition-all group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">{t.nav.home}</span>
              </Link>
            </div>
            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#b8934a] flex items-center justify-center shadow-lg shadow-[#c5a059]/20">
                  <span className="text-black font-display font-extrabold text-base">BO</span>
                </div>
                <span className="font-display font-bold text-white text-xl">
                  Bali<span className="text-[#c5a059]">ONE</span>
                  <span className="text-[10px] text-[#8a8580] font-mono uppercase tracking-[0.2em] ml-2">Global</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
              {mode === "login" ? t.login.welcomeBack : t.login.createAccount}
            </h2>
            <p className="text-[#8a8580]">
              {t.login.signInToAccess}
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{errors.general}</span>
              </motion.div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-xs text-[#8a8580] font-mono uppercase tracking-wider mb-2">
                  {t.lead.fullName}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.login.namePlaceholder}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border ${
                      errors.name ? "border-red-500/50" : "border-white/10"
                    } text-white text-sm placeholder-[#4a4540] focus:outline-none focus:border-[#c5a059]/50 focus:bg-white/[0.07] transition-all`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs text-[#8a8580] font-mono uppercase tracking-wider mb-2">
                {t.lead.email}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.login.emailPlaceholder}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border ${
                    errors.email ? "border-red-500/50" : "border-white/10"
                  } text-white text-sm placeholder-[#4a4540] focus:outline-none focus:border-[#c5a059]/50 focus:bg-white/[0.07] transition-all`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-[#8a8580] font-mono uppercase tracking-wider">
                  {t.login.password}
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-xs text-[#c5a059] hover:text-[#d4b06a] transition-colors"
                  >
                    {t.login.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? t.login.minCharacters : t.login.passwordPlaceholder}
                  className={`w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/5 border ${
                    errors.password ? "border-red-500/50" : "border-white/10"
                  } text-white text-sm placeholder-[#4a4540] focus:outline-none focus:border-[#c5a059]/50 focus:bg-white/[0.07] transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6560] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>}
            </div>

            {/* Cloudflare Turnstile */}
            <div className="flex justify-center">
              <div ref={turnstileRef} />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-all shadow-lg shadow-[#c5a059]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? t.nav.signIn : t.login.createAccount}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-[#6b6560] font-mono uppercase tracking-wider">{t.login.orSignInWith}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Button - Secondary */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t.login.continueWithGoogle}
          </button>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b6560]">
              {mode === "login" ? t.login.dontHaveAccount : t.login.alreadyHaveAccount}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setErrors({});
                  setPassword("");
                }}
                className="text-[#c5a059] hover:text-[#d4b06a] font-medium transition-colors"
              >
                {mode === "login" ? t.login.createAccount : t.nav.signIn}
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#4a4540]">
              {t.login.agreeTerms}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
