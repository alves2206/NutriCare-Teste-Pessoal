import { z } from "zod";

const nonNegativeNumber = z.coerce.number().min(0, "Use um valor igual ou maior que zero.");

export const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  birthDate: z.string().optional(),
  heightCm: nonNegativeNumber,
  biologicalSex: z.string().optional(),
  goal: z.string().min(1, "Informe o objetivo."),
  calorieTarget: nonNegativeNumber,
  proteinTarget: nonNegativeNumber,
  carbohydrateTarget: nonNegativeNumber,
  fatTarget: nonNegativeNumber,
  fiberTarget: nonNegativeNumber,
  waterTarget: nonNegativeNumber,
  weightUnit: z.string().min(1, "Informe a unidade de peso."),
  theme: z.enum(["light", "auto", "dark"])
});

export type ProfileFormData = z.infer<typeof profileSchema>;
