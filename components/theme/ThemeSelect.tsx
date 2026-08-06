"use client";

import { useEffect, useState } from "react";

type ThemeValue = "light" | "auto" | "dark";

type ThemeSelectProps = {
  defaultValue: string;
};

function applyTheme(theme: ThemeValue) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle(
    "dark",
    theme === "dark" || (theme === "auto" && prefersDark)
  );
  localStorage.setItem("nutricare-theme", theme);
}

export function ThemeSelect({ defaultValue }: ThemeSelectProps) {
  const normalizedDefault =
    defaultValue === "dark" || defaultValue === "auto" ? defaultValue : "light";
  const [theme, setTheme] = useState<ThemeValue>(normalizedDefault);

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "auto") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("auto");
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [theme]);

  return (
    <label className="text-sm font-medium text-ink">
      Tema
      <select
        className="mt-2 min-h-12 w-full rounded-2xl border border-rosepetal-100 bg-white px-4 outline-none focus:border-rosepetal-300 focus:ring-4 focus:ring-rosepetal-100"
        name="theme"
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemeValue)}
      >
        <option value="light">Claro</option>
        <option value="auto">Automático</option>
        <option value="dark">Escuro</option>
      </select>
    </label>
  );
}
