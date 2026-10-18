import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCharts } from "@/components/ui-custom/DashboardCharts";
import { AUTH_COOKIE_NAME, getDashboardStats, type DashboardStats } from "@/lib/api";
import { format } from "date-fns";
import { AlertCircle, Activity, PawPrint } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function AdminDashboard() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let stats: DashboardStats = {
    appointmentsToday: 0,
    pendingRequests: 0,
    totalPatients: 0,
    systemStatus: "Offline",
    trendData: [],
    distributionData: [],
    recentActivity: [],
  };

  try {
    stats = await getDashboardStats(token);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark">Command Center</h1>
          <p className="text-muted-foreground mt-1">Live metrics from the EVHS & Shampooch systems.</p>
        </div>
        <div className="text-sm font-medium text-muted-foreground bg-white px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          FastAPI session
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Appointments Today", value: stats.appointmentsToday.toString(), sub: "Total booked for today" },
          { label: "Pending Approvals", value: stats.pendingRequests.toString(), sub: "Awaiting confirmation", alert: stats.pendingRequests > 0 },
          { label: "Total Patients", value: stats.totalPatients.toString(), sub: "Registered in CRM" },
          { label: "System Status", value: stats.systemStatus, sub: "Connected to Python/PostgreSQL" },
        ].map((kpi) => (
          <Card key={kpi.label} className="rounded-2xl border-none shadow-sm overflow-hidden relative">
            {kpi.alert && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full" />}
            <CardHeader className="p-5 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                {kpi.label}
                {kpi.alert && <AlertCircle className="w-4 h-4 text-red-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 relative z-10">
              <div className={`text-3xl font-bold ${kpi.alert ? "text-red-600" : "text-evhs-dark"}`}>
                {kpi.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts trendData={stats.trendData} distributionData={stats.distributionData} />

      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif">Recent Database Activity</CardTitle>
          <Badge variant="outline" className="text-xs font-normal bg-zinc-50">Live Sync</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentActivity.length > 0 ? (
            <div className="divide-y divide-border/50">
              {stats.recentActivity.map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-evhs/10 text-evhs">
                      <PawPrint className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-evhs-dark">{item.event_type || item.reason || "System activity"}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {format(new Date(item.created_at || Date.now()), "MMM dd, h:mm a")} &middot; {item.details || "Database update"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-zinc-300" />
              </div>
              <p>No recent activity found in the database.</p>
              <p className="text-sm mt-1">Bookings made by clients will appear here instantly.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
