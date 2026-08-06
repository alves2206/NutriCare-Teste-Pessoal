import Link from "next/link";
import type { ReactNode } from "react";
import { ClipboardList } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PlanViewer } from "@/components/plans/PlanViewer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireCurrentUser } from "@/lib/auth/user";
import { getCurrentClientProfile } from "@/lib/repositories/client-profiles";
import { getPublishedPlanForCurrentUser } from "@/lib/repositories/coaching-plans";

export default async function PlanPage() {
  await requireCurrentUser();
  const [profile, plan] = await Promise.all([
    getCurrentClientProfile(),
    getPublishedPlanForCurrentUser()
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Plano travado"
          title="Plano alimentar"
          description="Aqui fica o plano publicado pela administradora. A pessoa visualiza, mas nao edita as refeicoes."
          action={
            <Link href="/onboarding">
              <Button variant="secondary">Atualizar perfil</Button>
            </Link>
          }
        />
        {!profile ? (
          <EmptyPlanState
            title="Perfil inicial pendente"
            description="Preencha a introducao para a nutricionista e personal conseguirem gerar seu acompanhamento."
            action={
              <Link href="/onboarding">
                <Button>Preencher perfil</Button>
              </Link>
            }
          />
        ) : plan ? (
          <PlanViewer plan={plan} mode="nutrition" />
        ) : (
          <EmptyPlanState
            title="Plano em preparacao"
            description="Seu perfil foi recebido. O plano aparece aqui depois que o admin gerar, revisar e publicar."
          />
        )}
      </div>
    </AppShell>
  );
}

function EmptyPlanState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="grid min-h-64 place-items-center text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-mauve-100 text-mauve-500">
          <ClipboardList aria-hidden="true" size={22} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </Card>
  );
}
