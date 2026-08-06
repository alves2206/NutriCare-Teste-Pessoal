create or replace function public.seed_default_foods_for_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.foods (
    user_id,
    name,
    brand,
    category,
    reference_amount,
    reference_unit,
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sodium,
    notes
  )
  values
    (target_user_id, 'Arroz branco cozido', null, 'Cereais e grãos', 100, 'gramas', 128, 2.5, 28, 0.2, 1.6, 1, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Feijão carioca cozido', null, 'Cereais e grãos', 100, 'gramas', 76, 4.8, 13.6, 0.5, 8.5, 2, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Peito de frango grelhado', null, 'Carnes', 100, 'gramas', 165, 31, 0, 3.6, 0, 74, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Ovo cozido', null, 'Ovos', 1, 'unidade', 78, 6.3, 0.6, 5.3, 0, 62, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Banana', null, 'Frutas', 1, 'unidade', 89, 1.1, 22.8, 0.3, 2.6, 1, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Leite', null, 'Laticínios', 200, 'mililitros', 122, 6.4, 9.6, 6.6, 0, 88, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Aveia', null, 'Cereais e grãos', 30, 'gramas', 117, 4.1, 19.9, 2.1, 3.2, 1, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Pão francês', null, 'Lanches', 1, 'unidade', 135, 4.4, 28, 1.4, 1.2, 320, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Queijo', null, 'Laticínios', 30, 'gramas', 105, 7.5, 0.6, 8.1, 0, 190, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.'),
    (target_user_id, 'Café sem açúcar', null, 'Bebidas', 100, 'mililitros', 2, 0.1, 0, 0, 0, 1, 'Alimento inicial demonstrativo. Revise os valores antes do uso real.')
  on conflict do nothing;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.seed_default_foods_for_user(new.id);
  return new;
end;
$$;

drop trigger if exists seed_default_foods_on_auth_user_created on auth.users;
create trigger seed_default_foods_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

do $$
declare
  existing_user record;
begin
  for existing_user in select id from auth.users loop
    perform public.seed_default_foods_for_user(existing_user.id);
  end loop;
end;
$$;
