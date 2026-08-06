"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Logo } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/80 bg-white/72 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <Logo />
      <nav className="mt-9 space-y-2" aria-label="Navegação principal">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition",
                isActive
                  ? "bg-ink text-white shadow-soft"
                  : "text-stone-600 hover:bg-rosepetal-50 hover:text-ink"
              )}
              href={item.href}
            >
              <Icon size={19} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-rosepetal-50 p-4 text-sm leading-6 text-stone-600">
        <p className="font-semibold text-ink">Acesso privado</p>
        <p className="mt-1">Uso pessoal, sem cadastro público ou área de pacientes.</p>
      </div>
      <SignOutButton />
    </aside>
  );
}
