"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { MealForm } from "@/components/forms/MealForm";
import { MealCard } from "@/components/meals/MealCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { deleteMealAction } from "@/app/refeicoes/actions";
import { formatDateBR, formatNumberBR } from "@/lib/formatters";
import { getDailyTotals } from "@/lib/nutrition/calculations";
import type { Food, Meal } from "@/types/nutrition";

type HistoryManagerProps = {
  foods: Food[];
  meals: Meal[];
  persistenceEnabled: boolean;
};

const periods = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "Total", days: null }
];

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function HistoryManager({ foods, meals, persistenceEnabled }: HistoryManagerProps) {
  const initialDate = meals[0]?.date ?? new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [periodDays, setPeriodDays] = useState<number | null>(30);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [deletingMeal, setDeletingMeal] = useState<Meal | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const dayMeals = useMemo(
    () => meals.filter((meal) => meal.date === selectedDate),
    [meals, selectedDate]
  );
  const dayTotals = getDailyTotals(dayMeals);

  const periodMeals = useMemo(() => {
    if (periodDays === null) {
      return meals;
    }

    const end = new Date(`${selectedDate}T12:00:00`);
    const start = new Date(end);
    start.setDate(start.getDate() - periodDays + 1);
    const startValue = start.toISOString().slice(0, 10);

    return meals.filter((meal) => meal.date >= startValue && meal.date <= selectedDate);
  }, [meals, periodDays, selectedDate]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function confirmDelete() {
    if (!deletingMeal) {
      return;
    }

    startTransition(async () => {
      const result = await deleteMealAction(deletingMeal.id);
      setDeletingMeal(null);
      showToast(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="size-11 p-0"
              aria-label="Dia anterior"
              onClick={() => setSelectedDate((current) => shiftDate(current, -1))}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </Button>
            <label className="text-sm font-medium text-ink">
              <span className="sr-only">Selecionar data</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="min-h-11 rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
              />
            </label>
            <Button
              variant="secondary"
              className="size-11 p-0"
              aria-label="Próximo dia"
              onClick={() => setSelectedDate((current) => shiftDate(current, 1))}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </Button>
          </div>
          <p className="text-sm font-semibold text-stone-600">{formatDateBR(selectedDate)}</p>
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-6">
          <HistoryTotal label="Calorias" value={`${formatNumberBR(dayTotals.calories, 0)} kcal`} />
          <HistoryTotal label="Proteínas" value={`${formatNumberBR(dayTotals.protein)} g`} />
          <HistoryTotal label="Carboidratos" value={`${formatNumberBR(dayTotals.carbohydrates)} g`} />
          <HistoryTotal label="Gorduras" value={`${formatNumberBR(dayTotals.fat)} g`} />
          <HistoryTotal label="Fibras" value={`${formatNumberBR(dayTotals.fiber)} g`} />
          <HistoryTotal label="Sódio" value={`${formatNumberBR(dayTotals.sodium, 0)} mg`} />
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-ink">Filtro por período</h2>
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
        <p className="mt-3 text-sm text-stone-500">
          {periodMeals.length} refeição(ões) encontrada(s) no período selecionado.
        </p>
      </Card>
      {editingMeal ? (
        <Card>
          <h2 className="mb-5 text-lg font-semibold text-ink">Editar refeição</h2>
          <MealForm
            foods={foods}
            initialMeal={editingMeal}
            onCancel={() => setEditingMeal(null)}
            onDone={(result) => {
              setEditingMeal(null);
              showToast(result.message);
            }}
          />
        </Card>
      ) : null}
      {dayMeals.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {dayMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onEdit={persistenceEnabled ? () => setEditingMeal(meal) : undefined}
              onDelete={persistenceEnabled ? () => setDeletingMeal(meal) : undefined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="Nenhuma refeição neste dia"
          description="Ao salvar refeições para a data selecionada, elas aparecerão aqui."
        />
      )}
      {deletingMeal ? (
        <ConfirmModal
          title="Excluir refeição?"
          description={`Essa ação removerá o registro de ${deletingMeal.type}.`}
          confirmLabel={isPending ? "Excluindo..." : "Excluir"}
          onCancel={() => setDeletingMeal(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}

function HistoryTotal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-3">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
