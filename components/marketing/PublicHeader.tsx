import Link from "next/link";
import { Leaf, LogIn } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
            <Leaf size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-none text-ink">Iris Carvalho</span>
            <span className="mt-1 hidden text-xs font-medium text-stone-500 sm:block">
              Autocuidado, nutrição e treino
            </span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-2 text-sm font-semibold text-stone-600" aria-label="Navegação pública">
          <Link className="hidden rounded-2xl px-3 py-2 hover:bg-rosepetal-50 hover:text-ink sm:inline-flex" href="/planos">
            Planos
          </Link>
          <Link className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-ink ring-1 ring-rosepetal-200 hover:bg-rosepetal-50" href="/login">
            <LogIn size={16} aria-hidden="true" />
            Entrar
          </Link>
          <Link className="hidden rounded-2xl bg-ink px-4 py-2 text-white shadow-soft hover:bg-[#463841] sm:inline-flex" href="/avaliacao">
            Começar avaliação
          </Link>
        </nav>
      </div>
    </header>
  );
}
