import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv, isAllowedEmail } from "@/lib/supabase/env";
import { loginSchema } from "@/lib/validations/auth";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2];
};

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Informe um e-mail e uma senha válidos." },
      { status: 400 }
    );
  }

  const { url, key, isConfigured } = getSupabaseEnv();

  if (!isConfigured || !url || !key) {
    return NextResponse.json(
      { message: "O acesso está temporariamente indisponível." },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return NextResponse.json(
      { message: "Não foi possível entrar. Confira e-mail e senha." },
      { status: 401 }
    );
  }

  if (!isAllowedEmail(data.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { message: "Este e-mail ainda não está liberado para o acompanhamento." },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
