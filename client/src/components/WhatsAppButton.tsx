import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

const WHATSAPP_NUMBER = "628135313562";

export function getWhatsAppUrl(message: string = ""): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function WhatsAppButton() {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white text-gray-900 rounded-xl px-4 py-2 shadow-lg whitespace-nowrap text-sm font-medium"
          >
            {t.whatsapp?.tooltip || "Chat on WhatsApp"}
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={getWhatsAppUrl("Hi, I'm interested in investing in Bali. Can you help me?")}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:scale-110 transition-all duration-300"
      >
        <MessageCircle size={26} fill="white" strokeWidth={0} />
      </a>
    </div>
  );
}

export default WhatsAppButton;
