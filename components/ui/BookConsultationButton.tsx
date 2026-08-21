"use client";

import type { ReactNode } from "react";
import Script from "next/script";
import { integrations } from "@/lib/site-config";
import CtaButton from "@/components/ui/CtaButton";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type Props = {
  children: ReactNode;
  variant?: "solid" | "outline" | "outline-navy";
  className?: string;
  /** Where to send visitors if Calendly isn't configured yet (see .env.example). */
  fallbackHref?: string;
};

// Opens the real Calendly scheduling popup once NEXT_PUBLIC_CALENDLY_URL is
// set. Until then it degrades to a plain link to fallbackHref — Enroll Now,
// which has the live Calendly booking embed, not Contact Us.
export default function BookConsultationButton({
  children,
  variant = "solid",
  className,
  fallbackHref = "/enroll-now",
}: Props) {
  const calendlyUrl = integrations.calendlyUrl;

  if (!calendlyUrl) {
    return (
      <CtaButton href={fallbackHref} variant={variant} className={className}>
        {children}
      </CtaButton>
    );
  }

  function openCalendly() {
    if (typeof window !== "undefined" && window.Calendly) {
      window.Calendly.initPopupWidget({ url: calendlyUrl });
    } else if (typeof window !== "undefined") {
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <link
        rel="stylesheet"
        href="https://assets.calendly.com/assets/external/widget.css"
      />
      <CtaButton type="button" variant={variant} className={className} onClick={openCalendly}>
        {children}
      </CtaButton>
    </>
  );
}
