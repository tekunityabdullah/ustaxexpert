import type { Metadata } from "next";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How U.S. Tax Experts collects, uses, stores, and protects your personal and financial information.",
};

// NOTE: This is a standard-form privacy policy template covering the data
// practices visible in this codebase (contact/enrollment forms, the
// SmartVault client portal, analytics, cookies). It has not been reviewed
// by counsel. Have an attorney confirm it matches your actual data
// practices, applicable state law (e.g. CCPA), and IRS Circular 230 /
// preparer confidentiality obligations before publishing.
const lastUpdated = "August 5, 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbHero title="Privacy Policy" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="text-sm text-muted">Last updated: {lastUpdated}</p>

            <p className="mt-6 text-body">
              U.S. Tax Experts (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) respects your privacy and is committed to
              protecting the personal and financial information you share
              with us. This Privacy Policy explains what information we
              collect, how we use it, how it is stored and protected, and the
              choices you have.
            </p>

            <h3 className="mt-10 mb-3">Information We Collect</h3>
            <ul className="list-disc space-y-2 pl-5 text-body">
              <li>
                <strong>Information you provide directly</strong> &mdash;
                such as your name, email address, phone number, mailing
                address, and case details when you submit a contact or
                enrollment form, request a consultation, or communicate with
                our team.
              </li>
              <li>
                <strong>Tax and financial documents</strong> &mdash; when you
                upload documents through our secure Client Hub (powered by
                SmartVault), including tax returns, IRS notices, and
                supporting financial records.
              </li>
              <li>
                <strong>Payment information</strong> &mdash; processed
                directly by our third-party payment processor. We do not
                store full payment card numbers on our servers.
              </li>
              <li>
                <strong>Automatically collected information</strong> &mdash;
                such as IP address, browser type, device information, and
                pages visited, collected through cookies and similar
                technologies for analytics and site functionality.
              </li>
            </ul>

            <h3 className="mt-10 mb-3">How We Use Your Information</h3>
            <ul className="list-disc space-y-2 pl-5 text-body">
              <li>To respond to inquiries and schedule consultations.</li>
              <li>
                To prepare, file, and represent you in connection with tax
                planning, preparation, bookkeeping, accounting, and IRS
                resolution matters you engage us for.
              </li>
              <li>To process payments for services you purchase.</li>
              <li>
                To send administrative communications, such as appointment
                confirmations and case status updates.
              </li>
              <li>
                To improve our website and services, and to comply with
                legal and regulatory obligations.
              </li>
            </ul>

            <h3 className="mt-10 mb-3">How We Protect Your Information</h3>
            <p className="text-body">
              We use administrative, technical, and physical safeguards
              designed to protect your information, including encrypted
              connections (SSL/TLS), a secure document portal with
              multi-factor authentication for client document exchange, and
              restricted internal access on a need-to-know basis. No method
              of transmission or storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h3 className="mt-10 mb-3">Sharing of Information</h3>
            <p className="text-body">
              We do not sell your personal information. We may share
              information with:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-body">
              <li>
                The Internal Revenue Service (IRS) and applicable state tax
                authorities, as required to represent you or file on your
                behalf.
              </li>
              <li>
                Service providers who support our operations (e.g. our
                secure document portal, payment processor, scheduling, and
                email/form-delivery providers), under confidentiality
                obligations.
              </li>
              <li>
                Parties as required by law, subpoena, or to protect our
                legal rights.
              </li>
            </ul>

            <h3 className="mt-10 mb-3">Cookies</h3>
            <p className="text-body">
              We use cookies and similar technologies to operate our site,
              remember preferences, and understand how visitors use our
              site. You can control cookies through your browser settings.
            </p>

            <h3 className="mt-10 mb-3">Your Choices &amp; Rights</h3>
            <p className="text-body">
              Depending on your state of residence, you may have the right
              to request access to, correction of, or deletion of your
              personal information, subject to our recordkeeping
              obligations as tax practitioners. To make a request, contact
              us using the details below.
            </p>

            <h3 className="mt-10 mb-3">Children&rsquo;s Privacy</h3>
            <p className="text-body">
              Our services are intended for individuals 18 years of age or
              older. We do not knowingly collect personal information from
              children.
            </p>

            <h3 className="mt-10 mb-3">Changes to This Policy</h3>
            <p className="text-body">
              We may update this Privacy Policy from time to time. The
              &ldquo;Last updated&rdquo; date above reflects the most recent
              revision.
            </p>

            <h3 className="mt-10 mb-3">Contact Us</h3>
            <p className="text-body">
              If you have questions about this Privacy Policy or how your
              information is handled, contact us at{" "}
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
