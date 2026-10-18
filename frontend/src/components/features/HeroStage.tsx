"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Sparkles, 
  ArrowUpRight, 
  AlertCircle, 
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award
} from "lucide-react";
import { GentlePawIcon, TailWagStroke, FloatingSpaBubble } from "@/components/features/PetMotifs";
import { buttonHoverPhysics, transitionSpring, spatialSideInLeft, spatialSideInRight } from "@/lib/motion";

export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  // Desktop Mouse Tilt Coordinates (bounded, smooth spring physics)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Subtle 2.5D rotations bounded to ±3.5 degrees
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-3.5, 3.5]);

  // Foreground float counter-parallax
  const badgeTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const badgeTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full daylight-gradient border-b border-amber-900/10 overflow-hidden pt-4 pb-14 sm:pb-20 perspective-stage"
      aria-label="Eastern Highlands Veterinary Surgery & Shampooch Gateway"
    >
      
      {/* 1. BACKGROUND LAYER (Z: -20px - Mountain Topography & Atmospheric Glows) */}
      <div className="absolute inset-0 contour-lines pointer-events-none opacity-40" />
      
      {/* Floating Atmosphere Motifs */}
      <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />
      
      <div className="absolute top-24 right-1/4 pointer-events-none hidden md:block">
        <FloatingSpaBubble size={24} className="opacity-35" />
      </div>
      <div className="absolute bottom-32 right-12 pointer-events-none hidden md:block">
        <FloatingSpaBubble size={38} className="opacity-40" />
      </div>
      <div className="absolute top-1/3 right-8 pointer-events-none hidden lg:block">
        <FloatingSpaBubble size={18} className="opacity-30" />
      </div>

      {/* 2. WIDE MASTHEAD (Soft Daylight Welcome & Coordinates) */}
      <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16 mb-8 relative z-10">
        
        {/* Affectionate Location & Practice Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-b border-amber-900/10 text-xs">
          <div className="flex items-center gap-2 text-zinc-700">
            <GentlePawIcon className="w-4 h-4 text-amberBrand animate-pulse" />
            <span className="font-semibold tracking-wide">
              Mutare, Zimbabwe • Eastern Highlands Animal Care
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-zinc-500 text-[11px] font-medium">
            <span>Surgical Hospital & Boutique Pet Spa</span>
            <span>•</span>
            <span className="text-zinc-800 font-semibold">Council of Veterinary Surgeons Standards</span>
          </div>
        </div>

        {/* The Core Emotion: "A Little World Made for Their Best Friend" */}
        <div className="pt-6 sm:pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-amber-200 text-amberBrand-dark text-xs font-medium mb-4 shadow-3d-badge backdrop-blur-xs"
          >
            <Heart className="w-3.5 h-3.5 text-amberBrand fill-amberBrand/20" />
            <span>Gentle Hands • Happy Paws • Lifelong Health</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-zinc-950 leading-[1.04]"
          >
            A little world made for <br className="hidden sm:inline" />
            <span className="relative inline-block text-zinc-900">
              their best friend.
              <span className="absolute -bottom-2.5 left-0 right-0 hidden sm:block">
                <TailWagStroke className="w-40 sm:w-56 h-auto text-amberBrand/70" />
              </span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-normal leading-relaxed"
          >
            The reassuring touch of a veterinary surgeon when they need healing. The warmth of a gentle bubble bath when they need pampering. All under one roof in Mutare.
          </motion.p>
        </div>
      </div>

      {/* 3. LIVING 2.5D SPATIAL DIORAMA (Middle-Ground & Foreground Layers) */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16 relative z-10 transition-transform duration-100 ease-out"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch preserve-3d">
          
          {/* GATEWAY A: VETERINARY SURGERY (Slides in from Left with 3D Depth) */}
          <motion.div 
            variants={spatialSideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#0c2f57] via-[#09284c] to-[#071c35] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden shadow-3d-vet group border border-blue-800/40 preserve-3d"
          >
            {/* Ambient Interior Depth Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none group-hover:bg-blue-400/25 transition-colors duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-white/10 text-white border border-white/20 shadow-xs">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-300" />
                  <span>VETERINARY MEDICINE & SURGERY</span>
                </span>
                <span className="text-xs font-mono text-blue-200">
                  Companion & Herd
                </span>
              </div>

              {/* Photo & Text Composition with Layered Depth */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Real Animal Photo Frame with Spatial Border */}
                <div className="sm:col-span-5 relative h-52 sm:h-60 rounded-2xl overflow-hidden border border-white/25 shadow-xl shrink-0 group-hover:scale-[1.03] transition-transform duration-500">
                  <Image 
                    src="/images/vet-gentle-hands.webp" 
                    alt="Veterinary doctor gently examining a calm dog with warm hands" 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 30vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071c35]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-[11px] text-blue-100 font-medium bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    <span>Gentle Hands Examination</span>
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="sm:col-span-7 space-y-3">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    A Safe Pair of Hands.
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-200/90 leading-relaxed font-normal">
                    Evidence-based diagnostics, sterile soft-tissue surgeries, and compassionate preventative care for companion animals, alongside dedicated ambulatory herd calls across Manicaland.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-blue-200">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">In-House Hematology</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">Fear-Free Handling</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">Livestock Ambulatory</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Dominant Primary Action */}
            <div className="pt-6 relative z-10 flex flex-col sm:flex-row items-center gap-3 border-t border-white/15 mt-6">
              <motion.div {...buttonHoverPhysics} className="w-full sm:w-auto">
                <Button 
                  asChild 
                  className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-vet font-bold rounded-2xl h-11 px-6 text-xs sm:text-sm shadow-md transition-all"
                >
                  <Link href="/vet/services" className="flex items-center justify-center gap-2">
                    <span>Explore Clinical Care</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              <Link
                href="/book?type=vet"
                className="w-full sm:w-auto text-center px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-white underline underline-offset-4"
              >
                Request Vet Appointment →
              </Link>
            </div>

            {/* FOREGROUND 3D BADGE (Pops out with counter-parallax) */}
            <motion.div 
              style={{ x: badgeTranslateX, y: badgeTranslateY }}
              className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-vet shadow-3d-badge border border-blue-200 text-[11px] font-bold z-20"
            >
              <Award className="w-3.5 h-3.5 text-vet" />
              <span>CVSZ Registered Practice</span>
            </motion.div>

          </motion.div>

          {/* GATEWAY B: SHAMPOOCH GROOMING (Slides in from Right with 3D Depth) */}
          <motion.div 
            variants={spatialSideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#fff7ed] via-[#ffedd5]/80 to-[#fed7aa]/60 border-2 border-amberBrand/35 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden shadow-3d-spa group preserve-3d"
          >
            {/* Ambient Sunbeam Glow */}
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-amber-400/20 blur-2xl pointer-events-none group-hover:bg-amber-300/30 transition-colors duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-amberBrand-peach text-amberBrand-dark border border-amberBrand/30 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amberBrand" />
                  <span>SHAMPOOCH GROOMING SPA</span>
                </span>
                <span className="text-xs font-mono text-amberBrand-dark font-medium">
                  Canine Styling
                </span>
              </div>

              {/* Real Dog Photo & Narrative */}
              <div className="space-y-4">
                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-amberBrand/30 shadow-xl group-hover:scale-[1.03] transition-transform duration-500">
                  <Image 
                    src="/images/dog-bath-bubbles.webp" 
                    alt="Happy smiling dog in warm bubble bath at Shampooch Spa" 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 30vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Warm Bubble Bath & Suds</span>
                    </span>
                    <span className="text-amber-200 font-bold">Pure Joy</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                    The Joy of a Fresh Coat.
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    Gentle, stress-free grooming with warm water hydro-massage, botanical coat conditioning, and precision breed styling that leaves them strutting with pride.
                  </p>
                </div>
              </div>
            </div>

            {/* Dominant Primary Action */}
            <div className="pt-6 relative z-10 flex flex-col sm:flex-row items-center gap-3 border-t border-amber-200/90 mt-6">
              <motion.div {...buttonHoverPhysics} className="w-full sm:w-auto">
                <Button 
                  asChild 
                  className="w-full sm:w-auto bg-amberBrand hover:bg-amberBrand-dark text-white font-bold rounded-2xl h-11 px-6 text-xs sm:text-sm shadow-md transition-all"
                >
                  <Link href="/shampooch" className="flex items-center justify-center gap-2">
                    <span>View Spa Menu</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              <Link
                href="/book?type=spa"
                className="w-full sm:w-auto text-center px-4 py-2 text-xs sm:text-sm font-semibold text-amberBrand-dark hover:text-amberBrand underline underline-offset-4"
              >
                Book a Spa Day →
              </Link>
            </div>

            {/* FOREGROUND 3D FLOATING AVATAR (Fresh Coat Reunion) */}
            <motion.div 
              style={{ x: badgeTranslateX, y: badgeTranslateY }}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white shadow-3d-badge border border-amber-300 text-[11px] font-bold text-zinc-900 z-20"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-amberBrand">
                <Image 
                  src="/images/dog-reunion-happy.webp" 
                  alt="Happy dog after grooming" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <span>Fresh Coat Strut</span>
            </motion.div>

          </motion.div>

        </div>

        {/* 4. CALM URGENT TRIAGE (Immediate & Visible) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 sm:p-5 rounded-2xl bg-red-50/90 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-red-900 font-medium">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>
              <strong>Pet or Livestock Emergency?</strong> Suspected snakebite, acute bloat, severe trauma, or calving complications.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/263771883320?text=EMERGENCY:%20Urgent%20veterinary%20assistance%20required..."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-red-700 hover:text-red-900 underline whitespace-nowrap text-xs"
            >
              Emergency WhatsApp: 0771883320 →
            </a>
          </div>
        </motion.div>

      </motion.div>

    </section>
  );
}
