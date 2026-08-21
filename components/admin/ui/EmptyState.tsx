import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-black/15 px-6 py-16 text-center">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-section text-muted">
        <Icon size={20} />
      </span>
      <p className="text-[15px] font-semibold text-heading">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
