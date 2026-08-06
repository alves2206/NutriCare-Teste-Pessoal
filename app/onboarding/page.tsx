import { AppShell } from "@/components/layout/AppShell";
import { OnboardingForm } from "@/components/forms/OnboardingForm";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireCurrentUser } from "@/lib/auth/user";
import { getCurrentClientProfile } from "@/lib/repositories/client-profiles";

export default async function OnboardingPage() {
  await requireCurrentUser();
  const profile = await getCurrentClientProfile();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Introducao"
          title="Perfil inicial"
          description="Preencha as informacoes que a nutricionista e personal vao usar para montar o acompanhamento."
        />
        <Notice>
          Nesta versao de teste, o perfil enviado libera a geracao de rascunho no painel admin. O plano so aparece para a pessoa depois de publicado.
        </Notice>
        <Card>
          <OnboardingForm profile={profile} />
        </Card>
      </div>
    </AppShell>
  );
}
