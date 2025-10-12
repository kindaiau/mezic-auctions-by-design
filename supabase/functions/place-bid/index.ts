import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input validation schema
const BidRequestSchema = z.object({
  auctionId: z.string().uuid({ message: "Invalid auction ID format" }),
  bidderName: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  bidderEmail: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  bidderPhone: z.string()
    .trim()
    .max(20, { message: "Phone must be less than 20 characters" })
    .optional(),
  bidAmount: z.number()
    .positive({ message: "Bid amount must be positive" })
    .max(999999, { message: "Bid amount too large" })
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Bid amount can only have up to 2 decimal places"
    }),
  maximumBid: z
    .number()
    .positive({ message: "Maximum bid must be positive" })
    .max(999999, { message: "Maximum bid too large" })
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Maximum bid can only have up to 2 decimal places"
    })
    .optional()
});

type BidRequest = z.infer<typeof BidRequestSchema>;

// Rate limiting: max 5 bids per IP per minute
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }
  
  if (limit.count >= 5) {
    return false;
  }
  
  limit.count++;
  return true;
}

// Secure logging - sanitize PII
function logSecure(level: 'info' | 'error', message: string, data?: Record<string, any>) {
  const sanitized = data ? {
    ...data,
    bidderEmail: data.bidderEmail ? '***@' + data.bidderEmail.split('@')[1] : undefined,
    bidderPhone: data.bidderPhone ? '***' + data.bidderPhone.slice(-4) : undefined,
  } : {};
  
  console[level](`[${level.toUpperCase()}] ${message}`, sanitized);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      logSecure('error', 'Rate limit exceeded', { ip: clientIP });
      return new Response(
        JSON.stringify({ error: 'Too many bid attempts. Please wait a minute and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = BidRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      logSecure('error', 'Validation failed', { errors });
      return new Response(
        JSON.stringify({ error: `Validation error: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      auctionId,
      bidderName,
      bidderEmail,
      bidderPhone,
      bidAmount,
      maximumBid
    }: BidRequest = validationResult.data;

    logSecure('info', 'Processing bid', { auctionId, bidAmount });

    // Get auction data with optimistic locking (using current_bid for version control)
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      logSecure('error', 'Auction not found', { auctionId });
      throw new Error('Auction not found');
    }

    // Validate auction is still live
    if (auction.status !== 'live') {
      throw new Error('Auction is no longer active');
    }

    // Validate end time
    const endTime = new Date(auction.end_time);
    if (endTime < new Date()) {
      throw new Error('Auction has ended');
    }

    // Validate bid amount with minimum increment
    const bidIncrement = 1;
    const toCurrency = (value: number) => Number(value.toFixed(2));
    const minimumBid = toCurrency(Number(auction.current_bid) + bidIncrement);
    if (bidAmount < minimumBid) {
      throw new Error(`Bid must be at least $${minimumBid} (current bid + $${bidIncrement} minimum increment)`);
    }

    const proxyCeiling = maximumBid ?? bidAmount;

    if (proxyCeiling < bidAmount) {
      throw new Error('Maximum bid must be greater than or equal to your submitted bid.');
    }

    // Get previous highest bidder with locking
    const { data: previousBids } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('status', 'accepted')
      .order('maximum_bid_amount', { ascending: false })
      .order('bid_amount', { ascending: false })
      .limit(1);

    const previousHighest = previousBids && previousBids.length > 0 ? previousBids[0] : null;

    let resultingBidAmount = toCurrency(bidAmount);
    let currentLeaderStatus: 'leading' | 'outbid' = 'leading';
    let updatedCurrentBid = toCurrency(bidAmount);

    if (previousHighest) {
      const previousMax = Number(previousHighest.maximum_bid_amount ?? previousHighest.bid_amount);
      const previousBidAmount = Number(previousHighest.bid_amount);

      if (proxyCeiling > previousMax) {
        const minimumToWin = toCurrency(previousMax + bidIncrement);
        const proxyTarget = Math.min(proxyCeiling, minimumToWin);
        resultingBidAmount = toCurrency(Math.max(bidAmount, proxyTarget));
        updatedCurrentBid = resultingBidAmount;
      } else {
        currentLeaderStatus = 'outbid';
        const previousNewAmount = toCurrency(
          Math.max(previousBidAmount, Math.min(previousMax, toCurrency(proxyCeiling + bidIncrement)))
        );

        if (previousNewAmount > previousBidAmount) {
          const { error: prevUpdateError } = await supabase
            .from('bids')
            .update({ bid_amount: previousNewAmount })
            .eq('id', previousHighest.id);

          if (prevUpdateError) {
            logSecure('error', 'Failed to update previous highest bid', { error: prevUpdateError.message });
            throw new Error('Failed to update current highest bid. Please try again.');
          }

          updatedCurrentBid = previousNewAmount;
        } else {
          updatedCurrentBid = toCurrency(previousBidAmount);
        }
      }
    }

    resultingBidAmount = toCurrency(resultingBidAmount);
    updatedCurrentBid = toCurrency(updatedCurrentBid);

    // Insert new bid atomically
    const { data: newBid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        bidder_name: bidderName,
        bidder_email: bidderEmail,
        bidder_phone: bidderPhone || null,
        bid_amount: currentLeaderStatus === 'leading' ? resultingBidAmount : toCurrency(bidAmount),
        submitted_bid_amount: toCurrency(bidAmount),
        maximum_bid_amount: toCurrency(proxyCeiling),
        status: currentLeaderStatus === 'leading' ? 'accepted' : 'outbid'
      })
      .select()
      .single();

    if (bidError) {
      logSecure('error', 'Failed to insert bid', { error: bidError.message });
      throw bidError;
    }

    // Update auction current bid atomically
    const { error: updateError } = await supabase
      .from('auctions')
      .update({ current_bid: updatedCurrentBid })
      .eq('id', auctionId)
      .eq('current_bid', auction.current_bid); // Optimistic locking

    if (updateError) {
      logSecure('error', 'Failed to update auction', { error: updateError.message });
      // Rollback bid insertion
      await supabase.from('bids').delete().eq('id', newBid.id);
      throw new Error('Bid was placed by someone else. Please try again.');
    }

    // Mark previous bids as outbid when a new leader emerges
    if (currentLeaderStatus === 'leading' && previousHighest) {
      await supabase
        .from('bids')
        .update({ status: 'outbid' })
        .eq('id', previousHighest.id);

      // Send outbid notification (async, non-blocking)
      const previousBidder = previousHighest;
      try {
        await resend.emails.send({
          from: 'MEZ Auctions <auctions@resend.dev>',
          to: [previousBidder.bidder_email],
          subject: `You've been outbid on "${auction.title}"`,
          html: `
            <h2>You've been outbid!</h2>
            <p>Hi ${previousBidder.bidder_name},</p>
            <p>Someone has placed a higher bid on <strong>${auction.title}</strong> by ${auction.artist}.</p>
            <p><strong>New highest bid:</strong> $${resultingBidAmount}</p>
            <p><strong>Your bid was:</strong> $${previousBidder.bid_amount}</p>
            <p>Place a new bid to stay in the running!</p>
          `
        });

        await supabase.from('bid_notifications').insert({
          bid_id: previousBidder.id,
          notification_type: 'outbid'
        });
        
        logSecure('info', 'Outbid notification sent', { previousBidderId: previousBidder.id });
      } catch (emailError: any) {
        logSecure('error', 'Failed to send outbid email', { error: emailError.message });
      }
    }

    // Send confirmation email to new bidder (async, non-blocking)
    try {
      await resend.emails.send({
        from: 'MEZ Auctions <auctions@resend.dev>',
        to: [bidderEmail],
        subject: `${currentLeaderStatus === 'leading' ? 'Bid confirmation' : 'Bid received'} for "${auction.title}"`,
        html: `
          <h2>Bid Placed Successfully!</h2>
          <p>Hi ${bidderName},</p>
          <p>Your bid has been placed on <strong>${auction.title}</strong> by ${auction.artist}.</p>
          <p><strong>Your submitted bid:</strong> $${bidAmount}</p>
          <p><strong>Your maximum (proxy) bid:</strong> $${proxyCeiling}</p>
          <p>${currentLeaderStatus === 'leading'
            ? `You are currently leading at $${resultingBidAmount}. We'll automatically increase your bid in $${bidIncrement} increments if someone else bids, up to your maximum.`
            : `Another collector's proxy limit is currently higher, so you're outbid at $${updatedCurrentBid}. We'll keep your ceiling on file in case the standings change.`}</p>
          <p><strong>Auction ends:</strong> ${endTime.toLocaleString()}</p>
          <p>We'll notify you if you're outbid or if you win the auction.</p>
          <p>Good luck!</p>
        `
      });

      await supabase.from('bid_notifications').insert({
        bid_id: newBid.id,
        notification_type: 'bid_confirmation'
      });

      logSecure('info', 'Confirmation email sent', { bidId: newBid.id });
    } catch (emailError: any) {
      logSecure('error', 'Failed to send confirmation email', { error: emailError.message });
    }

    const duration = Date.now() - startTime;
    logSecure('info', 'Bid processed successfully', { bidId: newBid.id, duration, status: currentLeaderStatus });

    return new Response(
      JSON.stringify({
        success: true,
        status: currentLeaderStatus,
        bid: {
          id: newBid.id,
          amount: Number(newBid.bid_amount),
          submittedAmount: bidAmount,
          maximumAmount: proxyCeiling
        },
        currentBid: updatedCurrentBid
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logSecure('error', 'Error processing bid', { error: error.message, duration });
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred processing your bid' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
