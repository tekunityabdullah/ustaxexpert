"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/testimonials";
import TestimonialCard from "@/components/home/TestimonialCard";

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild?.clientWidth ?? track.clientWidth;
    const atEnd =
      direction === 1 &&
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
    const atStart = direction === -1 && track.scrollLeft <= 10;

    if (atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => scrollByCard(1), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
