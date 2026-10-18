"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Stethoscope, Sparkles, CalendarDays, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Veterinary",
      href: "/vet/services",
      icon: Stethoscope,
      isActive: pathname?.startsWith("/vet") ?? false,
      badgeColor: "text-vet",
    },
    {
      label: "Shampooch",
      href: "/shampooch",
      icon: Sparkles,
      isActive: pathname?.startsWith("/shampooch") ?? false,
      badgeColor: "text-amberBrand",
    },
    {
      label: "Book Visit",
      href: "/book",
      icon: CalendarDays,
      isActive: pathname?.startsWith("/book") ?? false,
      highlight: true,
    },
    {
      label: "Urgent",
      href: "/contact",
      icon: AlertCircle,
      isActive: pathname?.startsWith("/contact") ?? false,
      urgent: true,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 shadow-lg px-2 py-1"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[52px] rounded-xl transition-all touch-target text-center",
                item.isActive
                  ? item.badgeColor
                    ? `${item.badgeColor} font-semibold`
                    : "text-zinc-950 font-semibold"
                  : "text-zinc-500 hover:text-zinc-800",
                item.highlight && !item.isActive && "text-vet font-medium",
                item.urgent && !item.isActive && "text-red-600 hover:text-red-700 font-medium"
              )}
              aria-current={item.isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 mb-0.5", item.urgent && "text-red-600")} aria-hidden="true" />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-1 line-clamp-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
