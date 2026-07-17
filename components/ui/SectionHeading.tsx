type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p className="mb-2 text-lg font-semibold text-gold-600">{eyebrow}</p>
      )}
      <h2 className={light ? "text-white" : undefined}>{title}</h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-7 ${
            light ? "text-white/85" : "text-body"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
