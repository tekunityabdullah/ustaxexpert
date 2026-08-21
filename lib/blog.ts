import { BASE_PATH } from "@/lib/site-config";
import { prisma } from "@/lib/db";
import type { BlogPost as PrismaBlogPost } from "@prisma/client";

// A content block is either a plain paragraph, or a subheading + paragraph
// pair (used for posts sourced from the live site's structured articles).
export type BlogContentBlock = string | { heading: string; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  category: string;
  icon: "Mail" | "LifeBuoy" | "TrendingUp" | "Calculator";
  readTime: string;
  /** BlogContentBlock[] for posts seeded before the rich text editor
   * existed; an HTML string (from the admin CMS's rich text editor) for
   * everything written since. app/blog/[slug]/page.tsx renders both. */
  content: BlogContentBlock[] | string;
  /** Optional featured image (falls back to the icon badge when unset). */
  image?: string;
};

// Starter posts covering the same evergreen topics already referenced in
// the Resource Center and FAQs. Swap in your own posts (and a real byline)
// as they're written — dates and figures below are general guidance only,
// not a substitute for confirming specifics with a specialist.
export const blogPosts: BlogPost[] = [
  {
    slug: "accounting-made-simple",
    title: "Accounting Made Simple",
    excerpt:
      "Accounting doesn't have to feel overwhelming. Here's a plain-language breakdown of what good accounting actually looks like for individuals and small businesses.",
    date: "2025-09-23",
    category: "Accounting",
    icon: "Calculator",
    readTime: "3 min read",
    image: `${BASE_PATH}/images/shutterstock_750073606.jpg`,
    content: [
      {
        heading: "The Importance of Clear Records",
        text: "Accurate records are the foundation of every successful business. They enable owners to monitor finances, track profitability, and satisfy tax requirements. Without dependable documentation, companies struggle to obtain financing, manage expansion, or demonstrate regulatory adherence. Strong documentation supports smooth operations while supplying insights for strategic decisions.",
      },
      {
        heading: "Benefits of Modern Accounting Tools",
        text: "Technology has revolutionized accounting through enhanced efficiency and accuracy. Contemporary software streamlines routine operations, minimizes mistakes, and supplies instantaneous financial information. This approach saves companies time, allowing concentration on development activities rather than administrative work. Digital systems maintain organized, readily available financial information.",
      },
      {
        heading: "How Accountants Support Growth",
        text: "Professional accountants function beyond mere computation, they act as advisors who guide decision-making and strategy. Through examining patterns, discovering efficiency improvements, and guaranteeing adherence, accountants facilitate steady growth. Their knowledge encompasses cash flow oversight through expansion support, positioning them as critical business assets.",
      },
      {
        heading: "Common Pitfalls to Avoid",
        text: "Small and medium-sized businesses often run into accounting problems, including inadequate documentation, commingling personal and company funds, or overlooking account verification. These oversights generate cash management difficulties and potential tax consequences. Early recognition and prevention of these issues strengthen operations and financial stability.",
      },
      {
        heading: "Accounting as a Growth Strategy",
        text: "Accounting functions as a direct contributor to organizational achievement rather than merely back-office operations. Strategic accounting enables effective budgeting, superior forecasting, and strategic investment choices. Companies leveraging accounting methodically demonstrate stronger readiness for advancement and sustained returns.",
      },
    ],
  },
  {
    slug: "smart-tax-planning-tips",
    title: "Smart Tax Planning Tips",
    excerpt:
      "A few practical habits can meaningfully lower what you owe. Here's where to start before the year closes out.",
    date: "2025-09-23",
    category: "Tax Planning",
    icon: "TrendingUp",
    readTime: "3 min read",
    image: `${BASE_PATH}/images/top-view-green-card-application.jpg`,
    content: [
      {
        heading: "Why Tax Planning Matters",
        text: "Many people think about taxes only when filing season arrives, but year-round planning makes a significant difference. Proactive tax planning reduces liabilities, prevents surprises, and ensures compliance with changing laws. Whether for individuals or businesses, tax planning is a crucial tool for maximizing financial security and minimizing unnecessary expenses.",
      },
      {
        heading: "Key Strategies to Save Money",
        text: "Several effective ways to save on taxes exist, including taking advantage of deductions, contributing to retirement accounts, and carefully tracking expenses. Each of these strategies can lower taxable income and provide long-term benefits. With a proactive approach, taxpayers can keep more of their hard-earned money while staying compliant with IRS rules.",
      },
      {
        heading: "Timing Makes a Difference",
        text: "When it comes to taxes, timing is everything. Proper planning throughout the year ensures that you capture all eligible deductions and credits. Waiting until the last moment often means missing out on valuable opportunities. By scheduling tax reviews and making adjustments in advance, you can position yourself for the best results when filing season arrives.",
      },
      {
        heading: "Working with a Tax Advisor",
        text: "Even the most financially savvy individuals can benefit from the expertise of a professional tax advisor. Advisors not only understand complex tax codes but also identify opportunities that clients may overlook. With their guidance, individuals and businesses can navigate tax season with confidence and ensure compliance with the latest regulations.",
      },
      {
        heading: "Building Long-Term Financial Health",
        text: "Tax planning should not be seen as a one-time task, but rather as part of a bigger financial strategy. Consistent planning supports retirement goals, reduces risks, and builds overall financial strength. By integrating tax planning into long-term financial decisions, taxpayers can achieve greater stability and peace of mind.",
      },
    ],
  },
  {
    slug: "resolving-irs-tax-debt",
    title: "Resolving IRS Tax Debt",
    excerpt:
      "Owing the IRS feels urgent and overwhelming, but there are structured programs designed to help. Here's how the process typically works.",
    date: "2025-09-23",
    category: "Tax Debt Relief",
    icon: "LifeBuoy",
    readTime: "4 min read",
    image: `${BASE_PATH}/images/debt-obligation-banking-finance-loan-money-concept.jpg`,
    content: [
      {
        heading: "Understanding Tax Debt Challenges",
        text: "IRS tax debt can create serious financial stress as penalties and interest accumulate over time. Many individuals experience confusion when receiving notices and need guidance on how to respond. Comprehending how tax obligations grow and the ramifications of neglecting them helps taxpayers regain control and progress toward resolution with increased assurance.",
      },
      {
        heading: "Exploring Debt Relief Programs",
        text: "The IRS offers various relief programs including installment agreements, penalty abatement, and offers in compromise. Each option has its own qualifications and benefits, which can make the process confusing for those without guidance. Learning about these options enables taxpayers to identify solutions matching their financial situations.",
      },
      {
        heading: "The Role of Professional Help",
        text: "Navigating IRS matters independently can feel overwhelming when substantial amounts are involved. Tax professionals can advocate for clients directly before the IRS while protecting their interests. With the right professional support, taxpayers are more likely to secure favorable outcomes and reduce unnecessary stress.",
      },
      {
        heading: "Avoiding Costly Mistakes",
        text: "Common errors include disregarding IRS communications and completing forms without proper understanding. By being proactive and avoiding these costly missteps, taxpayers can save both time and money while improving their chances of reaching a resolution.",
      },
      {
        heading: "Planning for a Debt-Free Future",
        text: "Resolving IRS debt is not just about eliminating what is currently owed, it is about building better financial habits for the future. Strategic budgeting, tax planning, and meticulous recordkeeping help prevent future complications.",
      },
    ],
  },
  {
    slug: "understanding-an-irs-notice",
    title: "You Received an IRS Notice — Now What?",
    excerpt:
      "IRS notices can be alarming, but most are routine. Here's how to read one, what deadlines matter, and when to get help.",
    date: "2026-06-02",
    category: "IRS Notices",
    icon: "Mail",
    readTime: "4 min read",
    image: `${BASE_PATH}/images/dreamstime_xxl_103055408.jpg`,
    content: [
      "Receiving a letter from the IRS is stressful, but not every notice means trouble. Notices are sent for a wide range of reasons: a math error on a return, a request for additional information, a proposed change to your balance, or a formal notice of intent to levy or garnish wages.",
      "The first thing to check is the notice type, usually printed in the top right corner (for example, CP2000 or CP504). This code tells you what the letter is actually about and what response, if any, is required.",
      "Next, check the response deadline. Many notices give you 30 days to respond or request an appeal before the IRS moves forward with an assessment or collection action. Missing a deadline can limit your options later, so don't set the letter aside.",
      "Finally, avoid responding to the IRS directly before understanding what you're agreeing to. A specialist can review the notice, confirm whether the IRS's numbers are correct, and help you respond in a way that protects your position.",
      "If you've received a notice, send us a copy as soon as possible so we can review it before any deadline passes.",
    ],
  },
  {
    slug: "5-signs-you-need-tax-debt-relief",
    title: "5 Signs It's Time to Explore Tax Debt Relief",
    excerpt:
      "Unpaid IRS debt gets more expensive the longer it sits. Here are five signals it's time to talk to a specialist.",
    date: "2026-05-14",
    category: "Tax Debt Relief",
    icon: "LifeBuoy",
    readTime: "3 min read",
    image: `${BASE_PATH}/images/close-up-two-businessmen-pointing-business-chart-meeting-2048x1556-1.jpg`,
    content: [
      "1. You owe more than $10,000 and the balance keeps growing. Interest and penalties compound over time, so a manageable balance can snowball quickly.",
      "2. You've received a Notice of Intent to Levy. This is one of the final steps before the IRS can garnish wages or levy a bank account, and it comes with a strict response window.",
      "3. You're juggling multiple years of unfiled or amended returns. Resolution programs generally require you to be current on filings before they can be approved.",
      "4. Collection calls and letters have become a regular part of your week. That stress is a sign it's time to have someone negotiate on your behalf.",
      "5. You're not sure which IRS program you'd even qualify for. Options like an Offer in Compromise, an installment agreement, or penalty abatement all have different eligibility rules, and a specialist can tell you which path fits your situation.",
    ],
  },
  {
    slug: "estimated-quarterly-tax-deadlines",
    title: "Estimated Quarterly Tax Deadlines: What to Know",
    excerpt:
      "If you're self-employed or have income without withholding, estimated payments keep you ahead of penalties. Here's the general schedule.",
    date: "2026-04-01",
    category: "Tax Planning",
    icon: "TrendingUp",
    readTime: "3 min read",
    image: `${BASE_PATH}/images/edc8c405-2048x1152-1.jpg`,
    content: [
      "If you're self-employed, a business owner, or have significant income without tax withholding, the IRS generally expects estimated tax payments four times a year rather than one lump sum at filing time.",
      "Estimated payments are typically due in mid-April, June, September, and January of the following year. Because these dates can shift slightly year to year (for weekends and holidays), always confirm the exact date for the current tax year rather than assuming it matches last year's calendar.",
      "Underpaying — or paying late — can trigger an underpayment penalty even if you pay your full balance by the annual filing deadline. Working with your tax planner throughout the year, rather than only at filing time, is the most reliable way to estimate the right payment amount.",
      "Not sure if you should be making estimated payments, or how much to send? That's a conversation worth having before the next deadline, not after.",
    ],
  },
  {
    slug: "bookkeeping-vs-accounting",
    title: "Bookkeeping vs. Accounting: What's the Difference?",
    excerpt:
      "The two terms get used interchangeably, but they cover different parts of keeping your finances healthy.",
    date: "2026-03-10",
    category: "Bookkeeping",
    icon: "Calculator",
    readTime: "3 min read",
    image: `${BASE_PATH}/images/1616737296-blogging-tips-linkedin-post-header-82-2048x1152-1.jpg`,
    content: [
      "Bookkeeping is the day-to-day work: recording income and expenses, reconciling bank and credit card statements, and keeping your transaction history organized and accurate.",
      "Accounting builds on that foundation. It takes the data bookkeeping produces and turns it into financial statements, tax filings, and the kind of reporting you'd use to make decisions or apply for financing.",
      "In practice, most individuals and small businesses need both, often working together. Clean books make accurate accounting possible, and accurate accounting is what keeps you compliant and audit-ready.",
      "If your records have fallen behind, catching up on bookkeeping is usually the first step before any tax planning or resolution work can move forward.",
    ],
  },
];

/** Static-array lookup — used only as a fallback when the database is unreachable. */
export function getBlogPostBySlugStatic(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

const VALID_ICONS = ["Mail", "LifeBuoy", "TrendingUp", "Calculator"] as const;

function toBlogPost(row: PrismaBlogPost): BlogPost {
  const icon = (VALID_ICONS as readonly string[]).includes(row.icon)
    ? (row.icon as BlogPost["icon"])
    : "Mail";

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date.toISOString(),
    category: row.category,
    icon,
    readTime: row.readTime,
    content: row.content as BlogContentBlock[] | string,
    image: row.image ? `${BASE_PATH}${row.image}` : undefined,
  };
}

/** The live, CMS-managed post list. Falls back to the static array above
 * only if the database itself is unreachable. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });
    return rows.map(toBlogPost);
  } catch {
    return blogPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    return row && row.published ? toBlogPost(row) : undefined;
  } catch {
    return getBlogPostBySlugStatic(slug);
  }
}
