-- Drop the security definer view as it bypasses RLS policies
-- This is a security risk that allows unauthorized access
DROP VIEW IF EXISTS public.water_quotes_secure;

-- The water_quotes table already has proper RLS policies:
-- - Public can INSERT (submit quotes)  
-- - Only admins can SELECT/UPDATE/DELETE with audit logging
-- These policies provide the correct security without needing a SECURITY DEFINER view

-- If data masking is needed, it should be done in the application layer
-- or through secure functions, not through SECURITY DEFINER views