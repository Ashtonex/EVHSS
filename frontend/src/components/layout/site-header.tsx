"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DepartmentSwitcher } from "@/components/layout/department-switcher";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AlertCircle, Calendar, MessageCircle } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const isSpa = pathname?.startsWith("/shampooch") ?? false;
  const isVet = pathname?.startsWith("/vet") ?? false;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-sm py-2.5"
          : "bg-white/80 backdrop-blur-sm border-b border-zinc-100 py-3.5"
      )}
    >
      <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between gap-4">
        
        {/* Brand Lockup */}
        <Link 
          href="/" 
          className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          aria-label="Eastern Highlands Veterinary Surgery & Shampooch Spa Home"
        >
          <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200/60 overflow-hidden shadow-xs">
            <Image 
              src="/logo.png" 
              alt="EHVS Crest Logo" 
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base md:text-lg leading-tight text-zinc-900 group-hover:text-primary transition-colors">
                Eastern Highlands
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                Mutare
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-zinc-500">
              Veterinary Surgery & Grooming Spa
            </span>
          </div>
        </Link>

        {/* Center: Department Switcher Organism (md+) */}
        <div className="hidden md:flex items-center justify-center">
          <DepartmentSwitcher />
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Urgent Care Anchor */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden lg:inline-flex border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 hover:text-red-800 rounded-full font-medium text-xs h-9"
          >
            <Link href="/contact" className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Urgent Triage</span>
            </Link>
          </Button>

          {/* Direct WhatsApp Quick Contact */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-full text-xs h-9 px-3.5 font-medium transition-colors"
          >
            <a 
              href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20would%20like%20to%20enquire%20about..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" aria-hidden="true" />
              <span>WhatsApp: 0771883320</span>
            </a>
          </Button>

          {/* Department-Responsive CTA */}
          <Button
            asChild
            className={cn(
              "rounded-full font-semibold text-xs md:text-sm h-9 md:h-10 px-4 md:px-5 shadow-sm transition-all",
              isSpa
                ? "bg-amberBrand hover:bg-amberBrand-dark text-white"
                : "bg-vet hover:bg-vet-light text-white"
            )}
          >
            <Link href="/book" className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>{isSpa ? "Book Groom" : "Book Visit"}</span>
            </Link>
          </Button>
        </div>

      </div>

      {/* Mobile Department Switcher Strip (< md) */}
      <div className="md:hidden pt-2 px-4 flex justify-center">
        <DepartmentSwitcher />
      </div>
    </header>
  );
}
