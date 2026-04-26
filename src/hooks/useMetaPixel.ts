declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

interface EventParams {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  content_type?: string;
  content_ids?: string[];
  num_items?: number;
  status?: string;
  [key: string]: unknown;
}

export const trackEvent = (event: string, params?: EventParams) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      if (params) {
        window.fbq("track", event, params);
      } else {
        window.fbq("track", event);
      }
    } catch (error) {
      console.warn("[Meta Pixel] Error:", error);
    }
  }
};

export const trackCustomEvent = (event: string, params?: EventParams) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      if (params) {
        window.fbq("trackCustom", event, params);
      } else {
        window.fbq("trackCustom", event);
      }
    } catch (error) {
      console.warn("[Meta Pixel] Error:", error);
    }
  }
};

export const trackLandingView = () => {
  trackEvent("ViewContent", {
    content_name: "Sales Page - Clube do Sax",
    content_category: "sales_page",
    content_type: "landing_page",
  });
};

export const trackInitiateCheckout = (params: {
  content_name?: string;
  value?: number;
  currency?: string;
}) => {
  trackEvent("InitiateCheckout", {
    content_category: "checkout",
    content_ids: ["acervo-partituras-sax"],
    num_items: 1,
    ...params,
  });
};

export default { trackEvent, trackCustomEvent, trackLandingView, trackInitiateCheckout };
