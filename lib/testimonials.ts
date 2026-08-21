import { prisma } from "@/lib/db";
import type { Testimonial as PrismaTestimonial } from "@prisma/client";

export type Testimonial = {
  name: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Jasmine R.",
    quote:
      "U.S. Tax Experts helped me resolve a difficult IRS debt issue quickly and professionally. Their team made the process clear, supportive, and stress-free from beginning to end.",
  },
  {
    name: "Malik S.",
    quote:
      "I was struggling with tax problems for years, but U.S. Tax Experts guided me with confidence. They provided reliable solutions and kept me updated every step of the way.",
  },
  {
    name: "Erica L.",
    quote:
      "The team at U.S. Tax Experts exceeded my expectations. They were responsive, thorough, and trustworthy, making sure my financial peace of mind was finally restored.",
  },
  {
    name: "David M.",
    quote:
      "I'd fallen behind on filings for years and dreaded dealing with the IRS. My specialist walked me through every step and negotiated a payment plan I could actually afford.",
  },
  {
    name: "Priya K.",
    quote:
      "Switching our bookkeeping over to U.S. Tax Experts was the best decision we made for our small business. Our books are finally clean, current, and audit-ready.",
  },
  {
    name: "Robert T.",
    quote:
      "A wage garnishment notice sent me into a panic. Within days they had it addressed and negotiated a settlement I never thought was possible. Truly grateful.",
  },
];

function toTestimonial(row: PrismaTestimonial): Testimonial {
  return { name: row.name, quote: row.quote };
}

/** The live, CMS-managed testimonial list. Falls back to the static array
 * above only if the database itself is unreachable. */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toTestimonial);
  } catch {
    return testimonials;
  }
}
