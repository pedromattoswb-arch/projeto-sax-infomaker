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
  FolderOpen,
  PlayCircle,
  BookOpen,
  Infinity as InfinityIcon,
} from "lucide-react";

import illAcervo from "@/assets/lp3/ill-acervo-partituras.webp";
import illVoz from "@/assets/lp3/ill-voz-inteligente.webp";
import illMulti from "@/assets/lp3/ill-multi-dispositivos.webp";
import illEmail from "@/assets/lp3/ill-acesso-email.webp";
import { CinematicReveal, KineticHeading, Scroll3DMockup } from "./SaxThematicEffects";

interface EcosystemAndEmailV3Props {
  onScrollToOffers: () => void;
}

const VISUAL_PILLARS = [
  {
    image: illAcervo,
    badge: "+10.000 Músicas",
    tag: "Alto Eb & Tenor Bb",
    title: "+10.000 Partituras com Playback de Estúdio",
    desc: "Cada música já vem com a partitura revisada para Sax Alto (Eb) e Sax Tenor (Bb) + o playback profissional masterizado para tocar junto.",
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
];

const EcosystemAndEmailV3 = ({ onScrollToOffers }: EcosystemAndEmailV3Props) => {
  return (
    <>
      {/* PART 1: ILLUSTRATED ECOSYSTEM SECTION — Every Mention Followed Immediately by Its Visual */}
      <section id="ecossistema" className="sax-section">
        <div className="sax-container">
          <div className="text-center mb-10 md:mb-14">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
              <Sparkles className="w-4 h-4 text-[#f5b942] shrink-0" />
              <span>Estação Completa do Saxofonista</span>
            </div>

            <KineticHeading>
              <h2 className="sax-h2 text-white mb-4">
                Esqueça PDFs Bagunçados. <br className="hidden sm:block" />
                Tenha <span className="sax-gold-gradient-text italic">Tudo em Um Único App</span>
              </h2>
            </KineticHeading>

            <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto">
              Criado sob medida para quem toca{" "}
              <strong className="text-white">Sax Alto (Eb) e Sax Tenor (Bb)</strong> (com as duas
              afinações inclusas em todo o acervo). Veja cada recurso na prática:
            </p>
          </div>

          {/* 4 Visual Cards — Strict Order inside every card: 1. Mention (Title) -> 2. Visual Mockup -> 3. Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VISUAL_PILLARS.map((pillar, idx) => (
              <CinematicReveal key={idx}>
                <div className="sax-card h-full rounded-3xl sm:rounded-[28px] p-5 sm:p-6 flex flex-col group">
                  {/* 1. Badges + Mention Title */}
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

                  {/* 2. Immediate Visual Illustration (Eager Compressed WebP — Zero Lazy Pop-in!) */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#090604] border border-white/10 mb-4">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      width={760}
                      height={475}
                      loading="eager"
                      decoding="sync"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* 3. Description */}
                  <p className="sax-body text-[#cfc3ae]">{pillar.desc}</p>
                </div>
              </CinematicReveal>
            ))}

            {/* 4th Card: +18 Estilos, Harpa Cristã, Tutoriais & Vitalício — Title -> Built-in Visual App UI -> Description */}
            <CinematicReveal>
              <div className="sax-card h-full rounded-3xl sm:rounded-[28px] p-5 sm:p-6 flex flex-col">
                {/* 1. Badges + Mention Title */}
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                    <span className="rounded-full bg-[#f5b942]/14 border border-[#f5b942]/40 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#ffe49e]">
                      Acervo Vitalício
                    </span>
                    <span className="rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1ed760]">
                      Sem Mensalidade
                    </span>
                  </div>
                  <h3 className="sax-h3 text-white">
                    +18 Estilos, Harpa Cristã & Vídeos Tutoriais Inclusos
                  </h3>
                </div>

                {/* 2. Immediate Visual Representation: App Modules Preview Grid */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#161008] via-[#0c0905] to-[#08120c] border border-[#f5b942]/30 p-3 sm:p-4 mb-4 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    <div className="rounded-xl bg-black/55 border border-[#f5b942]/25 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-1">
                        <FolderOpen className="w-4 h-4 text-[#f5b942] shrink-0" />
                        <span className="text-[10px] font-black text-[#ffe49e]">18+ Pastas</span>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white truncate">Estilos Musicais</p>
                        <p className="text-[10px] text-[#cfc3ae] truncate">MPB • Pop • Jazz • Gospel</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/55 border border-[#1ed760]/25 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-1">
                        <PlayCircle className="w-4 h-4 text-[#1ed760] shrink-0" />
                        <span className="text-[10px] font-black text-[#1ed760]">HD</span>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white truncate">Vídeos Tutoriais</p>
                        <p className="text-[10px] text-[#cfc3ae] truncate">Passo a passo no app</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/55 border border-[#f5b942]/25 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-1">
                        <BookOpen className="w-4 h-4 text-[#ffe49e] shrink-0" />
                        <span className="text-[10px] font-black text-[#ffe49e]">640 Hinos</span>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white truncate">Harpa Cristã</p>
                        <p className="text-[10px] text-[#cfc3ae] truncate">Completa Eb & Bb</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/55 border border-[#1ed760]/25 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-1">
                        <InfinityIcon className="w-4 h-4 text-[#1ed760] shrink-0" />
                        <span className="text-[10px] font-black text-[#1ed760]">Vitalício</span>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white truncate">Atualizações</p>
                        <p className="text-[10px] text-[#cfc3ae] truncate">Músicas novas todo mês</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Description */}
                <p className="sax-body text-[#cfc3ae]">
                  Pague uma única vez e tenha todas as +18 pastas organizadas, os 640 louvores da
                  Harpa Cristã, aulas rápidas de uso e atualizações mensais para sempre.
                </p>
              </div>
            </CinematicReveal>
          </div>
        </div>
      </section>

      {/* PART 2: DEDICATED INSTANT EMAIL + APP LOGIN VISUAL SECTION
          Mobile-First Order: 1. Badge + H2 Title -> 2. 3D Scroll-Synced Email/Login Mockup -> 3. Description + 3 Visual-Paired Steps + CTA */}
      <section id="acesso-email" className="sax-section pt-4 md:pt-8">
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

                <KineticHeading>
                  <h2 className="sax-h2 text-white">
                    Comprou, Chegou no <span className="text-[#1ed760] italic">Seu E-mail</span>{" "}
                    na Mesma Hora com Seu Login!
                  </h2>
                </KineticHeading>
              </div>

              {/* 2. 3D SCROLL-SYNCED E-MAIL + LOGIN MOCKUP (Immediately after Title on Mobile!) */}
              <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
                <Scroll3DMockup
                  tiltDirection={1}
                  className="max-w-md mx-auto lg:max-w-none"
                >
                  <div className="rounded-3xl overflow-hidden border border-[#f5b942]/35 bg-[#090705] shadow-2xl">
                    <div className="relative h-44 sm:h-52 overflow-hidden">
                      <img
                        src={illEmail}
                        alt="Acesso enviado imediatamente por e-mail"
                        width={760}
                        height={475}
                        loading="eager"
                        decoding="sync"
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
                </Scroll3DMockup>
              </div>

              {/* 3. DESCRIPTION + 3 STEPS (Each step mention immediately shows its visual chip!) + CTA */}
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
                      visualBadge: "PIX ou Cartão • Aprovação em 2s ✓",
                      desc: "Finalize via Pix ou Cartão no ambiente criptografado da Wiapy.",
                      accent: "text-[#ffe49e] border-[#f5b942]/40 bg-[#f5b942]/12",
                    },
                    {
                      step: "02",
                      icon: Mail,
                      title: "Receba o E-mail Oficial na Mesma Hora",
                      visualBadge: "Caixa de Entrada • acesso@clubedosax.com",
                      desc: "Em menos de 1 minuto o e-mail oficial chega com o botão direto do aplicativo.",
                      accent: "text-[#1ed760] border-[#1ed760]/40 bg-[#1ed760]/12",
                    },
                    {
                      step: "03",
                      icon: KeyRound,
                      title: "Use Seu Login & Senha e Comece a Tocar!",
                      visualBadge: "app.clubedosax.com • Login + Senha Ativos",
                      desc: "Entre pelo celular, tablet ou computador com tudo desbloqueado na hora.",
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
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#f5b942] block mb-0.5">
                          Passo {s.step}
                        </span>
                        <h3 className="text-base font-black font-heading text-white leading-snug">
                          {s.title}
                        </h3>
                        {/* Immediate Visual Representation of this Step right after its Title */}
                        <div className="mt-1.5 mb-1.5 inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] border border-white/10 px-2.5 py-1 text-[11px] font-mono font-bold text-[#1ed760] max-w-full">
                          <span className="truncate">{s.visualBadge}</span>
                        </div>
                        <p className="text-sm text-[#cfc3ae] leading-relaxed">{s.desc}</p>
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
