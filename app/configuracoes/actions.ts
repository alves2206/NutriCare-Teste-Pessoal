"use server";

import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/validations/profile";
import { requireCurrentUser } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileActionResult = {
  ok: boolean;
  message: string;
};

function optionalDate(value: string | undefined) {
  return value && value.trim().length > 0 ? value : null;
}

function readProfilePayload(formData: FormData) {
  return {
    name: formData.get("name"),
    birthDate: String(formData.get("birthDate") ?? ""),
    heightCm: formData.get("heightCm"),
    biologicalSex: String(formData.get("biologicalSex") ?? ""),
    goal: formData.get("goal"),
    calorieTarget: formData.get("calorieTarget"),
    proteinTarget: formData.get("proteinTarget"),
    carbohydrateTarget: formData.get("carbohydrateTarget"),
    fatTarget: formData.get("fatTarget"),
    fiberTarget: formData.get("fiberTarget"),
    waterTarget: formData.get("waterTarget"),
    weightUnit: formData.get("weightUnit"),
    theme: formData.get("theme")
  };
}

export async function saveProfileAction(formData: FormData): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(readProfilePayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise as configurações."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      name: parsed.data.name,
      birth_date: optionalDate(parsed.data.birthDate),
      height_cm: parsed.data.heightCm,
      biological_sex: parsed.data.biologicalSex || null,
      goal: parsed.data.goal,
      calorie_target: parsed.data.calorieTarget,
      protein_target: parsed.data.proteinTarget,
      carbohydrate_target: parsed.data.carbohydrateTarget,
      fat_target: parsed.data.fatTarget,
      fiber_target: parsed.data.fiberTarget,
      water_target: parsed.data.waterTarget,
      weight_unit: parsed.data.weightUnit,
      theme: parsed.data.theme
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { ok: false, message: "Não foi possível salvar as configurações." };
  }

  revalidatePath("/configuracoes");
  revalidatePath("/dashboard");
  return { ok: true, message: "Configurações salvas com sucesso." };
}
