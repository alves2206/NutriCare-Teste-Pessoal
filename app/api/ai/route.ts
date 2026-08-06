import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { createMealInterpreter } from "@/lib/ai/meal-interpreter";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Faça login para usar a interpretação com IA." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as { input?: string } | null;
  const input = body?.input?.trim();

  if (!input) {
    return NextResponse.json(
      { message: "Descreva a refeição para interpretar." },
      { status: 400 }
    );
  }

  try {
    const interpreter = createMealInterpreter();
    const draft = await interpreter.interpret(input);

    return NextResponse.json({
      draft,
      message:
        "Interpretação concluída. Revise os alimentos antes de salvar; nutrientes continuam sendo calculados pelo sistema."
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível interpretar a refeição agora."
      },
      { status: 501 }
    );
  }
}
