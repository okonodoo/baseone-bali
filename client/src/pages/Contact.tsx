/* ============================================================
 * Contact Page — SEO Optimized with Google Maps & Schema
 * ============================================================ */

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { useTranslation } from "@/i18n";
import { useSEO } from "@/hooks/useSEO";

export default function Contact() {
  const { t } = useTranslation();
  const [leadOpen, setLeadOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useSEO({
    title: "Contact Us — BaseOne Global Bali | Investment Advisors in Denpasar",
    description: "Contact BaseOne Global in Bali for foreign investment guidance. Located in Denpasar Selatan. PMA setup, KITAS visa, business registration, and investment consulting services.",
    keywords: "contact BaseOne Bali, investment advisor Bali address, Denpasar investment consultant, PMA setup Bali contact, business registration Indonesia, foreign investment Bali office",
    ogUrl: "https://baseoneglobal.com/contact",
    canonicalUrl: "https://baseoneglobal.com/contact",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar onTalkToExpert={() => setLeadOpen(true)} />

      {/* Structured Data for Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "BaseOne Global",
          "description": "Foreign Investment Advisory and PMA Setup Services in Bali, Indonesia",
          "url": "https://baseoneglobal.com",
          "logo": "https://baseoneglobal.com/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Sunset Garden No.7-8, Pemogan",
            "addressLocality": "Denpasar Selatan",
            "addressRegion": "Bali",
            "postalCode": "80221",
            "addressCountry": "ID"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-8.6836",
            "longitude": "115.2053"
          },
          "telephone": "+62-8135313562",
          "email": ["help@baseoneglobal.com", "invest@baseoneglobal.com"],
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            }
          ],
          "priceRange": "$$",
          "areaServed": {
            "@type": "Country",
            "name": "Indonesia"
          },
          "sameAs": [
            "https://baseoneglobal.com"
          ]
        })}
      </script>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c5a059]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              {t.contact?.title || "Get in Touch"}
            </h1>
            <p className="text-lg text-[#a09a94] max-w-2xl mx-auto">
              {t.contact?.subtitle || "Visit our office in Bali or reach out online. We're here to help with your investment journey."}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Address Card */}
              <div className="glass-card rounded-2xl p-6 hover:border-[#c5a059]/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-[#c5a059]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {t.contact?.officeAddress || "Office Address"}
                    </h3>
                    <address className="not-italic text-[#a09a94] leading-relaxed">
                      Jl. Sunset Garden No.7-8, Pemogan<br />
                      Denpasar Selatan<br />
                      Kota Denpasar, Bali 80221<br />
                      Indonesia
                    </address>
                    <a
                      href="https://maps.app.goo.gl/umExe9gxeMrU88sF9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm text-[#c5a059] hover:text-[#d4b06a] transition-colors"
                    >
                      {t.contact?.viewOnMaps || "View on Google Maps"} →
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="glass-card rounded-2xl p-6 hover:border-[#c5a059]/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-[#c5a059]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {t.contact?.phone || "Phone"}
                    </h3>
                    <a
                      href="tel:+6281353135062"
                      className="text-[#a09a94] hover:text-[#c5a059] transition-colors"
                    >
                      +62 813-5313-5062
                    </a>
                    <p className="text-sm text-[#6b6560] mt-2">
                      {t.contact?.phoneNote || "WhatsApp available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Cards */}
              <div className="glass-card rounded-2xl p-6 hover:border-[#c5a059]/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center shrink-0">
                    <Mail size={24} className="text-[#c5a059]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg mb-3">
                      {t.contact?.email || "Email"}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-[#6b6560] mb-1">
                          {t.contact?.generalInquiries || "General Inquiries"}
                        </div>
                        <a
                          href="mailto:help@baseoneglobal.com"
                          className="text-[#a09a94] hover:text-[#c5a059] transition-colors"
                        >
                          help@baseoneglobal.com
                        </a>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <div className="text-xs text-[#6b6560] mb-1">
                          {t.contact?.investmentInquiries || "Investment Inquiries"}
                        </div>
                        <a
                          href="mailto:invest@baseoneglobal.com"
                          className="text-[#a09a94] hover:text-[#c5a059] transition-colors"
                        >
                          invest@baseoneglobal.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="glass-card rounded-2xl p-6 hover:border-[#c5a059]/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center shrink-0">
                    <Clock size={24} className="text-[#c5a059]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-3">
                      {t.contact?.businessHours || "Business Hours"}
                    </h3>
                    <div className="space-y-2 text-[#a09a94]">
                      <div className="flex justify-between gap-8">
                        <span>{t.contact?.weekdays || "Monday - Friday"}</span>
                        <span className="text-white">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between gap-8 text-[#6b6560]">
                        <span>{t.contact?.weekend || "Saturday - Sunday"}</span>
                        <span>{t.contact?.closed || "Closed"}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b6560] mt-3">
                      {t.contact?.timezone || "WITA (GMT+8)"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="glass-card rounded-2xl p-8 sticky top-24">
                <h2 className="font-display font-bold text-2xl mb-6">
                  {t.contact?.sendMessage || "Send us a Message"}
                </h2>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2">
                      {t.contact?.thankYou || "Thank You!"}
                    </h3>
                    <p className="text-[#a09a94]">
                      {t.contact?.successMessage || "We'll get back to you within 24 hours."}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        {t.contact?.fullName || "Full Name"} <span className="text-[#c5a059]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#c5a059]/40 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 transition-colors"
                        placeholder={t.contact?.namePlaceholder || "John Doe"}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        {t.contact?.emailLabel || "Email Address"} <span className="text-[#c5a059]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#c5a059]/40 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 transition-colors"
                        placeholder={t.contact?.emailPlaceholder || "john@example.com"}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        {t.contact?.phoneLabel || "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#c5a059]/40 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 transition-colors"
                        placeholder="+62 813-5313-5062"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        {t.contact?.messageLabel || "Message"} <span className="text-[#c5a059]">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#c5a059]/40 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 transition-colors resize-none"
                        placeholder={t.contact?.messagePlaceholder || "Tell us about your investment plans..."}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#c5a059] text-black font-display font-semibold hover:bg-[#d4b06a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#c5a059]/20"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          {t.contact?.sending || "Sending..."}
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          {t.contact?.sendButton || "Send Message"}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="py-16 bg-gradient-to-b from-transparent to-[#c5a059]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              {t.contact?.findUs || "Find Us in Bali"}
            </h2>
            <p className="text-[#a09a94] max-w-2xl mx-auto">
              {t.contact?.mapDescription || "Located in the heart of Denpasar Selatan, easily accessible from major areas in Bali."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.1774534567!2d115.20277!3d-8.68360!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDEnMDEuMCJTIDExNcKwMTInMTAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BaseOne Global Office Location"
            />
          </motion.div>
        </div>
      </div>

      <Footer />
      <LeadFormModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
