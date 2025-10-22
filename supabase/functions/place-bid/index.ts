import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { BidConfirmation } from '../_shared/email-templates/bid-confirmation.tsx';
import { OutbidNotification } from '../_shared/email-templates/outbid-notification.tsx';
import { AdminBidNotification } from '../_shared/email-templates/admin-bid-notification.tsx';

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")?.trim();
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")?.trim();
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER")?.trim();
const ADMIN_NOTIFICATION_PHONE = "+61422331992"; // Mariana's phone (international format)
const ADMIN_EMAIL = "mariana@getgas.net.au"; // Mariana's email

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
function logSecure(level: 'info' | 'error', message: string, data?: Record<string, unknown>) {
  const bidderEmail = typeof data?.bidderEmail === 'string' ? data.bidderEmail : undefined;
  const bidderPhone = typeof data?.bidderPhone === 'string' ? data.bidderPhone : undefined;
  const sanitized = data ? {
    ...data,
    bidderEmail: bidderEmail ? `***@${bidderEmail.split('@')[1] ?? ''}` : undefined,
    bidderPhone: bidderPhone ? `***${bidderPhone.slice(-4)}` : undefined,
  } : {};
  
  console[level](`[${level.toUpperCase()}] ${message}`, sanitized);
}

// Send SMS notification via Twilio
async function sendSMS(to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn('Twilio credentials not configured, skipping SMS');
    return;
  }

  // Basic sanity checks for Twilio Account SID format
  if (!/^AC[0-9a-zA-Z]{32}$/.test(TWILIO_ACCOUNT_SID!)) {
    console.warn('Twilio Account SID format looks incorrect (should start with AC and be 34 chars).');
  }

  // Normalize phone number to international format
  let normalizedPhone = to.trim();
  
  // If Australian number starting with 0, convert to +61
  if (normalizedPhone.startsWith('0') && normalizedPhone.length === 10) {
    normalizedPhone = '+61' + normalizedPhone.substring(1);
  }
  // If it doesn't start with +, assume it needs one
  else if (!normalizedPhone.startsWith('+')) {
    normalizedPhone = '+' + normalizedPhone;
  }

  console.log('Sending SMS to:', normalizedPhone.substring(0, 5) + '***');

  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  const formData = new URLSearchParams();
  formData.append('To', normalizedPhone);
  formData.append('From', TWILIO_PHONE_NUMBER);
  formData.append('Body', body);

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Twilio SMS error - Full response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      to: normalizedPhone.substring(0, 5) + '***',
      from: TWILIO_PHONE_NUMBER
    });
    throw new Error(`Twilio SMS failed (${response.status}): ${errorText}`);
  }

  const responseData = await response.json();
  console.log('SMS sent successfully:', {
    to: normalizedPhone.substring(0, 5) + '***',
    sid: responseData.sid,
    status: responseData.status,
    from: TWILIO_PHONE_NUMBER
  });
}

serve(async (req) => {
  console.log('🔵 place-bid function invoked', { 
    method: req.method, 
    timestamp: new Date().toISOString(),
    url: req.url 
  });

  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled');
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log('🔍 Checking rate limit for IP:', clientIP);
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log('❌ Rate limit exceeded for IP:', clientIP);
      logSecure('error', 'Rate limit exceeded', { ip: clientIP });
      return new Response(
        JSON.stringify({ error: 'Too many bid attempts. Please wait a minute and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ Rate limit check passed');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📥 Parsing request body...');
    // Parse and validate input
    const rawBody = await req.json();
    console.log('📦 Request body received:', { 
      hasAuctionId: !!rawBody.auctionId,
      hasBidderName: !!rawBody.bidderName,
      hasBidAmount: !!rawBody.bidAmount 
    });
    const validationResult = BidRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      console.log('❌ Validation failed:', errors);
      logSecure('error', 'Validation failed', { errors });
      return new Response(
        JSON.stringify({ error: `Validation error: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ Validation passed');

    const {
      auctionId,
      bidderName,
      bidderEmail,
      bidderPhone,
      bidAmount,
      maximumBid
    }: BidRequest = validationResult.data;

    logSecure('info', 'Processing bid', { auctionId, bidAmount });
    console.log('🔍 Fetching auction data for:', auctionId);

    // Get auction data with optimistic locking (using current_bid for version control)
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      console.log('❌ Auction not found:', auctionId, auctionError);
      logSecure('error', 'Auction not found', { auctionId });
      throw new Error('Auction not found');
    }
    
    console.log('✅ Auction found:', { title: auction.title, status: auction.status, currentBid: auction.current_bid });

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

    console.log('💾 Inserting new bid into database...');
    
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
      console.log('❌ Failed to insert bid:', bidError.message);
      logSecure('error', 'Failed to insert bid', { error: bidError.message });
      throw bidError;
    }
    
    console.log('✅ Bid inserted successfully:', newBid.id);

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

        // Send SMS if phone number available
        if (previousBidder.bidder_phone) {
          try {
            await sendSMS(
              previousBidder.bidder_phone,
              `MEZ Auctions: You've been outbid on "${auction.title}". New bid: $${resultingBidAmount}. Place a new bid to stay in the running!`
            );
            logSecure('info', 'Outbid SMS sent', { previousBidderId: previousBidder.id });
          } catch (smsError: unknown) {
            const smsMessage = smsError instanceof Error ? smsError.message : 'Unknown SMS error';
            logSecure('error', 'Failed to send outbid SMS', { error: smsMessage });
          }
        }

        await supabase.from('bid_notifications').insert({
          bid_id: previousBidder.id,
          notification_type: 'outbid'
        });
        
        logSecure('info', 'Outbid notification sent', { previousBidderId: previousBidder.id });
      } catch (emailError: unknown) {
        const message = emailError instanceof Error ? emailError.message : 'Unknown email error';
        logSecure('error', 'Failed to send outbid email', { error: message });
      }
    }

    // Send confirmation email to new bidder (async, non-blocking)
    try {
      const html = await renderAsync(
        React.createElement(BidConfirmation, {
          bidderName,
          auctionTitle: auction.title,
          artist: auction.artist,
          bidAmount,
          maxBid: proxyCeiling,
          currentBid: resultingBidAmount,
          isLeading: currentLeaderStatus === 'leading',
          endTime: endTime.toLocaleString()
        })
      );

      await resend.emails.send({
        from: 'MEZ Auctions <auctions@mezauctions.com>',
        to: [bidderEmail],
        subject: `${currentLeaderStatus === 'leading' ? 'Bid confirmation' : 'Bid received'} for "${auction.title}"`,
        html,
      });

      // Send SMS confirmation if phone number provided
      if (bidderPhone) {
        try {
          await sendSMS(
            bidderPhone,
            `MEZ Auctions: Bid confirmed for "${auction.title}". ${currentLeaderStatus === 'leading' ? `You're leading at $${resultingBidAmount}!` : `Current bid: $${updatedCurrentBid}`}`
          );
          logSecure('info', 'Confirmation SMS sent', { bidId: newBid.id });
        } catch (smsError: unknown) {
          const smsMessage = smsError instanceof Error ? smsError.message : 'Unknown SMS error';
          logSecure('error', 'Failed to send confirmation SMS', { error: smsMessage });
        }
      }

      await supabase.from('bid_notifications').insert({
        bid_id: newBid.id,
        notification_type: 'bid_confirmation'
      });

      logSecure('info', 'Confirmation email sent', { bidId: newBid.id });
    } catch (emailError: unknown) {
      const message = emailError instanceof Error ? emailError.message : 'Unknown email error';
      logSecure('error', 'Failed to send confirmation email', { error: message });
    }

    // Send admin notification SMS (async, non-blocking)
    try {
      await sendSMS(
        ADMIN_NOTIFICATION_PHONE,
        `MEZ Auctions: New bid by ${bidderName} on "${auction.title}" - $${resultingBidAmount} (${currentLeaderStatus})`
      );
      logSecure('info', 'Admin notification SMS sent', { bidId: newBid.id });
    } catch (adminSmsError: unknown) {
      const adminSmsMessage = adminSmsError instanceof Error ? adminSmsError.message : 'Unknown SMS error';
      logSecure('error', 'Failed to send admin notification SMS', { error: adminSmsMessage });
    }

    // Send admin notification email (async, non-blocking)
    try {
      const adminEmailHtml = await renderAsync(
        React.createElement(AdminBidNotification, {
          auctionTitle: auction.title,
          artistName: auction.artist_name,
          bidderName,
          bidderEmail,
          bidderPhone: bidderPhone || undefined,
          bidAmount: resultingBidAmount,
          maximumBid: maximumBidAmount,
          status: currentLeaderStatus,
          timestamp: new Date().toLocaleString('en-AU', { 
            timeZone: 'Australia/Sydney',
            dateStyle: 'full',
            timeStyle: 'long'
          }),
        })
      );

      await resend.emails.send({
        from: "MEZ Auctions <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `🎨 New Bid: ${bidderName} - ${auction.title}`,
        html: adminEmailHtml,
      });

      logSecure('info', 'Admin notification email sent', { bidId: newBid.id });
    } catch (adminEmailError: unknown) {
      const adminEmailMessage = adminEmailError instanceof Error ? adminEmailError.message : 'Unknown email error';
      logSecure('error', 'Failed to send admin notification email', { error: adminEmailMessage });
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

  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : 'An error occurred processing your bid';
    logSecure('error', 'Error processing bid', { error: message, duration });

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
