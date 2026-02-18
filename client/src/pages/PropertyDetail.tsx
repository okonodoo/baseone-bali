import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Car,
  Waves,
  Armchair,
  CheckCircle2,
  Lock,
  MessageSquare,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
  Landmark,
  Trees,
  Warehouse,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { getWhatsAppUrl } from "@/components/WhatsAppButton";
import { PropertyDetailMap } from "@/components/PropertyMap";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  getPropertyById,
  formatPriceUSD,
  formatPriceIDR,
  type PropertyType,
  type Region,
} from "@/lib/propertyData";

export default function PropertyDetail() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { tier } = useSubscription();
  const canViewDetails = tier === "premium" || tier === "vip";
  const isVip = tier === "vip";

  const [leadModal, setLeadModal] = useState(false);
  const [leadType, setLeadType] = useState<"expert" | "report">("expert");
  const [currentImage, setCurrentImage] = useState(0);

  const checkoutMutation = trpc.subscription.checkout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
        toast.info(t.pricing?.redirectingToCheckout || "Redirecting to checkout...");
      }
    },
    onError: (err) => toast.error(err.message || "Payment error"),
  });

  const handleDirectCheckout = (productKey: "premium" | "vip") => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    checkoutMutation.mutate({ productKey });
  };

  const property = getPropertyById(params.id || "");

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl mb-4">Property Not Found</h1>
          <Link href="/properties" className="text-[#c5a059] hover:underline">
            {t.properties.backToListings}
          </Link>
        </div>
      </div>
    );
  }

  const typeLabel = (type: PropertyType): string => {
    const map: Record<PropertyType, string> = {
      villa: t.properties.villa,
      commercial: t.properties.commercial,
      office: t.properties.office,
      land: t.properties.land,
      warehouse: t.properties.warehouse,
    };
    return map[type];
  };

  const regionLabel = (region: Region): string => {
    const map: Record<Region, string> = {
      canggu: t.properties.canggu,
      seminyak: t.properties.seminyak,
      ubud: t.properties.ubud,
      uluwatu: t.properties.uluwatu,
      "nusa-dua": t.properties.nusaDua,
      sanur: t.properties.sanur,
      denpasar: t.properties.denpasar,
      kuta: t.properties.kuta,
    };
    return map[region];
  };

  const typeIcon = (type: PropertyType) => {
    const icons: Record<PropertyType, React.ReactNode> = {
      villa: <Home size={16} />,
      commercial: <Building2 size={16} />,
      office: <Landmark size={16} />,
      land: <Trees size={16} />,
      warehouse: <Warehouse size={16} />,
    };
    return icons[type];
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);

  const openLeadModal = (type: "expert" | "report") => {
    setLeadType(type);
    setLeadModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      {/* Back link */}
      <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors">
          <ArrowLeft size={14} /> {t.properties.backToListings}
        </Link>
      </div>

      {/* Image Gallery */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[400px] lg:h-[500px]">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={property.images[currentImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 via-transparent to-transparent" />

            {/* Nav arrows */}
            {property.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentImage ? "bg-[#c5a059] w-6" : "bg-white/40"}`}
                />
              ))}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-white">
                {typeIcon(property.type)} {typeLabel(property.type)}
              </span>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${property.listingType === "rent" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                {property.listingType === "rent" ? t.properties.forRent : t.properties.forSale}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImage ? "border-[#c5a059]" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Location */}
              <div>
                <div className="flex items-center gap-2 text-sm text-[#c5a059] mb-2">
                  <MapPin size={14} /> {regionLabel(property.region)}
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-4">
                  {property.title}
                </h1>
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-[#8a8580]">
                  <span className="flex items-center gap-1.5"><Maximize2 size={14} /> {property.area} {t.properties.sqm}</span>
                  {property.bedrooms && <span className="flex items-center gap-1.5"><BedDouble size={14} /> {property.bedrooms} {t.properties.bedrooms}</span>}
                  {property.bathrooms && <span className="flex items-center gap-1.5"><Bath size={14} /> {property.bathrooms} {t.properties.bathrooms}</span>}
                  {property.parking && <span className="flex items-center gap-1.5"><Car size={14} /> {property.parking} {t.properties.parking}</span>}
                  {property.pool && <span className="flex items-center gap-1.5"><Waves size={14} /> {t.properties.pool}</span>}
                  {property.furnished && <span className="flex items-center gap-1.5"><Armchair size={14} /> {t.properties.furnished}</span>}
                </div>
              </div>

              {/* Overview */}
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#c5a059] rounded-full" /> {t.properties.overview}
                </h2>
                {canViewDetails ? (
                  <p className="text-[#a09a94] leading-relaxed">{property.description}</p>
                ) : (
                  <div className="relative">
                    <p className="text-[#a09a94] leading-relaxed line-clamp-3">{property.description}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111112] to-transparent" />
                    <div className="mt-4 p-4 rounded-xl bg-[#c5a059]/5 border border-[#c5a059]/20 text-center">
                      <Lock size={16} className="mx-auto text-[#c5a059] mb-2" />
                      <p className="text-sm text-[#8a8580] mb-3">{t.properties.premiumLock}</p>
                      {isAuthenticated ? (
                        <button
                          onClick={() => handleDirectCheckout("premium")}
                          disabled={checkoutMutation.isPending}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#c5a059] text-black text-sm font-display font-semibold hover:bg-[#d4b06a] transition-all disabled:opacity-50"
                        >
                          {checkoutMutation.isPending ? (t.pricing?.processing || "Processing...") : `${t.pricing.unlockPremium} — $19.90`}
                        </button>
                      ) : (
                        <a href="/login" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#c5a059] text-black text-sm font-display font-semibold hover:bg-[#d4b06a] transition-all">
                          {t.nav.signIn}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              {canViewDetails && (
                <div className="glass-card rounded-2xl p-6 sm:p-8">
                  <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#c5a059] rounded-full" /> {t.properties.features}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-[#a09a94]">
                        <CheckCircle2 size={14} className="text-[#c5a059] shrink-0" /> {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location & Nearby */}
              {canViewDetails && (
                <div className="glass-card rounded-2xl p-6 sm:p-8">
                  <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#c5a059] rounded-full" /> {t.properties.location}
                  </h2>
                  {/* Google Maps */}
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
                    <PropertyDetailMap
                      lat={property.coordinates.lat}
                      lng={property.coordinates.lng}
                      title={property.title}
                      className="h-[250px] rounded-xl"
                    />
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-3 text-[#8a8580]">{t.properties.nearbyPlaces}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.nearbyPlaces.map((place) => (
                      <div key={place} className="flex items-center gap-2 text-sm text-[#a09a94]">
                        <MapPin size={12} className="text-[#c5a059] shrink-0" /> {place}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="glass-card rounded-2xl p-6 sticky top-28">
                <h3 className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em] mb-3">{t.properties.priceDetails}</h3>
                {canViewDetails ? (
                  <>
                    <div className="font-display font-bold text-3xl text-[#c5a059] mb-1">
                      {formatPriceUSD(property.priceUSD)}
                      {property.priceLabel && <span className="text-base font-normal text-[#8a8580]">{t.properties.perMonth}</span>}
                    </div>
                    <div className="text-sm text-[#6b6560] mb-6">
                      {formatPriceIDR(property.priceIDR)}{property.priceLabel && t.properties.perMonth}
                    </div>
                  </>
                ) : (
                  <div className="relative mb-6">
                    <div className="font-display font-bold text-3xl text-[#c5a059] blur-md select-none">$XX,XXX</div>
                    <div className="text-sm text-[#6b6560] blur-md select-none">Rp XXX,XXX,XXX</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 text-sm text-[#c5a059] bg-[#c5a059]/10 px-3 py-1.5 rounded-lg border border-[#c5a059]/20">
                        <Lock size={12} /> Premium
                      </span>
                    </div>
                  </div>
                )}

                {/* Property Details */}
                <div className="space-y-3 border-t border-white/5 pt-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b6560]">{t.properties.propertyType}</span>
                    <span className="text-white">{typeLabel(property.type)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b6560]">{t.properties.area}</span>
                    <span className="text-white">{property.area} {t.properties.sqm}</span>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b6560]">{t.properties.yearBuilt}</span>
                      <span className="text-white">{property.yearBuilt}</span>
                    </div>
                  )}
                  {property.leaseYears && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b6560]">{t.properties.leaseYears}</span>
                      <span className="text-white">{property.leaseYears} {t.properties.years}</span>
                    </div>
                  )}
                  {property.furnished !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b6560]">{t.properties.furnished}</span>
                      <span className="text-white">{property.furnished ? t.properties.yes : t.properties.no}</span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => openLeadModal("expert")}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-display font-semibold text-sm hover:bg-[#1da851] transition-all shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageSquare size={16} /> {t.properties.contactAgent}
                  </button>
                  {isVip ? (
                    <button
                      onClick={() => openLeadModal("report")}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-display font-semibold text-sm hover:bg-white/10 hover:border-[#c5a059]/30 transition-all"
                    >
                      <CalendarCheck size={16} /> {t.properties.scheduleViewing}
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[#6b6560] font-display font-semibold text-sm opacity-60 cursor-not-allowed"
                      >
                        <CalendarCheck size={16} /> {t.properties.scheduleViewing}
                      </button>
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md bg-[#c5a059]/20 border border-[#c5a059]/30 text-[10px] font-mono text-[#c5a059]">
                        {t.properties.vipOnly}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LeadFormModal
        open={leadModal}
        onClose={() => setLeadModal(false)}
        type={leadType}
        prefillBudget={canViewDetails ? `${formatPriceUSD(property.priceUSD)}${property.priceLabel}` : undefined}
        prefillSector={typeLabel(property.type)}
        contextData={`Property: ${property.title} | Region: ${regionLabel(property.region)} | Type: ${typeLabel(property.type)} | Area: ${property.area}m²`}
      />
    </div>
  );
}
