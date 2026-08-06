"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // Local preview without Supabase credentials.
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      className="mt-4 flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-stone-600 hover:bg-white"
      type="button"
      onClick={handleSignOut}
    >
      <LogOut size={18} aria-hidden="true" />
      Sair
    </button>
  );
}
