-- avg_rating recalculation trigger on reviews insert/update/delete
create or replace function public.recalculate_avg_rating()
returns trigger
language plpgsql
security definer
as $$
declare
  v_product_id uuid;
begin
  if tg_op = 'DELETE' then
    v_product_id := old.product_id;
  else
    v_product_id := new.product_id;
  end if;

  update public.products
  set avg_rating = (
    select coalesce(round(avg(rating)::numeric, 1), 0)
    from public.reviews
    where product_id = v_product_id
  )
  where id = v_product_id;

  return null;
end;
$$;

create trigger trigger_avg_rating
  after insert or update or delete on public.reviews
  for each row
  execute function public.recalculate_avg_rating();

-- auto-insert order_status_history row on orders.status change
create or replace function public.record_order_status_history()
returns trigger
language plpgsql
security definer
as $$
begin
  if old.status is distinct from new.status then
    insert into public.order_status_history (order_id, status)
    values (new.id, new.status);
  end if;
  return new;
end;
$$;

create trigger trigger_order_status_history
  after update on public.orders
  for each row
  execute function public.record_order_status_history();

-- auto-create profile row on new auth user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger trigger_new_user_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
