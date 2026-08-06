import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Brain, LockKeyhole, Sparkles } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicIntakeForm } from "@/components/marketing/PublicIntakeForm";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";

export default function PublicEvaluationPage() {
  return (
    <main>
      <PublicHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-ink" href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar
        </Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <Card>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">
                Avaliação inicial
              </p>
              <h1 className="mt-2 text-3xl font-bold text-ink">Conte sua rotina antes de escolher um plano.</h1>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                As respostas viram um lead organizado para a Iris avaliar e, depois do plano escolhido, gerar um rascunho com IA.
              </p>
            </Card>
            <Card>
              <div className="space-y-4">
                <SideItem icon={Brain} title="IA como pré-análise" text="A IA ajuda a organizar um rascunho, sem entregar dieta completa antes do acompanhamento." />
                <SideItem icon={Sparkles} title="Plano certo" text="A pessoa escolhe entre planos com ou sem suporte próximo." />
                <SideItem icon={LockKeyhole} title="Acesso depois" text="Login e área do cliente entram após aprovação/pagamento." />
              </div>
            </Card>
            <Notice>
              Protótipo local: o checkout real ainda não está ativado. Esta etapa serve para aprovar fluxo e textos.
            </Notice>
          </aside>
          <Card>
            <PublicIntakeForm />
          </Card>
        </div>
      </div>
    </main>
  );
}

function SideItem({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
      </div>
    </div>
  );
}
