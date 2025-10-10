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
const SubscribeRequestSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string()
    .trim()
    .max(20, { message: "Phone must be less than 20 characters" })
    .optional()
});

type SubscribeRequest = z.infer<typeof SubscribeRequestSchema>;

// Rate limiting: max 3 subscriptions per IP per hour
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour
    return true;
  }
  
  if (limit.count >= 3) {
    return false;
  }
  
  limit.count++;
  return true;
}

// Secure logging - sanitize PII
function logSecure(level: 'info' | 'error', message: string, data?: Record<string, any>) {
  const sanitized = data ? {
    ...data,
    email: data.email ? '***@' + data.email.split('@')[1] : undefined,
    phone: data.phone ? '***' + data.phone.slice(-4) : undefined,
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
        JSON.stringify({ error: 'Too many subscription attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = SubscribeRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      logSecure('error', 'Validation failed', { errors });
      return new Response(
        JSON.stringify({ error: `Validation error: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, phone }: SubscribeRequest = validationResult.data;

    logSecure('info', 'Processing subscription');

    // Insert subscriber
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert({ 
        name,
        email, 
        phone: phone || null 
      })
      .select()
      .single();

    if (error) {
      // Check if already subscribed
      if (error.code === '23505') {
        logSecure('info', 'Email already subscribed');
        throw new Error('This email is already subscribed');
      }
      logSecure('error', 'Database error', { error: error.message });
      throw error;
    }

    // Send welcome email (async, non-blocking)
    try {
      await resend.emails.send({
        from: 'MEZ Auctions <auctions@resend.dev>',
        to: [email],
        subject: 'Welcome to MEZ Auction Alerts!',
        html: `
          <h2>Thank you for subscribing, ${name}!</h2>
          <p>You'll now receive alerts about new auctions and exclusive art pieces.</p>
          <p>Stay tuned for exciting updates!</p>
        `
      });
      
      logSecure('info', 'Welcome email sent', { subscriberId: data.id });
    } catch (emailError: any) {
      logSecure('error', 'Failed to send welcome email', { error: emailError.message });
    }

    const duration = Date.now() - startTime;
    logSecure('info', 'Subscription processed successfully', { duration });

    return new Response(
      JSON.stringify({ success: true, subscriber: { id: data.id } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logSecure('error', 'Error processing subscription', { error: error.message, duration });
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred processing your subscription' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
