import { accreditations } from "@/lib/trust";

export default function AccreditationsStrip({ bordered = true }: { bordered?: boolean }) {
  return (
    <div className={bordered ? "border-t border-black/10 pt-10" : ""}>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-4">
        {accreditations.map((item) => (
          <div key={item.abbreviation} className="bg-white px-4 py-6 text-center" title={item.name}>
            <p className="text-xl font-extrabold text-navy-900">{item.abbreviation}</p>
            <p className="mt-1 text-xs text-muted">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
