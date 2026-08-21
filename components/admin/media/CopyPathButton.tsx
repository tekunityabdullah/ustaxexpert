"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyPathButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 text-[11.5px] font-medium text-muted hover:text-heading"
      title="Copy image path"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : path}
    </button>
  );
}
