import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { healthDisclaimer } from "@/lib/constants/app";
import { requireCurrentUser } from "@/lib/auth/user";
import { getProfile } from "@/lib/repositories/profiles";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function SettingsPage() {
  await requireCurrentUser();
  const profile = await getProfile();
  const { isConfigured } = getSupabaseEnv();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Perfil e metas"
          title="Configurações"
          description="Defina manualmente seus dados pessoais e metas de acompanhamento."
        />
        <Notice>{healthDisclaimer}</Notice>
        <Card>
          <ProfileSettingsForm profile={profile} persistenceEnabled={isConfigured} />
        </Card>
      </div>
    </AppShell>
  );
}
