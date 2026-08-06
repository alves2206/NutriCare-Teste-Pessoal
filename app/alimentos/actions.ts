"use server";

import { revalidatePath } from "next/cache";
import { foodSchema } from "@/lib/validations/food";
import { requireCurrentUser } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FoodActionResult = {
  ok: boolean;
  message: string;
};

function readOptionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : undefined;
}

function readFoodPayload(formData: FormData) {
  return {
    name: formData.get("name"),
    brand: readOptionalString(formData.get("brand")),
    category: formData.get("category"),
    referenceAmount: formData.get("referenceAmount"),
    referenceUnit: formData.get("referenceUnit"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    carbohydrates: formData.get("carbohydrates"),
    fat: formData.get("fat"),
    fiber: formData.get("fiber"),
    sodium: formData.get("sodium"),
    notes: readOptionalString(formData.get("notes"))
  };
}

export async function createFoodAction(formData: FormData): Promise<FoodActionResult> {
  const parsed = foodSchema.safeParse(readFoodPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados do alimento."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("foods").insert({
    user_id: user.id,
    name: parsed.data.name,
    brand: parsed.data.brand ?? null,
    category: parsed.data.category,
    reference_amount: parsed.data.referenceAmount,
    reference_unit: parsed.data.referenceUnit,
    calories: parsed.data.calories,
    protein: parsed.data.protein,
    carbohydrates: parsed.data.carbohydrates,
    fat: parsed.data.fat,
    fiber: parsed.data.fiber,
    sodium: parsed.data.sodium,
    notes: parsed.data.notes ?? null
  });

  if (error) {
    return { ok: false, message: "Não foi possível salvar o alimento." };
  }

  revalidatePath("/alimentos");
  revalidatePath("/refeicoes");
  return { ok: true, message: "Alimento salvo com sucesso." };
}

export async function updateFoodAction(
  foodId: string,
  formData: FormData
): Promise<FoodActionResult> {
  const parsed = foodSchema.safeParse(readFoodPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados do alimento."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("foods")
    .update({
      name: parsed.data.name,
      brand: parsed.data.brand ?? null,
      category: parsed.data.category,
      reference_amount: parsed.data.referenceAmount,
      reference_unit: parsed.data.referenceUnit,
      calories: parsed.data.calories,
      protein: parsed.data.protein,
      carbohydrates: parsed.data.carbohydrates,
      fat: parsed.data.fat,
      fiber: parsed.data.fiber,
      sodium: parsed.data.sodium,
      notes: parsed.data.notes ?? null
    })
    .eq("id", foodId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Não foi possível atualizar o alimento." };
  }

  revalidatePath("/alimentos");
  revalidatePath("/refeicoes");
  return { ok: true, message: "Alimento atualizado com sucesso." };
}

export async function deleteFoodAction(foodId: string): Promise<FoodActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("foods").delete().eq("id", foodId).eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Não foi possível excluir o alimento." };
  }

  revalidatePath("/alimentos");
  revalidatePath("/refeicoes");
  return { ok: true, message: "Alimento excluído com sucesso." };
}
