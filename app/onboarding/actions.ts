"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/user";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OnboardingActionResult = {
  ok: boolean;
  message: string;
};

function optionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function optionalDate(value?: string) {
  return value && value.trim().length > 0 ? value : null;
}

function combineSelection(formData: FormData, optionName: string, otherName: string) {
  const selected = formData
    .getAll(optionName)
    .map((value) => String(value).trim())
    .filter(Boolean);
  const other = String(formData.get(otherName) ?? "").trim();

  return [...selected, other].filter(Boolean).join(", ");
}

function readPayload(formData: FormData) {
  return {
    fullName: formData.get("fullName"),
    objective: formData.get("objective"),
    birthDate: String(formData.get("birthDate") ?? ""),
    heightCm: formData.get("heightCm"),
    currentWeightKg: formData.get("currentWeightKg"),
    targetWeightKg: formData.get("targetWeightKg"),
    biologicalSex: String(formData.get("biologicalSex") ?? ""),
    activityLevel: formData.get("activityLevel"),
    mealsPerDay: formData.get("mealsPerDay"),
    routine: String(formData.get("routine") ?? ""),
    foodLikes: combineSelection(formData, "foodLikes", "foodLikesOther"),
    foodDislikes: combineSelection(formData, "foodDislikes", "foodDislikesOther"),
    restrictions: combineSelection(formData, "restrictions", "restrictionsOther"),
    healthNotes: String(formData.get("healthNotes") ?? ""),
    trainingGoal: String(formData.get("trainingGoal") ?? ""),
    trainingExperience: String(formData.get("trainingExperience") ?? ""),
    trainingLocation: String(formData.get("trainingLocation") ?? ""),
    trainingDaysPerWeek: formData.get("trainingDaysPerWeek"),
    availableEquipment: String(formData.get("availableEquipment") ?? "")
  };
}

export async function saveOnboardingAction(
  formData: FormData
): Promise<OnboardingActionResult> {
  const parsed = onboardingSchema.safeParse(readPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise as informacoes."
    };
  }

  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("client_profiles").upsert(
    {
      user_id: user.id,
      email: user.email ?? "",
      full_name: parsed.data.fullName,
      objective: parsed.data.objective,
      birth_date: optionalDate(parsed.data.birthDate),
      height_cm: parsed.data.heightCm ?? null,
      current_weight_kg: parsed.data.currentWeightKg ?? null,
      target_weight_kg: parsed.data.targetWeightKg ?? null,
      biological_sex: optionalText(parsed.data.biologicalSex),
      activity_level: parsed.data.activityLevel,
      meals_per_day: parsed.data.mealsPerDay,
      routine: optionalText(parsed.data.routine),
      food_likes: optionalText(parsed.data.foodLikes),
      food_dislikes: optionalText(parsed.data.foodDislikes),
      restrictions: optionalText(parsed.data.restrictions),
      health_notes: optionalText(parsed.data.healthNotes),
      training_goal: optionalText(parsed.data.trainingGoal),
      training_experience: optionalText(parsed.data.trainingExperience),
      training_location: optionalText(parsed.data.trainingLocation),
      training_days_per_week: parsed.data.trainingDaysPerWeek ?? null,
      available_equipment: optionalText(parsed.data.availableEquipment),
      status: "pending"
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return {
      ok: false,
      message: "Nao foi possivel salvar o perfil. Verifique se a migration nova foi aplicada no Supabase."
    };
  }

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/plano");

  return {
    ok: true,
    message: "Perfil enviado. Agora o admin pode gerar e publicar o plano."
  };
}
