export type ResultCategory = {
  title: string;
  description: string;
};

// Illustrative categories of outcomes, not specific client claims.
// Replace with real, anonymized case studies (with any required
// results disclaimers) once available.
export const resultCategories: ResultCategory[] = [
  {
    title: "Offer in Compromise Settlements",
    description:
      "Helping qualifying clients settle IRS debt for less than the full amount owed through negotiated agreements.",
  },
  {
    title: "Wage Garnishment & Levy Releases",
    description:
      "Working with the IRS to release or reduce active wage garnishments, bank levies, and property liens.",
  },
  {
    title: "Penalty Abatement",
    description:
      "Requesting reduction or removal of IRS penalties for clients who qualify, easing the overall debt burden.",
  },
  {
    title: "Installment Agreements",
    description:
      "Structuring manageable, IRS-approved payment plans so clients can resolve debt without financial strain.",
  },
];
