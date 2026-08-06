import { Dumbbell, Flame, Utensils } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CoachingPlan } from "@/lib/repositories/coaching-plans";

type PlanViewerProps = {
  plan: CoachingPlan;
  mode: "nutrition" | "workouts" | "full";
};

export function PlanViewer({ plan, mode }: PlanViewerProps) {
  const showNutrition = mode === "nutrition" || mode === "full";
  const showWorkouts = mode === "workouts" || mode === "full";

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rosepetal-500">
              {plan.status === "published" ? "Plano publicado" : "Rascunho"}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink">{plan.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{plan.notes}</p>
          </div>
          <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-stone-700">
            Origem: {plan.source === "gemini" ? "Gemini" : "teste local"}
          </span>
        </div>
      </Card>

      {showNutrition ? (
        <section className="space-y-4">
          <Card>
            <div className="flex gap-3">
              <Flame className="mt-1 size-5 text-rosepetal-500" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-ink">Resumo alimentar</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{plan.nutritionSummary}</p>
              </div>
            </div>
          </Card>
          <div className="grid gap-4 lg:grid-cols-2">
            {plan.meals.map((meal, index) => (
              <Card key={`${meal.mealType}-${index}`}>
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
                    <Utensils size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{meal.mealType}</h3>
                      {meal.time ? <span className="text-xs font-semibold text-stone-500">{meal.time}</span> : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-stone-700">{meal.title}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                      {meal.items.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                    {meal.notes ? <p className="mt-3 text-sm leading-6 text-stone-500">{meal.notes}</p> : null}
                    {meal.calories || meal.protein ? (
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                        {meal.calories ? `${meal.calories} kcal` : ""}
                        {meal.calories && meal.protein ? " · " : ""}
                        {meal.protein ? `${meal.protein} g proteina` : ""}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {showWorkouts ? (
        <section className="space-y-4">
          <Card>
            <div className="flex gap-3">
              <Dumbbell className="mt-1 size-5 text-sage-500" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-ink">Resumo dos treinos</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{plan.workoutSummary}</p>
              </div>
            </div>
          </Card>
          <div className="grid gap-4 lg:grid-cols-2">
            {plan.workouts.map((workout, index) => (
              <Card key={`${workout.day}-${index}`}>
                <h3 className="text-lg font-semibold text-ink">{workout.day}</h3>
                <p className="mt-1 text-sm font-semibold text-rosepetal-500">{workout.focus}</p>
                <div className="mt-4 space-y-3">
                  {workout.exercises.map((exercise) => (
                    <div key={`${workout.day}-${exercise.name}`} className="rounded-2xl bg-white/72 p-3 ring-1 ring-rosepetal-100">
                      <p className="font-semibold text-ink">{exercise.name}</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {exercise.sets} series · {exercise.reps} reps · descanso {exercise.rest}
                      </p>
                      {exercise.notes ? <p className="mt-1 text-sm text-stone-500">{exercise.notes}</p> : null}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
