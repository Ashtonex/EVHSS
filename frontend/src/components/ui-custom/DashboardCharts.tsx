"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

interface AppointmentData {
  date: string;
  vet: number;
  spa: number;
}

interface DistributionData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  trendData: AppointmentData[];
  distributionData: DistributionData[];
}

const COLORS = ['#1a472a', '#e07a5f']; // evhs green, shampooch coral

export function DashboardCharts({ trendData, distributionData }: DashboardChartsProps) {
  // If we have no data, show a friendly empty state
  const hasTrendData = trendData.length > 0 && trendData.some(d => d.vet > 0 || d.spa > 0);
  const hasDistData = distributionData.length > 0 && distributionData.some(d => d.value > 0);

  return (
    <div className="grid gap-6 md:grid-cols-3 mt-6">
      
      {/* Area Chart: 7-Day Trend */}
      <Card className="rounded-2xl border-none shadow-sm md:col-span-2">
        <CardHeader className="p-6 border-b border-border/50">
          <CardTitle className="text-lg font-serif">Appointment Volume (7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-[350px]">
          {hasTrendData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a472a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1a472a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e07a5f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e07a5f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1a472a', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="vet" name="Veterinary" stroke="#1a472a" strokeWidth={2} fillOpacity={1} fill="url(#colorVet)" />
                <Area type="monotone" dataKey="spa" name="Grooming" stroke="#e07a5f" strokeWidth={2} fillOpacity={1} fill="url(#colorSpa)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full flex-col text-muted-foreground">
              <div className="w-16 h-16 mb-4 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTZWMGgtNXY0aS00VjBoLTV2NGgtNHYxMmg0djRoNHYtNGg0djRoNHYtNGg1Ii8+PC9zdmc+')] bg-no-repeat bg-center" />
              <p>Awaiting live appointment data...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Donut Chart: Distribution */}
      <Card className="rounded-2xl border-none shadow-sm md:col-span-1">
        <CardHeader className="p-6 border-b border-border/50">
          <CardTitle className="text-lg font-serif">Department Load</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-[350px]">
          {hasDistData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1a472a', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full flex-col text-muted-foreground text-center">
              <p className="px-4">No data available to calculate distribution.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
