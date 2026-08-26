-- products indexes
create index idx_products_category_id on public.products(category_id);
create index idx_products_status      on public.products(status);
create index idx_products_gender      on public.products(gender);
create index idx_products_fts         on public.products using gin(to_tsvector('english', name || ' ' || coalesce(description, '')));

-- product_variants indexes
create index idx_product_variants_product_id on public.product_variants(product_id);

-- cart_items indexes
create index idx_cart_items_user_id    on public.cart_items(user_id);
create index idx_cart_items_variant_id on public.cart_items(variant_id);

-- orders indexes
create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status  on public.orders(status);

-- order_items indexes
create index idx_order_items_order_id   on public.order_items(order_id);
create index idx_order_items_variant_id on public.order_items(variant_id);

-- order_status_history indexes
create index idx_order_status_history_order_id on public.order_status_history(order_id);

-- reviews indexes
create index idx_reviews_product_id on public.reviews(product_id);
create index idx_reviews_user_id    on public.reviews(user_id);

-- wishlist_items indexes
create index idx_wishlist_items_user_id    on public.wishlist_items(user_id);
create index idx_wishlist_items_product_id on public.wishlist_items(product_id);

-- addresses indexes
create index idx_addresses_user_id on public.addresses(user_id);

-- product_images indexes
create index idx_product_images_product_id on public.product_images(product_id);
