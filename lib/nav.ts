export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Services", href: "/our-services" },
  { label: "FAQs", href: "/faqs" },
  { label: "Resource Center", href: "/resource-center" },
  { label: "Client Hub", href: "/client-hub" },
];
