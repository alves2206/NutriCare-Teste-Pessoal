"use server";

import { revalidatePath } from "next/cache";
import { weightSchema } from "@/lib/validations/weight";
import { requireCurrentUser } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WeightActionResult = {
  ok: boolean;
  message: string;
};

function readWeightPayload(formData: FormData) {
  return {
    date: formData.get("date"),
    weightKg: formData.get("weightKg"),
    notes: String(formData.get("notes") ?? "").trim()
  };
}

export async function createWeightAction(formData: FormData): Promise<WeightActionResult> {
  const parsed = weightSchema.safeParse(readWeightPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados do peso."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("weight_entries").insert({
    user_id: user.id,
    entry_date: parsed.data.date,
    weight_kg: parsed.data.weightKg,
    notes: parsed.data.notes?.trim() || null
  });

  if (error) {
    return { ok: false, message: "Não foi possível salvar o peso." };
  }

  revalidatePath("/evolucao");
  revalidatePath("/dashboard");
  return { ok: true, message: "Peso registrado com sucesso." };
}

export async function updateWeightAction(
  weightId: string,
  formData: FormData
): Promise<WeightActionResult> {
  const parsed = weightSchema.safeParse(readWeightPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados do peso."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("weight_entries")
    .update({
      entry_date: parsed.data.date,
      weight_kg: parsed.data.weightKg,
      notes: parsed.data.notes?.trim() || null
    })
    .eq("id", weightId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Não foi possível atualizar o peso." };
  }

  revalidatePath("/evolucao");
  revalidatePath("/dashboard");
  return { ok: true, message: "Peso atualizado com sucesso." };
}

export async function deleteWeightAction(weightId: string): Promise<WeightActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("weight_entries")
    .delete()
    .eq("id", weightId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Não foi possível excluir o peso." };
  }

  revalidatePath("/evolucao");
  revalidatePath("/dashboard");
  return { ok: true, message: "Registro de peso excluído com sucesso." };
}
