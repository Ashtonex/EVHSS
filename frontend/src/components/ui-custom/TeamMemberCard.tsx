import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberCardProps {
  name: string;
  role: string;
  imageUrl: string;
  funFact: string;
  isPet?: boolean;
}

export function TeamMemberCard({ name, role, imageUrl, funFact, isPet = false }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-none shadow-md group">
      <div className="relative h-64 w-full">
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isPet && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-shampooch uppercase tracking-wider">
            Mascot
          </div>
        )}
      </div>
      <CardContent className="p-6 bg-white text-center">
        <h3 className="font-serif font-bold text-xl text-evhs-dark mb-1">{name}</h3>
        <p className="text-sm font-semibold text-gold mb-3 uppercase tracking-wider">{role}</p>
        <p className="text-sm text-muted-foreground italic">"{funFact}"</p>
      </CardContent>
    </Card>
  );
}
