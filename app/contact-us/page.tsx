import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with U.S. Tax Experts for a free consultation on IRS tax debt relief, tax planning, bookkeeping, or accounting services.",
};

export default function ContactUsPage() {
  return (
    <>
      <BreadcrumbHero title="Contact Us" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2>Get Your Free Consultation</h2>
              <p className="mt-4 mb-8 text-body">
                Tell us a bit about your situation and a member of our team
                will reach out to discuss the best path forward, no
                obligation required.
              </p>
              <ContactForm />
            </div>

            <div className="lg:col-span-5">
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
                      <a href={phone.href} className="hover:text-white">
                        {phone.label}
                      </a>
                    </li>
                  ))}
                  <li className="flex items-start gap-3">
                    <Clock size={20} className="mt-0.5 shrink-0 text-gold-300" />
                    Monday &ndash; Friday, 9:00 AM &ndash; 6:00 PM
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
