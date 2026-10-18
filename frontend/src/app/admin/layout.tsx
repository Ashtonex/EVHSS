import { logoutUser } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { AUTH_COOKIE_NAME } from "@/lib/api";
import { 
  LayoutDashboard, Users, Calendar, LogOut, Settings, 
  Lock, Stethoscope, Scissors, ShoppingCart, 
  FileText, Clock, ShieldAlert, Activity
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  const modules = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, locked: false },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar, locked: false },
    { name: "Client Directory", href: "/admin/crm", icon: Users, locked: false },
    { name: "Medical Records", href: "/admin/medical", icon: Stethoscope, locked: false },
    { name: "Grooming Log", href: "/admin/grooming", icon: Scissors, locked: false },
    { name: "Inventory & POS", href: "/admin/retail", icon: ShoppingCart, locked: false },
    { name: "Billing & Invoices", href: "/admin/billing", icon: FileText, locked: false },
    { name: "Staff Scheduling", href: "/admin/staff", icon: Clock, locked: false },
    { name: "System Audit", href: "/admin/audit", icon: ShieldAlert, locked: false },
    { name: "Reporting", href: "/admin/reporting", icon: Activity, locked: false },
    { name: "Settings (IAM)", href: "/admin/settings", icon: Settings, locked: false },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-evhs-dark text-white flex flex-col h-screen sticky top-0 overflow-y-auto hidden-scrollbar">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center relative">
              <Image 
                src="/logo.png" 
                alt="EVHS Logo" 
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight">EVHS Portal</span>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 mt-6">Modules</div>
            {modules.map((m) => (
              <Link 
                key={m.name} 
                href={m.href} 
                className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg text-sm font-medium text-white/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <m.icon className={`w-4 h-4 ${m.locked ? "opacity-50" : "text-gold"}`} />
                  <span className={m.locked ? "opacity-70" : ""}>{m.name}</span>
                </div>
                {m.locked && <Lock className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />}
              </Link>
            ))}
          </nav>
        </div>

        <form action={logoutUser} className="mt-auto p-6 border-t border-white/10 bg-evhs-dark">
          <Button type="submit" variant="ghost" className="w-full justify-start gap-3 px-3 text-white/70 hover:text-white hover:bg-white/5">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </form>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
          <div className="w-[800px] h-[800px] relative">
            <Image 
              src="/logo.png" 
              alt="EVHS Watermark" 
              fill
              className="object-contain grayscale"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
