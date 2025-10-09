# Environment Variables Setup

This project requires the following environment variables to be set in your `.env` file:

## Required for Klaviyo Integration
```bash
VITE_KLAVIYO_API_KEY=your_klaviyo_api_key_here
VITE_KLAVIYO_LIST_ID=your_klaviyo_list_id_here
```

## Required for Supabase (already configured)
```bash
VITE_SUPABASE_URL=https://ccwbdarlfwmqbeftppzk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=ccwbdarlfwmqbeftppzk
```

## How to get Klaviyo credentials:

1. **KLAVIYO_API_KEY**: 
   - Go to your Klaviyo dashboard
   - Navigate to Account > Settings > API Keys
   - Create or copy your Private API Key

2. **KLAVIYO_LIST_ID**:
   - Go to Audience > Lists & Segments
   - Find your target list and copy the List ID from the URL or list details

## Notes:
- The Klaviyo integration will gracefully handle missing credentials and show an appropriate error message
- Phone numbers must be in E.164 format (e.g., +614XXXXXXXX)
- Email validation is performed client-side before submission
- Both email and phone are optional, but at least one must be provided