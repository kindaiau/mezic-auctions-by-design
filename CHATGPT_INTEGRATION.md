# ChatGPT Integration Guide

## Overview

This repository now includes an AI-powered chat assistant using OpenAI's GPT-4o-mini model. The assistant helps users with:

- Understanding the auction process and bidding system
- Getting information about artworks
- Learning about the artist Mariana Mezic and her social media-based auction approach
- General inquiries about contemporary art collecting

## Architecture

The integration consists of three main components:

1. **Supabase Edge Function** (`supabase/functions/chat-assistant/index.ts`): Handles secure API calls to OpenAI
2. **Chat UI Component** (`src/components/ChatAssistant.tsx`): Provides the user interface for the chat
3. **Chat Button**: A floating button that opens the chat assistant

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again)

### 2. Configure the API Key

You need to set the `OPENAI_API_KEY` as a Supabase Edge Function secret:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref ccwbdarlfwmqbeftppzk

# Set the OpenAI API key secret
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

Alternatively, you can set it in the Supabase dashboard:
1. Go to your Supabase project dashboard
2. Navigate to Edge Functions
3. Click on "Manage secrets"
4. Add `OPENAI_API_KEY` with your OpenAI API key

### 3. Deploy the Edge Function

Deploy the chat-assistant function to Supabase:

```bash
supabase functions deploy chat-assistant
```

### 4. Test the Integration

1. Start the development server: `npm run dev`
2. Click the floating chat button (bottom-right corner)
3. Ask a question like "How does the bidding system work?"

## Features

### Rate Limiting
- Maximum 20 messages per IP address per minute
- Prevents abuse and controls API costs

### Security
- API key is never exposed to the client
- All requests go through Supabase Edge Function
- Input validation using Zod schema
- PII sanitization in logs

### Context Awareness
- Can provide context about specific auctions
- Maintains conversation history
- Understands the Mezic Auctions platform specifics

### User Experience
- Clean, modern chat interface
- Real-time message streaming
- Auto-scroll to latest messages
- Loading states and error handling
- Mobile-responsive design

## Customization

### Change the AI Model

Edit `supabase/functions/chat-assistant/index.ts`:

```typescript
// Change from gpt-4o-mini to another model
body: JSON.stringify({
  model: 'gpt-4', // or 'gpt-3.5-turbo', 'gpt-4-turbo', etc.
  messages: messages,
  max_tokens: 500,
  temperature: 0.7,
}),
```

### Modify the System Prompt

Edit the `systemMessage` variable in `supabase/functions/chat-assistant/index.ts` to change how the AI assistant behaves.

### Adjust Rate Limits

Modify the `checkRateLimit` function in `supabase/functions/chat-assistant/index.ts`:

```typescript
if (limit.count >= 20) { // Change this number
  return false;
}
```

### Style the Chat UI

Edit `src/components/ChatAssistant.tsx` to customize:
- Colors and styling
- Message bubble appearance
- Button position and style
- Dialog size and layout

## Cost Management

GPT-4o-mini is cost-effective:
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens

To monitor usage:
1. Check OpenAI dashboard for API usage
2. Set usage limits in OpenAI account settings
3. Monitor Supabase Edge Function logs

## Troubleshooting

### Chat button doesn't appear
- Check browser console for errors
- Verify the component is imported in `src/pages/Index.tsx`

### "Service configuration error"
- Ensure `OPENAI_API_KEY` is set in Supabase secrets
- Redeploy the edge function after setting secrets

### Rate limit errors
- Wait 60 seconds before trying again
- Adjust rate limits if needed for your use case

### API errors
- Check OpenAI API key is valid and has credits
- Verify API key has correct permissions
- Check OpenAI service status

## Future Enhancements

Potential improvements:
- [ ] Add image analysis for artwork descriptions using GPT-4 Vision
- [ ] Implement conversation persistence (save chat history)
- [ ] Add voice input/output capabilities
- [ ] Create specialized art knowledge base with RAG
- [ ] Add multilingual support
- [ ] Implement user feedback system
- [ ] Add auction recommendations based on user preferences

## Support

For issues or questions:
1. Check the Supabase Edge Function logs
2. Review OpenAI API documentation
3. Check this repository's issues page
