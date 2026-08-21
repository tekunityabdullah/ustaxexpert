import type { Metadata } from "next";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms of use governing your access to and use of the U.S. Tax Experts website.",
};

// NOTE: Standard-form website terms of use template. It has not been
// reviewed by counsel. Have an attorney confirm it fits your actual
// engagement terms, fee/refund policy, and licensing before publishing —
// engagement-specific terms (scope of representation, fees) belong in a
// signed engagement letter, not this page.
const lastUpdated = "August 5, 2026";

export default function TermsConditionsPage() {
  return (
    <>
      <BreadcrumbHero title="Terms & Conditions" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="text-sm text-muted">Last updated: {lastUpdated}</p>

            <p className="mt-6 text-body">
              These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your
              use of the U.S. Tax Experts website (the &ldquo;Site&rdquo;).
              By accessing or using the Site, you agree to these Terms. If
              you do not agree, please do not use the Site.
            </p>

            <h3 className="mt-10 mb-3">Use of the Site</h3>
            <p className="text-body">
              This Site is provided for informational purposes about our tax
              planning, preparation, bookkeeping, accounting, and IRS
              resolution services. You agree to use the Site only for
              lawful purposes and not to interfere with its operation or
              security.
            </p>

            <h3 className="mt-10 mb-3">No Attorney-Client or Engagement Relationship</h3>
            <p className="text-body">
              Browsing this Site, submitting a contact or enrollment form,
              or scheduling a consultation does not, by itself, create a
              representation or engagement relationship between you and
              U.S. Tax Experts. An engagement begins only once a signed
              engagement letter or service agreement is in place.
            </p>

            <h3 className="mt-10 mb-3">No Tax or Legal Advice</h3>
            <p className="text-body">
              Content on this Site (including any guides, calculators, blog
              posts, or FAQs) is provided for general informational purposes
              only and does not constitute individualized tax, legal, or
              financial advice. Your specific situation should be reviewed
              directly with one of our specialists before you rely on it.
            </p>

            <h3 className="mt-10 mb-3">Client Portal &amp; Secure Uploads</h3>
            <p className="text-body">
              Our Client Hub is provided through a third-party secure
              document platform (SmartVault). Use of that portal is also
              subject to that provider&rsquo;s own terms of service. Do not
              upload documents through any channel other than the secure
              portal.
            </p>

            <h3 className="mt-10 mb-3">Payments</h3>
            <p className="text-body">
              Where online payment is offered, payments are processed by a
              third-party payment processor. Fees, billing terms, and
              refund policies for a specific engagement are governed by
              your signed engagement letter, not by this Site.
            </p>

            <h3 className="mt-10 mb-3">Intellectual Property</h3>
            <p className="text-body">
              All text, graphics, logos, and other content on this Site are
              the property of U.S. Tax Experts or its licensors and may not
              be copied or reused without permission.
            </p>

            <h3 className="mt-10 mb-3">Disclaimer &amp; Limitation of Liability</h3>
            <p className="text-body">
              This Site is provided &ldquo;as is&rdquo; without warranties
              of any kind. To the fullest extent permitted by law, U.S. Tax
              Experts is not liable for any indirect, incidental, or
              consequential damages arising from your use of the Site.
            </p>

            <h3 className="mt-10 mb-3">Changes to These Terms</h3>
            <p className="text-body">
              We may update these Terms from time to time. Continued use of
              the Site after changes are posted constitutes acceptance of
              the updated Terms.
            </p>

            <h3 className="mt-10 mb-3">Contact Us</h3>
            <p className="text-body">
              Questions about these Terms can be directed to{" "}
              <a
                href={siteConfig.phones[0].href}
                className="font-semibold text-navy-900 hover:text-gold-600"
              >
                {siteConfig.phones[0].label}
              </a>{" "}
              or by mail at {siteConfig.address}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
