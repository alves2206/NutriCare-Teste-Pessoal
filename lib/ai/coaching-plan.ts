import { z } from "zod";
import { getGeminiConfig, parseJsonObject } from "@/lib/ai/gemini";
import type { ClientProfile } from "@/lib/repositories/client-profiles";
import type { CoachingMeal, WorkoutDay } from "@/lib/repositories/coaching-plans";

const exerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.string().min(1),
  reps: z.string().min(1),
  rest: z.string().min(1),
  notes: z.string().default("")
});

const workoutSchema = z.object({
  day: z.string().min(1),
  focus: z.string().min(1),
  exercises: z.array(exerciseSchema).min(1)
});

const mealSchema = z.object({
  mealType: z.string().min(1),
  time: z.string().default(""),
  title: z.string().min(1),
  items: z.array(z.string()).min(1),
  notes: z.string().default(""),
  calories: z.number().optional(),
  protein: z.number().optional()
});

const coachingPlanSchema = z.object({
  title: z.string().min(1),
  nutritionSummary: z.string().min(1),
  workoutSummary: z.string().min(1),
  meals: z.array(mealSchema).min(3),
  workouts: z.array(workoutSchema).min(1),
  notes: z.string().default("")
});

export type CoachingPlanDraft = {
  title: string;
  nutritionSummary: string;
  workoutSummary: string;
  meals: CoachingMeal[];
  workouts: WorkoutDay[];
  notes: string;
  source: "gemini" | "local";
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function splitList(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function chooseLikes(profile: ClientProfile) {
  const likes = splitList(profile.foodLikes);

  return likes.length > 0
    ? likes
    : ["ovos", "frango", "arroz", "feijao", "banana", "aveia", "iogurte"];
}

function calorieHint(profile: ClientProfile) {
  if (!profile.currentWeightKg || !profile.heightCm) {
    return "Ajustar calorias apos avaliacao da nutricionista.";
  }

  const base = Math.round(profile.currentWeightKg * 30);

  if (profile.objective.toLowerCase().includes("emag")) {
    return `Comecar em torno de ${Math.max(base - 350, 1300)} kcal e ajustar pela evolucao.`;
  }

  if (profile.objective.toLowerCase().includes("massa") || profile.objective.toLowerCase().includes("ganho")) {
    return `Comecar em torno de ${base + 250} kcal e ajustar pela resposta do treino.`;
  }

  return `Comecar em torno de ${base} kcal e ajustar por saciedade e progresso.`;
}

function buildLocalDraft(profile: ClientProfile): CoachingPlanDraft {
  const likes = chooseLikes(profile);
  const mealsPerDay = Math.min(Math.max(profile.mealsPerDay || 5, 3), 6);
  const baseMeals: CoachingMeal[] = [
    {
      mealType: "Cafe da manha",
      time: "07:00",
      title: "Cafe da manha base",
      items: [`Fonte proteica: ${likes[0]}`, `Carboidrato/fibra: ${likes[5] ?? "aveia"}`, "Fruta da preferencia"],
      notes: "Priorizar saciedade e rotina facil de repetir.",
      calories: 350,
      protein: 25
    },
    {
      mealType: "Lanche da manha",
      time: "10:00",
      title: "Lanche pratico",
      items: [`Opcao principal: ${likes[4] ?? "banana"}`, "Iogurte, queijo magro ou whey conforme aceitacao"],
      notes: "Usar quando houver fome ou intervalo longo ate o almoco.",
      calories: 220,
      protein: 18
    },
    {
      mealType: "Almoco",
      time: "12:30",
      title: "Prato principal",
      items: [`Proteina: ${likes[1] ?? "frango"}`, `Carboidrato: ${likes[2] ?? "arroz"}`, `Complemento: ${likes[3] ?? "feijao"}`, "Legumes e salada"],
      notes: "Ajustar porcoes conforme objetivo, treino e fome.",
      calories: 550,
      protein: 38
    },
    {
      mealType: "Lanche da tarde",
      time: "16:00",
      title: "Pre ou pos-treino simples",
      items: ["Carboidrato de facil digestao", "Fonte proteica leve", "Agua"],
      notes: "Escolher como pre ou pos-treino conforme horario informado.",
      calories: 280,
      protein: 24
    },
    {
      mealType: "Jantar",
      time: "20:00",
      title: "Jantar equilibrado",
      items: ["Proteina magra", "Vegetais", "Carboidrato ajustado ao treino do dia"],
      notes: "Manter refeicao consistente, sem travar ajustes clinicos futuros.",
      calories: 480,
      protein: 35
    },
    {
      mealType: "Ceia",
      time: "22:00",
      title: "Ceia opcional",
      items: ["Opcao proteica leve", "Cha ou agua"],
      notes: "Usar apenas se fizer sentido para fome, rotina e meta.",
      calories: 180,
      protein: 18
    }
  ];

  const trainingDays = Math.min(Math.max(profile.trainingDaysPerWeek || 3, 2), 6);
  const workouts: WorkoutDay[] = Array.from({ length: trainingDays }).map((_, index) => {
    const day = `Dia ${index + 1}`;
    const focus = index % 3 === 0 ? "Inferiores" : index % 3 === 1 ? "Superiores" : "Condicionamento";

    return {
      day,
      focus,
      exercises:
        focus === "Inferiores"
          ? [
              { name: "Agachamento ou leg press", sets: "3", reps: "8-12", rest: "60-90s", notes: "Carga moderada e tecnica limpa." },
              { name: "Cadeira flexora", sets: "3", reps: "10-12", rest: "60s", notes: "Controlar a fase de volta." },
              { name: "Panturrilha", sets: "3", reps: "12-15", rest: "45s", notes: "Amplitude completa." }
            ]
          : focus === "Superiores"
            ? [
                { name: "Puxada ou remada", sets: "3", reps: "8-12", rest: "60-90s", notes: "Escapulas estaveis." },
                { name: "Supino ou flexao", sets: "3", reps: "8-12", rest: "60-90s", notes: "Adaptar ao local de treino." },
                { name: "Desenvolvimento de ombros", sets: "3", reps: "10-12", rest: "60s", notes: "Sem desconforto articular." }
              ]
            : [
                { name: "Caminhada inclinada ou bike", sets: "1", reps: "20-30 min", rest: "livre", notes: "Intensidade conversavel." },
                { name: "Prancha", sets: "3", reps: "30-45s", rest: "45s", notes: "Manter quadril alinhado." },
                { name: "Mobilidade geral", sets: "1", reps: "8-10 min", rest: "livre", notes: "Foco nas limitacoes relatadas." }
              ]
    };
  });

  return {
    title: `Rascunho inicial - ${profile.fullName}`,
    nutritionSummary: `${calorieHint(profile)} Priorizar alimentos aceitos pela pessoa e evitar: ${profile.foodDislikes || "itens recusados no acompanhamento"}.`,
    workoutSummary: `Treino inicial para ${profile.trainingGoal || profile.objective}, considerando nivel ${profile.trainingExperience || "nao informado"} e local ${profile.trainingLocation || "a definir"}.`,
    meals: baseMeals.slice(0, mealsPerDay),
    workouts,
    notes:
      "Rascunho automatico para revisao profissional. Conferir restricoes, exames, historico clinico, tecnica dos exercicios e preferencias antes de publicar.",
    source: "local"
  };
}

function buildPrompt(profile: ClientProfile) {
  return `
Voce ajuda uma nutricionista esportiva e personal a criar um rascunho inicial de acompanhamento.

Regras:
- Retorne somente JSON valido, sem markdown.
- Nao use linguagem de diagnostico medico.
- O plano sera revisado por uma profissional antes de ser publicado.
- Respeite restricoes e alimentos recusados.
- Priorize alimentos que a pessoa informou gostar.
- Monte refeicoes padrao, nao um cardapio clinico definitivo.
- Monte treinos simples e ajustaveis ao local informado.

Formato exato:
{
  "title": "Rascunho inicial - Nome",
  "nutritionSummary": "Resumo nutricional",
  "workoutSummary": "Resumo dos treinos",
  "meals": [
    {
      "mealType": "Cafe da manha",
      "time": "07:00",
      "title": "Titulo",
      "items": ["item 1", "item 2"],
      "notes": "observacao",
      "calories": 350,
      "protein": 25
    }
  ],
  "workouts": [
    {
      "day": "Dia 1",
      "focus": "Inferiores",
      "exercises": [
        { "name": "Agachamento", "sets": "3", "reps": "8-12", "rest": "60-90s", "notes": "observacao" }
      ]
    }
  ],
  "notes": "observacoes para a profissional"
}

Perfil:
${JSON.stringify(profile, null, 2)}
`;
}

export async function generateCoachingPlanDraft(profile: ClientProfile): Promise<CoachingPlanDraft> {
  const { apiKey, model, isConfigured } = getGeminiConfig();

  if (!isConfigured || !apiKey) {
    return buildLocalDraft(profile);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(profile) }] }],
        generationConfig: {
          temperature: 0.25,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    return buildLocalDraft(profile);
  }

  const data = (await response.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return buildLocalDraft(profile);
  }

  const parsed = coachingPlanSchema.safeParse(parseJsonObject(text));

  if (!parsed.success) {
    return buildLocalDraft(profile);
  }

  return {
    ...parsed.data,
    source: "gemini"
  };
}
