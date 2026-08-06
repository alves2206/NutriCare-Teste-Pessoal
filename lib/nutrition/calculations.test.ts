import { describe, expect, it } from "vitest";
import { calculateConsumedNutrients, roundNutritionValue } from "./calculations";
import type { Food } from "@/types/nutrition";

const food: Food = {
  id: "arroz",
  name: "Arroz branco cozido",
  category: "Cereais e grãos",
  referenceAmount: 100,
  referenceUnit: "gramas",
  calories: 128,
  protein: 2.5,
  carbohydrates: 28,
  fat: 0.2,
  fiber: 1.6,
  sodium: 1
};

describe("calculateConsumedNutrients", () => {
  it("calcula a quantidade igual à referência", () => {
    expect(calculateConsumedNutrients(food, 100)).toMatchObject({
      calories: 128,
      protein: 2.5,
      carbohydrates: 28,
      fat: 0.2
    });
  });

  it("calcula quantidade menor que a referência", () => {
    expect(calculateConsumedNutrients(food, 50).calories).toBe(64);
  });

  it("calcula quantidade maior que a referência", () => {
    expect(calculateConsumedNutrients(food, 150).calories).toBe(192);
  });

  it("calcula valores decimais com arredondamento", () => {
    expect(calculateConsumedNutrients(food, 33.33).calories).toBe(42.66);
  });

  it("retorna zero quando a quantidade é zero", () => {
    expect(calculateConsumedNutrients(food, 0).protein).toBe(0);
  });

  it("não permite divisão por zero", () => {
    expect(() =>
      calculateConsumedNutrients({ ...food, referenceAmount: 0 }, 10)
    ).toThrow("referência");
  });
});

describe("roundNutritionValue", () => {
  it("usa no máximo duas casas decimais", () => {
    expect(roundNutritionValue(1.235)).toBe(1.24);
  });
});
