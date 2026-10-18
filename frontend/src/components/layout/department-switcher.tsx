"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Stethoscope, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function DepartmentSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const isSpa = pathname?.startsWith("/shampooch") ?? false;
  const isVet = pathname?.startsWith("/vet") ?? false;
  const isNeutral = !isSpa && !isVet;

  return (
    <div 
      className={cn(
        "inline-flex items-center p-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 shadow-sm backdrop-blur-md",
        className
      )}
      role="tablist"
      aria-label="Department Switcher"
    >
      <Link
        href="/vet/services"
        role="tab"
        aria-selected={isVet || isNeutral}
        className={cn(
          "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors touch-target",
          isVet || isNeutral
            ? "text-white"
            : "text-zinc-600 hover:text-zinc-900"
        )}
      >
        {(isVet || isNeutral) && (
          <motion.div
            layoutId="activeDeptPill"
            className="absolute inset-0 bg-vet rounded-full shadow-sm"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <Stethoscope className="w-3.5 h-3.5 relative z-10 shrink-0" aria-hidden="true" />
        <span className="relative z-10 font-medium">Veterinary Care</span>
      </Link>

      <Link
        href="/shampooch"
        role="tab"
        aria-selected={isSpa}
        className={cn(
          "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors touch-target",
          isSpa
            ? "text-white"
            : "text-zinc-600 hover:text-zinc-900"
        )}
      >
        {isSpa && (
          <motion.div
            layoutId="activeDeptPill"
            className="absolute inset-0 bg-amberBrand rounded-full shadow-sm"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <Sparkles className="w-3.5 h-3.5 relative z-10 shrink-0" aria-hidden="true" />
        <span className="relative z-10 font-medium">Shampooch Spa</span>
      </Link>
    </div>
  );
}
