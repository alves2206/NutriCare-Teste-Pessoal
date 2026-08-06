import { demoWeightEntries } from "@/lib/data/demo";
import { getCurrentUser } from "@/lib/auth/user";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { WeightEntry } from "@/types/nutrition";

type WeightRow = Database["public"]["Tables"]["weight_entries"]["Row"];

export function mapWeightRow(row: WeightRow): WeightEntry {
  return {
    id: row.id,
    date: row.entry_date,
    weightKg: Number(row.weight_kg),
    notes: row.notes ?? undefined
  };
}

export async function listWeightEntries() {
  const { isConfigured } = getSupabaseEnv();
  const user = await getCurrentUser();

  if (!isConfigured || !user) {
    return demoWeightEntries;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("weight_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar os registros de peso.");
  }

  return data.map(mapWeightRow);
}
