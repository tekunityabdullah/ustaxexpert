"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/layout/ChatWidget";
import type { ChatEntry } from "@/lib/chatbot";

// The admin panel/CMS lives at /admin/* and needs to render on its own,
// with none of the marketing site's header/footer/chat widget around it.
// This keeps the root layout as the single true root (required by Next.js
// for <html>/<body>) while still giving /admin a clean slate, instead of
// restructuring every existing page into a route group.
export default function SiteChrome({
  children,
  knowledgeBase,
}: {
  children: React.ReactNode;
  knowledgeBase: ChatEntry[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy-900"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget knowledgeBase={knowledgeBase} />
    </>
  );
}
