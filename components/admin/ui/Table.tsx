import type { ReactNode } from "react";

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <table className="w-full min-w-max border-collapse text-left text-[14px]">{children}</table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-section text-[12px] font-semibold tracking-wide text-muted uppercase">
      <tr>{children}</tr>
    </thead>
  );
}

export function AdminTh({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

export function AdminTbody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-black/5">{children}</tbody>;
}

export function AdminTr({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <tr className={`transition-colors hover:bg-section/60 ${className}`}>{children}</tr>;
}

export function AdminTd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 align-middle text-body ${className}`}>{children}</td>;
}
