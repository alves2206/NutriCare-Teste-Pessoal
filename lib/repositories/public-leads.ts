import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicPlanOptions } from "@/lib/constants/marketing";
import type { Database } from "@/types/database";

type PublicLeadRow = Database["public"]["Tables"]["public_leads"]["Row"];

export type PublicLead = {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  objective: string;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: string;
  mealsPerDay: number;
  routine: string;
  foodLikes: string;
  foodDislikes: string;
  restrictions: string;
  healthNotes: string;
  trainingGoal: string;
  trainingExperience: string;
  trainingLocation: string;
  trainingDaysPerWeek: number;
  availableEquipment: string;
  selectedPlan: string;
  selectedPlanName: string;
  checkoutStatus: string;
  createdAt: string;
};

function asNumber(value: number | null) {
  return Number(value ?? 0);
}

export function mapPublicLeadRow(row: PublicLeadRow): PublicLead {
  const selectedPlan = publicPlanOptions.find((plan) => plan.id === row.selected_plan);

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    whatsapp: row.whatsapp ?? "",
    objective: row.objective,
    currentWeightKg: asNumber(row.current_weight_kg),
    targetWeightKg: asNumber(row.target_weight_kg),
    activityLevel: row.activity_level,
    mealsPerDay: Number(row.meals_per_day ?? 5),
    routine: row.routine ?? "",
    foodLikes: row.food_likes ?? "",
    foodDislikes: row.food_dislikes ?? "",
    restrictions: row.restrictions ?? "",
    healthNotes: row.health_notes ?? "",
    trainingGoal: row.training_goal ?? "",
    trainingExperience: row.training_experience ?? "",
    trainingLocation: row.training_location ?? "",
    trainingDaysPerWeek: Number(row.training_days_per_week ?? 0),
    availableEquipment: row.available_equipment ?? "",
    selectedPlan: row.selected_plan ?? "",
    selectedPlanName: selectedPlan?.name ?? row.selected_plan ?? "Não escolhido",
    checkoutStatus: row.checkout_status,
    createdAt: row.created_at
  };
}

export async function listPublicLeadsForAdmin() {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("public_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return [];
  }

  return data.map(mapPublicLeadRow);
}
