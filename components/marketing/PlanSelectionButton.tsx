"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { selectPublicPlanAction } from "@/app/planos/actions";
import { Button } from "@/components/ui/Button";

type PlanSelectionButtonProps = {
  planId: string;
  leadId?: string;
  token?: string;
};

export function PlanSelectionButton({ planId, leadId, token }: PlanSelectionButtonProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function selectPlan() {
    if (!leadId || !token) {
      window.location.href = "/avaliacao";
      return;
    }

    const formData = new FormData();
    formData.set("leadId", leadId);
    formData.set("token", token);
    formData.set("planId", planId);

    startTransition(async () => {
      const result = await selectPublicPlanAction(formData);
      setMessage(result.message);
    });
  }

  return (
    <div>
      <Button className="w-full" onClick={selectPlan} disabled={isPending}>
        {message ? <CheckCircle2 size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
        {isPending ? "Selecionando..." : message ? "Plano selecionado" : "Escolher plano"}
      </Button>
      {message ? <p className="mt-2 text-center text-xs font-medium text-stone-600">{message}</p> : null}
    </div>
  );
}
