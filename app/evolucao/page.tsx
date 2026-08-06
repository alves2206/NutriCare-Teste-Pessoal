import { WeightManager } from "@/components/charts/WeightManager";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireCurrentUser } from "@/lib/auth/user";
import { listWeightEntries } from "@/lib/repositories/weights";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function EvolutionPage() {
  await requireCurrentUser();
  const entries = await listWeightEntries();
  const { isConfigured } = getSupabaseEnv();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Peso corporal"
          title="Evolução"
          description="Registre o peso e acompanhe a tendência ao longo do tempo, sem julgamentos ou mensagens negativas."
        />
        <WeightManager entries={entries} persistenceEnabled={isConfigured} />
      </div>
    </AppShell>
  );
}
