"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-32 bg-ivory">
      
      <div className="relative w-64 h-64 mb-8">
        {/* Simplified fallback for the custom illustration requested */}
        <div className="absolute inset-0 bg-evhs/10 rounded-full flex flex-col items-center justify-center">
          <div className="text-6xl flex gap-4">
            <span title="Biscuit looking confused">🐕❓</span>
            <span title="Mochi sitting on a sign">🐈🛑</span>
          </div>
        </div>
      </div>
      
      <h1 className="text-5xl font-serif font-bold text-evhs-dark mb-6">
        Ruh-roh! You seem lost.
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-10 text-balance leading-relaxed">
        Biscuit is looking confused, and Mochi is sitting on the map. We couldn't find the page you were looking for!
      </p>
      
      <div className="flex gap-4">
        <Button asChild size="lg" className="rounded-full bg-evhs hover:bg-evhs-light text-white px-8 h-14">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
