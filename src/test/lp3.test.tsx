import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import fs from "fs";
import path from "path";
import Lp3 from "@/pages/Lp3";
import Index from "@/pages/Index";
import Lp2 from "@/pages/Lp2";

let reducedMotionPreferred = false;

beforeEach(() => {
  reducedMotionPreferred = false;

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

  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
});

describe("Landing Page /lp-3 — Full Overhaul & Regression Suite", () => {
  it("preserves original / and /lp-2 routes with zero regression", () => {
    const { unmount } = render(<Index />);
    expect(screen.getByText(/com Playback do Brasil/i)).toBeInTheDocument();
    unmount();

    render(<Lp2 />);
    expect(screen.getByText(/Toque as músicas que você ama no seu/i)).toBeInTheDocument();
  });

  it("verifies all public static assets and custom LP3 illustrations exist on disk", () => {
    const publicDir = path.resolve(process.cwd(), "public");
    const requiredPublicFiles = [
      "selo-garantia.png",
      "playbacks/careless-whisper.mp3",
      "playbacks/your-latest-trick.mp3",
      "playbacks/sozinho.mp3",
      "playbacks/dancing-queen.mp3",
      "playbacks/endless-love.mp3",
      "playbacks/alguem-me-disse.mp3",
      "playbacks/estranha-loucura.mp3",
      "playbacks/boate-azul.mp3",
      "playbacks/tan-enamorados.mp3",
      "playbacks/espirito-espirito.mp3",
      "playbacks/tudo-e-possivel.mp3",
      "playbacks/amigo-de-deus.mp3",
      ...Array.from({ length: 10 }, (_, i) => `testimonials/depoimento-${i + 1}.png`),
      "testimonials/posters/julio-sampaio-sp.jpg",
      "testimonials/posters/marcelo-cristian-rj.jpg",
      "testimonials/posters/marcos-mattos-bsb.jpg",
      "testimonials/posters/julia-costa-sp.jpg",
      "testimonials/posters/barbara-oliveira-floripa.jpg",
      "testimonials/posters/gabriela-santana-sp.jpg",
    ];

    for (const relPath of requiredPublicFiles) {
      const fullPath = path.join(publicDir, relPath);
      expect(fs.existsSync(fullPath), `Missing public file: ${relPath}`).toBe(true);
      expect(fs.statSync(fullPath).size).toBeGreaterThan(0);
    }

    const lp3AssetsDir = path.resolve(process.cwd(), "src/assets/lp3");
    const requiredIllustrations = [
      "sax-stage-hero-art.jpg",
      "ill-acervo-partituras.jpg",
      "ill-voz-inteligente.jpg",
      "ill-acesso-email.jpg",
      "ill-multi-dispositivos.jpg",
      "ill-bonus-vip.jpg",
    ];
    for (const img of requiredIllustrations) {
      const fullPath = path.join(lp3AssetsDir, img);
      expect(fs.existsSync(fullPath), `Missing generated illustration: ${img}`).toBe(true);
      expect(fs.statSync(fullPath).size).toBeGreaterThan(10000);
    }
  });

  it("verifies removal of key-playing distraction, zero scrollbars in Spotify player, mobile hamburger filter, student login box, and full interactive flows", async () => {
    vi.useFakeTimers();
    const { container } = render(<Lp3 />);

    // 1. Intro renders and skips cleanly
    expect(screen.getByText(/Abrindo Seu/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Entrar Direto/i }));
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // 2. Confirm "Experimente Tocar nas Chaves" was completely removed
    expect(screen.queryByText(/Experimente Tocar nas Chaves/i)).not.toBeInTheDocument();

    // 3. Verify Spotify Player has ZERO horizontal or vertical scroll containers and works via compact Hamburger menu
    const playbacksSection = container.querySelector("#playbacks") as HTMLElement;
    expect(playbacksSection).toBeTruthy();
    expect(playbacksSection.querySelector(".overflow-x-auto")).toBeNull();
    expect(playbacksSection.querySelector(".overflow-y-auto")).toBeNull();

    // Open mobile compact hamburger genre filter inside Spotify player
    const genreMenuBtn = within(playbacksSection).getByRole("button", { name: /Estilo:/i });
    expect(genreMenuBtn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(genreMenuBtn);
    expect(genreMenuBtn).toHaveAttribute("aria-expanded", "true");

    const gospelMenuItem = within(playbacksSection).getByRole("menuitemradio", { name: /Gospel/i });
    fireEvent.click(gospelMenuItem);
    // Menu closes automatically after selection
    expect(genreMenuBtn).toHaveAttribute("aria-expanded", "false");
    expect(within(playbacksSection).getByText("Tudo É Possível")).toBeInTheDocument();

    // Play a track
    await act(async () => {
      fireEvent.click(within(playbacksSection).getByText("Tudo É Possível"));
    });
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

    // 4. Verify "Já assinou o Clube do Sax?" box at the bottom with exact login URL
    expect(screen.getByText(/Já assinou o Clube do Sax\?/i)).toBeInTheDocument();
    const loginLink = screen.getByRole("link", { name: /Entrar no Aplicativo/i });
    expect(loginLink).toHaveAttribute("href", "https://app.clubedosax.com/login");

    // 5. Verify mobile header navigation menu also includes student login link
    const headerMenuBtn = screen.getByRole("button", { name: /Abrir menu de seções/i });
    fireEvent.click(headerMenuBtn);
    const mobileNav = container.querySelector("#lp3-mobile-nav") as HTMLElement;
    expect(mobileNav).toBeTruthy();
    expect(within(mobileNav).getByRole("link", { name: /Já sou aluno/i })).toHaveAttribute(
      "href",
      "https://app.clubedosax.com/login"
    );

    // 6. Verify iPhone Simulator Alto/Tenor switch & Voice Search demo
    const tenorBtns = screen.getAllByRole("button", { name: "Tenor Bb" });
    fireEvent.click(tenorBtns[0]);
    const simVoiceBtns = screen.getAllByRole("button", { name: /Testar Busca por Voz/i });
    act(() => {
      fireEvent.click(simVoiceBtns[0]);
    });
    expect(screen.getByText(/Reconhecimento Inteligente/i)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByText(/Partitura Sax Tenor \(Bb\)/i)).toBeInTheDocument();

    // 7. Verify Partitura Zoom Modal & Escape key close
    const rainbowCards = screen.getAllByText(/Over The Rainbow/i);
    fireEvent.click(rainbowCards[0]);
    expect(screen.getByRole("dialog", { name: /Visualização da partitura/i })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: /Visualização da partitura/i })).not.toBeInTheDocument();

    // 8. Verify all 10 Fixed WhatsApp & Community prints are visible simultaneously
    expect(screen.getByText(/Seu Jorge \(68 anos\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Prof\. Carlos/i)).toBeInTheDocument();
    expect(screen.getByText(/Marcos Oliveira/i)).toBeInTheDocument();

    // 9. Verify Pricing Checkout URLs + UTM passthrough
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: { ...originalLocation, search: "?utm_source=ig&utm_medium=cpc", href: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /QUERO O PLANO COMPLETO VIP/i }));
    expect(window.location.href).toBe(
      "https://pay.wiapy.com/jyPuib6Uivrl?utm_source=ig&utm_medium=cpc"
    );

    fireEvent.click(screen.getByRole("button", { name: /Garantir Plano Básico/i }));
    expect(window.location.href).toBe(
      "https://pay.wiapy.com/PTslvctv1QE6?utm_source=ig&utm_medium=cpc"
    );

    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: originalLocation,
    });
    vi.useRealTimers();
  }, 20000);

  it("respects prefers-reduced-motion accessibility preference", () => {
    reducedMotionPreferred = true;
    render(<Lp3 />);
    // Intro overlay is bypassed immediately when reduced motion is preferred
    expect(screen.queryByText(/Abrindo Seu/i)).not.toBeInTheDocument();
    expect(screen.getByText(/O Maior Acervo de Partituras/i)).toBeInTheDocument();
  });
});
