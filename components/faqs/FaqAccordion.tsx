"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Faq } from "@/lib/faqs";
import Reveal from "@/components/ui/Reveal";

function FaqItem({
  faq,
  isOpen,
  onToggle,
  delay,
}: {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  return (
    <Reveal direction="up" delay={delay}>
      <div
        className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
          isOpen
            ? "border-navy-900/20 shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
            : "border-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:border-navy-900/15 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
        }`}
      >
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex w-full items-start gap-4 p-5 text-left"
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                isOpen ? "rotate-45 bg-navy-900 text-white" : "bg-section text-navy-900"
              }`}
            >
              <Plus size={16} />
            </span>
            <span className="flex-1 text-[15px] leading-snug font-semibold text-heading">
              {faq.question}
            </span>
          </button>
        </h3>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 pl-15 text-[15px] leading-relaxed text-body">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0]?.question ?? null);

  // Two independently stacked columns instead of a single CSS grid: when one
  // card expands it would otherwise stretch its whole grid row and leave a
  // gap next to its shorter neighbor. Splitting into columns keeps each
  // side's stacking independent, so open/close never misaligns the other.
  const half = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4">
          {column.map((faq, i) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openQuestion === faq.question}
              onToggle={() =>
                setOpenQuestion(openQuestion === faq.question ? null : faq.question)
              }
              delay={(i % 4) * 0.08}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
