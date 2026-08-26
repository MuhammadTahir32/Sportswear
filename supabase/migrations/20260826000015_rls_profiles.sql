-- profiles: user can select/update own row; admin can select all
create policy "rls_profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "rls_profiles_select_admin"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "rls_profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);
