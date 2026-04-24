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

import PartituraCarousel from "./PartituraCarousel";
import PlaybackSamples from "./PlaybackSamples";
import AppSimulation from "./AppSimulation";

const features = [
  { icon: Headphones, title: "+10.000 Partituras com Playback", description: "Cada partitura vem com o playback profissional para você tocar junto — Sax Alto e Sax Tenor", metric: "10K+" },
  { icon: Smartphone, title: "Plataforma Estilo App", description: "Acesse pelo celular, tablet ou PC — sua biblioteca completa sempre no bolso", metric: "24/7" },
  { icon: Search, title: "Encontre em 2 Segundos", description: "Digite o nome da música e a partitura + playback aparecem na hora. Sem perder tempo", metric: "< 2s" },
  { icon: Mic, title: "Busca por Voz", description: "Fale o nome da música no microfone e a plataforma encontra pra você automaticamente", metric: "🎤" },
  { icon: Video, title: "Vídeos Tutoriais", description: "Aprenda a usar cada recurso com tutoriais em vídeo integrados na plataforma", metric: "HD" },
  { icon: BookOpen, title: "Material de Estudo", description: "Rotina de estudo, mapa de tonalidades e guias exclusivos para evoluir mais rápido", metric: "3 guias" },
  { icon: FolderOpen, title: "+18 Gêneros Musicais", description: "Pop, MPB, Rock, Gospel, Jazz, Bossa Nova, Natal, Casamento… tudo organizado por pasta", metric: "18+" },
  { icon: Infinity, title: "Acesso Vitalício", description: "Pague uma vez. Acesse para sempre. Todas as atualizações futuras incluídas", metric: "∞" },
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER */}
      <header className="py-4 px-6 md:px-12 border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-50 transition-elite">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src={logoSaxplay} alt="SaxPlay — Acervo de Partituras e Playbacks Para Saxofone" className="h-7 md:h-9 w-auto hover:opacity-80 transition-opacity" />
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-primary font-bold tracking-wider uppercase bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 animate-glow-pulse">
              <Award className="w-3.5 h-3.5" />
              +10.000 Partituras
            </span>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none mb-1">A partir de</span>
              <span className="text-xl md:text-2xl font-black text-primary leading-none tracking-tight">R$ 9,90</span>
            </div>
          </div>
        </div>
      </header>

      {/* AUTHORITY BAR */}
      <div className="bg-surface/30 border-b border-white/5 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-6 md:gap-12 flex-wrap">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[11px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide">+10.000 partituras</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[11px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide">+847 saxofonistas</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Infinity className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[11px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide">Acesso vitalício</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="py-16 md:py-28 px-6 md:px-12 relative overflow-hidden">
        {/* Advanced radial glow */}
        <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Elite Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 shadow-elite animate-fade-in-up">
            <Headphones className="w-4 h-4 text-primary" />
            <span className="text-[11px] md:text-xs text-muted-foreground font-medium tracking-wide uppercase">
              Plataforma exclusiva para <strong className="text-foreground font-bold underline decoration-primary/40 underline-offset-4">Sax Alto e Sax Tenor</strong>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black font-heading leading-[1.05] mb-6 md:mb-8 tracking-tighter animate-fade-in-up [animation-delay:100ms]">
            O Maior Acervo de Partituras <br className="hidden md:block" />
            <span className="text-primary italic">com Playback do Brasil</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto animate-fade-in-up [animation-delay:200ms]">
            Acesse instantaneamente mais de <strong className="text-foreground">10.000 partituras profissionais</strong> com playbacks de alta fidelidade para <strong className="text-foreground">Sax Alto e Sax Tenor</strong>.
          </p>

          <div className="animate-fade-in-up [animation-delay:300ms] mb-12 shadow-elite rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 p-1 md:p-2 bg-white/5">
            <SalesVideoPlayer />
          </div>

          <div className="max-w-3xl mx-auto animate-fade-in-up [animation-delay:400ms]">
            <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 leading-relaxed">
              Desenvolvemos uma experiência <strong className="text-primary">estilo Netflix</strong> para seus estudos. Encontre qualquer música em segundos, ouça o playback e comece a tocar imediatamente.
            </p>

            {/* Animated counters - Refined */}
            <div ref={counter1.ref} className="grid grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-14">
              <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 text-center shadow-elite border-white/10">
                <span className="text-2xl md:text-5xl font-black font-heading text-primary tabular-nums block mb-1">
                  {counter1.count.toLocaleString("pt-BR")}+
                </span>
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Partituras</p>
              </div>
              <div ref={counter2.ref} className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 text-center shadow-elite border-white/10">
                <span className="text-2xl md:text-5xl font-black font-heading text-primary tabular-nums block mb-1">
                  {counter2.count}+
                </span>
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Saxofonistas</p>
              </div>
              <div ref={counter3.ref} className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 text-center shadow-elite border-white/10">
                <span className="text-2xl md:text-5xl font-black font-heading text-primary tabular-nums block mb-1">
                  {counter3.count}+
                </span>
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Gêneros</p>
              </div>
            </div>

          {/* Bullets em grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8 md:mb-10 max-w-xl mx-auto text-left">
            {[
              { icon: Headphones, text: "+10.000 partituras com playback — toque junto" },
              { icon: Smartphone, text: "Plataforma estilo app — celular, tablet ou PC" },
              { icon: Mic, text: "Busca por voz — fale e encontre na hora" },
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
            A partir de <strong className="text-primary">R$ 9,90</strong> — pagamento único • Garantia de 7 dias
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
              Veja TUDO Que Você Recebe ao Garantir Seu Acesso
            </h2>
            <p className="text-foreground font-body text-base md:text-lg">
              +10.000 partituras com playback, organizadas por gênero, numa plataforma exclusiva
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
                <p className="text-muted-foreground text-sm md:text-base font-body leading-snug">{f.description}</p>
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
            <span className="inline-block glass-card text-foreground px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
              ⭐ O QUE NOSSOS CLIENTES DIZEM
            </span>
            <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
              Veja o Que Dizem os Saxofonistas Que Já Usam
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-body">
              Depoimentos reais de clientes do SaxPlay
            </p>
          </div>

          {/* Authority badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              { icon: Headphones, text: "+10.000 Partituras" },
              { icon: FolderOpen, text: "+18 Gêneros Musicais" },
              { icon: Users, text: "+847 Clientes" },
            ].map((badge, i) => (
              <div key={i} className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                <badge.icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] md:text-xs font-semibold font-body text-foreground">{badge.text}</span>
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
            <p className="text-foreground font-body text-base md:text-lg leading-relaxed">
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
          <p className="text-foreground font-body text-base md:text-lg mb-3 md:mb-4">
            Mais de 10.000 partituras com playback profissional, organizadas por gênero, numa plataforma que funciona como app. Para Sax Alto e Sax Tenor. Acesso vitalício. Garantia de 7 dias. A partir de R$ 9,90.
          </p>

          <div className="block">
            <button
              onClick={scrollToOffers}
              className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
            >
              QUERO MEU ACESSO AGORA
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-body flex items-center justify-center gap-1.5 flex-wrap">
            <Lock className="w-3.5 h-3.5" />
            Pagamento seguro via Cakto • Garantia de 7 dias
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
          GARANTIR MEU ACESSO — A PARTIR DE R$9,90
          <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
        </button>
      </div>

      <div className="h-14 md:hidden" />
    </div>
  );
};

export default SalesPage;
