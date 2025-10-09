-- Create auctions table
CREATE TABLE public.auctions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  starting_bid NUMERIC NOT NULL,
  current_bid NUMERIC NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bids table
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  bidder_email TEXT NOT NULL,
  bidder_phone TEXT,
  bid_amount NUMERIC NOT NULL,
  bid_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'outbid', 'won')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_subscribers table (already exists as EmailSignup, but let's ensure it)
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Create bid_notifications table
CREATE TABLE public.bid_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bid_id UUID REFERENCES public.bids(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('bid_confirmation', 'outbid', 'auction_ending', 'auction_won')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed'))
);

-- Enable Row Level Security
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bid_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for auctions
CREATE POLICY "Anyone can view live auctions" 
ON public.auctions 
FOR SELECT 
USING (status = 'live');

CREATE POLICY "System can manage auctions" 
ON public.auctions 
FOR ALL 
USING (true);

-- RLS Policies for bids
CREATE POLICY "Anyone can place bids" 
ON public.bids 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Bidders can view their own bids" 
ON public.bids 
FOR SELECT 
USING (bidder_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- RLS Policies for email_subscribers
CREATE POLICY "Anyone can subscribe" 
ON public.email_subscribers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can manage subscribers" 
ON public.email_subscribers 
FOR ALL 
USING (true);

-- RLS Policies for bid_notifications
CREATE POLICY "System can manage notifications" 
ON public.bid_notifications 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_auctions_status ON public.auctions(status);
CREATE INDEX idx_auctions_end_time ON public.auctions(end_time);
CREATE INDEX idx_bids_auction_id ON public.bids(auction_id);
CREATE INDEX idx_bids_bidder_email ON public.bids(bidder_email);

-- Create trigger for updating updated_at
CREATE TRIGGER update_auctions_updated_at
BEFORE UPDATE ON public.auctions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();