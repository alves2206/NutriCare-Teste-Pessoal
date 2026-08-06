import { CheckCircle2 } from "lucide-react";

type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-soft sm:left-auto sm:right-6 sm:w-80">
      <CheckCircle2 size={18} aria-hidden="true" />
      {message}
    </div>
  );
}
