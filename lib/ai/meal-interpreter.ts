import type { MealInterpreter } from "./types";
import { createGeminiMealInterpreter, getGeminiConfig } from "./gemini";

export function createUnavailableMealInterpreter(): MealInterpreter {
  return {
    async interpret() {
      throw new Error(
        "A interpretação de refeições com IA ainda não está disponível."
      );
    }
  };
}

export function createMealInterpreter(): MealInterpreter {
  const { isConfigured } = getGeminiConfig();

  if (isConfigured) {
    return createGeminiMealInterpreter();
  }

  return createUnavailableMealInterpreter();
}
