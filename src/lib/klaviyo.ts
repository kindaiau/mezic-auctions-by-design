type Payload = {
  email?: string;
  phone?: string;
};

const isLikelyE164 = (phone: string | undefined) => {
  if (!phone) return false;
  return /^\+[1-9]\d{7,14}$/.test(phone.replace(/\s+/g, ''));
};

export const subscribeToKlaviyo = async ({ email, phone }: Payload) => {
  if (!email && !phone) {
    throw new Error('Email or phone required');
  }

  if (email && typeof email !== 'string') {
    throw new Error('Invalid email');
  }

  if (phone && typeof phone !== 'string') {
    throw new Error('Invalid phone');
  }

  if (phone && !isLikelyE164(phone)) {
    throw new Error('Phone must be in E.164 format (e.g. +614XXXXXXXX)');
  }

  const KLAVIYO_API_KEY = import.meta.env.VITE_KLAVIYO_API_KEY;
  const KLAVIYO_LIST_ID = import.meta.env.VITE_KLAVIYO_LIST_ID;

  if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
    console.error('Missing Klaviyo environment variables');
    throw new Error('Klaviyo not configured. Please contact support.');
  }

  const profiles: Record<string, string>[] = [];
  if (email) profiles.push({ email });
  if (phone) profiles.push({ phone_number: phone });

  try {
    const url = `https://a.klaviyo.com/api/v2/list/${encodeURIComponent(KLAVIYO_LIST_ID)}/subscribe`;

    const body = {
      api_key: KLAVIYO_API_KEY,
      profiles,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Klaviyo error', response.status, json);
      throw new Error(json?.message || 'Subscription failed. Please try again.');
    }

    return { success: true, klaviyo: json };
  } catch (err) {
    console.error('Subscribe error', err);
    throw new Error(err instanceof Error ? err.message : 'Subscription failed');
  }
};