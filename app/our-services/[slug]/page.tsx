import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/lib/services";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";
import ServiceCard from "@/components/services/ServiceCard";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/our-services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.excerpt,
  };
}

export default async function ServiceDetailPage(
  props: PageProps<"/our-services/[slug]">
) {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <BreadcrumbHero title={service.title} />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative h-72 w-full overflow-hidden rounded-lg lg:h-[420px]">
              <Image
                src={service.image.src}
                alt={service.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div>
              <h1>{service.title}</h1>
              {service.description.map((paragraph, i) => (
                <p key={i} className="mt-4 text-body">
                  {paragraph}
                </p>
              ))}
              <div className="mt-8">
                <CtaButton href="/contact-us">Book Consultation</CtaButton>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {relatedServices.length > 0 && (
        <section className="bg-section py-16 lg:py-25">
          <Container>
            <h2 className="text-center">Other Services</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {relatedServices.map((related) => (
                <ServiceCard key={related.slug} service={related} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
