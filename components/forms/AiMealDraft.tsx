"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ParsedMealDraft } from "@/lib/ai/types";

export function AiMealDraft() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ParsedMealDraft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function interpretMeal() {
    setMessage(null);
    setResult(null);

    startTransition(async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
      });
      const data = (await response.json()) as {
        draft?: ParsedMealDraft;
        message?: string;
      };

      if (!response.ok || !data.draft) {
        setMessage(data.message ?? "Não foi possível interpretar a refeição.");
        return;
      }

      setResult(data.draft);
      setMessage(data.message ?? "Interpretação concluída.");
    });
  }

  return (
    <Card className="border-mauve-100 bg-mauve-50/60">
      <div className="flex items-start gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-white text-mauve-500">
          <Sparkles size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink">Adicionar refeição com IA</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Teste a interpretação de texto livre. A IA não define calorias; o sistema usa os alimentos cadastrados.
          </p>
        </div>
      </div>
      <label className="mt-4 block text-sm font-medium text-ink" htmlFor="ai-meal">
        Descreva a refeição
        <textarea
          id="ai-meal"
          className="mt-2 min-h-28 w-full rounded-2xl border border-mauve-100 bg-white p-4 outline-none focus:border-mauve-300 focus:ring-4 focus:ring-mauve-100"
          placeholder="Comi 120 g de arroz, 100 g de feijão e 150 g de frango."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </label>
      <Button
        className="mt-4"
        variant="secondary"
        type="button"
        disabled={isPending || input.trim().length === 0}
        onClick={interpretMeal}
      >
        <Sparkles size={18} aria-hidden="true" />
        {isPending ? "Interpretando..." : "Interpretar refeição"}
      </Button>
      {message ? (
        <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm leading-6 text-stone-700">
          {message}
        </p>
      ) : null}
      {result ? (
        <div className="mt-4 rounded-2xl bg-white/70 p-4">
          <p className="text-sm font-semibold text-ink">Rascunho interpretado</p>
          <p className="mt-2 text-sm text-stone-600">Tipo: {result.mealType}</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-700">
            {result.items.map((item, index) => (
              <li key={`${item.foodName}-${index}`}>
                {item.foodName}: {item.quantity} {item.unit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
