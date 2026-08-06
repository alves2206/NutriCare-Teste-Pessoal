# NutriCare

NutriCare é uma aplicação web privada de acompanhamento nutricional pessoal. A versão atual entrega base visual, autenticação Supabase preparada, páginas protegidas, CRUD de alimentos, registro de refeições com cálculo automático, histórico, registros de peso, gráfico de evolução, configurações de perfil/metas, dados demonstrativos, preparação PWA e estrutura para futura integração com IA.

> Esta aplicação é uma ferramenta pessoal de organização e acompanhamento. Os cálculos e registros apresentados não substituem avaliação, diagnóstico ou acompanhamento de nutricionista ou profissional de saúde.

## Tecnologias

- Next.js com App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Auth e Supabase Database
- Recharts
- Lucide React
- Zod
- React Hook Form
- Vitest para testes das funções nutricionais
- Vercel como ambiente planejado de publicação

## Requisitos

- Node.js instalado
- npm instalado
- Projeto Supabase criado
- Conta Vercel para publicação futura

## Como instalar

```bash
npm install
```

## Arquivo de ambiente

Crie um arquivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Preencha para ativar login privado e persistência:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
ALLOWED_USER_EMAILS=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Nunca coloque a chave `service_role` no frontend.
Para autorizar mais de um e-mail, separe com vírgulas em `ALLOWED_USER_EMAILS`.

## Como executar localmente

```bash
npm run dev
```

Acesse o endereço local exibido pelo Next.js.

## Testes

```bash
npm run test
```

Os testes cobrem quantidade igual, menor e maior que a referência, valores decimais, quantidade zero, arredondamento e proteção contra divisão por zero.

## Supabase

Supabase está preparado em:

- `.env.example`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `types/database.ts`
- `supabase/migrations/202608040001_initial_schema.sql`
- `middleware.ts`

A migration cria:

- `profiles`
- `foods`
- `meals`
- `meal_items`
- `weight_entries`

Ela ativa Row Level Security e cria políticas para garantir que cada registro pertença ao usuário autenticado.

## Como criar o primeiro usuário

1. Acesse o painel do Supabase.
2. Vá em Authentication.
3. Crie manualmente o usuário com e-mail e senha.
4. Informe esse mesmo e-mail em `ALLOWED_USER_EMAILS`.
5. Não habilite cadastro público na interface da aplicação.

## Como restringir a um único e-mail

A aplicação confere o e-mail autenticado com `ALLOWED_USER_EMAILS` no middleware. O banco também usa RLS por `auth.uid()` para impedir acesso cruzado entre usuários.

## Como aplicar migrations

Com Supabase CLI:

```bash
supabase db push
```

Ou aplique o SQL manualmente pelo painel do Supabase.

## Publicação na Vercel

1. Envie o projeto para um repositório Git.
2. Importe o projeto na Vercel.
3. Configure as variáveis de ambiente.
4. Publique.
5. Valide login, navegação mobile, dashboard e acesso privado.

## Estrutura de pastas

```text
app/
  api/ai/
  alimentos/
  configuracoes/
  dashboard/
  evolucao/
  historico/
  login/
  refeicoes/
components/
  auth/
  charts/
  dashboard/
  foods/
  forms/
  layout/
  meals/
  ui/
hooks/
lib/
  ai/
  auth/
  constants/
  data/
  nutrition/
  repositories/
  supabase/
  utils/
  validations/
public/
supabase/
  migrations/
types/
```

## Funcionalidades disponíveis

- Login por e-mail e senha com Supabase Auth.
- Restrição de acesso por e-mail autorizado.
- Proteção das páginas internas via middleware.
- Layout responsivo com sidebar no desktop.
- Menu inferior mobile com áreas principais.
- Dashboard diário com metas, totais e barras de progresso.
- CRUD de alimentos com busca, filtro, validação e confirmação de exclusão.
- Registro manual de refeições com vários alimentos e cálculo automático.
- Histórico por data e filtro por período.
- Registro, edição e exclusão de peso.
- Gráfico responsivo de evolução de peso.
- Configurações de perfil e metas manuais.
- Dados demonstrativos para testar a interface sem Supabase.
- Cálculo nutricional centralizado em funções reutilizáveis.
- Testes das funções de cálculo.
- Manifest PWA inicial.
- Estrutura Gemini server-side para interpretar refeição em texto livre.

## Gemini

A integração com IA fica em `lib/ai/` e `app/api/ai/route.ts`.

Para ativar:

1. Crie uma chave no Google AI Studio.
2. Configure `GEMINI_API_KEY` na Vercel.
3. Opcionalmente ajuste `GEMINI_MODEL`.

A IA só interpreta alimento, quantidade, unidade e tipo de refeição. Calorias e nutrientes continuam sendo calculados pelo sistema com a base de alimentos.

## Próximas melhorias

1. Criar tela de recuperação de senha, se desejado.
2. Adicionar service worker para PWA offline.
3. Adicionar seeds opcionais de alimentos demonstrativos no banco.
4. Melhorar filtros avançados no histórico.
5. Implementar a interpretação de refeição com IA no servidor.
6. Criar pipeline de publicação na Vercel.

## Observações

- Os dados nutricionais exibidos são demonstrativos e devem ser revisados antes do uso real.
- A aplicação não gera dietas, diagnósticos ou metas clínicas automáticas.
- A futura IA deverá interpretar texto, mas os nutrientes continuarão sendo calculados pelos alimentos cadastrados.
