"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  ShieldAlert,
  Phone,
  MessageCircle,
  HelpCircle,
  Stethoscope,
  HeartPulse,
  Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Header */}
        <header className="text-center mb-12 space-y-2">
          <Badge variant="outline" className="text-vet border-vet/30 bg-vet/5 text-xs px-3 py-0.5">
            Eastern Highlands Veterinary Surgery • Mutare, Zimbabwe
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950">
            Contact & Clinical Triage
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Reach our veterinary and grooming coordination team in Mutare. For immediate queries or appointments, message our desk directly on WhatsApp at <strong>0771883320</strong>.
          </p>
        </header>

        {/* 1. CRITICAL EMERGENCY PROTOCOL STRIP */}
        <div id="emergency" className="mb-14 p-6 sm:p-8 rounded-3xl bg-red-50/80 border-2 border-red-200 text-red-950 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-red-900">
                  Acute Emergency & Clinical Triage Guidance
                </h2>
                <p className="text-xs text-red-800 leading-relaxed mt-0.5">
                  If your animal shows severe distress, immediate veterinary assessment is critical. Do not wait for an electronic message reply.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl h-10 px-5 shrink-0 shadow-md"
            >
              <a href="https://wa.me/263771883320?text=EMERGENCY:%20My%20animal%20requires%20urgent%20veterinary%20attention...">
                Emergency WhatsApp: 0771883320
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-white border border-red-200 space-y-1.5 text-xs shadow-xs">
              <span className="font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Difficulty Breathing & Collapse</span>
              </span>
              <p className="text-zinc-600 leading-relaxed text-[11px]">
                Rapid, shallow breathing, open-mouth panting in cats, blue-tinged gums, or sudden collapse requires immediate oxygen support and clinical triage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-red-200 space-y-1.5 text-xs shadow-xs">
              <span className="font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Suspected Poisoning or Snakebite</span>
              </span>
              <p className="text-zinc-600 leading-relaxed text-[11px]">
                Salivation, muscle tremors, severe vomiting, or sudden swelling. Keep the animal strictly immobilized and bring any packaging/plant material if known.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-red-200 space-y-1.5 text-xs shadow-xs">
              <span className="font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Difficulty Giving Birth (Dystocia)</span>
              </span>
              <p className="text-zinc-600 leading-relaxed text-[11px]">
                Strong contractions exceeding 30–60 minutes without delivery in dogs/cats, or over 2 hours in cattle/goats, requires prompt obstetrical assistance.
              </p>
            </div>
          </div>
        </div>

        {/* 2. PRACTICE DETAILS & INQUIRY FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Practice Details (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-emerald-50/60 to-white border-2 border-emerald-300 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-semibold uppercase text-emerald-800 tracking-wider block">
                    Direct Coordination
                  </span>
                  <span className="font-serif font-bold text-lg text-emerald-950 block">
                    WhatsApp: 0771883320
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-900 leading-relaxed">
                Our front desk and veterinary coordination team actively monitor WhatsApp during standard practice hours for appointments, prescription refills, and client questions.
              </p>

              <a
                href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20would%20like%20to%20enquire%20about..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Message 0771883320 on WhatsApp</span>
              </a>
            </div>

            {/* General Practice Coordinates */}
            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-5">
              <h3 className="font-serif font-bold text-lg text-zinc-950">Practice Location & Scheduling</h3>
              
              <div className="space-y-4 text-xs text-zinc-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-vet shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Location: Mutare, Zimbabwe</span>
                    <span>Centrally based in Mutare, serving companion pets across urban suburbs and coordinating ambulatory field visits across Manicaland Province.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-vet shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Telephone & WhatsApp</span>
                    <span className="font-mono font-bold text-zinc-800">0771883320</span>
                    <span className="block text-[11px] text-zinc-500 mt-0.5">International: +263 77 188 3320</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-vet shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Opening Hours</span>
                    <span>Monday to Friday: 08:00 – 17:00</span>
                    <span className="block">Saturday: 08:30 – 12:30</span>
                    <span className="block text-zinc-500 text-[11px] mt-0.5">Ambulatory farm visits & emergency arrangements by coordination.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Stethoscope className="w-4 h-4 text-vet shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Departments Under One Roof</span>
                    <span>Veterinary Clinic: Clinical medicine, surgery, diagnostics, preventive vaccines, farm calls.</span>
                    <span className="block mt-0.5 text-amberBrand-dark">Shampooch Spa: Boutique hygiene bathing, coat conditioning, breed haircuts.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 text-[11px] text-zinc-500">
                <span>To ensure dedicated attention for every animal, clinical consultations and grooming appointments are arranged in advance.</span>
              </div>
            </div>

          </div>

          {/* Contact Inquiry Form (Right Column) */}
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border border-zinc-200 bg-white shadow-xs">
              <CardHeader className="p-6 pb-4 border-b border-zinc-100">
                <CardTitle className="font-serif text-xl font-bold text-zinc-950">
                  Send a General Practice Message
                </CardTitle>
                <p className="text-xs text-zinc-500">
                  Our front-desk team typically reviews and responds within one business day.
                </p>
              </CardHeader>

              <CardContent className="p-6">
                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h3 className="font-serif font-bold text-base text-emerald-950">Message Sent Successfully</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                      Thank you for contacting Eastern Highlands Veterinary Surgery. A member of our clinical team will review your inquiry and reach back out shortly.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs h-9 rounded-xl border-emerald-300 text-emerald-900"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700">Your Name *</label>
                        <Input required placeholder="e.g. Tendai Chikore" className="rounded-xl text-xs h-10" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700">Phone or WhatsApp Number *</label>
                        <Input required type="tel" placeholder="0771883320 or your mobile" className="rounded-xl text-xs h-10 font-mono" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700">Email Address (Optional)</label>
                      <Input type="email" placeholder="name@domain.com" className="rounded-xl text-xs h-10" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700">Department / Animal Type</label>
                      <select className="flex h-10 w-full rounded-xl border border-input bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <option>Veterinary Surgery (Companion Animals)</option>
                        <option>Livestock & Farm Ambulatory Visit (Cattle, Goats, Sheep, Poultry, Pigs)</option>
                        <option>Shampooch Grooming Spa</option>
                        <option>General Administration & Advice</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700">Your Inquiry or Question *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Please describe your question or requirements..."
                        className="flex w-full rounded-xl border border-input bg-white p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSending}
                      className="w-full bg-vet hover:bg-vet-light text-white text-xs font-semibold h-11 rounded-xl shadow-sm"
                    >
                      {isSending ? "Transmitting..." : "Send Practice Inquiry"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
