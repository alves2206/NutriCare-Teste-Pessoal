import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Dumbbell, MessageCircle, Sparkles, Utensils } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { Card } from "@/components/ui/Card";
import { publicPlanOptions } from "@/lib/constants/marketing";

export default function HomePage() {
  const featuredPlan = publicPlanOptions.find((plan) => plan.highlighted);

  return (
    <main>
      <PublicHeader />
      <section className="mx-auto grid min-h-[calc(100svh-68px)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">
            Iris Carvalho · Resende RJ
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Avaliação inteligente para um plano de alimentação e treino mais possível de seguir.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
            Um fluxo simples para entender sua rotina, preferências, restrições e objetivo antes de escolher o acompanhamento ideal.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-[#463841]"
              href="/avaliacao"
            >
              Começar avaliação
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink ring-1 ring-rosepetal-200 hover:bg-rosepetal-50"
              href="/planos"
            >
              Ver planos
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <TrustItem icon={Utensils} text="Preferências organizadas" />
            <TrustItem icon={Dumbbell} text="Treino por perfil" />
            <TrustItem icon={MessageCircle} text="Opção com WhatsApp" />
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/88 shadow-soft">
            <div className="grid min-h-[28rem] grid-rows-[1fr_auto]">
              <div className="relative min-h-[26rem] bg-[#f3e8ed]">
                <Image
                  src="/iris/iris-profissional.png"
                  alt="Iris Carvalho Costa usando jaleco de nutrição"
                  fill
                  className="object-cover object-[center_18%]"
                  priority
                  sizes="(min-width: 1024px) 560px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 max-w-[20rem] rounded-2xl bg-white/92 p-4 shadow-soft backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rosepetal-500">Avaliação personalizada</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    O primeiro passo é entender sua rotina, seu objetivo e o que realmente faz sentido para você.
                  </p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-ink">Estilo de vida, autocuidado, educação física e nutrição.</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Atendimento pensado para rotina real: avaliação, plano alimentar, treino e acompanhamento conforme o plano escolhido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/80 bg-white/62 py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <StepCard title="1. Responda a avaliação" text="Conte sua rotina, objetivo, preferências alimentares, restrições e experiência com treino." />
          <StepCard title="2. Escolha o acompanhamento" text="Compare os planos disponíveis e escolha se quer suporte com WhatsApp, ajustes e acompanhamento mais próximo." />
          <StepCard title="3. Receba o plano validado" text="Após a confirmação, suas informações são analisadas e o plano é preparado para aparecer na área do cliente." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">Acompanhamento humano</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Profissional, próximo e conectado à rotina.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              A avaliação organiza as informações antes do pagamento para a Iris entender objetivo, preferências e limitações.
              Depois, a tecnologia ajuda a estruturar o rascunho, mas a entrega final passa por revisão profissional.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <PhotoTile src="/iris/iris-nutricao.png" alt="Iris Carvalho em registro profissional de nutrição" />
            <PhotoTile src="/iris/iris-lifestyle-1.png" alt="Registro de lifestyle e rotina da Iris Carvalho" />
            <PhotoTile src="/iris/iris-lifestyle-2.png" alt="Registro pessoal de autocuidado da Iris Carvalho" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">Planos</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Escolha depois da avaliação</h2>
          </div>
          <Link className="text-sm font-semibold text-rosepetal-500 hover:text-ink" href="/planos">
            Ver todos
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {publicPlanOptions.slice(0, 2).map((plan) => (
            <Card key={plan.id} className={plan.highlighted ? "border-rosepetal-200" : ""}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{plan.description}</p>
                </div>
                {plan.id === featuredPlan?.id ? (
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-stone-700">
                    recomendado
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-3xl font-bold text-ink">{plan.price}</p>
              <p className="text-sm text-stone-500">{plan.period}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function PhotoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative min-h-64 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-soft">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 240px, 33vw" />
    </div>
  );
}

function TrustItem({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold text-stone-700 ring-1 ring-white">
      <Icon className="size-4 text-rosepetal-500" aria-hidden="true" />
      {text}
    </div>
  );
}

function StepCard({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <Sparkles className="size-5 text-rosepetal-500" aria-hidden="true" />
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </Card>
  );
}
