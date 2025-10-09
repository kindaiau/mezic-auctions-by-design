import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { email, phone } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Insert subscriber
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert({ email, phone })
      .select()
      .single();

    if (error) {
      // Check if already subscribed
      if (error.code === '23505') {
        throw new Error('This email is already subscribed');
      }
      throw error;
    }

    // Send welcome email
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
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return new Response(
      JSON.stringify({ success: true, subscriber: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error subscribing:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
