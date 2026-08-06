import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import { APP_NAME } from "@/lib/constants/app";

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-white bg-white/86 p-6 shadow-soft backdrop-blur sm:p-8">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-ink" href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar ao início
        </Link>
        <div className="mx-auto grid size-14 place-items-center rounded-3xl bg-rosepetal-100 text-rosepetal-500">
          <Leaf size={28} aria-hidden="true" />
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-3xl font-bold text-ink">Entrar na área do cliente</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Use seu e-mail autorizado para acessar plano, treinos e área administrativa quando aplicável.
          </p>
        </div>
        <div className="mt-7">
          <LoginForm />
        </div>
        <div className="mt-6 space-y-3 text-center text-xs leading-5 text-stone-500">
          <p>Sem cadastro público. O acesso é liberado pelo acompanhamento.</p>
          <Link className="font-semibold text-rosepetal-500 hover:text-ink" href="/avaliacao">
            Ainda não fiz minha avaliação
          </Link>
        </div>
        <p className="sr-only">{APP_NAME}</p>
      </section>
    </main>
  );
}
