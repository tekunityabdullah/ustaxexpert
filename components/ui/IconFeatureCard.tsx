import type { LucideIcon } from "lucide-react";

export default function IconFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative isolate overflow-hidden rounded-xl bg-white p-8 transition-colors duration-300">
      <span
        aria-hidden
        className="absolute inset-0 -z-10 w-0 bg-navy-600 transition-[width] duration-300 ease-out group-hover:w-full"
      />
      <span className="bg-gold-gradient mb-5 flex h-16 w-16 items-center justify-center rounded-lg">
        <Icon size={26} className="text-navy-ink" />
      </span>
      <h4 className="mb-2 transition-colors duration-300 group-hover:text-white">
        {title}
      </h4>
      <p className="text-[15px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-white/85">
        {description}
      </p>
    </div>
  );
}
