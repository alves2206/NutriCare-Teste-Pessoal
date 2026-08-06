"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { publicIntakeSchema } from "@/lib/validations/public-intake";

export type PublicIntakeActionResult = {
  ok: boolean;
  message: string;
  leadId?: string;
  token?: string;
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
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
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

export async function createPublicLeadAction(
  formData: FormData
): Promise<PublicIntakeActionResult> {
  const parsed = publicIntakeSchema.safeParse(readPayload(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise a avaliação."
    };
  }

  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return {
      ok: false,
      message: "Supabase não está configurado para salvar leads."
    };
  }

  const leadId = crypto.randomUUID();
  const publicToken = crypto.randomUUID();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("public_leads").insert({
    id: leadId,
    public_token: publicToken,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp,
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
    checkout_status: "intake_submitted"
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      return {
        ok: true,
        message: "Prévia local: avaliação simulada sem salvar no Supabase.",
        leadId,
        token: publicToken
      };
    }

    return {
      ok: false,
      message: "Não foi possível salvar a avaliação. A migration de leads ainda precisa ser aplicada."
    };
  }

  return {
    ok: true,
    message: "Avaliação salva. Agora escolha o melhor plano.",
    leadId,
    token: publicToken
  };
}
