-- =====================================================
-- Phase 1: Critical Data Exposure Fixes
-- =====================================================

-- =====================================================
-- Fix 1: Lock Down Email Subscribers Table
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "System can manage subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_subscribers;
DROP POLICY IF EXISTS "Admins view subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Admins update subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Admins delete subscribers" ON public.email_subscribers;

-- Create granular policies
CREATE POLICY "Anyone can subscribe" 
  ON public.email_subscribers 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins view subscribers" 
  ON public.email_subscribers 
  FOR SELECT 
  USING (is_current_user_admin());

CREATE POLICY "Admins update subscribers" 
  ON public.email_subscribers 
  FOR UPDATE 
  USING (is_current_user_admin())
  WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins delete subscribers" 
  ON public.email_subscribers 
  FOR DELETE 
  USING (is_current_user_admin());

-- =====================================================
-- Fix 2: Lock Down Contact Submissions
-- =====================================================

-- Drop existing anonymous deny policy if it exists
DROP POLICY IF EXISTS "Anonymous cannot view contact submissions" ON public.contact_submissions;

-- Add explicit deny policy for anonymous users
CREATE POLICY "Anonymous cannot view contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (false);

-- =====================================================
-- Fix 3: Restrict Bidder Data Access
-- =====================================================

-- Drop the problematic email-based policies
DROP POLICY IF EXISTS "Bidders can view only their own bids" ON public.bids;
DROP POLICY IF EXISTS "Anonymous users cannot view bids" ON public.bids;
DROP POLICY IF EXISTS "Only admins view all bid details" ON public.bids;

-- Create a sanitized view for public auction display
DROP VIEW IF EXISTS public.auction_bid_counts;
CREATE VIEW public.auction_bid_counts AS
SELECT 
  auction_id,
  COUNT(*) as bid_count,
  MAX(bid_amount) as current_high_bid
FROM public.bids
WHERE status IN ('accepted', 'leading')
GROUP BY auction_id;

-- Grant access to the view
GRANT SELECT ON public.auction_bid_counts TO anon, authenticated;

-- For authenticated bidders to see their own bids
CREATE OR REPLACE FUNCTION public.get_my_bids()
RETURNS TABLE (
  id uuid,
  auction_id uuid,
  bid_amount numeric,
  submitted_bid_amount numeric,
  bid_time timestamp with time zone,
  status text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT 
    id,
    auction_id,
    bid_amount,
    submitted_bid_amount,
    bid_time,
    status
  FROM public.bids
  WHERE bidder_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  -- Note: maximum_bid_amount and contact info intentionally excluded
$$;

-- Only admins can SELECT from bids table directly
CREATE POLICY "Only admins view all bid details" 
  ON public.bids 
  FOR SELECT 
  USING (is_current_user_admin());