import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/ui/Reveal";
import SectionHeading  from "@/components/ui/SectionHeading";
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
              <div className="rounded-lg bg-navy-900 p-8 text-white">
                <h4 className="mb-6 text-white">Contact Information</h4>
                <ul className="space-y-5 text-[15px] text-white/85">
                  <li className="flex items-start gap-3">
                    <MapPin size={20} className="mt-0.5 shrink-0 text-gold-300" />
                    {siteConfig.address}
                  </li>
                  {siteConfig.phones.map((phone) => (
                    <li key={phone.href} className="flex items-center gap-3">
                      <Phone size={18} className="shrink-0 text-gold-300" />
                      <span>
                        <a href={phone.href} className="hover:text-white">
                          {phone.label}
                        </a>
                        {phone.type && (
                          <span className="ml-2 text-xs uppercase tracking-wide text-gold-300">
                            {phone.type}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3">
                    <Clock size={20} className="mt-0.5 shrink-0 text-gold-300" />
                    Monday &ndash; Friday, 9:00 AM &ndash; 6:00 PM
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
           <section className="py-16 lg:py-25">
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
                    </Reveal>
                  </Container>
                </section>
        </Container>
      </section>
    </>
  );
}
