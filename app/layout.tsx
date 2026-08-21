import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome";
import { siteConfig } from "@/lib/site-config";
import { getFaqs } from "@/lib/faqs";
import { getServices } from "@/lib/services";
import { buildKnowledgeBase } from "@/lib/chatbot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteChrome knowledgeBase={knowledgeBase}>{children}</SiteChrome>
      </body>
    </html>
  );
}
