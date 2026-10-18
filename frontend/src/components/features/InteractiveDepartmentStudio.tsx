"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Scissors, 
  Bath, 
  HeartPulse,
  Truck,
  Heart,
  CheckCircle2
} from "lucide-react";
import { FloatingSpaBubble, GentlePawIcon } from "@/components/features/PetMotifs";
import { roomSwitchVariants, buttonHoverPhysics } from "@/lib/motion";

export function InteractiveDepartmentStudio() {
  const [activeTab, setActiveTab] = useState<"vet" | "spa">("vet");
  const [direction, setDirection] = useState<number>(1);

  const handleSwitch = (tab: "vet" | "spa") => {
    if (tab === activeTab) return;
    setDirection(tab === "spa" ? 1 : -1);
    setActiveTab(tab);
  };

  return (
    <section 
      className="w-full py-16 sm:py-24 border-y border-zinc-200/80 bg-zinc-950 text-white relative overflow-hidden perspective-stage"
      aria-label="Interactive Department Showcase"
    >
      {/* Dynamic Atmospheric 3D Lighting */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-700 ease-out"
        style={{
          backgroundImage: activeTab === "vet"
            ? "radial-gradient(circle at 25% 45%, rgba(0, 90, 190, 0.5) 0%, transparent 65%)"
            : "radial-gradient(circle at 75% 45%, rgba(245, 130, 90, 0.45) 0%, transparent 65%)"
        }}
      />

      {/* Floating Bubbles in Spa Mode */}
      {activeTab === "spa" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.35, y: -20 }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/6"
          >
            <FloatingSpaBubble size={32} />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 0.3, y: -30 }}
            transition={{ repeat: Infinity, duration: 8, delay: 1, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-1/4"
          >
            <FloatingSpaBubble size={24} />
          </motion.div>
        </div>
      )}

      <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16 relative z-10 preserve-3d">
        
        {/* Top Header & Spatial Master Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-zinc-800">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${activeTab === "vet" ? "bg-blue-400" : "bg-amber-400"}`} />
              <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
                Spatial Department Experience
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Two Disciplines. <br />
              <span className={activeTab === "vet" ? "text-blue-400 transition-colors" : "text-amber-400 transition-colors"}>
                One Unified Practice in Mutare.
              </span>
            </h2>
          </div>

          {/* Master Controller Switch with Spring Pill */}
          <div 
            className="inline-flex p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl self-start md:self-auto preserve-3d"
            role="tablist"
            aria-label="Department Exploration Modes"
          >
            <button
              onClick={() => handleSwitch("vet")}
              role="tab"
              aria-selected={activeTab === "vet"}
              className={`relative px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all touch-target flex items-center gap-2 ${
                activeTab === "vet" 
                  ? "text-white shadow-md font-bold" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeTab === "vet" && (
                <motion.div
                  layoutId="studioActiveTab"
                  className="absolute inset-0 bg-vet rounded-xl shadow-lg border border-blue-400/30"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <Stethoscope className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Clinical Surgery Suite</span>
            </button>

            <button
              onClick={() => handleSwitch("spa")}
              role="tab"
              aria-selected={activeTab === "spa"}
              className={`relative px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all touch-target flex items-center gap-2 ${
                activeTab === "spa" 
                  ? "text-white shadow-md font-bold" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeTab === "spa" && (
                <motion.div
                  layoutId="studioActiveTab"
                  className="absolute inset-0 bg-amberBrand rounded-xl shadow-lg border border-amber-300/30"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <Sparkles className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Shampooch Grooming Spa</span>
            </button>
          </div>
        </div>

        {/* Dynamic Spatial Room Portal */}
        <AnimatePresence custom={direction} mode="wait">
          {activeTab === "vet" ? (
            <motion.div
              key="vet-studio"
              custom={direction}
              variants={roomSwitchVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center preserve-3d"
            >
              {/* Media Block with 3D Depth Card (5 cols) */}
              <div className="lg:col-span-5 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-blue-900/50 bg-zinc-900 shadow-2xl group preserve-3d">
                <Image
                  src="/images/hero-vet.webp"
                  alt="Veterinary Clinical Consultation at Eastern Highlands"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Floating Cat Companion Checkup Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-xs text-blue-200 shadow-lg">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden border border-blue-300">
                    <Image src="/images/cat-gentle-whisker.webp" alt="Cat gentle checkup" fill className="object-cover" />
                  </div>
                  <span className="font-medium text-[11px]">Canine & Feline Care</span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-blue-500/30 text-xs text-zinc-300 space-y-1 shadow-lg">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
                    Diagnostic Standard
                  </span>
                  <p className="font-medium text-white">
                    On-site bloodwork, packed cell volume (PCV), and digital diagnostics for immediate clinical decisions.
                  </p>
                </div>
              </div>

              {/* Information & 3D Interactive Capabilities (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs px-3 py-1 font-mono">
                    DISCIPLINE 01 • CLINICAL CARE
                  </Badge>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                    Advanced Medical Rigor For Pets & Herds
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-normal">
                    Our Mutare surgery operates with sterile surgical suites, comprehensive in-house hematology, and ambulatory field units servicing livestock across Manicaland.
                  </p>
                </div>

                {/* 3D Tactile Capability Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                      <Activity className="w-4 h-4" />
                      <span>Companion Surgical Suite</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Sterile soft-tissue procedures, multiparameter anesthetic monitoring, and dedicated recovery bays.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                      <Truck className="w-4 h-4" />
                      <span>Ambulatory Farm Dispatch</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Scheduled field visits for bovine reproductive palpation, dehorning, and emergency dystocia across Vumba and Odzi.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Tick-Borne Disease Triage</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Rapid blood smear screening for Babesiosis (Biliary) and Ehrlichiosis with immediate antiprotozoal therapy.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                      <HeartPulse className="w-4 h-4" />
                      <span>Statutory Immunizations</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Legal rabies verification, annual core canine boosters, and livestock blackquarter vaccination schedules.
                    </p>
                  </motion.div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <motion.div {...buttonHoverPhysics} className="w-full sm:w-auto">
                    <Button asChild className="w-full sm:w-auto bg-vet hover:bg-vet-light text-white font-semibold text-xs h-11 px-6 rounded-xl shadow-md">
                      <Link href="/vet/services" className="flex items-center justify-center gap-2">
                        <span>View Complete Clinical Catalogue</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </motion.div>
                  <Button asChild variant="outline" className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs h-11 px-5 rounded-xl">
                    <Link href="/book?type=vet">Request Vet Appointment</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="spa-studio"
              custom={direction}
              variants={roomSwitchVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center preserve-3d"
            >
              {/* Media Block with 3D Depth Card (5 cols) */}
              <div className="lg:col-span-5 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-amber-500/40 bg-zinc-900 shadow-2xl group preserve-3d">
                <Image
                  src="/images/hero-grooming.webp"
                  alt="Shampooch Canine Spa Styling in Mutare"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Floating Happy Reunion Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-xs text-amber-200 shadow-lg">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden border border-amberBrand">
                    <Image src="/images/dog-reunion-happy.webp" alt="Joyful dog strut" fill className="object-cover" />
                  </div>
                  <span className="font-medium text-[11px]">Ecstatic Pet Reunions</span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-amber-500/30 text-xs text-zinc-300 space-y-1 shadow-lg">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                    Boutique Salon Standard
                  </span>
                  <p className="font-medium text-white">
                    Gentle hand scissoring, low-noise drying, and organic shampoos formulated for coat wellness.
                  </p>
                </div>
              </div>

              {/* Information & 3D Interactive Capabilities (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs px-3 py-1 font-mono">
                    DISCIPLINE 02 • CANINE SPA
                  </Badge>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                    Stress-Free Styling & Dermatological Coat Care
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-normal">
                    Shampooch combines boutique pampering with the hygiene and safety standards of a professional veterinary practice.
                  </p>
                </div>

                {/* 3D Tactile Capability Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                      <Scissors className="w-4 h-4" />
                      <span>Breed-Standard Scissoring</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Custom scissor and clipper profiling tailored to Poodles, Schnauzers, Spaniels, and terriers.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                      <Bath className="w-4 h-4" />
                      <span>Hydro-Massage Therapy</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Warm-water therapeutic baths with natural botanical conditioners to soothe irritated skin.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>Undercoat De-Shedding</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Specialized rake and high-velocity deshed blowouts for heavy double coats during seasonal coat changes.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 space-y-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Veterinary Co-Location</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Any skin lesions, ear inflammation, or unexpected abnormalities detected during grooming receive immediate veterinary review.
                    </p>
                  </motion.div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <motion.div {...buttonHoverPhysics} className="w-full sm:w-auto">
                    <Button asChild className="w-full sm:w-auto bg-amberBrand hover:bg-amberBrand-dark text-white font-semibold text-xs h-11 px-6 rounded-2xl shadow-md">
                      <Link href="/shampooch" className="flex items-center justify-center gap-2">
                        <span>Explore Shampooch Spa Menu</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </motion.div>
                  <Button asChild variant="outline" className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs h-11 px-5 rounded-2xl">
                    <Link href="/book?type=spa">Book a Grooming Slot</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
