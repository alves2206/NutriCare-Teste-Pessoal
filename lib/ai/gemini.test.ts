import { describe, expect, it } from "vitest";
import { normalizeParsedMealDraft, parseJsonObject } from "./gemini";

describe("parseJsonObject", () => {
  it("extrai JSON puro", () => {
    expect(parseJsonObject('{"mealType":"Almoço","items":[]}')).toEqual({
      mealType: "Almoço",
      items: []
    });
  });

  it("extrai JSON em bloco markdown", () => {
    expect(
      parseJsonObject('```json\n{"mealType":"Jantar","items":[]}\n```')
    ).toEqual({
      mealType: "Jantar",
      items: []
    });
  });
});

describe("normalizeParsedMealDraft", () => {
  it("valida e normaliza um rascunho de refeição", () => {
    expect(
      normalizeParsedMealDraft({
        mealType: "Almoço",
        items: [{ foodName: " arroz ", quantity: "120", unit: "gramas" }]
      })
    ).toEqual({
      mealType: "Almoço",
      items: [{ foodName: "arroz", quantity: 120, unit: "gramas" }]
    });
  });

  it("rejeita unidade fora da lista permitida", () => {
    expect(() =>
      normalizeParsedMealDraft({
        mealType: "Almoço",
        items: [{ foodName: "arroz", quantity: 120, unit: "punhado" }]
      })
    ).toThrow();
  });
});
