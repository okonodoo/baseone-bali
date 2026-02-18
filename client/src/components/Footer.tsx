/* Footer — Golden Archipelago Design System — i18n enabled */

import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-[#070708] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 hover:opacity-80 transition-opacity w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#b8934a] flex items-center justify-center">
                <span className="text-black font-display font-extrabold text-sm">BO</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  Bali<span className="text-[#c5a059]">ONE</span>
                </span>
                <span className="text-[10px] text-[#8a8580] font-mono uppercase tracking-[0.2em] ml-2">
                  Global
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#6b6560] leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-5 uppercase tracking-wider">{t.footer.platform}</h4>
            <ul className="space-y-3">
              {[
                { label: t.nav.aiAdvisor, href: "/ai-advisor" },
                { label: t.nav.investmentWizard, href: "/investment-wizard" },
                { label: t.sectors.badge, href: "/#sectors" },
                { label: t.nav.blog, href: "/blog" },
                { label: t.nav.properties, href: "/properties" },
                { label: t.nav.contact, href: "/contact" },
                { label: t.nav.listProperty, href: "/list-your-property" },
                { label: t.nav.becomePartner, href: "/become-partner" },
                { label: t.nav.contracts, href: "/contracts" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-5 uppercase tracking-wider">{t.footer.legal}</h4>
            <ul className="space-y-3">
              {[
                t.footer.pma,
                t.footer.kitas,
                t.footer.licensing,
                t.footer.tax,
                t.footer.virtualOffice,
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-5 uppercase tracking-wider">{t.footer.contact}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#c5a059] mt-0.5 shrink-0" />
                <address className="text-sm text-[#6b6560] not-italic">
                  Jl. Sunset Garden No.7-8<br />
                  Pemogan, Denpasar Selatan<br />
                  Bali 80221
                </address>
              </li>
              <li className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#c5a059] shrink-0" />
                  <a href="mailto:help@baseoneglobal.com" className="text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors">
                    help@baseoneglobal.com
                  </a>
                </div>
                <div className="flex items-center gap-3 ml-7">
                  <a href="mailto:invest@baseoneglobal.com" className="text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors">
                    invest@baseoneglobal.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#c5a059] shrink-0" />
                <a href="tel:+6281353135062" className="text-sm text-[#6b6560] hover:text-[#c5a059] transition-colors">
                  +62 813-5313-5062
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6b6560]">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#6b6560] hover:text-[#c5a059] transition-colors cursor-default">{t.footer.privacy}</span>
            <span className="text-xs text-[#6b6560] hover:text-[#c5a059] transition-colors cursor-default">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
