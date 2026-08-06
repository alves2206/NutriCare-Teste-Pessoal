import { calculateConsumedNutrients } from "@/lib/nutrition/calculations";
import type { Food, Meal, ProfileGoals, WeightEntry } from "@/types/nutrition";

export const demoGoals: ProfileGoals = {
  calorieTarget: 1850,
  proteinTarget: 115,
  carbohydrateTarget: 210,
  fatTarget: 62,
  fiberTarget: 28,
  waterTarget: 2200
};

export const demoFoods: Food[] = [
  {
    id: "arroz-branco-cozido",
    name: "Arroz branco cozido",
    category: "Cereais e grãos",
    referenceAmount: 100,
    referenceUnit: "gramas",
    calories: 128,
    protein: 2.5,
    carbohydrates: 28,
    fat: 0.2,
    fiber: 1.6,
    sodium: 1,
    notes: "Dado demonstrativo. Revise antes do uso real."
  },
  {
    id: "feijao-carioca-cozido",
    name: "Feijão carioca cozido",
    category: "Cereais e grãos",
    referenceAmount: 100,
    referenceUnit: "gramas",
    calories: 76,
    protein: 4.8,
    carbohydrates: 13.6,
    fat: 0.5,
    fiber: 8.5,
    sodium: 2
  },
  {
    id: "peito-frango-grelhado",
    name: "Peito de frango grelhado",
    category: "Carnes",
    referenceAmount: 100,
    referenceUnit: "gramas",
    calories: 165,
    protein: 31,
    carbohydrates: 0,
    fat: 3.6,
    fiber: 0,
    sodium: 74
  },
  {
    id: "ovo-cozido",
    name: "Ovo cozido",
    category: "Ovos",
    referenceAmount: 1,
    referenceUnit: "unidade",
    calories: 78,
    protein: 6.3,
    carbohydrates: 0.6,
    fat: 5.3,
    fiber: 0,
    sodium: 62
  },
  {
    id: "banana",
    name: "Banana",
    category: "Frutas",
    referenceAmount: 1,
    referenceUnit: "unidade",
    calories: 89,
    protein: 1.1,
    carbohydrates: 22.8,
    fat: 0.3,
    fiber: 2.6,
    sodium: 1
  },
  {
    id: "leite",
    name: "Leite",
    category: "Laticínios",
    referenceAmount: 200,
    referenceUnit: "mililitros",
    calories: 122,
    protein: 6.4,
    carbohydrates: 9.6,
    fat: 6.6,
    fiber: 0,
    sodium: 88
  },
  {
    id: "aveia",
    name: "Aveia",
    category: "Cereais e grãos",
    referenceAmount: 30,
    referenceUnit: "gramas",
    calories: 117,
    protein: 4.1,
    carbohydrates: 19.9,
    fat: 2.1,
    fiber: 3.2,
    sodium: 1
  },
  {
    id: "pao-frances",
    name: "Pão francês",
    category: "Lanches",
    referenceAmount: 1,
    referenceUnit: "unidade",
    calories: 135,
    protein: 4.4,
    carbohydrates: 28,
    fat: 1.4,
    fiber: 1.2,
    sodium: 320
  },
  {
    id: "queijo",
    name: "Queijo",
    category: "Laticínios",
    referenceAmount: 30,
    referenceUnit: "gramas",
    calories: 105,
    protein: 7.5,
    carbohydrates: 0.6,
    fat: 8.1,
    fiber: 0,
    sodium: 190
  },
  {
    id: "cafe-sem-acucar",
    name: "Café sem açúcar",
    category: "Bebidas",
    referenceAmount: 100,
    referenceUnit: "mililitros",
    calories: 2,
    protein: 0.1,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sodium: 1
  }
];

const byId = (id: string) => {
  const food = demoFoods.find((item) => item.id === id);

  if (!food) {
    throw new Error(`Alimento demonstrativo não encontrado: ${id}`);
  }

  return food;
};

export const demoMeals: Meal[] = [
  {
    id: "cafe-hoje",
    date: "2026-08-04",
    time: "08:10",
    type: "Café da manhã",
    notes: "Dia de teste com dados demonstrativos.",
    items: [
      {
        id: "cafe-item-1",
        food: byId("pao-frances"),
        consumedAmount: 1,
        consumedUnit: "unidade",
        calculated: calculateConsumedNutrients(byId("pao-frances"), 1)
      },
      {
        id: "cafe-item-2",
        food: byId("queijo"),
        consumedAmount: 30,
        consumedUnit: "gramas",
        calculated: calculateConsumedNutrients(byId("queijo"), 30)
      },
      {
        id: "cafe-item-3",
        food: byId("cafe-sem-acucar"),
        consumedAmount: 150,
        consumedUnit: "mililitros",
        calculated: calculateConsumedNutrients(byId("cafe-sem-acucar"), 150)
      }
    ]
  },
  {
    id: "almoco-hoje",
    date: "2026-08-04",
    time: "12:45",
    type: "Almoço",
    items: [
      {
        id: "almoco-item-1",
        food: byId("arroz-branco-cozido"),
        consumedAmount: 120,
        consumedUnit: "gramas",
        calculated: calculateConsumedNutrients(byId("arroz-branco-cozido"), 120)
      },
      {
        id: "almoco-item-2",
        food: byId("feijao-carioca-cozido"),
        consumedAmount: 100,
        consumedUnit: "gramas",
        calculated: calculateConsumedNutrients(byId("feijao-carioca-cozido"), 100)
      },
      {
        id: "almoco-item-3",
        food: byId("peito-frango-grelhado"),
        consumedAmount: 140,
        consumedUnit: "gramas",
        calculated: calculateConsumedNutrients(byId("peito-frango-grelhado"), 140)
      }
    ]
  }
];

export const demoWeightEntries: WeightEntry[] = [
  { id: "peso-1", date: "2026-07-01", weightKg: 68.4, notes: "Registro inicial" },
  { id: "peso-2", date: "2026-07-08", weightKg: 68.1 },
  { id: "peso-3", date: "2026-07-15", weightKg: 67.8 },
  { id: "peso-4", date: "2026-07-22", weightKg: 67.6 },
  { id: "peso-5", date: "2026-08-04", weightKg: 67.2, notes: "Dado demonstrativo" }
];
