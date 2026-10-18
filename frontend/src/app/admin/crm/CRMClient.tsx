"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserPlus, Mail, Phone, MapPin, PawPrint, Users } from "lucide-react";
import { createNewClient } from "./actions";

interface CRMClientProps {
  initialClients: any[];
}

export default function CRMClient({ initialClients = [] }: CRMClientProps) {
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setFormError("Please provide a phone number.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const result = await createNewClient({ phoneNumber, address });

      if (result && result.length > 0) {
        const created = result[0];
        const newClient = {
          ...created,
          pets: [],
        };
        setClients((prev) => [newClient, ...prev]);
        setIsDialogOpen(false);
        // Reset form
        setPhoneNumber("");
        setAddress("");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to add client.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Logic (cosmetic search bar wired to client-side filtering)
  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const petMatch = (client.pets || []).some((pet: any) => pet.name?.toLowerCase().includes(query));
    return (
      client.phone_number?.toLowerCase().includes(query) ||
      client.address?.toLowerCase().includes(query) ||
      client.id?.toLowerCase().includes(query) ||
      petMatch
    );
  });

  return (
    <>
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark">Client Relationship Manager</h1>
          <p className="text-muted-foreground mt-1">Manage client profiles, contact information, and pet associations.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-evhs hover:bg-evhs-light text-white rounded-full px-6 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-evhs-dark">Add New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4 pt-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</label>
                <input
                  type="text"
                  placeholder="(555) 123-4567"
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Address</label>
                <input
                  type="text"
                  placeholder="123 Sanctuary Way, Neo-Veridia"
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  {submitting ? "Adding..." : "Add Client"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total Clients", value: clients.length.toString(), desc: "Active owners in system", icon: Users },
          { label: "Total Registered Pets", value: clients.reduce((acc, c) => acc + (c.pets?.length || 0), 0).toString(), desc: "Patients in database", icon: PawPrint },
          { label: "New Clients", value: clients.length.toString(), desc: "Live count from CRM", icon: UserPlus },
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

      {/* CRM Main Directory */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-serif">Client & Pet Directory</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients or pets..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white outline-none focus:ring-2 focus:ring-evhs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredClients.length > 0 ? (
              filteredClients.map((client: any) => (
                <div key={client.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-zinc-50 transition-colors">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif font-bold text-lg text-evhs-dark">
                        {client.users?.first_name || client.users?.last_name
                          ? `${client.users?.first_name ?? ""} ${client.users?.last_name ?? ""}`.trim()
                          : `Client ${client.phone_number ?? ""}`}
                      </h3>
                      <Badge variant="secondary" className="bg-evhs/5 text-evhs font-medium text-xs rounded-full">
                        Client ID: {client.id?.substring(0, 8)}
                      </Badge>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gold" />
                        <span>{client.users?.email || "No email on file"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gold" />
                        <span>{client.phone_number || "No Phone"}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-1 sm:col-span-1">
                        <MapPin className="w-4 h-4 text-gold shrink-0" />
                        <span className="truncate">{client.address || "No Address"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pets List */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100 lg:w-96">
                    <div className="flex items-center gap-2 shrink-0">
                      <PawPrint className="w-5 h-5 text-evhs" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pets ({client.pets?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {client.pets && client.pets.length > 0 ? (
                        client.pets.map((pet: any) => (
                          <Badge key={pet.id} className="bg-white border border-border text-zinc-700 hover:bg-zinc-100 font-normal px-2.5 py-1">
                            {pet.name} <span className="text-xs text-muted-foreground ml-1">({pet.species})</span>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No registered pets</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="font-semibold text-lg text-zinc-800">No clients found</p>
                <p className="text-sm mt-1">Try adjusting your search or add a new client.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
