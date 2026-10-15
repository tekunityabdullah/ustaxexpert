import type { Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome";
import { siteConfig } from "@/lib/site-config";
import { getFaqs } from "@/lib/faqs";
import { getServices } from "@/lib/services";
import { buildKnowledgeBase } from "@/lib/chatbot";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [faqs, services] = await Promise.all([getFaqs(), getServices()]);
  const knowledgeBase = buildKnowledgeBase(faqs, services);

  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteChrome knowledgeBase={knowledgeBase}>{children}</SiteChrome>
      </body>
    </html>
  );
}
