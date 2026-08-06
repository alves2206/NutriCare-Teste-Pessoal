import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  progress?: {
    value: number;
    max: number;
    tone?: "rose" | "sage" | "mauve" | "neutral";
  };
};

export function StatCard({ label, value, helper, icon: Icon, progress }: StatCardProps) {
  return (
    <Card className="min-h-36">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
          <p className="mt-1 text-sm text-stone-500">{helper}</p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
          <Icon aria-hidden="true" size={21} />
        </span>
      </div>
      {progress ? (
        <div className="mt-5">
          <ProgressBar label={label} {...progress} />
        </div>
      ) : null}
    </Card>
  );
}
