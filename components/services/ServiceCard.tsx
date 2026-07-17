import Image from "next/image";
import type { Service } from "@/lib/services";
import CtaButton from "@/components/ui/CtaButton";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
      <div className="relative h-56 w-full">
        <Image
          src={service.image.src}
          alt={service.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h4 className="mb-3">{service.title}</h4>
        <p className="mb-6 flex-1 text-[15px] leading-relaxed text-muted">
          {service.excerpt}
        </p>
        <CtaButton href={`/our-services/${service.slug}`} className="self-start">
          Learn More
        </CtaButton>
      </div>
    </div>
  );
}
