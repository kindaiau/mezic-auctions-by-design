import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WinnerNotification } from '../_shared/email-templates/winner-notification.tsx';

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")?.trim();
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")?.trim();
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER")?.trim();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Send SMS notification via Twilio
async function sendSMS(to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn('Twilio credentials not configured, skipping SMS');
    return;
  }

  // Normalize phone number to E.164 format
  let normalizedPhone = to.replace(/\D/g, '');
  
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '61' + normalizedPhone.substring(1);
  }
  
  if (!normalizedPhone.startsWith('+')) {
    normalizedPhone = '+' + normalizedPhone;
  }

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: normalizedPhone,
        From: TWILIO_PHONE_NUMBER!,
        Body: body,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Twilio SMS failed: ${response.status} - ${errorText}`);
    }

    console.log('SMS sent successfully to:', normalizedPhone.replace(/\d(?=\d{4})/g, '*'));
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { auctionId } = await req.json();

    if (!auctionId) {
      return new Response(
        JSON.stringify({ error: 'Auction ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auction details
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      return new Response(
        JSON.stringify({ error: 'Auction not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the winning bid (status = 'accepted')
    const { data: winningBid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('status', 'accepted')
      .single();

    if (bidError || !winningBid) {
      return new Response(
        JSON.stringify({ error: 'No winning bid found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const endTime = new Date(auction.end_time).toLocaleString('en-AU', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Australia/Sydney',
    });

    // Send winner email
    const emailHtml = await renderAsync(
      React.createElement(WinnerNotification, {
        bidderName: winningBid.bidder_name,
        auctionTitle: auction.title,
        artist: auction.artist,
        winningBid: Number(winningBid.bid_amount),
        endTime: endTime,
      })
    );

    const emailResult = await resend.emails.send({
      from: 'MEZ Auctions <auctions@mezauctions.com>',
      to: [winningBid.bidder_email],
      subject: `🎉 Congratulations! You won "${auction.title}"`,
      html: emailHtml,
    });

    console.log('Winner email sent:', emailResult);

    // Send winner SMS
    if (winningBid.bidder_phone) {
      const smsBody = `🎉 Congratulations ${winningBid.bidder_name}! You won "${auction.title}" by ${auction.artist} with your bid of $${Number(winningBid.bid_amount).toLocaleString()}. We'll contact you shortly with next steps. - MEZ Auctions`;
      
      await sendSMS(winningBid.bidder_phone, smsBody);
      console.log('Winner SMS sent');
    }

    // Update auction to mark winner as notified
    await supabase
      .from('auctions')
      .update({
        winner_notified: true,
        winner_notified_at: new Date().toISOString(),
      })
      .eq('id', auctionId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Winner notifications sent successfully',
        winner: {
          name: winningBid.bidder_name,
          email: winningBid.bidder_email,
          bid: Number(winningBid.bid_amount),
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in notify-winner function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
