import { z } from "zod";
import { mealTypes, referenceUnits } from "@/lib/constants/app";
import type { MealInterpreter, ParsedMealDraft } from "./types";

const parsedMealItemSchema = z.object({
  foodName: z.string().min(1),
  quantity: z.coerce.number().min(0),
  unit: z.enum(referenceUnits)
});

const parsedMealDraftSchema = z.object({
  mealType: z.enum(mealTypes),
  items: z.array(parsedMealItemSchema).min(1)
});

const defaultModel = "gemini-2.5-flash-lite";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

export function getGeminiConfig() {
  return {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL ?? defaultModel,
    isConfigured: Boolean(process.env.GEMINI_API_KEY)
  };
}

export function parseJsonObject(text: string) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1] ?? trimmed;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace < 0 || lastBrace < firstBrace) {
    throw new Error("A IA não retornou um JSON válido.");
  }

  return JSON.parse(candidate.slice(firstBrace, lastBrace + 1)) as unknown;
}

export function normalizeParsedMealDraft(value: unknown): ParsedMealDraft {
  const parsed = parsedMealDraftSchema.parse(value);

  return {
    mealType: parsed.mealType,
    items: parsed.items.map((item) => ({
      foodName: item.foodName.trim(),
      quantity: Number(item.quantity),
      unit: item.unit
    }))
  };
}

function buildPrompt(input: string) {
  return `
Você interpreta refeições em português do Brasil para um app nutricional pessoal.

Regras obrigatórias:
- Retorne somente JSON válido, sem markdown.
- Não calcule calorias, proteínas, carboidratos, gorduras, fibras ou sódio.
- Não invente alimentos que não estejam no texto.
- Se o tipo de refeição não estiver claro, use "Outro".
- Use apenas uma destas unidades: ${referenceUnits.join(", ")}.
- Use apenas um destes tipos de refeição: ${mealTypes.join(", ")}.

Formato exato:
{
  "mealType": "Almoço",
  "items": [
    { "foodName": "arroz", "quantity": 120, "unit": "gramas" }
  ]
}

Texto da usuária:
${input}
`;
}

export function createGeminiMealInterpreter(): MealInterpreter {
  return {
    async interpret(input) {
      const { apiKey, model } = getGeminiConfig();

      if (!apiKey) {
        throw new Error("Configure GEMINI_API_KEY para ativar a interpretação com IA.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: buildPrompt(input) }]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível consultar o Gemini agora.");
      }

      const data = (await response.json()) as GeminiResponse;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("O Gemini não retornou uma interpretação.");
      }

      return normalizeParsedMealDraft(parseJsonObject(text));
    }
  };
}
