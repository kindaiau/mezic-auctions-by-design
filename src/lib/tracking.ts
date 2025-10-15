// Metricool Advanced Tracking Utilities

declare global {
  interface Window {
    beTracker?: {
      t: (params: {
        hash: string;
        event?: string;
        data?: Record<string, unknown>;
      }) => void;
    };
  }
}

const METRICOOL_HASH = "8f88b5e1302a42186144b3c761b6dab5";

// Traffic source data stored in sessionStorage
interface TrafficSource {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  device_type?: string;
  timestamp?: number;
}

/**
 * Track a custom event with Metricool
 */
export function trackEvent(
  eventName: string,
  data?: Record<string, unknown>
): void {
  if (typeof window === 'undefined' || !window.beTracker) {
    console.warn('Metricool tracker not loaded');
    return;
  }

  try {
    window.beTracker.t({
      hash: METRICOOL_HASH,
      event: eventName,
      data: {
        ...data,
        timestamp: Date.now(),
      }
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Track event with traffic source context
 */
export function trackEventWithSource(
  eventName: string,
  data?: Record<string, unknown>
): void {
  const trafficSource = getTrafficSource();
  trackEvent(eventName, {
    ...data,
    ...trafficSource,
  });
}

/**
 * Capture UTM parameters from URL
 */
export function captureUTMParameters(): TrafficSource {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const trafficSource: TrafficSource = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
    referrer: document.referrer || undefined,
    landing_page: window.location.pathname,
    device_type: getDeviceType(),
    timestamp: Date.now(),
  };

  // Remove undefined values
  Object.keys(trafficSource).forEach(key => {
    if (trafficSource[key as keyof TrafficSource] === undefined) {
      delete trafficSource[key as keyof TrafficSource];
    }
  });

  return trafficSource;
}

/**
 * Store traffic source in sessionStorage
 */
export function storeTrafficSource(source: TrafficSource): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem('traffic_source', JSON.stringify(source));
  } catch (error) {
    console.error('Error storing traffic source:', error);
  }
}

/**
 * Get stored traffic source from sessionStorage
 */
export function getTrafficSource(): TrafficSource {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = sessionStorage.getItem('traffic_source');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error retrieving traffic source:', error);
    return {};
  }
}

/**
 * Detect device type
 */
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Initialize tracking on page load
 */
export function initializeTracking(): void {
  if (typeof window === 'undefined') return;

  // Capture and store UTM parameters
  const source = captureUTMParameters();
  if (Object.keys(source).length > 0) {
    storeTrafficSource(source);
  }

  // Track initial page view with traffic source
  trackEventWithSource('page_view', {
    page: window.location.pathname,
  });
}

// Event tracking helpers for specific actions

export const trackAuctionView = (auctionId: string, auctionTitle: string) => {
  trackEventWithSource('auction_view', {
    category: 'auction',
    action: 'view',
    auction_id: auctionId,
    auction_title: auctionTitle,
  });
};

export const trackAuctionClick = (auctionId: string, auctionTitle: string) => {
  trackEventWithSource('auction_click', {
    category: 'auction',
    action: 'click',
    auction_id: auctionId,
    auction_title: auctionTitle,
  });
};

export const trackBidModalOpen = (auctionId: string, auctionTitle: string, currentBid: number) => {
  trackEventWithSource('bid_modal_open', {
    category: 'bid',
    action: 'modal_open',
    auction_id: auctionId,
    auction_title: auctionTitle,
    current_bid: currentBid,
  });
};

export const trackBidSubmit = (auctionId: string, bidAmountRange: string) => {
  trackEventWithSource('bid_submit', {
    category: 'bid',
    action: 'submit',
    auction_id: auctionId,
    bid_range: bidAmountRange, // e.g., "1000-2000"
  });
};

export const trackBidSuccess = (auctionId: string, bidAmountRange: string) => {
  trackEventWithSource('bid_success', {
    category: 'bid',
    action: 'success',
    auction_id: auctionId,
    bid_range: bidAmountRange,
  });
};

export const trackBidFail = (auctionId: string, errorMessage: string) => {
  trackEventWithSource('bid_fail', {
    category: 'bid',
    action: 'fail',
    auction_id: auctionId,
    error: errorMessage,
  });
};

export const trackEmailSignupView = () => {
  trackEventWithSource('email_signup_view', {
    category: 'signup',
    action: 'view',
  });
};

export const trackEmailSignupSubmit = () => {
  trackEventWithSource('email_signup_submit', {
    category: 'signup',
    action: 'submit',
  });
};

export const trackEmailSignupSuccess = () => {
  trackEventWithSource('email_signup_success', {
    category: 'signup',
    action: 'success',
  });
};

export const trackChatOpen = () => {
  trackEventWithSource('chat_open', {
    category: 'chat',
    action: 'open',
  });
};

export const trackChatMessage = () => {
  trackEventWithSource('chat_message', {
    category: 'chat',
    action: 'message_sent',
  });
};

export const trackChatClose = () => {
  trackEventWithSource('chat_close', {
    category: 'chat',
    action: 'close',
  });
};

export const trackScrollDepth = (depth: number) => {
  trackEventWithSource('scroll_depth', {
    category: 'engagement',
    action: 'scroll',
    depth: `${depth}%`,
  });
};

export const trackCTAClick = (ctaName: string, destination: string) => {
  trackEventWithSource('cta_click', {
    category: 'navigation',
    action: 'cta_click',
    cta_name: ctaName,
    destination,
  });
};

export const trackExternalLinkClick = (destination: string) => {
  trackEventWithSource('external_link_click', {
    category: 'navigation',
    action: 'external_click',
    destination,
  });
};

/**
 * Get bid amount range for privacy-safe tracking
 */
export function getBidAmountRange(amount: number): string {
  if (amount < 100) return '0-100';
  if (amount < 500) return '100-500';
  if (amount < 1000) return '500-1000';
  if (amount < 2000) return '1000-2000';
  if (amount < 5000) return '2000-5000';
  return '5000+';
}
