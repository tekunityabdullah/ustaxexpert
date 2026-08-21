export type TrustBadge = {
  icon: "ShieldCheck" | "Lock" | "BadgeCheck" | "FileCheck2";
  title: string;
  description: string;
};

export const trustBadges: TrustBadge[] = [
  {
    icon: "Lock",
    title: "Bank-Level Encryption",
    description:
      "Every page and document exchange is protected with SSL encryption to keep your information private.",
  },
  {
    icon: "ShieldCheck",
    title: "Confidential & Secure",
    description:
      "Your financial and tax details are handled under strict confidentiality by our licensed specialists.",
  },
  {
    icon: "BadgeCheck",
    title: "IRS Authorized",
    description:
      "We work directly with the IRS on your behalf as an authorized representative for tax resolution matters.",
  },
  {
    icon: "FileCheck2",
    title: "Accredited & Compliant",
    description:
      "Our team follows industry accreditation standards, keeping every engagement compliant and transparent.",
  },
];

export type Accreditation = {
  abbreviation: string;
  name: string;
};

export const accreditations: Accreditation[] = [
  { abbreviation: "AICPA", name: "American Institute of CPAs" },
  { abbreviation: "EA", name: "Enrolled Agent, IRS Authorized" },
  { abbreviation: "NAEA", name: "National Association of Enrolled Agents" },
  { abbreviation: "BBB", name: "Better Business Bureau" },
];
