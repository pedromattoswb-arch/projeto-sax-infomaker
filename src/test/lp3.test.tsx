import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import fs from "fs";
import path from "path";
import Lp3 from "@/pages/Lp3";
import Index from "@/pages/Index";

beforeEach(() => {
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

describe("Landing Page /lp-3 — Full Functional & Asset Verification", () => {
  it("keeps the original / route completely intact", () => {
    render(<Index />);
    expect(screen.getByText(/com Playback do Brasil/i)).toBeInTheDocument();
  });

  it("verifies all public static assets (playbacks, testimonials, guarantee seal) exist on disk", () => {
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

  it("tests interactive flows: intro, pearl keys, marquee zoom, Spotify player, iPhone simulator, WhatsApp wall, and checkout links", async () => {
    vi.useFakeTimers();
    render(<Lp3 />);

    // 1. Automatic Saxophone Stage Intro renders and skips cleanly
    expect(screen.getByText(/Preparando Seu/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Entrar Direto/i }));
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // 2. Playable Mother-of-Pearl Saxophone Keys + XP increase + Alto/Tenor switch
    const doKey = screen.getByRole("button", { name: /Tocar nota Dó/i });
    fireEvent.click(doKey);
    expect(screen.getByText(/1 nota tocada/i)).toBeInTheDocument();

    const tenorBtns = screen.getAllByRole("button", { name: /Sax Tenor \(Bb\)/i });
    fireEvent.click(tenorBtns[0]);
    expect(screen.getAllByText(/Tenor Bb/i).length).toBeGreaterThan(0);

    // 3. Continuous Partitura Marquee sheet zoom modal open & close
    const rainbowCards = screen.getAllByText(/Over The Rainbow/i);
    fireEvent.click(rainbowCards[0]);
    expect(screen.getByText(/Amostra real em PDF de alta resolução/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Fechar visualização/i }));

    // 4. Spotify-style Studio Player: filter genres & play track
    fireEvent.click(screen.getByRole("button", { name: "Rock & Jazz" }));
    const trickRows = screen.getAllByText(/Your Latest Trick/i);
    await act(async () => {
      fireEvent.click(trickRows[trickRows.length - 1]);
    });
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

    // 5. Interactive iPhone 16 Pro Simulator: Voice Search demo & Folder navigation
    const simVoiceBtns = screen.getAllByRole("button", { name: /Testar Busca por Voz/i });
    act(() => {
      fireEvent.click(simVoiceBtns[0]);
    });
    expect(screen.getByText(/Reconhecimento Inteligente/i)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1700);
    });
    expect(screen.getByText(/Partitura Sax Tenor \(Bb\)/i)).toBeInTheDocument();

    // 6. All 10 Fixed WhatsApp & Community Testimonial Prints rendered simultaneously
    expect(screen.getByText(/Seu Jorge \(68 anos\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Prof\. Carlos/i)).toBeInTheDocument();
    expect(screen.getByText(/Estudante de Conservatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Roberto & Mariana/i)).toBeInTheDocument();
    expect(screen.getByText(/Prof\. Antônio/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciante \(3 meses de Sax\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Profa\. Renata Vieira/i)).toBeInTheDocument();
    expect(screen.getByText(/Patrícia Santos Almeida/i)).toBeInTheDocument();
    expect(screen.getByText(/Lucas Ferreira Costa/i)).toBeInTheDocument();
    expect(screen.getByText(/Marcos Oliveira/i)).toBeInTheDocument();

    // 7. Instant Email + Login messaging & Pricing Checkout URLs with UTM passthrough
    expect(screen.getAllByText(/Login Enviado no E-mail na Mesma Hora/i).length).toBeGreaterThan(0);

    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: { ...originalLocation, search: "?utm_source=meta&utm_campaign=lp3", href: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /QUERO O PLANO COMPLETO VIP/i }));
    expect(window.location.href).toBe(
      "https://pay.wiapy.com/jyPuib6Uivrl?utm_source=meta&utm_campaign=lp3"
    );

    fireEvent.click(screen.getByRole("button", { name: /Garantir Plano Básico/i }));
    expect(window.location.href).toBe(
      "https://pay.wiapy.com/PTslvctv1QE6?utm_source=meta&utm_campaign=lp3"
    );

    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: originalLocation,
    });
    vi.useRealTimers();
  }, 20000);
});
