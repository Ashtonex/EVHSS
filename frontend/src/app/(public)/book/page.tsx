"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Send, 
  RefreshCw,
  Phone,
  MessageSquare,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

type BookingStatus = "draft" | "sending" | "received" | "error";

function BookingContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams?.get("type") === "spa" ? "spa" : "vet";

  const [department, setDepartment] = useState<"vet" | "spa">(initialType);
  const [initialReason, setInitialReason] = useState<string>(searchParams?.get("package") || "");
  const [status, setStatus] = useState<BookingStatus>("draft");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submittedData, setSubmittedData] = useState<any>(null);

  useEffect(() => {
    const typeParam = searchParams?.get("type");
    if (typeParam === "spa" || typeParam === "vet") {
      setDepartment(typeParam);
    }
    const pkgParam = searchParams?.get("package");
    if (pkgParam) {
      setInitialReason(pkgParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      type: department,
      owner_name: (formData.get("owner_name") as string)?.trim(),
      phone_number: (formData.get("phone_number") as string)?.trim(),
      pet_name: (formData.get("pet_name") as string)?.trim(),
      species: (formData.get("species") as string)?.trim() || undefined,
      breed: (formData.get("breed") as string)?.trim() || undefined,
      reason: (formData.get("reason") as string)?.trim(),
      address: (formData.get("address") as string)?.trim() || undefined,
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setSubmittedData({ ...payload, id: result.id || `REQ-${Date.now().toString().slice(-5)}` });
        setStatus("received");
      } else {
        const err = await res.json().catch(() => ({}));
        setSubmittedData(payload);
        setErrorMessage(err.message || "Unable to send appointment request right now.");
        setStatus("error");
      }
    } catch (networkError: any) {
      setSubmittedData(payload);
      setErrorMessage("Network connection timed out. You may retry or contact us directly via WhatsApp.");
      setStatus("error");
    }
  };

  const handleWhatsAppFallback = () => {
    if (!submittedData) return;
    const text = encodeURIComponent(
      `Hello Eastern Highlands Veterinary & Shampooch Spa,\n\nI would like to request an appointment:\n- Department: ${submittedData.type === "vet" ? "Veterinary Clinical" : "Shampooch Grooming"}\n- Owner: ${submittedData.owner_name}\n- Phone: ${submittedData.phone_number}\n- Animal Name: ${submittedData.pet_name} (${submittedData.species || "Pet"})\n- Reason: ${submittedData.reason}\n\nPlease let me know your available slots.`
    );
    window.open(`https://wa.me/263771883320?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen py-10 md:py-16 bg-zinc-50/60">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        
        {/* Header Section */}
        <header className="text-center mb-8 space-y-2">
          <Badge variant="outline" className="text-zinc-600 border-zinc-200 bg-white text-xs px-3 py-0.5">
            Mutare Practice Intake
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
            Request an Appointment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
            Submit your care request online. Our team reviews doctor and groomer availability and contacts you to finalize a confirmed time.
          </p>
        </header>

        {/* STATUS: REQUEST RECEIVED STATE */}
        {status === "received" && submittedData && (
          <Card className="rounded-2xl border-emerald-200 bg-white shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-emerald-50/70 border-b border-emerald-100 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-serif font-bold text-lg text-emerald-950">
                  Appointment Request Received
                </h2>
                <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                  Reference: <span className="font-mono font-bold">{submittedData.id}</span>
                </p>
              </div>
            </div>

            <CardContent className="p-6 space-y-4 text-xs text-zinc-600">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="font-semibold text-zinc-800 uppercase tracking-wider text-[11px] block">
                  Request Summary
                </span>
                <div className="grid grid-cols-2 gap-2 text-zinc-700">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Department</span>
                    <span className="font-medium capitalize">{submittedData.type === "vet" ? "Veterinary Surgery" : "Shampooch Grooming"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Patient</span>
                    <span className="font-medium">{submittedData.pet_name} {submittedData.species ? `(${submittedData.species})` : ""}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Client Contact</span>
                    <span className="font-medium">{submittedData.owner_name} • {submittedData.phone_number}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Reason for Visit</span>
                    <span className="font-medium line-clamp-1">{submittedData.reason}</span>
                  </div>
                </div>
              </div>

              {/* Crucial Truth & Safety Explanation */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>What Happens Next?</span>
                </div>
                <p className="text-blue-900/90 leading-relaxed text-[11px]">
                  <strong>This request is not yet a confirmed appointment.</strong> Our clinic coordinator will review schedule availability in Mutare and call or text you directly to confirm your arrival time or ambulatory farm visit window.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleWhatsAppFallback}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 rounded-xl font-semibold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Confirmation to WhatsApp (0771883320)</span>
                </Button>
                <Button
                  onClick={() => {
                    setStatus("draft");
                    setSubmittedData(null);
                  }}
                  variant="outline"
                  className="w-full text-xs h-10 rounded-xl"
                >
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STATUS: ERROR / NEEDS ATTENTION STATE */}
        {status === "error" && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-xs text-amber-900">Connection or Transmission Issue</h3>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">{errorMessage}</p>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap gap-2">
              <Button
                onClick={() => setStatus("draft")}
                size="sm"
                variant="outline"
                className="bg-white border-amber-300 text-amber-900 text-xs h-9 rounded-lg"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                <span>Return to Form</span>
              </Button>
              <Button
                onClick={handleWhatsAppFallback}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 rounded-lg font-medium shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                <span>Send via WhatsApp (0771883320)</span>
              </Button>
            </div>
          </div>
        )}

        {/* STATUS: DRAFT FORM STATE */}
        {status !== "received" && (
          <>
            {/* Direct WhatsApp Fast-Track Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-950 font-medium">
                <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                <span><strong>Fast Track:</strong> Prefer booking directly via WhatsApp at <strong>0771883320</strong>?</span>
              </div>
              <a
                href="https://wa.me/263771883320?text=Hello%20Eastern%20Highlands%20Veterinary%20Surgery%20team,%20I%20would%20like%20to%20request%20an%20appointment..."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-800 hover:text-emerald-950 underline whitespace-nowrap text-xs"
              >
                Open WhatsApp Chat →
              </a>
            </div>

            <Card className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden">
            
            {/* Department Toggle Tabs */}
            <div className="p-2 bg-zinc-100/70 border-b border-zinc-200">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDepartment("vet")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all touch-target",
                    department === "vet"
                      ? "bg-vet text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-white/50"
                  )}
                  aria-pressed={department === "vet"}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Veterinary Clinic</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDepartment("spa")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all touch-target",
                    department === "spa"
                      ? "bg-amberBrand text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-white/50"
                  )}
                  aria-pressed={department === "spa"}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Shampooch Grooming</span>
                </button>
              </div>
            </div>

            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Section 1: Patient / Animal Info */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 block">
                    1. Animal Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700">Animal / Pet Name *</label>
                      <Input
                        required
                        name="pet_name"
                        placeholder="e.g. Buster or Herd ID"
                        className="rounded-xl text-xs h-10"
                        defaultValue={submittedData?.pet_name}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700">Species *</label>
                      <select
                        name="species"
                        required
                        className="flex h-10 w-full rounded-xl border border-input bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        defaultValue={submittedData?.species || (department === "spa" ? "Canine (Dog)" : "Canine (Dog)")}
                      >
                        <option value="Canine (Dog)">Canine (Dog)</option>
                        <option value="Feline (Cat)">Feline (Cat)</option>
                        <option value="Bovine (Cattle)">Bovine (Cattle)</option>
                        <option value="Caprine (Goat)">Caprine (Goat)</option>
                        <option value="Ovine (Sheep)">Ovine (Sheep)</option>
                        <option value="Equine (Horse)">Equine (Horse)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700">Breed or Cross (Optional)</label>
                    <Input
                      name="breed"
                      placeholder="e.g. Boerboel, Brahman cross, DSH"
                      className="rounded-xl text-xs h-10"
                      defaultValue={submittedData?.breed}
                    />
                  </div>
                </div>

                {/* Section 2: Clinical or Spa Need */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 block">
                    2. Service Requirement
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700">Reason for Request *</label>
                    <Input
                      required
                      name="reason"
                      placeholder={
                        department === "vet"
                          ? "e.g. Annual vaccination, limping left hind, farm pregnancy diagnosis"
                          : "e.g. Full groom and de-shedding, bath & hygiene trim"
                      }
                      className="rounded-xl text-xs h-10"
                      defaultValue={submittedData?.reason || initialReason}
                    />
                  </div>
                </div>

                {/* Section 3: Client Contact Details */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 block">
                    3. Your Contact Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700">Full Name *</label>
                      <Input
                        required
                        name="owner_name"
                        placeholder="e.g. Farai Moyo"
                        className="rounded-xl text-xs h-10"
                        defaultValue={submittedData?.owner_name}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700">Phone / WhatsApp Number *</label>
                      <Input
                        required
                        type="tel"
                        name="phone_number"
                        placeholder="e.g. +263 77 123 4567"
                        className="rounded-xl text-xs h-10 font-mono"
                        defaultValue={submittedData?.phone_number}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700">
                      Location / Farm Area (Optional)
                    </label>
                    <Input
                      name="address"
                      placeholder="e.g. Murambi, Fairbridge Park, Vumba Rd, Penhalonga"
                      className="rounded-xl text-xs h-10"
                      defaultValue={submittedData?.address}
                    />
                  </div>
                </div>

                {/* Emergency Notice */}
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-[11px] flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    For life-threatening emergencies (acute trauma, poisoning, snakebite, GDV bloat), do not wait for a web form response. Proceed to our <a href="/contact#emergency" className="text-red-700 font-semibold underline">Urgent Care Protocols</a> immediately.
                  </span>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className={cn(
                      "w-full h-11 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors",
                      department === "vet"
                        ? "bg-vet hover:bg-vet-light"
                        : "bg-amberBrand hover:bg-amberBrand-dark"
                    )}
                  >
                    {status === "sending" ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Care Request...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Appointment Request</span>
                      </span>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </>
        )}

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 px-4 max-w-3xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            <span>Loading appointment scheduler...</span>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}

