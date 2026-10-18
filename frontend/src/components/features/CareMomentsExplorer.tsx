"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Sparkles, Stethoscope, Smile, ArrowRight, ShieldCheck } from "lucide-react";
import { GentlePawIcon } from "@/components/features/PetMotifs";
import { petPlayfulSpring } from "@/lib/motion";

export function CareMomentsExplorer() {
  const [activeIdx, setActiveIdx] = useState(0);

  // 2.5D Tilt for Spotlight Card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 25 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const moments = [
    {
      id: "greeting",
      title: "The Gentle Hello",
      subtitle: "Eye-level trust before any examination begins",
      image: "/images/dog-golden-smile.webp",
      badge: "Fear-Free Onboarding",
      icon: Smile,
      description: "Before a single medical tool is lifted, we sit on the floor at their level. Positive reinforcement, gentle ear rubs, and patient time to sniff ensure your dog or cat feels secure and loved.",
      tagline: "“A calm dog makes for a gentle, accurate exam.”"
    },
    {
      id: "stethoscope",
      title: "The Reassuring Touch",
      subtitle: "Diagnostic certainty without clinical chill",
      image: "/images/vet-gentle-hands.webp",
      badge: "Gentle Hands Protocol",
      icon: Stethoscope,
      description: "Warm stethoscopes, low-stress positioning, and steady, gentle hands. Whether palpating a delicate abdomen or evaluating joint mobility, your pet is held with constant warmth and reassurance.",
      tagline: "“Healing begins with the hands that hold them.”"
    },
    {
      id: "cat-care",
      title: "Quiet Mountain Felines",
      subtitle: "Calm, pheromone-friendly feline consultations",
      image: "/images/cat-gentle-whisker.webp",
      badge: "Feline-Friendly Zone",
      icon: ShieldCheck,
      description: "Cats experience clinical settings differently. We utilize warm towel wraps, quiet examination alcoves away from canine noise, and slow, respectful handling that honours natural feline boundaries.",
      tagline: "“Quiet environments for tranquil feline care.”"
    },
    {
      id: "bath",
      title: "The Warm Suds Soak",
      subtitle: "Therapeutic hydrotherapy that melts tension",
      image: "/images/dog-bath-bubbles.webp",
      badge: "Botanical Spa Care",
      icon: Sparkles,
      description: "Warm-water hydro-massage with organic oatmeal and aloe botanicals. Gentle bubble baths that lift deep grit, soothe itchy allergic skin, and leave coats impossibly soft and fragrant.",
      tagline: "“Relaxing the body and revitalizing the coat.”"
    },
    {
      id: "reunion",
      title: "The Proud Strut Home",
      subtitle: "The pure joy of that ecstatic lobby reunion",
      image: "/images/dog-reunion-happy.webp",
      badge: "Pure Happiness",
      icon: Heart,
      description: "That ecstatic wagging sprint across our Mutare lobby into your arms. A freshly groomed, healthy, confident companion ready for the weekend walk with their proud head held high.",
      tagline: "“Their happiness is the only metric that matters.”"
    }
  ];

  const current = moments[activeIdx];
  const Icon = current.icon;

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-zinc-200/80 overflow-hidden perspective-stage">
      <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-16 preserve-3d">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-zinc-200">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amberBrand-dark">
              <GentlePawIcon className="w-4 h-4 text-amberBrand" />
              <span>Experiencing Eastern Highlands Care</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-950 tracking-tight">
              The Moments That Make Them Feel Safe.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Explore the five touchpoints of our daily care philosophy. Select a moment below to see how our veterinary and grooming teams prioritize your pet's emotional peace.
            </p>
          </div>

          {/* Interactive Step Navigator */}
          <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto pb-2 md:pb-0 max-w-full">
            {moments.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActiveIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all touch-target flex items-center gap-1.5 whitespace-nowrap ${
                  activeIdx === idx 
                    ? "bg-amberBrand text-white shadow-md font-bold scale-102" 
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
                aria-pressed={activeIdx === idx}
              >
                <span className="font-mono text-[11px] opacity-80">{`0${idx + 1}`}</span>
                <span>{m.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Spatial Spotlight Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center preserve-3d">
          
          {/* Spotlight Visual with 2.5D Mouse Tilt */}
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-6 relative h-[360px] sm:h-[480px] rounded-3xl overflow-hidden border-2 border-amber-200/60 shadow-3d-floating group preserve-3d"
          >
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full h-full relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.95, rotateY: -6 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.03, rotateY: 6 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  
                  {/* Floating Caption Overlay (Z: 30px) */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/70 text-xs shadow-3d-badge">
                    <span className="font-serif italic font-bold text-zinc-900 text-sm block mb-0.5">
                      {current.tagline}
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono mt-1 pt-1 border-t border-zinc-100">
                      <span>Eastern Highlands Patient Philosophy</span>
                      <span className="text-amberBrand font-semibold">Mutare, Zimbabwe</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Spotlight Story Description with Spatial Reveal */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-200 shadow-xs">
                    {current.badge}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Stage {`0${activeIdx + 1}`} of 05</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 leading-tight">
                    {current.title}
                  </h3>
                  <p className="text-sm font-semibold text-amberBrand-dark">
                    {current.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                  {current.description}
                </p>

                <div className="pt-4 flex items-center justify-between gap-4 border-t border-zinc-200">
                  <button 
                    onClick={() => setActiveIdx((prev) => (prev + 1) % moments.length)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amberBrand hover:text-amberBrand-dark transition-colors touch-target"
                  >
                    <span>Next Touchpoint ({moments[(activeIdx + 1) % moments.length].title})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 text-zinc-400">
                    {moments.map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all ${activeIdx === i ? "w-6 bg-amberBrand" : "bg-zinc-200"}`} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
