-- Add extended metadata to auctions
ALTER TABLE public.auctions
  ADD COLUMN IF NOT EXISTS medium TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS reserve_status TEXT DEFAULT 'not_met' CHECK (reserve_status IN ('met', 'not_met', 'no_reserve')),
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS condition_report_available BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS provenance JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS bidding_history JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Ensure updated_at maintains accuracy when metadata changes
DROP TRIGGER IF EXISTS update_auctions_updated_at ON public.auctions;

CREATE TRIGGER update_auctions_updated_at
BEFORE UPDATE ON public.auctions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
