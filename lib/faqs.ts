import { prisma } from "@/lib/db";
import type { Faq as PrismaFaq } from "@prisma/client";

export type FaqCategory =
  | "Getting Started"
  | "Tax Debt Relief"
  | "Accounting & Planning"
  | "Working With Us";

export type Faq = {
  question: string;
  answer: string;
  category: FaqCategory;
};

export const faqs: Faq[] = [
  {
    question: "Who does U.S. Tax Experts help?",
    answer:
      "We specialize in assisting individuals and businesses across all 50 states who owe more than $10,000 in IRS tax debt, as well as those seeking accounting, bookkeeping, and tax preparation services.",
    category: "Getting Started",
  },
  {
    question: "Can you really reduce or settle my IRS tax debt?",
    answer:
      "Yes. Depending on your financial situation, you may qualify for programs such as an Offer in Compromise, installment agreements, or penalty relief. We evaluate your case and negotiate directly with the IRS to find the best possible solution.",
    category: "Tax Debt Relief",
  },
  {
    question: "What is the difference between tax debt relief and tax settlement?",
    answer:
      "Tax debt relief refers to strategies that reduce or manage your tax debt burden, while a tax settlement is a specific agreement with the IRS that allows you to pay less than the total amount owed.",
    category: "Tax Debt Relief",
  },
  {
    question: "How do you stop IRS tax liens or levies?",
    answer:
      "We take immediate action by contacting the IRS and negotiating on your behalf. Our goal is to protect your wages, bank accounts, and property from seizure while creating a plan to resolve the underlying debt.",
    category: "Tax Debt Relief",
  },
  {
    question: "Do I need ongoing bookkeeping and accounting services?",
    answer:
      "Yes, accurate bookkeeping and accounting are essential to staying compliant and avoiding future IRS issues. They also provide clarity on your finances and help you make smarter business decisions.",
    category: "Accounting & Planning",
  },
  {
    question: "How does tax planning save me money?",
    answer:
      "Our proactive tax planning strategies identify deductions, credits, and legal ways to minimize your tax liability. By preparing ahead of time, you reduce risks and maximize savings when filing your returns.",
    category: "Accounting & Planning",
  },
  {
    question: "How can I get started with U.S. Tax Experts?",
    answer:
      "Simply call us at 1 (800) 316-4033 or 1 (832) 390-2347, or fill out the contact form on our website. We'll schedule a free consultation to review your situation and outline your best options.",
    category: "Getting Started",
  },
  {
    question: "How much does a consultation cost?",
    answer:
      "Your first consultation with U.S. Tax Experts is completely free. We'll review your situation, explain your options, and outline a recommended path forward before you commit to anything.",
    category: "Getting Started",
  },
  {
    question: "What is an Offer in Compromise?",
    answer:
      "An Offer in Compromise is an IRS program that allows qualifying taxpayers to settle their tax debt for less than the full amount owed. Our specialists evaluate your eligibility and prepare the documentation needed to present the strongest possible case.",
    category: "Tax Debt Relief",
  },
  {
    question: "How long does the tax debt relief process take?",
    answer:
      "Timelines vary based on the complexity of your case and the IRS programs involved, but most clients see meaningful progress within the first few weeks. We keep you updated at every stage of the process.",
    category: "Tax Debt Relief",
  },
  {
    question: "Can you help if I already have a wage garnishment or lien?",
    answer:
      "Yes. We negotiate directly with the IRS on your behalf and can work toward releasing or reducing wage garnishments, liens, and levies as part of a broader resolution strategy.",
    category: "Tax Debt Relief",
  },
  {
    question: "Do you work with clients outside of Texas?",
    answer:
      "Yes, we serve individuals and businesses in all 50 states with the same personalized, hands-on approach regardless of where you're located.",
    category: "Working With Us",
  },
  {
    question: "What's the difference between bookkeeping and accounting?",
    answer:
      "Bookkeeping is the day-to-day recording of income, expenses, and transactions. Accounting builds on that data to provide financial reporting, tax compliance, and strategic insight. We offer both, often together, to keep your finances accurate and audit-ready.",
    category: "Accounting & Planning",
  },
  {
    question: "What should I do if I receive an IRS notice?",
    answer:
      "Don't ignore it, and don't panic. Send us a copy as soon as possible so our team can review the notice, confirm the deadline it references, and outline your options before you respond to the IRS directly.",
    category: "Working With Us",
  },
  {
    question: "When are estimated quarterly tax payments due?",
    answer:
      "Estimated payments are generally due in mid-April, June, September, and January of the following year. Exact dates can shift slightly each year, so we recommend confirming your specific deadlines with our team as part of your tax planning.",
    category: "Accounting & Planning",
  },
  {
    question: "Is my information kept confidential?",
    answer:
      "Yes. All documents and communications are handled through encrypted channels, and your case details are only accessible to you and your assigned specialist.",
    category: "Working With Us",
  },
];

export const faqCategories: FaqCategory[] = [
  "Getting Started",
  "Tax Debt Relief",
  "Accounting & Planning",
  "Working With Us",
];

function toFaq(row: PrismaFaq): Faq {
  return {
    question: row.question,
    answer: row.answer,
    category: row.category as FaqCategory,
  };
}

/** The live, CMS-managed FAQ list. Falls back to the static array above
 * only if the database itself is unreachable. */
export async function getFaqs(): Promise<Faq[]> {
  try {
    const rows = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toFaq);
  } catch {
    return faqs;
  }
}
