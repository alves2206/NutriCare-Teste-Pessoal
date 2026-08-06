import {
  Apple,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  Home,
  LucideIcon,
  Settings,
  ShieldCheck,
  Soup
} from "lucide-react";

export const APP_NAME = "NutriCare";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavItem[] = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Perfil", href: "/onboarding", icon: ClipboardList },
  { label: "Plano", href: "/plano", icon: Soup },
  { label: "Treinos", href: "/treinos", icon: Dumbbell },
  { label: "Admin", href: "/admin", icon: ShieldCheck },
  { label: "Refeições", href: "/refeicoes", icon: Soup },
  { label: "Alimentos", href: "/alimentos", icon: Apple },
  { label: "Histórico", href: "/historico", icon: CalendarDays },
  { label: "Evolução", href: "/evolucao", icon: BarChart3 },
  { label: "Configurações", href: "/configuracoes", icon: Settings }
];

export const foodCategories = [
  "Cereais e grãos",
  "Carnes",
  "Ovos",
  "Laticínios",
  "Frutas",
  "Verduras",
  "Legumes",
  "Bebidas",
  "Doces",
  "Lanches",
  "Suplementos",
  "Outros"
] as const;

export const mealTypes = [
  "Café da manhã",
  "Lanche da manhã",
  "Almoço",
  "Lanche da tarde",
  "Jantar",
  "Ceia",
  "Outro"
] as const;

export const referenceUnits = [
  "gramas",
  "mililitros",
  "unidade",
  "colher",
  "xícara",
  "porção"
] as const;

export const healthDisclaimer =
  "Esta aplicação é uma ferramenta pessoal de organização e acompanhamento. Os cálculos e registros apresentados não substituem avaliação, diagnóstico ou acompanhamento de nutricionista ou profissional de saúde.";
