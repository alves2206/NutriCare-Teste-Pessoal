import { FoodManager } from "@/components/foods/FoodManager";
import { AppShell } from "@/components/layout/AppShell";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireCurrentUser } from "@/lib/auth/user";
import { listFoods } from "@/lib/repositories/foods";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function FoodsPage() {
  await requireCurrentUser();
  const foods = await listFoods();
  const { isConfigured } = getSupabaseEnv();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Base demonstrativa"
          title="Alimentos"
          description="Cadastre, consulte e edite alimentos com valores nutricionais por quantidade de referência."
        />
        <Notice>
          Os valores abaixo são fictícios para facilitar testes da interface e não devem ser usados como orientação nutricional.
        </Notice>
        <FoodManager foods={foods} persistenceEnabled={isConfigured} />
      </div>
    </AppShell>
  );
}
