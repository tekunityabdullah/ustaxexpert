"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import type { Testimonial } from "@/lib/testimonials";
import TestimonialCard from "@/components/home/TestimonialCard";

import "swiper/css";
import "swiper/css/navigation";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div>
      <Swiper
        modules={[Autoplay, Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        grabCursor
        rewind
        className="items-stretch pb-2 [&_.swiper-wrapper]:items-stretch"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.name} className="h-auto">
            <TestimonialCard {...testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-900 hover:bg-navy-900 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-900 hover:bg-navy-900 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
