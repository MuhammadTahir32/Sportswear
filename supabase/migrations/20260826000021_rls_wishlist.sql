-- wishlist_items: user can CRUD own rows only
create policy "rls_wishlist_select"
  on public.wishlist_items for select
  using (auth.uid() = user_id);

create policy "rls_wishlist_insert"
  on public.wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "rls_wishlist_delete"
  on public.wishlist_items for delete
  using (auth.uid() = user_id);
