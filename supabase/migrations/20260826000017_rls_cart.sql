-- cart_items: user can CRUD own rows only
create policy "rls_cart_select"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "rls_cart_insert"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "rls_cart_update"
  on public.cart_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "rls_cart_delete"
  on public.cart_items for delete
  using (auth.uid() = user_id);
