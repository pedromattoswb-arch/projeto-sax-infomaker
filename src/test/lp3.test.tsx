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

describe("Landing Page /lp-3 — Compressed Eager WebP, 3D Scroll Motion & Immediate Visual Pairing Suite", () => {
  it("preserves original / and /lp-2 routes with zero regression", () => {
    const { unmount } = render(<Index />);
    expect(screen.getByText(/com Playback do Brasil/i)).toBeInTheDocument();
    unmount();

    render(<Lp2 />);
    expect(screen.getByText(/Toque as músicas que você ama no seu/i)).toBeInTheDocument();
  });

  it("verifies all 31 compressed LP3 WebP assets and audio playbacks exist on disk and are lightweight", () => {
    const publicDir = path.resolve(process.cwd(), "public");
    const srcLp3Dir = path.resolve(process.cwd(), "src/assets/lp3");

    const requiredPublicFiles = [
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
      ...Array.from({ length: 10 }, (_, i) => `lp3/testimonials/depoimento-${i + 1}.webp`),
      "lp3/posters/julio-sampaio-sp.webp",
      "lp3/posters/marcelo-cristian-rj.webp",
      "lp3/posters/marcos-mattos-bsb.webp",
      "lp3/posters/julia-costa-sp.webp",
      "lp3/posters/barbara-oliveira-floripa.webp",
      "lp3/posters/gabriela-santana-sp.webp",
    ];

    for (const relPath of requiredPublicFiles) {
      const fullPath = path.join(publicDir, relPath);
      expect(fs.existsSync(fullPath), `Missing public file: ${relPath}`).toBe(true);
      const size = fs.statSync(fullPath).size;
      expect(size).toBeGreaterThan(0);
      if (relPath.endsWith(".webp")) {
        expect(size, `${relPath} should be compressed under 95KB`).toBeLessThan(95 * 1024);
      }
    }

    const requiredSrcWebps = [
      "logo-clube-do-sax.webp",
      "selo-garantia.webp",
      "sax-stage-hero-art.webp",
      "ill-acervo-partituras.webp",
      "ill-voz-inteligente.webp",
      "ill-acesso-email.webp",
      "ill-multi-dispositivos.webp",
      "ill-bonus-vip.webp",
      "partituras/partitura-1.webp",
      "partituras/partitura-3.webp",
      "partituras/partitura-4.webp",
      "partituras/partitura-5.webp",
      "partituras/partitura-6.webp",
      "partituras/partitura-8.webp",
      "partituras/partitura-9.webp",
    ];

    for (const relPath of requiredSrcWebps) {
      const fullPath = path.join(srcLp3Dir, relPath);
      expect(fs.existsSync(fullPath), `Missing src WebP file: ${relPath}`).toBe(true);
      const size = fs.statSync(fullPath).size;
      expect(size).toBeGreaterThan(0);
      expect(size, `${relPath} should be compressed under 95KB`).toBeLessThan(95 * 1024);
    }
  });

  it("loads directly with zero intro overlay, 100% eager-loaded images (zero lazy), immediate mention-to-visual order, Spotify hamburger menu, student login box, and checkout UTMs", async () => {
    const { container } = render(<Lp3 />);

    // 1. Confirm initial funnel opening overlay is 100% removed
    expect(screen.queryByRole("button", { name: /Entrar Direto/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Abrindo Seu/i)).not.toBeInTheDocument();

    // 2. Confirm ZERO lazy-loaded images — every image on /lp-3 loads eagerly upfront before scroll!
    const allImages = Array.from(container.querySelectorAll("img"));
    expect(allImages.length).toBeGreaterThan(20);
    const lazyImages = container.querySelectorAll('img[loading="lazy"]');
    expect(lazyImages.length).toBe(0);
    for (const img of allImages) {
      expect(img.getAttribute("loading")).toBe("eager");
      expect(img.getAttribute("decoding")).toBe("sync");
    }

    // 3. Confirm ALL "testar voz", "clique para simular", "experimente tocar" gimmicks remain 100% gone
    expect(screen.queryByText(/Testar Busca por Voz/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Clique para Simular/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Experimente Tocar nas Chaves/i)).not.toBeInTheDocument();

    // 4. Verify Mobile-First Order (order-1 Title -> order-2 Visual/Mockup -> order-3 Description) across Hero, Email, App Showcase, and Bonus sections
    const heroGrid = container.querySelector("#conteudo-principal > section .grid") as HTMLElement;
    expect(heroGrid.children[0].className).toContain("order-1");
    expect(heroGrid.children[1].className).toContain("order-2");
    expect(heroGrid.children[2].className).toContain("order-3");

    const emailSectionGrid = container.querySelector("#acesso-email .grid") as HTMLElement;
    expect(emailSectionGrid.children[0].className).toContain("order-1");
    expect(emailSectionGrid.children[1].className).toContain("order-2");
    expect(emailSectionGrid.children[2].className).toContain("order-3");

    const appSectionGrid = container.querySelector("#simulador-app .grid") as HTMLElement;
    expect(appSectionGrid.children[0].className).toContain("order-1");
    expect(appSectionGrid.children[1].className).toContain("order-2");
    expect(appSectionGrid.children[2].className).toContain("order-3");

    const bonusSectionGrid = container.querySelector("#bonus .grid") as HTMLElement;
    expect(bonusSectionGrid.children[0].className).toContain("order-1");
    expect(bonusSectionGrid.children[1].className).toContain("order-2");
    expect(bonusSectionGrid.children[2].className).toContain("order-3");

    // 5. Verify Spotify Player has ZERO horizontal or vertical scroll containers and works via compact Hamburger menu
    const playbacksSection = container.querySelector("#playbacks") as HTMLElement;
    expect(playbacksSection.querySelector(".overflow-x-auto")).toBeNull();
    expect(playbacksSection.querySelector(".overflow-y-auto")).toBeNull();

    const genreMenuBtn = within(playbacksSection).getByRole("button", { name: /Estilo:/i });
    fireEvent.click(genreMenuBtn);
    const gospelMenuItem = within(playbacksSection).getByRole("menuitemradio", { name: /Gospel/i });
    fireEvent.click(gospelMenuItem);
    expect(genreMenuBtn).toHaveAttribute("aria-expanded", "false");

    await act(async () => {
      fireEvent.click(within(playbacksSection).getByText("Tudo É Possível"));
    });
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

    // 6. Verify "Já assinou o Clube do Sax?" box at the bottom with exact login URL
    expect(screen.getByText(/Já assinou o Clube do Sax\?/i)).toBeInTheDocument();
    const loginLink = screen.getByRole("link", { name: /Entrar no Aplicativo/i });
    expect(loginLink).toHaveAttribute("href", "https://app.clubedosax.com/login");

    // 7. Verify Partitura Zoom Modal & Escape key close
    const rainbowCards = screen.getAllByText(/Over The Rainbow/i);
    fireEvent.click(rainbowCards[0]);
    expect(screen.getByRole("dialog", { name: /Visualização da partitura/i })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: /Visualização da partitura/i })).not.toBeInTheDocument();

    // 8. Verify Pricing Checkout URLs + UTM passthrough
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

    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: originalLocation,
    });
  }, 20000);

  it("respects prefers-reduced-motion accessibility preference", () => {
    reducedMotionPreferred = true;
    render(<Lp3 />);
    expect(screen.getByText(/O Maior Acervo de Partituras/i)).toBeInTheDocument();
  });
});
