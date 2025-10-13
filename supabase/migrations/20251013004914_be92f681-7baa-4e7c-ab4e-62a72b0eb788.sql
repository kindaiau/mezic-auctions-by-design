-- Fix security definer view warning
-- Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS public.auction_bid_counts;

CREATE VIEW public.auction_bid_counts 
WITH (security_invoker=true)
AS
SELECT 
  auction_id,
  COUNT(*) as bid_count,
  MAX(bid_amount) as current_high_bid
FROM public.bids
WHERE status IN ('accepted', 'leading')
GROUP BY auction_id;

-- Re-grant access to the view
GRANT SELECT ON public.auction_bid_counts TO anon, authenticated;