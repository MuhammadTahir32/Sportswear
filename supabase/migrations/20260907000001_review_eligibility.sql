-- Function to check if a user can review a product
-- A user can review a product if they have a 'delivered' order containing it.

CREATE OR REPLACE FUNCTION can_review_product(p_user_id uuid, p_product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_purchased boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN product_variants pv ON oi.variant_id = pv.id
    WHERE o.user_id = p_user_id
      AND o.status = 'delivered'
      AND pv.product_id = p_product_id
  ) INTO has_purchased;

  RETURN has_purchased;
END;
$$;
