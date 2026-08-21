import { CheckCircle2 } from "lucide-react";
import { resultCategories } from "@/lib/case-studies";
import Reveal from "@/components/ui/Reveal";

export default function ResultCategories() {
  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {resultCategories.map((item, index) => (
          <Reveal
            key={item.title}
            direction={index % 2 === 0 ? "left" : "right"}
            delay={Math.floor(index / 2) * 0.1}
            className="flex gap-4 rounded-lg border border-black/10 bg-white p-6"
          >
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-gold-600" />
            <div>
              <h4 className="mb-1.5">{item.title}</h4>
              <p className="text-[15px] leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        Results vary by case and are not guaranteed. Individual outcomes
        depend on your specific tax situation and IRS eligibility criteria.
      </p>
    </div>
  );
}
