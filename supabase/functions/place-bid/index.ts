import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface BidRequest {
  auctionId: string;
  bidderName: string;
  bidderEmail: string;
  bidderPhone?: string;
  bidAmount: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { auctionId, bidderName, bidderEmail, bidderPhone, bidAmount }: BidRequest = await req.json();

    console.log('Processing bid:', { auctionId, bidderName, bidAmount });

    // Get auction details
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      throw new Error('Auction not found');
    }

    // Validate auction is still live
    if (auction.status !== 'live') {
      throw new Error('Auction is no longer active');
    }

    // Validate end time
    if (new Date(auction.end_time) < new Date()) {
      throw new Error('Auction has ended');
    }

    // Validate bid amount
    if (bidAmount <= auction.current_bid) {
      throw new Error(`Bid must be higher than current bid of $${auction.current_bid}`);
    }

    // Get previous highest bidder
    const { data: previousBids } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('status', 'accepted')
      .order('bid_amount', { ascending: false })
      .limit(1);

    // Insert new bid
    const { data: newBid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        bidder_name: bidderName,
        bidder_email: bidderEmail,
        bidder_phone: bidderPhone,
        bid_amount: bidAmount,
        status: 'accepted'
      })
      .select()
      .single();

    if (bidError) {
      throw bidError;
    }

    // Update auction current bid
    const { error: updateError } = await supabase
      .from('auctions')
      .update({ current_bid: bidAmount })
      .eq('id', auctionId);

    if (updateError) {
      throw updateError;
    }

    // Mark previous bids as outbid
    if (previousBids && previousBids.length > 0) {
      await supabase
        .from('bids')
        .update({ status: 'outbid' })
        .eq('auction_id', auctionId)
        .eq('status', 'accepted')
        .neq('id', newBid.id);

      // Send outbid notification
      const previousBidder = previousBids[0];
      try {
        await resend.emails.send({
          from: 'MEZ Auctions <auctions@resend.dev>',
          to: [previousBidder.bidder_email],
          subject: `You've been outbid on "${auction.title}"`,
          html: `
            <h2>You've been outbid!</h2>
            <p>Hi ${previousBidder.bidder_name},</p>
            <p>Someone has placed a higher bid on <strong>${auction.title}</strong> by ${auction.artist}.</p>
            <p><strong>New highest bid:</strong> $${bidAmount}</p>
            <p><strong>Your bid was:</strong> $${previousBidder.bid_amount}</p>
            <p>Place a new bid to stay in the running!</p>
          `
        });

        await supabase.from('bid_notifications').insert({
          bid_id: previousBidder.id,
          notification_type: 'outbid'
        });
      } catch (emailError) {
        console.error('Failed to send outbid email:', emailError);
      }
    }

    // Send confirmation email to new bidder
    try {
      await resend.emails.send({
        from: 'MEZ Auctions <auctions@resend.dev>',
        to: [bidderEmail],
        subject: `Bid confirmation for "${auction.title}"`,
        html: `
          <h2>Bid Placed Successfully!</h2>
          <p>Hi ${bidderName},</p>
          <p>Your bid has been placed on <strong>${auction.title}</strong> by ${auction.artist}.</p>
          <p><strong>Your bid:</strong> $${bidAmount}</p>
          <p><strong>Auction ends:</strong> ${new Date(auction.end_time).toLocaleString()}</p>
          <p>We'll notify you if you're outbid or if you win the auction.</p>
          <p>Good luck!</p>
        `
      });

      await supabase.from('bid_notifications').insert({
        bid_id: newBid.id,
        notification_type: 'bid_confirmation'
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return new Response(
      JSON.stringify({ success: true, bid: newBid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error processing bid:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
