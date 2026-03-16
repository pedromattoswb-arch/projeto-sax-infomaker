import { useState, useEffect, useRef } from "react";
import {
  Music,
  Headphones,
  Mic,
  FolderOpen,
  Infinity,
  RefreshCw,
  ArrowRight,
  Star,
  CheckCircle2,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Search,
  BookOpen,
  Video,
  Smartphone,
  Award,
  Zap,
  Users,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import logoSaxplay from "@/assets/logo-saxplay-dark.webp";
import SalesVideoPlayer from "./SalesVideoPlayer";

import VideoTestimonialCarousel from "./VideoTestimonialCarousel";
import TestimonialCarousel from "./TestimonialCarousel";
import PricingCards from "./PricingCards";
import BonusSection from "./BonusSection";
import SongCatalog from "./SongCatalog";
import FAQ from "./FAQ";
import WhatsAppButton from "./WhatsAppButton";
import PartituraCarousel from "./PartituraCarousel";
import PlaybackSamples from "./PlaybackSamples";
import AppSimulation from "./AppSimulation";

const features = [
  { icon: Smartphone, title: "Plataforma Exclusiva", description: "Sua própria plataforma estilo app — acesse de qualquer dispositivo", metric: "24/7" },
  { icon: Music, title: "+10.000 Arquivos", description: "Partituras e playbacks para Sax Alto e Sax Tenor", metric: "10K+" },
  { icon: Search, title: "Busca Inteligente", description: "Encontre qualquer música em segundos — por nome, gênero ou artista", metric: "< 2s" },
  { icon: Mic, title: "Busca por Voz", description: "Fale o nome da música e a plataforma encontra pra você", metric: "🎤" },
  { icon: Video, title: "Vídeos Tutoriais", description: "Aprenda a usar cada recurso com tutoriais integrados na plataforma", metric: "HD" },
  { icon: BookOpen, title: "Material de Estudo", description: "Rotina de estudo, mapa de tonalidades e guias exclusivos", metric: "3 guias" },
  { icon: FolderOpen, title: "+18 Gêneros Musicais", description: "Pop, MPB, Rock, Gospel, Jazz, Bossa Nova, Natal, Casamento…", metric: "18+" },
  { icon: Infinity, title: "Acesso Vitalício", description: "Pague uma vez. Acesse para sempre. Atualizações incluídas", metric: "∞" },
];

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const SalesPage = () => {
  const counter1 = useCounter(10000, 2500);
  const counter2 = useCounter(847, 2000);
  const counter3 = useCounter(18, 1500);

  // Random "viewing now" number
  const [viewingNow] = useState(() => Math.floor(Math.random() * 25) + 18);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-surface/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src={logoSaxplay} alt="SaxPlay — O Maior Acervo de Partituras Para Sax do Brasil" className="h-8 md:h-10 w-auto" />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-primary font-bold font-heading bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
              <Award className="w-3 h-3" />
              Maior Acervo do Brasil
            </span>
            <div className="text-right">
              <span className="text-xs text-muted-foreground font-body block leading-tight">A partir de</span>
              <span className="text-lg md:text-xl font-extrabold text-primary font-heading">R$ 19,90</span>
            </div>
          </div>
        </div>
      </header>

      {/* AUTHORITY BAR */}
      <div className="bg-surface border-b border-border py-2.5 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] md:text-xs text-muted-foreground font-body">Recomendado por escolas de sax</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] md:text-xs text-muted-foreground font-body">+847 alunos ativos</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
            ))}
            <span className="text-[11px] md:text-xs text-muted-foreground font-body ml-1">4.9/5</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-live-dot" />
            <span className="text-[11px] text-green-400 font-body font-semibold">{viewingNow} online agora</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="py-10 md:py-20 px-4 md:px-8 relative">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38_85%_50%/0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-live-dot" />
            <span className="text-[11px] md:text-xs text-muted-foreground font-body">
              <strong className="text-foreground">{viewingNow} saxofonistas</strong> vendo esta página agora
            </span>
          </div>

          <p className="text-base md:text-lg text-muted-foreground font-body mb-4 max-w-xl mx-auto leading-relaxed">
            <strong className="text-foreground">Você que toca Sax Alto ou Sax Tenor...</strong> imagina abrir o celular e ter <strong className="text-primary">QUALQUER música</strong> pronta pra tocar?
          </p>

          <SalesVideoPlayer />

          <h1 className="text-[26px] md:text-4xl lg:text-5xl font-extrabold font-heading leading-[1.2] mb-5 md:mb-6">
            Chega de procurar PDF ruim na internet.{" "}
            <span className="text-primary">A SaxPlay tem tudo que você precisa.</span>
          </h1>

          <p className="text-base md:text-lg text-foreground font-body mb-4 md:mb-5 leading-relaxed max-w-2xl mx-auto">
            Sem tonalidade errada. Sem playback desafinado. Sem perder tempo.{" "}
            <strong className="text-foreground">+10.000 partituras e playbacks para Sax Alto e Sax Tenor</strong>, busca por voz, tutoriais e material de estudo — tudo na sua própria plataforma.
          </p>

          {/* Animated counters */}
          <div ref={counter1.ref} className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8 max-w-lg mx-auto">
            <div className="glass-card rounded-xl p-3 md:p-4 text-center">
              <span className="text-xl md:text-3xl font-extrabold font-heading text-primary tabular-nums">
                {counter1.count.toLocaleString("pt-BR")}+
              </span>
              <p className="text-[10px] md:text-xs text-muted-foreground font-body mt-0.5">Arquivos</p>
            </div>
            <div ref={counter2.ref} className="glass-card rounded-xl p-3 md:p-4 text-center">
              <span className="text-xl md:text-3xl font-extrabold font-heading text-primary tabular-nums">
                {counter2.count}+
              </span>
              <p className="text-[10px] md:text-xs text-muted-foreground font-body mt-0.5">Saxofonistas</p>
            </div>
            <div ref={counter3.ref} className="glass-card rounded-xl p-3 md:p-4 text-center">
              <span className="text-xl md:text-3xl font-extrabold font-heading text-primary tabular-nums">
                {counter3.count}+
              </span>
              <p className="text-[10px] md:text-xs text-muted-foreground font-body mt-0.5">Gêneros</p>
            </div>
          </div>

          {/* Bullets em grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8 md:mb-10 max-w-xl mx-auto text-left">
            {[
              { icon: Music, text: "+10.000 partituras e playbacks — Sax Alto e Tenor" },
              { icon: Smartphone, text: "Plataforma exclusiva — celular, tablet ou PC" },
              { icon: Mic, text: "Busca inteligente por voz integrada" },
              { icon: Video, text: "Vídeos tutoriais dentro da plataforma" },
              { icon: BookOpen, text: "Material de estudo: rotina e tonalidades" },
              { icon: Zap, text: "Acesso imediato — comece em 2 minutos" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 glass-card rounded-lg px-3 py-2.5">
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[13px] md:text-sm font-medium font-body text-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={scrollToOffers}
            className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
          >
            QUERO COMEÇAR A TOCAR AGORA
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </button>

          <p className="text-xs text-muted-foreground mt-3 md:mt-4 font-body">
            A partir de <strong className="text-primary">R$ 19,90</strong> — pagamento único • Junte-se a +847 saxofonistas
          </p>
        </div>
      </section>

      {/* CARROSSEL DE PARTITURAS */}
      <PartituraCarousel />

      {/* PLAYBACKS DE AMOSTRA */}
      <PlaybackSamples />

      {/* O QUE VOCÊ RECEBE */}
      <section className="py-12 md:py-16 px-4 md:px-8 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3 border border-primary/20">
              🏆 PLATAFORMA COMPLETA PARA SAX ALTO E SAX TENOR
            </span>
            <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
              Tudo Que Você Precisa Para Tocar Sax — Num Só Lugar
            </h2>
            <p className="text-foreground font-body text-base md:text-lg">
              O maior acervo do Brasil, com tecnologia de ponta e material exclusivo
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-surface/80 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Metric badge */}
                <span className="absolute top-3 right-3 text-[10px] font-bold font-heading text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                  {f.metric}
                </span>
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <f.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="font-bold font-heading text-[13px] md:text-base mb-0.5 md:mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm font-body leading-snug">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMULAÇÃO DO APP */}
      <AppSimulation />

      {/* PROVA SOCIAL */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[hsl(220,25%,6%)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-block glass-card text-foreground/80 px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
              ⭐ RECOMENDADO POR ESCOLAS E PROFESSORES DE SAXOFONE
            </span>
            <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
              Saxofonistas Reais, Resultados Reais
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm font-body">
              Avaliação <strong className="text-foreground">4.9/5</strong> • +847 saxofonistas satisfeitos em todo o Brasil
            </p>
          </div>

          {/* Authority badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              { icon: GraduationCap, text: "Escolas de Música" },
              { icon: Award, text: "Professores Certificados" },
              { icon: TrendingUp, text: "Nota 4.9 ⭐" },
              { icon: Users, text: "+847 Alunos Ativos" },
            ].map((badge, i) => (
              <div key={i} className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                <badge.icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] md:text-xs font-semibold font-body text-foreground/80">{badge.text}</span>
              </div>
            ))}
          </div>

          <div className="mb-10 md:mb-12">
            <h3 className="text-base md:text-lg font-bold text-center mb-5 md:mb-6 font-heading flex items-center justify-center gap-2">
              🎥 Depoimentos em Vídeo
            </h3>
            <VideoTestimonialCarousel />
          </div>

          <div>
            <h3 className="text-xs md:text-sm font-semibold text-center mb-3 md:mb-4 font-heading text-muted-foreground uppercase tracking-wide">
              Mais depoimentos
            </h3>
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* CATÁLOGO COMPACTO */}
      <SongCatalog />

      {/* PRICING */}
      <PricingCards />

      {/* BONUS */}
      <BonusSection />

      {/* GARANTIA */}
      <section className="py-12 md:py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(142_70%_45%/0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="glow-border rounded-2xl p-8 md:p-12">
            <img
              src="/selo-garantia.png"
              alt="Selo de Garantia de 7 Dias"
              className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 md:mb-5 drop-shadow-lg"
              loading="lazy"
              width={144}
              height={144}
            />
            <h2 className="text-[22px] md:text-2xl font-bold font-heading mb-2 md:mb-3">
              7 Dias de Garantia Total
            </h2>
            <p className="text-foreground/80 font-body text-[15px] md:text-base leading-relaxed">
              Se em 7 dias você não sentir que valeu cada centavo, a gente devolve <strong className="text-foreground">100% do seu dinheiro</strong>. Sem perguntas. Sem complicação. O risco é todo nosso.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL */}
      <section className="py-12 md:py-16 px-4 md:px-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(38_85%_50%/0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2 md:mb-3">
            Neste exato momento, alguém está abrindo a plataforma e tocando a música que ama.
          </h2>
          <p className="text-lg md:text-xl font-bold font-heading text-primary mb-3">
            E você?
          </p>
          <p className="text-foreground/70 font-body text-[15px] md:text-base mb-3 md:mb-4">
            +10.000 partituras e playbacks para Sax Alto e Sax Tenor. Plataforma exclusiva. Busca por voz. Tutoriais. Material de estudo. Acesso vitalício. Garantia de 7 dias. A partir de R$ 19,90.
          </p>

          {/* Social proof counter */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-live-dot" />
            <span className="text-xs font-semibold font-body text-foreground/80">
              17 saxofonistas garantiram acesso hoje
            </span>
          </div>

          <div className="block">
            <button
              onClick={scrollToOffers}
              className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
            >
              SIM! QUERO MEU ACESSO AGORA
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-body flex items-center justify-center gap-1.5 flex-wrap">
            <Lock className="w-3.5 h-3.5" />
            Pagamento seguro via Cakto • Garantia de 7 dias • Recomendado por escolas de saxofone
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 md:py-8 px-4 border-t border-border text-center">
        <img src={logoSaxplay} alt="SaxPlay" className="h-8 mx-auto mb-3 md:mb-4" />

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-body">Site Seguro</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-xs font-body">Pagamento via Cakto</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-body">Dados Protegidos com SSL</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-body mb-2 max-w-md mx-auto leading-relaxed">
          Produto digital com entrega imediata. Após a confirmação do pagamento, você recebe o acesso por e-mail. Confira sua caixa de entrada e a pasta de spam.
        </p>

        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} SaxPlay. Todos os direitos reservados.
        </p>
      </footer>

      {/* STICKY CTA MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-surface/95 backdrop-blur-md border-t border-border p-2.5 z-50 shadow-lg safe-bottom">
        <button
          onClick={scrollToOffers}
          className="w-full gradient-cta text-white font-bold font-heading py-3.5 rounded-xl text-sm shadow-cta flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          QUERO COMEÇAR A TOCAR — R$ 19,90
          <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
        </button>
      </div>

      <div className="h-14 md:hidden" />
      <WhatsAppButton />
    </div>
  );
};

export default SalesPage;
