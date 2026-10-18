"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Clock, PlusCircle, Users, Briefcase, Calendar } from "lucide-react";
import { createNewShift } from "./actions";

interface StaffClientProps {
  initialRoster: any[];
  staffProfiles: any[];
}

export default function StaffClient({ initialRoster, staffProfiles = [] }: StaffClientProps) {
  const [roster, setRoster] = useState(initialRoster);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !shiftStart || !shiftEnd) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const result = await createNewShift({
        staffId: selectedStaffId,
        shiftStart,
        shiftEnd,
      });

      if (result && result.length > 0) {
        const profile = staffProfiles.find((p) => p.id === selectedStaffId);
        const newShift = {
          id: result[0].id,
          staff_id: result[0].staff_id,
          shift_start: result[0].shift_start,
          shift_end: result[0].shift_end,
          staff_profiles: profile
            ? { job_title: profile.job_title, user_id: profile.user_id }
            : null,
        };
        setRoster((prev) =>
          [...prev, newShift].sort(
            (a, b) => new Date(a.shift_start).getTime() - new Date(b.shift_start).getTime(),
          ),
        );
        setIsDialogOpen(false);
        // Reset form
        setSelectedStaffId("");
        setShiftStart("");
        setShiftEnd("");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to assign shift.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoster = roster.filter((shift) => {
    if (!searchQuery) return true;
    const jobTitle = shift.staff_profiles?.job_title?.toLowerCase() || "";
    const staffId = shift.staff_id?.toLowerCase() || "";
    return jobTitle.includes(searchQuery.toLowerCase()) || staffId.includes(searchQuery.toLowerCase());
  });

  const uniqueRoles = new Set(
    roster.map((shift) => shift.staff_profiles?.job_title).filter(Boolean),
  );

  return (
    <>
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark font-serif">Staff Roster & Scheduling</h1>
          <p className="text-muted-foreground mt-1">Manage staff timetables, job roles, working shifts, and clinic check-ins.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-evhs hover:bg-evhs-light text-white rounded-full px-6 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Assign Shift
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-evhs-dark">Assign Shift</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateShift} className="space-y-4 pt-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Staff Member</label>
                <select
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  required
                >
                  <option value="">Select a Staff Member...</option>
                  {staffProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.job_title || "Staff"} (ID: {p.user_id?.slice(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Shift Start</label>
                <input
                  type="datetime-local"
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Shift End</label>
                <input
                  type="datetime-local"
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
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
                  {submitting ? "Assigning..." : "Assign Shift"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Staff Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Active Staff Today", value: roster.length.toString(), desc: "Checked-in practitioners", icon: Users },
          { label: "Clinic Hours Today", value: "08:00 - 19:00", desc: "Open hours", icon: Clock },
          { label: "Covered Roles", value: uniqueRoles.size.toString(), desc: "Distinct job roles scheduled", icon: Briefcase },
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

      {/* Calendar Shifts Directory */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-serif">Shift Schedule Board</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search staff schedules..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white outline-none focus:ring-2 focus:ring-evhs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredRoster.length > 0 ? (
              filteredRoster.map((shift: any) => {
                const start = new Date(shift.shift_start);
                const end = new Date(shift.shift_end);
                const formattedDate = start.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                });
                const timeRange = `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

                return (
                  <div key={shift.id} className="p-6 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-evhs/10 text-evhs flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-evhs-dark text-base">
                          {shift.staff_profiles?.job_title || "Unassigned Role"}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          Staff ID: {shift.staff_profiles?.user_id?.slice(0, 8) || shift.staff_id?.slice(0, 8) || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right sm:text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                          <Calendar className="w-4 h-4 text-gold shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{timeRange}</p>
                      </div>
                      <Badge className="bg-white border border-green-500 text-green-600 uppercase tracking-widest text-[9px]">
                        Confirmed
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <Clock className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="font-semibold text-lg text-zinc-800">No shifts found</p>
                <p className="text-sm mt-1">Try adjusting your search or assign a new shift.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
