import { trackCustomEvent, trackEvent, trackInitiateCheckout } from "@/hooks/useMetaPixel";
import type { SaxChoice } from "../funnel.config";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const ENTRY_QUERY_STORAGE_KEY = "cs_interativo_entry_query";
const firedOnce = new Set<string>();

/** Persiste UTMs, fbclid e demais parâmetros na entrada para nunca perder no pushState */
export function captureEntryQueryParams(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.location.search && window.location.search.length > 1) {
      sessionStorage.setItem(ENTRY_QUERY_STORAGE_KEY, window.location.search);
    }
  } catch {
    // sessionStorage indisponível em modo privado restrito
  }
}

/** Constrói URL de checkout Wiapy preservando 100% dos parâmetros UTM / fbclid */
export function buildCheckoutUrl(baseUrl: string): string {
  if (typeof window === "undefined") return baseUrl;
  let params = window.location.search;
  if (!params || params.length <= 1) {
    try {
      params = sessionStorage.getItem(ENTRY_QUERY_STORAGE_KEY) || "";
    } catch {
      params = "";
    }
  }
  if (!params || params.length <= 1) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${params.replace(/^\?/, "")}`;
}

function pushDataLayer(event: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      funnel_route: "/interativo",
      ...payload,
    });
  } catch {
    // noop
  }
}

function fireCustomOnce(key: string, eventName: string, params?: Record<string, unknown>) {
  if (firedOnce.has(key)) return;
  firedOnce.add(key);
  trackCustomEvent(eventName, params);
  pushDataLayer(eventName, params);
}

export function trackFunnelStart() {
  fireCustomOnce("funnel_start", "funnel_start", { scene: 1 });
}

export function trackSaxSelected(sax: SaxChoice) {
  fireCustomOnce("sax_selected", "sax_selected", { sax });
}

export function trackBeforeAfterComplete(sax: SaxChoice) {
  fireCustomOnce("before_after_complete", "before_after_complete", { sax });
}

export function trackLibraryBuilt(sax: SaxChoice) {
  fireCustomOnce("library_built", "library_built", { sax });
}

export function trackSkipToOffer(fromScene: number) {
  fireCustomOnce(`skip_to_offer_${fromScene}`, "skip_to_offer", { from_scene: fromScene });
}

export function trackOfferViewContent(sax: SaxChoice) {
  if (firedOnce.has("offer_view_content")) return;
  firedOnce.add("offer_view_content");
  trackEvent("ViewContent", {
    content_name: `Oferta Interativa - Sax ${sax === "alto" ? "Alto Eb" : "Tenor Bb"}`,
    content_category: "sales_page",
    content_type: "landing_page",
    sax,
  });
  pushDataLayer("view_content", {
    content_name: "Oferta Interativa - Clube do Sax",
    sax,
  });
}

export function trackInterativoCheckout(plan: "essential" | "premium", sax: SaxChoice) {
  const value = plan === "premium" ? 24.9 : 14.9;
  const contentName =
    plan === "premium"
      ? `Plano Completo VIP Interativo (${sax})`
      : `Plano Basico Interativo (${sax})`;

  trackInitiateCheckout({
    content_name: contentName,
    value,
    currency: "BRL",
  });

  pushDataLayer("begin_checkout", {
    plan,
    sax,
    value,
    currency: "BRL",
  });
}

/** Registra tempo de permanência em cada cena para análise de abandono */
export function recordSceneDwellTime(sceneName: string, durationMs: number) {
  const safeMs = Math.max(0, Math.round(durationMs));
  pushDataLayer("funnel_scene_dwell", {
    scene_name: sceneName,
    duration_ms: safeMs,
  });
  try {
    const raw = sessionStorage.getItem("cs_interativo_scene_times");
    const prev = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    prev[sceneName] = (prev[sceneName] || 0) + safeMs;
    sessionStorage.setItem("cs_interativo_scene_times", JSON.stringify(prev));
  } catch {
    // noop
  }
}

/** Reset para testes unitários */
export function __resetTrackingForTests() {
  firedOnce.clear();
}
