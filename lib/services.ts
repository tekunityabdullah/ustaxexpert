import { BASE_PATH } from "@/lib/site-config";
import { prisma } from "@/lib/db";
import type { Service as PrismaService } from "@prisma/client";

export type Service = {
  slug: string;
  title: string;
  image: { src: string; width: number; height: number };
  excerpt: string;
  description: string[];
  included: string[];
  benefits: string[];
  // Optional per-package Stripe Payment Link (Stripe Dashboard → Payment
  // Links). Falls back to integrations.stripePaymentLink when unset. Leave
  // unset until a real link is created — no "Pay Online" button shows
  // until either this or the generic fallback is configured.
  paymentLink?: string;
};

export const services: Service[] = [
  {
    slug: "tax-planning-preparation",
    title: "Tax Planning & Preparation",
    image: {
      src: `${BASE_PATH}/images/edc8c405-2048x1152-1.jpg`,
      width: 2048,
      height: 1152,
    },
    excerpt:
      "Maximize savings and minimize liabilities with proactive, year-round tax planning.",
    description: [
      "At U.S. Tax Experts, Tax Planning & Preparation is about more than just filing returns. It's about maximizing savings and minimizing liabilities. We take a proactive approach by analyzing your financial picture year-round.",
      "Our strategies help you take advantage of deductions, credits, and tax breaks to legally lower your tax burden. We prepare accurate returns for individuals and businesses, ensuring compliance with ever-changing tax laws.",
      "With our expert guidance, you'll avoid IRS red flags while keeping more of what you earn.",
    ],
    included: [
      "Year-round tax planning strategy",
      "Federal and state return preparation",
      "Deduction and credit review",
      "Direct access to your tax specialist",
    ],
    benefits: [
      "Max Refund Guaranteed",
      "Stay Compliant",
      "Understand Tax Deductions",
      "Understand Tax Credits",
      "File Right",
      "Reduce Risk",
      "Audit Protection",
      "Save More",
    ],
  },
  {
    slug: "bookkeeping",
    title: "Bookkeeping",
    image: {
      src: `${BASE_PATH}/images/1616737296-blogging-tips-linkedin-post-header-82-2048x1152-1.jpg`,
      width: 2048,
      height: 1152,
    },
    excerpt:
      "Professional bookkeeping that keeps your income, expenses, and records accurate and compliant.",
    description: [
      "Organized bookkeeping is essential to avoid errors and financial stress. We provide professional bookkeeping services that keep your income, expenses, and records in order.",
      "Whether you are self-employed, a small business owner, or managing accounts, we ensure your books remain accurate and compliant. With real-time updates, reconciliations, and detailed reporting, you'll always know where your money is going.",
      "We focus on accuracy and transparency, so you can focus on growing your business or finances without worry.",
    ],
    included: [
      "Monthly income and expense reconciliation",
      "Organized, audit-ready financial records",
      "Detailed monthly reporting",
      "Ongoing bookkeeping support",
    ],
    benefits: [
      "Clean Records",
      "Monthly Logs",
      "Payroll Care",
      "Invoice Track",
      "Audit Proof",
      "Stay Compliant",
      "Control Costs",
      "Business Clear",
    ],
  },
  {
    slug: "accounting",
    title: "Accounting",
    image: {
      src: `${BASE_PATH}/images/download-4.jpg`,
      width: 304,
      height: 166,
    },
    excerpt:
      "Accurate financial reporting and tax compliance for individuals and businesses.",
    description: [
      "Accurate accounting is the foundation of financial success for both individuals and businesses. Our accounting services cover everything from financial reporting to tax compliance, ensuring your records are always accurate and up to date.",
      "With our expert guidance, you'll gain a clear understanding of your cash flow, expenses, and opportunities for savings. We help you stay IRS-compliant while also providing the insights you need to make confident financial decisions.",
    ],
    included: [
      "Financial statement preparation",
      "Tax compliance monitoring",
      "Cash flow and expense insights",
      "Quarterly financial review",
    ],
    benefits: [
      "Clear Reports",
      "Track Costs",
      "Stay Compliant",
      "Audit Ready",
      "Cash Flow",
      "Smart Budgets",
      "Tax Aligned",
      "Growth Focus",
    ],
  },
  {
    slug: "tax-settlement",
    title: "Tax Settlement",
    image: {
      src: `${BASE_PATH}/images/close-up-two-businessmen-pointing-business-chart-meeting-2048x1556-1.jpg`,
      width: 2048,
      height: 1556,
    },
    excerpt:
      "Resolve your IRS debt for less than the full amount you owe through proven settlement programs.",
    description: [
      "A tax settlement allows you to resolve your IRS debt for less than the full amount you owe. Through programs like the Offer in Compromise and other relief options, we negotiate with the IRS to reduce your liability based on your ability to pay.",
      "Our specialists work closely with you to prepare strong documentation and present the best possible case for settlement. By leveraging our expertise, you may be able to settle your tax debt for pennies on the dollar.",
    ],
    included: [
      "Full case and financial eligibility review",
      "Offer in Compromise preparation",
      "Direct IRS negotiation",
      "Ongoing case status updates",
    ],
    benefits: [
      "Pay Less",
      "IRS Deals",
      "Easy Payments",
      "Cut Debt",
      "Strong Case",
      "Quick Results",
      "Debt Relief",
      "Fresh Start",
    ],
  },
  {
    slug: "tax-debt-relief",
    title: "Tax Debt Relief",
    image: {
      src: `${BASE_PATH}/images/dreamstime_xxl_103055408.jpg`,
      width: 1920,
      height: 1280,
    },
    excerpt:
      "We will help you eliminate your IRS tax debt with proven, personalized relief strategies.",
    description: [
      "We will help you eliminate your IRS Tax Debt! If you owe more than $10,000 to the IRS, our Tax Debt Relief Program is designed to help you find a path forward.",
      "You could be hit with wage garnishments or property seizures. Every day your unpaid tax debt increases due to interest, fees, and penalties.",
      "We will carefully analyze your tax situation and all available IRS programs that will reduce, restructure, or even eliminate portions of your tax debt. Our team negotiates directly with the IRS on your behalf to relieve the pressure of collection calls, wage garnishments, and penalties. With proven strategies, we help you regain control of your finances and move toward stability.",
    ],
    included: [
      "Complete tax debt analysis",
      "IRS program eligibility review",
      "Wage garnishment and levy relief",
      "Dedicated case negotiator",
    ],
    benefits: [
      "Stop Tax Liens",
      "End IRS Garnishments",
      "Cut Penalties & Interest Fees",
      "Flexible Payment Plans",
      "Protect Your Assets",
      "Tax Expert Help",
      "Reduce Additional Stress",
      "Gain Stability",
    ],
  },
];

/** Static-array lookup — used only as a fallback when the database is unreachable. */
export function getServiceBySlugStatic(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

function toService(row: PrismaService): Service {
  return {
    slug: row.slug,
    title: row.title,
    image: {
      src: `${BASE_PATH}${row.image}`,
      width: row.imageWidth,
      height: row.imageHeight,
    },
    excerpt: row.excerpt,
    description: row.description as string[],
    included: row.included as string[],
    benefits: row.benefits as string[],
    paymentLink: row.paymentLink ?? undefined,
  };
}

/** The live, CMS-managed list of published services. Falls back to the
 * static array above only if the database itself is unreachable, so the
 * site degrades gracefully rather than breaking. */
export async function getServices(): Promise<Service[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toService);
  } catch {
    return services;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  try {
    const row = await prisma.service.findUnique({ where: { slug } });
    return row && row.published ? toService(row) : undefined;
  } catch {
    return getServiceBySlugStatic(slug);
  }
}
