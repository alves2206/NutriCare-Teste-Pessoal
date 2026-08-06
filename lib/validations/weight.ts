import { z } from "zod";

export const weightSchema = z.object({
  date: z.string().min(1, "Informe a data."),
  weightKg: z.coerce.number().positive("Informe um peso maior que zero."),
  notes: z.string().optional()
});

export type WeightFormData = z.infer<typeof weightSchema>;
