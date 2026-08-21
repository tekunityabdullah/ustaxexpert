// The app is deployed at the domain root — no basePath in next.config.ts.
// Kept as an empty-string constant (rather than deleting it) since it's
// still used everywhere as `${BASE_PATH}/...` for paths raw fetch()/<a>/CSS
// url() calls need (next/link and next/image don't need it either way).
export const BASE_PATH = "";

// Third-party integration points. These read from env vars so the site
// keeps working with sensible fallbacks until real accounts/keys are
// provided — see .env.example for what each one needs and where it's used.
export const integrations = {
  // Google reCAPTCHA v2 checkbox site key. Get one at
  // https://www.google.com/recaptcha/admin — used in ContactForm.
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "",
  // Form-backend endpoint (e.g. a Formspree form URL) that receives
  // contact/enrollment form submissions, since this site is a static
  // export with no server of its own. Used in ContactForm.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
  // Calendly scheduling link, e.g. "https://calendly.com/your-org/consult".
  // Used by the "Book a Consultation" booking widget/button.
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  // Stripe Payment Link for online payments (create one per package in the
  // Stripe Dashboard under Payment Links). Used on service detail pages.
  stripePaymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "",
} as const;

export const siteConfig = {
  name: "U.S. Tax Experts",
  tagline: "Your Top Source for IRS Tax Debt Relief",
  description:
    "U.S. Tax Experts helps individuals and businesses nationwide resolve IRS tax debt, and provides tax planning, bookkeeping, accounting, and tax settlement services.",
  url: "https://www.ustaxexperts.com",
  address: "2800 Post Oak Blvd, Houston, TX 70056",
  phones: [
    { label: "1 (800) 316-4033", href: "tel:+18003164033", type: "Main" },
    { label: "1 (832) 390-2347", href: "tel:+18323902347", type: "Toll-Free" },
  ],
  social: [
    { label: "Facebook", href: "#", icon: "facebook" },
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "YouTube", href: "#", icon: "youtube" },
  ],
} as const;
