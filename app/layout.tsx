import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyTax - Simplify Your Tax Compliance",
  description: "Learn, calculate, and pay your taxes easily. Supporting both English and Pidgin for every Nigerian.",
  keywords: "tax, Nigeria, compliance, calculator, payment, education",
  authors: [{ name: "EasyTax Team" }],
  openGraph: {
    title: "EasyTax - Simplify Your Tax Compliance",
    description: "Learn, calculate, and pay your taxes easily. Supporting both English and Pidgin for every Nigerian.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
