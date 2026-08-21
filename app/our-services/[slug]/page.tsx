import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { getServices, getServiceBySlug } from "@/lib/services";
import { integrations } from "@/lib/site-config";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";
import BookConsultationButton from "@/components/ui/BookConsultationButton";
import ServiceCard from "@/components/services/ServiceCard";
import Reveal from "@/components/ui/Reveal";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/our-services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
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
  const [service, services] = await Promise.all([getServiceBySlug(slug), getServices()]);
  if (!service) notFound();

  const relatedServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <BreadcrumbHero title={service.title} />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal direction="left" className="relative h-72 w-full overflow-hidden rounded-lg lg:h-[420px]">
              <Image
                src={service.image.src}
                alt={service.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
            <Reveal direction="right">
              <h1>{service.title}</h1>
              {service.description.map((paragraph, i) => (
                <p key={i} className="mt-4 text-body">
                  {paragraph}
                </p>
              ))}

              <h4 className="mt-8 mb-4">What&rsquo;s Included</h4>
              <ul className="space-y-3">
                {service.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-gold-600" />
                    <span className="text-body">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <BookConsultationButton>Book Consultation</BookConsultationButton>
                {(service.paymentLink ?? integrations.stripePaymentLink) && (
                  <CtaButton
                    href={service.paymentLink ?? integrations.stripePaymentLink}
                    variant="outline-navy"
                  >
                    Pay Online
                  </CtaButton>
                )}
                <span className="flex items-center gap-2 text-sm text-muted">
                  <Lock size={16} className="text-gold-600" />
                  Secure online payment options available
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-section py-16 lg:py-25">
        <Container>
          <h2 className="text-center">Why Choose Our {service.title}</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {service.benefits.map((benefit, index) => (
              <Reveal key={benefit} direction="up" delay={(index % 4) * 0.08}>
                <div className="flex h-full items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
                  <CheckCircle2 size={20} className="shrink-0 text-gold-600" />
                  <span className="text-[14px] font-semibold text-heading">{benefit}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {relatedServices.length > 0 && (
        <section className="bg-section py-16 lg:py-25">
          <Container>
            <h2 className="text-center">Other Services</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {relatedServices.map((related, index) => (
                <Reveal key={related.slug} direction="up" delay={index * 0.1}>
                  <ServiceCard service={related} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
