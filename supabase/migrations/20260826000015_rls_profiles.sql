-- profiles: user can select/update own row; admin can select all
create policy "rls_profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;

create policy "rls_profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

create policy "rls_profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "rls_profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);
