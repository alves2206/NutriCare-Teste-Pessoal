"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { generateCoachingPlanDraft } from "@/lib/ai/coaching-plan";
import { getClientProfileById } from "@/lib/repositories/client-profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminActionResult = {
  ok: boolean;
  message: string;
};

export async function generatePlanAction(profileId: string): Promise<AdminActionResult> {
  const admin = await requireAdminUser();
  const profile = await getClientProfileById(profileId);

  if (!profile) {
    return { ok: false, message: "Perfil nao encontrado." };
  }

  const draft = await generateCoachingPlanDraft(profile);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("coaching_plans").insert({
    user_id: profile.userId,
    created_by: admin.id,
    title: draft.title,
    status: "draft",
    source: draft.source,
    nutrition_summary: draft.nutritionSummary,
    workout_summary: draft.workoutSummary,
    meals: draft.meals,
    workouts: draft.workouts,
    notes: draft.notes
  });

  if (error) {
    return {
      ok: false,
      message: "Nao foi possivel gerar o plano. Verifique se a migration nova foi aplicada no Supabase."
    };
  }

  await supabase
    .from("client_profiles")
    .update({ status: "draft_ready" })
    .eq("id", profile.id);

  revalidatePath("/admin");
  revalidatePath("/plano");
  revalidatePath("/treinos");

  return {
    ok: true,
    message: draft.source === "gemini" ? "Rascunho gerado com Gemini." : "Rascunho local gerado para teste."
  };
}

export async function publishPlanAction(planId: string): Promise<AdminActionResult> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data: plan, error: planError } = await supabase
    .from("coaching_plans")
    .select("id,user_id")
    .eq("id", planId)
    .maybeSingle();

  if (planError || !plan) {
    return { ok: false, message: "Plano nao encontrado." };
  }

  await supabase
    .from("coaching_plans")
    .update({ status: "archived" })
    .eq("user_id", plan.user_id)
    .eq("status", "published");

  const { error } = await supabase
    .from("coaching_plans")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", plan.id);

  if (error) {
    return { ok: false, message: "Nao foi possivel publicar o plano." };
  }

  await supabase
    .from("client_profiles")
    .update({ status: "published" })
    .eq("user_id", plan.user_id);

  revalidatePath("/admin");
  revalidatePath("/plano");
  revalidatePath("/treinos");
  revalidatePath("/dashboard");

  return { ok: true, message: "Plano publicado para o usuario." };
}
