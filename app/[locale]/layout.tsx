import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/shared/navbar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

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

const locales = ['en', 'pidgin'];

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
