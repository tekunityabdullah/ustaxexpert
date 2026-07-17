import Image from "next/image";

export default function FeatureCard({
  icon,
  number,
  title,
  description,
}: {
  icon: string;
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
      <div className="mb-5 flex items-center justify-between">
        <Image src={icon} alt="" width={60} height={60} className="h-[60px] w-[60px] object-contain" />
        <span className="bg-gold-gradient flex h-[50px] w-[50px] items-center justify-center rounded-full text-lg font-bold text-navy-ink">
          {number}
        </span>
      </div>
      <h6 className="mb-2.5 text-xl font-bold text-[#111111]">{title}</h6>
      <p className="text-[15px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}
