-- Fix 1: Grant SELECT permissions to anon and authenticated roles
-- Without these GRANTs, even with RLS policies allowing access, the role has no table permission

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT SELECT ON public.cart_items TO authenticated;
GRANT SELECT ON public.wishlist_items TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT SELECT ON public.order_status_history TO authenticated;
GRANT SELECT ON public.addresses TO authenticated;
GRANT SELECT ON public.coupons TO anon, authenticated;

-- Allow authenticated users to insert/update/delete their own data
GRANT INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.wishlist_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orders TO authenticated;

-- Fix 2: Rewrite is_admin() to use JWT instead of querying profiles
-- This breaks the infinite recursion: profiles -> is_admin() -> profiles -> ...
-- The role is read from the JWT's app_metadata instead

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt()->'app_metadata'->>'role') IN ('admin', 'super_admin'),
    FALSE
  );
$$;

-- Trigger function to sync profiles.role into auth.users.raw_app_meta_data (JWT)
CREATE OR REPLACE FUNCTION public.sync_role_to_jwt()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- Drop old trigger if it exists, then create new one
DROP TRIGGER IF EXISTS trigger_sync_profile_role ON public.profiles;
CREATE TRIGGER trigger_sync_profile_role
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_jwt();

-- Update handle_new_user trigger to also set role in JWT on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  -- Set role in JWT app_metadata so is_admin() works immediately
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "customer"}'::jsonb
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

-- Backfill: set role in JWT for all existing profiles
UPDATE auth.users u
SET raw_app_meta_data = COALESCE(u.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', p.role)
FROM public.profiles p
WHERE u.id = p.id;
