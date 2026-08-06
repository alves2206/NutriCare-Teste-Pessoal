import { Leaf } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import { APP_NAME } from "@/lib/constants/app";

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-white bg-white/86 p-6 shadow-soft backdrop-blur sm:p-8">
        <div className="mx-auto grid size-14 place-items-center rounded-3xl bg-rosepetal-100 text-rosepetal-500">
          <Leaf size={28} aria-hidden="true" />
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-3xl font-bold text-ink">{APP_NAME}</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Acesso privado ao seu acompanhamento nutricional pessoal.
          </p>
        </div>
        <div className="mt-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs leading-5 text-stone-500">
          Sem cadastro público. O acesso será limitado ao e-mail autorizado.
        </p>
      </section>
    </main>
  );
}
