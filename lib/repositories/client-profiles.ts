import { getCurrentUser } from "@/lib/auth/user";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ClientProfileRow = Database["public"]["Tables"]["client_profiles"]["Row"];

export type ClientProfile = {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  objective: string;
  birthDate: string;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  biologicalSex: string;
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
  adminNotes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function asNumber(value: number | null) {
  return Number(value ?? 0);
}

export function mapClientProfileRow(row: ClientProfileRow): ClientProfile {
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    fullName: row.full_name,
    objective: row.objective,
    birthDate: row.birth_date ?? "",
    heightCm: asNumber(row.height_cm),
    currentWeightKg: asNumber(row.current_weight_kg),
    targetWeightKg: asNumber(row.target_weight_kg),
    biologicalSex: row.biological_sex ?? "",
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
    adminNotes: row.admin_notes ?? "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getCurrentClientProfile() {
  const { isConfigured } = getSupabaseEnv();
  const user = await getCurrentUser();

  if (!isConfigured || !user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data ? mapClientProfileRow(data) : null;
}

export async function listClientProfilesForAdmin() {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data.map(mapClientProfileRow);
}

export async function getClientProfileById(profileId: string) {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapClientProfileRow(data);
}
