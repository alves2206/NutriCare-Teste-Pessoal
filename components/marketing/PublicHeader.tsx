import Link from "next/link";
import { Leaf } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-10 place-items-center rounded-2xl bg-rosepetal-100 text-rosepetal-500">
            <Leaf size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold leading-none text-ink">Iris Carvalho</span>
            <span className="mt-1 block text-xs font-medium text-stone-500">Autocuidado, nutrição e treino</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-stone-600" aria-label="Navegação pública">
          <Link className="hidden rounded-2xl px-3 py-2 hover:bg-rosepetal-50 hover:text-ink sm:inline-flex" href="/planos">
            Planos
          </Link>
          <Link className="rounded-2xl bg-ink px-4 py-2 text-white shadow-soft hover:bg-[#463841]" href="/avaliacao">
            Começar avaliação
          </Link>
        </nav>
      </div>
    </header>
  );
}
