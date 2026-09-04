-- Drop stripe_session_id column from orders table
-- Cash on Delivery (COD) does not require Stripe session tracking

ALTER TABLE public.orders DROP COLUMN IF EXISTS stripe_session_id;
