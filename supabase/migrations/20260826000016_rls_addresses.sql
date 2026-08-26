-- addresses: user can CRUD own rows only
create policy "rls_addresses_select"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "rls_addresses_insert"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "rls_addresses_update"
  on public.addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "rls_addresses_delete"
  on public.addresses for delete
  using (auth.uid() = user_id);
