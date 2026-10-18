import Link from "next/link";
import Image from "next/image";
import { MapPin, Stethoscope, Sparkles, AlertCircle, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-24 md:pb-12 border-t border-zinc-800" aria-label="Site Footer">
      <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Geographic Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/15">
                <Image 
                  src="/logo.png" 
                  alt="EHVS Crest" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base block leading-snug">
                  Eastern Highlands
                </span>
                <span className="text-[11px] text-zinc-400 font-medium tracking-wide block">
                  Veterinary Surgery & Grooming Spa
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Compassionate Veterinary Care. Healthier Animals. Stronger Bonds. Dedicated clinical medicine, surgery, diagnostics, and boutique grooming in Mutare, Zimbabwe.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
              <MapPin className="w-4 h-4 text-vet-light shrink-0" aria-hidden="true" />
              <span>Mutare, Manicaland Province, Zimbabwe</span>
            </div>
          </div>

          {/* Department Direct Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-white text-sm tracking-wide">Practice Departments</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/vet/services" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Stethoscope className="w-3.5 h-3.5 text-vet-light shrink-0" aria-hidden="true" />
                  <span>Clinical Care & Diagnostics</span>
                </Link>
              </li>
              <li>
                <Link href="/vet/services#livestock" className="hover:text-white flex items-center gap-2 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-vet-light shrink-0" aria-hidden="true" />
                  <span>Livestock & Herd Health</span>
                </Link>
              </li>
              <li>
                <Link href="/shampooch" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-amberBrand-light shrink-0" aria-hidden="true" />
                  <span>Shampooch Grooming Spa</span>
                </Link>
              </li>
              <li>
                <Link href="/contact#emergency" className="hover:text-white flex items-center gap-2 transition-colors">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
                  <span>Urgent Triage Guidance</span>
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white flex items-center gap-2 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                  <span>Animal Health Education</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice Standards & Regional Scope */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-white text-sm tracking-wide">Service Region</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We serve domestic pets across Mutare's residential neighborhoods (Murambi, Fairbridge Park, Yeovil) and provide ambulatory farm visit coordination throughout the Eastern Highlands (Vumba, Penhalonga, Odzi).
            </p>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              <span className="font-semibold text-white block mb-0.5">Appointments & Consultations</span>
              <span>All clinical consultations, surgeries, and grooming sessions are scheduled in advance to ensure dedicated one-on-one attention.</span>
            </div>
          </div>

          {/* Booking & Urgent Action */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-white text-sm tracking-wide">Ready to Visit?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Submit your appointment request online or message our clinical front-desk directly on WhatsApp.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-vet hover:bg-vet-light text-white transition-colors shadow-sm"
              >
                Request an Appointment Online
              </Link>
              <a
                href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20would%20like%20to%20enquire%20about..."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: 0771883320</span>
              </a>
              <Link
                href="/contact#emergency"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              >
                Emergency Guidance & Contact
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Truth Notice */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} Eastern Highlands Veterinary Surgery & Shampooch Spa. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Operating in Mutare, Zimbabwe</span>
            <span>•</span>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">Our Practice</Link>
            <span>•</span>
            <a 
              href="https://wa.me/263771883320" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp: 0771883320</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
