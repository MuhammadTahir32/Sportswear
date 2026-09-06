-- ═══════════════════════════════════════════════════════════════════
-- Migration: decrement_stock RPC function
-- Purpose:   Atomically decrement stock for multiple variants in a
--            single transaction with FOR UPDATE row-level locks.
--            Raises an exception if any variant has insufficient stock.
-- ═══════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.decrement_stock(items jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  low_stock_alerts jsonb := '[]'::jsonb;
  item jsonb;
  v_id uuid;
  v_qty int;
  current_stock int;
  product_name text;
  v_size text;
  v_color text;
BEGIN
  -- Loop through each item in the JSON array
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    v_id  := (item ->> 'variant_id')::uuid;
    v_qty := (item ->> 'quantity')::int;

    -- Lock the row and fetch current stock
    SELECT pv.stock_qty, p.name, pv.size, pv.color
    INTO current_stock, product_name, v_size, v_color
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.id = v_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product variant % not found', v_id;
    END IF;

    IF current_stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for "%" (available: %, requested: %)',
        product_name, current_stock, v_qty;
    END IF;

    -- Decrement stock
    UPDATE product_variants
    SET stock_qty = stock_qty - v_qty
    WHERE id = v_id;

    -- Check if it just dropped to 5 or below
    IF (current_stock - v_qty) <= 5 AND current_stock > 5 THEN
      low_stock_alerts := low_stock_alerts || jsonb_build_object(
        'variant_id', v_id,
        'product_name', product_name,
        'variant_info', v_color || ' / ' || v_size,
        'stock_qty', current_stock - v_qty
      );
    END IF;
  END LOOP;

  RETURN low_stock_alerts;
END;
$$;

-- Allow authenticated users to call this function
GRANT EXECUTE ON FUNCTION public.decrement_stock(jsonb) TO authenticated;
