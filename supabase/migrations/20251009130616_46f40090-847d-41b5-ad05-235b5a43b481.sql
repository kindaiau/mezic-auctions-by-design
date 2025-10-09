-- Clean up database: Remove all non-auction related tables and functions
-- This migration removes water business, financial, and job management systems
-- Keeping only: auctions, bids, email_subscribers, profiles, user_roles, audit_logs, contact_submissions

-- Drop tables in correct order (considering dependencies)

-- Drop water business tables
DROP TABLE IF EXISTS public.water_bookings CASCADE;
DROP TABLE IF EXISTS public.water_quotes CASCADE;
DROP TABLE IF EXISTS public.booking_approvals CASCADE;

-- Drop financial tables
DROP TABLE IF EXISTS public.spend_summary CASCADE;
DROP TABLE IF EXISTS public.cash_flow_forecast CASCADE;
DROP TABLE IF EXISTS public.cash_flow_analysis CASCADE;
DROP TABLE IF EXISTS public.invoice_line_items CASCADE;
DROP TABLE IF EXISTS public.invoice_processing_log CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.bank_transactions CASCADE;

-- Drop job management tables
DROP TABLE IF EXISTS public.servicem8_jobs CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;

-- Drop integration tables
DROP TABLE IF EXISTS public.google_sheets_connections CASCADE;

-- Drop materialized views related to jobs/financial
DROP MATERIALIZED VIEW IF EXISTS public.job_cost_summary CASCADE;

-- Drop functions only used by removed tables
DROP FUNCTION IF EXISTS public.update_spend_summary() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_refresh_job_cost_summary() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_job_cost_summary() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_water() CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;

-- Keep these core functions for auction system:
-- - update_updated_at_column() - used by auctions and other tables
-- - verify_admin_with_audit() - security function
-- - has_role(), is_admin(), get_current_user_role(), is_current_user_admin() - auth functions
-- - handle_new_user() - user profile creation
-- - detect_suspicious_access(), notify_suspicious_access() - security functions
-- - encrypt_customer_data() - security function

-- Update audit_logs table comment to reflect auction-specific use
COMMENT ON TABLE public.audit_logs IS 'Security audit trail for auction system admin actions';

-- Update contact_submissions table comment
COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions for art auction inquiries';