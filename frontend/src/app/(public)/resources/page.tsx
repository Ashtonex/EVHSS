"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Stethoscope,
  BookOpen,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  Bug,
  Heart,
  Truck
} from "lucide-react";

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Puppy & Kitten", "Preventive & Vaccines", "Parasites & Ticks", "Livestock & Biosecurity", "Emergency Guidance"];

  const guides = [
    {
      title: "Puppy & Kitten Early Care Programmes",
      category: "Puppy & Kitten",
      icon: Heart,
      readTime: "4 min read",
      summary: "First-year essentials covering developmental milestones, socialisation, nutritional foundations, and safe indoor and outdoor environment preparation.",
      keyPoints: [
        "First veterinary consultation at 6–8 weeks for initial health screening",
        "Gentle socialisation protocols to prevent fear-based behavioral issues",
        "Nutritional balancing tailored to breed size and growth velocity"
      ]
    },
    {
      title: "Vaccination & Deworming Schedules in Zimbabwe",
      category: "Preventive & Vaccines",
      icon: ShieldCheck,
      readTime: "5 min read",
      summary: "Understanding statutory Rabies immunization and core Parvovirus, Distemper, and Hepatitis timing for companion animals across the Eastern Highlands.",
      keyPoints: [
        "Primary puppy series at 6, 9, and 12 weeks with annual boosters",
        "Statutory Rabies verification starting at 12 weeks of age",
        "Rotational deworming schedules every 3 months for adult dogs and outdoor cats"
      ]
    },
    {
      title: "Recognising Common Signs of Animal Illness Early",
      category: "Emergency Guidance",
      icon: Stethoscope,
      readTime: "4 min read",
      summary: "Subtle clinical signs that indicate an animal is unwell before severe deterioration: temperature changes, lethargy, anorexia, and digestive shifts.",
      keyPoints: [
        "Persistent refusal to eat or drink exceeding 24 hours",
        "Lethargy, reluctance to stand, or disorientation",
        "Vomiting, diarrhoea, or progressive abdominal enlargement"
      ]
    },
    {
      title: "Flea & Tick Prevention in the Eastern Highlands",
      category: "Parasites & Ticks",
      icon: Bug,
      readTime: "4 min read",
      summary: "Managing high vector loads of Rhipicephalus and Amblyomma ticks. Safeguarding dogs from fatal Babesiosis (Biliary) and Ehrlichiosis.",
      keyPoints: [
        "Year-round topical spot-ons, collars, or oral chewables",
        "Daily physical tick checks around ears, groin, and between toes",
        "Managing multi-pet households with synchronized monthly treatments"
      ]
    },
    {
      title: "Skin & Coat Health in Humid Mountain Climates",
      category: "Puppy & Kitten",
      icon: Sparkles,
      readTime: "3 min read",
      summary: "Preventing wet highland dermatitis, hot spots, and fungal coat conditions with proper drying, de-shedding, and hypoallergenic bathing.",
      keyPoints: [
        "Drying wet undercoats thoroughly after mountain walks and rain",
        "Regular brushing to remove dead undercoat before matting begins",
        "Recognising early signs of allergic scratching and hair loss"
      ]
    },
    {
      title: "Responsible Breeding & Sterilisation Decisions",
      category: "Preventive & Vaccines",
      icon: ShieldCheck,
      readTime: "4 min read",
      summary: "Medical and welfare benefits of routine spaying and neutering, including pyometra prevention, mammary tumor reduction, and curbing roaming.",
      keyPoints: [
        "Elective sterilisation recommended around 6 months of age",
        "Eliminates uterine infections (pyometra) and testicular cancers",
        "Reduces territorial roaming and aggressive fighting injuries"
      ]
    },
    {
      title: "Nutrition & Healthy Weight Management",
      category: "Puppy & Kitten",
      icon: Heart,
      readTime: "3 min read",
      summary: "Body condition scoring, species-appropriate caloric density, and avoiding table scraps that induce pancreatitis or obesity.",
      keyPoints: [
        "Maintaining a visible waistline and palpable ribs without excess fat",
        "Strictly avoiding toxic foods: cooked bones, onions, raisins, and chocolate",
        "Senior animal diets with joint supplements and kidney support"
      ]
    },
    {
      title: "Dental Care & Hygiene for Companion Animals",
      category: "Preventive & Vaccines",
      icon: Stethoscope,
      readTime: "4 min read",
      summary: "Why bad breath is never normal. Halting tartar buildup, subgingival bacteremia, and chronic oral pain through routine home and clinical care.",
      keyPoints: [
        "Gingivitis and tartar harbor bacteria that damage kidneys and heart",
        "Professional ultrasonic scaling under anesthesia when tartar hardens",
        "Dental chews and tooth brushing introductions during puppyhood"
      ]
    },
    {
      title: "Livestock Disease Prevention & Vaccination",
      category: "Livestock & Biosecurity",
      icon: Truck,
      readTime: "5 min read",
      summary: "Strategic seasonal vaccination against Blackquarter, Anthrax, and Botulism for cattle and small ruminants across Manicaland.",
      keyPoints: [
        "Annual pre-rainy season vaccination protocols for commercial herds",
        "Tick dipping and acaricide rotation to prevent Heartwater and Gall sickness",
        "Internal parasite drenching strategies based on wet vlei grazing"
      ]
    },
    {
      title: "Farm Biosecurity & Herd Management Guidance",
      category: "Livestock & Biosecurity",
      icon: ShieldCheck,
      readTime: "5 min read",
      summary: "Practical on-farm isolation, perimeter fencing, visitor hygiene, and quarantine protocols to prevent catastrophic disease introduction.",
      keyPoints: [
        "Quarantining newly introduced cattle or sheep for 3 weeks minimum",
        "Disinfection footbaths and restricted vehicle access near kraals",
        "Prompt isolation of febrile or coughing animals from the main herd"
      ]
    },
    {
      title: "Seasonal Animal Health Risks in Manicaland",
      category: "Parasites & Ticks",
      icon: Bug,
      readTime: "4 min read",
      summary: "Preparing for spring tick flushes, wet season foot rot, winter respiratory challenges, and summer snake activity.",
      keyPoints: [
        "Heightened vigilance for acute snakebite during warm summer months",
        "Foot rot inspection during continuous high-rainfall periods in Vumba",
        "Strategic nutritional supplementation during winter dry spells"
      ]
    },
    {
      title: "Responsible Pet Ownership & Animal Welfare",
      category: "Preventive & Vaccines",
      icon: Heart,
      readTime: "4 min read",
      summary: "The Five Freedoms of animal welfare: freedom from hunger, discomfort, pain, distress, and the freedom to express normal species behaviors.",
      keyPoints: [
        "Providing continuous clean water, sheltered bedding, and daily exercise",
        "Annual clinical examinations even when animals appear outwardly healthy",
        "Creating a safe, loving lifelong bond built on positive reinforcement"
      ]
    }
  ];

  const filteredGuides = activeCategory === "All" 
    ? guides 
    : guides.filter(g => g.category === activeCategory);

  return (
    <div className="min-h-screen py-10 md:py-16 bg-zinc-50/50">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-vet border-vet/30 bg-white text-xs px-3 py-0.5 font-semibold">
            Regional Animal Health Education • Mutare
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight">
            Pet & Livestock Health Resources
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            We believe that informed animal owners are better equipped to recognise health problems early and make responsible healthcare decisions.
          </p>

          <p className="text-[11px] text-zinc-500 italic max-w-xl mx-auto">
            * Note: Our educational content is intended to complement, not replace, professional veterinary examinations and individual medical advice.
          </p>
        </header>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all touch-target ${
                activeCategory === cat
                  ? "bg-vet text-white font-bold shadow-xs"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.title} className="rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                <CardHeader className="p-6 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-[10px] font-mono text-zinc-600 bg-zinc-50 border-zinc-200">
                      {guide.category}
                    </Badge>
                    <span className="text-[10px] text-zinc-400 font-mono">{guide.readTime}</span>
                  </div>
                  <CardTitle className="font-serif text-lg font-bold text-zinc-950 leading-snug">
                    {guide.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-4 text-xs text-zinc-600 flex-1 flex flex-col justify-between">
                  <p className="leading-relaxed font-normal">
                    {guide.summary}
                  </p>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                    <span className="text-[10px] font-mono font-semibold uppercase text-zinc-500 block">
                      Clinical Highlights
                    </span>
                    <ul className="space-y-1 text-[11px] text-zinc-700">
                      {guide.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 className="w-3 h-3 text-vet shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-medium">Eastern Highlands Practice Guide</span>
                    <Link
                      href="/contact"
                      className="text-xs font-semibold text-vet hover:underline flex items-center gap-1"
                    >
                      <span>Ask Our Vets</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* WhatsApp Veterinary Advice Card */}
        <section className="p-8 rounded-3xl bg-emerald-50/80 border-2 border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif font-bold text-2xl text-emerald-950">
              Have a Specific Health Question About Your Animal?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed max-w-xl font-normal">
              Whether you need clarification on vaccination timing, tick treatments, or livestock biosecurity, our Mutare team is available via WhatsApp.
            </p>
          </div>

          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-11 px-6 rounded-xl shadow-md shrink-0">
            <a 
              href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20have%20a%20health%20question%20regarding%20my%20animal..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Ask on WhatsApp: 0771883320</span>
            </a>
          </Button>
        </section>

      </div>
    </div>
  );
}
