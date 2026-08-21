import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, Navigation, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with U.S. Tax Experts for a free consultation on IRS tax debt relief, tax planning, bookkeeping, or accounting services.",
};

export default async function ContactUsPage() {
  const services = await getServices();

  return (
    <>
      <BreadcrumbHero title="Contact Us" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal direction="left" className="lg:col-span-7">
              <h2>Get Your Free Consultation</h2>
              <p className="mt-4 mb-8 text-body">
                Tell us a bit about your situation and a member of our team
                will reach out to discuss the best path forward, no
                obligation required.
              </p>
              <ContactForm services={services} />
            </Reveal>

            <Reveal direction="right" className="lg:col-span-5">
              <div className="overflow-hidden rounded-lg bg-navy-900 text-white">
                <div className="border-b border-white/10 p-7 pb-6 lg:p-8 lg:pb-6">
                  <h4 className="text-white">Contact Information</h4>
                  <p className="mt-1.5 text-[13.5px] text-white/55">
                    Reach us directly, or send a message and we&rsquo;ll follow up.
                  </p>
                </div>

                <ul className="p-7 py-2 lg:p-8 lg:py-3">
                  <li className="flex items-start gap-4 border-b border-white/5 py-4 last:border-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/8 text-gold-300">
                      <MapPin size={18} />
                    </span>
                    <div className="min-w-0 pt-1.5">
                      <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Office</p>
                      <p className="mt-0.5 text-[14.5px] text-white/90">{siteConfig.address}</p>
                    </div>
                  </li>
                  {siteConfig.phones.map((phone) => (
                    <li key={phone.href} className="flex items-start gap-4 border-b border-white/5 py-4 last:border-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/8 text-gold-300">
                        <Phone size={18} />
                      </span>
                      <div className="min-w-0 pt-1.5">
                        <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                          {phone.type || "Phone"}
                        </p>
                        <a
                          href={phone.href}
                          className="mt-0.5 block text-[14.5px] text-white/90 transition-colors hover:text-white"
                        >
                          {phone.label}
                        </a>
                      </div>
                    </li>
                  ))}
                  <li className="flex items-start gap-4 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/8 text-gold-300">
                      <Clock size={18} />
                    </span>
                    <div className="min-w-0 pt-1.5">
                      <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Hours</p>
                      <p className="mt-0.5 text-[14.5px] text-white/90">Monday &ndash; Friday, 9:00 AM &ndash; 6:00 PM</p>
                    </div>
                  </li>
                </ul>

                <div className="border-t border-white/10 p-7 pt-5 lg:p-8 lg:pt-5">
                  <Link
                    href="/enroll-now"
                    className="group flex items-center justify-between gap-3 text-[13.5px] font-semibold text-white/85 transition-colors hover:text-white"
                  >
                    <span>
                      Prefer to talk live? <span className="text-gold-300">Book a free consultation</span>
                    </span>
                    <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-section py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading align="center" title="Visit Our Office" subtitle={siteConfig.address} />
            <div className="mt-10 overflow-hidden rounded-2xl border border-black/10">
              <iframe
                src="https://maps.google.com/maps?cid=15170686362664397419&output=embed"
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="U.S. Tax Experts location on Google Maps"
              />
            </div>
            <div className="mt-6 text-center">
              <CtaButton
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`}
                variant="outline-navy"
              >
                <Navigation size={15} className="mr-2 inline -translate-y-px" />
                Get Directions
              </CtaButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
