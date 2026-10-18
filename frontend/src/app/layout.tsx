import type { Metadata, Viewport } from "next";
import { Inter, Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eastern Highlands Veterinary Surgery & Shampooch Grooming Spa | Mutare, Zimbabwe",
  description: "Specialized clinical veterinary care for companion pets and livestock, alongside bespoke canine grooming at Shampooch Spa in Mutare, Zimbabwe.",
  keywords: [
    "Veterinary Surgery Mutare",
    "EHVS Mutare",
    "Shampooch Grooming Mutare",
    "Livestock Vet Manicaland",
    "Dog Grooming Zimbabwe",
    "Veterinarian Eastern Highlands",
  ],
  authors: [{ name: "Eastern Highlands Veterinary Surgery" }],
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#004899",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${nunito.variable} ${playfair.variable} antialiased min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary`} 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
