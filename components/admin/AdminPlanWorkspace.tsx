"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";
import { generatePlanAction, publishPlanAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import type { ClientProfile } from "@/lib/repositories/client-profiles";
import type { CoachingPlan } from "@/lib/repositories/coaching-plans";

type AdminPlanWorkspaceProps = {
  profiles: Array<{
    profile: ClientProfile;
    plans: CoachingPlan[];
  }>;
};

export function AdminPlanWorkspace({ profiles }: AdminPlanWorkspaceProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3500);
  }

  function generate(profileId: string) {
    setPendingId(profileId);
    startTransition(async () => {
      const result = await generatePlanAction(profileId);
      showToast(result.message);
      setPendingId(null);
      router.refresh();
    });
  }

  function publish(planId: string) {
    setPendingId(planId);
    startTransition(async () => {
      const result = await publishPlanAction(planId);
      showToast(result.message);
      setPendingId(null);
      router.refresh();
    });
  }

  if (profiles.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-ink">Nenhum perfil enviado</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Quando a pessoa preencher a introducao em Perfil inicial, ela aparece aqui para gerar o rascunho.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {profiles.map(({ profile, plans }) => {
          const latestPlan = plans[0];
          const draftPlans = plans.filter((plan) => plan.status === "draft");

          return (
            <Card key={profile.id} className="space-y-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-ink">{profile.fullName}</h2>
                    <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-stone-700">
                      {profile.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{profile.email}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
                    Objetivo: {profile.objective}. Atividade: {profile.activityLevel}. Refeicoes/dia: {profile.mealsPerDay}.
                  </p>
                </div>
                <Button onClick={() => generate(profile.id)} disabled={isPending && pendingId === profile.id}>
                  <Sparkles size={18} aria-hidden="true" />
                  {isPending && pendingId === profile.id ? "Gerando..." : "Gerar rascunho"}
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <ProfileInfo title="Preferencias" value={profile.foodLikes || "Nao informado"} />
                <ProfileInfo title="Evitar" value={profile.foodDislikes || "Nao informado"} />
                <ProfileInfo title="Restricoes" value={profile.restrictions || "Nao informado"} />
                <ProfileInfo title="Rotina" value={profile.routine || "Nao informado"} />
                <ProfileInfo title="Treino" value={`${profile.trainingGoal || "Nao informado"} · ${profile.trainingLocation || "local nao informado"}`} />
                <ProfileInfo title="Equipamentos/limitacoes" value={profile.availableEquipment || "Nao informado"} />
              </div>

              {draftPlans.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-ink">Rascunhos aguardando publicacao</h3>
                  {draftPlans.map((plan) => (
                    <div key={plan.id} className="space-y-3 rounded-2xl bg-white/70 p-4 ring-1 ring-rosepetal-100">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">
                          {plan.source === "gemini" ? "Gerado com Gemini" : "Gerado em modo teste"}
                        </p>
                        <h4 className="mt-1 text-xl font-bold text-ink">{plan.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{plan.nutritionSummary}</p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{plan.workoutSummary}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
                          <span className="rounded-full bg-rosepetal-50 px-3 py-1">{plan.meals.length} refeicoes</span>
                          <span className="rounded-full bg-sage-100 px-3 py-1">{plan.workouts.length} treinos</span>
                        </div>
                      </div>
                      <Button onClick={() => publish(plan.id)} disabled={isPending && pendingId === plan.id}>
                        <CheckCircle2 size={18} aria-hidden="true" />
                        {isPending && pendingId === plan.id ? "Publicando..." : "Publicar para usuario"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : latestPlan ? (
                <div className="rounded-2xl bg-sage-100/60 p-4 text-sm leading-6 text-stone-700">
                  Ultimo plano: {latestPlan.title} ({latestPlan.status})
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
      {toast ? <Toast message={toast} /> : null}
    </>
  );
}

function ProfileInfo({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/72 p-4 ring-1 ring-rosepetal-100">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rosepetal-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-700">{value}</p>
    </div>
  );
}
