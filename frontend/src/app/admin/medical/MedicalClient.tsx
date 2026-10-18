"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Stethoscope, PlusCircle, Activity, FileText, User, Syringe } from "lucide-react";
import { createNewMedicalRecord } from "./actions";

interface MedicalClientProps {
  initialRecords: any[];
  pets: any[];
  vaccinations: any[];
  consultingVetCount: number;
}

export default function MedicalClient({
  initialRecords,
  pets = [],
  vaccinations = [],
  consultingVetCount,
}: MedicalClientProps) {
  const [records, setRecords] = useState(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedPetId, setSelectedPetId] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !notes) {
      setFormError("Please select a pet and enter notes.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const result = await createNewMedicalRecord({
        petId: selectedPetId,
        notes,
      });

      if (result && result.length > 0) {
        const petObj = pets.find((p) => p.id === selectedPetId);
        const newRecord = {
          id: result[0].id,
          notes: result[0].notes,
          created_at: result[0].created_at || new Date().toISOString(),
          vet_id: result[0].vet_id,
          pet_id: result[0].pet_id,
          pets: petObj
            ? { name: petObj.name, species: petObj.species, breed: petObj.breed, date_of_birth: petObj.date_of_birth }
            : { name: "Unknown Patient" },
        };
        setRecords((prev) => [newRecord, ...prev]);
        setIsDialogOpen(false);
        setSelectedPetId("");
        setNotes("");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to create medical record.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter((rec) => {
    if (!searchQuery) return true;
    const petName = rec.pets?.name?.toLowerCase() || "";
    const breed = rec.pets?.breed?.toLowerCase() || "";
    const notesText = rec.notes?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    return petName.includes(q) || breed.includes(q) || notesText.includes(q);
  });

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark font-serif">Clinical Medical Records</h1>
          <p className="text-muted-foreground mt-1">Access, update, and search patients' clinical history and treatment files.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-evhs hover:bg-evhs-light text-white rounded-full px-6 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              New Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-evhs-dark">Create Medical Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRecord} className="space-y-4 pt-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Pet (Patient)</label>
                <select
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
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
                <label className="text-xs font-semibold text-muted-foreground uppercase">Clinical Notes</label>
                <textarea
                  placeholder="Diagnosis, treatment administered, follow-up instructions..."
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs min-h-[120px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
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
                  className="bg-evhs hover:bg-evhs-light text-white"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Create Record"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Active Treatments", value: "8", desc: "Monitored patients", icon: Activity },
          { label: "Total Record Files", value: records.length.toString(), desc: "Stored entries", icon: FileText },
          { label: "Consulting Vets", value: consultingVetCount.toString(), desc: "On duty roster", icon: Stethoscope },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-evhs-dark mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </div>
              <div className="w-12 h-12 bg-evhs/5 rounded-full flex items-center justify-center text-evhs">
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Directory & Records List */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-serif">Treatment Log & Histories</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by pet name..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white outline-none focus:ring-2 focus:ring-evhs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((rec: any) => {
                const formattedDate = new Date(rec.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={rec.id} className="p-6 hover:bg-zinc-50 transition-colors flex flex-col md:flex-row md:items-start gap-6">
                    {/* Left: Pet Info */}
                    <div className="md:w-64 shrink-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-evhs shrink-0" />
                        <span className="font-bold text-evhs-dark text-lg">{rec.pets?.name || "Unknown Patient"}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Species: <span className="font-semibold text-zinc-700">{rec.pets?.species || "Unknown"}</span></p>
                        <p>Breed: <span className="font-semibold text-zinc-700">{rec.pets?.breed || "Unknown"}</span></p>
                        <p>DOB: <span className="font-semibold text-zinc-700">{rec.pets?.date_of_birth || "Unknown"}</span></p>
                      </div>
                    </div>

                    {/* Right: Notes */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="w-3.5 h-3.5" />
                          <span>
                            Attending Staff:{" "}
                            <strong>{rec.vet_id ? rec.vet_id.slice(0, 8) : "Unassigned"}</strong>
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-zinc-100 text-zinc-600 border-zinc-200">
                          {formattedDate}
                        </Badge>
                      </div>
                      <div className="text-sm text-zinc-800 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        {rec.notes}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="font-semibold text-lg text-zinc-800">No medical records found</p>
                <p className="text-sm mt-1">Try adjusting your search or create a new record.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vaccinations */}
      {vaccinations.length > 0 && (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 bg-zinc-50 border-b border-border/55">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Syringe className="w-4 h-4 text-evhs" />
              Vaccination Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {vaccinations.map((vac: any) => (
                <div key={vac.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-evhs-dark">{vac.pets?.name || "Unknown Patient"}</span>
                    <span className="text-muted-foreground text-sm ml-2">&middot; {vac.vaccine_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Administered: {vac.date_administered ? new Date(vac.date_administered).toLocaleDateString() : "Unknown"}</span>
                    {vac.next_due_date && (
                      <Badge variant="outline" className="text-[10px] bg-gold/5 border-gold text-gold-dark">
                        Next due {new Date(vac.next_due_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
