import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-vet-green overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 text-center text-vet-ivory container mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">
            Exceptional Care.<br />
            <span className="text-vet-gold">Premium Grooming.</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto opacity-90">
            Eastern Highlands Veterinary Surgery & Shampooch Dog Grooming Spa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-vet-gold text-vet-green px-8 py-4 rounded-md font-bold hover:bg-yellow-500 transition-colors">
              Book Vet Appointment
            </button>
            <button className="bg-grooming-terracotta text-grooming-warmwhite px-8 py-4 rounded-md font-bold hover:bg-orange-500 transition-colors">
              Book Grooming Spa
            </button>
          </div>
        </div>
      </section>

      {/* Brand Split Section */}
      <section className="grid md:grid-cols-2">
        <div className="bg-vet-ivory p-16 flex flex-col justify-center items-center text-center h-[50vh]">
          <h2 className="font-heading text-4xl text-vet-green mb-4">Veterinary Surgery</h2>
          <p className="text-gray-700 mb-8 max-w-md">
            State-of-the-art medical, surgical, and dental care for your beloved companions.
          </p>
          <a href="/vet" className="text-vet-gold font-bold uppercase tracking-wider hover:underline">Explore Services</a>
        </div>
        
        <div className="bg-grooming-warmwhite p-16 flex flex-col justify-center items-center text-center h-[50vh]">
          <h2 className="font-heading text-4xl text-grooming-teal mb-4">Shampooch Spa</h2>
          <p className="text-gray-700 mb-8 max-w-md">
            Luxury styling, soothing baths, and premium treatments for the ultimate pampering.
          </p>
          <a href="/grooming" className="text-grooming-terracotta font-bold uppercase tracking-wider hover:underline">Explore Grooming</a>
        </div>
      </section>
    </main>
  );
}
