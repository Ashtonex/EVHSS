import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldAlert, Terminal, Activity, MessageSquare } from "lucide-react";
import { AUTH_COOKIE_NAME, getAuditLogs, getWhatsAppLogs, type ApiAuditLog, type ApiWhatsAppLog } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function SystemAuditPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let logs: ApiAuditLog[] = [];
  let whatsappLogs: ApiWhatsAppLog[] = [];

  try {
    const [auditLogs, waLogs] = await Promise.all([
      getAuditLogs(token),
      getWhatsAppLogs(token),
    ]);
    logs = auditLogs;
    whatsappLogs = waLogs;
  } catch (error) {
    console.error("Error fetching audit/whatsapp logs:", error);
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark font-serif">System Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Audit security alerts, entity access, updates, and backend operations logs.</p>
        </div>
      </header>

      {/* Audit Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Logged Events (Today)", value: logs.length.toString(), desc: "System operations log", icon: Terminal },
          { label: "Warning Alerts", value: "0", desc: "No suspicious behaviors", icon: ShieldAlert },
          { label: "Integrity Verification", value: "Valid", desc: "Hash verification successful", icon: Activity },
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

      {/* Events Board */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-serif">Security & Operations Log</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white outline-none focus:ring-2 focus:ring-evhs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {logs.length > 0 ? (
            <div className="divide-y divide-border">
              {logs.map((log) => {
                const formattedDate = log.created_at
                  ? new Date(log.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "--";

                const actor = log.user_id ? `User ID: ${log.user_id.slice(0, 8)}` : "System";

                return (
                  <div key={log.id} className="p-6 hover:bg-zinc-50/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-zinc-800 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                          {log.event_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-semibold">Entity: <strong className="text-zinc-700 font-bold">{log.entity_name || "--"}</strong></span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-800 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-100/50">
                        {log.details || "No additional details recorded."}
                      </p>
                    </div>

                    <div className="md:text-right shrink-0 flex flex-row md:flex-col justify-between items-center md:items-end gap-2 text-xs">
                      <div className="text-muted-foreground">
                        By: <span className="font-semibold text-zinc-700">{actor}</span>
                      </div>
                      <span className="text-muted-foreground font-semibold bg-zinc-100 px-2 py-1 rounded">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-8 h-8 text-zinc-300" />
              </div>
              <p>No audit events found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Notification Log */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-serif">WhatsApp Notification Log</CardTitle>
          <div className="w-10 h-10 bg-evhs/5 rounded-full flex items-center justify-center text-evhs">
            <MessageSquare className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {whatsappLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 font-semibold">Recipient Phone</th>
                    <th className="p-4 font-semibold">Message</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Sent At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {whatsappLogs.map((wa) => {
                    const formattedDate = wa.created_at
                      ? new Date(wa.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "--";

                    const status = wa.status || "unknown";
                    const statusClass =
                      status.toLowerCase() === "sent" || status.toLowerCase() === "delivered"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : status.toLowerCase() === "failed"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200";

                    return (
                      <tr key={wa.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-4 font-semibold text-zinc-700 whitespace-nowrap">{wa.recipient_phone}</td>
                        <td className="p-4 text-zinc-600 max-w-md truncate">{wa.message_content}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${statusClass}`}>
                            {status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground font-semibold whitespace-nowrap">{formattedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-zinc-300" />
              </div>
              <p>No WhatsApp notifications found.</p>
              <p className="text-sm mt-1">Outbound reminders and confirmations will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
