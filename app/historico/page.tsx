import { AppShell } from "@/components/layout/AppShell";
import { HistoryManager } from "@/components/meals/HistoryManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireCurrentUser } from "@/lib/auth/user";
import { listFoods } from "@/lib/repositories/foods";
import { listMealsInRange } from "@/lib/repositories/meals";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function HistoryPage() {
  await requireCurrentUser();
  const today = new Date().toISOString().slice(0, 10);
  const [foods, meals] = await Promise.all([
    listFoods(),
    listMealsInRange("1900-01-01", today)
  ]);
  const { isConfigured } = getSupabaseEnv();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Histórico alimentar"
          title="Histórico"
          description="Navegue entre dias e confira os totais nutricionais de cada período."
        />
        <HistoryManager foods={foods} meals={meals} persistenceEnabled={isConfigured} />
      </div>
    </AppShell>
  );
}
