"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Scissors, 
  Bath, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck,
  Clock,
  Smile,
  Award
} from "lucide-react";
import { GentlePawIcon, FloatingSpaBubble, TailWagStroke } from "@/components/features/PetMotifs";
import { buttonHoverPhysics, transitionSpring } from "@/lib/motion";

export default function ShampoochPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>("full-styling");

  const packages = [
    {
      id: "refresh-bath",
      title: "The Refresh Hydro-Bath",
      badge: "Hygiene & Coat Glow",
      tagline: "Essential coat cleanliness and botanical soothing",
      image: "/images/dog-bath-bubbles.webp",
      desc: "Warm-water hydro-massage bath utilizing gentle hypoallergenic botanical shampoos, followed by a low-noise fluff dry and thorough brush-out.",
      includes: [
        "Warm hydro-massage bubble bath with organic chamomile & oatmeal",
        "Gentle eye cleaning and non-stinging ear canal flush",
        "Nail trim, paw pad hygiene, and sanitary area tidy",
        "Signature natural botanical coat conditioning spritz"
      ]
    },
    {
      id: "full-styling",
      title: "Full Signature Breed Styling",
      badge: "Most Popular",
      tagline: "Precision breed-standard scissoring and coat wellness",
      image: "/images/hero-grooming.webp",
      desc: "Complete luxury grooming retreat. Everything in the Refresh Bath plus specialized scissor profiling, teddy-bear styling, and full breed haircut.",
      includes: [
        "All features of The Refresh Hydro-Bath included",
        "Custom breed-specific haircut or teddy-bear styling",
        "Hand-scissored face, ear fringe, and paw profiling",
        "High-velocity de-shedding blowout & undercoat removal",
        "Gentle paw balm massage for rough or dry mountain pads"
      ]
    },
    {
      id: "puppy-spa",
      title: "Puppy's First Spa Day",
      badge: "Gentle Fear-Free",
      tagline: "Positive association for young companions under 6 months",
      image: "/images/dog-golden-smile.webp",
      desc: "A patient, play-based introduction to grooming sounds, warm water, and clippers. Designed to build lifelong confidence on the grooming table.",
      includes: [
        "Tearless warm bubble bath and gentle towel cuddle dry",
        "Low-noise clipper introduction with positive treat rewards",
        "Light eye fringe and paw-pad hygiene trim",
        "Lots of reassuring floor cuddles, sniffing time, and praise"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-zinc-900 pb-20 overflow-x-clip">
      
      {/* 1. LUXURY SPA HERO (Soft Sunlight & Floating Bubbles) */}
      <section className="relative w-full daylight-gradient border-b border-amber-900/10 pt-8 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 contour-lines pointer-events-none opacity-40" />
        
        {/* Ambient Bubbles */}
        <div className="absolute top-12 right-1/4 pointer-events-none">
          <FloatingSpaBubble size={28} className="opacity-40" />
        </div>
        <div className="absolute bottom-16 right-12 pointer-events-none">
          <FloatingSpaBubble size={38} className="opacity-35" />
        </div>

        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Left Story Column */}
            <div className="max-w-2xl space-y-5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-amber-200 text-amberBrand-dark text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amberBrand" />
                <span>Boutique Grooming • Eastern Highlands Animal Care</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.06]">
                Pampering They Love. <br />
                <span className="relative inline-block text-amberBrand-dark">
                  Care You Can Trust.
                  <span className="absolute -bottom-2 left-0 right-0 hidden sm:block">
                    <TailWagStroke className="w-48 sm:w-64 h-auto text-amberBrand/60" />
                  </span>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                Step into Shampooch Grooming Spa in Mutare. Stress-free breed styling, warm hydrotherapy massage, and botanical coat conditioning under direct veterinary co-location.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                <motion.div {...buttonHoverPhysics} className="w-full sm:w-auto">
                  <Button asChild className="w-full sm:w-auto bg-amberBrand hover:bg-amberBrand-dark text-white font-bold rounded-2xl h-12 px-7 text-sm shadow-md">
                    <Link href="/book?type=spa" className="flex items-center justify-center gap-2">
                      <span>Book a Spa Visit</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>

                <Button asChild variant="outline" className="w-full sm:w-auto border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-2xl h-12 px-6 text-sm font-semibold">
                  <a 
                    href="https://wa.me/263771883320?text=Hello%20Shampooch%20Spa,%20I%20would%20like%20to%20book%20a%20grooming%20session..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp: 0771883320</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Media Hero Card */}
            <div className="relative w-full max-w-md h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-amber-300/60 shadow-xl group">
              <Image
                src="/images/dog-bath-bubbles.webp"
                alt="Smiling dog enjoying a warm bubble bath at Shampooch"
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/60 text-xs shadow-md">
                <div className="flex items-center justify-between font-serif font-bold text-zinc-900 text-sm">
                  <span>The Shampooch Standard</span>
                  <span className="text-amberBrand font-mono text-xs">Mutare, Zimbabwe</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  Low-stress handling, organic coat botanicals, and immediate veterinary review for any skin abnormalities.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. SIGNATURE SPA PACKAGES */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-zinc-200/80">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-amberBrand-dark">
              Boutique Grooming Menu
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-950">
              Signature Spa Packages
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed font-normal">
              Every package is tailored to your dog’s specific coat texture, size, and individual comfort level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-[#faf8f5] border border-amber-900/15 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-zinc-200 shadow-xs group-hover:scale-102 transition-transform duration-500">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/90 text-amberBrand-dark shadow-xs border border-amber-200">
                      {pkg.badge}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-zinc-950 mb-1">
                      {pkg.title}
                    </h3>
                    <p className="text-xs font-semibold text-amberBrand-dark mb-2">
                      {pkg.tagline}
                    </p>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      {pkg.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-900/10 space-y-2">
                    <span className="text-[10px] font-mono font-semibold uppercase text-zinc-500 block">
                      Package Inclusions
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      {pkg.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amberBrand shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-amber-900/10 flex flex-col gap-2">
                  <Button asChild className="w-full bg-amberBrand hover:bg-amberBrand-dark text-white text-xs font-semibold h-10 rounded-xl shadow-xs">
                    <Link href={`/book?type=spa&package=${encodeURIComponent(pkg.title)}`}>
                      Select {pkg.title}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. VETERINARY CO-LOCATION ADVANTAGE */}
      <section className="w-full py-16 sm:py-24 bg-zinc-950 text-white">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs font-mono">
                THE SHAMPOOCH DIFFERENCE
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Grooming With Clinical Oversight.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                Unlike unmonitored commercial pet shops, Shampooch operates in direct integration with Eastern Highlands Veterinary Surgery. If our groomers discover inflamed ears, early tick burdens, skin cysts, or tooth calculus during bathing, our veterinary medical team is right down the hall.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white block">Early Pathology Detection</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Skin lumps, hot spots, and ear mites identified before they escalate into painful chronic issues.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <Heart className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white block">Fear-Free Handling</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Trained in low-stress canine body language. Nervous dogs get gentle patience, never harsh restraints.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-zinc-800 shadow-xl">
              <Image
                src="/images/dog-reunion-happy.webp"
                alt="Happy beagle strutting proudly after grooming"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 text-xs text-zinc-300">
                <span className="font-serif italic font-bold text-white block">
                  “The ecstasy of that happy lobby reunion.”
                </span>
                <span className="text-[10px] text-amber-400 font-mono">100% Happy Struts Guarantee</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FAST-TRACK WHATSAPP BOOKING */}
      <section className="w-full py-16 bg-[#faf8f5]">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-mono font-semibold uppercase text-emerald-800 tracking-wider">
                Direct Spa Scheduling
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-emerald-950">
                Book Their Spa Day on WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed max-w-xl font-normal">
                Message our Mutare team directly at <strong>0771883320</strong> to check tomorrow's grooming openings, ask about coat de-shedding, or book your companion’s spa day.
              </p>
            </div>

            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm h-12 px-7 rounded-2xl shadow-md shrink-0">
              <a 
                href="https://wa.me/263771883320?text=Hello%20Shampooch%20Spa,%20I%20would%20like%20to%20book%20a%20grooming%20session%20for%20my%20dog..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Message on WhatsApp: 0771883320</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
