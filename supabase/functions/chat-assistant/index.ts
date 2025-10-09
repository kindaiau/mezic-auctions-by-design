import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const ChatRequestSchema = z.object({
  message: z.string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message is too long (max 1000 characters)" }),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().default([]),
  context: z.object({
    auctionId: z.string().optional(),
    auctionTitle: z.string().optional(),
    currentBid: z.number().optional(),
  }).optional(),
});

type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting: max 20 messages per IP per minute
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }
  
  if (limit.count >= 20) {
    return false;
  }
  
  limit.count++;
  return true;
}

// Secure logging - sanitize PII
function logSecure(level: 'info' | 'error', message: string, data?: Record<string, unknown>) {
  const sanitized = data ? {
    ...data,
    message: data.message ? '***' : undefined,
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
        JSON.stringify({ error: 'Too many requests. Please wait a minute and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      logSecure('error', 'OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = ChatRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      logSecure('error', 'Validation failed', { errors });
      return new Response(
        JSON.stringify({ error: `Validation error: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationHistory, context } = validationResult.data;

    // Build system message with context
    let systemMessage = `You are an AI assistant for Mezic Auctions, a contemporary art auction platform created by artist Mariana Mezic. 

Your role is to:
1. Help users understand the auction process and bidding system
2. Provide information about artworks when available
3. Answer questions about the artist and her unique social media-based auction approach
4. Assist with general inquiries about contemporary art collecting

Key information:
- Mariana Mezic is an Adelaide-based contemporary artist
- She conducts live auctions through social media platforms
- The platform uses a proxy bidding system similar to The Auction Collective
- Users can set maximum bids, and the system automatically increments by $1
- All auctions are for contemporary artworks

Be helpful, professional, and enthusiastic about art. Keep responses concise and engaging.`;

    if (context?.auctionTitle) {
      systemMessage += `\n\nCurrent auction context: "${context.auctionTitle}"`;
      if (context.currentBid) {
        systemMessage += ` (Current bid: $${context.currentBid})`;
      }
    }

    // Build messages array for OpenAI
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using GPT-4o-mini as it's cost-effective and powerful
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      logSecure('error', 'OpenAI API error', { status: openaiResponse.status });
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const assistantMessage = openaiData.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    const duration = Date.now() - startTime;
    logSecure('info', 'Chat completed', { duration });

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        model: 'gpt-4o-mini',
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    logSecure('error', 'Error processing chat', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration 
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process your message. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
