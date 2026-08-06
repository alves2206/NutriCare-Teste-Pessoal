"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Save } from "lucide-react";
import { saveOnboardingAction } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/Button";
import { intakeFoodOptions, intakeRestrictionOptions } from "@/lib/constants/marketing";
import type { ClientProfile } from "@/lib/repositories/client-profiles";

type OnboardingFormProps = {
  profile: ClientProfile | null;
};

export function OnboardingForm({ profile }: OnboardingFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const result = await saveOnboardingAction(formData);
      setMessage(result.message);

      if (result.ok) {
        router.push("/plano");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-ink">Dados principais</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextInput label="Nome completo" name="fullName" defaultValue={profile?.fullName} required />
          <TextInput label="Data de nascimento" name="birthDate" type="date" defaultValue={profile?.birthDate} />
          <TextInput label="Altura" name="heightCm" type="number" suffix="cm" defaultValue={profile?.heightCm || ""} />
          <TextInput label="Peso atual" name="currentWeightKg" type="number" step="0.1" suffix="kg" defaultValue={profile?.currentWeightKg || ""} />
          <TextInput label="Peso/meta desejada" name="targetWeightKg" type="number" step="0.1" suffix="kg" defaultValue={profile?.targetWeightKg || ""} />
          <SelectInput label="Sexo biologico" name="biologicalSex" defaultValue={profile?.biologicalSex}>
            <option value="">Prefiro nao informar</option>
            <option>Feminino</option>
            <option>Masculino</option>
          </SelectInput>
          <SelectInput label="Objetivo principal" name="objective" defaultValue={profile?.objective ?? "Reducao de peso"}>
            <option>Reducao de peso</option>
            <option>Ganho de massa</option>
            <option>Definicao corporal</option>
            <option>Manutencao</option>
            <option>Saude e rotina</option>
          </SelectInput>
          <SelectInput label="Nivel de atividade" name="activityLevel" defaultValue={profile?.activityLevel ?? "Moderado"}>
            <option>Baixo</option>
            <option>Moderado</option>
            <option>Alto</option>
            <option>Atleta/recreativo intenso</option>
          </SelectInput>
          <SelectInput label="Refeicoes por dia" name="mealsPerDay" defaultValue={String(profile?.mealsPerDay ?? 5)}>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </SelectInput>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Rotina e preferencias alimentares</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextArea label="Como e sua rotina de horarios?" name="routine" defaultValue={profile?.routine} />
          <ChoiceGroup
            label="Alimentos que gosta"
            name="foodLikes"
            options={intakeFoodOptions}
            savedValue={profile?.foodLikes}
            otherName="foodLikesOther"
            otherLabel="Outros alimentos ou observacoes"
          />
          <ChoiceGroup
            label="Alimentos que nao gosta"
            name="foodDislikes"
            options={intakeFoodOptions.filter((item) => item !== "Todos")}
            savedValue={profile?.foodDislikes}
            otherName="foodDislikesOther"
            otherLabel="Outros alimentos recusados"
          />
          <ChoiceGroup
            label="Restricoes, alergias ou observacoes de saude"
            name="restrictions"
            options={intakeRestrictionOptions}
            savedValue={profile?.restrictions}
            otherName="restrictionsOther"
            otherLabel="Outra restricao ou detalhe importante"
          />
          <TextArea label="Historico, exames ou observacoes importantes" name="healthNotes" defaultValue={profile?.healthNotes} className="md:col-span-2" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Treino</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <SelectInput label="Objetivo no treino" name="trainingGoal" defaultValue={profile?.trainingGoal ?? "Hipertrofia"}>
            <option>Hipertrofia</option>
            <option>Emagrecimento</option>
            <option>Condicionamento</option>
            <option>Forca</option>
            <option>Saude e mobilidade</option>
          </SelectInput>
          <SelectInput label="Experiencia" name="trainingExperience" defaultValue={profile?.trainingExperience ?? "Iniciante"}>
            <option>Iniciante</option>
            <option>Intermediario</option>
            <option>Avancado</option>
          </SelectInput>
          <SelectInput label="Local do treino" name="trainingLocation" defaultValue={profile?.trainingLocation ?? "Academia"}>
            <option>Academia</option>
            <option>Casa</option>
            <option>Ambos</option>
          </SelectInput>
          <SelectInput label="Dias por semana" name="trainingDaysPerWeek" defaultValue={String(profile?.trainingDaysPerWeek || 3)}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </SelectInput>
          <TextArea label="Equipamentos disponiveis e limitacoes" name="availableEquipment" defaultValue={profile?.availableEquipment} className="md:col-span-2" />
        </div>
      </section>

      {message ? (
        <p className="rounded-2xl bg-sage-100 px-4 py-3 text-sm text-stone-700" role="status">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        <Save size={18} aria-hidden="true" />
        {isPending ? "Enviando..." : "Enviar perfil"}
      </Button>
    </form>
  );
}

function fieldClass(extra?: string) {
  return `min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 text-ink outline-none transition placeholder:text-stone-400 focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100 ${extra ?? ""}`;
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
        <input className={fieldClass(suffix ? "pr-14" : "")} {...props} />
        {suffix ? <span className="absolute inset-y-0 right-4 flex items-center text-sm text-stone-500">{suffix}</span> : null}
      </span>
    </label>
  );
}

function SelectInput({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="text-sm font-medium text-ink">
      {label}
      <select className={fieldClass("mt-2")} {...props}>
        {children}
      </select>
    </label>
  );
}

function parseSavedOptions(savedValue: string | undefined, options: string[]) {
  const values =
    savedValue
      ?.split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean) ?? [];
  const selected = new Set(values.filter((item) => options.includes(item)));
  const other = values.filter((item) => !options.includes(item)).join(", ");

  return { selected, other };
}

function ChoiceGroup({
  label,
  name,
  options,
  savedValue,
  otherName,
  otherLabel
}: {
  label: string;
  name: string;
  options: string[];
  savedValue?: string;
  otherName: string;
  otherLabel: string;
}) {
  const { selected, other } = parseSavedOptions(savedValue, options);

  return (
    <fieldset className="rounded-2xl border border-rosepetal-100 bg-white/70 p-4">
      <legend className="px-1 text-sm font-semibold text-ink">{label}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={`${name}-${option}`}
            className="flex min-h-10 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-medium text-stone-700 ring-1 ring-rosepetal-100"
          >
            <input
              className="size-4 accent-rosepetal-500"
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.has(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <label className="mt-4 block text-sm font-medium text-ink">
        {otherLabel}
        <textarea
          className="mt-2 min-h-20 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-stone-400 focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
          name={otherName}
          defaultValue={other}
          placeholder="Escreva aqui se nao estiver na lista."
        />
      </label>
    </fieldset>
  );
}

function TextArea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={`text-sm font-medium text-ink ${className ?? ""}`}>
      {label}
      <textarea
        className="mt-2 min-h-28 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-stone-400 focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
        {...props}
      />
    </label>
  );
}
