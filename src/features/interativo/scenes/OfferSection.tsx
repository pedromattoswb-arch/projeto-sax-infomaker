import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  Crown,
  FileText,
  Folder,
  FolderOpen,
  Gift,
  Headphones,
  HelpCircle,
  Infinity as InfinityIcon,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  Mic,
  Music,
  Play,
  PlayCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Video,
  Wifi,
  BatteryFull,
  X,
  Zap,
  ZoomIn,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATALOG_GENRES, TOTAL_CATALOG_COUNT, TOTAL_SAMPLE_COUNT } from "@/data/catalogSongs";

import logoClubeSax from "@/assets/lp3/logo-clube-do-sax.webp";
import seloGarantia from "@/assets/lp3/selo-garantia.webp";
import illAcervo from "@/assets/lp3/ill-acervo-partituras.webp";
import illVoz from "@/assets/lp3/ill-voz-inteligente.webp";
import illMulti from "@/assets/lp3/ill-multi-dispositivos.webp";
import illEmail from "@/assets/lp3/ill-acesso-email.webp";
import illBonusVip from "@/assets/lp3/ill-bonus-vip.webp";
import p1 from "@/assets/lp3/partituras/partitura-1.webp";
import p3 from "@/assets/lp3/partituras/partitura-3.webp";
import p4 from "@/assets/lp3/partituras/partitura-4.webp";
import p5 from "@/assets/lp3/partituras/partitura-5.webp";
import p6 from "@/assets/lp3/partituras/partitura-6.webp";
import p8 from "@/assets/lp3/partituras/partitura-8.webp";
import p9 from "@/assets/lp3/partituras/partitura-9.webp";

import { FUNNEL_CONFIG, type SaxChoice } from "../funnel.config";
import { audioEngine } from "../audio/AudioEngine";
import { buildCheckoutUrl, trackInterativoCheckout } from "../tracking/events";
import { SplitTextHeading } from "../fx/SplitTextHeading";
import { OfferPlaybackPlayer } from "./offer/OfferPlaybackPlayer";

gsap.registerPlugin(ScrollTrigger);

interface OfferSectionProps {
  sax: SaxChoice;
  reducedMotion: boolean;
  allowTilt: boolean;
  onReplayFunnel: () => void;
}

const SHEETS = [
  { id: "s1", src: p1, title: "Over The Rainbow", artist: "Clássico Internacional", genre: "Cinema & Pop" },
  { id: "s2", src: p3, title: "Além do Horizonte", artist: "Roberto Carlos", genre: "MPB Clássico" },
  { id: "s3", src: p5, title: "A Viagem", artist: "Roupa Nova", genre: "Pop Brasil" },
  { id: "s4", src: p6, title: "A Sua", artist: "Marisa Monte", genre: "MPB & Soul" },
  { id: "s5", src: p8, title: "Ainda Lembro", artist: "Marisa Monte & Ed Motta", genre: "MPB Groove" },
  { id: "s6", src: p4, title: "Além do Horizonte (Arr. II)", artist: "Roberto Carlos", genre: "MPB Clássico" },
  { id: "s7", src: p9, title: "Ainda Lembro (Arr. Completo)", artist: "Marisa Monte", genre: "MPB Groove" },
];

const VIDEO_TESTIMONIALS = [
  { src: "/testimonials/julio-sampaio-sp.mp4", poster: "/lp3/posters/julio-sampaio-sp.webp", name: "Júlio Sampaio", city: "São Paulo" },
  { src: "/testimonials/marcelo-cristian-rj.mp4", poster: "/lp3/posters/marcelo-cristian-rj.webp", name: "Marcelo Cristian", city: "Rio de Janeiro" },
  { src: "/testimonials/marcos-mattos-bsb.mp4", poster: "/lp3/posters/marcos-mattos-bsb.webp", name: "Marcos Mattos", city: "Brasília" },
  { src: "/testimonials/julia-costa-sp.mp4", poster: "/lp3/posters/julia-costa-sp.webp", name: "Júlia Costa", city: "São Paulo" },
  { src: "/testimonials/barbara-oliveira-floripa.mp4", poster: "/lp3/posters/barbara-oliveira-floripa.webp", name: "Bárbara Oliveira", city: "Florianópolis" },
  { src: "/testimonials/gabriela-santana-sp.mp4", poster: "/lp3/posters/gabriela-santana-sp.webp", name: "Gabriela Santana", city: "São Paulo" },
];

const WHATSAPP_PRINTS = [
  { id: 2, src: "/lp3/testimonials/depoimento-2.webp", author: "Seu Jorge (68 anos)", role: "Aluno Novo no WhatsApp", channel: "WhatsApp" as const, quoteHighlight: "Achei que era tarde demais... agora estou conseguindo tocar!" },
  { id: 5, src: "/lp3/testimonials/depoimento-5.webp", author: "Prof. Carlos", role: "Professor de Sax há 15 anos", channel: "WhatsApp" as const, quoteHighlight: "Arranjos que nunca encontrei em lugar nenhum! Uso com todos os alunos." },
  { id: 9, src: "/lp3/testimonials/depoimento-9.webp", author: "Lucas", role: "Estudante de Conservatório", channel: "WhatsApp" as const, quoteHighlight: "Salvou minha prova de repertório! Achei 3 peças em 5 minutos." },
  { id: 4, src: "/lp3/testimonials/depoimento-4.webp", author: "Roberto & Mariana", role: "Saxofonistas no WhatsApp", channel: "WhatsApp" as const, quoteHighlight: "Já encontrei várias músicas que procurava há anos! Qualidade impressionante." },
  { id: 8, src: "/lp3/testimonials/depoimento-8.webp", author: "Prof. Antônio", role: "Maestro • Banda Municipal", channel: "WhatsApp" as const, quoteHighlight: "Já baixamos mais de 50 partituras pros alunos da banda!" },
  { id: 10, src: "/lp3/testimonials/depoimento-10.webp", author: "Júlia", role: "Iniciante (3 meses de Sax)", channel: "WhatsApp" as const, quoteHighlight: "Comecei há 3 meses e achei o tesouro! Partituras fáceis de entender." },
  { id: 1, src: "/lp3/testimonials/depoimento-1.webp", author: "Profa. Renata Vieira", role: "Professora de Música", channel: "Comunidade" as const, quoteHighlight: "O material do Clube do Sax Brasil é referência! Nota 10!" },
  { id: 3, src: "/lp3/testimonials/depoimento-3.webp", author: "Patrícia Santos Almeida", role: "Aluna Clube do Sax", channel: "Comunidade" as const, quoteHighlight: "Material de altíssima qualidade, super organizado. Melhor investimento!" },
  { id: 6, src: "/lp3/testimonials/depoimento-6.webp", author: "Lucas Ferreira Costa", role: "1 ano estudando Sax", channel: "Comunidade" as const, quoteHighlight: "Tem TUDO que eu precisava! Partituras lindas, fáceis de ler." },
  { id: 7, src: "/lp3/testimonials/depoimento-7.webp", author: "Marcos Oliveira", role: "Turma da Escola de Música", channel: "Comunidade" as const, quoteHighlight: "Vale muito cada centavo! Já indiquei para toda a turma da escola." },
];

const PREMIUM_FEATURES = [
  { text: "Acesso 100% Completo (inclui tudo do Básico + recursos VIP):", highlight: true },
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

const ESSENTIAL_HAS = [
  "+5.000 partituras em PDF (Sax Alto Eb e Tenor Bb)",
  "16 categorias musicais organizadas",
  "Busca por texto na plataforma",
  "Acesso vitalício sem mensalidades",
  "Login enviado no seu e-mail na mesma hora",
  "Suporte prioritário por e-mail",
];

const ESSENTIAL_MISSING = [
  "Sem playbacks profissionais de estúdio",
  "Sem busca inteligente por voz",
  "Sem vídeos tutoriais integrados",
  "Sem atualizações mensais com lançamentos",
  "Sem Harpa Cristã completa com playback",
  "Sem os 3 Guias Bônus VIP",
];

const FAQ_ITEMS = [
  {
    q: "Como e quando recebo meu acesso e login do aplicativo?",
    a: "Na mesma hora! Assim que seu pagamento (Pix ou Cartão) é confirmado, você recebe automaticamente no seu e-mail o link oficial do aplicativo junto com seu Login e Senha exclusivos. Funciona 24 horas por dia, inclusive de madrugada, domingos e feriados.",
  },
  {
    q: "Serve tanto para Sax Alto (Eb) quanto para Sax Tenor (Bb)?",
    a: "Sim! Todas as partituras com playback estão disponíveis tanto para Sax Alto (Mib / Eb) quanto para Sax Tenor (Sib / Bb). Você não precisa escolher apenas um na hora da compra — ambos já vêm liberados na sua conta!",
  },
  {
    q: "Preciso baixar arquivos pesados ou ocupar a memória do celular?",
    a: "Não! O Clube do Sax funciona como um Web App moderno (estilo Netflix e Spotify). Você faz login pelo navegador do seu iPhone, Android, iPad/Tablet ou Computador, abre a partitura na tela e dá play no playback instantaneamente — ou baixa o PDF quando quiser imprimir.",
  },
  {
    q: "Qual a diferença entre o Plano Completo VIP (R$ 24,90) e o Plano Básico (R$ 14,90)?",
    a: "O Plano Completo VIP (R$ 24,90 — nossa 1ª opção e escolha de 94% dos alunos) libera a experiência completa do aplicativo: +10.000 partituras COM Playbacks profissionais de estúdio, Busca Inteligente por Voz, Vídeos Tutoriais, Harpa Cristã completa, atualizações mensais e os 3 Guias Bônus VIP. Já o Plano Básico (R$ 14,90) é uma opção secundária enxuta com +5.000 partituras apenas em PDF, sem playbacks e sem bônus.",
  },
  {
    q: "O pagamento é realmente único ou tem mensalidade?",
    a: "Pagamento 100% único! Você paga uma única vez e tem acesso vitalício ao seu plano, sem cobranças recorrentes ou surpresas no cartão.",
  },
  {
    q: "E se eu entrar e achar que não é para mim?",
    a: "Você tem 7 dias de Garantia Incondicional! Pode entrar no aplicativo, testar as partituras, dar play nos playbacks e usar a busca por voz. Se por qualquer motivo não amar, basta enviar um e-mail dentro de 7 dias e devolvemos 100% do seu investimento.",
  },
];

const MARQUEE_TAGS = [
  "Careless Whisper",
  "Garota de Ipanema",
  "Sobre as Águas",
  "Your Latest Trick",
  "Sozinho",
  "Harpa Cristã (640 Hinos)",
  "Boate Azul",
  "Endless Love",
  "Wave",
  "Evidências",
  "Over The Rainbow",
  "MPB • Gospel • Jazz • Casamentos",
];

const BONUS_CARDS = [
  {
    tag: "BÔNUS VIP #1",
    value: "Vendido por R$ 47",
    title: "Guia: Rotina de Estudo para Saxofonistas",
    desc: "Cronograma prático de aquecimento, embocadura, técnica, escalas e repertório — do iniciante ao avançado, direto dentro do aplicativo.",
    preview: (
      <div className="rounded-xl bg-black/55 border border-[#f5d58a]/25 p-3 mb-4 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-lg bg-white/[0.04] py-1.5 px-1">
          <span className="text-[11px] font-black text-[#f5d58a] block">05 min</span>
          <span className="text-[10px] text-white/80 block truncate">Embocadura</span>
        </div>
        <div className="rounded-lg bg-white/[0.04] py-1.5 px-1">
          <span className="text-[11px] font-black text-[#f5d58a] block">10 min</span>
          <span className="text-[10px] text-white/80 block truncate">Escalas</span>
        </div>
        <div className="rounded-lg bg-[#1ed760]/12 border border-[#1ed760]/35 py-1.5 px-1">
          <span className="text-[11px] font-black text-[#1ed760] block">15 min</span>
          <span className="text-[10px] text-white block truncate">Repertório</span>
        </div>
      </div>
    ),
  },
  {
    tag: "BÔNUS VIP #2",
    value: "Vendido por R$ 57",
    title: "Mapa Visual de Tonalidades & Transposição",
    desc: "Ciclo das quintas visual e tabela instantânea para nunca mais travar transpondo entre Piano/Violão (C), Sax Alto (Eb) e Sax Tenor (Bb).",
    preview: (
      <div className="rounded-xl bg-black/55 border border-[#f5d58a]/25 p-3 mb-4 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-lg bg-white/[0.04] py-1.5 px-1">
          <span className="text-[10px] text-[#cdc3b2] block">Piano (C)</span>
          <span className="text-xs font-black text-white block">Dó</span>
        </div>
        <div className="rounded-lg bg-[#f5d58a]/15 border border-[#f5d58a]/40 py-1.5 px-1">
          <span className="text-[10px] text-[#f5d58a] block">Alto (Eb)</span>
          <span className="text-xs font-black text-[#f5d58a] block">Lá</span>
        </div>
        <div className="rounded-lg bg-[#1ed760]/12 border border-[#1ed760]/35 py-1.5 px-1">
          <span className="text-[10px] text-[#1ed760] block">Tenor (Bb)</span>
          <span className="text-xs font-black text-white block">Ré</span>
        </div>
      </div>
    ),
  },
  {
    tag: "BÔNUS VIP #3",
    value: "Vendido por R$ 37",
    title: "100 Músicas que Todo Saxofonista Precisa Saber",
    desc: "Seleção curada por nível de dificuldade (Iniciante, Intermediário e Eventos) para você montar um repertório matador rapidamente.",
    preview: (
      <div className="rounded-xl bg-black/55 border border-[#f5d58a]/25 p-3 mb-4 space-y-1.5 text-left text-xs">
        <div className="flex justify-between">
          <span className="text-white/90 font-semibold">1. Nível Iniciante</span>
          <span className="text-[#1ed760] font-bold">35 músicas</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/90 font-semibold">2. Eventos & Casamentos</span>
          <span className="text-[#f5d58a] font-bold">65 músicas</span>
        </div>
      </div>
    ),
  },
];

export const OfferSection = ({
  sax,
  reducedMotion,
  allowTilt,
  onReplayFunnel,
}: OfferSectionProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [showStickyCta, setShowStickyCta] = useState(false);
  const [activeHowStep, setActiveHowStep] = useState(0);
  const [zoomedSheet, setZoomedSheet] = useState<(typeof SHEETS)[number] | null>(null);
  const [selectedPrint, setSelectedPrint] = useState<(typeof WHATSAPP_PRINTS)[number] | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState<number | null>(null);
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  const saxLabel = sax === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)";
  const totalSample = useMemo(() => TOTAL_SAMPLE_COUNT, []);
  const costPerDay = useMemo(() => (FUNNEL_CONFIG.metrics.premiumPrice / 365).toFixed(2).replace(".", ","), []);

  // Desktop-only Smooth Scroll (Lenis via dynamic import — zero cost on mobile!)
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    const isDesktopPointer = window.matchMedia?.("(pointer: fine) and (min-width: 1024px)")?.matches;
    if (!isDesktopPointer) return;

    let rafId = 0;
    let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 1.05,
          smoothWheel: true,
        });
        lenisInstance = lenis;
        const raf = (time: number) => {
          lenis.raf(time);
          ScrollTrigger.update();
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      })
      .catch(() => {
        // Native scroll fallback
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, [reducedMotion]);

  // Show Sticky Mobile CTA & gently fade out funnel background audio once Hero scrolls out
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const passedHero = !entry.isIntersecting;
        setShowStickyCta(passedHero);
        if (passedHero) {
          audioEngine.setDucking(0, 0.7);
          window.setTimeout(() => audioEngine.stopComparison(), 1100);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, []);

  // GSAP ScrollTrigger Reveals + Single Pinned/Guided Storytelling on "Como Funciona"
  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".jazz-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".jazz-stagger-group").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>(".jazz-stagger-item");
        if (items.length === 0) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      // Single Pinned/Scroll-Driven Storytelling section ("Como Funciona")
      if (howItWorksRef.current) {
        ScrollTrigger.create({
          trigger: howItWorksRef.current,
          start: "top 45%",
          end: "bottom 55%",
          onUpdate: (self) => {
            const step = self.progress < 0.34 ? 0 : self.progress < 0.68 ? 1 : 2;
            setActiveHowStep(step);
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Escape closes any open lightbox modal
  useEffect(() => {
    if (!zoomedSheet && !selectedPrint && !showCatalogModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomedSheet(null);
        setSelectedPrint(null);
        setShowCatalogModal(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomedSheet, selectedPrint, showCatalogModal]);

  const scrollToPlans = () => {
    document.getElementById("offer-plans")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckout = (plan: "premium" | "essential") => {
    trackInterativoCheckout(plan, sax);
    const base =
      plan === "premium"
        ? FUNNEL_CONFIG.links.checkoutPremium
        : FUNNEL_CONFIG.links.checkoutEssential;
    window.location.href = buildCheckoutUrl(base);
  };

  const handleBonusTilt = (e: React.MouseEvent<HTMLDivElement>, reset = false) => {
    if (!allowTilt || reducedMotion) return;
    const el = e.currentTarget;
    if (reset) {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      return;
    }
    const r = el.getBoundingClientRect();
    const rx = -((e.clientY - r.top) / r.height - 0.5) * 8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  return (
    <div ref={rootRef} className="relative z-10 w-full">
      {/* Compact Offer Topbar */}
      <header className="sticky top-0 z-40 bg-[#07070a]/90 backdrop-blur-md border-b border-[#f5d58a]/20 jazz-safe-top">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={logoClubeSax}
              alt="Clube do Sax"
              width={56}
              height={40}
              loading="eager"
              className="h-9 sm:h-11 w-auto shrink-0"
            />
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#f5d58a]">
              {saxLabel} Pronto
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReplayFunnel}
              className="min-h-[38px] px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 text-xs font-bold text-[#cdc3b2] inline-flex items-center gap-1.5 cursor-pointer"
              aria-label="Rever experiência interativa do palco"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#f5d58a]" />
              <span className="hidden min-[400px]:inline">Rever palco</span>
            </button>

            <button
              type="button"
              onClick={scrollToPlans}
              className="jazz-cta-gold px-4 py-2 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ativar acervo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Top Authority Strip */}
      <div className="border-b border-[#f5d58a]/15 bg-[#0b0a0e]/90 py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-x-5 gap-y-1.5 flex-wrap text-xs font-bold text-[#e5dbc8]">
          <span className="inline-flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#f5d58a] shrink-0" />
            +10.000 Partituras c/ Playback
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#1ed760]">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            Login Enviado no E-mail na Mesma Hora
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#f5d58a] shrink-0" />
            +847 Saxofonistas Ativos
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <InfinityIcon className="w-3.5 h-3.5 text-[#f5d58a] shrink-0" />
            Acesso Vitalício
          </span>
        </div>
      </div>

      {/* 1. PERSONALIZED OFFER HERO (Revealed directly from Scene 4 Credential) */}
      <section ref={heroRef} id="offer-hero" className="pt-8 sm:pt-14 pb-12 md:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-y-7 lg:gap-x-12 items-center">
            {/* 1. Title & Personalized Credential Pill */}
            <div className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/45 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1ed760] mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Acervo Calibrado para {saxLabel} • Ambos Inclusos</span>
              </div>

              <SplitTextHeading
                text={FUNNEL_CONFIG.copy.scene5.heroHeadlineTemplate(sax)}
                as="h1"
                highlightWords={["Alto", "Tenor", "(Eb)", "(Bb)", "pronto"]}
                className="jazz-display text-white"
                reducedMotion={reducedMotion}
                delay={0.04}
              />
            </div>

            {/* 2. Personalized iPhone 16 Pro App Preview Mockup */}
            <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex justify-center">
              <div className="w-full max-w-[306px] sm:max-w-[340px]">
                <div className="jazz-iphone-frame">
                  <div className="jazz-iphone-screen text-left select-none">
                    <div className="flex items-center justify-between px-4 pt-2.5 pb-2 bg-[#0c0a0d] text-white">
                      <span className="text-[11px] font-bold tabular-nums">9:41</span>
                      <div className="h-[22px] px-3 rounded-full bg-black border border-white/10 flex items-center gap-2">
                        <span className="text-[10px]">🎷</span>
                        <span className="text-[10px] font-bold text-[#f5d58a]">Clube do Sax</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        <BatteryFull className="w-3.5 h-3.5 text-[#1ed760]" />
                      </div>
                    </div>

                    <div className="px-4 pt-2 pb-3 bg-gradient-to-b from-[#17120c] to-[#0c0a0d] border-b border-[#f5d58a]/15">
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={logoClubeSax} alt="Clube do Sax App" width={36} height={26} className="h-6 w-auto" />
                          <div className="min-w-0">
                            <span className="text-xs font-black text-white block leading-none truncate">
                              Seu Acervo VIP
                            </span>
                            <span className="text-[10px] font-bold text-[#1ed760]">
                              {sax === "alto" ? "Alto (Eb) Ativo" : "Tenor (Bb) Ativo"}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-full bg-[#f5d58a]/15 border border-[#f5d58a]/40 px-2 py-0.5 text-[10px] font-extrabold text-[#f5d58a]">
                          Eb + Bb
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-black/55 border border-white/10 px-3 py-2">
                        <Search className="w-3.5 h-3.5 text-[#cdc3b2]" />
                        <span className="text-[11px] text-[#cdc3b2]/80 flex-1 truncate">
                          Buscar música ou falar no mic…
                        </span>
                        <Mic className="w-3.5 h-3.5 text-[#f5d58a]" />
                      </div>
                    </div>

                    <div className="p-3 space-y-2 bg-[#0a090c]">
                      {FUNNEL_CONFIG.scene4ShowcaseSongs.slice(0, 4).map((song, idx) => (
                        <div
                          key={song.title}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border ${
                            idx === 0
                              ? "bg-[#f5d58a]/12 border-[#f5d58a]/45"
                              : "bg-white/[0.03] border-white/[0.07]"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs"
                            style={{ background: `linear-gradient(135deg, ${song.accentFrom}, ${song.accentTo})` }}
                          >
                            🎷
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-extrabold truncate ${idx === 0 ? "text-[#f5d58a]" : "text-white"}`}>
                              {song.title}
                            </p>
                            <p className="text-[10px] text-[#cdc3b2] truncate">
                              {song.artist} • Tom {sax === "alto" ? song.keyAlto : song.keyTenor}
                            </p>
                          </div>
                          <span className="w-6 h-6 rounded-full bg-[#1ed760] text-black flex items-center justify-center shrink-0">
                            <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Summary Subtitle + Primary CTA + Real Counters */}
            <div className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start text-center lg:text-left">
              <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto lg:mx-0 mb-6">
                {FUNNEL_CONFIG.copy.scene5.heroSubtitleTemplate(sax)} Transforme seu celular, tablet
                ou PC em um verdadeiro{" "}
                <strong className="text-white">Netflix & Spotify do Saxofonista</strong> com busca
                por voz e{" "}
                <strong className="text-[#1ed760]">login enviado direto no seu e-mail!</strong>
              </p>

              <button
                type="button"
                onClick={scrollToPlans}
                className="jazz-cta-primary w-full sm:w-auto py-4 sm:py-5 px-8 sm:px-12 rounded-2xl text-base sm:text-lg uppercase tracking-wider inline-flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{FUNNEL_CONFIG.copy.scene5.primaryCta}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>

              <div className="mt-4 inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 rounded-2xl bg-white/[0.04] border border-[#1ed760]/30 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#e6decb]">
                <span className="inline-flex items-center gap-1.5 text-[#1ed760] font-bold">
                  <Mail className="w-4 h-4 shrink-0" />
                  Receba Login + Senha no E-mail na mesma hora
                </span>
                <span className="hidden sm:inline text-white/25">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#f5d58a] shrink-0" />
                  Pagamento Único • 7 Dias de Garantia
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl mx-auto lg:mx-0 mt-7">
                <div className="jazz-glass rounded-2xl p-3 sm:p-4 text-center">
                  <span className="text-lg sm:text-3xl font-black jazz-gold-text block">10.000+</span>
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#cdc3b2]">
                    Partituras
                  </span>
                </div>
                <div className="jazz-glass rounded-2xl p-3 sm:p-4 text-center">
                  <span className="text-lg sm:text-3xl font-black jazz-gold-text block">847+</span>
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#cdc3b2]">
                    Saxofonistas
                  </span>
                </div>
                <div className="jazz-glass rounded-2xl p-3 sm:p-4 text-center">
                  <span className="text-lg sm:text-3xl font-black jazz-gold-text block">18+</span>
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#cdc3b2]">
                    Estilos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Real Songs & Styles Marquee */}
      <div className="border-y border-[#f5d58a]/15 bg-black/50 py-3 overflow-hidden jazz-marquee-wrap">
        <div className="jazz-marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-6 pr-6 shrink-0" aria-hidden={dup === 1}>
              {MARQUEE_TAGS.map((label) => (
                <span
                  key={`${dup}-${label}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.14em] text-[#f5d58a]/85 whitespace-nowrap"
                >
                  <span className="text-[#1ed760]">♪</span>
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 2. PARTITURAS HD MARQUEE (All 7 Real Sheets + Lightbox Zoom) */}
      <section id="offer-partituras" className="py-12 md:py-16 relative">
        <div className="max-w-4xl mx-auto px-4 text-center mb-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d58a] mb-4">
            <FileText className="w-4 h-4 shrink-0" />
            <span>Diagramação Limpa em Alta Definição</span>
          </div>

          <h2 className="jazz-h2 text-white mb-3 jazz-reveal">
            Veja a Qualidade Real das <span className="jazz-gold-text italic">Partituras</span>
          </h2>
          <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto">
            Folhas revisadas compasso a compasso, prontas para ler no celular, tablet ou imprimir —
            já transpostas para <strong className="text-[#f5d58a]">Sax Alto (Eb) e Sax Tenor (Bb)</strong>:
          </p>
        </div>

        <div className="relative w-full jazz-marquee-wrap overflow-hidden py-2 mb-6">
          <div className="jazz-marquee-track">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-stretch gap-3.5 pr-3.5 shrink-0" aria-hidden={half === 1}>
                {SHEETS.map((sheet) => (
                  <button
                    key={`${half}-${sheet.id}`}
                    type="button"
                    tabIndex={half === 1 ? -1 : 0}
                    onClick={() => setZoomedSheet(sheet)}
                    className="group w-[205px] sm:w-[250px] shrink-0 rounded-2xl overflow-hidden bg-white border-2 border-[#f5d58a]/35 shadow-2xl text-left flex flex-col cursor-pointer hover:border-[#f5d58a]"
                  >
                    <div className="bg-[#111015] text-white px-3 py-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-[#f5d58a] truncate">{sheet.genre}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1ed760]/20 text-[#1ed760] shrink-0">
                        Eb & Bb
                      </span>
                    </div>
                    <div className="relative aspect-[210/288] bg-white overflow-hidden">
                      <img
                        src={sheet.src}
                        alt={`Partitura ${sheet.title} — ${sheet.artist}`}
                        width={250}
                        height={342}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="bg-[#faf6ef] px-3 py-2 border-t border-black/10 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#181109] truncate">{sheet.title}</p>
                        <p className="text-[11px] font-semibold text-[#5c4c38] truncate">{sheet.artist}</p>
                      </div>
                      <span className="text-[10px] font-extrabold bg-[#181109] text-[#f5d58a] px-2 py-0.5 rounded shrink-0">
                        PDF+MP3
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-bold text-[#f5d58a]">
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5d58a]/25 rounded-full px-3.5 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1ed760]" /> Notas Grandes e Legíveis
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5d58a]/25 rounded-full px-3.5 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1ed760]" /> Cifras + Melodia Completa
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5d58a]/25 rounded-full px-3.5 py-1.5">
            <ZoomIn className="w-4 h-4 text-[#f5d58a]" /> Toque na folha para dar zoom
          </span>
        </div>
      </section>

      {/* 3. O QUE ESTÁ INCLUSO — ECOSSISTEMA COMPLETO (4 Cards Ilustrados — Alto Eb & Tenor Bb) */}
      <section id="offer-incluso" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d58a] mb-4">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Estação Completa do Saxofonista • Alto Eb & Tenor Bb</span>
            </div>

            <h2 className="jazz-h2 text-white mb-4 jazz-reveal">
              Esqueça PDFs Bagunçados. <br className="hidden sm:block" />
              Tenha <span className="jazz-gold-text italic">Tudo em Um Único App</span>
            </h2>
            <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto">
              Criado sob medida para quem toca{" "}
              <strong className="text-white">Sax Alto (Eb) e Sax Tenor (Bb)</strong> (com as duas
              afinações inclusas em todo o acervo). Veja cada recurso na prática:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 jazz-stagger-group">
            {[
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
            ].map((item) => (
              <div key={item.title} className="jazz-stagger-item jazz-glass rounded-3xl p-5 sm:p-6 flex flex-col">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                  <span className="rounded-full bg-[#f5d58a]/14 border border-[#f5d58a]/40 px-3 py-1 text-xs font-extrabold uppercase text-[#f5d58a]">
                    {item.badge}
                  </span>
                  <span className="rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3 py-1 text-[11px] font-black uppercase text-[#1ed760]">
                    {item.tag}
                  </span>
                </div>
                <h3 className="jazz-h3 text-white mb-4">{item.title}</h3>
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black border border-white/10 mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={760}
                    height={475}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="jazz-body text-[#cdc3b2]">{item.desc}</p>
              </div>
            ))}

            {/* 4th Card: +18 Estilos, Harpa Cristã, Vídeos Tutoriais & Vitalício */}
            <div className="jazz-stagger-item jazz-glass rounded-3xl p-5 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                <span className="rounded-full bg-[#f5d58a]/14 border border-[#f5d58a]/40 px-3 py-1 text-xs font-extrabold uppercase text-[#f5d58a]">
                  Acervo Vitalício
                </span>
                <span className="rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3 py-1 text-[11px] font-black uppercase text-[#1ed760]">
                  Sem Mensalidade
                </span>
              </div>
              <h3 className="jazz-h3 text-white mb-4">
                +18 Estilos, Harpa Cristã & Vídeos Tutoriais Inclusos
              </h3>
              <div className="aspect-[16/10] w-full rounded-2xl bg-gradient-to-br from-[#16120c] via-[#0c0a0d] to-[#08130d] border border-[#f5d58a]/25 p-3 mb-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-black/55 border border-[#f5d58a]/25 p-2.5 flex flex-col justify-between">
                  <FolderOpen className="w-4 h-4 text-[#f5d58a]" />
                  <div>
                    <p className="text-xs font-extrabold text-white">18+ Pastas</p>
                    <p className="text-[10px] text-[#cdc3b2] truncate">MPB • Pop • Jazz • Gospel</p>
                  </div>
                </div>
                <div className="rounded-xl bg-black/55 border border-[#1ed760]/25 p-2.5 flex flex-col justify-between">
                  <PlayCircle className="w-4 h-4 text-[#1ed760]" />
                  <div>
                    <p className="text-xs font-extrabold text-white">Vídeos Tutoriais</p>
                    <p className="text-[10px] text-[#cdc3b2] truncate">Passo a passo no app</p>
                  </div>
                </div>
                <div className="rounded-xl bg-black/55 border border-[#f5d58a]/25 p-2.5 flex flex-col justify-between">
                  <BookOpen className="w-4 h-4 text-[#f5d58a]" />
                  <div>
                    <p className="text-xs font-extrabold text-white">Harpa Cristã</p>
                    <p className="text-[10px] text-[#cdc3b2] truncate">640 Hinos Eb & Bb</p>
                  </div>
                </div>
                <div className="rounded-xl bg-black/55 border border-[#1ed760]/25 p-2.5 flex flex-col justify-between">
                  <InfinityIcon className="w-4 h-4 text-[#1ed760]" />
                  <div>
                    <p className="text-xs font-extrabold text-white">Atualizações</p>
                    <p className="text-[10px] text-[#cdc3b2] truncate">Músicas novas todo mês</p>
                  </div>
                </div>
              </div>
              <p className="jazz-body text-[#cdc3b2]">
                Pague uma única vez e tenha todas as +18 pastas organizadas, os 640 louvores da
                Harpa Cristã, aulas rápidas de uso e atualizações mensais para sempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLAYBACKS DE ESTÚDIO INTERATIVOS (12 Faixas MP3 Reais) */}
      <OfferPlaybackPlayer sax={sax} onScrollToPlans={scrollToPlans} />

      {/* 5. COMO FUNCIONA — ÚNICA SEÇÃO COM STORYTELLING GUIADO POR SCROLL (E-mail + Interface no iPhone) */}
      <section ref={howItWorksRef} id="offer-como-funciona" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Entrega Imediata no E-mail */}
          <div className="jazz-glass rounded-3xl p-5 sm:p-9 md:p-11 border border-[#1ed760]/35">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-[#1ed760] mb-4">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Entrega 100% Automática • 24h por Dia</span>
                </div>

                <h2 className="jazz-h2 text-white mb-4 jazz-reveal">
                  Comprou, Chegou no <span className="text-[#1ed760] italic">Seu E-mail</span> na
                  Mesma Hora com Seu Login!
                </h2>

                <p className="jazz-body text-[#cdc3b2] mb-6">
                  Sem esperar aprovação manual e sem links confusos! Nosso sistema libera seu acesso{" "}
                  <strong className="text-white">automaticamente em segundos</strong>, inclusive de
                  madrugada, finais de semana e feriados:
                </p>

                <div className="space-y-3.5 mb-7">
                  {[
                    {
                      step: "01",
                      icon: ShieldCheck,
                      title: "Escolha Seu Plano com Pagamento Seguro",
                      badge: "PIX ou Cartão • Aprovação em 2s ✓",
                      desc: "Finalize via Pix ou Cartão no ambiente criptografado da Wiapy.",
                    },
                    {
                      step: "02",
                      icon: Mail,
                      title: "Receba o E-mail Oficial na Mesma Hora",
                      badge: "Caixa de Entrada • acesso@clubedosax.com",
                      desc: "Em menos de 1 minuto o e-mail oficial chega com o botão direto do aplicativo.",
                    },
                    {
                      step: "03",
                      icon: KeyRound,
                      title: "Use Seu Login & Senha e Comece a Tocar!",
                      badge: "app.clubedosax.com • Login + Senha Ativos",
                      desc: "Entre pelo celular, tablet ou computador com tudo desbloqueado na hora.",
                    },
                  ].map((s, idx) => {
                    const isFocused = activeHowStep === idx;
                    return (
                      <div
                        key={s.step}
                        className={`flex items-start gap-3.5 rounded-2xl p-4 border transition-all duration-300 ${
                          isFocused
                            ? "bg-[#1ed760]/10 border-[#1ed760]/50 shadow-[0_0_28px_rgba(30,215,96,0.12)]"
                            : "bg-black/45 border-white/10"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#f5d58a]/15 border border-[#f5d58a]/35 text-[#f5d58a] flex items-center justify-center shrink-0">
                          <s.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-black uppercase tracking-widest text-[#f5d58a]">
                            Passo {s.step}
                          </span>
                          <h3 className="text-base font-black text-white leading-snug">{s.title}</h3>
                          <span className="inline-block mt-1 mb-1 rounded-lg bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[11px] font-mono font-bold text-[#1ed760]">
                            {s.badge}
                          </span>
                          <p className="text-sm text-[#cdc3b2]">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={scrollToPlans}
                  className="jazz-cta-primary w-full sm:w-auto px-7 py-4 rounded-2xl text-sm sm:text-base uppercase tracking-wider inline-flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Ativar meu acervo no e-mail agora</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              </div>

              {/* Sticky-on-desktop Welcome E-mail Credential Card */}
              <div className="lg:sticky lg:top-24">
                <div className="rounded-3xl overflow-hidden border border-[#f5d58a]/35 bg-[#09080c] shadow-2xl max-w-md mx-auto lg:max-w-none">
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={illEmail}
                      alt="Acesso enviado imediatamente por e-mail"
                      width={760}
                      height={475}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09080c] via-[#09080c]/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/85 border border-[#1ed760]/45 px-3.5 py-2">
                      <span className="inline-flex items-center gap-2 text-xs font-extrabold text-white">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1ed760]" />
                        Novo E-mail Recebido!
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1ed760]">
                        <Clock className="w-3 h-3" /> Na hora
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-[#0d0c11] text-left">
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <p className="text-xs text-[#cdc3b2] truncate">
                        <strong className="text-white">De:</strong> Clube do Sax Oficial &lt;acesso@clubedosax.com&gt;
                      </p>
                      <p className="text-sm font-black text-[#f5d58a] mt-1">
                        🎷 Parabéns! Seu Login do Aplicativo Clube do Sax está Liberado!
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] border border-[#f5d58a]/25 p-3.5 mb-4 space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-[#cdc3b2]">Seu Login:</span>
                        <span className="font-mono font-bold text-white">seu.email@gmail.com</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#cdc3b2]">Sua Senha VIP:</span>
                        <span className="font-mono font-bold text-[#1ed760]">SAX-VIP-2026 ✓</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#cdc3b2]">Afinação Ativa:</span>
                        <span className="font-bold text-[#f5d58a]">{saxLabel} + Ambos</span>
                      </div>
                    </div>

                    <div className="w-full rounded-xl bg-gradient-to-r from-[#f5d58a] to-[#b8892e] text-[#1a1003] font-black text-xs uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2">
                      <Smartphone className="w-4 h-4 shrink-0" />
                      <span>Acessar Aplicativo Clube do Sax</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interface Oficial no iPhone (App Simulation Showcase) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_340px] gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d58a] mb-4">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Interface Oficial do Aluno</span>
              </div>

              <h2 className="jazz-h2 text-white mb-4 jazz-reveal">
                Navegue Pela Plataforma <span className="jazz-gold-text italic">Como um Aplicativo de Verdade</span>
              </h2>

              <p className="jazz-body text-[#cdc3b2] mb-6 max-w-xl mx-auto lg:mx-0">
                Encontre qualquer música em segundos, abra a{" "}
                <strong className="text-white">partitura em alta definição</strong> e dê play no{" "}
                <strong className="text-[#f5d58a]">playback profissional na mesma tela</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-7 jazz-stagger-group">
                {[
                  { icon: Smartphone, title: "iPhone, Android, Tablet & PC", sub: "Roda direto no navegador como um App" },
                  { icon: Cloud, title: "Zero Memória Ocupada", sub: "+10.000 arquivos salvos na nuvem" },
                  { icon: FileText, title: "Partitura + MP3 na Mesma Tela", sub: "Sax Alto (Eb) e Sax Tenor (Bb)" },
                  { icon: Mic, title: "Busca por Texto ou Voz", sub: "Localize qualquer música em 1s" },
                ].map((c) => (
                  <div key={c.title} className="jazz-stagger-item jazz-glass rounded-2xl p-3.5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f5d58a]/12 border border-[#f5d58a]/30 text-[#f5d58a] flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{c.title}</p>
                      <p className="text-xs text-[#cdc3b2]">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={scrollToPlans}
                className="jazz-cta-primary w-full sm:w-auto px-8 py-4 rounded-2xl text-sm sm:text-base uppercase tracking-wider inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Ativar meu acervo no bolso</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-[310px] jazz-iphone-frame">
                <div className="jazz-iphone-screen p-3.5 text-left space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black text-[#f5d58a] flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" /> Bibliotecas (+18 Estilos)
                    </span>
                    <span className="text-[10px] font-bold text-[#1ed760]">Organizado</span>
                  </div>
                  {[
                    { name: "MPB & Clássicos Brasil", count: "850+ músicas", emoji: "🇧🇷" },
                    { name: "Gospel & Harpa Cristã", count: "1.420+ músicas", emoji: "🙌" },
                    { name: "Pop & Românticas", count: "820+ músicas", emoji: "🎷" },
                    { name: "Jazz, Bossa & Standards", count: "970+ músicas", emoji: "🎺" },
                    { name: "Casamento & Eventos", count: "690+ músicas", emoji: "💍" },
                  ].map((f) => (
                    <div key={f.name} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="text-base">{f.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">{f.name}</p>
                        <p className="text-[10px] font-bold text-[#f5d58a]">{f.count}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DEPOIMENTOS REAIS (6 Vídeos MP4 + 10 Prints Fixos de WhatsApp & Comunidade) */}
      <section id="offer-depoimentos" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#25D366] mb-4">
              <Users className="w-4 h-4 shrink-0" />
              <span>+847 Saxofonistas Reais Satisfeitos</span>
            </div>

            <h2 className="jazz-h2 text-white mb-4 jazz-reveal">
              Veja Quem Já Está Tocando com o <span className="jazz-gold-text italic">Clube do Sax</span>
            </h2>
            <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto">
              De iniciantes realizando o sonho aos 68 anos até professores e maestros de bandas
              municipais — confira vídeos e conversas reais sem cortes:
            </p>
          </div>

          {/* 6 Video Testimonials */}
          <div className="mb-14">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <Video className="w-5 h-5 text-[#f5d58a]" />
              <h3 className="jazz-h3 text-white">Depoimentos em Vídeo de Alunos Reais</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {VIDEO_TESTIMONIALS.map((t, i) => (
                <div key={t.src} className="jazz-glass rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-[9/16] bg-[#110f14]">
                    {activeVideoIdx === i ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[i] = el;
                        }}
                        src={t.src}
                        poster={t.poster}
                        controls
                        autoPlay
                        playsInline
                        onPlay={() => {
                          audioEngine.stopComparison();
                          videoRefs.current.forEach((v, idx) => {
                            if (v && idx !== i) v.pause();
                          });
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          audioEngine.stopComparison();
                          videoRefs.current.forEach((v, idx) => {
                            if (v && idx !== i) v.pause();
                          });
                          setActiveVideoIdx(i);
                          setTimeout(() => videoRefs.current[i]?.play().catch(() => {}), 40);
                        }}
                        className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
                        aria-label={`Assistir depoimento em vídeo de ${t.name}`}
                      >
                        <img
                          src={t.poster}
                          alt={`Depoimento de ${t.name}`}
                          width={360}
                          height={640}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/75" />
                        <div className="relative z-10 flex flex-col items-center gap-1.5">
                          <div className="w-11 h-11 rounded-full bg-[#f5d58a] text-[#1a1003] flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 ml-0.5 fill-current" />
                          </div>
                          <span className="text-[11px] font-extrabold uppercase text-white">Assistir</span>
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="p-2.5 text-left">
                    <p className="text-xs sm:text-sm font-black text-white truncate">{t.name}</p>
                    <p className="text-[11px] text-[#cdc3b2] truncate">{t.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Fixed WhatsApp & Community Prints */}
          <div className="rounded-3xl bg-gradient-to-r from-[#075E54]/85 via-[#0b3d36]/90 to-[#121c17]/95 border border-[#25D366]/35 px-5 py-4 mb-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Mural Fixo de Mensagens no WhatsApp & Comunidade
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85">
                Todos os 10 prints reais listados lado a lado (toque em qualquer print para ampliar)
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-full px-4 py-2 shrink-0">
              <div className="flex text-[#f5d58a]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-black text-white ml-1">4.9/5</span>
            </div>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {WHATSAPP_PRINTS.map((item) => {
              const isWa = item.channel === "WhatsApp";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPrint(item)}
                  className={`w-full text-left break-inside-avoid rounded-2xl overflow-hidden border transition-all cursor-pointer block ${
                    isWa ? "bg-[#0b1813] border-[#25D366]/30" : "bg-[#14110b] border-[#f5d58a]/30"
                  }`}
                >
                  <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 border-b border-white/10">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold text-white truncate">{item.author}</p>
                      <p className="text-[11px] text-white/70 truncate">{item.role}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-white shrink-0">
                      <CheckCheck className="w-3 h-3 text-[#38bdf8]" /> {item.channel}
                    </span>
                  </div>
                  <div className="bg-white">
                    <img
                      src={item.src}
                      alt={`Depoimento de ${item.author}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block object-contain"
                    />
                  </div>
                  <div className="px-3.5 py-2.5 text-xs text-[#e5dec9] italic">“{item.quoteHighlight}”</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CATÁLOGO REAL DE MÚSICAS (12 Pastas + Modal Completo) */}
      <section id="offer-catalogo" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d58a] mb-4">
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>Repertório Real Organizado por Estilo</span>
            </div>
            <h2 className="jazz-h2 text-white mb-4 jazz-reveal">
              Mais de <span className="jazz-gold-text italic">10.000 Músicas</span> Prontas Para Você Tocar
            </h2>
            <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto">
              Explore abaixo uma amostra real das pastas dentro do aplicativo — todas com partitura
              para <strong className="text-white">Sax Alto (Eb) e Sax Tenor (Bb)</strong> + playback:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATALOG_GENRES.map((genre) => {
              const isExp = expandedGenre === genre.id;
              const visible = isExp ? genre.songs : genre.songs.slice(0, 6);
              return (
                <div key={genre.id} className="jazz-glass rounded-3xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      <span className="text-2xl">{genre.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="font-black text-base text-white truncate">{genre.name}</h3>
                        <p className="text-xs font-bold text-[#f5d58a]">
                          +{genre.totalCount.toLocaleString("pt-BR")} músicas na pasta
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {visible.map((song, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Music className="w-3.5 h-3.5 text-[#f5d58a] shrink-0 mt-1" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white/95 truncate">{song.title}</p>
                            <p className="text-xs text-[#cdc3b2]/80 truncate">{song.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {genre.songs.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setExpandedGenre(isExp ? null : genre.id)}
                      className="mt-4 min-h-[40px] w-full text-xs font-black text-[#f5d58a] uppercase flex items-center justify-center gap-1 rounded-xl bg-[#f5d58a]/10 border border-[#f5d58a]/25 cursor-pointer"
                    >
                      <span>{isExp ? "Mostrar menos" : `Ver mais ${genre.songs.length - 6} exemplos`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExp ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-[#f5d58a] hover:text-white border-b border-[#f5d58a]/50 pb-1 cursor-pointer"
            >
              <span>Abrir lista com {totalSample}+ exemplos reais do catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. 3 GUIAS BÔNUS VIP (Com 3D Tilt nos Cards em Desktop) */}
      <section id="offer-bonus" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-6 lg:gap-10 items-center mb-10">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d58a] mb-4">
                <Gift className="w-4 h-4 shrink-0" />
                <span>Presentes Exclusivos do Plano Completo</span>
              </div>
              <h2 className="jazz-h2 text-white mb-3 jazz-reveal">
                Leve <span className="jazz-gold-text italic">3 Guias Bônus VIP</span> para Evoluir 3x Mais Rápido
              </h2>
              <p className="jazz-body text-[#cdc3b2]">
                Ao ativar o <strong className="text-white">Plano Completo VIP</strong>, além das
                +10.000 partituras com playback e busca por voz, esses 3 materiais especiais já
                aparecem desbloqueados dentro do seu aplicativo:
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden border border-[#f5d58a]/35 shadow-2xl relative max-w-md mx-auto lg:max-w-none">
              <img
                src={illBonusVip}
                alt="Mockup dos 3 Guias Bônus Exclusivos"
                width={760}
                height={475}
                loading="lazy"
                decoding="async"
                className="w-full h-56 sm:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block rounded-full bg-black/85 border border-[#f5d58a]/50 px-3.5 py-1.5 text-xs font-black text-[#f5d58a]">
                  🎁 Valor Total: R$ 141,00 → GRÁTIS HOJE
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 jazz-stagger-group">
            {BONUS_CARDS.map((b) => (
              <div
                key={b.tag}
                onMouseMove={(e) => handleBonusTilt(e, false)}
                onMouseLeave={(e) => handleBonusTilt(e, true)}
                className="jazz-stagger-item jazz-glass rounded-3xl p-6 flex flex-col justify-between transition-transform duration-150"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#f5d58a]">
                      {b.tag}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-[#cdc3b2]/70 line-through mr-2">{b.value}</span>
                      <span className="text-xs font-black text-[#1ed760] uppercase">Grátis</span>
                    </div>
                  </div>
                  <h3 className="jazz-h3 text-white mb-3">{b.title}</h3>
                  {b.preview}
                  <p className="jazz-body text-[#cdc3b2]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. OFERTA E INVESTIMENTO — PLANO COMPLETO VIP SEMPRE EM 1º LUGAR (MOBILE, TABLET E DESKTOP) */}
      <section id="offer-plans" className="scroll-mt-16 py-14 md:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d58a] mb-4">
              <Crown className="w-4 h-4 shrink-0" />
              <span>Ative Seu Acervo • Pagamento Único Vitalício</span>
            </div>

            <h2 className="jazz-h2 text-white mb-4 jazz-reveal">
              Ative Seu Passaporte para o <span className="jazz-gold-text italic">Clube do Sax</span>
            </h2>
            <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto">
              Todo o acervo pronto para <strong className="text-white">{saxLabel}</strong> (e ambos
              os tons inclusos) com{" "}
              <strong className="text-[#1ed760]">Login enviado no seu e-mail na mesma hora!</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.14fr_0.86fr] gap-7 lg:gap-10 items-stretch">
            {/* 1ª OPÇÃO (SEMPRE PRIMEIRA): PLANO COMPLETO VIP */}
            <div className="relative md:-mt-2 md:mb-2">
              <div
                className="pointer-events-none absolute -inset-[2px] rounded-[30px] opacity-85 blur-[3px]"
                style={{
                  background: "linear-gradient(135deg, #f5d58a 0%, #b8892e 45%, #1ed760 100%)",
                }}
              />
              <div className="relative h-full rounded-3xl bg-gradient-to-b from-[#1a150b] via-[#100e09] to-[#08080c] border-2 border-[#f5d58a]/80 p-6 sm:p-9 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f5d58a] to-[#c9952c] text-[#1a1003] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
                      <Crown className="w-3.5 h-3.5" /> 1ª Opção • Escolha de 94% dos Alunos
                    </span>
                    <span className="rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3 py-1 text-[11px] font-black uppercase text-[#1ed760]">
                      Mais Completo
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
                    Plano Completo <span className="jazz-gold-text italic">VIP</span>
                  </h3>
                  <p className="text-sm sm:text-base text-[#cdc3b2] mb-5">
                    O aplicativo completo com +10.000 Partituras, Playbacks estilo Spotify, Busca por Voz e os 3 Bônus!
                  </p>

                  {/* Investment Framing using exclusively real numbers from /lp-3 */}
                  <div className="mb-6 bg-black/50 border border-[#f5d58a]/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs sm:text-sm text-[#cdc3b2] line-through">
                        Valor real: R$ 197,00 (+ R$ 141 em bônus)
                      </span>
                      <span className="text-[11px] font-black uppercase bg-[#1ed760]/20 text-[#1ed760] px-2.5 py-0.5 rounded-full">
                        87% OFF Hoje
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#f5d58a]">R$</span>
                      <span className="text-5xl sm:text-6xl font-black jazz-gold-text tracking-tighter">
                        24,90
                      </span>
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#1ed760] block mt-1">
                      Pagamento Único • Acesso Vitalício (menos de R$ {costPerDay}/dia no 1º ano)
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

                  <ul className="space-y-2.5 mb-6">
                    {PREMIUM_FEATURES.map((f, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2.5 text-sm sm:text-base font-bold ${
                          f.highlight ? "text-[#1ed760]" : f.bonus ? "text-[#f5d58a]" : "text-white/95"
                        }`}
                      >
                        <div className="mt-1 shrink-0">
                          {f.bonus ? (
                            <Star className="w-4 h-4 text-[#f5d58a] fill-[#f5d58a]" />
                          ) : (
                            <Check className="w-4 h-4 text-[#1ed760]" />
                          )}
                        </div>
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-2xl bg-[#f5d58a]/12 border border-[#f5d58a]/30 p-3.5 mb-6 text-center">
                    <p className="text-xs sm:text-sm font-bold text-[#f5d58a]">
                      💡 Melhor Investimento: por apenas <strong>R$ 10 de diferença</strong> você leva
                      todos os <strong className="text-white">+10.000 Playbacks de Estúdio</strong>, Busca por Voz e os 3 Bônus!
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleCheckout("premium")}
                    className="jazz-cta-primary w-full py-4 sm:py-5 px-6 rounded-2xl text-base uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span>{FUNNEL_CONFIG.copy.scene5.vipCta}</span>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-[#cdc3b2] font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#f5d58a]" /> Checkout Seguro Wiapy
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#1ed760]" /> Login Imediato no E-mail
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2ª OPÇÃO (SECUNDÁRIA): PLANO BÁSICO */}
            <div className="jazz-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between opacity-95">
              <div>
                <div className="mb-6">
                  <span className="inline-block bg-white/5 text-[#cdc3b2] px-3.5 py-1 rounded-full text-xs font-black uppercase mb-3 border border-white/10">
                    2ª Opção • Apenas PDFs
                  </span>
                  <h3 className="text-2xl font-black text-white mb-1.5">Plano Básico</h3>
                  <p className="text-sm text-[#cdc3b2]">
                    Opção enxuta para quem deseja somente partituras em PDF sem acompanhamento musical.
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-[#cdc3b2]">R$</span>
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">14,90</span>
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#cdc3b2]">
                    Pagamento Único • Acesso Vitalício
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {ESSENTIAL_HAS.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/90 font-medium">
                      <Check className="w-4 h-4 text-[#f5d58a] shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-4 mb-6">
                  <p className="text-xs font-black uppercase text-white/40 mb-3">Fica de fora no Básico:</p>
                  <ul className="space-y-2">
                    {ESSENTIAL_MISSING.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/40">
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
                className="min-h-[52px] w-full py-4 px-5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-black uppercase tracking-wider text-sm cursor-pointer"
              >
                {FUNNEL_CONFIG.copy.scene5.basicCta}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10 pt-8 border-t border-white/10 text-xs sm:text-sm font-semibold text-[#cdc3b2]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#f5d58a]" /> Garantia Incondicional de 7 Dias
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#1ed760]" /> Pagamento Criptografado via Wiapy
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#f5d58a]" /> Entrega Automática por E-mail 24h
            </span>
          </div>
        </div>
      </section>

      {/* 10. GARANTIA DE 7 DIAS */}
      <section className="py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center jazz-glass rounded-3xl p-6 sm:p-12 border border-[#f5d58a]/35">
          <h2 className="jazz-h2 text-white mb-5 jazz-reveal">
            Sua Satisfação Garantida Por <span className="jazz-gold-text italic">7 Dias Sem Risco!</span>
          </h2>
          <img
            src={seloGarantia}
            alt="Selo de Garantia de 7 Dias"
            width={144}
            height={144}
            loading="lazy"
            decoding="async"
            className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-6 drop-shadow-2xl"
          />
          <p className="jazz-body text-[#cdc3b2]">
            Receba seu login por e-mail agora mesmo, entre no aplicativo, baixe partituras e toque
            junto com os playbacks. Se dentro de 7 dias você não ficar 100% apaixonado pela
            plataforma, devolvemos todo o seu dinheiro{" "}
            <strong className="text-white">sem perguntas e sem burocracia.</strong>
          </p>
        </div>
      </section>

      {/* 11. FAQ COMPLETO */}
      <section id="offer-faq" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d58a] mb-4">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Tire Suas Dúvidas</span>
            </div>
            <h2 className="jazz-h2 text-white jazz-reveal">
              Perguntas <span className="jazz-gold-text italic">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`offer-faq-${idx}`}
                className="jazz-glass rounded-2xl px-5 sm:px-6 border border-[#f5d58a]/20"
              >
                <AccordionTrigger className="text-left font-bold text-base sm:text-lg text-white py-4 hover:no-underline hover:text-[#f5d58a]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="jazz-body text-[#cdc3b2] pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 12. CTA FINAL + ÁREA DO ALUNO + RODAPÉ */}
      <section className="py-12 md:py-16 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="jazz-h2 text-white mb-4 jazz-reveal">
            O Palco Está Pronto Para o Seu{" "}
            <span className="jazz-gold-text italic">{saxLabel}</span>
          </h2>
          <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto mb-7">
            Mais de 10.000 partituras com playback de estúdio para Sax Alto e Sax Tenor, busca por
            voz e 3 bônus no <strong className="text-[#f5d58a]">Plano Completo VIP por R$ 24,90</strong>{" "}
            (pagamento único) — com{" "}
            <strong className="text-[#1ed760]">Login enviado direto no seu e-mail na mesma hora!</strong>
          </p>

          <button
            type="button"
            onClick={() => handleCheckout("premium")}
            className="jazz-cta-primary w-full sm:w-auto py-4 sm:py-5 px-8 sm:px-14 rounded-2xl text-base sm:text-lg uppercase tracking-wider inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>{FUNNEL_CONFIG.copy.scene5.primaryCta}</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </section>

      {/* Já assinou / Área do Aluno */}
      <section aria-label="Acesso para alunos assinantes" className="px-4 sm:px-6 pb-12 pt-2">
        <div className="max-w-xl mx-auto jazz-glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#f5d58a]/35 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#f5d58a] mb-1">
              Área do Aluno
            </p>
            <h3 className="text-base sm:text-lg font-black text-white">Já assinou o Clube do Sax?</h3>
            <p className="text-xs sm:text-sm text-[#cdc3b2]">
              Acesse agora sua conta para abrir o aplicativo e suas partituras.
            </p>
          </div>
          <a
            href={FUNNEL_CONFIG.links.studentLogin}
            className="jazz-cta-gold w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shrink-0"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>Entrar no Aplicativo</span>
          </a>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-[#f5d58a]/15 bg-[#050507] text-center">
        <img
          src={logoClubeSax}
          alt="Clube do Sax"
          width={72}
          height={52}
          loading="lazy"
          className="h-12 w-auto mx-auto mb-4"
        />
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-xs sm:text-sm text-[#cdc3b2]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#f5d58a]" /> Site 100% Seguro
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#1ed760]" /> Pagamento via Wiapy
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#f5d58a]" /> Entrega Imediata no E-mail
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#cdc3b2]/80 max-w-md mx-auto mb-4">
          Produto digital com entrega automática na mesma hora. Assim que o pagamento é confirmado,
          você recebe no seu e-mail seu login e senha exclusivos para entrar no aplicativo Clube do Sax.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-xs sm:text-sm text-[#cdc3b2]">
          <a href={FUNNEL_CONFIG.links.termsUrl} className="hover:text-[#f5d58a]">Termos de Uso</a>
          <span className="opacity-40">•</span>
          <a href={FUNNEL_CONFIG.links.privacyUrl} className="hover:text-[#f5d58a]">Política de Privacidade</a>
          <span className="opacity-40">•</span>
          <a href={FUNNEL_CONFIG.links.studentLogin} className="text-[#f5d58a] font-bold">Login do Aluno</a>
        </div>
        <p className="text-xs text-[#cdc3b2]/65">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
          <br />
          CNPJ: 51.919.716/0001-28
        </p>
      </footer>

      {/* STICKY MOBILE CTA BAR (Appears ONLY after Hero leaves viewport) */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#07070a]/95 backdrop-blur-md border-t border-[#f5d58a]/30 p-2.5 z-40 jazz-safe-bottom">
          <button
            type="button"
            onClick={scrollToPlans}
            className="w-full jazz-cta-primary py-3.5 px-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ativar meu acervo • R$ 24,90</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}
      <div className="h-20 md:hidden" aria-hidden="true" />

      {/* Lightbox: Sheet Zoom */}
      {zoomedSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização da partitura ${zoomedSheet.title}`}
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedSheet(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[88vh] bg-[#111015] border border-[#f5d58a]/40 rounded-3xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h4 className="text-sm sm:text-base font-black text-white truncate">
                {zoomedSheet.title} — {zoomedSheet.artist}
              </h4>
              <button
                type="button"
                onClick={() => setZoomedSheet(null)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer"
                aria-label="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-3 bg-white flex justify-center">
              <img src={zoomedSheet.src} alt={zoomedSheet.title} className="max-w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox: WhatsApp Print */}
      {selectedPrint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Depoimento ampliado de ${selectedPrint.author}`}
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPrint(null)}
        >
          <div
            className="max-w-3xl w-full bg-[#0e1713] border border-[#25D366]/45 rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#075E54]/85 border-b border-white/10">
              <h4 className="text-sm sm:text-base font-black text-white truncate">
                {selectedPrint.author} — {selectedPrint.role}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPrint(null)}
                className="w-9 h-9 rounded-full bg-black/35 flex items-center justify-center text-white cursor-pointer"
                aria-label="Fechar depoimento"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-black/40 max-h-[82vh] overflow-y-auto flex justify-center">
              <img src={selectedPrint.src} alt={selectedPrint.author} className="max-w-full h-auto rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Full Catalog */}
      {showCatalogModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lista completa da amostra do catálogo"
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowCatalogModal(false)}
        >
          <div
            className="max-w-4xl w-full max-h-[86vh] bg-[#0f0e13] border border-[#f5d58a]/40 rounded-3xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h3 className="text-base sm:text-xl font-black text-white">Amostra Real do Catálogo</h3>
                <p className="text-xs text-[#cdc3b2]">
                  {totalSample}+ exemplos listados de +{TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")} músicas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer"
                aria-label="Fechar catálogo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {CATALOG_GENRES.map((g) => (
                <div key={g.id}>
                  <h4 className="font-black text-white mb-2 pb-1.5 border-b border-white/10">
                    {g.emoji} {g.name} (+{g.totalCount.toLocaleString("pt-BR")})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {g.songs.map((s, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-[#cdc3b2] truncate">
                        <strong className="text-white">{s.title}</strong> — {s.artist}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setShowCatalogModal(false);
                  scrollToPlans();
                }}
                className="jazz-cta-primary w-full py-3.5 rounded-2xl text-sm uppercase tracking-wider cursor-pointer"
              >
                Ativar meu acervo completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferSection;
