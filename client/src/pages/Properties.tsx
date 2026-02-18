import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Building2,
  Home,
  Landmark,
  MapPin,
  Warehouse,
  Trees,
  BedDouble,
  Bath,
  Maximize2,
  X,
  Lock,
  ChevronDown,
  LayoutGrid,
  Map,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { PropertyMap } from "@/components/PropertyMap";
import { useLocation } from "wouter";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { useSEO } from "@/hooks/useSEO";
import {
  PROPERTIES,
  PROPERTY_TYPES,
  REGIONS,
  RENT_PRICE_RANGES,
  SALE_PRICE_RANGES,
  formatPriceUSD,
  formatPriceIDR,
  type PropertyType,
  type Region,
  type ListingType,
} from "@/lib/propertyData";

const typeIcons: Record<PropertyType, React.ReactNode> = {
  villa: <Home size={14} />,
  commercial: <Building2 size={14} />,
  office: <Landmark size={14} />,
  land: <Trees size={14} />,
  warehouse: <Warehouse size={14} />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

export default function Properties() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { tier } = useSubscription();
  const canViewDetails = tier === "premium" || tier === "vip";

  useSEO({
    title: "Bali Properties — Villas, Land & Commercial Real Estate",
    description: "Browse premium Bali properties for sale and rent. Villas in Canggu, Ubud, Seminyak, Nusa Dua. Investment-grade real estate with ROI projections, legal compliance, and expert guidance.",
    keywords: "Bali property, Bali villa for sale, Bali real estate, Canggu villa, Ubud property, Seminyak real estate, Bali land for sale, Bali commercial property, Bali investment property, Nusa Dua villa",
    ogUrl: "https://baseoneglobal.com/properties",
    canonicalUrl: "https://baseoneglobal.com/properties",
  });

  // Filters
  const [listingType, setListingType] = useState<ListingType>("rent");
  const [selectedType, setSelectedType] = useState<PropertyType | "all">("all");
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [minArea, setMinArea] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [leadModal, setLeadModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"xendit" | "payoneer">("xendit");

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
  const [, navigate] = useLocation();

  const priceRanges = listingType === "rent" ? RENT_PRICE_RANGES : SALE_PRICE_RANGES;

  const filtered = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (p.listingType !== listingType) return false;
      if (selectedType !== "all" && p.type !== selectedType) return false;
      if (selectedRegion !== "all" && p.region !== selectedRegion) return false;
      if (selectedPriceRange !== "all") {
        const range = priceRanges.find((r) => r.value === selectedPriceRange);
        if (range && (p.priceUSD < range.min || p.priceUSD > range.max)) return false;
      }
      if (minArea > 0 && p.area < minArea) return false;
      return true;
    });
  }, [listingType, selectedType, selectedRegion, selectedPriceRange, minArea, priceRanges]);

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedRegion("all");
    setSelectedPriceRange("all");
    setMinArea(0);
  };

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

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors mb-6">
            <ArrowLeft size={14} /> {t.properties.backHome}
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-2">{t.properties.badge}</p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">{t.properties.title}</h1>
              <p className="text-[#8a8580] text-lg mt-2 max-w-2xl">{t.properties.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6b6560]">
              <span className="font-mono text-[#c5a059] text-xl font-bold">{filtered.length}</span> {t.properties.results}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Rent/Sale Toggle + Filter Toggle */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1">
              <button
                onClick={() => { setListingType("rent"); setSelectedPriceRange("all"); }}
                className={`px-5 py-2 rounded-lg text-sm font-display font-semibold transition-all ${listingType === "rent" ? "bg-[#c5a059] text-black" : "text-[#8a8580] hover:text-white"}`}
              >
                {t.properties.forRent}
              </button>
              <button
                onClick={() => { setListingType("sale"); setSelectedPriceRange("all"); }}
                className={`px-5 py-2 rounded-lg text-sm font-display font-semibold transition-all ${listingType === "sale" ? "bg-[#c5a059] text-black" : "text-[#8a8580] hover:text-white"}`}
              >
                {t.properties.forSale}
              </button>
            </div>
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${viewMode === "grid" ? "bg-[#c5a059] text-black" : "text-[#8a8580] hover:text-white"}`}
                title="Grid View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${viewMode === "map" ? "bg-[#c5a059] text-black" : "text-[#8a8580] hover:text-white"}`}
                title="Map View"
              >
                <Map size={14} />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#8a8580] hover:text-white hover:border-[#c5a059]/30 transition-all lg:hidden"
            >
              <SlidersHorizontal size={14} /> {t.properties.filters}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            {(selectedType !== "all" || selectedRegion !== "all" || selectedPriceRange !== "all" || minArea > 0) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors"
              >
                <X size={12} /> {t.properties.clearFilters}
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${showFilters ? "block" : "hidden lg:grid"}`}>
            {/* Type */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PropertyType | "all")}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors cursor-pointer"
              >
                <option value="all" className="bg-[#1a1a1b] text-white">{t.properties.allTypes}</option>
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value} className="bg-[#1a1a1b] text-white">{typeLabel(pt.value)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
            </div>

            {/* Region */}
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region | "all")}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors cursor-pointer"
              >
                <option value="all" className="bg-[#1a1a1b] text-white">{t.properties.allRegions}</option>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value} className="bg-[#1a1a1b] text-white">{regionLabel(r.value)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
            </div>

            {/* Price Range */}
            <div className="relative">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors cursor-pointer"
              >
                <option value="all" className="bg-[#1a1a1b] text-white">{t.properties.allPrices}</option>
                {priceRanges.map((pr) => (
                  <option key={pr.value} value={pr.value} className="bg-[#1a1a1b] text-white">{pr.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
            </div>

            {/* Min Area */}
            <div className="relative">
              <input
                type="number"
                placeholder={t.properties.minArea}
                value={minArea || ""}
                onChange={(e) => setMinArea(Number(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#6b6560] focus:outline-none focus:border-[#c5a059]/50 transition-colors"
              />
              <Maximize2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Property Grid / Map */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Map View - always visible when map mode is selected */}
          {viewMode === "map" && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-white/10">
              <PropertyMap
                properties={filtered.map((p) => ({
                  id: p.id,
                  title: p.title,
                  lat: p.coordinates.lat,
                  lng: p.coordinates.lng,
                  price: canViewDetails ? formatPriceUSD(p.priceUSD) : "Premium",
                  type: p.type,
                }))}
                selectedRegion={selectedRegion}
                className="h-[450px]"
                onPinClick={(id) => {
                  if (canViewDetails) navigate(`/properties/${id}`);
                }}
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-[#3a3530] mb-4" />
              <p className="text-[#6b6560] text-lg">{t.properties.noResults}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((property, i) => (
                <motion.div key={property.id} variants={fadeUp} custom={i}>
                  <div className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-[#c5a059]/30 transition-all duration-300 bg-[#111112] h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-transparent" />
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-white">
                        {typeIcons[property.type]} {typeLabel(property.type)}
                      </div>
                      {/* Listing Type Badge */}
                      <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${property.listingType === "rent" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                        {property.listingType === "rent" ? t.properties.forRent : t.properties.forSale}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Region */}
                      <div className="flex items-center gap-1.5 text-xs text-[#c5a059] mb-2">
                        <MapPin size={12} /> {regionLabel(property.region)}
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-semibold text-base mb-3 line-clamp-1 group-hover:text-[#c5a059] transition-colors">
                        {property.title}
                      </h3>

                      {/* Price */}
                      {canViewDetails ? (
                        <div className="mb-3">
                          <div className="font-display font-bold text-xl text-[#c5a059]">
                            {formatPriceUSD(property.priceUSD)}{property.priceLabel && <span className="text-sm font-normal text-[#8a8580]">{t.properties.perMonth}</span>}
                          </div>
                          <div className="text-xs text-[#6b6560]">{formatPriceIDR(property.priceIDR)}{property.priceLabel && t.properties.perMonth}</div>
                        </div>
                      ) : (
                        <div className="mb-3 relative">
                          <div className="font-display font-bold text-xl text-[#c5a059] blur-sm select-none">$XX,XXX</div>
                          <div className="text-xs text-[#6b6560] blur-sm select-none">Rp XXX,XXX,XXX</div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="inline-flex items-center gap-1 text-xs text-[#c5a059] bg-[#c5a059]/10 px-2 py-1 rounded-lg border border-[#c5a059]/20">
                              <Lock size={10} /> Premium
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-[#6b6560] border-t border-white/5 pt-3">
                        <span className="flex items-center gap-1"><Maximize2 size={12} /> {property.area} {t.properties.sqm}</span>
                        {property.bedrooms && <span className="flex items-center gap-1"><BedDouble size={12} /> {property.bedrooms} {t.properties.bedrooms}</span>}
                        {property.bathrooms && <span className="flex items-center gap-1"><Bath size={12} /> {property.bathrooms} {t.properties.bathrooms}</span>}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto pt-4">
                        {canViewDetails ? (
                          <Link
                            href={`/properties/${property.id}`}
                            className="block w-full text-center px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-display font-semibold hover:bg-[#c5a059]/10 hover:border-[#c5a059]/30 hover:text-[#c5a059] transition-all"
                          >
                            {t.properties.viewDetails}
                          </Link>
                        ) : isAuthenticated ? (
                          <button
                            onClick={() => handleDirectCheckout("premium")}
                            disabled={checkoutMutation.isPending}
                            className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 text-sm font-display font-semibold text-[#c5a059] hover:bg-[#c5a059]/20 transition-all disabled:opacity-50"
                          >
                            <Lock size={12} className="inline mr-1" /> {checkoutMutation.isPending ? (t.pricing?.processing || "Processing...") : `${t.pricing.unlockPremium} — $19.90`}
                          </button>
                        ) : (
                          <a
                            href="/login"
                            className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 text-sm font-display font-semibold text-[#c5a059] hover:bg-[#c5a059]/20 transition-all"
                          >
                            {t.nav.signIn}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <LeadFormModal open={leadModal} onClose={() => setLeadModal(false)} />
    </div>
  );
}
