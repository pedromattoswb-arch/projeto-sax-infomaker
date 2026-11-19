import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";
import Interativo from "@/pages/Interativo";
import { __resetTrackingForTests } from "@/features/interativo/tracking/events";

let reducedMotionPreferred = false;

beforeEach(() => {
  reducedMotionPreferred = true;
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

  it("walks through Scenes 1 -> 2 (Tenor) -> 3 (Slider >85%) -> 4 -> 5 Offer (100% identical /lp-3 structure, order, mockups, VIP-first & personalized)", async () => {
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

    // SCENE 1: Palco Apagado + Audio On by default + clear action pill
    expect(screen.getByLabelText(/Toque no sax e ligue o som/i)).toBeInTheDocument();
    expect(screen.getByText(/Áudio ligado/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ir para a oferta/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Toque para ligar o som/i }));
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "funnel_start", { scene: 1 });

    // SCENE 2: Qual é o seu sax? (Zero "Ir para a oferta" skip button per user request!)
    expect(screen.queryByRole("button", { name: /Ir para a oferta/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Escolher Sax Tenor/i }));

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "sax_selected", { sax: "tenor" });
    expect(sessionStorage.getItem("cs_interativo_sax")).toBe("tenor");

    // SCENE 3: Sozinho x Com Banda
    const slider = screen.getByRole("slider", { name: /Comparar som do sax sozinho/i });
    fireEvent.keyDown(slider, { key: "End" });

    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "before_after_complete", { sax: "tenor" });
    expect(screen.getByLabelText(/É assim que você vai soar/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Quero tocar assim/i }));

    // SCENE 4: Montando seu acervo -> auto transitions to Scene 5 Offer
    expect(screen.getByText(/Preparando seu palco para Sax Tenor/i)).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(1800);
    });

    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "library_built", { sax: "tenor" });

    // SCENE 5: Offer — 100% /lp-3 theme & structure personalized for Sax Tenor (Bb)!
    await waitFor(() => {
      expect(screen.getByText(/Seu Acervo de Sax Tenor \(Bb\)/i)).toBeInTheDocument();
    });

    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      expect.objectContaining({ sax: "tenor" })
    );

    // Verify exact /lp-3 Mobile-First Order (order-1 Title -> order-2 Mockup -> order-3 Description) across ALL 4 mockup sections!
    const heroGrid = container.querySelector("#conteudo-principal > section .grid") as HTMLElement;
    expect(heroGrid.children[0].className).toContain("order-1");
    expect(heroGrid.children[1].className).toContain("order-2");
    expect(heroGrid.children[2].className).toContain("order-3");

    const emailGrid = container.querySelector("#acesso-email .grid") as HTMLElement;
    expect(emailGrid.children[0].className).toContain("order-1");
    expect(emailGrid.children[1].className).toContain("order-2");
    expect(emailGrid.children[2].className).toContain("order-3");

    const appGrid = container.querySelector("#simulador-app .grid") as HTMLElement;
    expect(appGrid.children[0].className).toContain("order-1");
    expect(appGrid.children[1].className).toContain("order-2");
    expect(appGrid.children[2].className).toContain("order-3");

    const bonusGrid = container.querySelector("#bonus .grid") as HTMLElement;
    expect(bonusGrid.children[0].className).toContain("order-1");
    expect(bonusGrid.children[1].className).toContain("order-2");
    expect(bonusGrid.children[2].className).toContain("order-3");

    // Verify 100% /lp-3 sections present + Plano Completo VIP ALWAYS 1st
    const offersGrid = container.querySelector("#ofertas .grid") as HTMLElement;
    expect(offersGrid.children[0].textContent).toContain("Plano Completo");
    expect(offersGrid.children[1].textContent).toContain("Plano Básico");

    expect(screen.getByText(/Mural Fixo de Mensagens no WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/7 Dias Sem Risco/i)).toBeInTheDocument();
    expect(screen.getByText(/CNPJ: 51\.919\.716\/0001-28/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Entrar no Aplicativo/i })).toHaveAttribute(
      "href",
      "https://app.clubedosax.com/login"
    );

    // Verify Checkout CTA triggers InitiateCheckout + passes UTMs & fbclid
    fireEvent.click(screen.getByRole("button", { name: /QUERO O PLANO COMPLETO VIP/i }));
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

  it("opens directly on Offer upon reload when offer was already seen in sessionStorage", async () => {
    sessionStorage.setItem("cs_interativo_offer_seen", "1");
    sessionStorage.setItem("cs_interativo_sax", "alto");

    render(<Interativo />);
    await waitFor(() => {
      expect(screen.getByText(/Escolha Seu Passaporte para o/i)).toBeInTheDocument();
    });
    expect(screen.queryByLabelText(/Toque no sax e ligue o som/i)).not.toBeInTheDocument();
  }, 15000);
});
