"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

// Fixed top bar showing how far the reader has scrolled through the page.
export default function ReadingProgressBar({ accentClassName }: { accentClassName: string }) {
  const [rawProgress, setRawProgress] = useState(0);
  const progress = useSpring(0, { stiffness: 200, damping: 30, mass: 0.2 });

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      setRawProgress(Math.min(100, Math.max(0, pct)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    progress.set(rawProgress / 100);
  }, [rawProgress, progress]);

  return (
    <div className="fixed inset-x-0 top-0 z-40 h-1 bg-black/5">
      <motion.div
        style={{ scaleX: progress, transformOrigin: "0%" }}
        className={`h-full w-full ${accentClassName}`}
      />
    </div>
  );
}
