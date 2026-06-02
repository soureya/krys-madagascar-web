import type { Metadata } from "next";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { storesSchema } from "@/lib/schema";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krys-madagascar.com"),
  title: "Krys Madagascar — Opticien à Antananarivo, Nosy Be & Antsiranana",
  description:
    "Cinq cabinets d'optique agréés à Madagascar, affiliés au réseau Krys. Examens de vue, lunettes de vue, solaires et lentilles. Prenez rendez-vous en ligne.",
  openGraph: {
    title: "Krys Madagascar — Opticien à Antananarivo, Nosy Be & Antsiranana",
    description:
      "Cinq cabinets d'optique agréés à Madagascar. Examens de vue, lunettes, solaires, lentilles. Prenez rendez-vous.",
    url: "https://www.krys-madagascar.com",
    siteName: "Krys Madagascar",
    locale: "fr_MG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krys Madagascar — Opticien à Madagascar",
    description:
      "Cinq cabinets d'optique agréés. Examens de vue, lunettes, lentilles. Prenez rendez-vous en ligne.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${interTight.variable} ${geistMono.variable}`}
    >
      <body>
        <JsonLd data={{ "@graph": storesSchema }} />
        {children}
      </body>
    </html>
  );
}
