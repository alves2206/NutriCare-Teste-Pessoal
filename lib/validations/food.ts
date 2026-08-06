import { z } from "zod";
import { foodCategories } from "@/lib/constants/app";

const nonNegativeNumber = z.coerce.number().min(0, "Use um valor igual ou maior que zero.");

export const foodSchema = z.object({
  name: z.string().min(2, "Informe o nome do alimento."),
  brand: z.string().optional(),
  category: z.enum(foodCategories),
  referenceAmount: z.coerce.number().positive("A referência deve ser maior que zero."),
  referenceUnit: z.string().min(1, "Informe a unidade."),
  calories: nonNegativeNumber,
  protein: nonNegativeNumber,
  carbohydrates: nonNegativeNumber,
  fat: nonNegativeNumber,
  fiber: nonNegativeNumber,
  sodium: nonNegativeNumber,
  notes: z.string().optional()
});

export type FoodFormData = z.infer<typeof foodSchema>;
