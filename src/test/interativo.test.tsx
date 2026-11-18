import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";
import Interativo from "@/pages/Interativo";
import { __resetTrackingForTests } from "@/features/interativo/tracking/events";

let reducedMotionPreferred = false;

beforeEach(() => {
  reducedMotionPreferred = true; // Determinístico para avançar timelines sem esperar animações longas
  sessionStorage.clear();
  __resetTrackingForTests();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotionPreferred : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  });

  window.scrollTo = vi.fn();
  window.fbq = vi.fn();
  window.dataLayer = [];
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
});

describe("Funil Interativo Cinematográfico (/interativo)", () => {
  it("verifies all /interativo WebP visual assets exist on disk within performance budget", () => {
    const publicDir = path.resolve(process.cwd(), "public");
    const checks = [
      { rel: "interativo/images/sax-alto.webp", maxBytes: 120 * 1024 },
      { rel: "interativo/images/sax-tenor.webp", maxBytes: 120 * 1024 },
      { rel: "interativo/fx/smoke-loop.webp", maxBytes: 150 * 1024 },
    ];

    for (const c of checks) {
      const full = path.join(publicDir, c.rel);
      expect(fs.existsSync(full), `Missing asset: ${c.rel}`).toBe(true);
      const size = fs.statSync(full).size;
      expect(size).toBeGreaterThan(0);
      expect(size, `${c.rel} exceeds budget`).toBeLessThanOrEqual(c.maxBytes);
    }
  });

  it("walks through Scenes 1 -> 2 (Tenor) -> 3 (Slider >85%) -> 4 -> 5 Offer with deduplicated tracking, VIP-first offer, 100% /lp-3 content and UTM passthrough", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: {
        ...originalLocation,
        pathname: "/interativo",
        search: "?utm_source=meta&fbclid=TEST123",
        href: "http://localhost/interativo?utm_source=meta&fbclid=TEST123",
      },
    });

    const { container } = render(<Interativo />);

    // SCENE 1: Palco Apagado
    expect(screen.getByLabelText(/Toque no sax e ligue o som/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ir para a oferta/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Toque para ligar o som/i }));
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Event: funnel_start fired once
    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "funnel_start", { scene: 1 });

    // SCENE 2: Qual é o seu sax? (Now "Ir para a oferta" appears)
    expect(screen.getByRole("button", { name: /Ir para a oferta/i })).toBeInTheDocument();
    const tenorBtn = screen.getByRole("button", { name: /Escolher Sax Tenor/i });
    fireEvent.click(tenorBtn);

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "sax_selected", { sax: "tenor" });
    expect(sessionStorage.getItem("cs_interativo_sax")).toBe("tenor");

    // SCENE 3: Sozinho x Com Banda (accessible slider via keyboard End -> 100%)
    const slider = screen.getByRole("slider", { name: /Comparar som do sax sozinho/i });
    fireEvent.keyDown(slider, { key: "End" });

    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "before_after_complete", { sax: "tenor" });
    expect(screen.getByLabelText(/É assim que você vai soar/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Quero tocar assim/i }));

    // SCENE 4: Montando seu acervo -> auto transitions to Scene 5 Offer
    expect(screen.getByText(/Montando seu acervo para Sax Tenor/i)).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "library_built", { sax: "tenor" });

    // SCENE 5: Offer (lazy loaded)
    await waitFor(() => {
      expect(screen.getByLabelText(/Seu acervo de Sax Tenor \(Bb\) está pronto/i)).toBeInTheDocument();
    });

    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      expect.objectContaining({ sax: "tenor" })
    );

    // Verify 100% /lp-3 key sections & content exist
    expect(screen.getByText(/Veja a Qualidade Real das/i)).toBeInTheDocument();
    expect(screen.getByText(/Dê Play nos/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprou, Chegou no/i)).toBeInTheDocument();
    expect(screen.getByText(/Mural Fixo de Mensagens no WhatsApp/i)).toBeInTheDocument();
    expect(screen.getAllByText(/3 Guias Bônus VIP/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/7 Dias Sem Risco/i)).toBeInTheDocument();
    expect(screen.getByText(/CNPJ: 51\.919\.716\/0001-28/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Entrar no Aplicativo/i })).toHaveAttribute(
      "href",
      "https://app.clubedosax.com/login"
    );

    // Verify Plano Completo VIP is ALWAYS 1st option BEFORE Plano Básico
    const plansGrid = container.querySelector("#offer-plans .grid") as HTMLElement;
    expect(plansGrid.children[0].textContent).toContain("Plano Completo");
    expect(plansGrid.children[1].textContent).toContain("Plano Básico");

    // Verify Checkout CTA triggers InitiateCheckout + passes UTMs & fbclid
    fireEvent.click(screen.getByRole("button", { name: /Ativar meu acervo VIP/i }));
    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 24.9, currency: "BRL" })
    );
    expect(window.location.href).toBe(
      "https://pay.wiapy.com/jyPuib6Uivrl?utm_source=meta&fbclid=TEST123"
    );

    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: originalLocation,
    });
    vi.useRealTimers();
  }, 25000);

  it("allows skipping straight to offer from Scene 2 and opens directly on Offer upon reload when offer was already seen", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { unmount } = render(<Interativo />);

    fireEvent.click(screen.getByRole("button", { name: /Toque para ligar o som/i }));
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    fireEvent.click(screen.getByRole("button", { name: /Ir para a oferta/i }));
    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "skip_to_offer", { from_scene: 2 });

    await waitFor(() => {
      expect(screen.getByText(/Ative Seu Passaporte/i)).toBeInTheDocument();
    });
    expect(sessionStorage.getItem("cs_interativo_offer_seen")).toBe("1");
    unmount();

    // Reload: opens straight on Offer without restarting Scene 1
    render(<Interativo />);
    await waitFor(() => {
      expect(screen.getByText(/Ative Seu Passaporte/i)).toBeInTheDocument();
    });
    expect(screen.queryByLabelText(/Toque no sax e ligue o som/i)).not.toBeInTheDocument();

    vi.useRealTimers();
  }, 15000);
});
