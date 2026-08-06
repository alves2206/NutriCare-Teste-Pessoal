"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  createWeightAction,
  updateWeightAction,
  type WeightActionResult
} from "@/app/evolucao/actions";
import type { WeightEntry } from "@/types/nutrition";

type WeightFormProps = {
  initialEntry?: WeightEntry | null;
  onCancel: () => void;
  onDone: (result: WeightActionResult) => void;
};

export function WeightForm({ initialEntry, onCancel, onDone }: WeightFormProps) {
  const [date, setDate] = useState(initialEntry?.date ?? new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState(initialEntry?.weightKg ?? 0);
  const [notes, setNotes] = useState(initialEntry?.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("date", date);
    formData.set("weightKg", String(weightKg));
    formData.set("notes", notes);

    startTransition(async () => {
      const result = initialEntry
        ? await updateWeightAction(initialEntry.id, formData)
        : await createWeightAction(formData);

      if (!result.ok) {
        setMessage(result.message);
        return;
      }

      onDone(result);
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Data
          <input
            type="date"
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-ink">
          Peso em kg
          <input
            type="number"
            step="0.01"
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            value={weightKg}
            onChange={(event) => setWeightKg(Number(event.target.value))}
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-ink">
        Observação
        <textarea
          className="mt-2 min-h-24 w-full rounded-2xl border border-rosepetal-100 bg-white p-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
      {message ? (
        <p className="rounded-2xl bg-rosepetal-50 px-4 py-3 text-sm text-rosepetal-500">
          {message}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" type="button" onClick={onCancel}>
          <X size={18} aria-hidden="true" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save size={18} aria-hidden="true" />
          {isPending ? "Salvando..." : "Salvar peso"}
        </Button>
      </div>
    </form>
  );
}
