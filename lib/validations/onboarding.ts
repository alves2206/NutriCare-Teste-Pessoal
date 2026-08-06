import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const numberField = z.preprocess(
  emptyToUndefined,
  z.coerce.number().positive("Informe um numero valido.").optional()
);

const integerField = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().positive("Informe um numero valido.").optional()
);

export const onboardingSchema = z.object({
  fullName: z.string().trim().min(2, "Informe o nome completo."),
  objective: z.string().trim().min(3, "Informe o objetivo principal."),
  birthDate: z.string().optional(),
  heightCm: numberField,
  currentWeightKg: numberField,
  targetWeightKg: numberField,
  biologicalSex: z.string().optional(),
  activityLevel: z.string().trim().min(2, "Informe o nivel de atividade."),
  mealsPerDay: z.coerce.number().int().min(3).max(8),
  routine: z.string().trim().optional(),
  foodLikes: z.string().trim().optional(),
  foodDislikes: z.string().trim().optional(),
  restrictions: z.string().trim().optional(),
  healthNotes: z.string().trim().optional(),
  trainingGoal: z.string().trim().optional(),
  trainingExperience: z.string().trim().optional(),
  trainingLocation: z.string().trim().optional(),
  trainingDaysPerWeek: integerField,
  availableEquipment: z.string().trim().optional()
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
