"use client";

import { useState, useTransition } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { AiMealDraft } from "@/components/forms/AiMealDraft";
import { MealForm } from "@/components/forms/MealForm";
import { MealCard } from "@/components/meals/MealCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { deleteMealAction } from "@/app/refeicoes/actions";
import type { Food, Meal } from "@/types/nutrition";

type MealManagerProps = {
  foods: Food[];
  meals: Meal[];
  persistenceEnabled: boolean;
};

export function MealManager({ foods, meals, persistenceEnabled }: MealManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [deletingMeal, setDeletingMeal] = useState<Meal | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function openCreateForm() {
    setEditingMeal(null);
    setIsFormOpen(true);
  }

  function confirmDelete() {
    if (!deletingMeal) {
      return;
    }

    startTransition(async () => {
      const result = await deleteMealAction(deletingMeal.id);
      setDeletingMeal(null);
      showToast(result.message);
    });
  }

  return (
    <div className="space-y-6">
      {!persistenceEnabled ? (
        <Card className="border-mauve-100 bg-mauve-50/70">
          <p className="text-sm leading-6 text-stone-700">
            Você está vendo refeições demonstrativas. Configure o Supabase para salvar registros reais.
          </p>
        </Card>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {isFormOpen ? "Registro de refeição" : "Registro manual"}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Selecione alimentos cadastrados e confira o total antes de salvar.
              </p>
            </div>
            {!isFormOpen ? (
              <Button onClick={openCreateForm} disabled={!persistenceEnabled || foods.length === 0}>
                <Plus size={18} aria-hidden="true" />
                Nova refeição
              </Button>
            ) : null}
          </div>
          <div className="mt-5">
            {isFormOpen ? (
              <MealForm
                foods={foods}
                initialMeal={editingMeal}
                onCancel={() => setIsFormOpen(false)}
                onDone={(result) => {
                  setIsFormOpen(false);
                  showToast(result.message);
                }}
              />
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="Pronta para registrar"
                description="Use o botão de nova refeição para montar uma refeição com vários alimentos."
              />
            )}
          </div>
        </Card>
        <AiMealDraft />
      </div>
      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">Registros recentes</h2>
        {meals.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={
                  persistenceEnabled
                    ? () => {
                        setEditingMeal(meal);
                        setIsFormOpen(true);
                      }
                    : undefined
                }
                onDelete={persistenceEnabled ? () => setDeletingMeal(meal) : undefined}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="Nenhuma refeição registrada"
            description="Quando uma refeição for salva, ela aparecerá aqui em formato de card."
          />
        )}
      </section>
      {deletingMeal ? (
        <ConfirmModal
          title="Excluir refeição?"
          description={`Essa ação removerá o registro de ${deletingMeal.type}.`}
          confirmLabel={isPending ? "Excluindo..." : "Excluir"}
          onCancel={() => setDeletingMeal(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
