"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Syringe, 
  Scissors, 
  Activity, 
  ShieldCheck, 
  HeartPulse, 
  Layers, 
  Truck, 
  Bone, 
  AlertCircle, 
  Sparkles, 
  Bug, 
  Pill, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Clock,
  Phone,
  Feather
} from "lucide-react";
import { GentlePawIcon } from "@/components/features/PetMotifs";

export default function VetServicesPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "companion" | "livestock" | "spa">("all");

  const services = [
    {
      id: "consultations",
      number: "01",
      title: "General Veterinary Consultations",
      category: "companion",
      icon: Stethoscope,
      badge: "Clinical Care",
      summary: "Comprehensive physical examinations to assess health, identify potential illnesses early, and recommend evidence-based treatment plans.",
      highlights: [
        "General health examinations and nose-to-tail physical assessments",
        "Diagnosis and treatment of common animal illnesses and infections",
        "Assessment of fever, vomiting, diarrhoea, lethargy, and loss of appetite",
        "Evaluation of skin conditions, acute wounds, abscesses, and trauma",
        "Assessment of eye and ear problems and pain management",
        "Follow-up consultations and ongoing health monitoring"
      ],
      tagline: "“Thorough assessment from compassionate hands.”"
    },
    {
      id: "vaccination",
      number: "02",
      title: "Vaccination & Preventive Healthcare",
      category: "companion",
      icon: Syringe,
      badge: "Preventive Medicine",
      summary: "Preventive healthcare tailored to age, health status, and regional vector risks to protect animals against common infectious diseases.",
      highlights: [
        "Puppy and kitten vaccination programmes and socialisation guidance",
        "Adult animal vaccinations and annual booster doses",
        "Statutory Rabies vaccination and official certification",
        "Canine Parvovirus, Distemper, and Hepatitis prevention protocols",
        "Vaccination record management and booster scheduling",
        "Strategic deworming programmes and general health assessments"
      ],
      tagline: "“Prevention is the cornerstone of responsible animal care.”"
    },
    {
      id: "surgery",
      number: "03",
      title: "Surgical Services & Soft-Tissue Procedures",
      category: "companion",
      icon: Activity,
      badge: "Surgical Suite",
      summary: "Dedicated surgical suite equipped for elective sterilization, emergency wound reconstructions, and soft-tissue procedures.",
      highlights: [
        "Elective spaying and neutering for dogs and cats",
        "Wound repair, laceration suturing, and abscess drainage",
        "Management of selected traumatic injuries and bite wounds",
        "Removal of selected cutaneous lumps and abnormal growths",
        "Pre-operative health assessment and bloodwork screening",
        "Continuous anesthetic monitoring and dedicated post-op recovery"
      ],
      tagline: "“Sterile protocols and attentive patient monitoring.”"
    },
    {
      id: "diagnostics",
      number: "04",
      title: "Diagnostic Services & In-House Laboratory",
      category: "companion",
      icon: HeartPulse,
      badge: "Diagnostics",
      summary: "On-site laboratory investigations and diagnostic screening to determine the root cause of illness and guide treatment decisions.",
      highlights: [
        "In-house blood tests, packed cell volume (PCV), and hematology",
        "Blood smear screening for tick-borne Babesiosis (Biliary) and Ehrlichiosis",
        "Faecal examinations and intestinal parasite identification",
        "Urinalysis and biochemical testing",
        "Skin scrapings and fungal/bacterial investigations",
        "Pregnancy assessments and diagnostic imaging referral arrangements"
      ],
      tagline: "“Accurate clinical insights for timely treatment.”"
    },
    {
      id: "hospitalisation",
      number: "05",
      title: "Animal Hospitalisation & Nursing Care",
      category: "companion",
      icon: ShieldCheck,
      badge: "Inpatient Care",
      summary: "Close observation, fluid therapy, and supportive veterinary nursing care for animals recovering from surgery or undergoing therapy.",
      highlights: [
        "Dedicated inpatient recovery bays and close observation",
        "Administration of prescribed intravenous and oral medications",
        "Intravenous fluid therapy for dehydration and shock support",
        "Wound dressing changes, drain management, and hygiene care",
        "Post-operative recovery monitoring and nutritional support",
        "Detailed discharge instructions and home nursing advice"
      ],
      tagline: "“Reassuring care when your animal needs extra observation.”"
    },
    {
      id: "reproduction",
      number: "06",
      title: "Reproductive & Breeding Services",
      category: "companion",
      icon: Layers,
      badge: "Breeding Health",
      summary: "Responsible breeding consultations, fertility evaluations, and maternal care to protect both parents and newborn litters.",
      highlights: [
        "Pre-breeding health examinations and soundness assessments",
        "Pregnancy monitoring and nutritional planning for expecting dams",
        "Guidance on responsible breeding practices and ethical genetics",
        "Assistance with selected birth-related complications and dystocia",
        "Newborn animal resuscitation and maternal lactation advice",
        "Post-whelping and post-queening health checks"
      ],
      tagline: "“Safeguarding the wellbeing of mothers and newborns.”"
    },
    {
      id: "skin-parasite",
      number: "07",
      title: "Skin, Coat & Parasite Management",
      category: "companion",
      icon: Sparkles,
      badge: "Dermatology",
      summary: "Assessment, treatment, and ongoing management of itchy skin, flea/tick infestations, allergies, and dermatological conditions.",
      highlights: [
        "Evaluation of chronic itching, alopecia (hair loss), and red skin",
        "Diagnosis and management of bacterial and fungal skin infections",
        "Assessment of Sarcoptic and Demodectic mange and ear mites",
        "Comprehensive ear canal examinations and otitis treatment",
        "Targeted topical and systemic treatments tailored to individual species",
        "Environmental hygiene and multi-pet household control plans"
      ],
      tagline: "“Relieving discomfort and restoring a healthy, shiny coat.”"
    },
    {
      id: "dental",
      number: "08",
      title: "Dental & Oral Healthcare",
      category: "companion",
      icon: Bone,
      badge: "Dental Health",
      summary: "Oral evaluations and ultrasonic cleaning to treat dental calculus, eliminate mouth pain, and prevent secondary systemic infections.",
      highlights: [
        "Comprehensive oral examinations and periodontal staging",
        "Assessment of halitosis (bad breath) and chewing reluctance",
        "Evaluation of gingivitis, gum recession, and dental tartar",
        "Assessment and treatment of fractured, loose, or diseased teeth",
        "Ultrasonic dental scaling and polishing where facilities are available",
        "Practical guidance on routine home dental care for pets"
      ],
      tagline: "“Pain-free chewing and lifelong oral wellness.”"
    },
    {
      id: "emergency",
      number: "09",
      title: "Emergency Veterinary Care & Triage",
      category: "companion",
      icon: AlertCircle,
      badge: "Urgent Care",
      summary: "Prompt assessment and stabilization for unexpected injuries, sudden deterioration, suspected poisoning, and traumatic emergencies.",
      highlights: [
        "Triage for acute respiratory distress, severe bleeding, or collapse",
        "Suspected poisoning assessment and immediate antidotal protocols",
        "Management of severe trauma, motor vehicle injuries, and deep wounds",
        "Emergency dystocia intervention for animals struggling in labor",
        "Direct emergency communication on WhatsApp at 0771883320",
        "Guidance on safe patient transport and immobilization"
      ],
      tagline: "“Rapid clinical action when minutes make the difference.”"
    },
    {
      id: "livestock",
      number: "10",
      title: "Livestock & Farm Animal Services",
      category: "livestock",
      icon: Truck,
      badge: "Ambulatory Farm Care",
      summary: "Dedicated herd health planning, disease prevention, and mobile on-site farm visits servicing cattle, small ruminants, pigs, and poultry across Manicaland.",
      highlights: [
        "Cattle Health: General herd exams, Blackquarter & Anthrax vaccination, tick control, reproductive palpation, and pregnancy diagnosis",
        "Goats & Sheep: Flock health, strategic deworming, pulpy kidney prevention, foot rot care, and breeding management",
        "Poultry Health: Commercial and smallholder flock health assessments, Newcastle vaccination planning, and biosecurity",
        "Pig Health: Preventative healthcare, parasite management, sow breeding health, and herd biosecurity guidance",
        "Ambulatory Farm Dispatch: On-site visits throughout Vumba, Penhalonga, and the Odzi agricultural belt"
      ],
      tagline: "“Supporting farmers, animal welfare, and sustainable productivity.”"
    },
    {
      id: "grooming",
      number: "11",
      title: "Professional Pet Grooming (Shampooch Spa)",
      category: "spa",
      icon: Scissors,
      badge: "Shampooch Spa",
      summary: "Boutique coat care, breed styling, and hydrotherapy delivered with low-stress handling under direct veterinary co-location.",
      highlights: [
        "Warm-water hydro-massage bathing with hypoallergenic shampoos",
        "Breed-appropriate haircuts, scissor profiling, and face/paw styling",
        "High-velocity de-shed blowouts and undercoat raking",
        "Nail trimming, paw pad tidying, and gentle ear cleaning",
        "Puppy introductory grooming sessions for confident, happy dogs",
        "Immediate veterinary review if any abnormal skin spots are found"
      ],
      tagline: "“A little luxury for their coat, complete peace of mind for you.”"
    },
    {
      id: "flea-tick",
      number: "12",
      title: "Flea & Tick Prevention Programmes",
      category: "companion",
      icon: Bug,
      badge: "Vector Prevention",
      summary: "Targeted tick and flea prevention strategies to shield pets from life-threatening tick-borne diseases in the Eastern Highlands climate.",
      highlights: [
        "Evaluation of flea and tick exposure risks in your specific neighborhood",
        "Selection of appropriate spot-on treatments, collars, or chewables",
        "Preventive protocols guarding against Babesiosis (Biliary) and Ehrlichiosis",
        "Household environmental hygiene and yard management guidance",
        "Multi-pet household synchronized parasite prevention schedules",
        "Year-round seasonal vector management plans"
      ],
      tagline: "“Defending against ticks and fleas all year round.”"
    },
    {
      id: "medicines",
      number: "13",
      title: "Veterinary Medicines & Animal Healthcare Products",
      category: "companion",
      icon: Pill,
      badge: "Pharmacy & Products",
      summary: "Access to authorized veterinary-prescribed medicines, therapeutic nutritional supplements, and quality healthcare products.",
      highlights: [
        "Veterinary-prescribed antibiotics, anti-inflammatories, and pain relief",
        "Broad-spectrum dewormers for dogs, cats, and livestock",
        "Authorized flea and tick preventive spot-ons and oral chews",
        "Antiseptic wound sprays, topical creams, and skin barrier ointments",
        "Nutritional joint supplements, skin omega oils, and recovery formulas",
        "Professional coat care shampoos and grooming accessories"
      ],
      tagline: "“Authorized, safe medications dispensed with professional instructions.”"
    }
  ];

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Header Section */}
        <header className="mb-12 text-center max-w-3xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center gap-2 justify-center mb-1">
            <Badge variant="outline" className="text-vet border-vet/40 bg-vet/5 font-semibold text-xs px-3 py-0.5">
              Eastern Highlands Veterinary Surgery
            </Badge>
            <span className="text-xs text-zinc-500 font-medium">Mutare, Zimbabwe</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight">
            Our Veterinary Services
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            Compassionate veterinary care, preventive healthcare, surgical services, and farm visits tailored to companion animals and livestock across the Eastern Highlands.
          </p>

          {/* Quick WhatsApp Contact Pill */}
          <div className="pt-2 flex justify-center">
            <a
              href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery,%20I%20have%20an%20enquiry%20regarding%20your%20services..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Questions? Enquire directly on WhatsApp: 0771883320</span>
            </a>
          </div>
        </header>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10" role="tablist">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all touch-target ${
              activeCategory === "all"
                ? "bg-vet text-white shadow-xs font-bold"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            All 13 Services
          </button>
          <button
            onClick={() => setActiveCategory("companion")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all touch-target ${
              activeCategory === "companion"
                ? "bg-vet text-white shadow-xs font-bold"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Companion Animal Care (Dogs & Cats)
          </button>
          <button
            onClick={() => setActiveCategory("livestock")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all touch-target ${
              activeCategory === "livestock"
                ? "bg-vet text-white shadow-xs font-bold"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Livestock & Farm Visits (Cattle, Goats, Poultry, Pigs)
          </button>
          <button
            onClick={() => setActiveCategory("spa")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all touch-target ${
              activeCategory === "spa"
                ? "bg-amberBrand text-white shadow-xs font-bold"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Shampooch Grooming Spa
          </button>
        </div>

        {/* 13 Services Detailed Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const isSpa = service.category === "spa";

            return (
              <div
                key={service.id}
                id={service.id}
                className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md ${
                  isSpa 
                    ? "bg-gradient-to-br from-amber-50/50 to-white border-amberBrand/30" 
                    : "bg-zinc-50/70 hover:bg-zinc-50 border-zinc-200/80"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-2xs ${
                        isSpa ? "bg-amberBrand text-white" : "bg-vet text-white"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-zinc-400 font-semibold">
                        Service {service.number}
                      </span>
                    </div>

                    <Badge 
                      variant="outline" 
                      className={`text-[10px] font-mono px-2.5 py-0.5 ${
                        isSpa ? "text-amberBrand-dark border-amberBrand/40 bg-white" : "text-vet border-vet/30 bg-white"
                      }`}
                    >
                      {service.badge}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-zinc-950 mb-1.5 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                      {service.summary}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="pt-2 space-y-2 border-t border-zinc-200/60">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                      Scope of Care
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      {service.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSpa ? "text-amberBrand" : "text-vet"}`} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-200/60 flex items-center justify-between text-xs">
                  <span className="font-serif italic text-zinc-500 text-[11px]">
                    {service.tagline}
                  </span>
                  
                  <Link
                    href={`/book?type=${isSpa ? "spa" : "vet"}&service=${encodeURIComponent(service.title)}`}
                    className={`font-semibold underline underline-offset-4 flex items-center gap-1 ${
                      isSpa ? "text-amberBrand-dark hover:text-amberBrand" : "text-vet hover:text-vet-light"
                    }`}
                  >
                    <span>Request Care</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Triage Prompt Strip */}
        <section className="mb-16 p-6 rounded-3xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-red-950">Have an Urgent Animal Emergency?</h3>
              <p className="text-xs text-red-800 leading-relaxed">
                Suspected snakebite, severe trauma, bloat, collapse, or calving complications. Call or message our Mutare emergency team immediately.
              </p>
            </div>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl h-10 px-5 shrink-0 shadow-sm">
            <a href="https://wa.me/263771883320?text=EMERGENCY:%20Urgent%20veterinary%20assistance%20required...">
              Emergency WhatsApp: 0771883320
            </a>
          </Button>
        </section>

        {/* Bottom Booking Action Card */}
        <section className="p-8 rounded-3xl bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
              APPOINTMENT COORDINATION
            </Badge>
            <h3 className="font-serif font-bold text-2xl text-white">
              Ready to Schedule a Consultation or Farm Call?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed font-normal">
              Whether you need routine vaccines, surgical assessment, herd pregnancy diagnosis, or Shampooch styling, our Mutare team is here to assist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button asChild className="bg-vet hover:bg-vet-light text-white text-xs font-semibold h-11 px-6 rounded-xl shadow-md">
              <Link href="/book">Request Appointment Online</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-11 px-5 rounded-xl shadow-md">
              <a 
                href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery,%20I%20would%20like%20to%20request%20an%20appointment..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp: 0771883320</span>
              </a>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
