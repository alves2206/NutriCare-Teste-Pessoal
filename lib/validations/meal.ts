import { z } from "zod";
import { mealTypes, referenceUnits } from "@/lib/constants/app";

export const mealItemSchema = z.object({
  foodId: z.string().uuid("Selecione um alimento."),
  consumedAmount: z.coerce.number().min(0, "A quantidade não pode ser negativa."),
  consumedUnit: z.enum(referenceUnits)
});

export const mealSchema = z.object({
  date: z.string().min(1, "Informe a data."),
  time: z.string().min(1, "Informe o horário."),
  type: z.enum(mealTypes),
  notes: z.string().optional(),
  items: z.array(mealItemSchema).min(1, "Adicione ao menos um alimento.")
});

export type MealFormData = z.infer<typeof mealSchema>;
export type MealItemFormData = z.infer<typeof mealItemSchema>;
