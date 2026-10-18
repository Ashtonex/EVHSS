"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20would%20like%20to%20enquire%20about...";

  return (
    <aside 
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40"
      aria-label="Direct WhatsApp Contact"
    >
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl border border-white/30 backdrop-blur-xs transition-colors group"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-medium leading-none opacity-90 uppercase tracking-wider">
            Direct WhatsApp
          </span>
          <span className="text-xs font-bold font-mono tracking-tight leading-tight">
            0771883320
          </span>
        </div>
      </motion.a>
    </aside>
  );
}
