-- StrideWear shoelace seed data

-- Categories
insert into public.categories (id, name, slug) values
  ('11111111-0000-0000-0000-000000000001', 'Round Laces', 'round-laces'),
  ('11111111-0000-0000-0000-000000000002', 'Flat Laces', 'flat-laces'),
  ('11111111-0000-0000-0000-000000000003', 'Oval Laces', 'oval-laces'),
  ('11111111-0000-0000-0000-000000000004', 'Waxed Laces', 'waxed-laces'),
  ('11111111-0000-0000-0000-000000000005', 'No-Tie Laces', 'no-tie-laces'),
  ('11111111-0000-0000-0000-000000000006', 'Fat Laces', 'fat-laces'),
  ('11111111-0000-0000-0000-000000000007', 'Accessories', 'accessories');

-- Products
insert into public.products (id, name, slug, description, category_id, gender, base_price, sale_price, status, avg_rating) values
  ('22222222-0000-0000-0000-000000000001', 'Nike Round Laces - Black', 'nike-round-black', 'Premium replacement round laces for Nike sneakers.', '11111111-0000-0000-0000-000000000001', 'unisex', 12.99, null, 'active', 4.8),
  ('22222222-0000-0000-0000-000000000002', 'Nike Round Laces - White', 'nike-round-white', 'Classic white round laces perfect for AF1s.', '11111111-0000-0000-0000-000000000001', 'unisex', 12.99, null, 'active', 4.9),
  ('22222222-0000-0000-0000-000000000003', 'Adidas Flat Laces - Black', 'adidas-flat-black', 'Durable flat laces for Adidas shoes.', '11111111-0000-0000-0000-000000000002', 'men', 14.99, null, 'active', 4.5),
  ('22222222-0000-0000-0000-000000000004', 'Adidas Flat Laces - Lime', 'adidas-flat-lime', 'Vibrant lime green flat laces for a pop of color.', '11111111-0000-0000-0000-000000000002', 'unisex', 14.99, 11.99, 'active', 4.7),
  ('22222222-0000-0000-0000-000000000005', 'New Balance Oval Laces - Navy', 'nb-oval-navy', 'High-quality oval laces designed for New Balance runners.', '11111111-0000-0000-0000-000000000003', 'men', 11.99, null, 'active', 4.6),
  ('22222222-0000-0000-0000-000000000006', 'Jordan Flat Laces - Red', 'jordan-flat-red', 'Bold red flat laces for your favorite Jordans.', '11111111-0000-0000-0000-000000000002', 'unisex', 15.99, null, 'active', 4.9),
  ('22222222-0000-0000-0000-000000000007', 'Vans Classic Laces - White', 'vans-classic-white', 'Classic replacement laces for Vans.', '11111111-0000-0000-0000-000000000002', 'kids', 9.99, null, 'active', 4.4),
  ('22222222-0000-0000-0000-000000000008', 'Converse Round Laces - Multi', 'converse-round-multi', 'Multi-colored round laces for Chuck Taylors.', '11111111-0000-0000-0000-000000000001', 'unisex', 13.99, null, 'active', 4.8),
  ('22222222-0000-0000-0000-000000000009', 'Hoka No-Tie Laces - Black', 'hoka-notie-black', 'Convenient no-tie laces ideal for Hoka running shoes.', '11111111-0000-0000-0000-000000000005', 'unisex', 18.99, null, 'active', 4.5),
  ('22222222-0000-0000-0000-000000000010', 'Puma Fat Laces - White', 'puma-fat-white', 'Retro thick fat laces for Puma Suedes.', '11111111-0000-0000-0000-000000000006', 'men', 16.99, 14.99, 'active', 4.7),
  ('22222222-0000-0000-0000-000000000011', 'Nike Waxed Laces - Brown', 'nike-waxed-brown', 'Premium waxed laces for a sophisticated sneaker look.', '11111111-0000-0000-0000-000000000004', 'men', 19.99, null, 'active', 4.8),
  ('22222222-0000-0000-0000-000000000012', 'Adidas Oval Laces - Pink', 'adidas-oval-pink', 'Bright pink oval laces to refresh your sneakers.', '11111111-0000-0000-0000-000000000003', 'women', 12.99, null, 'active', 4.6),
  ('22222222-0000-0000-0000-000000000013', 'New Balance Round Laces - Grey', 'nb-round-grey', 'Classic grey round laces matching NB aesthetics.', '11111111-0000-0000-0000-000000000001', 'unisex', 11.99, null, 'active', 4.5),
  ('22222222-0000-0000-0000-000000000014', 'Jordan Fat Laces - Black/Green', 'jordan-fat-blackgreen', 'Chunky fat laces with a black and green pattern.', '11111111-0000-0000-0000-000000000006', 'unisex', 17.99, null, 'active', 4.9),
  ('22222222-0000-0000-0000-000000000015', 'Converse Flat Laces - Striped', 'converse-flat-striped', 'Fun striped flat laces for kids.', '11111111-0000-0000-0000-000000000002', 'kids', 10.99, 8.99, 'active', 4.3);

-- Product variants
insert into public.product_variants (product_id, sku, size, color, stock_qty) values
  ('22222222-0000-0000-0000-000000000001', 'NIK-RND-BLK-36', '36"', 'Black', 50),
  ('22222222-0000-0000-0000-000000000001', 'NIK-RND-BLK-45', '45"', 'Black', 60),
  ('22222222-0000-0000-0000-000000000001', 'NIK-RND-BLK-54', '54"', 'Black', 45),
  ('22222222-0000-0000-0000-000000000002', 'NIK-RND-WHT-45', '45"', 'White', 100),
  ('22222222-0000-0000-0000-000000000002', 'NIK-RND-WHT-54', '54"', 'White', 85),
  ('22222222-0000-0000-0000-000000000003', 'ADI-FLT-BLK-45', '45"', 'Black', 40),
  ('22222222-0000-0000-0000-000000000003', 'ADI-FLT-BLK-54', '54"', 'Black', 30),
  ('22222222-0000-0000-0000-000000000004', 'ADI-FLT-LIM-45', '45"', 'Lime', 20),
  ('22222222-0000-0000-0000-000000000005', 'NB-OVL-NVY-45', '45"', 'Navy', 35),
  ('22222222-0000-0000-0000-000000000006', 'JOR-FLT-RED-54', '54"', 'Red', 55),
  ('22222222-0000-0000-0000-000000000007', 'VAN-CLS-WHT-36', '36"', 'White', 40),
  ('22222222-0000-0000-0000-000000000008', 'CON-RND-MLT-45', '45"', 'Multi', 25),
  ('22222222-0000-0000-0000-000000000009', 'HOK-NOT-BLK-OS', 'OS', 'Black', 60),
  ('22222222-0000-0000-0000-000000000010', 'PUM-FAT-WHT-45', '45"', 'White', 30),
  ('22222222-0000-0000-0000-000000000011', 'NIK-WXD-BRN-54', '54"', 'Brown', 25),
  ('22222222-0000-0000-0000-000000000012', 'ADI-OVL-PNK-45', '45"', 'Pink', 40),
  ('22222222-0000-0000-0000-000000000013', 'NB-RND-GRY-45', '45"', 'Grey', 50),
  ('22222222-0000-0000-0000-000000000014', 'JOR-FAT-BKG-54', '54"', 'Black/Green', 35),
  ('22222222-0000-0000-0000-000000000015', 'CON-FLT-STR-36', '36"', 'Striped', 30);

-- Product images
insert into public.product_images (product_id, storage_path, position) values
  ('22222222-0000-0000-0000-000000000001', 'nike-round-black.jpg', 0),
  ('22222222-0000-0000-0000-000000000002', 'nike-round-white.jpg', 0),
  ('22222222-0000-0000-0000-000000000003', 'adidas-flat-black.jpg', 0),
  ('22222222-0000-0000-0000-000000000004', 'adidas-flat-lime.jpg', 0),
  ('22222222-0000-0000-0000-000000000005', 'nb-oval-navy.jpg', 0),
  ('22222222-0000-0000-0000-000000000006', 'jordan-flat-red.jpg', 0),
  ('22222222-0000-0000-0000-000000000007', 'vans-flat-white.jpg', 0),
  ('22222222-0000-0000-0000-000000000008', 'converse-round-multi.jpg', 0),
  ('22222222-0000-0000-0000-000000000009', 'hoka-notie-black.jpg', 0),
  ('22222222-0000-0000-0000-000000000010', 'puma-fat-white.jpg', 0),
  ('22222222-0000-0000-0000-000000000011', 'nike-waxed-brown.jpg', 0),
  ('22222222-0000-0000-0000-000000000012', 'adidas-oval-pink.jpg', 0),
  ('22222222-0000-0000-0000-000000000013', 'nb-round-grey.jpg', 0),
  ('22222222-0000-0000-0000-000000000014', 'jordan-fat-blackgreen.jpg', 0),
  ('22222222-0000-0000-0000-000000000015', 'converse-flat-striped.jpg', 0);

-- Coupons
insert into public.coupons (code, discount_type, discount_value, expires_at, active) values
  ('STRIDE10', 'percent', 10.00, '2027-01-01 00:00:00+00', true),
  ('WELCOME20', 'percent', 20.00, '2026-12-31 00:00:00+00', true),
  ('FLAT15', 'fixed', 15.00, '2026-12-31 00:00:00+00', true);
