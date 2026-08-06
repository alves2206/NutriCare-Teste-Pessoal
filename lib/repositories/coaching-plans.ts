import { getCurrentUser } from "@/lib/auth/user";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database";

type CoachingPlanRow = Database["public"]["Tables"]["coaching_plans"]["Row"];

export type CoachingMeal = {
  mealType: string;
  time: string;
  title: string;
  items: string[];
  notes: string;
  calories?: number;
  protein?: number;
};

export type WorkoutExercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
};

export type WorkoutDay = {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
};

export type CoachingPlan = {
  id: string;
  userId: string;
  createdBy: string;
  title: string;
  status: string;
  source: string;
  nutritionSummary: string;
  workoutSummary: string;
  meals: CoachingMeal[];
  workouts: WorkoutDay[];
  notes: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item)).filter(Boolean)
    : [];
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function normalizeMeals(value: Json): CoachingMeal[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const records: Record<string, unknown>[] = [];

  for (const item of value) {
    if (isRecord(item)) {
      records.push(item);
    }
  }

  return records.map((item) => ({
    mealType: String(item.mealType ?? "Refeicao"),
    time: String(item.time ?? ""),
    title: String(item.title ?? ""),
    items: stringList(item.items),
    notes: String(item.notes ?? ""),
    calories: numberValue(item.calories),
    protein: numberValue(item.protein)
  }));
}

export function normalizeWorkouts(value: Json): WorkoutDay[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const records: Record<string, unknown>[] = [];

  for (const item of value) {
    if (isRecord(item)) {
      records.push(item);
    }
  }

  return records.map((item) => ({
    day: String(item.day ?? ""),
    focus: String(item.focus ?? ""),
    exercises: Array.isArray(item.exercises)
      ? item.exercises.filter(isRecord).map((exercise) => ({
          name: String(exercise.name ?? ""),
          sets: String(exercise.sets ?? ""),
          reps: String(exercise.reps ?? ""),
          rest: String(exercise.rest ?? ""),
          notes: String(exercise.notes ?? "")
        }))
      : []
  }));
}

export function mapCoachingPlanRow(row: CoachingPlanRow): CoachingPlan {
  return {
    id: row.id,
    userId: row.user_id,
    createdBy: row.created_by ?? "",
    title: row.title,
    status: row.status,
    source: row.source,
    nutritionSummary: row.nutrition_summary,
    workoutSummary: row.workout_summary,
    meals: normalizeMeals(row.meals),
    workouts: normalizeWorkouts(row.workouts),
    notes: row.notes ?? "",
    publishedAt: row.published_at ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getPublishedPlanForCurrentUser() {
  const { isConfigured } = getSupabaseEnv();
  const user = await getCurrentUser();

  if (!isConfigured || !user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("coaching_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapCoachingPlanRow(data);
}

export async function listPlansForUserForAdmin(userId: string) {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("coaching_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data.map(mapCoachingPlanRow);
}
