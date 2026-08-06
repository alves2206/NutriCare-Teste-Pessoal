import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { getSupabaseEnv, isAllowedEmail } from "./env";

type CookieToSet = {
  name: string;
  value: string;
  options?: Partial<ResponseCookie>;
};

const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/plano",
  "/treinos",
  "/admin",
  "/refeicoes",
  "/alimentos",
  "/historico",
  "/evolucao",
  "/configuracoes"
];

export async function updateSession(request: NextRequest) {
  const { url, key, isConfigured } = getSupabaseEnv();
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isConfigured || !url || !key) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAllowedUser = Boolean(user) && isAllowedEmail(user?.email);

  if (request.nextUrl.pathname === "/login" && isAllowedUser) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  if (isProtectedRoute && !isAllowedUser) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
