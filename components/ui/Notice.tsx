import type { ReactNode } from "react";
import { Info } from "lucide-react";

type NoticeProps = {
  children: ReactNode;
};

export function Notice({ children }: NoticeProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-sage-100 bg-sage-100/60 p-4 text-sm leading-6 text-stone-700">
      <Info className="mt-0.5 size-5 shrink-0 text-sage-500" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
