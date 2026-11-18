import { useState, useEffect, useRef } from "react";
import {
  Music,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Mail,
  Sparkles,
  Zap,
  Users,
  Infinity as InfinityIcon,
  LogIn,
  Menu,
  X,
} from "lucide-react";

import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import SaxStageIntro from "./SaxStageIntro";
import {
  AmbientSaxBackdrop,
  MusicalStaffDivider,
} from "./SaxThematicEffects";
import HeroIphoneMockupV3 from "./HeroIphoneMockupV3";
import PartituraMarqueeV3 from "./PartituraMarqueeV3";
import SpotifyPlaybackPlayerV3 from "./SpotifyPlaybackPlayerV3";
import EcosystemAndEmailV3 from "./EcosystemAndEmailV3";
import AppSimulationIphoneV3 from "./AppSimulationIphoneV3";
import WhatsappTestimonialsWallV3 from "./WhatsappTestimonialsWallV3";
import { BonusSectionV3, PricingCardsV3 } from "./BonusAndPricingV3";
import { SongCatalogV3, FaqV3 } from "./CatalogAndFaqV3";

const APP_LOGIN_URL = "https://app.clubedosax.com/login";

function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }

    setCount(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const scrollToOffers = () => scrollToSection("ofertas");

const NAV_LINKS = [
  { label: "Partituras", id: "partituras" },
  { label: "Playbacks", id: "playbacks" },
  { label: "O Aplicativo", id: "simulador-app" },
  { label: "Depoimentos", id: "depoimentos" },
  { label: "Planos", id: "ofertas" },
  { label: "Dúvidas", id: "faq" },
];

const SalesPageV3 = () => {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const counterPartituras = useCounter(10000, 2000);
  const counterAlunos = useCounter(847, 1600);
  const counterGeneros = useCounter(18, 1300);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 0;
      setScrollPct(pct);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="theme-sax-stage relative min-h-screen font-body">
      {/* Accessible Skip Link */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[130] focus:rounded-xl focus:bg-[#f5b942] focus:px-4 focus:py-2.5 focus:text-sm focus:font-black focus:text-[#1c1102]"
      >
        Pular para o conteúdo principal
      </a>

      {/* AUTOMATIC SAXOPHONE OVERTURE INTRO ON ENTRY */}
      {showIntro && <SaxStageIntro onComplete={() => setShowIntro(false)} />}

      {/* AMBIENT STAGE SPOTLIGHTS & NOTES */}
      <AmbientSaxBackdrop />

      {/* STICKY HEADER WITH DESKTOP NAV + COMPACT MOBILE MENU */}
      <header className="sticky top-0 z-50 bg-[#070503]/90 backdrop-blur-xl border-b border-[#f5b942]/20">
        <div className="sax-container px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2.5">
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Clube do Sax — Voltar ao topo"
          >
            <img
              src={logoClubeSax}
              alt="Clube do Sax"
              width={64}
              height={46}
              fetchPriority="high"
              className="h-10 sm:h-12 w-auto drop-shadow-[0_0_14px_rgba(245,185,66,0.38)]"
            />
          </a>

          {/* Desktop Section Navigation */}
          <nav aria-label="Navegação da página" className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-semibold text-[#cfc3ae] hover:text-[#ffe49e] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={scrollToOffers}
              className="sax-gold-btn px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver Planos</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile / Tablet Compact Menu Button */}
            <button
              type="button"
              onClick={() => setNavOpen((prev) => !prev)}
              aria-expanded={navOpen}
              aria-controls="lp3-mobile-nav"
              aria-label={navOpen ? "Fechar menu" : "Abrir menu de seções"}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-[#f5b942]/25 flex items-center justify-center text-[#ffe49e] cursor-pointer shrink-0"
            >
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Compact Mobile Dropdown Menu */}
        {navOpen && (
          <nav
            id="lp3-mobile-nav"
            aria-label="Menu móvel"
            className="lg:hidden border-t border-[#f5b942]/15 bg-[#0c0905]/98 px-4 py-3"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setNavOpen(false);
                    scrollToSection(item.id);
                  }}
                  className="min-h-[42px] rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 px-3 py-2 text-xs sm:text-sm font-bold text-white text-left cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              <a
                href={APP_LOGIN_URL}
                className="min-h-[40px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5b942]/15 border border-[#f5b942]/35 px-3 py-2 text-xs font-extrabold text-[#ffe49e]"
              >
                <LogIn className="w-3.5 h-3.5" />
                Já sou aluno • Entrar no App
              </a>
            </div>
          </nav>
        )}

        {/* Golden Scroll Progress Indicator */}
        <div className="w-full h-[3px] bg-white/[0.05]" aria-hidden="true">
          <div
            className="h-full transition-[width] duration-150"
            style={{
              width: `${scrollPct}%`,
              background: "linear-gradient(90deg, #c98317 0%, #f5b942 55%, #1ed760 100%)",
            }}
          />
        </div>
      </header>

      {/* TOP AUTHORITY + INSTANT EMAIL STRIP */}
      <div id="topo" className="relative z-10 border-b border-[#f5b942]/15 bg-[#0e0a06]/85 py-2.5 px-4">
        <div className="sax-container flex items-center justify-center gap-x-5 gap-y-1.5 flex-wrap text-xs font-bold text-[#e5dbc8]">
          <span className="inline-flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#f5b942] shrink-0" />
            +10.000 Partituras c/ Playback
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#1ed760]">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            Login Enviado no E-mail na Mesma Hora
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#f5b942] shrink-0" />
            +847 Saxofonistas Ativos
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <InfinityIcon className="w-3.5 h-3.5 text-[#f5b942] shrink-0" />
            Acesso Vitalício
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main id="conteudo-principal" className="relative z-10">
        {/* HERO SECTION — 100% Mobile-First: 1. Badge + H1 Title -> 2. iPhone Mockup -> 3. Subtitle (Description) + CTA + Counters */}
        <section className="pt-7 sm:pt-12 pb-12 md:pb-20 px-4 sm:px-6 md:px-10 relative">
          <div className="sax-container">
            <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-y-6 lg:gap-y-5 lg:gap-x-12 items-center">
              {/* 1. BADGE + H1 TITLE (Always First!) */}
              <div className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end text-center lg:text-left">
                <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider mb-4">
                  <Headphones className="w-4 h-4 text-[#f5b942] shrink-0" />
                  <span>
                    Aplicativo exclusivo para{" "}
                    <strong className="text-white underline decoration-[#f5b942] underline-offset-4">
                      Sax Alto (Eb) e Sax Tenor (Bb)
                    </strong>
                  </span>
                </div>

                <h1 className="sax-h1 text-white">
                  O Maior Acervo de Partituras <br className="hidden sm:block" />
                  <span className="sax-gold-gradient-text italic">com Playback de Estúdio</span>
                </h1>
              </div>

              {/* 2. IPHONE 16 PRO APP MOCKUP (Directly between H1 Title and Subtitle on Mobile!) */}
              <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 my-1 lg:my-0">
                <HeroIphoneMockupV3 />
              </div>

              {/* 3. SUBTITLE (DESCRIPTION) + PRIMARY CTA + COUNTERS (Right after Mockup on Mobile!) */}
              <div className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start text-center lg:text-left">
                <p className="sax-body-lg text-[#cfc3ae] font-medium max-w-2xl mx-auto lg:mx-0 mb-6">
                  Transforme seu celular, tablet ou PC em um verdadeiro{" "}
                  <strong className="text-white">Netflix & Spotify do Saxofonista</strong>: são{" "}
                  <strong className="text-[#ffe49e]">+10.000 partituras profissionais</strong> com
                  acompanhamento de banda real, busca por voz e{" "}
                  <strong className="text-[#1ed760]">
                    acesso imediato enviado direto no seu e-mail!
                  </strong>
                </p>

                <div>
                  <button
                    type="button"
                    onClick={scrollToOffers}
                    className="sax-cta-btn sax-sheen-overlay relative overflow-hidden w-full sm:w-auto py-4 sm:py-5 px-8 sm:px-12 rounded-2xl text-base sm:text-lg uppercase tracking-wider inline-flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>QUERO MEU ACESSO IMEDIATO</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  </button>

                  <div className="mt-4 inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 rounded-2xl bg-white/[0.04] border border-[#1ed760]/30 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#e6decb]">
                    <span className="inline-flex items-center gap-1.5 text-[#1ed760] font-bold">
                      <Mail className="w-4 h-4 shrink-0" />
                      Receba Login + Senha no E-mail na mesma hora
                    </span>
                    <span className="hidden sm:inline text-white/25">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#f5b942] shrink-0" />
                      Pagamento Único • 7 Dias de Garantia
                    </span>
                  </div>
                </div>

                {/* ANIMATED METRIC COUNTERS */}
                <div
                  ref={counterPartituras.ref}
                  className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl mx-auto lg:mx-0 mt-7"
                >
                  <div className="sax-card rounded-2xl p-3 sm:p-4 text-center min-w-0">
                    <span className="text-lg min-[375px]:text-xl sm:text-3xl font-black font-heading sax-gold-gradient-text tabular-nums block leading-tight">
                      {counterPartituras.count.toLocaleString("pt-BR")}+
                    </span>
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#cfc3ae] block mt-1 truncate">
                      Partituras
                    </span>
                  </div>
                  <div
                    ref={counterAlunos.ref}
                    className="sax-card rounded-2xl p-3 sm:p-4 text-center min-w-0"
                  >
                    <span className="text-lg min-[375px]:text-xl sm:text-3xl font-black font-heading sax-gold-gradient-text tabular-nums block leading-tight">
                      {counterAlunos.count}+
                    </span>
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#cfc3ae] block mt-1 truncate">
                      Saxofonistas
                    </span>
                  </div>
                  <div
                    ref={counterGeneros.ref}
                    className="sax-card rounded-2xl p-3 sm:p-4 text-center min-w-0"
                  >
                    <span className="text-lg min-[375px]:text-xl sm:text-3xl font-black font-heading sax-gold-gradient-text tabular-nums block leading-tight">
                      {counterGeneros.count}+
                    </span>
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#cfc3ae] block mt-1 truncate">
                      Estilos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MusicalStaffDivider label="Partituras em Alta Definição" />

        {/* CONTINUOUS NON-STOP ZERO-GAP PARTITURA CAROUSEL */}
        <PartituraMarqueeV3 saxType="alto" />

        <MusicalStaffDivider label="Player de Estúdio • Estilo Spotify" />

        {/* SPOTIFY-STYLE STUDIO PLAYBACK PLAYER (Compact Hamburger on Mobile + 100% Fixed Zero Scroll) */}
        <SpotifyPlaybackPlayerV3 saxType="alto" onScrollToOffers={scrollToOffers} />

        <MusicalStaffDivider label="Ecossistema & Acesso no E-mail" />

        {/* VISUAL ILLUSTRATED ECOSYSTEM + INSTANT EMAIL & LOGIN SECTION (Title -> Mockup -> Description) */}
        <EcosystemAndEmailV3 onScrollToOffers={scrollToOffers} />

        <MusicalStaffDivider label="Interface Oficial no iPhone" />

        {/* APP SHOWCASE INSIDE REALISTIC IPHONE 16 PRO (Title -> Mockup -> Description) */}
        <AppSimulationIphoneV3 onScrollToOffers={scrollToOffers} />

        <MusicalStaffDivider label="Comunidade & Mural WhatsApp" />

        {/* VIDEO TESTIMONIALS + FIXED WHATSAPP GALLERY WALL */}
        <WhatsappTestimonialsWallV3 />

        <MusicalStaffDivider label="Catálogo Real de Músicas" />

        {/* SONG CATALOG SAMPLE */}
        <SongCatalogV3 onScrollToOffers={scrollToOffers} />

        <MusicalStaffDivider label="Presentes Exclusivos VIP" />

        {/* 3 ILLUSTRATED BONUS VIP GUIDES (Title -> Mockup -> Description) */}
        <BonusSectionV3 />

        {/* PRICING CARDS */}
        <PricingCardsV3 saxType="alto" />

        {/* 7-DAY UNCONDITIONAL GUARANTEE (Title -> Seal Visual -> Description) */}
        <section className="sax-section">
          <div className="sax-container max-w-3xl text-center">
            <div className="sax-card rounded-3xl sm:rounded-[32px] p-6 sm:p-12 md:p-14 border border-[#f5b942]/35 relative overflow-hidden">
              <h2 className="sax-h2 text-white mb-5">
                Sua Satisfação Garantida Por{" "}
                <span className="sax-gold-gradient-text italic">7 Dias Sem Risco!</span>
              </h2>

              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-[#f5b942]/25 blur-3xl rounded-full" />
                <img
                  src="/selo-garantia.png"
                  alt="Selo de Garantia de 7 Dias"
                  width={144}
                  height={144}
                  loading="lazy"
                  decoding="async"
                  className="w-28 h-28 sm:w-36 sm:h-36 relative z-10 drop-shadow-2xl mx-auto"
                />
              </div>

              <p className="sax-body-lg text-[#cfc3ae]">
                Receba seu login por e-mail agora mesmo, entre no aplicativo, baixe partituras e toque
                junto com os playbacks. Se dentro de 7 dias você não ficar 100% apaixonado pela
                plataforma, devolvemos todo o seu dinheiro{" "}
                <strong className="text-white">sem perguntas e sem burocracia.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqV3 />

        {/* FINAL STAGE CTA */}
        <section className="sax-section">
          <div className="sax-container max-w-4xl text-center relative z-10">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-5">
              <Sparkles className="w-4 h-4 text-[#f5b942] shrink-0" />
              <span>O Palco Está Pronto Para Você</span>
            </div>

            <h2 className="sax-h2 text-white mb-5">
              Entre Agora no <span className="sax-gold-gradient-text italic">Clube do Sax</span> e{" "}
              <br className="hidden sm:block" />
              Comece a Tocar em Menos de 1 Minuto!
            </h2>

            <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto mb-8">
              Mais de 10.000 partituras com playback de estúdio para Sax Alto e Sax Tenor, busca por
              voz e acesso vitalício a partir de <strong className="text-white">R$ 14,90</strong> —
              com <strong className="text-[#1ed760]">Login enviado direto no seu e-mail na mesma hora!</strong>
            </p>

            <button
              type="button"
              onClick={scrollToOffers}
              className="sax-cta-btn sax-sheen-overlay relative overflow-hidden w-full sm:w-auto py-4 sm:py-5 px-8 sm:px-14 rounded-2xl text-base sm:text-lg uppercase tracking-wider inline-flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>GARANTIR MEU ACESSO AGORA</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs sm:text-sm font-semibold text-[#cfc3ae]">
              <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
                <Zap className="w-4 h-4 text-[#1ed760] shrink-0" /> Login Imediato por E-mail
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
                <Lock className="w-4 h-4 text-[#f5b942] shrink-0" /> Pagamento 100% Seguro
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
                <BadgeCheck className="w-4 h-4 text-[#1ed760] shrink-0" /> 7 Dias de Garantia
              </span>
            </div>
          </div>
        </section>

        {/* ALREADY SUBSCRIBED / STUDENT LOGIN BOX AT THE VERY END OF THE PAGE */}
        <section aria-label="Acesso para alunos assinantes" className="px-4 sm:px-6 pb-12 pt-2 relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="sax-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#f5b942]/35 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#f5b942] mb-1">
                  Área do Aluno
                </p>
                <h3 className="text-base sm:text-lg font-black font-heading text-white leading-snug">
                  Já assinou o Clube do Sax?
                </h3>
                <p className="text-xs sm:text-sm text-[#cfc3ae] mt-0.5">
                  Acesse agora sua conta para abrir o aplicativo e suas partituras.
                </p>
              </div>

              <a
                href={APP_LOGIN_URL}
                className="sax-gold-btn w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shrink-0"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Entrar no Aplicativo</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 px-4 border-t border-[#f5b942]/15 bg-[#050302] text-center">
        <img
          src={logoClubeSax}
          alt="Clube do Sax"
          width={76}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-14 w-auto mx-auto mb-4 drop-shadow-[0_0_16px_rgba(245,185,66,0.3)]"
        />

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-xs sm:text-sm text-[#cfc3ae]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#f5b942] shrink-0" /> Site 100% Seguro
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#1ed760] shrink-0" /> Pagamento via Wiapy
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#f5b942] shrink-0" /> Entrega Imediata no E-mail
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#cfc3ae]/85 max-w-md mx-auto leading-relaxed mb-4">
          Produto digital com entrega automática na mesma hora. Assim que o pagamento é confirmado,
          você recebe no seu e-mail seu login e senha exclusivos para entrar no aplicativo Clube do Sax.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-xs sm:text-sm text-[#cfc3ae]">
          <a href="/termos-de-uso" className="hover:text-[#ffe49e] underline-offset-4 hover:underline">
            Termos de Uso
          </a>
          <span className="opacity-40">•</span>
          <a
            href="/politica-de-privacidade"
            className="hover:text-[#ffe49e] underline-offset-4 hover:underline"
          >
            Política de Privacidade
          </a>
          <span className="opacity-40">•</span>
          <a
            href={APP_LOGIN_URL}
            className="text-[#ffe49e] font-bold hover:underline underline-offset-4"
          >
            Login do Aluno
          </a>
        </div>

        <p className="text-xs text-[#cfc3ae]/70">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
          <br />
          CNPJ: 51.919.716/0001-28
        </p>
      </footer>

      {/* STICKY MOBILE BOTTOM CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#090604]/95 backdrop-blur-md border-t border-[#f5b942]/30 p-2.5 z-50 safe-bottom">
        <button
          type="button"
          onClick={scrollToOffers}
          className="w-full sax-cta-btn py-3.5 px-4 rounded-xl text-xs min-[375px]:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="truncate">GARANTIR ACESSO — A PARTIR DE R$ 14,90</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Clearance spacer so sticky mobile CTA never covers footer or student login box */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
};

export default SalesPageV3;
