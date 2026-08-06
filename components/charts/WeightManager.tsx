"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Scale, Trash2 } from "lucide-react";
import { WeightChart } from "@/components/charts/WeightChart";
import { WeightForm } from "@/components/forms/WeightForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { deleteWeightAction } from "@/app/evolucao/actions";
import { formatDateBR, formatNumberBR } from "@/lib/formatters";
import type { WeightEntry } from "@/types/nutrition";

type WeightManagerProps = {
  entries: WeightEntry[];
  persistenceEnabled: boolean;
};

const periods = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "Total", days: null }
];

export function WeightManager({ entries, persistenceEnabled }: WeightManagerProps) {
  const [periodDays, setPeriodDays] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<WeightEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredEntries = useMemo(() => {
    if (periodDays === null || entries.length === 0) {
      return entries;
    }

    const last = new Date(`${entries[entries.length - 1].date}T12:00:00`);
    const start = new Date(last);
    start.setDate(start.getDate() - periodDays + 1);
    const startValue = start.toISOString().slice(0, 10);

    return entries.filter((entry) => entry.date >= startValue);
  }, [entries, periodDays]);

  const first = entries[0] ?? null;
  const last = entries[entries.length - 1] ?? null;
  const difference = first && last ? Number((last.weightKg - first.weightKg).toFixed(1)) : 0;

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function confirmDelete() {
    if (!deletingEntry) {
      return;
    }

    startTransition(async () => {
      const result = await deleteWeightAction(deletingEntry.id);
      setDeletingEntry(null);
      showToast(result.message);
    });
  }

  return (
    <div className="space-y-6">
      {!persistenceEnabled ? (
        <Card className="border-mauve-100 bg-mauve-50/70">
          <p className="text-sm leading-6 text-stone-700">
            Você está vendo pesos demonstrativos. Configure o Supabase para registrar sua evolução real.
          </p>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <WeightStat label="Peso atual" value={last ? `${formatNumberBR(last.weightKg)} kg` : "Sem registro"} />
        <WeightStat label="Peso inicial" value={first ? `${formatNumberBR(first.weightKg)} kg` : "Sem registro"} />
        <WeightStat
          label="Diferença"
          value={entries.length > 1 ? `${difference > 0 ? "+" : ""}${formatNumberBR(difference)} kg` : "Sem comparação"}
        />
      </div>
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
            <Scale size={20} aria-hidden="true" />
            Gráfico de peso
          </h2>
          <div className="grid grid-cols-4 gap-1 rounded-2xl bg-stone-50 p-1 text-sm font-semibold">
            {periods.map((period) => (
              <button
                className={`min-h-10 rounded-xl px-2 ${periodDays === period.days ? "bg-white text-ink shadow-sm" : "text-stone-500"}`}
                key={period.label}
                type="button"
                onClick={() => setPeriodDays(period.days)}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
        {filteredEntries.length > 0 ? (
          <WeightChart entries={filteredEntries} />
        ) : (
          <EmptyState
            icon={Scale}
            title="Sem registros para exibir"
            description="Registre seu peso para acompanhar a evolução em gráfico."
          />
        )}
      </Card>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-ink">Registros de peso</h2>
          <Button
            disabled={!persistenceEnabled}
            onClick={() => {
              setEditingEntry(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={18} aria-hidden="true" />
            Registrar peso
          </Button>
        </div>
        {isFormOpen ? (
          <div className="mt-5">
            <WeightForm
              initialEntry={editingEntry}
              onCancel={() => setIsFormOpen(false)}
              onDone={(result) => {
                setIsFormOpen(false);
                showToast(result.message);
              }}
            />
          </div>
        ) : null}
        <div className="mt-4 divide-y divide-stone-100">
          {entries
            .slice()
            .reverse()
            .map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold text-ink">{formatNumberBR(entry.weightKg)} kg</p>
                  <p className="text-sm text-stone-500">{formatDateBR(entry.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="hidden max-w-44 text-right text-sm text-stone-500 sm:block">
                    {entry.notes ?? "Sem observação"}
                  </p>
                  <Button
                    variant="secondary"
                    className="size-10 p-0"
                    disabled={!persistenceEnabled}
                    onClick={() => {
                      setEditingEntry(entry);
                      setIsFormOpen(true);
                    }}
                    aria-label="Editar peso"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="size-10 p-0"
                    disabled={!persistenceEnabled}
                    onClick={() => setDeletingEntry(entry)}
                    aria-label="Excluir peso"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </Card>
      {deletingEntry ? (
        <ConfirmModal
          title="Excluir registro de peso?"
          description={`Essa ação removerá o registro de ${formatDateBR(deletingEntry.date)}.`}
          confirmLabel={isPending ? "Excluindo..." : "Excluir"}
          onCancel={() => setDeletingEntry(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}

function WeightStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </Card>
  );
}
