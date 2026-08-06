"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ArrowRight, Send } from "lucide-react";
import { createPublicLeadAction } from "@/app/avaliacao/actions";
import { Button } from "@/components/ui/Button";
import { intakeFoodOptions, intakeRestrictionOptions } from "@/lib/constants/marketing";

export function PublicIntakeForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const result = await createPublicLeadAction(formData);

      if (!result.ok || !result.leadId || !result.token) {
        setMessage(result.message);
        return;
      }

      router.push(`/planos?lead=${result.leadId}&token=${result.token}`);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-7">
      <section>
        <h2 className="text-lg font-semibold text-ink">Contato e objetivo</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextInput label="Nome completo" name="fullName" required />
          <TextInput label="E-mail" name="email" type="email" required />
          <TextInput label="WhatsApp" name="whatsapp" placeholder="(24) 99999-9999" required />
          <SelectInput label="Objetivo principal" name="objective" defaultValue="Redução de peso">
            <option>Redução de peso</option>
            <option>Ganho de massa</option>
            <option>Definição corporal</option>
            <option>Manutenção</option>
            <option>Saúde e rotina</option>
          </SelectInput>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Dados físicos</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextInput label="Data de nascimento" name="birthDate" type="date" />
          <TextInput label="Altura" name="heightCm" type="number" suffix="cm" />
          <TextInput label="Peso atual" name="currentWeightKg" type="number" step="0.1" suffix="kg" />
          <TextInput label="Peso/meta desejada" name="targetWeightKg" type="number" step="0.1" suffix="kg" />
          <SelectInput label="Sexo biológico" name="biologicalSex" defaultValue="">
            <option value="">Prefiro não informar</option>
            <option>Feminino</option>
            <option>Masculino</option>
          </SelectInput>
          <SelectInput label="Nível de atividade" name="activityLevel" defaultValue="Moderado">
            <option>Baixo</option>
            <option>Moderado</option>
            <option>Alto</option>
            <option>Atleta/recreativo intenso</option>
          </SelectInput>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Rotina e alimentação</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <SelectInput label="Refeições por dia" name="mealsPerDay" defaultValue="5">
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </SelectInput>
          <TextArea label="Como é sua rotina de horários?" name="routine" />
          <ChoiceGroup
            label="Alimentos que gosta"
            name="foodLikes"
            options={intakeFoodOptions}
            otherName="foodLikesOther"
            otherLabel="Outros alimentos ou observações"
          />
          <ChoiceGroup
            label="Alimentos que não gosta"
            name="foodDislikes"
            options={intakeFoodOptions.filter((item) => item !== "Todos")}
            otherName="foodDislikesOther"
            otherLabel="Outros alimentos recusados"
          />
          <ChoiceGroup
            label="Restrições, alergias ou condições"
            name="restrictions"
            options={intakeRestrictionOptions}
            otherName="restrictionsOther"
            otherLabel="Outra restrição ou detalhe importante"
          />
          <TextArea label="Histórico, exames ou observações importantes" name="healthNotes" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Treino</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <SelectInput label="Objetivo no treino" name="trainingGoal" defaultValue="Hipertrofia">
            <option>Hipertrofia</option>
            <option>Emagrecimento</option>
            <option>Condicionamento</option>
            <option>Força</option>
            <option>Saúde e mobilidade</option>
          </SelectInput>
          <SelectInput label="Experiência" name="trainingExperience" defaultValue="Iniciante">
            <option>Iniciante</option>
            <option>Intermediário</option>
            <option>Avançado</option>
          </SelectInput>
          <SelectInput label="Local do treino" name="trainingLocation" defaultValue="Academia">
            <option>Academia</option>
            <option>Casa</option>
            <option>Ambos</option>
          </SelectInput>
          <SelectInput label="Dias por semana" name="trainingDaysPerWeek" defaultValue="3">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </SelectInput>
          <TextArea label="Equipamentos disponíveis e limitações" name="availableEquipment" className="md:col-span-2" />
        </div>
      </section>

      {message ? (
        <p className="rounded-2xl bg-rosepetal-50 px-4 py-3 text-sm text-rosepetal-500" role="status">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? <Send size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
        {isPending ? "Salvando avaliação..." : "Ver planos recomendados"}
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

function ChoiceGroup({
  label,
  name,
  options,
  otherName,
  otherLabel
}: {
  label: string;
  name: string;
  options: string[];
  otherName: string;
  otherLabel: string;
}) {
  return (
    <fieldset className="rounded-2xl border border-rosepetal-100 bg-white/70 p-4 md:col-span-2">
      <legend className="px-1 text-sm font-semibold text-ink">{label}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label
            key={`${name}-${option}`}
            className="flex min-h-10 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-medium text-stone-700 ring-1 ring-rosepetal-100"
          >
            <input className="size-4 accent-rosepetal-500" type="checkbox" name={name} value={option} />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <label className="mt-4 block text-sm font-medium text-ink">
        {otherLabel}
        <textarea
          className="mt-2 min-h-20 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-stone-400 focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
          name={otherName}
          placeholder="Escreva aqui se não estiver na lista."
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
