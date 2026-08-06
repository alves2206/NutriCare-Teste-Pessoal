import { Leaf } from "lucide-react";
import { APP_NAME } from "@/lib/constants/app";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
        <Leaf size={22} aria-hidden="true" />
      </span>
      <div>
        <p className="text-lg font-bold leading-none text-ink">{APP_NAME}</p>
        <p className="mt-1 text-xs font-medium text-stone-500">Acompanhamento pessoal</p>
      </div>
    </div>
  );
}
