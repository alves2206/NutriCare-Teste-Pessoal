"use client";

import { useState, useTransition } from "react";
import type { InputHTMLAttributes } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { ThemeSelect } from "@/components/theme/ThemeSelect";
import { saveProfileAction } from "@/app/configuracoes/actions";
import type { Profile } from "@/lib/repositories/profiles";

type ProfileSettingsFormProps = {
  profile: Profile;
  persistenceEnabled: boolean;
};

export function ProfileSettingsForm({ profile, persistenceEnabled }: ProfileSettingsFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const result = await saveProfileAction(formData);

      if (!result.ok) {
        setMessage(result.message);
        return;
      }

      setToast(result.message);
      window.setTimeout(() => setToast(null), 3000);
    });
  }

  return (
    <>
      {!persistenceEnabled ? (
        <p className="mb-5 rounded-2xl bg-mauve-50 px-4 py-3 text-sm leading-6 text-stone-700">
          Você está vendo configurações demonstrativas. Configure o Supabase para salvar alterações.
        </p>
      ) : null}
      <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <TextInput label="Nome" name="name" defaultValue={profile.name} />
        <TextInput label="E-mail" type="email" value={profile.email} readOnly />
        <TextInput label="Data de nascimento" name="birthDate" type="date" defaultValue={profile.birthDate} />
        <TextInput label="Altura" name="heightCm" defaultValue={String(profile.heightCm)} suffix="cm" />
        <label className="text-sm font-medium text-ink">
          Sexo biológico
          <select
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            name="biologicalSex"
            defaultValue={profile.biologicalSex}
          >
            <option>Prefiro não informar</option>
            <option>Feminino</option>
            <option>Masculino</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Objetivo
          <select
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            name="goal"
            defaultValue={profile.goal}
          >
            <option>Manutenção</option>
            <option>Redução de peso</option>
            <option>Ganho de peso</option>
            <option>Acompanhamento nutricional</option>
            <option>Outro</option>
          </select>
        </label>
        <TextInput label="Meta diária de calorias" name="calorieTarget" defaultValue={String(profile.calorieTarget)} suffix="kcal" />
        <TextInput label="Meta diária de proteínas" name="proteinTarget" defaultValue={String(profile.proteinTarget)} suffix="g" />
        <TextInput label="Meta diária de carboidratos" name="carbohydrateTarget" defaultValue={String(profile.carbohydrateTarget)} suffix="g" />
        <TextInput label="Meta diária de gorduras" name="fatTarget" defaultValue={String(profile.fatTarget)} suffix="g" />
        <TextInput label="Meta diária de fibras" name="fiberTarget" defaultValue={String(profile.fiberTarget)} suffix="g" />
        <TextInput label="Meta diária de água" name="waterTarget" defaultValue={String(profile.waterTarget)} suffix="ml" />
        <label className="text-sm font-medium text-ink">
          Unidade de peso
          <select
            className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
            name="weightUnit"
            defaultValue={profile.weightUnit}
          >
            <option value="kg">Quilogramas</option>
          </select>
        </label>
        <ThemeSelect defaultValue={profile.theme} />
        {message ? (
          <p className="rounded-2xl bg-rosepetal-50 px-4 py-3 text-sm text-rosepetal-500 md:col-span-2">
            {message}
          </p>
        ) : null}
        <div className="md:col-span-2">
          <Button type="submit" disabled={isPending || !persistenceEnabled}>
            <Save size={18} aria-hidden="true" />
            {isPending ? "Salvando..." : "Salvar configurações"}
          </Button>
        </div>
      </form>
      {toast ? <Toast message={toast} /> : null}
    </>
  );
}

function TextInput({
  label,
  suffix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; suffix?: string }) {
  return (
    <label className="text-sm font-medium text-ink">
      {label}
      <span className="relative mt-2 block">
        <input
          className={`min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100 disabled:bg-stone-50 ${suffix ? "pr-14" : ""}`}
          {...props}
        />
        {suffix ? (
          <span className="absolute inset-y-0 right-4 flex items-center text-sm text-stone-500">
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}
