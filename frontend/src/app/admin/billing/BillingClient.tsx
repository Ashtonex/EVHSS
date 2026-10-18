"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, FileText, PlusCircle, CreditCard, DollarSign, Award, Calendar } from "lucide-react";
import { createNewInvoice } from "./actions";

interface BillingClientProps {
  initialInvoices: any[];
  clients: any[];
}

export default function BillingClient({ initialInvoices, clients = [] }: BillingClientProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !totalAmount) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const result = await createNewInvoice({
        clientId: selectedClientId,
        totalAmount: Number(totalAmount),
        status,
      });

      if (result && result.length > 0) {
        const clientObj = clients.find((c) => c.id === selectedClientId);
        const newInv = {
          id: result[0].id,
          total_amount: result[0].total_amount,
          status: result[0].status,
          created_at: result[0].created_at || new Date().toISOString(),
          clients: clientObj
            ? {
                phone_number: clientObj.phone_number,
                users: {
                  first_name: clientObj.users?.first_name || "Client",
                  last_name: clientObj.users?.last_name || clientObj.phone_number || "",
                },
              }
            : null,
        };
        setInvoices((prev) => [newInv, ...prev]);
        setIsDialogOpen(false);
        // Reset form
        setSelectedClientId("");
        setTotalAmount("");
        setStatus("unpaid");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to create invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const unpaidInvoices = invoices.filter((i) => i.status === "unpaid");
  const totalRevenue = paidInvoices.reduce((acc, inv) => acc + Number(inv.total_amount || 0), 0);
  const accountsReceivable = unpaidInvoices.reduce((acc, inv) => acc + Number(inv.total_amount || 0), 0);

  const stats = [
    { label: "Total Revenue (Mo.)", value: `$${totalRevenue.toFixed(2)}`, desc: "Cleared payments", icon: DollarSign },
    { label: "Accounts Receivable", value: `$${accountsReceivable.toFixed(2)}`, desc: "Pending collections", icon: FileText },
    { label: "Paid Invoices", value: paidInvoices.length.toString(), desc: "Completed audits", icon: Award },
    { label: "Unpaid Invoices", value: unpaidInvoices.length.toString(), desc: "Awaiting checkout", icon: CreditCard },
  ];

  return (
    <>
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark font-serif">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-1">Audit invoicing records, payment status, transactions, and cash ledger flows.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-evhs hover:bg-evhs-light text-white rounded-full px-6 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-evhs-dark">Create New Invoice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateInvoice} className="space-y-4 pt-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Billing Client</label>
                <select
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  required
                >
                  <option value="">Select a Client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.users?.first_name} {c.users?.last_name} ({c.phone_number || "No Phone"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Total Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 145.00"
                  className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
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
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
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
                  {submitting ? "Creating..." : "Create Invoice"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Revenue and Billing Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, i) => (
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

      {/* Ledger Directory */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-serif">Invoices & Receipts Ledger</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by client..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white outline-none focus:ring-2 focus:ring-evhs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
                  <th className="p-4 pl-6">Invoice ID</th>
                  <th className="p-4">Billing Client</th>
                  <th className="p-4">Date Issued</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {invoices.length > 0 ? (
                  invoices.map((inv: any) => {
                    const formattedDate = inv.created_at
                      ? new Date(inv.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—";
                    return (
                      <tr key={inv.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-4 pl-6 font-mono text-xs text-muted-foreground">
                          #{inv.id?.substring(0, 8)}
                        </td>
                        <td className="p-4 font-bold text-evhs-dark">
                          {inv.clients?.users?.first_name} {inv.clients?.users?.last_name}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-zinc-900">
                          ${Number(inv.total_amount || 0).toFixed(2)}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`w-fit uppercase tracking-widest text-[9px] ${
                              inv.status === "paid"
                                ? "border-green-500 text-green-600 bg-green-50"
                                : "border-gold text-gold bg-gold/5"
                            }`}
                          >
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <Button variant="ghost" size="sm" className="text-evhs font-semibold hover:bg-evhs/5">
                            View Receipt
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                      <p className="font-semibold text-lg text-zinc-800">No invoices found</p>
                      <p className="text-sm mt-1">Create a new invoice to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
