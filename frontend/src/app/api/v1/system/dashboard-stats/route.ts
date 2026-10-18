import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export const revalidate = 0; // Disable cache for this route to ensure live data

export async function GET() {
  try {
    const supabase = await createClient();

    const todayStart = startOfDay(new Date()).toISOString();
    const todayEnd = endOfDay(new Date()).toISOString();

    // 1. Fetch Total Patients
    const { count: totalPatients } = await supabase
      .from("pets")
      .select("*", { count: "exact", head: true });

    // 2. Fetch Today's Appointments (to calculate total & pending)
    const { data: todayApts } = await supabase
      .from("appointments")
      .select("id, status")
      .gte("appointment_date", todayStart)
      .lte("appointment_date", todayEnd);

    const appointmentsToday = todayApts?.length || 0;
    const pendingRequests =
      todayApts?.filter(
        (a) => a.status === "pending" || a.status === "scheduled"
      )?.length || 0;

    // 3. Fetch Recent Booking Requests (Live Data)
    const { data: recentActivity } = await supabase
      .from("appointments")
      .select(`
        id,
        created_at,
        status,
        reason,
        pets ( name, species ),
        clients ( users ( first_name, last_name ) )
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    // 4. Data for Recharts (7-Day Trend)
    const sevenDaysAgo = subDays(new Date(), 7).toISOString();
    const { data: trendQuery } = await supabase
      .from("appointments")
      .select("appointment_date, reason")
      .gte("appointment_date", sevenDaysAgo);

    // Build the array for the Area Chart
    const trendDataMap: Record<string, { vet: number; spa: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      trendDataMap[format(d, "MMM dd")] = { vet: 0, spa: 0 };
    }

    let totalVet = 0;
    let totalSpa = 0;

    if (trendQuery) {
      trendQuery.forEach((apt) => {
        if (!apt.appointment_date) return;
        const dateStr = format(new Date(apt.appointment_date), "MMM dd");
        if (trendDataMap[dateStr]) {
          const isGrooming = apt.reason?.toLowerCase().includes("groom");
          if (isGrooming) {
            trendDataMap[dateStr].spa += 1;
            totalSpa += 1;
          } else {
            trendDataMap[dateStr].vet += 1;
            totalVet += 1;
          }
        }
      });
    }

    const trendData = Object.keys(trendDataMap).map((date) => ({
      date,
      vet: trendDataMap[date].vet,
      spa: trendDataMap[date].spa,
    }));

    const distributionData = [
      { name: "Veterinary", value: totalVet },
      { name: "Shampooch", value: totalSpa },
    ];

    return NextResponse.json({
      appointmentsToday,
      pendingRequests,
      totalPatients: totalPatients || 0,
      systemStatus: "Online",
      trendData,
      distributionData,
      recentActivity: recentActivity || [],
    });
  } catch (error: any) {
    console.error("[API/DASHBOARD_STATS] Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
