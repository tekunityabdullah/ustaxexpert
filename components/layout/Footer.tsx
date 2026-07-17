import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import Container from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
};

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="border-t-2 border-gold-600">
        <Container>
          <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-3">
            <div>
              <div className="mb-5 inline-block rounded-md bg-white p-2">
                <Image
                  src="/images/Group-34806.png"
                  alt="U.S. Tax Experts"
                  width={250}
                  height={84}
                  className="h-14 w-auto"
                />
              </div>
              <p className="text-[15px] leading-6 text-white/85">
                At U.S. Tax Experts, we help manage your Tax &amp; Accounting
                needs, and resolve IRS Tax debt, including tax liens and
                levies. We provide trusted, personalized tax solutions and
                strategies, nationwide, helping our clients save millions of
                dollars.
              </p>
              <ul className="mt-5 flex gap-3">
                {siteConfig.social.map((s) => {
                  const Icon = socialIcons[s.icon as keyof typeof socialIcons];
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        aria-label={s.label}
                        className="flex h-10 w-10 items-center justify-center bg-white text-gold-400 transition-colors hover:text-navy-900"
                      >
                        <Icon width={16} height={16} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-white/10 md:border-x md:px-12">
              <h3 className="mb-6 text-base font-bold uppercase tracking-wide text-white">
                Quick Links
              </h3>
              <ul className="grid grid-cols-2 gap-y-3 text-[15px]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/85 transition-colors hover:text-accent-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:pl-12">
              <h3 className="mb-6 text-base font-bold uppercase tracking-wide text-white">
                Contact Info
              </h3>
              <ul className="space-y-3 text-[15px] text-white/85">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  {siteConfig.address}
                </li>
                {siteConfig.phones.map((phone) => (
                  <li key={phone.href} className="flex items-center gap-3">
                    <Phone size={16} className="shrink-0" />
                    <a href={phone.href} className="hover:text-accent-green">
                      {phone.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container>
          <div className="flex flex-col items-center gap-3 py-5 text-[15px] text-white/80 md:flex-row md:justify-between">
            <p>2026 &copy; All Rights Reserved By U.S. Tax Experts</p>
            <ul className="flex gap-5">
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
