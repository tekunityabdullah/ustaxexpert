import Link from "next/link";
import type { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "solid" | "outline" | "outline-navy";
  size?: "md" | "sm";
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
  onClick?: () => void;
};

const base =
  "group relative inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap text-sm font-semibold uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";

const sizes = {
  md: "px-7 py-3.5",
  sm: "px-4 py-2.5",
};

const variants = {
  solid: "bg-gold-gradient text-navy-ink shadow-[0_8px_20px_rgba(199,154,0,0.25)] hover:shadow-[0_8px_20px_rgba(199,154,0,0.4)]",
  outline:
    "border border-white/70 text-white hover:bg-white hover:text-navy-900",
  "outline-navy":
    "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white",
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
  const { children, variant = "solid", size = "md", className = "" } = props;
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const isExternal = /^https?:\/\//.test(props.href);

    if (isExternal) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          <span className="relative z-10">{children}</span>
          <Shine />
        </a>
      );
    }

    return (
      <Link href={props.href} className={classes}>
        <span className="relative z-10">{children}</span>
        <Shine />
      </Link>
    );
  }

  const { type, disabled, onClick } = props as ButtonProps;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      <span className="relative z-10">{children}</span>
      <Shine />
    </button>
  );
}
