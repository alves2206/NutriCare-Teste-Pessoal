"use client";

import { useMemo, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mealTypes, referenceUnits } from "@/lib/constants/app";
import { calculateConsumedNutrients, sumNutrients } from "@/lib/nutrition/calculations";
import { formatNumberBR } from "@/lib/formatters";
import type { Food, Meal } from "@/types/nutrition";
import {
  createMealAction,
  updateMealAction,
  type MealActionResult
} from "@/app/refeicoes/actions";

type MealFormProps = {
  foods: Food[];
  initialMeal?: Meal | null;
  onCancel: () => void;
  onDone: (result: MealActionResult) => void;
};

type DraftItem = {
  id: string;
  foodId: string;
  consumedAmount: number;
  consumedUnit: string;
};

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function nowInputValue() {
  return new Date().toTimeString().slice(0, 5);
}

function createDraftId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function MealForm({ foods, initialMeal, onCancel, onDone }: MealFormProps) {
  const [date, setDate] = useState(initialMeal?.date ?? todayInputValue());
  const [time, setTime] = useState(initialMeal?.time ?? nowInputValue());
  const [type, setType] = useState(initialMeal?.type ?? "Almoço");
  const [notes, setNotes] = useState(initialMeal?.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<DraftItem[]>(
    initialMeal?.items.map((item) => ({
      id: item.id,
      foodId: item.food.id,
      consumedAmount: item.consumedAmount,
      consumedUnit: item.consumedUnit
    })) ?? [
      {
        id: createDraftId(),
        foodId: foods[0]?.id ?? "",
        consumedAmount: 100,
        consumedUnit: "gramas"
      }
    ]
  );

  const calculatedItems = useMemo(
    () =>
      items.map((item) => {
        const food = foods.find((foodItem) => foodItem.id === item.foodId);

        return {
          ...item,
          food,
          calculated:
            food && item.consumedAmount >= 0
              ? calculateConsumedNutrients(food, item.consumedAmount)
              : null
        };
      }),
    [foods, items]
  );

  const totals = sumNutrients(
    calculatedItems
      .map((item) => item.calculated)
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
  );

  function updateItem(id: string, patch: Partial<DraftItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: createDraftId(),
        foodId: foods[0]?.id ?? "",
        consumedAmount: 100,
        consumedUnit: "gramas"
      }
    ]);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.set("date", date);
    formData.set("time", time);
    formData.set("type", type);
    formData.set("notes", notes);
    formData.set(
      "items",
      JSON.stringify(
        items.map((item) => ({
          foodId: item.foodId,
          consumedAmount: item.consumedAmount,
          consumedUnit: item.consumedUnit
        }))
      )
    );

    startTransition(async () => {
      const result = initialMeal
        ? await updateMealAction(initialMeal.id, formData)
        : await createMealAction(formData);

      if (!result.ok) {
        setMessage(result.message);
        return;
      }

      onDone(result);
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
          Horário
          <input
            type="time"
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Tipo de refeição
          <select
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {mealTypes.map((mealType) => (
              <option key={mealType}>{mealType}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="rounded-2xl bg-stone-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">Alimentos consumidos</p>
            <p className="text-sm text-stone-500">Os nutrientes são calculados automaticamente.</p>
          </div>
          <Button variant="secondary" type="button" onClick={addItem}>
            <Plus size={16} aria-hidden="true" />
            Item
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {calculatedItems.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-2xl bg-white p-3 sm:grid-cols-[1fr_120px_140px_auto]">
              <label className="text-sm font-medium text-ink">
                Alimento
                <select
                  className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none"
                  value={item.foodId}
                  onChange={(event) => updateItem(item.id, { foodId: event.target.value })}
                >
                  {foods.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-ink">
                Quantidade
                <input
                  type="number"
                  step="0.01"
                  className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none"
                  value={item.consumedAmount}
                  onChange={(event) =>
                    updateItem(item.id, { consumedAmount: Number(event.target.value) })
                  }
                />
              </label>
              <label className="text-sm font-medium text-ink">
                Unidade
                <select
                  className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none"
                  value={item.consumedUnit}
                  onChange={(event) => updateItem(item.id, { consumedUnit: event.target.value })}
                >
                  {referenceUnits.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="mt-7 grid size-12 place-items-center rounded-2xl text-stone-500 hover:bg-rosepetal-50 hover:text-rosepetal-500 sm:mt-7"
                onClick={() => removeItem(item.id)}
                aria-label="Remover alimento"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
              <p className="text-xs text-stone-500 sm:col-span-4">
                Total do item: {formatNumberBR(item.calculated?.calories ?? 0, 0)} kcal,
                {" "}
                {formatNumberBR(item.calculated?.protein ?? 0)} g proteínas,
                {" "}
                {formatNumberBR(item.calculated?.carbohydrates ?? 0)} g carboidratos,
                {" "}
                {formatNumberBR(item.calculated?.fat ?? 0)} g gorduras
              </p>
            </div>
          ))}
        </div>
      </div>
      <label className="block text-sm font-medium text-ink">
        Observações
        <textarea
          className="mt-2 min-h-24 w-full rounded-2xl border border-rosepetal-100 bg-white p-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
      <div className="grid gap-3 rounded-2xl bg-rosepetal-50 p-4 text-sm text-stone-700 sm:grid-cols-3">
        <span>Calorias: {formatNumberBR(totals.calories, 0)} kcal</span>
        <span>Proteínas: {formatNumberBR(totals.protein)} g</span>
        <span>Carboidratos: {formatNumberBR(totals.carbohydrates)} g</span>
        <span>Gorduras: {formatNumberBR(totals.fat)} g</span>
        <span>Fibras: {formatNumberBR(totals.fiber)} g</span>
        <span>Sódio: {formatNumberBR(totals.sodium, 0)} mg</span>
      </div>
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
        <Button type="submit" disabled={isPending || foods.length === 0}>
          <Save size={18} aria-hidden="true" />
          {isPending ? "Salvando..." : "Salvar refeição"}
        </Button>
      </div>
    </form>
  );
}
