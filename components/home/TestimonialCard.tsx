import type { Testimonial } from "@/lib/testimonials";

export default function TestimonialCard({ name, quote }: Testimonial) {
  return (
    <div className="h-full shrink-0 grow-0 basis-full snap-center px-2.5 sm:basis-1/2 lg:basis-1/3">
      <div className="h-full rounded-[20px] bg-section p-7">
        <span className="bg-gold-gradient mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-full font-serif text-4xl leading-none text-navy-800">
          &ldquo;
        </span>
        <p className="text-body">{quote}</p>
        <h4 className="mt-4">{name}</h4>
      </div>
    </div>
  );
}
