import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/testimonials";

export default function TestimonialCard({ name, quote }: Testimonial) {
  return (
    <div className="h-full px-2.5">
      <div className="relative flex h-full flex-col rounded-2xl border border-black/5 bg-white p-7 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
        <Quote
          size={72}
          aria-hidden
          className="pointer-events-none absolute top-5 right-5 z-0 text-navy-900/4"
          fill="currentColor"
          strokeWidth={0}
        />

        <div className="relative z-10 mb-3 flex gap-0.5 text-gold-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
          ))}
        </div>

        <p className="relative z-10 flex-1 text-[15px] leading-relaxed text-body">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
            {name.charAt(0)}
          </span>
          <div>
            <h4 className="text-[15px]">{name}</h4>
            <p className="text-xs text-muted">Verified Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}
