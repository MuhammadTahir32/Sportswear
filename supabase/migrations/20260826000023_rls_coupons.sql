-- coupons: select restricted to admin only (validation done server-side)
create policy "rls_coupons_select_admin"
  on public.coupons for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_coupons_insert_admin"
  on public.coupons for insert
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_coupons_update_admin"
  on public.coupons for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_coupons_delete_admin"
  on public.coupons for delete
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));
