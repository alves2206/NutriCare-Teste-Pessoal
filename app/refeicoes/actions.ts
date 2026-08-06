"use server";

import { revalidatePath } from "next/cache";
import { mealSchema, type MealFormData } from "@/lib/validations/meal";
import { requireCurrentUser } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFoodById } from "@/lib/repositories/foods";
import { calculateConsumedNutrients } from "@/lib/nutrition/calculations";

export type MealActionResult = {
  ok: boolean;
  message: string;
};

function readMealPayload(formData: FormData) {
  const rawItems = String(formData.get("items") ?? "[]");
  let items: unknown = [];

  try {
    items = JSON.parse(rawItems);
  } catch {
    items = [];
  }

  return {
    date: formData.get("date"),
    time: formData.get("time"),
    type: formData.get("type"),
    notes: String(formData.get("notes") ?? "").trim(),
    items
  };
}

async function buildMealItems(items: MealFormData["items"]) {
  return Promise.all(
    items.map(async (item) => {
      const food = await getFoodById(item.foodId);

      if (!food) {
        throw new Error("Alimento selecionado não foi encontrado.");
      }

      const calculated = calculateConsumedNutrients(food, item.consumedAmount);

      return {
        food_id: food.id,
        consumed_amount: item.consumedAmount,
        consumed_unit: item.consumedUnit,
        calculated_calories: calculated.calories,
        calculated_protein: calculated.protein,
        calculated_carbohydrates: calculated.carbohydrates,
        calculated_fat: calculated.fat,
        calculated_fiber: calculated.fiber,
        calculated_sodium: calculated.sodium
      };
    })
  );
}

export async function createMealAction(formData: FormData): Promise<MealActionResult> {
  const parsed = mealSchema.safeParse(readMealPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados da refeição."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  try {
    const mealItems = await buildMealItems(parsed.data.items);
    const { data: meal, error: mealError } = await supabase
      .from("meals")
      .insert({
        user_id: user.id,
        meal_date: parsed.data.date,
        meal_time: parsed.data.time,
        meal_type: parsed.data.type,
        notes: parsed.data.notes?.trim() || null
      })
      .select("id")
      .single();

    if (mealError || !meal) {
      return { ok: false, message: "Não foi possível salvar a refeição." };
    }

    const { error: itemsError } = await supabase.from("meal_items").insert(
      mealItems.map((item) => ({
        ...item,
        meal_id: meal.id
      }))
    );

    if (itemsError) {
      await supabase.from("meals").delete().eq("id", meal.id).eq("user_id", user.id);
      return { ok: false, message: "Não foi possível salvar os itens da refeição." };
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Revise os itens da refeição."
    };
  }

  revalidatePath("/refeicoes");
  revalidatePath("/dashboard");
  revalidatePath("/historico");
  return { ok: true, message: "Refeição salva com sucesso." };
}

export async function updateMealAction(
  mealId: string,
  formData: FormData
): Promise<MealActionResult> {
  const parsed = mealSchema.safeParse(readMealPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados da refeição."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  try {
    const mealItems = await buildMealItems(parsed.data.items);
    const { error: mealError } = await supabase
      .from("meals")
      .update({
        meal_date: parsed.data.date,
        meal_time: parsed.data.time,
        meal_type: parsed.data.type,
        notes: parsed.data.notes?.trim() || null
      })
      .eq("id", mealId)
      .eq("user_id", user.id);

    if (mealError) {
      return { ok: false, message: "Não foi possível atualizar a refeição." };
    }

    await supabase.from("meal_items").delete().eq("meal_id", mealId);

    const { error: itemsError } = await supabase.from("meal_items").insert(
      mealItems.map((item) => ({
        ...item,
        meal_id: mealId
      }))
    );

    if (itemsError) {
      return { ok: false, message: "Não foi possível atualizar os itens." };
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Revise os itens da refeição."
    };
  }

  revalidatePath("/refeicoes");
  revalidatePath("/dashboard");
  revalidatePath("/historico");
  return { ok: true, message: "Refeição atualizada com sucesso." };
}

export async function deleteMealAction(mealId: string): Promise<MealActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("meals").delete().eq("id", mealId).eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Não foi possível excluir a refeição." };
  }

  revalidatePath("/refeicoes");
  revalidatePath("/dashboard");
  revalidatePath("/historico");
  return { ok: true, message: "Refeição excluída com sucesso." };
}
