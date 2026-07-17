import Link from "next/link";
import type { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
  type?: never;
};

type ButtonProps = BaseProps & {
  href?: never;
  type: "button" | "submit";
  disabled?: boolean;
};

const base =
  "group relative inline-flex items-center justify-center overflow-hidden px-7 py-3.5 text-sm font-semibold uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  solid: "bg-gold-gradient text-navy-ink shadow-[0_8px_20px_rgba(221,166,46,0.25)] hover:shadow-[0_8px_20px_rgba(221,166,46,0.4)]",
  outline:
    "border border-white/70 text-white hover:bg-white hover:text-navy-900",
};

function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-[120%] -skew-x-[20deg] bg-white/30 transition-transform duration-500 group-hover:translate-x-[120%]"
    />
  );
}

export default function CtaButton(props: LinkProps | ButtonProps) {
  const { children, variant = "solid", className = "" } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        <span className="relative z-10">{children}</span>
        <Shine />
      </Link>
    );
  }

  const { type, disabled } = props as ButtonProps;
  return (
    <button type={type} disabled={disabled} className={classes}>
      <span className="relative z-10">{children}</span>
      <Shine />
    </button>
  );
}
