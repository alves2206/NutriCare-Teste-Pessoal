import { ArrowRight, ClipboardList, Dumbbell, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requireCurrentUser } from "@/lib/auth/user";
import { isAdminEmail } from "@/lib/supabase/env";
import { getCurrentClientProfile } from "@/lib/repositories/client-profiles";
import { getPublishedPlanForCurrentUser } from "@/lib/repositories/coaching-plans";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const isAdmin = isAdminEmail(user.email);
  const [profile, plan] = await Promise.all([
    getCurrentClientProfile(),
    getPublishedPlanForCurrentUser()
  ]);
  const firstName = (profile?.fullName || user.email?.split("@")[0] || "cliente").split(" ")[0];

  return (
    <AppShell>
      <div className="space-y-7">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">
            Seu acompanhamento
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Olá, {firstName}.
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Tudo o que você precisa para seguir sua rotina está aqui.
          </p>
        </header>

        <section aria-labelledby="main-choices" className="grid gap-4 md:grid-cols-2">
          <h2 id="main-choices" className="sr-only">Acessos principais</h2>
          <Link href="/plano" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-rosepetal-400 focus-visible:ring-offset-4">
            <Card className="flex min-h-56 flex-col justify-between border-rosepetal-200 bg-rosepetal-50/70 p-6 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg sm:min-h-64 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-white text-rosepetal-500 shadow-soft">
                  <ClipboardList size={27} aria-hidden="true" />
                </span>
                <ArrowRight className="text-rosepetal-500 transition group-hover:translate-x-1" size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink">Minha dieta</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-stone-600">
                  Consulte suas refeições, quantidades e orientações.
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/treinos" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-4">
            <Card className="flex min-h-56 flex-col justify-between border-sage-100 bg-sage-100/65 p-6 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg sm:min-h-64 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-white text-sage-500 shadow-soft">
                  <Dumbbell size={27} aria-hidden="true" />
                </span>
                <ArrowRight className="text-sage-500 transition group-hover:translate-x-1" size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink">Meu treino</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-stone-600">
                  Veja os exercícios, séries, repetições e descansos.
                </p>
              </div>
            </Card>
          </Link>
        </section>

        <Card className="border-white/80 bg-white/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Seu acompanhamento</p>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                {plan ? "Seu plano está disponível para consulta." : "Seu plano será disponibilizado aqui assim que estiver pronto."}
              </p>
            </div>
            {!profile ? (
              <Link href="/onboarding">
                <Button variant="secondary" className="w-full sm:w-auto">Completar perfil</Button>
              </Link>
            ) : null}
          </div>
        </Card>

        {isAdmin ? (
          <Card className="border-sage-100 bg-sage-100/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-sage-500 shadow-soft">
                  <ShieldCheck size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-ink">Área administrativa</h2>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    Acesso exclusivo para gestão dos acompanhamentos.
                  </p>
                </div>
              </div>
              <Link href="/admin">
                <Button className="w-full sm:w-auto" variant="secondary">
                  Abrir admin
                </Button>
              </Link>
            </div>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
