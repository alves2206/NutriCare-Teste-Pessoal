export const intakeFoodOptions = [
  "Todos",
  "Carne bovina",
  "Frango",
  "Ovo",
  "Peixe",
  "Frutos do mar",
  "Lagosta",
  "Leite e derivados",
  "Arroz",
  "Feijão",
  "Macarrão",
  "Batata",
  "Mandioca",
  "Aveia",
  "Frutas",
  "Verduras",
  "Legumes",
  "Doces",
  "Suplementos"
];

export const intakeRestrictionOptions = [
  "Nenhuma",
  "Lactose",
  "Glúten",
  "Diabetes",
  "Hipertensão",
  "Gastrite/refluxo",
  "Vegetariano",
  "Vegano",
  "Alergia a ovo",
  "Alergia a leite",
  "Alergia a frutos do mar",
  "Não come carne vermelha",
  "Não come frango",
  "Não come peixe",
  "Baixo sódio"
];

export const publicPlanOptions = [
  {
    id: "essencial",
    name: "Essencial",
    price: "R$ 97",
    period: "mensal",
    description: "Para começar com plano alimentar e treino estruturado.",
    features: ["Avaliação inicial", "Plano alimentar", "Treino base", "Ajuste mensal"],
    whatsapp: false
  },
  {
    id: "acompanhamento",
    name: "Acompanhamento",
    price: "R$ 167",
    period: "mensal",
    description: "Para quem quer acompanhamento com ajustes e suporte.",
    features: ["Plano alimentar", "Treino personalizado", "Ajustes quinzenais", "Suporte via WhatsApp"],
    whatsapp: true,
    highlighted: true
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 247",
    period: "mensal",
    description: "Para acompanhamento mais próximo e evolução acelerada.",
    features: ["Ajustes semanais", "WhatsApp prioritário", "Plano alimentar", "Treino personalizado"],
    whatsapp: true
  },
  {
    id: "semestral",
    name: "Semestral",
    price: "R$ 897",
    period: "6 meses",
    description: "Para quem quer consistência e economia no acompanhamento.",
    features: ["6 meses de acesso", "Revisões programadas", "WhatsApp incluso", "Melhor custo-benefício"],
    whatsapp: true
  }
];
