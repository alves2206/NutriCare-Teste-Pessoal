import { redirect } from "next/navigation";
import { getSupabaseEnv, isAllowedEmail } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  if (!isAllowedEmail(user.email)) {
    await supabase.auth.signOut();
    return null;
  }

  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
