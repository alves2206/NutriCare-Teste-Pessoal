"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";

const mobileItems = navigationItems.slice(0, 5);

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-white/90 px-2 pt-2 shadow-soft backdrop-blur-xl lg:hidden"
      aria-label="Navegação principal"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[0.72rem] font-semibold transition",
                isActive ? "bg-rosepetal-100 text-ink" : "text-stone-500 hover:bg-rosepetal-50"
              )}
              href={item.href}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
