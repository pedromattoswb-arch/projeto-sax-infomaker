import { useState, useEffect, useRef, useCallback } from "react";
import {
  Music,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Mail,
  Sparkles,
  Trophy,
  PlayCircle,
  Zap,
  Users,
  Infinity as InfinityIcon,
} from "lucide-react";

import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import SaxStageIntro from "./SaxStageIntro";
import {
  AmbientSaxBackdrop,
  MusicalStaffDivider,
  InteractiveSaxKeyPad,
  SaxXpToast,
  type SaxType,
} from "./SaxThematicEffects";
import HeroIphoneMockupV3 from "./HeroIphoneMockupV3";
import PartituraMarqueeV3 from "./PartituraMarqueeV3";
import SpotifyPlaybackPlayerV3 from "./SpotifyPlaybackPlayerV3";
import EcosystemAndEmailV3 from "./EcosystemAndEmailV3";
import AppSimulationIphoneV3 from "./AppSimulationIphoneV3";
import WhatsappTestimonialsWallV3 from "./WhatsappTestimonialsWallV3";
import { BonusSectionV3, PricingCardsV3 } from "./BonusAndPricingV3";
import { SongCatalogV3, FaqV3 } from "./CatalogAndFaqV3";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
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
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

const getSaxRank = (xp: number) => {
  if (xp >= 220) return { label: "👑 Mestre do Sax VIP", color: "text-[#1ed760]" };
  if (xp >= 120) return { label: "🎷 Solista de Estúdio", color: "text-[#ffe299]" };
  if (xp >= 50) return { label: "🎼 Músico em Aquecimento", color: "text-[#f5b942]" };
  return { label: "🎵 Explorador do Palco", color: "text-[#c2b59f]" };
};

const SalesPageV3 = () => {
  const [introKey, setIntroKey] = useState<number>(1);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [saxType, setSaxType] = useState<SaxType>("alto");
  const [xp, setXp] = useState<number>(25);
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [xpToast, setXpToast] = useState<{ xp: number; message: string; id: number } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const counterPartituras = useCounter(10000, 2200);
  const counterAlunos = useCounter(847, 1800);
  const counterGeneros = useCounter(18, 1400);

  const earnXp = useCallback((amount: number, reason: string) => {
    setXp((prev) => Math.min(999, prev + amount));
    const id = Date.now();
    setXpToast({ xp: amount, message: reason, id });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setXpToast((cur) => (cur?.id === id ? null : cur));
    }, 2600);
  }, []);

  useEffect(() => {
    let maxMilestone = 0;
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 0;
      setScrollPct(pct);

      if (pct >= 30 && maxMilestone < 1) {
        maxMilestone = 1;
        setXp((p) => Math.min(999, p + 35));
      } else if (pct >= 65 && maxMilestone < 2) {
        maxMilestone = 2;
        setXp((p) => Math.min(999, p + 50));
      } else if (pct >= 90 && maxMilestone < 3) {
        maxMilestone = 3;
        setXp((p) => Math.min(999, p + 65));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rank = getSaxRank(xp);

  return (
    <div className="theme-sax-stage relative min-h-screen overflow-x-hidden font-body">
      {/* AUTOMATIC SAXOPHONE OVERTURE INTRO ON ENTRY */}
      {showIntro && (
        <SaxStageIntro
          key={introKey}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* AMBIENT FLOATING NOTES & SPOTLIGHTS */}
      <AmbientSaxBackdrop />

      {/* GAMIFIED XP TOAST */}
      <SaxXpToast toast={xpToast} />

      {/* STICKY HEADER + GAMIFIED SAXOPHONE QUEST BAR */}
      <header className="sticky top-0 z-50 bg-[#070503]/85 backdrop-blur-xl border-b border-[#f5b942]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={logoClubeSax}
              alt="Clube do Sax"
              className="h-11 sm:h-14 w-auto drop-shadow-[0_0_16px_rgba(245,185,66,0.4)]"
            />

            {/* Gamified Rank + XP Badge */}
            <div className="hidden md:flex items-center gap-2 rounded-full bg-white/[0.04] border border-[#f5b942]/25 px-3.5 py-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#f5b942]" />
              <span className={`text-[11px] font-extrabold ${rank.color}`}>{rank.label}</span>
              <span className="text-[10px] font-black bg-[#f5b942]/20 text-[#ffe299] px-2 py-0.5 rounded-full tabular-nums">
                {xp} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Replay Saxophone Intro Animation Button */}
            <button
              type="button"
              onClick={() => {
                setIntroKey((k) => k + 1);
                setShowIntro(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-[#ffe299]/85 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-[#f5b942]/25 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              title="Rever apresentação do Saxofone"
            >
              <PlayCircle className="w-3.5 h-3.5 text-[#f5b942]" />
              Intro Sax
            </button>

            <button
              type="button"
              onClick={scrollToOffers}
              className="sax-gold-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Entrar no Clube</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Golden Scroll Progress Ribbon */}
        <div className="w-full h-[3px] bg-white/[0.05]">
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
      <div className="relative z-10 border-b border-[#f5b942]/15 bg-[#0e0a06]/80 py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 sm:gap-8 flex-wrap text-[11px] sm:text-xs font-bold text-[#e5dbc8]">
          <span className="inline-flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#f5b942]" />
            +10.000 Partituras c/ Playback
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#1ed760]">
            <Mail className="w-3.5 h-3.5" />
            Login Enviado no E-mail na Mesma Hora
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#f5b942]" />
            +847 Saxofonistas Ativos
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <InfinityIcon className="w-3.5 h-3.5 text-[#f5b942]" />
            Acesso Vitalício
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-10 sm:pt-16 pb-12 md:pb-20 px-4 sm:px-6 md:px-10 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Exclusive Sax Alto & Tenor Badge */}
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mb-6">
              <Headphones className="w-4 h-4 text-[#f5b942]" />
              <span>
                Plataforma Nº 1 do Brasil para{" "}
                <strong className="text-white underline decoration-[#f5b942] underline-offset-4">
                  Sax Alto (Eb) e Sax Tenor (Bb)
                </strong>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black font-heading leading-[1.06] tracking-tight text-white mb-5 sm:mb-6">
              O Maior Acervo de Partituras <br className="hidden sm:block" />
              <span className="sax-gold-gradient-text italic">com Playback de Estúdio</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#c2b59f] font-medium max-w-3xl mx-auto leading-relaxed mb-4">
              Transforme seu celular, tablet ou PC em um verdadeiro{" "}
              <strong className="text-white">Netflix & Spotify do Saxofonista</strong>: são{" "}
              <strong className="text-[#ffe299]">+10.000 partituras profissionais</strong> com
              acompanhamento de banda real, busca por voz e{" "}
              <strong className="text-[#1ed760]">acesso imediato enviado direto no seu e-mail!</strong>
            </p>

            {/* REALISTIC IPHONE 16 PRO MOCKUP SHOWCASE */}
            <HeroIphoneMockupV3 saxType={saxType} onEarnXp={earnXp} />

            {/* PRIMARY HERO CTA + INSTANT EMAIL LOGIN BADGE */}
            <div className="max-w-xl mx-auto mt-6">
              <button
                type="button"
                onClick={scrollToOffers}
                className="sax-cta-btn sax-sheen-overlay relative overflow-hidden w-full sm:w-auto py-5 px-9 sm:px-14 rounded-2xl text-base sm:text-xl uppercase tracking-wider inline-flex items-center justify-center gap-3 cursor-pointer"
              >
                QUERO MEU ACESSO IMEDIATO
                <ArrowRight className="w-6 h-6" />
              </button>

              {/* Clear Instant Email + App Login Notice right below Hero CTA */}
              <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-2xl bg-white/[0.04] border border-[#1ed760]/30 px-4 py-2.5 text-xs font-semibold text-[#e6decb]">
                <span className="inline-flex items-center gap-1.5 text-[#1ed760] font-bold">
                  <Mail className="w-4 h-4" />
                  Receba Login + Senha no E-mail na mesma hora
                </span>
                <span className="hidden sm:inline text-white/25">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#f5b942]" />
                  Pagamento Único • 7 Dias de Garantia
                </span>
              </div>
            </div>

            {/* INTERACTIVE PLAYABLE SAXOPHONE MOTHER-OF-PEARL KEYS */}
            <InteractiveSaxKeyPad
              saxType={saxType}
              onSaxTypeChange={setSaxType}
              onEarnXp={earnXp}
            />

            {/* ANIMATED METRIC COUNTERS */}
            <div
              ref={counterPartituras.ref}
              className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto mt-8"
            >
              <div className="sax-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
                <span className="text-xl sm:text-4xl font-black font-heading sax-gold-gradient-text tabular-nums block">
                  {counterPartituras.count.toLocaleString("pt-BR")}+
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#c2b59f]">
                  Partituras
                </span>
              </div>
              <div ref={counterAlunos.ref} className="sax-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
                <span className="text-xl sm:text-4xl font-black font-heading sax-gold-gradient-text tabular-nums block">
                  {counterAlunos.count}+
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#c2b59f]">
                  Saxofonistas
                </span>
              </div>
              <div ref={counterGeneros.ref} className="sax-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
                <span className="text-xl sm:text-4xl font-black font-heading sax-gold-gradient-text tabular-nums block">
                  {counterGeneros.count}+
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#c2b59f]">
                  Estilos Musicais
                </span>
              </div>
            </div>
          </div>
        </section>

        <MusicalStaffDivider label="Partituras em Alta Definição" />

        {/* CONTINUOUS NON-STOP ZERO-GAP PARTITURA CAROUSEL */}
        <PartituraMarqueeV3 saxType={saxType} onEarnXp={earnXp} />

        <MusicalStaffDivider label="Player de Estúdio • Estilo Spotify" />

        {/* SPOTIFY-STYLE STUDIO PLAYBACK PLAYER */}
        <SpotifyPlaybackPlayerV3
          saxType={saxType}
          onScrollToOffers={scrollToOffers}
          onEarnXp={earnXp}
        />

        <MusicalStaffDivider label="Ecossistema & Acesso no E-mail" />

        {/* VISUAL ILLUSTRATED ECOSYSTEM + INSTANT EMAIL & LOGIN SECTION */}
        <EcosystemAndEmailV3 saxType={saxType} onScrollToOffers={scrollToOffers} />

        <MusicalStaffDivider label="Experimente o App no iPhone" />

        {/* INTERACTIVE APP PREVIEW INSIDE REALISTIC IPHONE 16 PRO */}
        <AppSimulationIphoneV3
          saxType={saxType}
          onSaxTypeChange={setSaxType}
          onScrollToOffers={scrollToOffers}
          onEarnXp={earnXp}
        />

        <MusicalStaffDivider label="Comunidade & Mural WhatsApp" />

        {/* VIDEO TESTIMONIALS + FIXED WHATSAPP GALLERY WALL */}
        <WhatsappTestimonialsWallV3 />

        <MusicalStaffDivider label="Catálogo Real de Músicas" />

        {/* SONG CATALOG SAMPLE */}
        <SongCatalogV3 onScrollToOffers={scrollToOffers} />

        <MusicalStaffDivider label="Presentes Exclusivos VIP" />

        {/* 3 ILLUSTRATED BONUS VIP GUIDES */}
        <BonusSectionV3 />

        {/* PRICING CARDS */}
        <PricingCardsV3 saxType={saxType} />

        {/* 7-DAY UNCONDITIONAL GUARANTEE */}
        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="sax-card rounded-[32px] p-8 sm:p-14 border border-[#f5b942]/35 relative overflow-hidden">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-[#f5b942]/25 blur-3xl rounded-full" />
                <img
                  src="/selo-garantia.png"
                  alt="Selo de Garantia de 7 Dias"
                  className="w-28 h-28 sm:w-36 sm:h-36 relative z-10 drop-shadow-2xl mx-auto"
                  loading="lazy"
                />
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-heading text-white mb-4 tracking-tight">
                Teste Tudo Por <span className="sax-gold-gradient-text italic">7 Dias Sem Risco!</span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] leading-relaxed">
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
        <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#f5b942]" />
              O Palco Está Pronto Para Você
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-heading text-white mb-6 tracking-tight leading-[1.1]">
              Entre Agora no <span className="sax-gold-gradient-text italic">Clube do Sax</span> e{" "}
              <br className="hidden sm:block" />
              Comece a Tocar em Menos de 1 Minuto!
            </h2>

            <p className="text-base sm:text-lg text-[#c2b59f] max-w-2xl mx-auto mb-8 leading-relaxed">
              Mais de 10.000 partituras com playback de estúdio para Sax Alto e Sax Tenor, busca por
              voz e acesso vitalício a partir de <strong className="text-white">R$ 14,90</strong> —
              com <strong className="text-[#1ed760]">Login enviado direto no seu e-mail na mesma hora!</strong>
            </p>

            <button
              type="button"
              onClick={scrollToOffers}
              className="sax-cta-btn sax-sheen-overlay relative overflow-hidden py-5 px-10 sm:px-14 rounded-2xl text-base sm:text-xl uppercase tracking-wider inline-flex items-center gap-3 cursor-pointer"
            >
              GARANTIR MEU ACESSO AGORA
              <ArrowRight className="w-6 h-6" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs font-semibold text-[#c2b59f]">
              <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
                <Zap className="w-3.5 h-3.5 text-[#1ed760]" /> Login Imediato por E-mail
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
                <Lock className="w-3.5 h-3.5 text-[#f5b942]" /> Pagamento 100% Seguro
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
                <BadgeCheck className="w-3.5 h-3.5 text-[#1ed760]" /> 7 Dias de Garantia
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 px-4 border-t border-[#f5b942]/15 bg-[#050302] text-center">
        <img
          src={logoClubeSax}
          alt="Clube do Sax"
          className="h-14 mx-auto mb-4 drop-shadow-[0_0_16px_rgba(245,185,66,0.3)]"
        />

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-xs text-[#c2b59f]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#f5b942]" /> Site 100% Seguro
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#1ed760]" /> Pagamento via Wiapy
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#f5b942]" /> Entrega Imediata no E-mail
          </span>
        </div>

        <p className="text-xs text-[#c2b59f]/80 max-w-md mx-auto leading-relaxed mb-3">
          Produto digital com entrega automática na mesma hora. Assim que o pagamento é confirmado,
          você recebe no seu e-mail seu login e senha exclusivos para entrar no aplicativo Clube do Sax.
        </p>

        <div className="flex items-center justify-center gap-4 mb-3 text-xs text-[#c2b59f]">
          <a href="/termos-de-uso" className="hover:text-[#ffe299] underline-offset-4 hover:underline">
            Termos de Uso
          </a>
          <span className="opacity-40">•</span>
          <a
            href="/politica-de-privacidade"
            className="hover:text-[#ffe299] underline-offset-4 hover:underline"
          >
            Política de Privacidade
          </a>
        </div>

        <p className="text-xs text-[#c2b59f]/65">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
          <br />
          CNPJ: 51.919.716/0001-28
        </p>
      </footer>

      {/* STICKY MOBILE BOTTOM CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#090604]/95 backdrop-blur-xl border-t border-[#f5b942]/30 p-2.5 z-50 safe-bottom">
        <button
          type="button"
          onClick={scrollToOffers}
          className="w-full sax-cta-btn py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          LIBERAR ACESSO NO E-MAIL — A PARTIR DE R$ 14,90
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="h-16 md:hidden" />
    </div>
  );
};

export default SalesPageV3;
