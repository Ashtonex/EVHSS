import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface DualBrandCardProps {
  title: string;
  description: string;
  brand: "evhs" | "shampooch";
  href: string;
  imageUrl: string;
}

export function DualBrandCard({ title, description, brand, href, imageUrl }: DualBrandCardProps) {
  const isEvhs = brand === "evhs";

  return (
    <Link href={href} className="group relative block overflow-hidden rounded-3xl shadow-lg transition-transform hover:-translate-y-2 h-[400px]">
      <Image 
        src={imageUrl} 
        alt={title} 
        fill 
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className={cn(
        "absolute inset-0 transition-opacity",
        isEvhs ? "bg-evhs/60 group-hover:bg-evhs/70" : "bg-shampooch/60 group-hover:bg-shampooch/70"
      )} />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <div className="mb-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl bg-white/20 backdrop-blur-md"
          )}>
            {isEvhs ? "✚" : "✨"}
          </div>
          <h3 className="font-serif text-3xl font-bold mb-2">{title}</h3>
          <p className="opacity-90 max-w-sm">{description}</p>
        </div>
        
        <div className="flex items-center gap-2 font-semibold uppercase tracking-widest text-sm">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
}
