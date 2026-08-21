"use client";

import { useState } from "react";
import { Mail, Link2, Check } from "lucide-react";
import { FacebookIcon, LinkedinIcon } from "@/components/ui/SocialIcons";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function currentUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing to fall back to safely.
    }
  }

  const iconButtonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold uppercase tracking-wide text-muted">
        Share
      </span>
      <button
        type="button"
        aria-label="Share on Facebook"
        onClick={() =>
          openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl())}`)
        }
        className={iconButtonClass}
      >
        <FacebookIcon width={16} height={16} />
      </button>
      <button
        type="button"
        aria-label="Share on LinkedIn"
        onClick={() =>
          openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl())}`)
        }
        className={iconButtonClass}
      >
        <LinkedinIcon width={16} height={16} />
      </button>
      <a
        aria-label="Share by email"
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
          "Thought you'd find this useful: "
        )}${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
        className={iconButtonClass}
      >
        <Mail size={16} />
      </a>
      <button
        type="button"
        aria-label="Copy link"
        onClick={copyLink}
        className={iconButtonClass}
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
