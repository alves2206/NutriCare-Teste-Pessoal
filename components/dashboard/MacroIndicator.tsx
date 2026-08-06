import type { LucideIcon } from "lucide-react";
import { formatNumberBR } from "@/lib/formatters";
import { ProgressBar } from "@/components/ui/ProgressBar";

type MacroIndicatorProps = {
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: LucideIcon;
  tone?: "rose" | "sage" | "mauve" | "neutral";
};

export function MacroIndicator({
  label,
  value,
  target,
  unit,
  icon: Icon,
  tone = "rose"
}: MacroIndicatorProps) {
  return (
    <div className="rounded-2xl bg-white/72 p-4 ring-1 ring-white">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-rosepetal-50 text-rosepetal-500">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-stone-500">
            {formatNumberBR(value)} de {formatNumberBR(target)} {unit}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <ProgressBar label={label} value={value} max={target} tone={tone} />
      </div>
    </div>
  );
}
