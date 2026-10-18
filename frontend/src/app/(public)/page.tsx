"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeroStage } from "@/components/features/HeroStage";
import { InteractiveDepartmentStudio } from "@/components/features/InteractiveDepartmentStudio";
import { CareMomentsExplorer } from "@/components/features/CareMomentsExplorer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  FileCheck2,
  Heart,
  Truck,
  Layers,
  Smile,
  Compass,
  MessageCircle
} from "lucide-react";
import { GentlePawIcon, TailWagStroke, FloatingSpaBubble } from "@/components/features/PetMotifs";
import { 
  buttonHoverPhysics, 
  spatialSideInLeft, 
  spatialSideInRight, 
  spatialPopVariants 
} from "@/lib/motion";

export default function HomePage() {
  const quickSpecies = [
    { label: "Canine & Feline Care", desc: "Surgery, Dental & Diagnostics", href: "/vet/services", icon: Stethoscope },
    { label: "Bovine Cattle Herds", desc: "Pregnancy & Biosecurity", href: "/vet/services#livestock", icon: ShieldCheck },
    { label: "Caprine & Small Ruminants", desc: "Flock Health & Parasites", href: "/vet/services#livestock", icon: Layers },
    { label: "Shampooch Grooming Spa", desc: "Breed Styling & Coat Wellness", href: "/shampooch", icon: Sparkles },
    { label: "Ambulatory Farm Dispatch", desc: "Vumba, Penhalonga & Odzi", href: "/contact", icon: Truck },
  ];

  // 5 Real Eastern Highlands Patients
  const patientGallery = [
    {
      name: "Simba",
      breed: "Golden Retriever • Mutare Central",
      category: "Veterinary Wellness",
      image: "/images/dog-golden-smile.webp",
      badge: "Healthy Smile",
      notes: "Post-dental prophylaxis & tick-borne smear check. Calm, tail wagging throughout.",
      icon: Smile,
    },
    {
      name: "Bella",
      breed: "Poodle Mix • Murambi",
      category: "Shampooch Spa",
      image: "/images/dog-bath-bubbles.webp",
      badge: "Warm Aloe Bath",
      notes: "Hydro-massage soak & organic chamomile rinse to soothe dry mountain-air coat.",
      icon: Sparkles,
    },
    {
      name: "Luna",
      breed: "Domestic Shorthair • Vumba Road",
      category: "Feline Care",
      image: "/images/cat-gentle-whisker.webp",
      badge: "Gentle Hands",
      notes: "Quiet exam with warm towel wrap. Vaccinations updated with zero stress.",
      icon: Heart,
    },
    {
      name: "Cooper",
      breed: "Beagle • Greenside",
      category: "Shampooch Spa",
      image: "/images/dog-reunion-happy.webp",
      badge: "Fresh Coat Strut",
      notes: "De-shed blowout and precision nail trim. Ecstatic reunion sprint across lobby.",
      icon: Sparkles,
    },
    {
      name: "Boran Herd #4",
      breed: "Commercial Cattle • Odzi Valley",
      category: "Ambulatory Herd",
      image: "/images/livestock-pasture.webp",
      badge: "Field Dispatch",
      notes: "Ultrasonic pregnancy palpation & seasonal tick biosecurity audit on-farm.",
      icon: Truck,
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-clip perspective-stage">

      {/* 1. FULL-BLEED MONUMENTAL HERO (2.5D Spatial Diorama with Real Pet Imagery) */}
      <HeroStage />

      {/* 2. COMPACT SPECIES & SERVICE RUNWAY (Full-Width Responsive Ribbon) */}
      <section className="w-full bg-white border-b border-zinc-200/80 py-6 overflow-x-auto">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-2 mb-3">
            <GentlePawIcon className="w-3.5 h-3.5 text-amberBrand" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 font-semibold">
              Explore By Patient & Care Category
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickSpecies.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                >
                  <Link
                    href={item.href}
                    className="p-3.5 rounded-2xl bg-zinc-50/90 hover:bg-zinc-100/90 border border-zinc-200/80 transition-all shadow-xs hover:shadow-md group flex flex-col justify-between h-full"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:text-primary transition-colors shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <div>
                      <span className="font-serif font-bold text-xs text-zinc-950 block leading-snug group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5 line-clamp-1">
                        {item.desc}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE EMOTIONAL SHOWCASE: CARE MOMENTS EXPLORER (With 2.5D Mouse Tilt) */}
      <CareMomentsExplorer />

      {/* 4. SIGNATURE INTERACTIVE SHOWPIECE: THE DEPARTMENT STUDIO (3D Spatial Room Switch) */}
      <InteractiveDepartmentStudio />

      {/* 5. BRAND-NEW SPATIAL GALLERY: PATIENTS OF THE EASTERN HIGHLANDS */}
      <section className="w-full py-16 sm:py-24 bg-[#faf8f5] border-b border-zinc-200/80 overflow-hidden">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-amber-900/10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amberBrand-dark">
                <Heart className="w-4 h-4 text-amberBrand fill-amberBrand/20" />
                <span>Real Patients • Mutare Communities</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-950 tracking-tight">
                Patients of the Eastern Highlands.
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                Every animal that walks, trots, or strides through our doors receives patient hands, clinical rigor, and unmistakable love.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Compass className="w-4 h-4 text-amberBrand" />
              <span>Manicaland Compassionate Practice</span>
            </div>
          </div>

          {/* 3D Dimensional Patient Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {patientGallery.map((patient, idx) => {
              const Icon = patient.icon;
              return (
                <motion.div
                  key={patient.name}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                  className="rounded-3xl bg-white border border-amber-900/15 p-4 shadow-3d-floating flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Animal Photo Frame */}
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-zinc-200 shadow-sm mb-3.5 group-hover:scale-102 transition-transform duration-500">
                      <Image
                        src={patient.image}
                        alt={patient.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-medium bg-black/40 backdrop-blur-xs px-2 py-1 rounded-lg">
                        <span className="flex items-center gap-1">
                          <Icon className="w-3 h-3 text-amber-300" />
                          <span>{patient.badge}</span>
                        </span>
                        <span className="text-zinc-200 font-mono">{patient.category}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-bold text-lg text-zinc-950 group-hover:text-primary transition-colors">
                          {patient.name}
                        </h3>
                        <GentlePawIcon className="w-3.5 h-3.5 text-amberBrand/60" />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500">
                        {patient.breed}
                      </p>
                      <p className="text-xs text-zinc-600 leading-relaxed pt-1.5 font-normal">
                        {patient.notes}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>Verified Patient</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Thriving
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. WIDE EDITORIAL PRACTICE LEDGER (Directional Scroll Side-Ins with Real Photos) */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-zinc-200">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Anchor: Slides in from Left with 3D Depth */}
            <motion.div 
              variants={spatialSideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-vet">
                The Eastern Highlands Mandate
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-950 leading-[1.08]">
                Equally Committed to Companion Pets and Working Herds.
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                In Manicaland, veterinary responsibility is diverse and essential. We uphold uncompromising clinical standards whether delivering specialized surgical care to a suburban family pet or managing herd fertility across a commercial cattle enterprise.
              </p>
              
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-vet" />
                  <span>Ambulatory Field Footprint</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Based in Mutare with dedicated ambulatory farm call routes servicing Vumba mountain smallholdings, Penhalonga valley, and the Odzi commercial agricultural belt.
                </p>
              </div>

              {/* Verified Trust Stamp */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950">
                <ShieldCheck className="w-5 h-5 text-vet shrink-0" />
                <span>Fully registered with the <strong>Council of Veterinary Surgeons of Zimbabwe</strong>.</span>
              </div>
            </motion.div>

            {/* Right Stream: Slides in from Right with 3D Depth & Real Visual Previews */}
            <motion.div 
              variants={spatialSideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-7 space-y-5"
            >
              
              {/* Stream 01: Companion Animal Care */}
              <div className="p-6 sm:p-7 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 hover:border-vet/50 transition-all shadow-xs hover:shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-vet/10 text-vet flex items-center justify-center font-mono text-xs font-bold">
                      01
                    </span>
                    <h3 className="font-serif font-bold text-xl text-zinc-950">
                      Companion Animal Medicine & Hospital Care
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium text-zinc-600 bg-white">
                    Dogs & Cats
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                  <div className="sm:col-span-3 relative h-24 rounded-xl overflow-hidden border border-zinc-200 shrink-0 shadow-xs hidden sm:block">
                    <Image 
                      src="/images/cat-gentle-whisker.webp" 
                      alt="Gentle cat care" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <p className="sm:col-span-9 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Systematic health exams, packed cell volume (PCV) smears for tick-borne Babesiosis and Ehrlichiosis, elective and emergency soft-tissue surgeries, and ultrasonic dental scaling conducted in a sterile hospital setting.
                  </p>
                </div>
              </div>

              {/* Stream 02: Livestock & Production Herds */}
              <div className="p-6 sm:p-7 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 hover:border-vet/50 transition-all shadow-xs hover:shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-vet/10 text-vet flex items-center justify-center font-mono text-xs font-bold">
                      02
                    </span>
                    <h3 className="font-serif font-bold text-xl text-zinc-950">
                      Livestock Production & Ambulatory Farm Calls
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium text-zinc-600 bg-white">
                    Cattle, Goats, Sheep, Horses
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                  <div className="sm:col-span-3 relative h-24 rounded-xl overflow-hidden border border-zinc-200 shrink-0 shadow-xs hidden sm:block">
                    <Image 
                      src="/images/livestock-pasture.webp" 
                      alt="Cattle in Eastern Highlands pasture" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <p className="sm:col-span-9 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Herd biosecurity protocols, preventative Blackquarter and Anthrax vaccination schedules, pregnancy diagnosis, breeding soundness evaluations, and field obstetrical intervention across Manicaland farms.
                  </p>
                </div>
              </div>

              {/* Stream 03: Grooming & Skin Health */}
              <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/50 border border-amberBrand/30 hover:border-amberBrand/60 transition-all shadow-xs hover:shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-amberBrand-peach text-amberBrand flex items-center justify-center font-mono text-xs font-bold">
                      03
                    </span>
                    <h3 className="font-serif font-bold text-xl text-zinc-950">
                      Shampooch Professional Spa & Hygiene
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium text-amberBrand-dark bg-white border-amberBrand/30">
                    Canine Styling
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                  <div className="sm:col-span-3 relative h-24 rounded-xl overflow-hidden border border-amberBrand/30 shrink-0 shadow-xs hidden sm:block">
                    <Image 
                      src="/images/dog-reunion-happy.webp" 
                      alt="Freshly groomed dog strut" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <p className="sm:col-span-9 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Coat hygiene, undercoat de-shedding for double-coated breeds, hypoallergenic warm-water bathing, and breed-standard styling delivered with gentle, low-stress handling under integrated veterinary oversight.
                  </p>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* 7. FULL-BLEED CLINICAL ETHICS CHARTER (Dark Slate / Emerald Precision) */}
      <section className="w-full py-16 sm:py-24 bg-zinc-950 text-white">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
              The EHVS Ethical Commitment
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Transparent Care. No Financial Surprises.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              We operate under a strict code of professional transparency. We outline diagnostic pathways clearly and agree on treatment estimates before initiating procedures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-7 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-lg"
            >
              <FileCheck2 className="w-7 h-7 text-emerald-400 mb-2" />
              <h3 className="font-serif font-bold text-lg text-white">Clear Itemized Estimates</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Prior to elective surgery, intensive therapy, or specialized imaging, you receive an itemized cost estimate. No unexpected procedural additions.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-7 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-lg"
            >
              <Heart className="w-7 h-7 text-emerald-400 mb-2" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">Fear-Free Handling</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                We utilize low-stress patient handling and species-appropriate environmental accommodations to minimize trauma for hospitalized or nervous animals.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-7 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-lg"
            >
              <ShieldCheck className="w-7 h-7 text-emerald-400 mb-2" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">Professional Accountability</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                All clinical protocols adhere strictly to the Council of Veterinary Surgeons of Zimbabwe regulatory requirements and modern biosecurity standards.
              </p>
            </motion.div>
          </div>

          {/* Action Row */}
          <div className="mt-14 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs sm:text-sm text-zinc-400 text-center sm:text-left">
              Have questions regarding our clinical capabilities or ambulatory farm booking?
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <motion.div {...buttonHoverPhysics} className="w-full sm:w-auto">
                <Button asChild className="w-full sm:w-auto bg-vet hover:bg-vet-light text-white text-xs sm:text-sm font-semibold h-11 px-6 rounded-xl shadow-md">
                  <Link href="/book">Request Appointment Online</Link>
                </Button>
              </motion.div>
              <Button asChild className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold h-11 px-5 rounded-xl shadow-md">
                <a 
                  href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20have%20an%20enquiry..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp: 0771883320</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs sm:text-sm font-medium h-11 px-5 rounded-xl">
                <Link href="/contact">Clinic Desk & Triage</Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
