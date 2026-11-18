import { motion } from "framer-motion";
import {
  Mail,
  KeyRound,
  Smartphone,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Video,
  BookOpen,
  Infinity as InfinityIcon,
  ShieldCheck,
  Clock,
} from "lucide-react";

import illAcervo from "@/assets/lp3/ill-acervo-partituras.jpg";
import illVoz from "@/assets/lp3/ill-voz-inteligente.jpg";
import illMulti from "@/assets/lp3/ill-multi-dispositivos.jpg";
import illEmail from "@/assets/lp3/ill-acesso-email.jpg";
import type { SaxType } from "./SaxThematicEffects";

interface EcosystemAndEmailV3Props {
  saxType: SaxType;
  onScrollToOffers: () => void;
}

const VISUAL_PILLARS = [
  {
    image: illAcervo,
    badge: "+10.000 Músicas",
    xpTag: "+250 XP",
    title: "+10.000 Partituras com Playback de Estúdio",
    desc: "Cada música já vem com a partitura revisada para Sax Alto (Eb) e Sax Tenor (Bb) + o playback profissional para tocar junto.",
  },
  {
    image: illVoz,
    badge: "Exclusivo IA",
    xpTag: "+200 XP",
    title: "Busca por Voz Inteligente em 1 Segundo",
    desc: "Toque no microfone, fale o nome da música ou artista e o aplicativo abre a partitura e o playback automaticamente.",
  },
  {
    image: illMulti,
    badge: "Web App VIP",
    xpTag: "+200 XP",
    title: "Estude no Celular, Tablet ou Computador",
    desc: "Plataforma estilo Netflix & Spotify que roda liso na tela do seu celular, iPad na estante ou PC — sem precisar instalar nada pesado.",
  },
  {
    image: illEmail,
    badge: "Na Mesma Hora",
    xpTag: "+350 XP",
    title: "Login Direto no Seu E-mail Imediatamente",
    desc: "Confirmou o pagamento? No mesmo instante chega no seu e-mail seu Login e Senha exclusivos para entrar no aplicativo e tocar.",
  },
];

/* Animated SVG Vector Mini-Drawings ("GIF-style" 60fps loops) for the 4 extra ecosystem cards */
const AnimatedMiniFeatures = () => {
  const items = [
    {
      title: "+18 Gêneros Organizados",
      metric: "18+ Pastas",
      desc: "MPB, Gospel, Harpa Cristã, Jazz, Bossa Nova, Pop, Rock, Casamento, Sertanejo e muito mais em pastas impecáveis.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <motion.path
            d="M8 20 C8 16 11 14 15 14 L26 14 L31 19 L50 19 C54 19 56 21 56 25 L56 47 C56 51 53 53 49 53 L15 53 C11 53 8 51 8 47 Z"
            fill="rgba(245,185,66,0.16)"
            stroke="#f5b942"
            strokeWidth="2.5"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.text
            x="26"
            y="41"
            fill="#ffe299"
            fontSize="18"
            fontWeight="bold"
            animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            ♫
          </motion.text>
        </svg>
      ),
      icon: FolderOpen,
    },
    {
      title: "Vídeos Tutoriais Integrados",
      metric: "Passo a Passo",
      desc: "Aulas rápidas dentro do próprio app mostrando como aproveitar cada recurso, busca por voz e organização de repertório.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
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
          <motion.polygon
            points="27,24 27,38 40,31"
            fill="#1ed760"
            animate={{ scale: [0.92, 1.12, 0.92] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "32px 31px" }}
          />
          <line x1="20" y1="53" x2="44" y2="53" stroke="#f5b942" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      icon: Video,
    },
    {
      title: "Harpa Cristã + Guias de Estudo",
      metric: "Completo",
      desc: "Todos os 640 louvores da Harpa Cristã + rotina cronometrada, mapa de tonalidades e repertório essencial.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <motion.path
            d="M14 14 L31 18 L31 50 L14 46 Z"
            fill="rgba(245,185,66,0.2)"
            stroke="#f5b942"
            strokeWidth="2.2"
            animate={{ rotateY: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.path
            d="M50 14 L33 18 L33 50 L50 46 Z"
            fill="rgba(245,185,66,0.12)"
            stroke="#ffe299"
            strokeWidth="2.2"
            animate={{ rotateY: [0, -12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </svg>
      ),
      icon: BookOpen,
    },
    {
      title: "Acesso Vitalício + Atualizações",
      metric: "Sem Mensalidade",
      desc: "Pague uma única vez e tenha acesso para sempre — incluindo novas partituras e playbacks adicionados todo mês.",
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <motion.path
            d="M20 32 C13 32 10 25 14 21 C18 17 25 21 32 32 C39 43 46 47 50 43 C54 39 51 32 44 32 C39 32 35 36 32 32 C29 28 25 32 20 32 Z"
            fill="none"
            stroke="#f5b942"
            strokeWidth="3.2"
            strokeLinecap="round"
            animate={{ strokeDashoffset: [0, -40] }}
            strokeDasharray="8 4"
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      ),
      icon: InfinityIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="sax-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-2xl bg-black/45 border border-[#f5b942]/25 p-2">
                {item.svg}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ffe299] bg-[#f5b942]/12 border border-[#f5b942]/30 px-2.5 py-1 rounded-full">
                {item.metric}
              </span>
            </div>
            <h3 className="text-lg font-black font-heading text-white mb-2 leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-[#c2b59f] leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const EcosystemAndEmailV3 = ({ saxType, onScrollToOffers }: EcosystemAndEmailV3Props) => {
  return (
    <>
      {/* PART 1: ILLUSTRATED ECOSYSTEM SECTION */}
      <section className="py-16 md:py-24 px-5 md:px-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#f5b942]" />
              Estação Completa do Saxofonista
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-4">
              Esqueça PDFs Bagunçados. <br className="hidden sm:block" />
              Tenha <span className="sax-gold-gradient-text italic">Tudo em Um Único App</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] max-w-2xl mx-auto">
              Criado sob medida para quem toca{" "}
              <strong className="text-white">
                {saxType === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)"}
              </strong>{" "}
              (com as duas afinações inclusas em todo o acervo). Veja tudo o que você libera hoje:
            </p>
          </div>

          {/* 4 Visual Illustrated Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VISUAL_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="sax-card rounded-[28px] overflow-hidden flex flex-col group"
              >
                {/* Custom Generated 3D/Editorial Illustration Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#090604]">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a06] via-transparent to-black/25" />

                  {/* Floating Gamified Badges on Illustration */}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-black/75 backdrop-blur-md border border-[#f5b942]/45 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#ffe299]">
                      {pillar.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-[#1ed760]/20 backdrop-blur-md border border-[#1ed760]/50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1ed760]">
                      {pillar.xpTag}
                    </span>
                  </div>
                </div>

                {/* Card Copy */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black font-heading text-white mb-2.5 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#c2b59f] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4 Animated SVG Drawing Cards */}
          <AnimatedMiniFeatures />
        </div>
      </section>

      {/* PART 2: DEDICATED INSTANT EMAIL + APP LOGIN VISUAL SECTION */}
      <section className="py-16 md:py-24 px-5 md:px-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="sax-card rounded-[32px] p-6 sm:p-10 md:p-12 border border-[#1ed760]/35 relative overflow-hidden">
            {/* Ambient Emerald & Brass Glow */}
            <div
              className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-25"
              style={{
                background: "radial-gradient(circle, rgba(30,215,96,0.45) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Step-by-Step Instant Email Explanation */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#1ed760] mb-5">
                  <Zap className="w-3.5 h-3.5" />
                  Entrega 100% Automática • 24 Horas por Dia
                </div>

                <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white mb-4 leading-[1.12]">
                  Comprou, Chegou no <span className="text-[#1ed760] italic">Seu E-mail</span>{" "}
                  na Mesma Hora com Seu Login!
                </h2>

                <p className="text-sm sm:text-base text-[#c2b59f] leading-relaxed mb-7">
                  Sem esperar aprovação manual e sem links confusos! Nosso sistema libera seu acesso{" "}
                  <strong className="text-white">automaticamente em segundos</strong>, inclusive de
                  madrugada, finais de semana e feriados:
                </p>

                {/* 3 Illustrated Animated Steps */}
                <div className="space-y-4 mb-8">
                  {[
                    {
                      step: "01",
                      icon: ShieldCheck,
                      title: "Escolha Seu Plano com Pagamento Seguro",
                      desc: "Pague via Pix ou Cartão no ambiente criptografado da Wiapy.",
                      accent: "text-[#ffe299] border-[#f5b942]/40 bg-[#f5b942]/12",
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
                      accent: "text-[#ffe299] border-[#f5b942]/40 bg-[#f5b942]/12",
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className="flex items-start gap-4 rounded-2xl bg-black/40 border border-white/10 p-4"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${s.accent}`}
                      >
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#f5b942]">
                            Passo {s.step}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-black font-heading text-white">
                          {s.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#c2b59f] mt-0.5 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onScrollToOffers}
                  className="sax-cta-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2.5"
                >
                  Receber Meu Acesso no E-mail Agora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Column: Live Animated E-mail + Login Pass Visual Card */}
              <div className="relative">
                {/* Generated Golden Envelope Illustration Top Banner */}
                <div className="rounded-3xl overflow-hidden border border-[#f5b942]/35 bg-[#090705] shadow-2xl">
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={illEmail}
                      alt="Acesso enviado imediatamente por e-mail"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090705] via-[#090705]/30 to-transparent" />
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-3 left-4 right-4 flex items-center justify-between rounded-xl bg-black/80 backdrop-blur-md border border-[#1ed760]/45 px-3.5 py-2"
                    >
                      <span className="inline-flex items-center gap-2 text-xs font-extrabold text-white">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1ed760] animate-ping" />
                        Novo E-mail Recebido Agora!
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1ed760]">
                        <Clock className="w-3 h-3" /> Há 2 seg
                      </span>
                    </motion.div>
                  </div>

                  {/* Simulated Real Welcome E-mail Card */}
                  <div className="p-5 sm:p-6 bg-[#0d0a07]">
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <p className="text-[11px] text-[#c2b59f]">
                        <strong className="text-white">De:</strong> Clube do Sax Oficial &lt;acesso@clubedosax.com&gt;
                      </p>
                      <p className="text-xs sm:text-sm font-black text-[#ffe299] mt-1">
                        🎷 Parabéns! Seu Login do Aplicativo Clube do Sax está Liberado!
                      </p>
                    </div>

                    {/* Credentials Preview Box */}
                    <div className="rounded-2xl bg-white/[0.04] border border-[#f5b942]/25 p-4 mb-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#c2b59f] font-medium">Seu Login:</span>
                        <span className="font-mono font-bold text-white bg-black/50 px-2.5 py-1 rounded-lg border border-white/10">
                          seu.email@gmail.com
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#c2b59f] font-medium">Sua Senha VIP:</span>
                        <span className="font-mono font-bold text-[#1ed760] bg-[#1ed760]/10 px-2.5 py-1 rounded-lg border border-[#1ed760]/30">
                          SAX-VIP-2026 ✓
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#c2b59f] font-medium">Status do Acervo:</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#ffe299]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760]" />
                          Vitalício Liberado
                        </span>
                      </div>
                    </div>

                    {/* Mock Button Inside Email */}
                    <div className="w-full rounded-xl bg-gradient-to-r from-[#f5b942] to-[#d99522] text-[#1c1102] font-black text-xs uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 shadow-lg">
                      <Smartphone className="w-4 h-4" />
                      Acessar Aplicativo Clube do Sax
                    </div>
                  </div>
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
