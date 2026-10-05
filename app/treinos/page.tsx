import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PlanViewer } from "@/components/plans/PlanViewer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireCurrentUser } from "@/lib/auth/user";
import { getCurrentClientProfile } from "@/lib/repositories/client-profiles";
import { getPublishedPlanForCurrentUser } from "@/lib/repositories/coaching-plans";

export default async function WorkoutsPage() {
  await requireCurrentUser();
  const [profile, plan] = await Promise.all([
    getCurrentClientProfile(),
    getPublishedPlanForCurrentUser()
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Movimento"
          title="Meu treino"
          description="Seus exercícios organizados para acompanhar sua evolução."
        />
        {profile && plan ? (
          <PlanViewer plan={plan} mode="workouts" />
        ) : (
          <Card className="grid min-h-64 place-items-center text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sage-100 text-sage-500">
                <Dumbbell aria-hidden="true" size={22} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-ink">
                  {profile ? "Seu treino está sendo preparado" : "Vamos completar seu perfil"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                {profile
                  ? "Assim que suas orientações estiverem prontas, elas aparecerão aqui para você consultar."
                  : "Conte um pouco mais sobre seus objetivos, local de treino e dias disponíveis."}
              </p>
              {!profile ? (
                <div className="mt-5">
                  <Link href="/onboarding">
                    <Button>Preencher perfil</Button>
                  </Link>
                </div>
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
