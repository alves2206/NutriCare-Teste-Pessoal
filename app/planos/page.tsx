import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PlanSelectionButton } from "@/components/marketing/PlanSelectionButton";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { publicPlanOptions } from "@/lib/constants/marketing";

type PlansPageProps = {
  searchParams?: Promise<{
    lead?: string;
    token?: string;
  }>;
};

export default async function PlansPage({ searchParams }: PlansPageProps) {
  const params = await searchParams;
  const leadId = params?.lead;
  const token = params?.token;
  const cameFromEvaluation = Boolean(leadId && token);

  return (
    <main>
      <PublicHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-ink" href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar
        </Link>
        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">
              Planos de acompanhamento
            </p>
            <h1 className="mt-2 text-4xl font-bold text-ink">Escolha como quer ser acompanhada.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Estes valores e nomes são provisórios para aprovação. O checkout real entra no botão de escolha.
            </p>
          </div>
          {!cameFromEvaluation ? (
            <Link className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-ink ring-1 ring-rosepetal-200 hover:bg-rosepetal-50" href="/avaliacao">
              Fazer avaliação antes
            </Link>
          ) : null}
        </header>

        <div className="mt-6">
          <Notice>
            {cameFromEvaluation
              ? "Avaliação recebida. Ao escolher um plano, o lead fica marcado para checkout."
              : "O fluxo ideal é preencher a avaliação antes dos planos para personalizar a recomendação."}
          </Notice>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {publicPlanOptions.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col ${plan.highlighted ? "border-rosepetal-200 ring-2 ring-rosepetal-100" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-ink">{plan.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{plan.description}</p>
                </div>
                {plan.whatsapp ? (
                  <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-sage-100 text-sage-500">
                    <MessageCircle size={17} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
                    <ShieldCheck size={17} aria-hidden="true" />
                  </span>
                )}
              </div>
              {plan.highlighted ? (
                <span className="mt-4 w-fit rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                  Mais equilibrado
                </span>
              ) : null}
              <p className="mt-5 text-3xl font-bold text-ink">{plan.price}</p>
              <p className="text-sm text-stone-500">{plan.period}</p>
              <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-stone-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <PlanSelectionButton planId={plan.id} leadId={leadId} token={token} />
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-ink">Próxima etapa técnica</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Depois da aprovação, este botão cria checkout via Pix/cartão. Quando o pagamento for aprovado, o lead vira cliente,
            recebe acesso e aparece no painel admin para revisão do plano.
          </p>
        </Card>
      </div>
    </main>
  );
}
