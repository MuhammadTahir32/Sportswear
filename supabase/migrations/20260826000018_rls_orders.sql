-- orders: user can select own orders; admin can select/update all
create policy "rls_orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "rls_orders_select_admin"
  on public.orders for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "rls_orders_update_admin"
  on public.orders for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));
