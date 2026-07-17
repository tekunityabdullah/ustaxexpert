export type Service = {
  slug: string;
  title: string;
  image: { src: string; width: number; height: number };
  excerpt: string;
  description: string[];
};

export const services: Service[] = [
  {
    slug: "tax-planning-preparation",
    title: "Tax Planning & Preparation",
    image: {
      src: "/images/edc8c405-2048x1152-1.jpg",
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
  },
  {
    slug: "bookkeeping",
    title: "Bookkeeping",
    image: {
      src: "/images/1616737296-blogging-tips-linkedin-post-header-82-2048x1152-1.jpg",
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
  },
  {
    slug: "accounting",
    title: "Accounting",
    image: {
      src: "/images/download-4.jpg",
      width: 304,
      height: 166,
    },
    excerpt:
      "Accurate financial reporting and tax compliance for individuals and businesses.",
    description: [
      "Accurate accounting is the foundation of financial success for both individuals and businesses. Our accounting services cover everything from financial reporting to tax compliance, ensuring your records are always accurate and up to date.",
      "With our expert guidance, you'll gain a clear understanding of your cash flow, expenses, and opportunities for savings. We help you stay IRS-compliant while also providing the insights you need to make confident financial decisions.",
    ],
  },
  {
    slug: "tax-settlement",
    title: "Tax Settlement",
    image: {
      src: "/images/close-up-two-businessmen-pointing-business-chart-meeting-2048x1556-1.jpg",
      width: 2048,
      height: 1556,
    },
    excerpt:
      "Resolve your IRS debt for less than the full amount you owe through proven settlement programs.",
    description: [
      "A tax settlement allows you to resolve your IRS debt for less than the full amount you owe. Through programs like the Offer in Compromise and other relief options, we negotiate with the IRS to reduce your liability based on your ability to pay.",
      "Our specialists work closely with you to prepare strong documentation and present the best possible case for settlement. By leveraging our expertise, you may be able to settle your tax debt for pennies on the dollar.",
    ],
  },
  {
    slug: "tax-debt-relief",
    title: "Tax Debt Relief",
    image: {
      src: "/images/dreamstime_xxl_103055408.jpg",
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
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
