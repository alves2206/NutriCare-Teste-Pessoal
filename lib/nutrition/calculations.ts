import type { Food, Meal, MealItem, Nutrients } from "@/types/nutrition";

const nutrientKeys = [
  "calories",
  "protein",
  "carbohydrates",
  "fat",
  "fiber",
  "sodium"
] as const;

export function roundNutritionValue(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateConsumedNutrients(
  food: Food,
  consumedAmount: number
): Nutrients {
  if (food.referenceAmount <= 0) {
    throw new Error("A quantidade de referência deve ser maior que zero.");
  }

  if (consumedAmount < 0) {
    throw new Error("A quantidade consumida não pode ser negativa.");
  }

  const factor = consumedAmount / food.referenceAmount;

  return nutrientKeys.reduce<Nutrients>(
    (totals, key) => ({
      ...totals,
      [key]: roundNutritionValue(food[key] * factor)
    }),
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sodium: 0
    }
  );
}

export function sumNutrients(items: Array<Nutrients | MealItem>): Nutrients {
  return items.reduce<Nutrients>(
    (totals, item) => {
      const nutrients = "calculated" in item ? item.calculated : item;

      return nutrientKeys.reduce<Nutrients>(
        (current, key) => ({
          ...current,
          [key]: roundNutritionValue(current[key] + nutrients[key])
        }),
        totals
      );
    },
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sodium: 0
    }
  );
}

export function getMealTotals(meal: Meal) {
  return sumNutrients(meal.items);
}

export function getDailyTotals(meals: Meal[]) {
  return sumNutrients(meals.flatMap((meal) => meal.items));
}

export function getRemainingCalories(target: number, consumed: number) {
  return roundNutritionValue(target - consumed);
}
