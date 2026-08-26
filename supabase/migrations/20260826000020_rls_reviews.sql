-- reviews: anyone can select; user can insert own (purchased enforcement done server-side)
create policy "rls_reviews_select_all"
  on public.reviews for select
  using (true);

create policy "rls_reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "rls_reviews_delete_own"
  on public.reviews for delete
  using (auth.uid() = user_id);

create policy "rls_reviews_delete_admin"
  on public.reviews for delete
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));
