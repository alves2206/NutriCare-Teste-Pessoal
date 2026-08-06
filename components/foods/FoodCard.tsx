import { Pencil, Trash2 } from "lucide-react";
import type { Food } from "@/types/nutrition";
import { formatNumberBR } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type FoodCardProps = {
  food: Food;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function FoodCard({ food, onEdit, onDelete }: FoodCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">{food.name}</h2>
          {food.brand ? <p className="text-sm text-stone-500">{food.brand}</p> : null}
        </div>
        <span className="rounded-full bg-mauve-100 px-3 py-1 text-xs font-semibold text-mauve-500">
          {food.category}
        </span>
      </div>
      <p className="mt-3 text-sm text-stone-500">
        Referência: {formatNumberBR(food.referenceAmount)} {food.referenceUnit}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <NutritionPill label="Calorias" value={`${formatNumberBR(food.calories, 0)} kcal`} />
        <NutritionPill label="Proteínas" value={`${formatNumberBR(food.protein)} g`} />
        <NutritionPill label="Carboidratos" value={`${formatNumberBR(food.carbohydrates)} g`} />
        <NutritionPill label="Gorduras" value={`${formatNumberBR(food.fat)} g`} />
        <NutritionPill label="Fibras" value={`${formatNumberBR(food.fiber)} g`} />
        <NutritionPill label="Sódio" value={`${formatNumberBR(food.sodium, 0)} mg`} />
      </div>
      {food.notes ? <p className="mt-4 text-xs leading-5 text-stone-500">{food.notes}</p> : null}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="secondary"
          className="min-h-10 px-3"
          aria-label={`Editar ${food.name}`}
          disabled={!onEdit}
          onClick={onEdit}
        >
          <Pencil size={16} aria-hidden="true" />
          Editar
        </Button>
        <Button
          variant="ghost"
          className="min-h-10 px-3"
          aria-label={`Excluir ${food.name}`}
          disabled={!onDelete}
          onClick={onDelete}
        >
          <Trash2 size={16} aria-hidden="true" />
          Excluir
        </Button>
      </div>
    </Card>
  );
}

function NutritionPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-3 py-2">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
