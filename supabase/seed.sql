-- StrideWear seed data
-- Sample categories
insert into public.categories (id, name, slug) values
  ('11111111-0000-0000-0000-000000000001', 'Running', 'running'),
  ('11111111-0000-0000-0000-000000000002', 'Football', 'football'),
  ('11111111-0000-0000-0000-000000000003', 'Basketball', 'basketball'),
  ('11111111-0000-0000-0000-000000000004', 'Training', 'training'),
  ('11111111-0000-0000-0000-000000000005', 'Apparel', 'apparel'),
  ('11111111-0000-0000-0000-000000000006', 'Accessories', 'accessories');

-- Sub-categories
insert into public.categories (id, name, slug, parent_id) values
  ('11111111-0000-0000-0000-000000000007', 'Men Running', 'men-running', '11111111-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000008', 'Women Running', 'women-running', '11111111-0000-0000-0000-000000000001');

-- Sample products
insert into public.products (id, name, slug, description, category_id, gender, base_price, sale_price, status, avg_rating) values
  (
    '22222222-0000-0000-0000-000000000001',
    'StrideWear AirFlow Pro',
    'stridewear-airflow-pro',
    'Ultra-lightweight running shoe with reactive foam cushioning and breathable mesh upper.',
    '11111111-0000-0000-0000-000000000001',
    'men',
    129.99,
    99.99,
    'active',
    4.5
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'StrideWear SpeedForce Elite',
    'stridewear-speedforce-elite',
    'Competition-grade sprint shoe with carbon fiber plate and explosive energy return.',
    '11111111-0000-0000-0000-000000000001',
    'unisex',
    179.99,
    null,
    'active',
    4.8
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'StrideWear Grip Master FG',
    'stridewear-grip-master-fg',
    'Firm ground football boot with asymmetric lacing and hybrid stud configuration.',
    '11111111-0000-0000-0000-000000000002',
    'men',
    149.99,
    119.99,
    'active',
    4.3
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'StrideWear Court Dominator',
    'stridewear-court-dominator',
    'Basketball shoe with herringbone traction and ankle lockdown strap.',
    '11111111-0000-0000-0000-000000000003',
    'unisex',
    159.99,
    null,
    'active',
    4.6
  ),
  (
    '22222222-0000-0000-0000-000000000005',
    'StrideWear FlexTrainer X',
    'stridewear-flextrainer-x',
    'Versatile training shoe for HIIT, lifting, and cross-training.',
    '11111111-0000-0000-0000-000000000004',
    'women',
    109.99,
    89.99,
    'active',
    4.4
  );

-- Sample product variants
insert into public.product_variants (product_id, sku, size, color, stock_qty) values
  ('22222222-0000-0000-0000-000000000001', 'AFPRO-BLK-41', '41', 'Black', 25),
  ('22222222-0000-0000-0000-000000000001', 'AFPRO-BLK-42', '42', 'Black', 30),
  ('22222222-0000-0000-0000-000000000001', 'AFPRO-BLK-43', '43', 'Black', 20),
  ('22222222-0000-0000-0000-000000000001', 'AFPRO-WHT-41', '41', 'White', 15),
  ('22222222-0000-0000-0000-000000000001', 'AFPRO-WHT-42', '42', 'White', 18),
  ('22222222-0000-0000-0000-000000000001', 'AFPRO-LIM-42', '42', 'Lime', 10),
  ('22222222-0000-0000-0000-000000000002', 'SPEL-BLK-40', '40', 'Black', 12),
  ('22222222-0000-0000-0000-000000000002', 'SPEL-BLK-41', '41', 'Black', 15),
  ('22222222-0000-0000-0000-000000000002', 'SPEL-BLK-42', '42', 'Black', 10),
  ('22222222-0000-0000-0000-000000000003', 'GMFG-BLK-42', '42', 'Black/Lime', 20),
  ('22222222-0000-0000-0000-000000000003', 'GMFG-BLK-43', '43', 'Black/Lime', 18),
  ('22222222-0000-0000-0000-000000000004', 'CDOM-WHT-41', '41', 'White/Black', 22),
  ('22222222-0000-0000-0000-000000000004', 'CDOM-WHT-42', '42', 'White/Black', 25),
  ('22222222-0000-0000-0000-000000000004', 'CDOM-BLK-42', '42', 'Black', 14),
  ('22222222-0000-0000-0000-000000000005', 'FTRX-PNK-37', '37', 'Pink/Black', 16),
  ('22222222-0000-0000-0000-000000000005', 'FTRX-PNK-38', '38', 'Pink/Black', 20),
  ('22222222-0000-0000-0000-000000000005', 'FTRX-PNK-39', '39', 'Pink/Black', 18);

-- Sample coupon
insert into public.coupons (code, discount_type, discount_value, expires_at, active) values
  ('STRIDE10', 'percent', 10.00, '2027-01-01 00:00:00+00', true),
  ('WELCOME20', 'percent', 20.00, '2026-12-31 00:00:00+00', true),
  ('FLAT15', 'fixed', 15.00, '2026-12-31 00:00:00+00', true);
