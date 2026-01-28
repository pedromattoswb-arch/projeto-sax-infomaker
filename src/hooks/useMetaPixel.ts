// Meta Pixel Tracking Hook
// Centralizes all Meta Pixel event tracking for the funnel

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export type FunnelEvent = 
  | 'ViewContent'      // Landing page view
  | 'StartQuiz'        // Quiz started
  | 'QuizProgress'     // Quiz step completed
  | 'Lead'             // Quiz completed (diagnosis)
  | 'InitiateCheckout' // CTA click on offer page
  | 'ViewOffer';       // Offer page view

interface EventParams {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  content_type?: string;
  content_ids?: string[];
  num_items?: number;
  status?: string;
  step?: number;
  total_steps?: number;
  instrument?: string;
  level?: string;
  dream?: string;
}

/**
 * Tracks a Meta Pixel event safely (no-op if fbq is not available)
 */
export const trackEvent = (event: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      if (params) {
        window.fbq('track', event, params);
      } else {
        window.fbq('track', event);
      }
      console.log(`[Meta Pixel] Event tracked: ${event}`, params || '');
    } catch (error) {
      console.warn('[Meta Pixel] Error tracking event:', error);
    }
  } else {
    console.log(`[Meta Pixel] Event (fbq not available): ${event}`, params || '');
  }
};

/**
 * Tracks a custom event (not standard Meta events)
 */
export const trackCustomEvent = (event: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      if (params) {
        window.fbq('trackCustom', event, params);
      } else {
        window.fbq('trackCustom', event);
      }
      console.log(`[Meta Pixel] Custom event tracked: ${event}`, params || '');
    } catch (error) {
      console.warn('[Meta Pixel] Error tracking custom event:', error);
    }
  } else {
    console.log(`[Meta Pixel] Custom event (fbq not available): ${event}`, params || '');
  }
};

// ===== FUNNEL-SPECIFIC TRACKING FUNCTIONS =====

/**
 * Track when user views the landing page
 */
export const trackLandingView = () => {
  trackEvent('ViewContent', {
    content_name: 'Landing Page - Clube do Sax Brasil',
    content_category: 'funnel_entry',
    content_type: 'landing_page',
  });
};

/**
 * Track when user starts the quiz
 */
export const trackQuizStart = () => {
  trackCustomEvent('StartQuiz', {
    content_name: 'Quiz Started',
    content_category: 'engagement',
  });
};

/**
 * Track quiz step completion
 */
export const trackQuizStep = (step: number, totalSteps: number, answer?: string) => {
  trackCustomEvent('QuizProgress', {
    step,
    total_steps: totalSteps,
    status: `step_${step}_of_${totalSteps}`,
    content_name: answer || undefined,
  });
};

/**
 * Track quiz completion (Lead event)
 */
export const trackQuizComplete = (params: {
  instrument?: string;
  level?: string;
  dream?: string;
}) => {
  trackEvent('Lead', {
    content_name: 'Quiz Completed - Clube do Sax Brasil',
    content_category: 'conversion',
    ...params,
  });
};

/**
 * Track when user views the offer page
 */
export const trackOfferView = (params: {
  instrument?: string;
  level?: string;
  dream?: string;
}) => {
  trackEvent('ViewContent', {
    content_name: 'Offer Page - Clube do Sax Brasil',
    content_category: 'offer',
    content_type: 'product',
    value: 37.90,
    currency: 'BRL',
    content_ids: ['acervo-partituras-sax'],
    ...params,
  });
};

/**
 * Track when user clicks checkout CTA
 */
export const trackInitiateCheckout = (params: {
  instrument?: string;
  level?: string;
  dream?: string;
}) => {
  trackEvent('InitiateCheckout', {
    content_name: 'Acervo de Partituras para Saxofone',
    content_category: 'checkout',
    value: 37.90,
    currency: 'BRL',
    content_ids: ['acervo-partituras-sax'],
    num_items: 1,
    ...params,
  });
};

export default {
  trackEvent,
  trackCustomEvent,
  trackLandingView,
  trackQuizStart,
  trackQuizStep,
  trackQuizComplete,
  trackOfferView,
  trackInitiateCheckout,
};
