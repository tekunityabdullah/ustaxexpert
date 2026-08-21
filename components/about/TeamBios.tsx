import { Briefcase } from "lucide-react";
import { teamRoles } from "@/lib/team";
import Reveal from "@/components/ui/Reveal";

export default function TeamBios() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {teamRoles.map((member, index) => (
        <Reveal key={member.role} direction="up" delay={index * 0.1}>
          <div className="relative flex h-full flex-col rounded-2xl border border-black/5 bg-white p-7 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
            <Briefcase
              size={72}
              aria-hidden
              className="pointer-events-none absolute top-5 right-5 z-0 text-navy-900/4"
              fill="currentColor"
              strokeWidth={0}
            />

            <span className="relative z-10 mb-3 inline-block w-fit text-xs font-semibold tracking-wide text-gold-600 uppercase">
              {member.focus}
            </span>

            <p className="relative z-10 flex-1 text-[15px] leading-relaxed text-body">
              {member.bio}
            </p>

            <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                {member.initials}
              </span>
              <div>
                <h4 className="text-[15px]">{member.role}</h4>
                <p className="text-xs text-muted">U.S. Tax Experts</p>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
