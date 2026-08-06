import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <Card className="grid min-h-56 place-items-center text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-mauve-100 text-mauve-500">
          <Icon aria-hidden="true" size={22} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
      </div>
    </Card>
  );
}
