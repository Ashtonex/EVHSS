import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  CheckCircle2, 
  Compass,
  ArrowRight,
  Phone,
  MessageCircle,
  Clock,
  Award,
  Users
} from "lucide-react";
import { GentlePawIcon } from "@/components/features/PetMotifs";

export default function AboutPage() {
  const priorities = [
    {
      title: "Animal Welfare",
      desc: "We recognise the fundamental importance of treating animals with care, dignity, and respect across clinical examinations, surgical procedures, and livestock handling.",
      icon: Heart,
    },
    {
      title: "Preventive Healthcare",
      desc: "We encourage routine physical health checks, structured statutory vaccinations, and tailored parasite-prevention programmes that stop illnesses before they start.",
      icon: ShieldCheck,
    },
    {
      title: "Professional Guidance",
      desc: "We help owners understand their animals’ health needs and clearly discuss diagnostic findings and evidence-based treatment pathways without pressure.",
      icon: Stethoscope,
    },
    {
      title: "Client Education",
      desc: "We promote responsible animal ownership through practical husbandry guidance, biosecurity advice, and transparent care information.",
      icon: Users,
    },
    {
      title: "Individualised Care",
      desc: "Every animal has unique physiological needs shaped by species, age, health status, and living environment—from household companions to commercial herds.",
      icon: Award,
    },
    {
      title: "Ongoing Support",
      desc: "We believe in long-term relationships, encouraging follow-up monitoring and open communication to ensure lasting positive health outcomes.",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="min-h-screen py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Header */}
        <header className="mb-14 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-vet border-vet/30 bg-vet/5 text-xs px-3 py-0.5">
            About Eastern Highlands Veterinary Surgery
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight">
            Compassionate Veterinary Care. Healthier Animals. Stronger Bonds.
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            Welcome to Eastern Highlands Veterinary Surgery, your dedicated partner in animal health, welfare, and clinical precision in Mutare, Zimbabwe.
          </p>
        </header>

        {/* Core Practice Mission Section */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-zinc-200 pb-14">
          <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-vet tracking-wider">
              <GentlePawIcon className="w-4 h-4 text-vet" />
              <span>Caring for Animals, Supporting Their Owners</span>
            </div>
            
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-950 leading-tight">
              A Dedicated Medical Home for Mutare and Manicaland.
            </h2>
            
            <p>
              We are committed to providing professional veterinary care, preventive healthcare, treatment services, and practical advice to help animals live healthier, happier lives.
            </p>
            <p>
              We understand that animals are more than just pets or livestock; they are valued members of our families and important contributors to our livelihoods. Our goal is to support pet owners, breeders, and commercial farmers with responsible animal healthcare and clinical guidance.
            </p>
            <p>
              Whether you need a routine health check, vaccination, treatment for an unwell animal, emergency surgical care, or professional advice on animal management, our Mutare team is here to assist.
            </p>
          </div>

          <div className="md:col-span-5 relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-zinc-200 shadow-md">
            <Image
              src="/images/vet-gentle-hands.webp"
              alt="Veterinary doctor examining patient gently at Eastern Highlands"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-xs border border-white/60 text-xs">
              <span className="font-serif italic font-bold text-zinc-900 block">
                “Caring for Animals, Supporting Their Owners.”
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Eastern Highlands Veterinary Surgery • Mutare</span>
            </div>
          </div>
        </section>

        {/* Why Choose Us: 6 Core Priorities Grid */}
        <section className="mb-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-vet">
              Our Professional Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
              Why Choose Eastern Highlands Veterinary Surgery?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              We aim to build lasting relationships with animal owners through responsible veterinary care, clinical accountability, and clear communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {priorities.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title}
                  className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3 shadow-xs hover:border-vet/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-vet/10 text-vet flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-zinc-950">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Geographic Service Footprint */}
        <section className="mb-16 p-8 rounded-3xl bg-zinc-950 text-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-emerald-400 tracking-wider">
                Regional Veterinary Network
              </span>
              <h3 className="font-serif font-bold text-2xl text-white">
                Our Geographic Service Footprint
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Mutare, Manicaland Province, Zimbabwe</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="font-bold text-white block">Mutare Central & Suburbs</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Hospital surgery, dental suite, and Shampooch Grooming Spa serving Murambi, Fairbridge Park, Yeovil, and Greenside.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="font-bold text-white block">Vumba Mountain District</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Dedicated ambulatory visits for smallholders, equine stables, and family homesteads in mountain terrain.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="font-bold text-white block">Penhalonga Valley</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Livestock herd vaccinations, tick vector biosecurity, and emergency farm obstetrical call-outs.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="font-bold text-white block">Odzi Agricultural Belt</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Commercial cattle herd fertility, pregnancy diagnosis, breeding soundness, and preventative herd health planning.
              </p>
            </div>
          </div>
        </section>

        {/* Contact & Consultation Booking Banner */}
        <section className="p-8 rounded-3xl bg-emerald-50/80 border-2 border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif font-bold text-2xl text-emerald-950">
              Book a Veterinary Consultation
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed max-w-lg font-normal">
              Your animal's health deserves attention. Contact us to enquire about our services, confirm availability, or coordinate directly on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-800">
              <span className="flex items-center gap-1 font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <span>0771883320</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Mon–Fri 08:00–17:00, Sat 08:30–12:30</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-11 px-6 rounded-xl shadow-md">
              <a 
                href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20would%20like%20to%20enquire%20about%20a%20consultation..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp: 0771883320</span>
              </a>
            </Button>
            <Button asChild variant="outline" className="border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs h-11 px-5 rounded-xl">
              <Link href="/book">Request Appointment Online</Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
