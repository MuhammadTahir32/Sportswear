-- Supabase migration to restore stock safely using FOR UPDATE locks to prevent race conditions.
-- This function takes an array of items and increments the stock for each item atomically.

CREATE OR REPLACE FUNCTION restore_stock(items jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item jsonb;
  v_id uuid;
  v_qty int;
  v_current_stock int;
BEGIN
  -- We process each item in the JSON array
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    v_id := (item->>'variant_id')::uuid;
    v_qty := (item->>'quantity')::int;

    -- Lock the row for update to prevent concurrent modifications
    SELECT stock_qty INTO v_current_stock
    FROM product_variants
    WHERE id = v_id
    FOR UPDATE;

    IF v_current_stock IS NULL THEN
      RAISE EXCEPTION 'Variant % not found', v_id;
    END IF;

    -- Increment the stock
    UPDATE product_variants
    SET stock_qty = stock_qty + v_qty
    WHERE id = v_id;
  END LOOP;
END;
$$;
