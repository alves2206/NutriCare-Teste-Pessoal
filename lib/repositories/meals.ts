import { demoMeals } from "@/lib/data/demo";
import { getCurrentUser } from "@/lib/auth/user";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapFoodRow } from "@/lib/repositories/foods";
import type { Database } from "@/types/database";
import type { Food, Meal } from "@/types/nutrition";

type MealRow = Database["public"]["Tables"]["meals"]["Row"];
type FoodRow = Database["public"]["Tables"]["foods"]["Row"];
type MealItemRow = Database["public"]["Tables"]["meal_items"]["Row"] & {
  foods: FoodRow | null;
};
type MealWithItemsRow = MealRow & {
  meal_items: MealItemRow[];
};

function missingFood(foodId: string | null): Food {
  return {
    id: foodId ?? "alimento-removido",
    name: "Alimento removido",
    category: "Outros",
    referenceAmount: 1,
    referenceUnit: "porção",
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sodium: 0
  };
}

export function mapMealRow(row: MealWithItemsRow): Meal {
  return {
    id: row.id,
    date: row.meal_date,
    time: row.meal_time.slice(0, 5),
    type: row.meal_type,
    notes: row.notes ?? undefined,
    items: row.meal_items.map((item) => ({
      id: item.id,
      food: item.foods ? mapFoodRow(item.foods) : missingFood(item.food_id),
      consumedAmount: Number(item.consumed_amount),
      consumedUnit: item.consumed_unit,
      calculated: {
        calories: Number(item.calculated_calories),
        protein: Number(item.calculated_protein),
        carbohydrates: Number(item.calculated_carbohydrates),
        fat: Number(item.calculated_fat),
        fiber: Number(item.calculated_fiber),
        sodium: Number(item.calculated_sodium)
      }
    }))
  };
}

export async function listMealsByDate(date: string) {
  const { isConfigured } = getSupabaseEnv();
  const user = await getCurrentUser();

  if (!isConfigured || !user) {
    return demoMeals;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("meals")
    .select("*, meal_items(*, foods(*))")
    .eq("user_id", user.id)
    .eq("meal_date", date)
    .order("meal_time", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar as refeições.");
  }

  return ((data ?? []) as unknown as MealWithItemsRow[]).map(mapMealRow);
}

export async function listMealsInRange(startDate: string, endDate: string) {
  const { isConfigured } = getSupabaseEnv();
  const user = await getCurrentUser();

  if (!isConfigured || !user) {
    return demoMeals.filter((meal) => meal.date >= startDate && meal.date <= endDate);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("meals")
    .select("*, meal_items(*, foods(*))")
    .eq("user_id", user.id)
    .gte("meal_date", startDate)
    .lte("meal_date", endDate)
    .order("meal_date", { ascending: false })
    .order("meal_time", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar o histórico.");
  }

  return ((data ?? []) as unknown as MealWithItemsRow[]).map(mapMealRow);
}
