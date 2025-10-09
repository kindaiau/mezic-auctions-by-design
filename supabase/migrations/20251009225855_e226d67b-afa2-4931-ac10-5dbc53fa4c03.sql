-- Fix critical security vulnerability: Bidder contact information exposure
-- Drop the vulnerable policy that allows bidders to see other bidders' data
DROP POLICY IF EXISTS "Bidders can view their own bids" ON public.bids;

-- Policy 1: Bidders can ONLY view their own bids (contact info protected)
-- This prevents competitors from harvesting contact information
CREATE POLICY "Bidders can view only their own bids"
ON public.bids
FOR SELECT
TO authenticated
USING (
  bidder_email = (auth.jwt()->>'email')::text
);

-- Policy 2: Admins can view all bids (for auction management)
CREATE POLICY "Admins can view all bids"
ON public.bids
FOR SELECT
TO authenticated
USING (
  is_current_user_admin()
);

-- Policy 3: Block anonymous users from viewing any bid details
-- Bid data is sensitive and should require authentication
CREATE POLICY "Anonymous users cannot view bids"
ON public.bids
FOR SELECT
TO anon
USING (false);

-- Add audit logging for admin access to bid data
COMMENT ON POLICY "Admins can view all bids" ON public.bids IS 
'Admins can view all bid details including contact information for auction management. Access should be audited.';

-- Note: The edge function "place-bid" uses service_role_key which bypasses RLS,
-- so it can still insert bids. Client-side queries are now properly restricted.