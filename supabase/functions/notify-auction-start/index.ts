import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from 'npm:resend@2.0.0';
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { AuctionStart } from '../_shared/email-templates/auction-start.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")?.trim();
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")?.trim();
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER")?.trim();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  auctionId: string;
}

async function sendSMS(to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn('Twilio credentials not configured, skipping SMS');
    return;
  }

  // Normalize phone number to international format
  let normalizedPhone = to.trim();
  if (!normalizedPhone.startsWith('+')) {
    // Assume Australian number if no country code
    normalizedPhone = `+61${normalizedPhone.replace(/^0/, '')}`;
  }

  console.log(`Sending SMS to: ${normalizedPhone.slice(0, 5)}***`);

  const authHeader = 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: normalizedPhone,
        From: TWILIO_PHONE_NUMBER,
        Body: body,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Twilio SMS error: ${errorText}`);
    throw new Error(`Twilio SMS failed: ${errorText}`);
  }

  console.log(`SMS sent successfully to: ${normalizedPhone.slice(0, 5)}***`);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { auctionId }: NotificationRequest = await req.json();

    if (!auctionId) {
      throw new Error('Auction ID is required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auction details
    const { data: auction, error: auctionError } = await supabaseClient
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      throw new Error('Auction not found');
    }

    // Get all subscribers with phone numbers
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from('email_subscribers')
      .select('name, email, phone')
      .not('phone', 'is', null);

    if (subscribersError) {
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }

    console.log(`Notifying ${subscribers?.length || 0} subscribers about new auction: ${auction.title}`);

    // Send SMS to all subscribers with phone numbers
    const smsPromises = (subscribers || []).map(async (subscriber) => {
      try {
        const message = `🎨 New Auction Live!\n\n"${auction.title}" by ${auction.artist}\n\nStarting bid: $${auction.starting_bid}\nEnds: ${new Date(auction.end_time).toLocaleDateString()}\n\nPlace your bid now!`;
        
        await sendSMS(subscriber.phone, message);
        
        console.log(`[INFO] Notification sent to subscriber`, {
          subscriberEmail: undefined,
          subscriberPhone: undefined,
        });
      } catch (error: any) {
        console.error(`[ERROR] Failed to send SMS to subscriber`, {
          error: error.message,
          subscriberEmail: undefined,
          subscriberPhone: undefined,
        });
      }
    });

    await Promise.all(smsPromises);

    // Send email notifications to subscribers with email addresses
    const emailPromises = (subscribers || [])
      .filter(sub => sub.email)
      .map(async (subscriber) => {
        try {
          const html = await renderAsync(
            React.createElement(AuctionStart, {
              auctionTitle: auction.title,
              artist: auction.artist,
              startingBid: Number(auction.starting_bid),
              endDate: new Date(auction.end_time).toLocaleDateString()
            })
          );
          
          await resend.emails.send({
            from: 'MEZ Auctions <auctions@mezauctions.com>',
            to: [subscriber.email],
            subject: `🎨 New Auction: ${auction.title}`,
            html
          });
          
          console.log(`[INFO] Auction start email sent to subscriber`);
        } catch (error: any) {
          console.error(`[ERROR] Failed to send auction start email`, {
            error: error.message
          });
        }
      });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({
        success: true,
        notificationsSent: subscribers?.length || 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[ERROR] Notification function failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});