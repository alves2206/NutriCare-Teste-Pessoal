import { Search } from "lucide-react";
import { foodCategories } from "@/lib/constants/app";

export function FoodSearchBar() {
  return (
    <div className="grid gap-3 rounded-2xl bg-white/72 p-3 ring-1 ring-white sm:grid-cols-[1fr_220px]">
      <label className="relative block">
        <span className="sr-only">Buscar alimento</span>
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" aria-hidden="true" />
        <input
          className="min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white py-2 pl-12 pr-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
          placeholder="Buscar por nome"
        />
      </label>
      <label>
        <span className="sr-only">Filtrar por categoria</span>
        <select className="min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 text-stone-700 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100">
          <option>Todas as categorias</option>
          {foodCategories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
