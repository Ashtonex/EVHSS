"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Scissors, PlusCircle, Sparkles, Star } from "lucide-react";
import { createNewGroomingRecord } from "./actions";

interface GroomingClientProps {
  initialRecords: any[];
  pets: any[];
}

export default function GroomingClient({ initialRecords, pets = [] }: GroomingClientProps) {
  const [logs, setLogs] = useState(initialRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [selectedPetId, setSelectedPetId] = useState("");
  const [servicesProvided, setServicesProvided] = useState("");
  const [groomerNotes, setGroomerNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateGroomingRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !servicesProvided) {
      setFormError("Please select a pet and enter the services provided.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const result = await createNewGroomingRecord({
        petId: selectedPetId,
        servicesProvided,
        groomerNotes,
      });

      if (result && result.length > 0) {
        const petObj = pets.find((p) => p.id === selectedPetId);

        const newLog = {
          id: result[0].id,
          groomer_id: result[0].groomer_id,
          appointment_date: result[0].appointment_date,
          services_provided: result[0].services_provided,
          groomer_notes: result[0].groomer_notes,
          pets: petObj ? { name: petObj.name, species: petObj.species, breed: petObj.breed } : null,
        };
        setLogs((prev) => [newLog, ...prev]);
        setIsDialogOpen(false);
        // Reset form
        setSelectedPetId("");
        setServicesProvided("");
        setGroomerNotes("");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to create grooming record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark font-serif">Shampooch Grooming Logs</h1>
          <p className="text-muted-foreground mt-1">Track salon grooming appointments, services applied, and stylist logs.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-shampooch hover:bg-shampooch-light text-white rounded-full px-6 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              New Groom Log
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-evhs-dark">New Grooming Log</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroomingRecord} className="space-y-4 pt-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Pet (Patient)</label>
                <select
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-shampooch"
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  required
                >
                  <option value="">Select a Pet...</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} &middot; {p.breed || "Unknown Breed"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Services Applied</label>
                <input
                  type="text"
                  placeholder="e.g. Shampooch Royal Cut, Nail Dremel, Ear Cleaning"
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-shampooch"
                  value={servicesProvided}
                  onChange={(e) => setServicesProvided(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Stylist Notes</label>
                <textarea
                  placeholder="How did the pet behave? Any notable results?"
                  rows={3}
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-shampooch resize-none"
                  value={groomerNotes}
                  onChange={(e) => setGroomerNotes(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-shampooch hover:bg-shampooch-light text-white"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Log"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Salon Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Groomed Today", value: logs.length.toString(), desc: "Pets pampered", icon: Sparkles },
          { label: "Top Service", value: "Shampooch Royal Cut", desc: "45% of orders", icon: Scissors },
          { label: "Customer Rating", value: "4.9 / 5.0", desc: "98 reviews", icon: Star },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-shampooch mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </div>
              <div className="w-12 h-12 bg-shampooch/5 rounded-full flex items-center justify-center text-shampooch">
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Directory & Records List */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-serif">Styling & Spa Records</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by pet or groomer..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white outline-none focus:ring-2 focus:ring-shampooch"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {logs.length > 0 ? (
              logs.map((rec: any) => {
                const formattedDate = rec.appointment_date
                  ? new Date(rec.appointment_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "Unknown Date";
                return (
                  <div key={rec.id} className="p-6 hover:bg-zinc-50 transition-colors flex flex-col md:flex-row md:items-start gap-6">
                    {/* Left: Pet Info */}
                    <div className="md:w-64 shrink-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-shampooch shrink-0" />
                        <span className="font-bold text-evhs-dark text-lg">{rec.pets?.name || "Unknown Patient"}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Species: <span className="font-semibold text-zinc-700">{rec.pets?.species || "Unknown"}</span></p>
                        <p>Breed: <span className="font-semibold text-zinc-700">{rec.pets?.breed || "Unknown"}</span></p>
                      </div>
                    </div>

                    {/* Right: Notes */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs bg-shampooch/5 text-shampooch border-shampooch/20 px-3 py-1 font-medium">
                          Stylist: {rec.groomer_id ? rec.groomer_id.slice(0, 8) : "Unassigned"}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {formattedDate}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Services Applied</span>
                        <p className="text-sm font-semibold text-zinc-800">{rec.services_provided || "No services logged"}</p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Stylist Notes</span>
                        <p className="text-sm text-muted-foreground bg-zinc-50 p-4 rounded-xl border border-zinc-100 italic">
                          "{rec.groomer_notes || "No notes recorded."}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <Scissors className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="font-semibold text-lg text-zinc-800">No grooming records found</p>
                <p className="text-sm mt-1">Create a new groom log to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
