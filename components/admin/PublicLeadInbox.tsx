import type { LucideIcon } from "lucide-react";
import { CalendarClock, MessageCircle, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { PublicLead } from "@/lib/repositories/public-leads";

type PublicLeadInboxProps = {
  leads: PublicLead[];
};

export function PublicLeadInbox({ leads }: PublicLeadInboxProps) {
  if (leads.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-ink">Leads públicos</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Quando alguém preencher a avaliação pública, o lead aparece aqui com plano escolhido e status do checkout.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-ink">Leads públicos</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          Pessoas que passaram pela avaliação antes do login.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {leads.map((lead) => (
          <Card key={lead.id} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-ink">{lead.fullName}</h3>
                <p className="mt-1 text-sm text-stone-500">{lead.email}</p>
                <p className="mt-1 text-sm text-stone-500">{lead.whatsapp || "WhatsApp não informado"}</p>
              </div>
              <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-stone-700">
                {lead.checkoutStatus}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniInfo icon={ShoppingBag} title="Plano" value={lead.selectedPlanName} />
              <MiniInfo icon={MessageCircle} title="Objetivo" value={lead.objective} />
              <MiniInfo icon={CalendarClock} title="Treino" value={lead.trainingGoal || "Não informado"} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <LeadDetail title="Preferências" value={lead.foodLikes || "Não informado"} />
              <LeadDetail title="Evitar" value={lead.foodDislikes || "Não informado"} />
              <LeadDetail title="Restrições" value={lead.restrictions || "Não informado"} />
              <LeadDetail title="Rotina" value={lead.routine || "Não informado"} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function MiniInfo({
  icon: Icon,
  title,
  value
}: {
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/72 p-3 ring-1 ring-rosepetal-100">
      <Icon className="size-4 text-rosepetal-500" aria-hidden="true" />
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function LeadDetail({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/72 p-3 ring-1 ring-rosepetal-100">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rosepetal-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-700">{value}</p>
    </div>
  );
}
