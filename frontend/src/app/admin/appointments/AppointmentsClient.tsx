"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon, Clock, PawPrint, User, CheckCircle2, 
  XCircle, Filter, Search, PlusCircle, ArrowUpDown, ChevronDown
} from "lucide-react";
import { updateAppointmentStatus, createNewAppointment } from "./actions";

interface AppointmentsClientProps {
  initialAppointments: any[];
  clients: any[];
  pets: any[];
}

export default function AppointmentsClient({ 
  initialAppointments, 
  clients = [], 
  pets = [] 
}: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filterType, setFilterType] = useState<"all" | "vet" | "grooming">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedPetId, setSelectedPetId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Handle client select change and filter corresponding pets
  const filteredPetsForSelect = selectedClientId 
    ? pets.filter(p => p.client_id === selectedClientId)
    : pets;

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoading(id);
    try {
      await updateAppointmentStatus(id, newStatus);
      // Update local state
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
      );
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !selectedPetId || !appointmentDate || !reason) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const result = await createNewAppointment({
        clientId: selectedClientId,
        petId: selectedPetId,
        date: appointmentDate,
        reason,
        status
      });

      if (result && result.length > 0) {
        const clientObj = clients.find(c => c.id === selectedClientId);
        const petObj = pets.find(p => p.id === selectedPetId);

        const newApt = {
          id: result[0].id,
          appointment_date: result[0].appointment_date,
          status: result[0].status,
          reason: result[0].reason,
          pets: petObj ? { name: petObj.name, species: petObj.species, breed: petObj.breed } : { name: "Unknown Pet" },
          clients: clientObj ? { 
            phone_number: clientObj.phone_number, 
            users: { 
              first_name: clientObj.users?.first_name || "Unknown", 
              last_name: clientObj.users?.last_name || "Client" 
            } 
          } : null
        };
        setAppointments(prev => [newApt, ...prev]);
        setIsDialogOpen(false);
        // Reset form
        setSelectedClientId("");
        setSelectedPetId("");
        setAppointmentDate("");
        setReason("");
        setStatus("scheduled");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to create appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Logic
  const filteredAppointments = appointments.filter(apt => {
    const isGrooming = apt.reason?.toLowerCase().includes("groom");
    const matchesType = 
      filterType === "all" || 
      (filterType === "grooming" && isGrooming) || 
      (filterType === "vet" && !isGrooming);

    const matchesStatus = 
      filterStatus === "all" || 
      apt.status === filterStatus;

    const petName = apt.pets?.name?.toLowerCase() || "";
    const breed = apt.pets?.breed?.toLowerCase() || "";
    const clientName = `${apt.clients?.users?.first_name || ""} ${apt.clients?.users?.last_name || ""}`.toLowerCase();
    const reasonText = apt.reason?.toLowerCase() || "";
    const matchesSearch = 
      searchQuery === "" || 
      petName.includes(searchQuery.toLowerCase()) ||
      breed.includes(searchQuery.toLowerCase()) ||
      clientName.includes(searchQuery.toLowerCase()) ||
      reasonText.includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  // Group by day
  const groupedSchedule = filteredAppointments.reduce((acc: any, apt: any) => {
    const date = new Date(apt.appointment_date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(apt);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark">Weekly Schedule</h1>
          <p className="text-muted-foreground mt-1">Manage veterinary and grooming appointments.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-evhs hover:bg-evhs-light text-white rounded-full px-6 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              + New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-evhs-dark">Create New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAppointment} className="space-y-4 pt-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Client (Owner)</label>
                <select 
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={selectedClientId} 
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setSelectedPetId(""); // Reset pet when client changes
                  }}
                  required
                >
                  <option value="">Select a Client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.users?.first_name} {c.users?.last_name} ({c.phone_number || "No Phone"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Pet (Patient)</label>
                <select 
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs disabled:opacity-50"
                  value={selectedPetId} 
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  disabled={!selectedClientId}
                  required
                >
                  <option value="">Select a Pet...</option>
                  {filteredPetsForSelect.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} &middot; {p.breed || "Unknown Breed"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Reason / Service</label>
                <input 
                  type="text" 
                  placeholder="e.g. Annual Vaccination / Grooming Full Service"
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Status</label>
                <select 
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                  {submitting ? "Creating..." : "Create Appointment"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Interactive Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by pet name, breed, or owner..." 
            className="pl-10 rounded-full border-zinc-200 focus-visible:ring-evhs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Service Type Filter */}
          <div className="flex bg-zinc-100 p-1 rounded-full text-xs font-medium">
            <button 
              onClick={() => setFilterType("all")}
              className={`px-4 py-1.5 rounded-full transition-colors ${filterType === "all" ? "bg-white text-evhs-dark shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              All Services
            </button>
            <button 
              onClick={() => setFilterType("vet")}
              className={`px-4 py-1.5 rounded-full transition-colors ${filterType === "vet" ? "bg-white text-evhs shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Veterinary
            </button>
            <button 
              onClick={() => setFilterType("grooming")}
              className={`px-4 py-1.5 rounded-full transition-colors ${filterType === "grooming" ? "bg-white text-shampooch shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Shampooch Grooming
            </button>
          </div>

          {/* Status Filter */}
          <select 
            className="text-xs bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 font-medium focus:ring-1 focus:ring-evhs outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List grouped by Day */}
      <div className="space-y-8">
        {Object.keys(groupedSchedule).length > 0 ? (
          Object.entries(groupedSchedule).map(([date, apts]: [string, any]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <CalendarIcon className="w-4 h-4 text-gold" />
                <h2 className="text-lg font-serif font-bold text-evhs-dark">{date}</h2>
                <div className="flex-1 h-px bg-border/50 ml-4"></div>
              </div>

              <div className="space-y-3">
                {apts.map((apt: any) => {
                  const time = new Date(apt.appointment_date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  });
                  const isGrooming = apt.reason?.toLowerCase().includes('groom');
                  const isActionLoading = loading === apt.id;

                  return (
                    <Card key={apt.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* Time & Status Column */}
                        <div className={`sm:w-44 p-5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-border/50 ${isGrooming ? 'bg-shampooch/5' : 'bg-evhs/5'}`}>
                          <div className="flex items-center gap-2 font-bold text-base text-foreground mb-1.5">
                            <Clock className="w-4 h-4 opacity-50" />
                            {time}
                          </div>
                          <Badge variant="outline" className={`w-fit uppercase tracking-wider text-[9px] ${
                            apt.status === 'completed' ? 'border-green-500 text-green-600 bg-green-50' : 
                            apt.status === 'cancelled' ? 'border-red-500 text-red-600 bg-red-50' : 
                            'border-gold text-gold-dark bg-gold/5'
                          }`}>
                            {apt.status}
                          </Badge>
                        </div>

                        {/* Details Column */}
                        <div className="flex-1 p-5 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <PawPrint className={`w-4 h-4 ${isGrooming ? 'text-shampooch' : 'text-evhs'}`} />
                            <h3 className="font-bold text-base">
                              {apt.pets?.name || "Unknown Pet"} 
                              <span className="text-muted-foreground font-normal text-xs ml-2">
                                ({apt.pets?.breed || "Unknown Breed"})
                              </span>
                            </h3>
                          </div>
                          <p className="text-muted-foreground text-sm font-medium">{apt.reason}</p>
                        </div>

                        {/* Client Column */}
                        <div className="sm:w-60 p-5 flex flex-col justify-center bg-zinc-50 border-t sm:border-t-0 sm:border-l border-border/50">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-xs">
                              {apt.clients?.users?.first_name} {apt.clients?.users?.last_name}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground ml-6">{apt.clients?.phone_number || "No Phone Number"}</p>
                        </div>

                        {/* Actions */}
                        <div className="p-4 flex sm:flex-col items-center justify-center gap-2 bg-zinc-50 border-t sm:border-t-0 sm:border-l border-border/50">
                          {apt.status === 'scheduled' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full" 
                                title="Mark Completed"
                                onClick={() => handleStatusUpdate(apt.id, 'completed')}
                                disabled={isActionLoading}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full" 
                                title="Cancel Appointment"
                                onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                                disabled={isActionLoading}
                              >
                                <XCircle className="w-5 h-5" />
                              </Button>
                            </>
                          )}
                          {apt.status !== 'scheduled' && (
                            <span className="text-xs text-muted-foreground italic px-2">Finalized</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center text-muted-foreground rounded-2xl border border-dashed border-zinc-200">
            <CalendarIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="font-semibold text-lg text-zinc-800">No appointments found</p>
            <p className="text-sm mt-1">Try adjusting your filters or create a new appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
