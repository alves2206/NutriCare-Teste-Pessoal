import { demoFoods } from "@/lib/data/demo";
import { getCurrentUser } from "@/lib/auth/user";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Food } from "@/types/nutrition";

type FoodRow = Database["public"]["Tables"]["foods"]["Row"];

export function mapFoodRow(row: FoodRow): Food {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? undefined,
    category: row.category,
    referenceAmount: Number(row.reference_amount),
    referenceUnit: row.reference_unit,
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbohydrates: Number(row.carbohydrates),
    fat: Number(row.fat),
    fiber: Number(row.fiber),
    sodium: Number(row.sodium),
    notes: row.notes ?? undefined
  };
}

export async function listFoods() {
  const { isConfigured } = getSupabaseEnv();
  const user = await getCurrentUser();

  if (!isConfigured || !user) {
    return demoFoods;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar os alimentos.");
  }

  return data.map(mapFoodRow);
}

export async function getFoodById(foodId: string) {
  const foods = await listFoods();
  return foods.find((food) => food.id === foodId) ?? null;
}
