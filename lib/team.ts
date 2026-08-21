export type TeamRole = {
  initials: string;
  role: string;
  focus: string;
  bio: string;
};

// Role-based profiles for the team that works your case. Written to be
// accurate to how the practice operates without attaching invented names
// or specific license numbers to individuals we can't verify.
export const teamRoles: TeamRole[] = [
  {
    initials: "TR",
    role: "Lead Tax Resolution Specialist",
    focus: "IRS Negotiations",
    bio: "Leads our tax debt resolution practice, working directly with the IRS on Offers in Compromise, installment agreements, and penalty abatement for clients across all 50 states. Builds the strongest possible case for every client, from first review to final resolution.",
  },
  {
    initials: "TA",
    role: "Senior Tax Accountant",
    focus: "Tax Planning & Filing",
    bio: "Oversees tax planning and preparation for individuals, self-employed taxpayers, and small businesses. Takes a proactive, year-round approach to identifying deductions and credits, so clients keep more of what they earn while staying fully compliant.",
  },
  {
    initials: "BA",
    role: "Bookkeeping & Accounting Manager",
    focus: "Bookkeeping & Reporting",
    bio: "Manages day-to-day bookkeeping and financial reporting, keeping client books accurate, reconciled, and audit-ready. Delivers the clean, real-time financial picture business owners need to make confident decisions.",
  },
  {
    initials: "CR",
    role: "Client Relations Director",
    focus: "Client Communication",
    bio: "Serves as your main point of contact from first consultation through resolution, translating IRS correspondence into clear next steps and keeping you informed at every stage of your case.",
  },
];
