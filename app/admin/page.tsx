import { AdminPlanWorkspace } from "@/components/admin/AdminPlanWorkspace";
import { PublicLeadInbox } from "@/components/admin/PublicLeadInbox";
import { AppShell } from "@/components/layout/AppShell";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireAdminUser } from "@/lib/auth/admin";
import { listClientProfilesForAdmin } from "@/lib/repositories/client-profiles";
import { listPlansForUserForAdmin } from "@/lib/repositories/coaching-plans";
import { listPublicLeadsForAdmin } from "@/lib/repositories/public-leads";

export default async function AdminPage() {
  await requireAdminUser();

  const [profiles, publicLeads] = await Promise.all([
    listClientProfilesForAdmin(),
    listPublicLeadsForAdmin()
  ]);
  const profilesWithPlans = await Promise.all(
    profiles.map(async (profile) => ({
      profile,
      plans: await listPlansForUserForAdmin(profile.userId)
    }))
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Admin"
          title="Geracao de planos"
          description="Revise o perfil enviado, gere um rascunho com IA ou modo local e publique para o usuario."
        />
        <Notice>
          A IA fica acoplada ao admin: ela cria rascunhos, mas o usuario so ve o plano depois da publicacao.
        </Notice>
        <PublicLeadInbox leads={publicLeads} />
        <AdminPlanWorkspace profiles={profilesWithPlans} />
      </div>
    </AppShell>
  );
}
