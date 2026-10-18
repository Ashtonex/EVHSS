import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, BarChart3, TrendingUp, Users, Scissors, Stethoscope } from "lucide-react";
import { AUTH_COOKIE_NAME, getDashboardStats, type DashboardStats } from "@/lib/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function ReportingPage() {
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

  const vetEntry = stats.distributionData.find((d) => /vet/i.test(d.name));
  const spaEntry = stats.distributionData.find((d) => /spa|groom|shampooch/i.test(d.name));
  const vetValue = vetEntry?.value ?? 0;
  const spaValue = spaEntry?.value ?? 0;
  const totalValue = vetValue + spaValue;
  const vetShare = totalValue > 0 ? (vetValue / totalValue) * 100 : 0;
  const spaShare = totalValue > 0 ? (spaValue / totalValue) * 100 : 0;

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark">Analytics & Reporting</h1>
          <p className="text-muted-foreground mt-1">Enterprise reporting snapshots, service performance indices, and analytics.</p>
        </div>
      </header>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Veterinary Clinic Efficiency
              <Stethoscope className="w-4 h-4 text-evhs" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-evhs-dark">{vetShare.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Share of weekly appointment volume</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Grooming Spa Load
              <Scissors className="w-4 h-4 text-shampooch" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-evhs-dark">{spaShare.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Share of weekly appointment volume</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Registered Patients
              <Users className="w-4 h-4 text-gold" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-evhs-dark">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Live from FastAPI backend</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl p-8 text-center text-muted-foreground border border-dashed border-zinc-200">
        <BarChart3 className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
        <h3 className="font-serif font-bold text-lg text-zinc-800">Advanced Analytics Modules</h3>
        <p className="text-sm max-w-md mx-auto mt-2">
          Daily analytical snapshots are compiled and saved in the PostgreSQL schema database. Full visual reports will be displayed here as chart extensions.
        </p>
      </Card>
    </div>
  );
}
