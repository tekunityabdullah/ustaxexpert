import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BASE_PATH } from "@/lib/site-config";

export default function BreadcrumbHero({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden bg-navy-900 pt-32.5 pb-14 text-center lg:pt-40 lg:pb-16">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${BASE_PATH}/images/tax-accountant-in-melbourne-cbd.jpg)` }}
      />
      <div className="absolute inset-0 -z-10 bg-black/52" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-3 px-5">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm font-medium text-white/60"
        >
          <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-white">
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={14} className="shrink-0 text-white/30" />
          <span className="text-gold-300">{title}</span>
        </nav>
        <h2 className="text-white">{title}</h2>
      </div>
    </div>
  );
}
