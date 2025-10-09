ALTER TABLE public.bids
  ADD COLUMN submitted_bid_amount NUMERIC,
  ADD COLUMN maximum_bid_amount NUMERIC;

UPDATE public.bids
SET submitted_bid_amount = bid_amount
WHERE submitted_bid_amount IS NULL;

UPDATE public.bids
SET maximum_bid_amount = bid_amount
WHERE maximum_bid_amount IS NULL;

ALTER TABLE public.bids
  ALTER COLUMN submitted_bid_amount SET NOT NULL,
  ALTER COLUMN maximum_bid_amount SET NOT NULL;
