import type { ReactNode } from "react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="page-shell">
      <Sidebar />
      <main className="min-h-svh px-4 py-5 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <p className="text-lg font-bold text-ink">NutriCare</p>
            <Link
              href="/configuracoes"
              className="grid size-11 place-items-center rounded-2xl bg-white text-ink shadow-soft"
              aria-label="Abrir configurações"
            >
              <Settings size={20} aria-hidden="true" />
            </Link>
          </div>
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
