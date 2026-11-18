import { motion } from "framer-motion";
import {
  Check,
  X,
  Star,
  ArrowRight,
  Crown,
  Zap,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Mail,
  KeyRound,
  Sparkles,
  Gift,
} from "lucide-react";
import illBonusVip from "@/assets/lp3/ill-bonus-vip.jpg";
import { trackInitiateCheckout } from "@/hooks/useMetaPixel";
import type { SaxType } from "./SaxThematicEffects";

const ESSENTIAL_LINK = "https://pay.wiapy.com/PTslvctv1QE6";
const PREMIUM_LINK = "https://pay.wiapy.com/jyPuib6Uivrl";

const essentialHas = [
  "+5.000 partituras em PDF (Sax Alto Eb e Tenor Bb)",
  "16 categorias musicais organizadas",
  "Busca por texto na plataforma",
  "Acesso vitalício sem mensalidades",
  "Login enviado no seu e-mail na mesma hora",
  "Suporte prioritário por e-mail",
];

const essentialMissing = [
  "Sem playbacks profissionais de estúdio",
  "Sem busca inteligente por voz",
  "Sem vídeos tutoriais integrados",
  "Sem atualizações mensais com lançamentos",
  "Sem Harpa Cristã completa com playback",
  "Sem os 3 Guias Bônus VIP",
];

const premiumFeatures = [
  { text: "Tudo do Plano Básico incluído +", highlight: true },
  { text: "+10.000 partituras com Playback de Estúdio (Sax Alto Eb e Tenor Bb)" },
  { text: "Login + Senha do App no seu E-mail na mesma hora", highlight: true },
  { text: "Plataforma exclusiva estilo Netflix & Spotify" },
  { text: "Busca Inteligente por Voz no Microfone" },
  { text: "Vídeos tutoriais integrados passo a passo" },
  { text: "Músicas e arranjos novos adicionados todo mês" },
  { text: "Harpa Cristã COMPLETA (640 hinos)" },
  { text: "BÔNUS 1: Guia Rotina de Estudo Eficiente", bonus: true },
  { text: "BÔNUS 2: Mapa Visual de Tonalidades Eb/Bb", bonus: true },
  { text: "BÔNUS 3: 100 Músicas Essenciais no Sax", bonus: true },
];

export const BonusSectionV3 = () => {
  const bonusCards = [
    {
      tag: "BÔNUS VIP #1",
      value: "Vendido por R$ 47",
      title: "Guia: Rotina de Estudo para Saxofonistas",
      desc: "Cronograma prático de aquecimento, embocadura, técnica, escalas e repertório — do iniciante ao avançado, direto dentro do aplicativo.",
      drawing: (
        <svg viewBox="0 0 80 80" className="w-16 h-16">
          <circle
            cx="40"
            cy="42"
            r="26"
            fill="rgba(245,185,66,0.12)"
            stroke="#f5b942"
            strokeWidth="2.8"
          />
          <line x1="33" y1="11" x2="47" y2="11" stroke="#ffe299" strokeWidth="3" strokeLinecap="round" />
          <motion.line
            x1="40"
            y1="42"
            x2="40"
            y2="24"
            stroke="#1ed760"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "40px 42px" }}
          />
          <circle cx="40" cy="42" r="3.5" fill="#ffe299" />
        </svg>
      ),
    },
    {
      tag: "BÔNUS VIP #2",
      value: "Vendido por R$ 57",
      title: "Mapa Visual de Tonalidades & Transposição",
      desc: "Ciclo das quintas interativo e tabela instantânea para nunca mais travar transpondo entre Piano/Violão (C), Sax Alto (Eb) e Sax Tenor (Bb).",
      drawing: (
        <svg viewBox="0 0 80 80" className="w-16 h-16">
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "40px 40px" }}
          >
            <circle
              cx="40"
              cy="40"
              r="28"
              fill="rgba(245,185,66,0.1)"
              stroke="#f5b942"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={40 + 28 * Math.cos((deg * Math.PI) / 180)}
                cy={40 + 28 * Math.sin((deg * Math.PI) / 180)}
                r="3.2"
                fill="#ffe299"
              />
            ))}
          </motion.g>
          <text x="33" y="45" fill="#1ed760" fontSize="16" fontWeight="bold">
            𝄞
          </text>
        </svg>
      ),
    },
    {
      tag: "BÔNUS VIP #3",
      value: "Vendido por R$ 37",
      title: "100 Músicas que Todo Saxofonista Precisa Saber",
      desc: "Seleção curada por nível de dificuldade (Iniciante, Intermediário e Eventos) para você montar um repertório matador rapidamente.",
      drawing: (
        <svg viewBox="0 0 80 80" className="w-16 h-16">
          <motion.path
            d="M24 20 H56 V36 C56 46 48 52 40 52 C32 52 24 46 24 36 Z"
            fill="rgba(245,185,66,0.22)"
            stroke="#f5b942"
            strokeWidth="2.6"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <line x1="40" y1="52" x2="40" y2="63" stroke="#f5b942" strokeWidth="3" />
          <line x1="29" y1="63" x2="51" y2="63" stroke="#ffe299" strokeWidth="3.5" strokeLinecap="round" />
          <text x="34" y="40" fill="#ffe299" fontSize="14" fontWeight="bold">
            ★
          </text>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 px-5 md:px-10 relative">
      <div className="max-w-6xl mx-auto">
        {/* Visual Hero Header for Bonuses */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 items-center mb-12">
          <div className="rounded-3xl overflow-hidden border border-[#f5b942]/35 shadow-2xl relative">
            <img
              src={illBonusVip}
              alt="3 Guias Bônus Exclusivos do Plano Completo"
              className="w-full h-64 sm:h-80 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090705] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="rounded-full bg-black/80 border border-[#f5b942]/50 px-3.5 py-1 text-xs font-black text-[#ffe299]">
                🎁 Valor Total: R$ 141,00 → GRÁTIS HOJE
              </span>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
              <Gift className="w-3.5 h-3.5 text-[#f5b942]" />
              Presentes Exclusivos do Plano Completo
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-4 leading-tight">
              Leve <span className="sax-gold-gradient-text italic">3 Guias Bônus VIP</span>{" "}
              para Evoluir 3x Mais Rápido
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] leading-relaxed">
              Ao escolher o <strong className="text-white">Plano Completo</strong>, além das +10.000
              partituras com playback e busca por voz, esses 3 materiais especiais já aparecem
              desbloqueados dentro do seu aplicativo:
            </p>
          </div>
        </div>

        {/* 3 Animated Drawing Bonus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bonusCards.map((b, idx) => (
            <div
              key={idx}
              className="sax-card rounded-3xl p-6 sm:p-7 border border-[#f5b942]/25 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="rounded-2xl bg-black/50 border border-[#f5b942]/30 p-2">
                    {b.drawing}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#f5b942] block">
                      {b.tag}
                    </span>
                    <span className="text-[11px] font-bold text-[#c2b59f] line-through block">
                      {b.value}
                    </span>
                    <span className="text-[11px] font-black text-[#1ed760] uppercase">
                      Grátis no VIP
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-black font-heading text-white mb-2.5 leading-snug">
                  {b.title}
                </h3>
                <p className="text-sm text-[#c2b59f] leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface PricingCardsV3Props {
  saxType: SaxType;
}

export const PricingCardsV3 = ({ saxType }: PricingCardsV3Props) => {
  const handleCheckout = (plan: "essential" | "premium") => {
    trackInitiateCheckout({
      content_name: plan === "premium" ? "Plano Completo LP3" : "Plano Basico LP3",
      value: plan === "premium" ? 24.9 : 14.9,
      currency: "BRL",
    });

    const link = plan === "essential" ? ESSENTIAL_LINK : PREMIUM_LINK;
    const params = window.location.search;
    const separator = link.includes("?") ? "&" : "?";
    const finalUrl = params ? `${link}${separator}${params.substring(1)}` : link;
    window.location.href = finalUrl;
  };

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 md:px-10 relative overflow-hidden" id="ofertas">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-14 md:mb-20">
          <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
            <Crown className="w-3.5 h-3.5 text-[#f5b942]" />
            Condição Especial • Acesso Vitalício
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-4">
            Escolha Seu Passaporte para o{" "}
            <span className="sax-gold-gradient-text italic">Clube do Sax</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] max-w-2xl mx-auto">
            Pagamento único (sem mensalidades!), partituras prontas para{" "}
            <strong className="text-white">
              {saxType === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)"}
            </strong>{" "}
            (e ambos inclusos) e{" "}
            <strong className="text-[#1ed760]">
              Login enviado no seu e-mail na mesma hora!
            </strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-stretch max-w-5xl mx-auto">
          {/* PLANO BÁSICO */}
          <div className="sax-card rounded-[32px] p-7 sm:p-10 flex flex-col justify-between border border-white/10">
            <div>
              <div className="mb-7">
                <span className="inline-block bg-white/5 text-[#c2b59f] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-white/10">
                  Apenas PDFs
                </span>
                <h3 className="text-2xl font-black font-heading text-white mb-1.5">
                  Plano Básico
                </h3>
                <p className="text-sm text-[#c2b59f]">
                  Para quem deseja apenas as partituras em PDF sem acompanhamento.
                </p>
              </div>

              <div className="mb-7">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-[#c2b59f]">R$</span>
                  <span className="text-5xl font-black font-heading text-white tracking-tight">
                    14,90
                  </span>
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#c2b59f]">
                  Pagamento Único • Acesso Vitalício
                </span>
              </div>

              {/* Instant Email Delivery Pill */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 mb-7 flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#f5b942] shrink-0" />
                <span className="text-xs font-semibold text-[#e6decb]">
                  Acesso e Login enviados no e-mail na hora
                </span>
              </div>

              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffe299] mb-4">
                O que está incluso:
              </p>
              <ul className="space-y-3 mb-7">
                {essentialHas.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/85 font-medium">
                    <Check className="w-4 h-4 text-[#f5b942] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-6 mb-8">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35 mb-4">
                  Não incluso no Básico:
                </p>
                <ul className="space-y-2.5">
                  {essentialMissing.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-white/35">
                      <X className="w-4 h-4 text-rose-400/50 shrink-0 mt-0.5" />
                      <span className="line-through">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCheckout("essential")}
              className="w-full py-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 text-white font-black uppercase tracking-wider text-xs sm:text-sm transition-all cursor-pointer"
            >
              Garantir Plano Básico (R$ 14,90)
            </button>
          </div>

          {/* PLANO COMPLETO VIP — FEATURED */}
          <div className="relative md:-mt-3 md:mb-3">
            {/* Animated Golden & Emerald Aura */}
            <div
              className="pointer-events-none absolute -inset-[3px] rounded-[35px] opacity-80 blur-sm"
              style={{
                background: "linear-gradient(135deg, #ffe299 0%, #f5b942 45%, #1ed760 100%)",
              }}
            />

            <div className="relative h-full rounded-[32px] bg-gradient-to-b from-[#1a1308] via-[#100c06] to-[#090704] border-2 border-[#f5b942]/70 p-7 sm:p-10 flex flex-col justify-between shadow-2xl overflow-hidden">
              {/* Top Most Popular Ribbon */}
              <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffe299] to-[#f5b942] text-[#1c1102] px-4 py-1.5 text-[11px] font-black uppercase tracking-wider shadow-lg">
                  <Crown className="w-3.5 h-3.5" />
                  Escolha de 94% dos Saxofonistas
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1ed760]">
                  <Sparkles className="w-3 h-3" /> VIP Completo
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white mb-1.5">
                  Plano Completo <span className="sax-gold-gradient-text italic">VIP</span>
                </h3>
                <p className="text-sm text-[#c2b59f] mb-6">
                  O aplicativo completo com +10.000 Partituras, Playbacks estilo Spotify, Busca por Voz e os 3 Bônus!
                </p>

                {/* Price Anchor + Offer */}
                <div className="mb-6 bg-black/45 border border-[#f5b942]/25 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#c2b59f] line-through">Valor real: R$ 197,00</span>
                    <span className="text-[10px] font-black uppercase bg-[#1ed760]/20 text-[#1ed760] px-2 py-0.5 rounded-full">
                      87% OFF Hoje
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-[#ffe299]">R$</span>
                    <span className="text-5xl sm:text-6xl font-black font-heading sax-gold-gradient-text tracking-tighter">
                      24,90
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1ed760] block mt-1">
                    Pagamento Único • Acesso Vitalício + Atualizações
                  </span>
                </div>

                {/* Highlighted Instant Email + Login Box */}
                <div className="rounded-2xl bg-[#1ed760]/12 border border-[#1ed760]/40 p-4 mb-7 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-[#1ed760] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-[13px] font-bold text-white leading-snug">
                    <span className="text-[#1ed760] uppercase font-black">Acesso na Mesma Hora:</span>{" "}
                    Você recebe o e-mail automático em segundos com seu{" "}
                    <strong className="underline decoration-[#1ed760]">Login e Senha</strong> para
                    entrar direto no Aplicativo!
                  </p>
                </div>

                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffe299] mb-4">
                  Tudo o que você desbloqueia agora:
                </p>
                <ul className="space-y-3 mb-8">
                  {premiumFeatures.map((f, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 text-sm font-bold ${
                        f.highlight
                          ? "text-[#1ed760]"
                          : f.bonus
                          ? "text-[#ffe299]"
                          : "text-white/95"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {f.bonus ? (
                          <Star className="w-4 h-4 text-[#f5b942] fill-[#f5b942]" />
                        ) : (
                          <Check className="w-4 h-4 text-[#1ed760]" />
                        )}
                      </div>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl bg-[#f5b942]/12 border border-[#f5b942]/30 p-3.5 mb-7 text-center">
                  <p className="text-xs font-bold text-[#ffe299]">
                    💡 Por apenas <strong>R$ 10 a mais</strong> você leva todos os{" "}
                    <strong className="text-white">+10.000 Playbacks de Estúdio</strong>, Busca por Voz e os 3 Bônus!
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleCheckout("premium")}
                  className="sax-cta-btn sax-sheen-overlay relative overflow-hidden w-full py-5 rounded-2xl text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  QUERO O PLANO COMPLETO VIP
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11px] text-[#c2b59f] font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#f5b942]" /> Checkout Seguro
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#1ed760]" /> Login Imediato no E-mail
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 mt-12 pt-8 border-t border-white/10 text-xs font-semibold text-[#c2b59f]">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#f5b942]" /> Garantia Incondicional de 7 Dias
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-[#1ed760]" /> Pagamento Criptografado via Wiapy
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#f5b942]" /> Entrega Automática por E-mail 24h
          </span>
        </div>
      </div>
    </section>
  );
};
