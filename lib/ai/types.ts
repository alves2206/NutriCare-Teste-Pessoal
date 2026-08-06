import { mealTypes, referenceUnits } from "@/lib/constants/app";

export type ParsedMealItem = {
  foodName: string;
  quantity: number;
  unit: (typeof referenceUnits)[number];
};

export type ParsedMealDraft = {
  mealType: (typeof mealTypes)[number];
  items: ParsedMealItem[];
};

export type MealInterpreter = {
  interpret(input: string): Promise<ParsedMealDraft>;
};
