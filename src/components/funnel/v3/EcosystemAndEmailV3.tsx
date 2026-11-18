import { motion, useReducedMotion } from "framer-motion";
import {
  Mail,
  KeyRound,
  Smartphone,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

import illAcervo from "@/assets/lp3/ill-acervo-partituras.jpg";
import illVoz from "@/assets/lp3/ill-voz-inteligente.jpg";
import illMulti from "@/assets/lp3/ill-multi-dispositivos.jpg";
import illEmail from "@/assets/lp3/ill-acesso-email.jpg";
import { CinematicReveal } from "./SaxThematicEffects";

interface EcosystemAndEmailV3Props {
  onScrollToOffers: () => void;
}

const VISUAL_PILLARS = [
  {
    image: illAcervo,
    badge: "+10.000 Músicas",
    tag: "Alto Eb & Tenor Bb",
    title: "+10.000 Partituras com Playback de Estúdio",
    desc: "Cada música já vem com a partitura revisada para Sax Alto (Eb) e Sax Tenor (Bb) + o playback profissional para tocar junto.",
  },
  {
    image: illVoz,
    badge: "Busca por Voz",
    tag: "Em 1 Segundo",
    title: "Busca por Voz Inteligente no Microfone",
    desc: "Fale o nome da música ou artista no microfone do app e a partitura com playback abre na sua frente automaticamente.",
  },
  {
    image: illMulti,
    badge: "Web App Oficial",
    tag: "Sem Instalar Nada",
    title: "Estude no Celular, Tablet ou Computador",
    desc: "Plataforma estilo Netflix & Spotify que roda liso na tela do seu celular, tablet na estante ou PC — sem ocupar memória.",
  },
  {
    image: illEmail,
    badge: "Acesso Imediato",
    tag: "Login no E-mail",
    title: "Login Direto no Seu E-mail na Mesma Hora",
    desc: "Confirmou o pagamento? No mesmo instante chega no seu e-mail seu Login e Senha exclusivos para entrar no aplicativo.",
  },
];

const AnimatedMiniFeatures = () => {
  const prefersReducedMotion = useReducedMotion();

  const items = [
    {
      title: "+18 Gêneros Organizados",
      metric: "18+ Pastas",
      desc: "MPB, Gospel, Harpa Cristã, Jazz, Bossa Nova, Pop, Rock, Casamento, Sertanejo e muito mais em pastas impecáveis.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-11 h-11" aria-hidden="true">
          <path
            d="M8 20 C8 16 11 14 15 14 L26 14 L31 19 L50 19 C54 19 56 21 56 25 L56 47 C56 51 53 53 49 53 L15 53 C11 53 8 51 8 47 Z"
            fill="rgba(245,185,66,0.16)"
            stroke="#f5b942"
            strokeWidth="2.5"
          />
          <text x="26" y="41" fill="#ffe49e" fontSize="18" fontWeight="bold">
            ♫
          </text>
        </svg>
      ),
    },
    {
      title: "Vídeos Tutoriais Integrados",
      metric: "Passo a Passo",
      desc: "Aulas rápidas dentro do próprio app mostrando como aproveitar cada recurso, busca por voz e organização de repertório.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-11 h-11" aria-hidden="true">
          <rect
            x="8"
            y="14"
            width="48"
            height="34"
            rx="7"
            fill="rgba(30,215,96,0.12)"
            stroke="#1ed760"
            strokeWidth="2.5"
          />
          <polygon points="27,24 27,38 40,31" fill="#1ed760" />
          <line x1="20" y1="53" x2="44" y2="53" stroke="#f5b942" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Harpa Cristã + Guias de Estudo",
      metric: "Completo",
      desc: "Todos os 640 louvores da Harpa Cristã + rotina cronometrada, mapa de tonalidades e repertório essencial.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-11 h-11" aria-hidden="true">
          <path
            d="M14 14 L31 18 L31 50 L14 46 Z"
            fill="rgba(245,185,66,0.2)"
            stroke="#f5b942"
            strokeWidth="2.2"
          />
          <path
            d="M50 14 L33 18 L33 50 L50 46 Z"
            fill="rgba(245,185,66,0.12)"
            stroke="#ffe49e"
            strokeWidth="2.2"
          />
        </svg>
      ),
    },
    {
      title: "Acesso Vitalício + Atualizações",
      metric: "Sem Mensalidade",
      desc: "Pague uma única vez e tenha acesso para sempre — incluindo novas partituras e playbacks adicionados todo mês.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-11 h-11" aria-hidden="true">
          <motion.path
            d="M20 32 C13 32 10 25 14 21 C18 17 25 21 32 32 C39 43 46 47 50 43 C54 39 51 32 44 32 C39 32 35 36 32 32 C29 28 25 32 20 32 Z"
            fill="none"
            stroke="#f5b942"
            strokeWidth="3.2"
            strokeLinecap="round"
            animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -40] }}
            strokeDasharray="8 4"
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
      {items.map((item, idx) => (
        <CinematicReveal key={idx} delay={idx * 0.05}>
          <div className="sax-card h-full rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="rounded-2xl bg-black/45 border border-[#f5b942]/25 p-2 shrink-0">
                  {item.svg}
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#ffe49e] bg-[#f5b942]/12 border border-[#f5b942]/30 px-2.5 py-1 rounded-full">
                  {item.metric}
                </span>
              </div>
              <h3 className="sax-h3 text-white mb-2">{item.title}</h3>
              <p className="text-sm sm:text-[15px] text-[#cfc3ae] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        </CinematicReveal>
      ))}
    </div>
  );
};

const EcosystemAndEmailV3 = ({ onScrollToOffers }: EcosystemAndEmailV3Props) => {
  return (
    <>
      {/* PART 1: ILLUSTRATED ECOSYSTEM SECTION */}
      <section id="ecossistema" className="sax-section">
        <div className="sax-container">
          <div className="text-center mb-10 md:mb-14">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
              <Sparkles className="w-4 h-4 text-[#f5b942] shrink-0" />
              <span>Estação Completa do Saxofonista</span>
            </div>

            <h2 className="sax-h2 text-white mb-4">
              Esqueça PDFs Bagunçados. <br className="hidden sm:block" />
              Tenha <span className="sax-gold-gradient-text italic">Tudo em Um Único App</span>
            </h2>

            <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto">
              Criado sob medida para quem toca{" "}
              <strong className="text-white">Sax Alto (Eb) e Sax Tenor (Bb)</strong> (com as duas
              afinações inclusas em todo o acervo). Veja tudo o que você libera hoje:
            </p>
          </div>

          {/* 4 Visual Illustrated Feature Cards — Mobile-First: Title -> Visual Mockup -> Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VISUAL_PILLARS.map((pillar, idx) => (
              <CinematicReveal key={idx} delay={idx * 0.06}>
                <div className="sax-card h-full rounded-3xl sm:rounded-[28px] p-5 sm:p-6 flex flex-col group">
                  {/* 1. Badges + Title */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                      <span className="rounded-full bg-[#f5b942]/14 border border-[#f5b942]/40 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#ffe49e]">
                        {pillar.badge}
                      </span>
                      <span className="rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1ed760]">
                        {pillar.tag}
                      </span>
                    </div>
                    <h3 className="sax-h3 text-white">{pillar.title}</h3>
                  </div>

                  {/* 2. Visual Illustration / Mockup (Directly between Title and Description!) */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#090604] border border-white/10 mb-4">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* 3. Description */}
                  <p className="sax-body text-[#cfc3ae]">{pillar.desc}</p>
                </div>
              </CinematicReveal>
            ))}
          </div>

          {/* 4 Companion Feature Cards */}
          <AnimatedMiniFeatures />
        </div>
      </section>

      {/* PART 2: DEDICATED INSTANT EMAIL + APP LOGIN VISUAL SECTION
          Mobile-First Order: 1. Badge + H2 Title -> 2. Email/Login Mockup -> 3. Description + 3 Steps + CTA */}
      <section className="sax-section pt-4 md:pt-8">
        <div className="sax-container">
          <div className="sax-card rounded-3xl sm:rounded-[32px] p-5 sm:p-9 md:p-12 border border-[#1ed760]/35 relative overflow-hidden">
            <div
              className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(30,215,96,0.45) 0%, transparent 70%)",
                filter: "blur(45px)",
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-y-6 lg:gap-y-5 lg:gap-x-12 items-center relative z-10">
              {/* 1. TITLE BLOCK (First on Mobile, Top-Left on Desktop) */}
              <div className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-[#1ed760] mb-4">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Entrega 100% Automática • 24h por Dia</span>
                </div>

                <h2 className="sax-h2 text-white">
                  Comprou, Chegou no <span className="text-[#1ed760] italic">Seu E-mail</span>{" "}
                  na Mesma Hora com Seu Login!
                </h2>
              </div>

              {/* 2. E-MAIL + LOGIN MOCKUP (Right between Title and Description on Mobile, Right Column on Desktop!) */}
              <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
                <div className="rounded-3xl overflow-hidden border border-[#f5b942]/35 bg-[#090705] shadow-2xl max-w-md mx-auto lg:max-w-none">
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={illEmail}
                      alt="Acesso enviado imediatamente por e-mail"
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090705] via-[#090705]/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 flex items-center justify-between gap-2 rounded-xl bg-black/85 border border-[#1ed760]/45 px-3.5 py-2">
                      <span className="inline-flex items-center gap-2 text-xs font-extrabold text-white truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1ed760] shrink-0" />
                        Novo E-mail Recebido!
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1ed760] shrink-0">
                        <Clock className="w-3 h-3" /> Na hora
                      </span>
                    </div>
                  </div>

                  {/* Welcome E-mail + App Credentials Mockup */}
                  <div className="p-4 sm:p-6 bg-[#0d0a07] text-left">
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <p className="text-xs text-[#cfc3ae] truncate">
                        <strong className="text-white">De:</strong> Clube do Sax Oficial &lt;acesso@clubedosax.com&gt;
                      </p>
                      <p className="text-sm font-black text-[#ffe49e] mt-1 leading-snug">
                        🎷 Parabéns! Seu Login do Aplicativo Clube do Sax está Liberado!
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] border border-[#f5b942]/25 p-3.5 sm:p-4 mb-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-[#cfc3ae] font-medium">Seu Login:</span>
                        <span className="font-mono text-xs font-bold text-white bg-black/55 px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-full">
                          seu.email@gmail.com
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-[#cfc3ae] font-medium">Sua Senha VIP:</span>
                        <span className="font-mono text-xs font-bold text-[#1ed760] bg-[#1ed760]/10 px-2.5 py-1 rounded-lg border border-[#1ed760]/30">
                          SAX-VIP-2026 ✓
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-[#cfc3ae] font-medium">Status do Acervo:</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#ffe49e]">
                          <CheckCircle2 className="w-4 h-4 text-[#1ed760]" />
                          Vitalício Liberado
                        </span>
                      </div>
                    </div>

                    <div className="w-full rounded-xl bg-gradient-to-r from-[#f5b942] to-[#d99522] text-[#1c1102] font-black text-xs uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 shadow-lg text-center">
                      <Smartphone className="w-4 h-4 shrink-0" />
                      <span>Acessar Aplicativo Clube do Sax</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. DESCRIPTION (SUBTITLE) + 3 STEPS + CTA (Right after Mockup on Mobile!) */}
              <div className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start">
                <p className="sax-body text-[#cfc3ae] mb-6 text-center lg:text-left">
                  Sem esperar aprovação manual e sem links confusos! Nosso sistema libera seu acesso{" "}
                  <strong className="text-white">automaticamente em segundos</strong>, inclusive de
                  madrugada, finais de semana e feriados:
                </p>

                <div className="space-y-3.5 mb-7 text-left">
                  {[
                    {
                      step: "01",
                      icon: ShieldCheck,
                      title: "Escolha Seu Plano com Pagamento Seguro",
                      desc: "Pague via Pix ou Cartão no ambiente criptografado da Wiapy.",
                      accent: "text-[#ffe49e] border-[#f5b942]/40 bg-[#f5b942]/12",
                    },
                    {
                      step: "02",
                      icon: Mail,
                      title: "Receba o E-mail Oficial na Mesma Hora",
                      desc: "Em menos de 1 minuto você recebe um e-mail direto na sua caixa de entrada com o link oficial do aplicativo.",
                      accent: "text-[#1ed760] border-[#1ed760]/40 bg-[#1ed760]/12",
                    },
                    {
                      step: "03",
                      icon: KeyRound,
                      title: "Use Seu Login & Senha e Comece a Tocar!",
                      desc: "Dentro do e-mail já vêm seu Login e Senha prontos para entrar no App pelo celular, tablet ou computador.",
                      accent: "text-[#ffe49e] border-[#f5b942]/40 bg-[#f5b942]/12",
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className="flex items-start gap-3.5 sm:gap-4 rounded-2xl bg-black/45 border border-white/10 p-4"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${s.accent}`}
                      >
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#f5b942] block mb-0.5">
                          Passo {s.step}
                        </span>
                        <h3 className="text-base font-black font-heading text-white leading-snug">
                          {s.title}
                        </h3>
                        <p className="text-sm text-[#cfc3ae] mt-1 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center lg:text-left">
                  <button
                    type="button"
                    onClick={onScrollToOffers}
                    className="sax-cta-btn w-full sm:w-auto px-7 py-4 rounded-2xl text-sm sm:text-base uppercase tracking-wider inline-flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span>Receber Meu Acesso no E-mail Agora</span>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EcosystemAndEmailV3;
