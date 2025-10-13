-- Insert mock bids for Vali Myers Original auction
-- Auction ID: e33cb053-f6d5-4c89-be05-d3ebe4ba2c60
INSERT INTO public.bids (
  auction_id,
  bidder_name,
  bidder_email,
  bidder_phone,
  bid_amount,
  submitted_bid_amount,
  maximum_bid_amount,
  bid_time,
  status
) VALUES
  -- Bid 1: Sarah Chen (outbid)
  (
    'e33cb053-f6d5-4c89-be05-d3ebe4ba2c60',
    'Sarah Chen',
    'sarah.chen@email.com',
    '+1-555-0101',
    2501.00,
    2501.00,
    2600.00,
    now() - interval '4 hours',
    'outbid'
  ),
  -- Bid 2: Michael Torres (outbid)
  (
    'e33cb053-f6d5-4c89-be05-d3ebe4ba2c60',
    'Michael Torres',
    'michael.torres@email.com',
    '+1-555-0102',
    2520.00,
    2520.00,
    2750.00,
    now() - interval '3 hours',
    'outbid'
  ),
  -- Bid 3: Emma Wilson (accepted - currently winning)
  (
    'e33cb053-f6d5-4c89-be05-d3ebe4ba2c60',
    'Emma Wilson',
    'emma.wilson@email.com',
    '+1-555-0103',
    2600.00,
    2600.00,
    3000.00,
    now() - interval '2 hours',
    'accepted'
  );

-- Insert mock bids for Abstract Emotions auction
-- Auction ID: 0457412e-269c-4f1e-a893-0cbf6c4f6623
INSERT INTO public.bids (
  auction_id,
  bidder_name,
  bidder_email,
  bidder_phone,
  bid_amount,
  submitted_bid_amount,
  maximum_bid_amount,
  bid_time,
  status
) VALUES
  -- Bid 1: David Kim (outbid)
  (
    '0457412e-269c-4f1e-a893-0cbf6c4f6623',
    'David Kim',
    'david.kim@email.com',
    '+1-555-0201',
    1850.00,
    1850.00,
    2000.00,
    now() - interval '5 hours',
    'outbid'
  ),
  -- Bid 2: Lisa Martinez (accepted - currently winning)
  (
    '0457412e-269c-4f1e-a893-0cbf6c4f6623',
    'Lisa Martinez',
    'lisa.martinez@email.com',
    '+1-555-0202',
    1900.00,
    1900.00,
    2200.00,
    now() - interval '3 hours 30 minutes',
    'accepted'
  );

-- Insert mock bids for Urban Decay Series auction
-- Auction ID: 381931ba-adac-4c5b-8c95-204ab353aa13
INSERT INTO public.bids (
  auction_id,
  bidder_name,
  bidder_email,
  bidder_phone,
  bid_amount,
  submitted_bid_amount,
  maximum_bid_amount,
  bid_time,
  status
) VALUES
  -- Bid 1: James O'Connor (outbid)
  (
    '381931ba-adac-4c5b-8c95-204ab353aa13',
    'James O''Connor',
    'james.oconnor@email.com',
    '+1-555-0301',
    3250.00,
    3250.00,
    3500.00,
    now() - interval '6 hours',
    'outbid'
  ),
  -- Bid 2: Sophia Anderson (outbid)
  (
    '381931ba-adac-4c5b-8c95-204ab353aa13',
    'Sophia Anderson',
    'sophia.anderson@email.com',
    '+1-555-0302',
    3300.00,
    3300.00,
    3800.00,
    now() - interval '4 hours 30 minutes',
    'outbid'
  ),
  -- Bid 3: Alex Thompson (outbid)
  (
    '381931ba-adac-4c5b-8c95-204ab353aa13',
    'Alex Thompson',
    'alex.thompson@email.com',
    '+1-555-0303',
    3500.00,
    3500.00,
    4200.00,
    now() - interval '2 hours 45 minutes',
    'outbid'
  ),
  -- Bid 4: Rachel Green (accepted - currently winning)
  (
    '381931ba-adac-4c5b-8c95-204ab353aa13',
    'Rachel Green',
    'rachel.green@email.com',
    '+1-555-0304',
    3650.00,
    3650.00,
    5000.00,
    now() - interval '1 hour 15 minutes',
    'accepted'
  );

-- Update auction current_bid amounts to match the leading bids
UPDATE public.auctions SET current_bid = 2600.00 WHERE id = 'e33cb053-f6d5-4c89-be05-d3ebe4ba2c60';
UPDATE public.auctions SET current_bid = 1900.00 WHERE id = '0457412e-269c-4f1e-a893-0cbf6c4f6623';
UPDATE public.auctions SET current_bid = 3650.00 WHERE id = '381931ba-adac-4c5b-8c95-204ab353aa13';