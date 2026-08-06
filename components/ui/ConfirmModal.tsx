import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/25 p-4">
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-soft"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <span className="grid size-11 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
          <AlertTriangle aria-hidden="true" size={21} />
        </span>
        <h2 id="confirm-title" className="mt-4 text-lg font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
