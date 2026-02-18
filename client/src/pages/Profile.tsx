import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  User, Mail, Phone, Globe, Crown, Shield, ArrowRight,
  Edit3, Check, X, Sparkles, Calendar, CreditCard,
  Upload, FileCheck, AlertCircle, CheckCircle2, Loader2, Paperclip,
} from "lucide-react";
import { CountrySelect, PhoneInput } from "@/components/CountrySelect";

/* ── VGR Stage Progress Bar ── */
const VGR_STAGE_NAMES = [
  "KYC Check",
  "Due Diligence",
  "Contract Drafting",
  "Waiting Signature",
  "PT PMA Setup",
  "KITAS Process",
  "Completed",
];

function StageProgressBar({ currentStage }: { currentStage: string }) {
  const currentIndex = VGR_STAGE_NAMES.findIndex(
    (s) => s.toLowerCase() === currentStage.toLowerCase()
  );
  const progress = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[#6b6560]">
        <span>{VGR_STAGE_NAMES[0]}</span>
        <span>{VGR_STAGE_NAMES[VGR_STAGE_NAMES.length - 1]}</span>
      </div>
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c5a059] to-[#d4b06a] rounded-full transition-all duration-500"
          style={{ width: `${((progress + 1) / VGR_STAGE_NAMES.length) * 100}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {VGR_STAGE_NAMES.map((stage, i) => (
          <span
            key={stage}
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              i <= progress
                ? "bg-[#c5a059]/20 text-[#c5a059]"
                : "bg-white/5 text-[#6b6560]"
            }`}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's VGR lead status
  const {
    data: leadResult,
    isLoading: leadLoading,
    refetch: refetchLead,
  } = trpc.partner.getMyLead.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  // Fetch lead attachments when we have a lead
  const leadId = leadResult?.lead?.id;
  const {
    data: attachResult,
    refetch: refetchAttachments,
  } = trpc.partner.getLeadAttachments.useQuery(
    { leadId: leadId! },
    { enabled: !!leadId, retry: false }
  );

  const uploadAttachment = trpc.partner.uploadLeadAttachment.useMutation({
    onSuccess: () => {
      toast.success(t.profile.passportUploaded);
      setPassportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetchLead();
      refetchAttachments();
    },
    onError: (err) => {
      toast.error(t.profile.passportUploadError);
      console.error("[Profile] Passport upload error:", err);
    },
  });

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      toast.success(t.profile.updateSuccess);
      setEditing(false);
      window.location.reload();
    },
    onError: () => {
      toast.error(t.profile.updateError);
    },
  });

  const startEditing = () => {
    setName(user?.name || "");
    setPhone((user as any)?.phone || "");
    setCountry((user as any)?.country || "");
    setEditing(true);
  };

  const saveProfile = () => {
    updateProfile.mutate({ name, phone, country });
  };

  const handlePassportUpload = () => {
    if (!passportFile || !leadId) {
      toast.error(t.profile.noPassportSelected);
      return;
    }
    if (passportFile.size > 10 * 1024 * 1024) {
      toast.error(t.profile.fileTooLarge);
      return;
    }
    setUploadingPassport(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Full = reader.result as string;
        const base64Data = base64Full.split(",")[1] || base64Full;
        await uploadAttachment.mutateAsync({
          leadId,
          fileName: passportFile.name,
          fileBase64: base64Data,
          mimeType: passportFile.type || "application/pdf",
        });
      } catch {
        // error handled in mutation onError
      } finally {
        setUploadingPassport(false);
      }
    };
    reader.readAsDataURL(passportFile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center">
          <User size={48} className="text-[#c5a059] mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl mb-4">{t.profile.loginRequired}</h1>
          <p className="text-[#8a8580] mb-8">{t.profile.loginRequiredDesc}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const tier = (user as any).subscriptionTier || "free";
  const tierConfig: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
    free: { label: "Free", color: "text-[#8a8580]", icon: <User size={18} />, bg: "bg-white/5" },
    premium: { label: "Premium", color: "text-[#c5a059]", icon: <Crown size={18} />, bg: "bg-[#c5a059]/10" },
    vip: { label: "VIP", color: "text-[#ffd700]", icon: <Sparkles size={18} />, bg: "bg-[#ffd700]/10" },
  };
  const currentTier = tierConfig[tier] || tierConfig.free;

  const lead = leadResult?.lead;
  const stageName = lead?.stage_id && Array.isArray(lead.stage_id) ? lead.stage_id[1] : null;
  const isKycCheck = stageName === "KYC Check";
  const attachments = attachResult?.attachments || [];
  const hasPassport = attachments.some(
    (a: any) => (a.name || "").toLowerCase().includes("passport")
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-2">
            {t.profile.title}
          </h1>
          <p className="text-[#8a8580]">{t.profile.subtitle}</p>
        </div>

        {/* ══════════════ PENDING ACTIONS ══════════════ */}
        {lead && isKycCheck && !hasPassport && (
          <div className="rounded-2xl border border-[#c5a059]/30 bg-gradient-to-br from-[#c5a059]/10 to-[#c5a059]/5 p-6 sm:p-8 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/20 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-[#c5a059]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-xl mb-1">{t.profile.pendingActions}</h2>
                <p className="text-sm text-[#a09a94] mb-5">{t.profile.pendingActionsDesc}</p>

                <div className="bg-[#0a0a0b]/60 border border-[#c5a059]/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload size={18} className="text-[#c5a059]" />
                    <h3 className="font-display font-semibold text-base">{t.profile.kycRequired}</h3>
                  </div>
                  <p className="text-sm text-[#8a8580] mb-4">{t.profile.kycRequiredDesc}</p>

                  <div className="space-y-3">
                    <label className="text-xs text-[#6b6560] block">{t.profile.acceptedFormats}</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setPassportFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-white
                        file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0
                        file:bg-[#c5a059] file:text-black file:font-semibold file:cursor-pointer
                        hover:file:bg-[#d4b06a] file:transition-colors
                        bg-white/5 border border-white/10 rounded-lg cursor-pointer"
                    />

                    {passportFile && (
                      <div className="flex items-center gap-2 text-sm text-[#c5a059]">
                        <FileCheck size={16} />
                        <span>{passportFile.name} ({(passportFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    )}

                    <button
                      onClick={handlePassportUpload}
                      disabled={!passportFile || uploadingPassport}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                        bg-[#c5a059] text-black font-display font-semibold text-sm
                        hover:bg-[#d4b06a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingPassport ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {t.profile.uploading}
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          {t.profile.uploadPassport}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ INVESTMENT STAGE PROGRESS ══════════════ */}
        {lead && stageName && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">{t.profile.investmentStage}</h2>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#c5a059]" />
                <span className="text-sm font-display font-semibold text-[#c5a059]">{stageName}</span>
              </div>
            </div>

            <StageProgressBar currentStage={stageName} />

            {attachments.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-sm text-[#a09a94] mb-2">
                  <Paperclip size={14} />
                  <span>{t.profile.viewAttachments}: <strong className="text-[#c5a059]">{attachments.length} {t.profile.attachmentsCount}</strong></span>
                </div>
                <div className="space-y-1">
                  {attachments.map((att: any) => (
                    <div key={att.id} className="flex items-center gap-2 text-xs text-[#6b6560]">
                      <FileCheck size={12} className="text-[#c5a059]" />
                      <span>{att.name}</span>
                      {att.file_size && <span className="text-[#4a4540]">({(att.file_size / 1024).toFixed(0)} KB)</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasPassport && isKycCheck && (
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-sm text-green-300">{t.profile.passportUploaded}</span>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ NO ACTIVE PROCESS ══════════════ */}
        {!leadLoading && !lead && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6 text-center">
            <p className="text-[#6b6560] text-sm">{t.profile.noActiveProcess}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: User Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg">{t.profile.personalInfo}</h2>
                {!editing ? (
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-2 text-sm text-[#c5a059] hover:text-[#d4b06a] transition-colors"
                  >
                    <Edit3 size={14} />
                    {t.profile.edit}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveProfile}
                      disabled={updateProfile.isPending}
                      className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Check size={14} />
                      {t.profile.save}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={14} />
                      {t.profile.cancel}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 pb-5 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                    <User size={28} />
                  </div>
                  <div>
                    {editing ? (
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-display font-semibold text-lg focus:outline-none focus:border-[#c5a059]/50"
                      />
                    ) : (
                      <h3 className="font-display font-semibold text-lg">{user.name || "—"}</h3>
                    )}
                    <p className="text-sm text-[#6b6560]">{t.profile.memberSince} {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#6b6560] shrink-0" />
                  <div>
                    <p className="text-xs text-[#6b6560] uppercase tracking-wider">{t.profile.email}</p>
                    <p className="text-sm">{user.email || "—"}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#6b6560] shrink-0" />
                  <div>
                    <p className="text-xs text-[#6b6560] uppercase tracking-wider">{t.profile.phone}</p>
                    {editing ? (
                      <PhoneInput
                        value={phone}
                        onChange={setPhone}
                        placeholder={t.profile.phonePlaceholder || "Phone number"}
                      />
                    ) : (
                      <p className="text-sm">{(user as any).phone || "—"}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-[#6b6560] shrink-0" />
                  <div>
                    <p className="text-xs text-[#6b6560] uppercase tracking-wider">{t.profile.country}</p>
                    {editing ? (
                      <CountrySelect
                        value={country}
                        onChange={setCountry}
                        placeholder={t.profile.selectCountry || "Select country..."}
                      />
                    ) : (
                      <p className="text-sm">{(user as any).country || "—"}</p>
                    )}
                  </div>
                </div>

                {/* Login Method */}
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-[#6b6560] shrink-0" />
                  <div>
                    <p className="text-xs text-[#6b6560] uppercase tracking-wider">{t.profile.loginMethod}</p>
                    <p className="text-sm capitalize">{user.loginMethod || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Subscription Card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="font-display font-semibold text-lg mb-4">{t.profile.subscription}</h2>
              <div className={`rounded-xl ${currentTier.bg} border border-white/5 p-4 mb-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={currentTier.color}>{currentTier.icon}</span>
                  <span className={`font-display font-bold text-lg ${currentTier.color}`}>
                    {currentTier.label}
                  </span>
                </div>
                <p className="text-xs text-[#6b6560]">
                  {tier === "free" ? t.profile.freeDesc : tier === "premium" ? t.profile.premiumDesc : t.profile.vipDesc}
                </p>
              </div>

              {tier !== "vip" && (
                <Link
                  href="/pricing"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-all"
                >
                  {tier === "free" ? t.profile.upgradeToPremium : t.profile.upgradeToVip}
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="font-display font-semibold text-lg mb-4">{t.profile.quickLinks}</h2>
              <div className="space-y-2">
                <Link
                  href="/ai-advisor"
                  className="flex items-center gap-2 text-sm text-[#a09a94] hover:text-[#c5a059] transition-colors py-2"
                >
                  <Sparkles size={14} />
                  {t.nav.aiAdvisor}
                </Link>
                <Link
                  href="/investment-wizard"
                  className="flex items-center gap-2 text-sm text-[#a09a94] hover:text-[#c5a059] transition-colors py-2"
                >
                  <CreditCard size={14} />
                  {t.nav.investmentWizard}
                </Link>
                <Link
                  href="/properties"
                  className="flex items-center gap-2 text-sm text-[#a09a94] hover:text-[#c5a059] transition-colors py-2"
                >
                  <Calendar size={14} />
                  {t.nav.properties}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
