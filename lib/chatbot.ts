import { siteConfig } from "@/lib/site-config";
import type { Faq } from "@/lib/faqs";
import type { Service } from "@/lib/services";

export type ChatEntry = {
  question: string;
  answer: string;
  keywords: string[];
};

const tollFree =
  siteConfig.phones.find((p) => p.type === "Toll-Free") ?? siteConfig.phones[0];
const main = siteConfig.phones.find((p) => p.type === "Main") ?? siteConfig.phones[0];

// Extra synonyms per service so casual phrasing ("garnishment", "IRS debt",
// "book keeping") still lands on the right service entry.
const SERVICE_SYNONYMS: Record<string, string[]> = {
  "tax-planning-preparation": ["taxes", "filing", "returns", "deductions", "planning", "prepare", "file"],
  bookkeeping: ["book keeping", "records", "reconciliation", "expenses", "income tracking"],
  accounting: ["accountant", "financial statements", "reporting", "cash flow"],
  "tax-settlement": ["settle", "offer in compromise", "negotiate", "reduce debt", "owe less"],
  "tax-debt-relief": [
    "irs debt", "back taxes", "wage garnishment", "garnishment", "lien", "levy",
    "collections", "owe the irs", "owe irs", "audit",
  ],
};

// Common questions that aren't naturally phrased in the FAQ list, so the
// matcher has a better shot at everyday phrasing ("hours?", "where are you").
function buildQuickIntents(services: Service[]): ChatEntry[] {
  return [
    {
      question: "What services do you offer?",
      answer: `We offer ${services.map((s) => s.title).join(", ")}. Visit Our Services to see full details on each.`,
      keywords: ["services", "offer", "provide", "help with"],
    },
    {
      question: "What are your phone numbers?",
      answer: `You can reach us at ${main.label} (Main) or ${tollFree.label} (Toll-Free).`,
      keywords: ["phone", "number", "call", "telephone", "reach", "contact"],
    },
    {
      question: "What are your business hours?",
      answer: "We're available Monday – Friday, 9:00 AM – 6:00 PM.",
      keywords: ["hours", "open", "time", "schedule", "available", "closed"],
    },
    {
      question: "Where are you located?",
      answer: `Our office is at ${siteConfig.address}, and we serve clients nationwide in all 50 states.`,
      keywords: ["located", "address", "office", "location", "where"],
    },
    {
      question: "How do I book a consultation?",
      answer:
        "You can book a free consultation through our Enroll Now or Contact Us page — no cost, no obligation.",
      keywords: ["book", "schedule", "consultation", "appointment", "enroll", "meeting", "sign up"],
    },
    {
      question: "Do you work with businesses or just individuals?",
      answer:
        "Both — we work with individuals facing IRS debt as well as small businesses needing ongoing bookkeeping, accounting, or tax support.",
      keywords: ["business", "individual", "company", "self employed", "personal"],
    },
    {
      question: "Is my information kept confidential and secure?",
      answer:
        "Yes. Documents and communications are handled through encrypted channels, and your case details are only ever visible to you and your assigned specialist.",
      keywords: ["confidential", "secure", "security", "private", "safe", "encrypted"],
    },
  ];
}

// One "do you offer X" and one "what's included in X" entry per service,
// generated straight from the services data so it stays in sync.
function buildServiceEntries(services: Service[]): ChatEntry[] {
  return services.flatMap((service) => {
    const synonyms = SERVICE_SYNONYMS[service.slug] ?? [];
    return [
      {
        question: `Do you offer ${service.title}?`,
        answer: `Yes — ${service.title}. ${service.excerpt} Learn more on our Our Services page.`,
        keywords: [service.title, ...synonyms],
      },
      {
        question: `What's included in ${service.title}?`,
        answer: `${service.title} includes: ${service.included.join(", ")}.`,
        keywords: [service.title, "included", "package", "what do i get", ...synonyms],
      },
    ];
  });
}

// Chatbot-only knowledge — not shown on the public FAQs page, but gives the
// assistant real answers for the questions people actually type in.
const extraIntents: ChatEntry[] = [
  {
    question: "What documents do I need to get started?",
    answer:
      "It depends on your situation, but typically we'll ask for any recent IRS notices, your last two to three years of tax returns, and a general picture of your income and expenses. Your specialist will give you an exact checklist during your free consultation.",
    keywords: ["documents", "paperwork", "need", "bring", "checklist", "get started"],
  },
  {
    question: "How much do your services cost?",
    answer:
      "Fees depend on the complexity of your case and which service you need. We'll review your situation during your free consultation and give you a clear quote before you commit to anything.",
    keywords: ["cost", "price", "pricing", "fee", "fees", "expensive", "afford"],
  },
  {
    question: "Do you offer payment plans for your fees?",
    answer:
      "Yes, flexible payment options are available for most engagements. Your specialist will walk through what fits your budget during your consultation.",
    keywords: ["payment plan", "installments", "afford", "budget", "financing"],
  },
  {
    question: "What is a tax lien and how does it affect me?",
    answer:
      "A tax lien is the IRS's legal claim against your property when a tax debt goes unpaid, and it can affect your credit and ability to sell or refinance assets. We work to help release or resolve liens as part of a broader debt relief strategy.",
    keywords: ["lien", "tax lien", "property claim", "credit"],
  },
  {
    question: "What is a tax levy?",
    answer:
      "A levy is the IRS actually seizing assets, such as funds from a bank account or wages, to satisfy unpaid tax debt. If you're facing a levy, contact us right away, we can often negotiate a release or resolution before it escalates further.",
    keywords: ["levy", "seize", "bank account", "frozen"],
  },
  {
    question: "Can you help me with an IRS audit?",
    answer:
      "Yes. Our team can represent you during an IRS audit, help you organize documentation, and communicate with the IRS on your behalf so you're not facing it alone.",
    keywords: ["audit", "audited", "irs audit", "examination"],
  },
  {
    question: "What is penalty abatement?",
    answer:
      "Penalty abatement is an IRS program that can reduce or remove certain penalties for taxpayers who qualify, such as those with a reasonable cause or a clean prior compliance history. We evaluate your eligibility as part of your case review.",
    keywords: ["penalty", "penalties", "abatement", "reduce", "waive", "remove"],
  },
  {
    question: "What is an IRS installment agreement?",
    answer:
      "An installment agreement is a monthly payment plan approved by the IRS that lets you pay off tax debt over time instead of all at once. We help structure a plan that fits your budget and gets approved.",
    keywords: ["installment agreement", "monthly payment", "payment plan irs", "pay over time"],
  },
  {
    question: "Do you prepare both individual and business tax returns?",
    answer:
      "Yes, we prepare returns for individuals, self-employed taxpayers, and small businesses, and we handle multi-year filings if you've fallen behind.",
    keywords: ["individual returns", "business returns", "self employed", "small business taxes"],
  },
  {
    question: "Can you help with back taxes from previous years?",
    answer:
      "Yes. We regularly help clients catch up on unfiled or unpaid returns from multiple prior years and build a resolution strategy around the full picture of what's owed.",
    keywords: ["back taxes", "unfiled", "previous years", "prior years", "haven't filed", "behind"],
  },
  {
    question: "What happens after I submit the contact form?",
    answer:
      "A member of our team reviews your submission and reaches out to schedule your free consultation, usually within one business day.",
    keywords: ["after i submit", "what happens next", "response time", "follow up"],
  },
  {
    question: "Can I switch to you from another tax or accounting firm?",
    answer:
      "Absolutely. We can review your prior filings and any correspondence with your previous firm or the IRS, then take over your case going forward.",
    keywords: ["switch firms", "another firm", "previous accountant", "change accountant"],
  },
  {
    question: "How do I reach my specialist once I'm a client?",
    answer:
      "Existing clients can message their assigned specialist directly through the Client Hub, or call our office during business hours for a faster response.",
    keywords: ["reach my specialist", "existing client", "client hub", "message specialist"],
  },
];

export const suggestedQuestions = [
  "What services do you offer?",
  "Do you help with wage garnishment?",
  "How much does a consultation cost?",
  "What's included in Tax Debt Relief?",
  "How do I book a consultation?",
  "Is my information kept confidential?",
];

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "what", "how", "can", "i",
  "you", "your", "to", "of", "for", "in", "on", "and", "or", "my", "me",
  "with", "about", "if", "will", "be", "have", "has", "it", "so", "was",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

/**
 * Builds the chatbot's full knowledge base from live CMS data (faqs and
 * services) plus the fixed intents above. Computed server-side (where the
 * database is reachable) and handed to the client as plain serializable
 * data, since the matcher itself just needs to run entirely in the browser
 * with no further API calls.
 */
export function buildKnowledgeBase(faqs: Faq[], services: Service[]): ChatEntry[] {
  const faqEntries: ChatEntry[] = faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
    keywords: [],
  }));

  return [
    ...buildQuickIntents(services),
    ...buildServiceEntries(services),
    ...extraIntents,
    ...faqEntries,
  ];
}

/**
 * Purely client-side keyword-overlap matcher — no API calls, no backend.
 * Returns the best-matching answer, or null when nothing clears the bar.
 */
export function findBestAnswer(input: string, knowledgeBase: ChatEntry[]): string | null {
  const inputTokens = tokenize(input);
  if (inputTokens.length === 0) return null;

  let best: { entry: ChatEntry; score: number } | null = null;

  for (const entry of knowledgeBase) {
    const entryTokens = new Set([
      ...tokenize(entry.question),
      ...entry.keywords.flatMap((k) => tokenize(k)),
    ]);
    let score = 0;
    for (const token of inputTokens) {
      if (entryTokens.has(token)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  if (best && best.score / inputTokens.length >= 0.3) {
    return best.entry.answer;
  }
  return null;
}
