"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: LoginFormData) {
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });

      if (error) {
        setMessage("Não foi possível entrar. Confira e-mail e senha.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setMessage(
        "O acesso privado está temporariamente indisponível. Tente novamente em alguns instantes."
      );
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="seuemail@exemplo.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Senha"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Sua senha"
        error={errors.password?.message}
        className="pr-12"
        rightSlot={
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl text-stone-500 hover:bg-rosepetal-50 hover:text-ink"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        }
        {...register("password")}
      />
      {message ? (
        <p className="rounded-2xl bg-sage-100 px-4 py-3 text-sm text-stone-700" role="status">
          {message}
        </p>
      ) : null}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        <LockKeyhole size={18} aria-hidden="true" />
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
