import { Apple, Droplets, Flame, Plus, Scale, ShieldCheck, Wheat } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { MealCard } from "@/components/meals/MealCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { MacroIndicator } from "@/components/dashboard/MacroIndicator";
import { formatDateBR, formatNumberBR } from "@/lib/formatters";
import { getDailyTotals, getRemainingCalories } from "@/lib/nutrition/calculations";
import { requireCurrentUser } from "@/lib/auth/user";
import { isAdminEmail } from "@/lib/supabase/env";
import { listMealsByDate } from "@/lib/repositories/meals";
import { getProfileGoals } from "@/lib/repositories/profiles";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const isAdmin = isAdminEmail(user.email);
  const today = new Date().toISOString().slice(0, 10);
  const [meals, goals] = await Promise.all([listMealsByDate(today), getProfileGoals()]);
  const totals = getDailyTotals(meals);
  const remainingCalories = getRemainingCalories(
    goals.calorieTarget,
    totals.calories
  );
  const caloriesHelper =
    remainingCalories >= 0
      ? `${formatNumberBR(remainingCalories, 0)} kcal restantes hoje`
      : `Meta ultrapassada em ${formatNumberBR(Math.abs(remainingCalories), 0)} kcal`;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Dados demonstrativos"
          title="Olá, sua rotina de hoje"
          description={formatDateBR(new Date())}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/refeicoes">
                <Button className="w-full sm:w-auto">
                  <Plus size={18} aria-hidden="true" />
                  Adicionar refeição
                </Button>
              </Link>
              <Link href="/evolucao">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Scale size={18} aria-hidden="true" />
                  Registrar peso
                </Button>
              </Link>
            </div>
          }
        />
        <Notice>
          Os alimentos e registros exibidos são exemplos para teste visual. Revise valores nutricionais antes do uso real.
        </Notice>
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
                    Acesse leads, avaliações, rascunhos e publicação de planos.
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Calorias"
            value={`${formatNumberBR(totals.calories, 0)} kcal`}
            helper={caloriesHelper}
            icon={Flame}
            progress={{
              value: totals.calories,
              max: goals.calorieTarget,
              tone: "rose"
            }}
          />
          <StatCard
            label="Proteínas"
            value={`${formatNumberBR(totals.protein)} g`}
            helper={`Meta: ${formatNumberBR(goals.proteinTarget)} g`}
            icon={Apple}
            progress={{
              value: totals.protein,
              max: goals.proteinTarget,
              tone: "sage"
            }}
          />
          <StatCard
            label="Carboidratos"
            value={`${formatNumberBR(totals.carbohydrates)} g`}
            helper={`Meta: ${formatNumberBR(goals.carbohydrateTarget)} g`}
            icon={Wheat}
            progress={{
              value: totals.carbohydrates,
              max: goals.carbohydrateTarget,
              tone: "mauve"
            }}
          />
          <StatCard
            label="Água"
            value="0 ml"
            helper={`Meta futura: ${formatNumberBR(goals.waterTarget, 0)} ml`}
            icon={Droplets}
            progress={{ value: 0, max: goals.waterTarget, tone: "neutral" }}
          />
        </div>
        <Card>
          <h2 className="text-lg font-semibold text-ink">Macronutrientes do dia</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <MacroIndicator
              label="Proteínas"
              value={totals.protein}
              target={goals.proteinTarget}
              unit="g"
              icon={Apple}
              tone="sage"
            />
            <MacroIndicator
              label="Carboidratos"
              value={totals.carbohydrates}
              target={goals.carbohydrateTarget}
              unit="g"
              icon={Wheat}
              tone="mauve"
            />
            <MacroIndicator
              label="Gorduras"
              value={totals.fat}
              target={goals.fatTarget}
              unit="g"
              icon={Flame}
              tone="rose"
            />
          </div>
        </Card>
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">Refeições registradas</h2>
            <Link className="text-sm font-semibold text-rosepetal-500 hover:text-ink" href="/historico">
              Ver histórico
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} showActions={false} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
