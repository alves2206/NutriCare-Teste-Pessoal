import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";
import { isAdminEmail } from "@/lib/supabase/env";

export async function getAdminUser() {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/dashboard");
  }

  return user;
}
