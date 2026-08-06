export function formatDateBR(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(typeof date === "string" ? new Date(`${date}T12:00:00`) : date);
}

export function formatShortDateBR(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  }).format(typeof date === "string" ? new Date(`${date}T12:00:00`) : date);
}

export function formatNumberBR(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits
  }).format(value);
}
