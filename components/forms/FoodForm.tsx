"use client";

import { useState, useTransition } from "react";
import type { InputHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { foodCategories, referenceUnits } from "@/lib/constants/app";
import { foodSchema, type FoodFormData } from "@/lib/validations/food";
import type { Food } from "@/types/nutrition";
import {
  createFoodAction,
  updateFoodAction,
  type FoodActionResult
} from "@/app/alimentos/actions";

type FoodFormProps = {
  initialFood?: Food | null;
  onDone: (result: FoodActionResult) => void;
  onCancel: () => void;
};

export function FoodForm({ initialFood, onDone, onCancel }: FoodFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FoodFormData>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: initialFood?.name ?? "",
      brand: initialFood?.brand ?? "",
      category: (initialFood?.category as FoodFormData["category"]) ?? "Outros",
      referenceAmount: initialFood?.referenceAmount ?? 100,
      referenceUnit: initialFood?.referenceUnit ?? "gramas",
      calories: initialFood?.calories ?? 0,
      protein: initialFood?.protein ?? 0,
      carbohydrates: initialFood?.carbohydrates ?? 0,
      fat: initialFood?.fat ?? 0,
      fiber: initialFood?.fiber ?? 0,
      sodium: initialFood?.sodium ?? 0,
      notes: initialFood?.notes ?? ""
    }
  });

  function toFormData(values: FoodFormData) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.set(key, String(value ?? ""));
    });

    return formData;
  }

  function onSubmit(values: FoodFormData) {
    setFormMessage(null);

    startTransition(async () => {
      const result = initialFood
        ? await updateFoodAction(initialFood.id, toFormData(values))
        : await createFoodAction(toFormData(values));

      if (!result.ok) {
        setFormMessage(result.message);
        return;
      }

      onDone(result);
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome" error={errors.name?.message} {...register("name")} />
        <Input label="Marca" error={errors.brand?.message} {...register("brand")} />
        <label className="text-sm font-medium text-ink">
          Categoria
          <select
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            {...register("category")}
          >
            {foodCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          {errors.category?.message ? (
            <span className="mt-2 block text-xs text-rosepetal-500">{errors.category.message}</span>
          ) : null}
        </label>
        <label className="text-sm font-medium text-ink">
          Unidade de referência
          <select
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            {...register("referenceUnit")}
          >
            {referenceUnits.map((unit) => (
              <option key={unit}>{unit}</option>
            ))}
          </select>
          {errors.referenceUnit?.message ? (
            <span className="mt-2 block text-xs text-rosepetal-500">
              {errors.referenceUnit.message}
            </span>
          ) : null}
        </label>
        <Input
          label="Quantidade de referência"
          type="number"
          step="0.01"
          error={errors.referenceAmount?.message}
          {...register("referenceAmount")}
        />
        <Input
          label="Calorias"
          type="number"
          step="0.01"
          error={errors.calories?.message}
          {...register("calories")}
        />
        <Input
          label="Proteínas"
          type="number"
          step="0.01"
          error={errors.protein?.message}
          {...register("protein")}
        />
        <Input
          label="Carboidratos"
          type="number"
          step="0.01"
          error={errors.carbohydrates?.message}
          {...register("carbohydrates")}
        />
        <Input
          label="Gorduras"
          type="number"
          step="0.01"
          error={errors.fat?.message}
          {...register("fat")}
        />
        <Input
          label="Fibras"
          type="number"
          step="0.01"
          error={errors.fiber?.message}
          {...register("fiber")}
        />
        <Input
          label="Sódio"
          type="number"
          step="0.01"
          error={errors.sodium?.message}
          {...register("sodium")}
        />
      </div>
      <label className="block text-sm font-medium text-ink">
        Observações
        <textarea
          className="mt-2 min-h-24 w-full rounded-2xl border border-rosepetal-100 bg-white p-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
          {...register("notes")}
        />
      </label>
      {formMessage ? (
        <p className="rounded-2xl bg-rosepetal-50 px-4 py-3 text-sm text-rosepetal-500">
          {formMessage}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" type="button" onClick={onCancel}>
          <X size={18} aria-hidden="true" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save size={18} aria-hidden="true" />
          {isPending ? "Salvando..." : "Salvar alimento"}
        </Button>
      </div>
    </form>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
        {...props}
      />
      {error ? <span className="mt-2 block text-xs text-rosepetal-500">{error}</span> : null}
    </label>
  );
}
