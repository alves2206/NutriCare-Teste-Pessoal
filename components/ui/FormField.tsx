import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  rightSlot?: ReactNode;
};

export function FormField({ label, error, rightSlot, id, className, ...props }: FormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="block text-sm font-medium text-ink" htmlFor={fieldId}>
      {label}
      <span className="relative mt-2 block">
        <input
          id={fieldId}
          className={`min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 text-ink outline-none transition placeholder:text-stone-400 focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100 ${className ?? ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {rightSlot ? <span className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</span> : null}
      </span>
      {error ? (
        <span id={`${fieldId}-error`} className="mt-2 block text-xs text-rosepetal-500">
          {error}
        </span>
      ) : null}
    </label>
  );
}
