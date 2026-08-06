import { AppShell } from "@/components/layout/AppShell";
import { MealManager } from "@/components/meals/MealManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireCurrentUser } from "@/lib/auth/user";
import { listFoods } from "@/lib/repositories/foods";
import { listMealsByDate } from "@/lib/repositories/meals";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function MealsPage() {
  await requireCurrentUser();
  const today = new Date().toISOString().slice(0, 10);
  const [foods, meals] = await Promise.all([listFoods(), listMealsByDate(today)]);
  const { isConfigured } = getSupabaseEnv();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Registro manual"
          title="Refeições"
          description="Monte uma refeição com alimentos cadastrados e confira o total nutricional antes de salvar."
        />
        <MealManager foods={foods} meals={meals} persistenceEnabled={isConfigured} />
      </div>
    </AppShell>
  );
}
