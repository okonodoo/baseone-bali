import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, CheckCircle2, Upload, X, ImagePlus, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/i18n";
import { trpc } from "@/lib/trpc";
import { CountrySelect, COUNTRIES } from "@/components/CountrySelect";
import { toast } from "sonner";

const PROPERTY_TYPES = ["villa", "commercial", "office", "land", "warehouse"] as const;
const REGIONS = ["canggu", "seminyak", "ubud", "uluwatu", "nusa-dua", "sanur", "denpasar", "kuta"] as const;

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_IMAGES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface UploadedImage {
  id: string;
  url: string;
  previewUrl: string;
  fileName: string;
  status: "uploading" | "success" | "error";
  error?: string;
}

export default function VendorPortal() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phoneCountryCode, setPhoneCountryCode] = useState("+62");
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "villa" as string,
    listingType: "rent" as "rent" | "sale",
    region: "canggu" as string,
    priceUSD: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    livingRooms: "",
    kitchens: "",
    features: "",
    imageUrls: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactCountry: "ID",
    companyName: "",
  });

  const uploadMutation = trpc.vendor.uploadImage.useMutation();

  const submitMutation = trpc.vendor.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remaining);

    for (const file of filesToProcess) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, WebP and GIF allowed`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        continue;
      }

      const id = Math.random().toString(36).substring(2, 10);
      const previewUrl = URL.createObjectURL(file);

      setImages(prev => [...prev, { id, url: "", previewUrl, fileName: file.name, status: "uploading" }]);

      // Convert to base64 and upload
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const result = await uploadMutation.mutateAsync({
            fileName: file.name,
            fileData: base64,
            mimeType: file.type,
            fileSize: file.size,
          });
          setImages(prev => prev.map(img =>
            img.id === id ? { ...img, url: result.url, status: "success" as const } : img
          ));
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          setImages(prev => prev.map(img =>
            img.id === id ? { ...img, status: "error" as const, error: msg } : img
          ));
          toast.error(`${file.name}: ${msg}`);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [images.length, uploadMutation]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const handleCountryChange = useCallback((code: string) => {
    setForm(prev => ({ ...prev, contactCountry: code }));
    const country = COUNTRIES.find(c => c.code === code);
    if (country) setPhoneCountryCode(country.dialCode);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine uploaded image URLs with manually entered URLs
    const uploadedUrls = images.filter(img => img.status === "success").map(img => img.url);
    const manualUrls = form.imageUrls.split("\n").map(u => u.trim()).filter(Boolean);
    const allImageUrls = [...uploadedUrls, ...manualUrls].join("\n");

    // Build features with room details
    const roomDetails: string[] = [];
    if (form.livingRooms) roomDetails.push(`Living Rooms: ${form.livingRooms}`);
    if (form.kitchens) roomDetails.push(`Kitchens: ${form.kitchens}`);
    const combinedFeatures = [form.features, ...roomDetails].filter(Boolean).join(", ");

    submitMutation.mutate({
      title: form.title,
      description: form.description,
      type: form.type as "villa" | "commercial" | "office" | "land" | "warehouse",
      listingType: form.listingType,
      region: form.region,
      priceUSD: Number(form.priceUSD),
      area: Number(form.area),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      features: combinedFeatures,
      imageUrls: allImageUrls,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: `${phoneCountryCode}${form.contactPhone}`,
      companyName: form.companyName || undefined,
    });
  };

  const tv = t.vendor || {} as any;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
            <h1 className="font-display font-bold text-3xl mb-4">{tv.successTitle || "Listing Submitted!"}</h1>
            <p className="text-[#8a8580] text-lg mb-8">{tv.successMessage || "Your listing has been submitted for review. We'll notify you within 24 hours."}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setImages([]);
                  setForm({ title: "", description: "", type: "villa", listingType: "rent", region: "canggu", priceUSD: "", area: "", bedrooms: "", bathrooms: "", livingRooms: "", kitchens: "", features: "", imageUrls: "", contactName: "", contactEmail: "", contactPhone: "", contactCountry: "ID", companyName: "" });
                }}
                className="px-6 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold hover:bg-[#d4b06a] transition-colors"
              >
                {tv.submitAnother || "Submit Another Listing"}
              </button>
              <Link href="/" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-display font-semibold hover:bg-white/10 transition-colors">
                {t.advisor?.backToHome || "Back to Home"}
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const isUploading = images.some(img => img.status === "uploading");

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      <section className="pt-28 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#c5a059] text-sm mb-6 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> {t.advisor?.backToHome || "Back to Home"}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 mb-6">
              <Building2 size={14} className="text-[#c5a059]" />
              <span className="text-xs font-mono text-[#c5a059] uppercase tracking-wider">{tv.subtitle || "Partner With Us"}</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
              {tv.title || "List Your Property"}
            </h1>
            <p className="text-[#8a8580] text-lg max-w-2xl mb-10">
              {tv.description || "Reach thousands of international investors looking for properties in Bali."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Details */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-[#c5a059]" />
                {tv.formTitle || "Property Details"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.propertyTitle || "Property Title"} *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.propertyDescription || "Description"} *</label>
                  <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.propertyType || "Property Type"} *</label>
                  <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#c5a059]/50 focus:outline-none transition-colors">
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt} value={pt} className="bg-[#1a1a1b]">{pt.charAt(0).toUpperCase() + pt.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.listingType || "Listing Type"} *</label>
                  <select required value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value as "rent" | "sale" })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#c5a059]/50 focus:outline-none transition-colors">
                    <option value="rent" className="bg-[#1a1a1b]">{tv.rent || "Rent"}</option>
                    <option value="sale" className="bg-[#1a1a1b]">{tv.sale || "Sale"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.region || "Region"} *</label>
                  <select required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#c5a059]/50 focus:outline-none transition-colors">
                    {REGIONS.map((r) => (
                      <option key={r} value={r} className="bg-[#1a1a1b]">{r.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.priceUSD || "Price (USD)"} *</label>
                  <input type="number" required min="1" value={form.priceUSD} onChange={(e) => setForm({ ...form, priceUSD: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.area || "Area (m\u00b2)"} *</label>
                  <input type="number" required min="1" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>

                {/* Room Details */}
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.bedrooms || "Bedrooms"}</label>
                  <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.bathrooms || "Bathrooms"}</label>
                  <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{(tv as any).livingRooms || "Living Rooms (Salon)"}</label>
                  <input type="number" min="0" value={form.livingRooms} onChange={(e) => setForm({ ...form, livingRooms: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{(tv as any).kitchens || "Kitchens (Mutfak)"}</label>
                  <input type="number" min="0" value={form.kitchens} onChange={(e) => setForm({ ...form, kitchens: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.features || "Features (comma separated)"}</label>
                  <input type="text" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Pool, Garden, Parking, Furnished..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>

                {/* Image Upload Section */}
                <div className="sm:col-span-2">
                  <label className="block text-sm text-[#8a8580] mb-3">{(tv as any).propertyImages || "Property Images"}</label>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileSelect(e.dataTransfer.files); }}
                      className="border-2 border-dashed border-white/10 hover:border-[#c5a059]/30 rounded-xl p-8 text-center cursor-pointer transition-colors group"
                    >
                      <ImagePlus size={32} className="mx-auto mb-3 text-[#6b6560] group-hover:text-[#c5a059] transition-colors" />
                      <p className="text-sm text-[#8a8580]">
                        {(tv as any).dragDropImages || "Drag & drop images or click to browse"}
                      </p>
                      <p className="text-xs text-[#6b6560] mt-1">
                        JPEG, PNG, WebP, GIF &middot; Max {MAX_FILE_SIZE_MB}MB per file &middot; Max {MAX_IMAGES} images
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />
                    </div>

                    {/* Image Previews */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {images.map((img) => (
                          <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-white/5">
                            <img src={img.previewUrl} alt={img.fileName} className="w-full h-full object-cover" />
                            {img.status === "uploading" && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 size={24} className="animate-spin text-[#c5a059]" />
                              </div>
                            )}
                            {img.status === "error" && (
                              <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                                <p className="text-xs text-white px-2 text-center">{img.error}</p>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X size={12} />
                            </button>
                            {img.status === "success" && (
                              <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle2 size={12} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Manual URL input */}
                    <div>
                      <label className="block text-xs text-[#6b6560] mb-1.5">{tv.imageUrls || "Or paste image URLs (one per line)"}</label>
                      <textarea rows={2} value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} placeholder="https://example.com/image1.jpg"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors resize-none text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl mb-6">{tv.contactTitle || "Contact Information"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.contactName || "Full Name"} *</label>
                  <input type="text" required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.contactEmail || "Email"} *</label>
                  <input type="email" required value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-[#8a8580] mb-1.5">{(tv as any).contactCountry || "Country"}</label>
                  <CountrySelect
                    value={form.contactCountry}
                    onChange={handleCountryChange}
                    placeholder={(tv as any).selectCountry || "Select country..."}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.contactPhone || "Phone"} *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl bg-white/10 border border-r-0 border-white/10 text-sm text-[#c5a059] font-mono min-w-[70px] justify-center">
                      {phoneCountryCode}
                    </span>
                    <input type="tel" required value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      placeholder="812 345 6789"
                      className="w-full px-4 py-3 rounded-r-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-1.5">{tv.companyName || "Company Name (optional)"}</label>
                  <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:border-[#c5a059]/50 focus:outline-none transition-colors" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending || isUploading}
              className="w-full py-4 rounded-2xl bg-[#c5a059] text-black font-display font-semibold text-base hover:bg-[#d4b06a] transition-all shadow-lg shadow-[#c5a059]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {isUploading ? ((tv as any).uploadingImages || "Uploading images...") : submitMutation.isPending ? (tv.submitting || "Submitting...") : (tv.submit || "Submit Listing")}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
