import { motion, useReducedMotion } from "framer-motion";
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
import { CinematicReveal, type SaxType } from "./SaxThematicEffects";

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
  const prefersReducedMotion = useReducedMotion();

  const bonusCards = [
    {
      tag: "BÔNUS VIP #1",
      value: "Vendido por R$ 47",
      title: "Guia: Rotina de Estudo para Saxofonistas",
      desc: "Cronograma prático de aquecimento, embocadura, técnica, escalas e repertório — do iniciante ao avançado, direto dentro do aplicativo.",
      drawing: (
        <svg viewBox="0 0 80 80" className="w-14 h-14" aria-hidden="true">
          <circle
            cx="40"
            cy="42"
            r="26"
            fill="rgba(245,185,66,0.12)"
            stroke="#f5b942"
            strokeWidth="2.8"
          />
          <line x1="33" y1="11" x2="47" y2="11" stroke="#ffe49e" strokeWidth="3" strokeLinecap="round" />
          <motion.line
            x1="40"
            y1="42"
            x2="40"
            y2="24"
            stroke="#1ed760"
            strokeWidth="3"
            strokeLinecap="round"
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "40px 42px" }}
          />
          <circle cx="40" cy="42" r="3.5" fill="#ffe49e" />
        </svg>
      ),
    },
    {
      tag: "BÔNUS VIP #2",
      value: "Vendido por R$ 57",
      title: "Mapa Visual de Tonalidades & Transposição",
      desc: "Ciclo das quintas interativo e tabela instantânea para nunca mais travar transpondo entre Piano/Violão (C), Sax Alto (Eb) e Sax Tenor (Bb).",
      drawing: (
        <svg viewBox="0 0 80 80" className="w-14 h-14" aria-hidden="true">
          <motion.g
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
                fill="#ffe49e"
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
        <svg viewBox="0 0 80 80" className="w-14 h-14" aria-hidden="true">
          <path
            d="M24 20 H56 V36 C56 46 48 52 40 52 C32 52 24 46 24 36 Z"
            fill="rgba(245,185,66,0.22)"
            stroke="#f5b942"
            strokeWidth="2.6"
          />
          <line x1="40" y1="52" x2="40" y2="63" stroke="#f5b942" strokeWidth="3" />
          <line x1="29" y1="63" x2="51" y2="63" stroke="#ffe49e" strokeWidth="3.5" strokeLinecap="round" />
          <text x="34" y="40" fill="#ffe49e" fontSize="14" fontWeight="bold">
            ★
          </text>
        </svg>
      ),
    },
  ];

  return (
    <section id="bonus" className="sax-section">
      <div className="sax-container">
        {/* Visual Hero Header for Bonuses */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 items-center mb-10 md:mb-12">
          <div className="rounded-3xl overflow-hidden border border-[#f5b942]/35 shadow-2xl relative">
            <img
              src={illBonusVip}
              alt="3 Guias Bônus Exclusivos do Plano Completo"
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              className="w-full h-60 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090705] via-transparent to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
              <span className="rounded-full bg-black/85 border border-[#f5b942]/50 px-3.5 py-1.5 text-xs font-black text-[#ffe49e]">
                🎁 Valor Total: R$ 141,00 → GRÁTIS HOJE
              </span>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
              <Gift className="w-4 h-4 text-[#f5b942] shrink-0" />
              <span>Presentes Exclusivos do Plano Completo</span>
            </div>

            <h2 className="sax-h2 text-white mb-4">
              Leve <span className="sax-gold-gradient-text italic">3 Guias Bônus VIP</span>{" "}
              para Evoluir 3x Mais Rápido
            </h2>

            <p className="sax-body-lg text-[#cfc3ae]">
              Ao escolher o <strong className="text-white">Plano Completo</strong>, além das +10.000
              partituras com playback e busca por voz, esses 3 materiais especiais já aparecem
              desbloqueados dentro do seu aplicativo:
            </p>
          </div>
        </div>

        {/* 3 Bonus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bonusCards.map((b, idx) => (
            <CinematicReveal key={idx} delay={idx * 0.06}>
              <div className="sax-card h-full rounded-3xl p-6 sm:p-7 border border-[#f5b942]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="rounded-2xl bg-black/50 border border-[#f5b942]/30 p-2 shrink-0">
                      {b.drawing}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#f5b942] block">
                        {b.tag}
                      </span>
                      <span className="text-xs font-bold text-[#cfc3ae]/75 line-through block">
                        {b.value}
                      </span>
                      <span className="text-xs font-black text-[#1ed760] uppercase">
                        Grátis no VIP
                      </span>
                    </div>
                  </div>

                  <h3 className="sax-h3 text-white mb-2.5">{b.title}</h3>
                  <p className="sax-body text-[#cfc3ae]">{b.desc}</p>
                </div>
              </div>
            </CinematicReveal>
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
    <section className="sax-section" id="ofertas">
      <div className="sax-container relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
            <Crown className="w-4 h-4 text-[#f5b942] shrink-0" />
            <span>Condição Especial • Acesso Vitalício</span>
          </div>

          <h2 className="sax-h2 text-white mb-4">
            Escolha Seu Passaporte para o{" "}
            <span className="sax-gold-gradient-text italic">Clube do Sax</span>
          </h2>

          <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-7 md:gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto">
          {/* PLANO BÁSICO */}
          <div className="sax-card rounded-3xl sm:rounded-[32px] p-6 sm:p-9 flex flex-col justify-between border border-white/10 order-2 md:order-1">
            <div>
              <div className="mb-6">
                <span className="inline-block bg-white/5 text-[#cfc3ae] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-white/10">
                  Apenas PDFs
                </span>
                <h3 className="text-2xl font-black font-heading text-white mb-1.5">
                  Plano Básico
                </h3>
                <p className="text-sm sm:text-base text-[#cfc3ae]">
                  Para quem deseja apenas as partituras em PDF sem acompanhamento.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-[#cfc3ae]">R$</span>
                  <span className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
                    14,90
                  </span>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#cfc3ae]">
                  Pagamento Único • Acesso Vitalício
                </span>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 mb-6 flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#f5b942] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#e6decb]">
                  Acesso e Login enviados no e-mail na hora
                </span>
              </div>

              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#ffe49e] mb-4">
                O que está incluso:
              </p>
              <ul className="space-y-3 mb-6">
                {essentialHas.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-white/90 font-medium">
                    <Check className="w-4 h-4 text-[#f5b942] shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-5 mb-7">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/40 mb-3.5">
                  Não incluso no Básico:
                </p>
                <ul className="space-y-2.5">
                  {essentialMissing.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-white/40">
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
              className="min-h-[52px] w-full py-4 px-5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-black uppercase tracking-wider text-sm transition-all cursor-pointer"
            >
              Garantir Plano Básico (R$ 14,90)
            </button>
          </div>

          {/* PLANO COMPLETO VIP — FEATURED (First on mobile for optimal CRO!) */}
          <div className="relative order-1 md:order-2 md:-mt-2 md:mb-2">
            <div
              className="pointer-events-none absolute -inset-[2.5px] rounded-[30px] sm:rounded-[34px] opacity-80 blur-[3px]"
              style={{
                background: "linear-gradient(135deg, #ffe299 0%, #f5b942 45%, #1ed760 100%)",
              }}
            />

            <div className="relative h-full rounded-3xl sm:rounded-[32px] bg-gradient-to-b from-[#1a1308] via-[#100c06] to-[#090704] border-2 border-[#f5b942]/75 p-6 sm:p-9 flex flex-col justify-between shadow-2xl overflow-hidden">
              <div>
                <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffe299] to-[#f5b942] text-[#1c1102] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider shadow-md">
                    <Crown className="w-3.5 h-3.5 shrink-0" />
                    Escolha de 94% dos Alunos
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1ed760]">
                    <Sparkles className="w-3 h-3" /> VIP Completo
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white mb-1.5">
                  Plano Completo <span className="sax-gold-gradient-text italic">VIP</span>
                </h3>
                <p className="text-sm sm:text-base text-[#cfc3ae] mb-6">
                  O aplicativo completo com +10.000 Partituras, Playbacks estilo Spotify, Busca por Voz e os 3 Bônus!
                </p>

                <div className="mb-6 bg-black/45 border border-[#f5b942]/25 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs sm:text-sm text-[#cfc3ae] line-through">
                      Valor real: R$ 197,00
                    </span>
                    <span className="text-[11px] font-black uppercase bg-[#1ed760]/20 text-[#1ed760] px-2.5 py-0.5 rounded-full">
                      87% OFF Hoje
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-[#ffe49e]">R$</span>
                    <span className="text-5xl sm:text-6xl font-black font-heading sax-gold-gradient-text tracking-tighter">
                      24,90
                    </span>
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#1ed760] block mt-1">
                    Pagamento Único • Acesso Vitalício + Atualizações
                  </span>
                </div>

                <div className="rounded-2xl bg-[#1ed760]/12 border border-[#1ed760]/40 p-4 mb-6 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-[#1ed760] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                    <span className="text-[#1ed760] uppercase font-black">Acesso na Mesma Hora:</span>{" "}
                    Você recebe o e-mail automático em segundos com seu{" "}
                    <strong className="underline decoration-[#1ed760]">Login e Senha</strong> para
                    entrar direto no Aplicativo!
                  </p>
                </div>

                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#ffe49e] mb-4">
                  Tudo o que você desbloqueia agora:
                </p>
                <ul className="space-y-3 mb-7">
                  {premiumFeatures.map((f, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 text-sm sm:text-base font-bold ${
                        f.highlight
                          ? "text-[#1ed760]"
                          : f.bonus
                          ? "text-[#ffe49e]"
                          : "text-white/95"
                      }`}
                    >
                      <div className="mt-1 shrink-0">
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

                <div className="rounded-2xl bg-[#f5b942]/12 border border-[#f5b942]/30 p-3.5 mb-6 text-center">
                  <p className="text-xs sm:text-sm font-bold text-[#ffe49e]">
                    💡 Por apenas <strong>R$ 10 a mais</strong> você leva todos os{" "}
                    <strong className="text-white">+10.000 Playbacks de Estúdio</strong>, Busca por Voz e os 3 Bônus!
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleCheckout("premium")}
                  className="sax-cta-btn sax-sheen-overlay relative overflow-hidden w-full py-4 sm:py-5 px-6 rounded-2xl text-base uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>QUERO O PLANO COMPLETO VIP</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-[#cfc3ae] font-semibold">
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
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10 pt-8 border-t border-white/10 text-xs sm:text-sm font-semibold text-[#cfc3ae]">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#f5b942] shrink-0" /> Garantia Incondicional de 7 Dias
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-[#1ed760] shrink-0" /> Pagamento Criptografado via Wiapy
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#f5b942] shrink-0" /> Entrega Automática por E-mail 24h
          </span>
        </div>
      </div>
    </section>
  );
};
