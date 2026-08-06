"use client";

import { useMemo, useState, useTransition } from "react";
import { Apple, Plus, Search } from "lucide-react";
import { FoodForm } from "@/components/forms/FoodForm";
import { FoodCard } from "@/components/foods/FoodCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { foodCategories } from "@/lib/constants/app";
import type { Food } from "@/types/nutrition";
import { deleteFoodAction } from "@/app/alimentos/actions";

type FoodManagerProps = {
  foods: Food[];
  persistenceEnabled: boolean;
};

export function FoodManager({ foods, persistenceEnabled }: FoodManagerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas as categorias");
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingFood, setDeletingFood] = useState<Food | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredFoods = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        food.name.toLowerCase().includes(normalizedQuery) ||
        food.brand?.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        category === "Todas as categorias" || food.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [category, foods, query]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function openCreateForm() {
    setEditingFood(null);
    setIsFormOpen(true);
  }

  function openEditForm(food: Food) {
    setEditingFood(food);
    setIsFormOpen(true);
  }

  function confirmDelete() {
    if (!deletingFood) {
      return;
    }

    startTransition(async () => {
      const result = await deleteFoodAction(deletingFood.id);
      setDeletingFood(null);
      showToast(result.message);
    });
  }

  return (
    <div className="space-y-5">
      {!persistenceEnabled ? (
        <Card className="border-mauve-100 bg-mauve-50/70">
          <p className="text-sm leading-6 text-stone-700">
            Você está vendo a prévia com dados demonstrativos. Configure o Supabase para ativar criação, edição e exclusão reais.
          </p>
        </Card>
      ) : null}
      <div className="grid gap-3 rounded-2xl bg-white/72 p-3 ring-1 ring-white sm:grid-cols-[1fr_220px_auto]">
        <label className="relative block">
          <span className="sr-only">Buscar alimento</span>
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            className="min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white py-2 pl-12 pr-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            placeholder="Buscar por nome"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por categoria</span>
          <select
            className="min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 text-stone-700 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Todas as categorias</option>
            {foodCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <Button onClick={openCreateForm} disabled={!persistenceEnabled}>
          <Plus size={18} aria-hidden="true" />
          Novo alimento
        </Button>
      </div>
      {isFormOpen ? (
        <Card>
          <h2 className="mb-5 text-lg font-semibold text-ink">
            {editingFood ? "Editar alimento" : "Novo alimento"}
          </h2>
          <FoodForm
            initialFood={editingFood}
            onCancel={() => setIsFormOpen(false)}
            onDone={(result) => {
              setIsFormOpen(false);
              showToast(result.message);
            }}
          />
        </Card>
      ) : null}
      {filteredFoods.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onEdit={persistenceEnabled ? () => openEditForm(food) : undefined}
              onDelete={persistenceEnabled ? () => setDeletingFood(food) : undefined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Apple}
          title="Nenhum alimento encontrado"
          description="Ajuste a busca ou cadastre um novo alimento para começar sua base pessoal."
        />
      )}
      {deletingFood ? (
        <ConfirmModal
          title="Excluir alimento?"
          description={`Essa ação removerá "${deletingFood.name}" da sua base. Refeições antigas manterão os valores já calculados.`}
          confirmLabel={isPending ? "Excluindo..." : "Excluir"}
          onCancel={() => setDeletingFood(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
