-- Create auction_submissions table
CREATE TABLE public.auction_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT,
  starting_bid NUMERIC NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.auction_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit (INSERT)
CREATE POLICY "Anyone can submit auctions"
ON public.auction_submissions
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can view submissions
CREATE POLICY "Admins can view all submissions"
ON public.auction_submissions
FOR SELECT
USING (is_current_user_admin());

-- Policy: Only admins can update submissions
CREATE POLICY "Admins can update submissions"
ON public.auction_submissions
FOR UPDATE
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Policy: Only admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.auction_submissions
FOR DELETE
USING (is_current_user_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_auction_submissions_updated_at
BEFORE UPDATE ON public.auction_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();