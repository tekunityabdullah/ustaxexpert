"use client";

import { useState } from "react";
import Image from "next/image";
import { services } from "@/lib/services";
import CtaButton from "@/components/ui/CtaButton";

export default function ServiceTabs() {
  const [activeSlug, setActiveSlug] = useState(services[0].slug);
  const activeService = services.find((s) => s.slug === activeSlug) ?? services[0];

  return (
    <div>
      <ul className="mb-8 flex flex-wrap justify-center gap-2.5">
        {services.map((service) => {
          const isActive = service.slug === activeSlug;
          return (
            <li key={service.slug}>
              <button
                type="button"
                onClick={() => setActiveSlug(service.slug)}
                className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "bg-gold-gradient text-navy-ink"
                    : "bg-navy-800 text-white hover:bg-navy-700"
                }`}
              >
                {service.title}
              </button>
            </li>
          );
        })}
      </ul>

      <div
        key={activeService.slug}
        className="grid animate-[fadeIn_0.4s_ease] grid-cols-1 items-stretch shadow-[0px_0px_9px_-3px_rgba(0,0,0,0.6)] lg:grid-cols-2"
      >
        <div className="relative min-h-[280px] lg:min-h-[420px]">
          <Image
            src={activeService.image.src}
            alt={activeService.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center bg-white p-8 lg:p-12">
          <h3 className="mb-5">{activeService.title}</h3>
          {activeService.description.map((paragraph, i) => (
            <p key={i} className="mb-4 text-body last:mb-0">
              {paragraph}
            </p>
          ))}
          <div className="mt-6">
            <CtaButton href={`/our-services/${activeService.slug}`}>
              Read More
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
}
