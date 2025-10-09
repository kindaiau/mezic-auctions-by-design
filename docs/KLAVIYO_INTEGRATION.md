# Klaviyo Integration Guide (Optional)

This guide explains how to add Klaviyo marketing automation alongside the existing Resend transactional emails.

## Prerequisites

1. Create a Klaviyo account at https://www.klaviyo.com
2. Get your Klaviyo Private API Key from Account > Settings > API Keys
3. Add the API key to your Supabase secrets

## Architecture

```
User Action → Supabase → Resend (immediate transactional email)
                      ↓
                   Klaviyo (add to marketing lists/segments)
```

## Step 1: Add Klaviyo Environment Variable

Add to your Supabase project secrets:
```
KLAVIYO_PRIVATE_KEY=pk_xxxxxxxxxxxxxxxxxxxxx
```

## Step 2: Create Klaviyo Sync Function

Create a new file: `supabase/functions/sync-to-klaviyo/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KLAVIYO_API_KEY = Deno.env.get("KLAVIYO_PRIVATE_KEY");
const KLAVIYO_API_URL = "https://a.klaviyo.com/api";

interface KlaviyoProfile {
  email: string;
  phone?: string;
  properties?: Record<string, any>;
}

async function syncToKlaviyo(profile: KlaviyoProfile) {
  const response = await fetch(`${KLAVIYO_API_URL}/profiles/`, {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15'
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: {
          email: profile.email,
          phone_number: profile.phone,
          properties: {
            source: 'mez_auctions',
            ...profile.properties
          }
        }
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Klaviyo API error: ${error}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, phone, properties } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await syncToKlaviyo({ email, phone, properties });

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error syncing to Klaviyo:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## Step 3: Update Subscribe Newsletter Function

Modify `supabase/functions/subscribe-newsletter/index.ts` to also sync to Klaviyo:

Add after the Resend email is sent (around line 138):

```typescript
    // Send welcome email (async, non-blocking)
    try {
      await resend.emails.send({
        from: 'MEZ Auctions <auctions@resend.dev>',
        to: [email],
        subject: 'Welcome to MEZ Auction Alerts!',
        html: `
          <h2>Thank you for subscribing!</h2>
          <p>You'll now receive alerts about new auctions and exclusive art pieces.</p>
          <p>Stay tuned for exciting updates!</p>
        `
      });
      
      logSecure('info', 'Welcome email sent', { subscriberId: data.id });
    } catch (emailError: any) {
      logSecure('error', 'Failed to send welcome email', { error: emailError.message });
    }

    // Sync to Klaviyo for marketing automation (async, non-blocking)
    try {
      const klaviyoResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/sync-to-klaviyo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          email,
          phone,
          properties: {
            subscription_date: new Date().toISOString(),
            source: 'website_newsletter_signup'
          }
        })
      });

      if (klaviyoResponse.ok) {
        logSecure('info', 'Synced to Klaviyo', { subscriberId: data.id });
      }
    } catch (klaviyoError: any) {
      logSecure('error', 'Failed to sync to Klaviyo', { error: klaviyoError.message });
      // Don't fail the whole request if Klaviyo sync fails
    }
```

## Step 4: Update Place Bid Function

Modify `supabase/functions/place-bid/index.ts` to track bidder activity in Klaviyo:

Add after the bid is successfully placed:

```typescript
    // Sync bidder to Klaviyo (async, non-blocking)
    try {
      const klaviyoResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/sync-to-klaviyo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          email: bidderEmail,
          phone: bidderPhone,
          properties: {
            last_bid_date: new Date().toISOString(),
            last_bid_amount: resultingBidAmount,
            last_auction: auction.title,
            total_bids: 1, // You can track this with a counter
            is_active_bidder: true
          }
        })
      });

      if (klaviyoResponse.ok) {
        logSecure('info', 'Bidder synced to Klaviyo');
      }
    } catch (klaviyoError: any) {
      logSecure('error', 'Failed to sync bidder to Klaviyo', { error: klaviyoError.message });
    }
```

## Step 5: Set Up Klaviyo Lists and Segments

In your Klaviyo dashboard:

1. **Create Lists**:
   - "Newsletter Subscribers"
   - "Active Bidders"
   - "All Contacts"

2. **Create Segments**:
   - "New Subscribers" (subscribed in last 7 days)
   - "High-Value Bidders" (total_bids > 5 or last_bid_amount > 500)
   - "Inactive Bidders" (last_bid_date > 30 days ago)
   - "Never Bid" (has email but no last_bid_date)

## Step 6: Create Email Campaigns

### Welcome Series (Drip Campaign)
1. **Email 1** (Day 0): Welcome email with platform overview
2. **Email 2** (Day 3): How auctions work on Instagram/Facebook
3. **Email 3** (Day 7): Current active auctions

### Weekly Newsletter
- Send every Monday at 10 AM
- Segment: All Subscribers
- Content: New auctions, featured artists, tips for collectors

### Re-engagement Campaign
- Trigger: last_bid_date > 30 days
- Send: Email highlighting current auctions

### Abandoned Auction Flow
- Trigger: User viewed auction but didn't bid
- Wait: 24 hours
- Send: Reminder email with auction details

## Step 7: Track Events (Optional Advanced)

For more sophisticated tracking, you can send custom events to Klaviyo:

```typescript
async function trackKlaviyoEvent(email: string, event: string, properties?: Record<string, any>) {
  const response = await fetch(`${KLAVIYO_API_URL}/events/`, {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15'
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          profile: { email },
          metric: { name: event },
          properties: properties || {},
          time: new Date().toISOString()
        }
      }
    })
  });

  return response.ok;
}

// Example usage:
await trackKlaviyoEvent(bidderEmail, 'Placed Bid', {
  auction_id: auctionId,
  auction_title: auction.title,
  bid_amount: resultingBidAmount,
  is_leading: currentLeaderStatus === 'leading'
});
```

## Benefits of This Integration

1. **Segmented Marketing**: Target different user groups with tailored messages
2. **Automated Workflows**: Set up drip campaigns and re-engagement emails
3. **Analytics**: Track email performance and user engagement
4. **Personalization**: Send personalized content based on bidding history
5. **A/B Testing**: Test different email strategies
6. **Lifecycle Marketing**: Guide users through their journey from subscriber to active bidder

## Cost Impact

- Klaviyo is free for up to 250 contacts
- After that, pricing scales with your list size
- Most small to medium auction platforms can start free and scale as they grow

## Best Practices

1. **Don't duplicate transactional emails**: Keep Resend for immediate transactional emails
2. **Use Klaviyo for campaigns**: Use Klaviyo for marketing newsletters and campaigns
3. **Segment your audience**: Create targeted campaigns for different user groups
4. **Test and iterate**: Use A/B testing to optimize your emails
5. **Monitor deliverability**: Keep an eye on open rates and bounce rates
6. **Comply with regulations**: Ensure GDPR/CAN-SPAM compliance in all communications

## Conclusion

This integration gives you the best of both worlds:
- **Resend**: Fast, reliable transactional emails
- **Klaviyo**: Powerful marketing automation and segmentation

The combination enables sophisticated customer engagement while maintaining reliable real-time notifications.
