import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FloatingWhatsApp } from "@/components/features/FloatingWhatsApp";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground contour-pattern selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <main className="flex-1 flex flex-col pt-24 md:pt-20 pb-20 md:pb-0">
        {children}
      </main>
      <FloatingWhatsApp />
      <SiteFooter />
      <MobileNav />
    </div>
  );
}

