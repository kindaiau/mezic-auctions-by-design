-- Delete test bids
DELETE FROM bids WHERE id IN (
  '1c6c4039-a665-40d1-9484-1d15644e3246',
  'a9e532c5-ef86-4082-b130-1d94acfd331d',
  '92fc8f5a-c161-420b-83e2-8f8d1eb49035',
  '7560e3be-2c98-48f3-aa6d-49e590d0b60c',
  'b34fb4b9-1cd6-4387-9229-534391997e20',
  '76590828-7cb3-4f09-9fd3-518377e3f6ca'
);

-- Update Tayla's bid to accepted (winner)
UPDATE bids 
SET status = 'accepted' 
WHERE id = '8b4b4bf9-3321-411d-b3c3-aa15f58a89b1';

-- Update auction current_bid to Tayla's winning bid
UPDATE auctions 
SET current_bid = 325 
WHERE id = '487e488d-1e31-4852-a45d-57f81d2b6644';

-- Add winner notification tracking fields to auctions table
ALTER TABLE auctions 
ADD COLUMN IF NOT EXISTS winner_notified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS winner_notified_at TIMESTAMP WITH TIME ZONE;