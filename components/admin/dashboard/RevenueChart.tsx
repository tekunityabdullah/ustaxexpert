"use client";

import { useState } from "react";

export type RevenueChartPoint = {
  /** Short axis label, e.g. "Aug 10" */
  label: string;
  /** Full date label for the tooltip, e.g. "Saturday, August 10" */
  fullLabel: string;
  /** Amount in cents */
  value: number;
};

const CHART_HEIGHT = 160;

export default function RevenueChart({ data }: { data: RevenueChartPoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 100 / data.length;
  const active = activeIndex !== null ? data[activeIndex] : null;

  function formatMoney(cents: number) {
    return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  return (
    <div className="relative">
      {active && (
        <div
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 -translate-y-full rounded-md border border-black/10 bg-navy-900 px-2.5 py-1.5 text-center whitespace-nowrap shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
          style={{ left: `${(activeIndex! + 0.5) * barWidth}%` }}
        >
          <p className="text-[12px] font-semibold text-white">{formatMoney(active.value)}</p>
          <p className="text-[10.5px] text-white/60">{active.fullLabel}</p>
        </div>
      )}

      <svg
        viewBox={`0 0 100 ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className="h-40 w-full overflow-visible"
        role="img"
        aria-label="Revenue trend, last 14 days"
      >
        <line x1="0" y1={CHART_HEIGHT - 20} x2="100" y2={CHART_HEIGHT - 20} stroke="#e5e7eb" strokeWidth="0.5" />
        {data.map((point, i) => {
          const barH = (point.value / max) * (CHART_HEIGHT - 30);
          const x = i * barWidth;
          const isActive = activeIndex === i;
          return (
            <g
              key={point.label + i}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${point.fullLabel}: ${formatMoney(point.value)}`}
              className="cursor-pointer outline-none"
            >
              {/* Invisible full-height hit area so hovering the gap under a short bar still activates it */}
              <rect x={x} y={0} width={barWidth} height={CHART_HEIGHT - 20} fill="transparent" />
              <rect
                x={x + barWidth * 0.22}
                y={CHART_HEIGHT - 20 - barH}
                width={barWidth * 0.56}
                height={Math.max(barH, point.value > 0 ? 2 : 0)}
                rx="1.5"
                className={isActive ? "fill-gold-500" : "fill-navy-800"}
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-1.5 flex text-[10.5px] text-muted">
        {data.map((point, i) => (
          <span
            key={point.label + i}
            style={{ width: `${barWidth}%` }}
            className={`text-center ${i % Math.ceil(data.length / 7) === 0 ? "" : "opacity-0"}`}
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}
