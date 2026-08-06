import { demoGoals } from "@/lib/data/demo";
import { getCurrentUser } from "@/lib/auth/user";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { ProfileGoals } from "@/types/nutrition";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type Profile = ProfileGoals & {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  heightCm: number;
  biologicalSex: string;
  goal: string;
  weightUnit: string;
  theme: string;
};

export function mapProfileRow(row: ProfileRow, email: string): Profile {
  return {
    id: row.id,
    name: row.name ?? "",
    email,
    birthDate: row.birth_date ?? "",
    heightCm: Number(row.height_cm ?? 0),
    biologicalSex: row.biological_sex ?? "Prefiro não informar",
    goal: row.goal ?? "Acompanhamento nutricional",
    calorieTarget: Number(row.calorie_target ?? demoGoals.calorieTarget),
    proteinTarget: Number(row.protein_target ?? demoGoals.proteinTarget),
    carbohydrateTarget: Number(row.carbohydrate_target ?? demoGoals.carbohydrateTarget),
    fatTarget: Number(row.fat_target ?? demoGoals.fatTarget),
    fiberTarget: Number(row.fiber_target ?? demoGoals.fiberTarget),
    waterTarget: Number(row.water_target ?? demoGoals.waterTarget),
    weightUnit: row.weight_unit ?? "kg",
    theme: row.theme ?? "light"
  };
}

export async function getProfile() {
  const { isConfigured } = getSupabaseEnv();
  const user = await getCurrentUser();

  if (!isConfigured || !user) {
    return {
      id: "demo-profile",
      name: "Usuária NutriCare",
      email: "usuario@exemplo.com",
      birthDate: "1994-05-10",
      heightCm: 165,
      biologicalSex: "Prefiro não informar",
      goal: "Acompanhamento nutricional",
      ...demoGoals,
      weightUnit: "kg",
      theme: "light"
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível carregar o perfil.");
  }

  if (!data) {
    return {
      id: "new-profile",
      name: user.user_metadata.name ?? "",
      email: user.email ?? "",
      birthDate: "",
      heightCm: 0,
      biologicalSex: "Prefiro não informar",
      goal: "Acompanhamento nutricional",
      ...demoGoals,
      weightUnit: "kg",
      theme: "light"
    };
  }

  return mapProfileRow(data, user.email ?? "");
}

export async function getProfileGoals() {
  const profile = await getProfile();

  return {
    calorieTarget: profile.calorieTarget,
    proteinTarget: profile.proteinTarget,
    carbohydrateTarget: profile.carbohydrateTarget,
    fatTarget: profile.fatTarget,
    fiberTarget: profile.fiberTarget,
    waterTarget: profile.waterTarget
  };
}
