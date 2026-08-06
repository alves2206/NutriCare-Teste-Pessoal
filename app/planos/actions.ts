"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicPlanOptions } from "@/lib/constants/marketing";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type SelectPlanActionResult = {
  ok: boolean;
  message: string;
};

const selectPlanSchema = z.object({
  leadId: z.string().uuid(),
  token: z.string().uuid(),
  planId: z.string().min(1)
});

export async function selectPublicPlanAction(
  formData: FormData
): Promise<SelectPlanActionResult> {
  const parsed = selectPlanSchema.safeParse({
    leadId: formData.get("leadId"),
    token: formData.get("token"),
    planId: formData.get("planId")
  });

  if (!parsed.success) {
    return { ok: false, message: "Não foi possível identificar o plano escolhido." };
  }

  const plan = publicPlanOptions.find((item) => item.id === parsed.data.planId);

  if (!plan) {
    return { ok: false, message: "Plano não encontrado." };
  }

  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return { ok: false, message: "Supabase não está configurado para salvar a escolha." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("public_leads")
    .update({
      selected_plan: plan.id,
      checkout_status: "plan_selected"
    })
    .eq("id", parsed.data.leadId)
    .eq("public_token", parsed.data.token);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      return {
        ok: true,
        message: `Prévia local: plano ${plan.name} selecionado. Checkout real entra nesta etapa.`
      };
    }

    return {
      ok: false,
      message: "Não foi possível salvar o plano. A migration de leads ainda precisa ser aplicada."
    };
  }

  return {
    ok: true,
    message: `Plano ${plan.name} selecionado. Checkout real entra nesta etapa.`
  };
}
