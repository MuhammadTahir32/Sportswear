-- products: public select for active; admin can insert/update/delete
create policy "rls_products_select_active"
  on public.products for select
  using (status = 'active');

create policy "rls_products_select_admin"
  on public.products for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_products_insert_admin"
  on public.products for insert
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_products_update_admin"
  on public.products for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_products_delete_admin"
  on public.products for delete
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

-- categories: public select; admin insert/update/delete
create policy "rls_categories_select_all"
  on public.categories for select
  using (true);

create policy "rls_categories_insert_admin"
  on public.categories for insert
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_categories_update_admin"
  on public.categories for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_categories_delete_admin"
  on public.categories for delete
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

-- product_variants: public select; admin write
create policy "rls_variants_select_all"
  on public.product_variants for select
  using (true);

create policy "rls_variants_insert_admin"
  on public.product_variants for insert
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_variants_update_admin"
  on public.product_variants for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_variants_delete_admin"
  on public.product_variants for delete
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

-- product_images: public select; admin write
create policy "rls_images_select_all"
  on public.product_images for select
  using (true);

create policy "rls_images_insert_admin"
  on public.product_images for insert
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_images_update_admin"
  on public.product_images for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

create policy "rls_images_delete_admin"
  on public.product_images for delete
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));
