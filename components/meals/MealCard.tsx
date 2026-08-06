import { Clock, Pencil, Trash2 } from "lucide-react";
import type { Meal } from "@/types/nutrition";
import { getMealTotals } from "@/lib/nutrition/calculations";
import { formatNumberBR } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type MealCardProps = {
  meal: Meal;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function MealCard({ meal, showActions = true, onEdit, onDelete }: MealCardProps) {
  const totals = getMealTotals(meal);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">{meal.type}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-stone-500">
            <Clock size={15} aria-hidden="true" />
            {meal.time}
          </p>
        </div>
        <p className="rounded-full bg-rosepetal-50 px-3 py-1 text-sm font-semibold text-rosepetal-500">
          {formatNumberBR(totals.calories, 0)} kcal
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {meal.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-medium text-ink">{item.food.name}</p>
              <p className="text-stone-500">
                {formatNumberBR(item.consumedAmount)} {item.consumedUnit}
              </p>
            </div>
            <p className="font-semibold text-stone-600">
              {formatNumberBR(item.calculated.calories, 0)} kcal
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-stone-50 p-3 text-center text-xs text-stone-500">
        <span>{formatNumberBR(totals.protein)} g prot.</span>
        <span>{formatNumberBR(totals.carbohydrates)} g carb.</span>
        <span>{formatNumberBR(totals.fat)} g gord.</span>
      </div>
      {showActions ? (
        <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="secondary"
          className="min-h-10 px-3"
          aria-label={`Editar ${meal.type}`}
          disabled={!onEdit}
          onClick={onEdit}
        >
          <Pencil size={16} aria-hidden="true" />
          Editar
        </Button>
        <Button
          variant="ghost"
          className="min-h-10 px-3"
          aria-label={`Excluir ${meal.type}`}
          disabled={!onDelete}
          onClick={onDelete}
        >
          <Trash2 size={16} aria-hidden="true" />
          Excluir
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
