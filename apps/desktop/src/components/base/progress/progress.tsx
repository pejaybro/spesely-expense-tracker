import { useState, useRef, useLayoutEffect } from "react";
import "./progress.css";
import type { ProgressProps } from "./types";

export function Progress({
  value,
  variant = "line",
  height = 6,
  showLabel = false,
  showCircleLabel = true,
  segments,
  label,
  labelPosition = "top",
}: ProgressProps) {
  // Clamp value between 0 and 100
  const pct = Math.max(0, Math.min(100, value));

  // Layout states for segmented auto-configuration
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (variant !== "segmented") return;

    const el = containerRef.current;
    if (!el) return;

    setContainerWidth(el.offsetWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant]);

  /* ── Header Split Layout Node (Text Left, % Right) ────────── */
  const renderHeader = (defaultText = "Progress") => {
    if (!showLabel && !label) return null;
    return (
      <div className="flex items-center justify-between w-full animate-fade-in">
        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
          {label || defaultText}
        </span>
        {showLabel && (
          <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  };

  /* ── [1] Circular Progress Ring ────────────────────────────── */
  if (variant === "circle") {
    const size = 48;
    const strokeWidth = 3.5;
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;

    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
            />
            {/* Foreground Fill */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth={strokeWidth}
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          {showCircleLabel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white font-mono">{Math.round(pct)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── [2] Segmented Progress Bar (Auto or Manual) ────────────── */
  if (variant === "segmented") {
    // 12px per segment slot (8px width + 4px gap)
    const segmentsCount = segments !== undefined
      ? segments
      : containerWidth > 0
      ? Math.max(3, Math.floor(containerWidth / 12))
      : 10; // Fallback before width is measured

    return (
      <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
        {labelPosition === "top" && renderHeader("Status")}
        <div className="flex gap-1 w-full" style={{ height }}>
          {Array.from({ length: segmentsCount }).map((_, i) => {
            const minReq = (i / segmentsCount) * 100;
            const isLit = pct > minReq;

            return (
              <div
                key={i}
                className={`flex-1 h-full rounded transition-all duration-300 ${
                  isLit ? "bg-white" : "bg-zinc-900"
                }`}
              />
            );
          })}
        </div>
        {labelPosition === "bottom" && renderHeader("Status")}
      </div>
    );
  }

  /* ── [3] Linear Progress Bars (Line / Gradient) ─────────────── */
  return (
    <div className="w-full flex flex-col gap-1.5">
      {labelPosition === "top" && renderHeader("Progress")}

      <div
        className="w-full bg-zinc-900 rounded-full overflow-hidden relative"
        style={{ height }}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            variant === "gradient"
              ? "bg-gradient-to-r from-zinc-700 via-zinc-300 to-white"
              : variant === "striped"
              ? "bg-white progress-striped-fill"
              : "bg-white"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {labelPosition === "bottom" && renderHeader("Progress")}
    </div>
  );
}
