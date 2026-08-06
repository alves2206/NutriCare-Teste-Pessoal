import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  tone?: "rose" | "sage" | "mauve" | "neutral";
};

const tones = {
  rose: "bg-rosepetal-400",
  sage: "bg-sage-500",
  mauve: "bg-mauve-500",
  neutral: "bg-ink"
};

export function ProgressBar({ value, max, label, tone = "rose" }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-xs text-stone-500">{Math.round(percent)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
        <div
          className={cn("h-full rounded-full transition-all", tones[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
