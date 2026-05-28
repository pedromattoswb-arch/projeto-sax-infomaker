import { useState, useEffect } from "react";
import {
  Music,
  Mic,
  BookOpen,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Star,
  Check,
  Crown,
  Sparkles,
  Wifi,
  PlayCircle,
  X as XIcon,
  Mail,
  MessageCircle,
  Zap,
} from "lucide-react";

import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import heroMockup from "@/assets/hero-mockup.png";
import mockupAcervo from "@/assets/mockup-acervo.png";

import partitura1 from "@/assets/partituras-exemplo/partitura-1.png";
import partitura3 from "@/assets/partituras-exemplo/partitura-3.png";
import partitura4 from "@/assets/partituras-exemplo/partitura-4.png";
import partitura5 from "@/assets/partituras-exemplo/partitura-5.png";

import dep1 from "@/assets/testimonials/depoimento-1.png";
import dep2 from "@/assets/testimonials/depoimento-2.png";
import dep3 from "@/assets/testimonials/depoimento-3.png";

import VideoTestimonialCarousel from "@/components/funnel/VideoTestimonialCarousel";
import SongCatalogV2 from "@/components/funnel/v2/SongCatalogV2";
import BonusSectionV2 from "@/components/funnel/v2/BonusSectionV2";
import FAQ from "@/components/funnel/FAQ";
import { CATALOG_GENRES, TOTAL_CATALOG_COUNT } from "@/data/catalogSongs";

const heroAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/68.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
];

const ESSENTIAL_LINK = "https://pay.cakto.com.br/qqpusnn_804258";
const PREMIUM_LINK = "https://pay.cakto.com.br/39hving";

const goCheckout = (plan: "essential" | "premium") => {
  const link = plan === "essential" ? ESSENTIAL_LINK : PREMIUM_LINK;
  const params = window.location.search;
  const sep = link.includes("?") ? "&" : "?";
  window.location.href = params ? `${link}${sep}${params.substring(1)}` : link;
};

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const partituras = [partitura1, partitura3, partitura4, partitura5];

const TOTAL_FMT = TOTAL_CATALOG_COUNT.toLocaleString("pt-BR");
const GENRES_COUNT = CATALOG_GENRES.length;

// PRICING — explicit included vs not included
const basicIncluded = [
  "+5.000 partituras em PDF (Sax Alto e Tenor)",
  `${GENRES_COUNT} estilos musicais organizados`,
  "Acesso vitalício — pague uma vez, use para sempre",
  "Atualizações periódicas no acervo PDF",
];

const basicNotIncluded = [
  `Playbacks profissionais de estúdio (+${TOTAL_FMT} músicas)`,
  "Plataforma exclusiva estilo app",
  "Busca inteligente por voz",
  "Vídeo-aulas integradas para cada partitura",
  "Atualizações mensais com lançamentos",
  "Harpa Cristã completa com playback",
  "3 Bônus exclusivos (rotina, tonalidades e técnica)",
];

const premiumIncluded = [
  "Tudo do Plano Básico, e ainda:",
  `+${TOTAL_FMT} partituras com playback profissional de estúdio`,
  "Plataforma exclusiva estilo app (rápida e intuitiva)",
  "Busca inteligente por voz — ache qualquer música em segundos",
  "Vídeo-aulas integradas para cada partitura",
  "Novidades adicionadas todos os meses",
  "Harpa Cristã completa com playback",
  "3 Bônus exclusivos (rotina, tonalidades e técnica)",
];

const DeliveryReinforce = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={`flex flex-col ${compact ? "gap-1.5 text-xs" : "sm:flex-row gap-3 text-sm"} text-[var(--mg-text-dim)]`}
  >
    <span className="inline-flex items-center gap-2">
      <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--mg-gold)" }} />
      Link de acesso enviado no <strong className="text-white">e-mail</strong>
    </span>
    <span className="inline-flex items-center gap-2">
      <MessageCircle className="w-4 h-4 shrink-0" style={{ color: "var(--mg-gold)" }} />
      Também enviado pelo <strong className="text-white">WhatsApp</strong>
    </span>
    {!compact && (
      <span className="inline-flex items-center gap-2">
        <Zap className="w-4 h-4 shrink-0" style={{ color: "var(--mg-gold)" }} />
        <strong className="text-white">Liberação imediata</strong> após o pagamento
      </span>
    )}
  </div>
);

const SalesPageV2 = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden mg-body" style={{ background: "var(--mg-bg)" }}>
      {/* Ambient gold dust */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="mg-gold-glow"
          style={{ width: 800, height: 800, top: -200, left: "50%", transform: "translateX(-50%)" }}
        />
        <div
          className="mg-gold-glow"
          style={{ width: 500, height: 500, bottom: -150, right: -100, opacity: 0.6 }}
        />
      </div>

      {/* HEADER */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-10 md:h-12 w-auto" />
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {[
              { l: "Início", id: "top" },
              { l: "Acervo", id: "acervo" },
              { l: "Catálogo", id: "catalogo" },
              { l: "Bônus", id: "bonus" },
              { l: "Planos", id: "planos" },
              { l: "FAQ", id: "faq" },
            ].map((i) => (
              <button
                key={i.id}
                onClick={() => scrollTo(i.id)}
                className="text-[var(--mg-text-dim)] hover:text-[var(--mg-gold)] transition-colors font-medium"
              >
                {i.l}
              </button>
            ))}
          </nav>
          <button
            onClick={() => scrollTo("planos")}
            className="mg-gold-btn text-sm md:text-base !py-2.5 md:!py-3 !px-5 md:!px-6"
          >
            Assinar Agora
          </button>
        </div>
      </header>

      <main id="top" className="relative z-10">
        {/* HERO SPLIT */}
        <section className="relative px-5 md:px-8 pt-10 md:pt-20 pb-16 md:pb-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-16 lg:items-center text-center lg:text-left">
            {/* Headline */}
            <div className="relative order-1 lg:order-1 lg:contents">
              <div className="flex flex-col items-center lg:items-start">
                <span
                  className="mg-caps inline-block mb-5"
                  style={{ color: "var(--mg-gold)" }}
                >
                  ★ A plataforma preferida dos saxofonistas brasileiros
                </span>
                <h1 className="mg-display text-[40px] sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.02] mb-0 lg:mb-6">
                  Toque as músicas que você ama no seu{" "}
                  <span className="mg-gold-text italic">Sax</span> — com partitura e playback profissional
                </h1>
              </div>
            </div>

            {/* Mockup — between headline and subheadline on mobile, right column on desktop */}
            <div className="relative order-2 lg:order-2 lg:row-span-2 my-2 lg:my-0">
              <div
                className="mg-gold-glow"
                style={{ width: 500, height: 500, inset: 0, margin: "auto" }}
              />
              <div
                className="mg-glass-strong relative p-6 md:p-10 flex items-center justify-center"
                style={{ borderRadius: 28 }}
              >
                <img
                  src={heroMockup}
                  alt="Plataforma Clube do Sax — App"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Subheadline + CTA + social proof */}
            <div className="relative order-3 lg:order-3 flex flex-col items-center lg:items-start">
              <p className="text-base md:text-lg text-[var(--mg-text-dim)] leading-relaxed mb-8 max-w-xl">
                Mais de <strong className="text-white">{TOTAL_FMT} partituras com playback de estúdio</strong>,
                organizadas em uma plataforma intuitiva. Estude o que quiser, na hora que quiser, direto do seu
                celular, tablet ou computador.
              </p>

              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
                <button
                  onClick={() => scrollTo("planos")}
                  className="mg-gold-btn inline-flex items-center gap-2 text-base"
                >
                  QUERO TOCAR AGORA
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {heroAvatars.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Saxofonista ${i + 1}`}
                        loading="lazy"
                        className="w-9 h-9 rounded-full border-2 object-cover"
                        style={{ borderColor: "var(--mg-gold)" }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-left">
                    <div className="flex gap-0.5 text-[var(--mg-gold)]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[var(--mg-text-dim)]">+847 saxofonistas ativos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACERVO — Partituras sample */}
        <section id="acervo" className="relative px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="mg-caps inline-block mb-4" style={{ color: "var(--mg-gold)" }}>
                Acervo Premium
              </span>
              <h2 className="mg-display text-3xl md:text-5xl mb-4">
                Partituras de <em className="mg-gold-text">verdade</em>, com playback de estúdio
              </h2>
              <p className="text-[var(--mg-text-dim)] max-w-2xl mx-auto">
                Diagramação profissional, legível em qualquer tela, sincronizada com playbacks gravados em
                estúdio. Você toca junto e evolui muito mais rápido.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {partituras.map((p, i) => (
                <div
                  key={i}
                  className="p-3 transition-all duration-500 hover:-translate-y-1 shadow-2xl"
                  style={{
                    borderRadius: 18,
                    background: "#ffffff",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-white">
                    <img
                      src={p}
                      alt={`Partitura ${i + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-8">
          <hr className="mg-divider-gold" />
        </div>

        {/* COMUNIDADE — depoimentos */}
        <section className="relative px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="mg-caps inline-block mb-4" style={{ color: "var(--mg-gold)" }}>
                Prova Social
              </span>
              <h2 className="mg-display text-3xl md:text-5xl mb-4">
                A <em className="mg-gold-text">Comunidade</em> do Sax
              </h2>
              <p className="text-[var(--mg-text-dim)] max-w-2xl mx-auto">
                Mais de 847 saxofonistas já estão acelerando o aprendizado com o Clube do Sax. Veja o que eles
                dizem:
              </p>
            </div>

            <VideoTestimonialCarousel />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
              {[dep1, dep2, dep3].map((d, i) => (
                <div key={i} className="mg-glass p-3" style={{ borderRadius: 18 }}>
                  <img src={d} alt="Depoimento" className="w-full rounded-xl" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-8">
          <hr className="mg-divider-gold" />
        </div>

        {/* CATÁLOGO DEMONSTRATIVO */}
        <section id="catalogo" className="relative">
          <div className="max-w-6xl mx-auto">
            <SongCatalogV2 />
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-8">
          <hr className="mg-divider-gold" />
        </div>

        {/* PRATIQUE EM QUALQUER LUGAR */}
        <section className="relative px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div
                className="mg-gold-glow"
                style={{ width: 460, height: 460, inset: 0, margin: "auto" }}
              />
              <div className="relative flex items-center justify-center">
                <img
                  src={mockupAcervo}
                  alt="Mockup do app Clube do Sax"
                  className="w-full max-w-sm drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="mg-caps inline-block mb-4" style={{ color: "var(--mg-gold)" }}>
                Mobilidade Total
              </span>
              <h2 className="mg-display text-3xl md:text-5xl leading-tight mb-5">
                Pratique em qualquer lugar, <em className="mg-gold-text">a qualquer hora.</em>
              </h2>
              <p className="text-[var(--mg-text-dim)] mb-8 max-w-lg">
                Sua estação de estudos cabe no bolso. Sem instalar nada, sem CDs, sem PDFs perdidos no e-mail.
                Tudo organizado, com busca por voz e players inteligentes para tocar junto sempre que quiser.
              </p>
              <ul className="space-y-5">
                {[
                  { icon: Wifi, t: "Acesso Online", d: "Conecte do celular, tablet ou computador, onde estiver." },
                  {
                    icon: PlayCircle,
                    t: "Players Inteligentes",
                    d: "Controle de andamento e tonalidade direto no playback.",
                  },
                  { icon: Smartphone, t: "Multi-dispositivo", d: "Funciona em qualquer aparelho, sem instalação." },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 border"
                      style={{
                        background: "rgba(212, 175, 55, 0.08)",
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      }}
                    >
                      <f.icon className="w-5 h-5" style={{ color: "var(--mg-gold)" }} />
                    </div>
                    <div>
                      <h3 className="mg-display text-lg mb-1">{f.t}</h3>
                      <p className="text-sm text-[var(--mg-text-dim)]">{f.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-8">
          <hr className="mg-divider-gold" />
        </div>

        {/* POR QUE CLUBE DO SAX */}
        <section className="relative px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="mg-caps inline-block mb-4" style={{ color: "var(--mg-gold)" }}>
                Diferenciais
              </span>
              <h2 className="mg-display text-3xl md:text-5xl mb-4">
                Por que o <em className="mg-gold-text">Clube do Sax?</em>
              </h2>
              <p className="text-[var(--mg-text-dim)] max-w-2xl mx-auto">
                Tudo o que você precisa para evoluir no sax, em um único lugar.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: BookOpen,
                  t: "Maior acervo do Brasil",
                  d: `+${TOTAL_FMT} partituras com playback profissional para Sax Alto e Tenor.`,
                },
                {
                  icon: Smartphone,
                  t: "Plataforma estilo app",
                  d: "Leve, rápida e organizada — funciona no celular, tablet ou PC sem instalar nada.",
                },
                {
                  icon: Sparkles,
                  t: "Atualizações mensais",
                  d: "Novidades e lançamentos adicionados todos os meses, sem custo extra.",
                },
                {
                  icon: Mic,
                  t: "Suporte e comunidade",
                  d: "Atendimento humano e uma comunidade ativa de saxofonistas para trocar ideias.",
                },
              ].map((f, i) => (
                <div key={i} className="mg-glass p-6 text-center" style={{ borderRadius: 18 }}>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      borderColor: "rgba(212,175,55,0.3)",
                    }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: "var(--mg-gold)" }} />
                  </div>
                  <h3 className="mg-display text-lg mb-2">{f.t}</h3>
                  <p className="text-sm text-[var(--mg-text-dim)] leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-8">
          <hr className="mg-divider-gold" />
        </div>

        {/* BÔNUS */}
        <section id="bonus">
          <BonusSectionV2 />
        </section>

        <div className="max-w-6xl mx-auto px-8">
          <hr className="mg-divider-gold" />
        </div>

        {/* PRICING */}
        <section id="planos" className="relative px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="mg-caps inline-block mb-4" style={{ color: "var(--mg-gold)" }}>
                Investimento
              </span>
              <h2 className="mg-display text-3xl md:text-5xl mb-4">
                Invista no seu <em className="mg-gold-text">talento</em>
              </h2>
              <p className="text-[var(--mg-text-dim)] max-w-2xl mx-auto">
                Compare o que cada plano entrega e escolha o que se adapta ao seu momento musical.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto items-stretch">
              {/* BASIC */}
              <div className="mg-glass p-7 md:p-9 flex flex-col" style={{ borderRadius: 22 }}>
                <h3 className="mg-display text-2xl mb-2">Plano Básico</h3>
                <p className="text-sm text-[var(--mg-text-dim)] mb-6">
                  Ideal para começar com o repertório em PDF.
                </p>
                <div className="mb-7">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-[var(--mg-text-dim)]">R$</span>
                    <span className="mg-display text-5xl">9,90</span>
                    <span className="text-sm text-[var(--mg-text-dim)]">/un.</span>
                  </div>
                  <span className="mg-caps">Pagamento Único · Vitalício</span>
                </div>

                {/* Incluso */}
                <p
                  className="mg-caps mb-3 text-[10px]"
                  style={{ color: "var(--mg-gold)" }}
                >
                  O que está incluso
                </p>
                <ul className="space-y-3 mb-6">
                  {basicIncluded.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(212, 175, 55, 0.15)" }}
                      >
                        <Check className="w-3 h-3" style={{ color: "var(--mg-gold)" }} />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* NÃO incluso */}
                <p className="mg-caps mb-3 text-[10px] text-[var(--mg-text-dim)]">
                  O que NÃO está incluso
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {basicNotIncluded.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[var(--mg-text-dim)]"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <XIcon className="w-3 h-3" style={{ color: "#9b6b6b" }} />
                      </div>
                      <span className="line-through opacity-80">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => goCheckout("essential")}
                  className="mg-ghost-btn w-full uppercase text-sm tracking-widest"
                >
                  Começar Agora
                </button>
                <div className="mt-4">
                  <DeliveryReinforce compact />
                </div>
              </div>

              {/* PREMIUM */}
              <div className="relative">
                <div
                  className="absolute -inset-[2px] rounded-[24px] opacity-70 blur"
                  style={{
                    background: "linear-gradient(135deg, #f9e498, #d4af37, #b8941d)",
                  }}
                />
                <div
                  className="relative p-7 md:p-9 flex flex-col h-full"
                  style={{
                    borderRadius: 22,
                    background: "linear-gradient(180deg, #1a1611 0%, #0f0e0a 100%)",
                    border: "1px solid rgba(212, 175, 55, 0.45)",
                  }}
                >
                  <div className="absolute -top-3 right-6">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(180deg, #f9e498, #d4af37)",
                        color: "#1a1100",
                      }}
                    >
                      <Crown className="w-3 h-3" /> Recomendado
                    </span>
                  </div>

                  <h3 className="mg-display text-2xl mb-2 mg-gold-text">Plano Completo</h3>
                  <p className="text-sm text-[var(--mg-text-dim)] mb-6">
                    A experiência definitiva para saxofonistas.
                  </p>
                  <div className="mb-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-[var(--mg-text-dim)]">R$</span>
                      <span className="mg-display text-5xl mg-gold-text">19,90</span>
                      <span className="text-sm text-[var(--mg-text-dim)]">/un.</span>
                    </div>
                    <span className="mg-caps">Pagamento Único · Vitalício</span>
                  </div>

                  <p
                    className="mg-caps mb-3 text-[10px]"
                    style={{ color: "var(--mg-gold)" }}
                  >
                    Tudo incluso
                  </p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {premiumIncluded.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: "rgba(212, 175, 55, 0.15)" }}
                        >
                          <Check className="w-3 h-3" style={{ color: "var(--mg-gold)" }} />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => goCheckout("premium")}
                    className="mg-gold-btn w-full uppercase text-sm tracking-widest inline-flex items-center justify-center gap-2"
                  >
                    Garantir Acesso Completo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="mt-4">
                    <DeliveryReinforce compact />
                  </div>
                </div>
              </div>
            </div>

            {/* DELIVERY REINFORCEMENT BAND */}
            <div
              className="mg-glass mt-12 p-6 md:p-8 max-w-4xl mx-auto"
              style={{ borderRadius: 22, border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <p
                className="mg-caps text-center mb-5"
                style={{ color: "var(--mg-gold)" }}
              >
                Como você recebe seu acesso
              </p>
              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  {
                    icon: Mail,
                    t: "Por e-mail",
                    d: "Link de acesso enviado automaticamente para o e-mail informado na compra.",
                  },
                  {
                    icon: MessageCircle,
                    t: "Por WhatsApp",
                    d: "Você também recebe o link de acesso direto no seu WhatsApp.",
                  },
                  {
                    icon: Zap,
                    t: "Liberação imediata",
                    d: "Assim que o pagamento é confirmado, o acesso é liberado na hora.",
                  },
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        borderColor: "rgba(212,175,55,0.35)",
                      }}
                    >
                      <b.icon className="w-4 h-4" style={{ color: "var(--mg-gold)" }} />
                    </div>
                    <div>
                      <h4 className="mg-display text-base mb-1">{b.t}</h4>
                      <p className="text-xs text-[var(--mg-text-dim)] leading-relaxed">{b.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-[var(--mg-text-dim)] mt-8">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5" style={{ color: "var(--mg-gold)" }} />
              Pagamento seguro via Cakto · Acesso imediato por e-mail e WhatsApp
            </p>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="relative px-5 md:px-8 py-16 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="mg-glass p-10 md:p-12 text-center" style={{ borderRadius: 24 }}>
              <img
                src="/selo-garantia.png"
                alt="Selo de Garantia de 7 Dias"
                className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-5 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.45)]"
                loading="lazy"
              />
              <h3 className="mg-display text-2xl md:text-3xl mb-3">
                Risco Zero para <em className="mg-gold-text">Você</em>
              </h3>
              <p className="text-sm text-[var(--mg-text-dim)] leading-relaxed">
                Experimente por 7 dias. Se por qualquer motivo você achar que a plataforma não atendeu suas
                expectativas, devolvemos 100% do seu investimento. Sem perguntas.
              </p>
              <p className="mt-5 mg-caps" style={{ color: "var(--mg-gold)" }}>
                100% Satisfação do Dinheiro de Volta
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="mg-caps inline-block mb-4" style={{ color: "var(--mg-gold)" }}>
                Tire suas dúvidas
              </span>
              <h2 className="mg-display text-3xl md:text-5xl">
                Dúvidas <em className="mg-gold-text">Frequentes</em>
              </h2>
            </div>
            <div className="mg-glass p-2 md:p-4" style={{ borderRadius: 20 }}>
              <FAQ />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 mt-16">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <img src={logoClubeSax} alt="Clube do Sax" className="h-10 mb-4" />
              <p className="text-sm text-[var(--mg-text-dim)] max-w-sm">
                Plataforma premium de partituras e playbacks para saxofonistas de todo o Brasil.
              </p>
            </div>
            <div>
              <h4 className="mg-caps mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm text-[var(--mg-text-dim)]">
                <li>
                  <button onClick={() => scrollTo("acervo")} className="hover:text-[var(--mg-gold)]">
                    Acervo
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("catalogo")} className="hover:text-[var(--mg-gold)]">
                    Catálogo
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("bonus")} className="hover:text-[var(--mg-gold)]">
                    Bônus
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("planos")} className="hover:text-[var(--mg-gold)]">
                    Planos
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("faq")} className="hover:text-[var(--mg-gold)]">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mg-caps mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--mg-text-dim)]">
                <li>
                  <a href="/termos-de-uso" className="hover:text-[var(--mg-gold)]">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="/politica-de-privacidade" className="hover:text-[var(--mg-gold)]">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5">
            <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 text-xs text-[var(--mg-text-dim)] flex flex-col md:flex-row gap-2 justify-between">
              <span>© {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.</span>
              <span>CNPJ: 51.919.716/0001-28</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SalesPageV2;
