import type { ReactNode } from "react";

export default function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  /** Wider cap for rows that need more breathing room, e.g. the header. */
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full ${wide ? "max-w-380" : "max-w-330"} px-5 lg:px-6 ${className}`}
    >
      {children}
    </div>
  );
}
