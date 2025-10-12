-- Add proxy bidding columns to bids table
ALTER TABLE public.bids
  ADD COLUMN IF NOT EXISTS submitted_bid_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS maximum_bid_amount NUMERIC;

-- For existing rows, set defaults from bid_amount
UPDATE public.bids
SET submitted_bid_amount = bid_amount
WHERE submitted_bid_amount IS NULL;

UPDATE public.bids
SET maximum_bid_amount = bid_amount
WHERE maximum_bid_amount IS NULL;

-- Make columns required
ALTER TABLE public.bids
  ALTER COLUMN submitted_bid_amount SET NOT NULL,
  ALTER COLUMN maximum_bid_amount SET NOT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_bids_auction_status 
ON public.bids(auction_id, status);

-- Add comment for documentation
COMMENT ON COLUMN public.bids.submitted_bid_amount IS 'The initial bid amount entered by the user';
COMMENT ON COLUMN public.bids.maximum_bid_amount IS 'The maximum proxy bid ceiling set by the user';