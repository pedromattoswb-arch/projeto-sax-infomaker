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

import logoClubedoSax from "@/assets/logo-clube-sax.png";
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="py-4 px-6 md:px-12 border-b border-white/[0.03] bg-background/40 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoClubedoSax} alt="ClubedoSax" className="h-10 md:h-16 w-auto hover:opacity-80 transition-opacity filter drop-shadow-md" />
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] shadow-inner">
              <div className="w-2 h-2 rounded-full bg-primary animate-live-dot" />
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">+847 Membros Ativos</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-60">A partir de</span>
              <span className="text-xl md:text-2xl font-black text-primary leading-none tracking-tighter drop-shadow-glow">R$ 9,90</span>
            </div>
          </div>
        </div>
      </header>

      {/* AUTHORITY BAR - Refined */}
      <div className="bg-gradient-to-r from-background via-white/[0.02] to-background border-b border-white/[0.03] py-4 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-20" />
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-8 md:gap-16 flex-wrap relative z-10">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] md:text-[11px] text-muted-foreground font-black uppercase tracking-[0.15em]">+10.000 partituras</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] md:text-[11px] text-muted-foreground font-black uppercase tracking-[0.15em]">+847 saxofonistas</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
              <Infinity className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] md:text-[11px] text-muted-foreground font-black uppercase tracking-[0.15em]">Acesso vitalício</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION - Deep 3D Space */}
      <section className="py-20 md:py-36 px-6 md:px-12 relative overflow-hidden">
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full mix-blend-screen animate-glow-pulse" />
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Refined Elite Badge */}
          <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-full px-6 py-2.5 mb-10 shadow-elite animate-fade-in-up">
            <div className="relative">
              <Headphones className="w-4 h-4 text-primary relative z-10" />
              <div className="absolute inset-0 bg-primary/50 blur-md scale-150 rounded-full" />
            </div>
            <span className="text-[10px] md:text-[11px] text-muted-foreground font-black tracking-[0.15em] uppercase">
              Plataforma para <strong className="text-white font-black underline decoration-primary/50 underline-offset-4">Sax Alto e Sax Tenor</strong>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-heading leading-[0.95] mb-8 tracking-tighter animate-fade-in-up [animation-delay:100ms] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">
            O Maior Acervo <br className="hidden md:block" />
            <span className="text-primary italic drop-shadow-glow">com Playback do Brasil</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground font-medium mb-12 md:mb-16 leading-relaxed max-w-3xl mx-auto animate-fade-in-up [animation-delay:200ms]">
            Acesse instantaneamente mais de <strong className="text-white font-black">10.000 partituras profissionais</strong> com playbacks de alta fidelidade desenvolvidos para <strong className="text-white font-black">Saxofonistas</strong>.
          </p>

          <div className="animate-fade-in-up [animation-delay:300ms] mb-16 relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent blur-2xl opacity-50 -z-10" />
            <div className="shadow-3d-premium rounded-2xl md:rounded-[40px] overflow-hidden border border-white/10 p-1.5 md:p-3 bg-white/[0.02] backdrop-blur-sm">
              <SalesVideoPlayer />
            </div>
          </div>

          <div className="max-w-4xl mx-auto animate-fade-in-up [animation-delay:400ms]">
            <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed font-medium">
              Desenvolvemos uma experiência <strong className="text-primary font-black italic underline decoration-primary/30 underline-offset-8">estilo Netflix</strong> para seus estudos. Encontre qualquer música em segundos e comece a tocar imediatamente.
            </p>

            {/* Animated counters - Deep 3D Cards */}
            <div ref={counter1.ref} className="grid grid-cols-3 gap-4 md:gap-10 mb-16 md:mb-24">
              {[
                { count: counter1.count, label: "Partituras", suffix: "+" },
                { count: counter2.count, label: "Saxofonistas", suffix: "+" },
                { count: counter3.count, label: "Gêneros", suffix: "+" },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-[24px] md:rounded-[40px] p-6 md:p-10 text-center shadow-3d-premium border-white/[0.05] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="text-3xl md:text-6xl font-black font-heading text-primary tabular-nums block mb-2 drop-shadow-glow">
                    {item.count.toLocaleString("pt-BR")}{item.suffix}
                  </span>
                  <p className="text-[9px] md:text-[11px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bullets em grid - Refined & Personalized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16 md:mb-24 max-w-3xl mx-auto text-left animate-fade-in-up [animation-delay:500ms]">
            {[
              { icon: Headphones, text: "+10.000 partituras com playback" },
              { icon: Smartphone, text: "Plataforma estilo app (Web App)" },
              { icon: Mic, text: "Busca por voz inteligente" },
              { icon: Video, text: "Vídeos tutoriais integrados" },
              { icon: BookOpen, text: "Material de estudo exclusivo" },
              { icon: Zap, text: "Acesso vitalício e imediato" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 glass-card rounded-[20px] px-6 py-5 hover:border-primary/50 group bg-white/[0.02] border-white/[0.05] shadow-medium">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                </div>
                <span className="text-base md:text-lg font-bold text-white/90 group-hover:text-white transition-colors">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="animate-fade-in-up [animation-delay:600ms]">
            <button
              onClick={scrollToOffers}
              className="gradient-cta text-white font-black uppercase tracking-[0.15em] py-6 px-12 md:px-20 rounded-[24px] text-lg md:text-2xl shadow-cta hover:shadow-cta-lg hover:scale-[1.05] active:scale-[0.95] transition-all duration-500 animate-cta-pulse inline-flex items-center gap-4 group"
            >
              QUERO MEU ACESSO AGORA
              <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-300" />
            </button>

            <div className="flex flex-col items-center gap-4 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-surface flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-black text-white">
                  +847
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-bold tracking-wide flex items-center justify-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Pagamento Único • Acesso Vitalício • 7 dias de garantia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CARROSSEL DE PARTITURAS */}
      <PartituraCarousel />

      {/* PLAYBACKS DE AMOSTRA */}
      <PlaybackSamples />

      {/* O QUE VOCÊ RECEBE - Refined & Personalized */}
      <section className="py-24 md:py-48 px-6 md:px-12 section-alt relative overflow-hidden">
        {/* Deep background effects */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[160px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 md:mb-32">
            <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-primary/20 shadow-glow">
              Ecossistema Premium
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-heading mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
              Tudo o que você precisa em <br className="hidden md:block" />
              <span className="text-primary italic">um único lugar</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Diga adeus às pastas bagunçadas e partituras ilegíveis. O ClubedoSax é a sua estação definitiva de estudos e performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-[32px] p-10 hover:-translate-y-4 transition-all duration-500 group relative overflow-hidden shadow-3d-premium border-white/[0.03] hover:border-primary/20 bg-white/[0.01]"
              >
                {/* Visual depth background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-colors" />
                
                <div className="absolute top-8 right-8 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black font-heading text-primary uppercase tracking-widest">
                    {f.metric}
                  </span>
                </div>
                
                <div className="w-16 h-16 rounded-[24px] bg-primary/10 border border-primary/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-500 shadow-glow">
                  <f.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="font-black font-heading text-xl md:text-2xl mb-4 tracking-tight text-white group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-muted-foreground text-[15px] font-medium leading-relaxed group-hover:text-white/80 transition-colors">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMULAÇÃO DO APP */}
      <AppSimulation />

      {/* PROVA SOCIAL */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background relative overflow-hidden">
        {/* Glow for section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <span className="inline-block glass-card text-foreground px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 border-white/10 shadow-medium">
              Comunidade ClubedoSax
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight">
              O que dizem os <br className="hidden md:block" />
              <span className="text-primary italic">nossos alunos</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto">
              Junte-se a centenas de saxofonistas que transformaram sua forma de estudar e tocar.
            </p>
          </div>

          {/* Authority badges refined */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-20">
            {[
              { icon: Headphones, text: "+10.000 Partituras" },
              { icon: FolderOpen, text: "+18 Gêneros" },
              { icon: Users, text: "+847 Clientes" },
            ].map((badge, i) => (
              <div key={i} className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3 border-white/10 shadow-medium group cursor-default">
                <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <badge.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm md:text-base font-bold uppercase tracking-wider text-foreground/90">{badge.text}</span>
              </div>
            ))}
          </div>

          <div className="mb-24">
            <h3 className="text-xl md:text-2xl font-black text-center mb-10 font-heading flex items-center justify-center gap-3">
              <Video className="w-6 h-6 text-primary" />
              Depoimentos em Vídeo
            </h3>
            <div className="shadow-elite rounded-[32px] overflow-hidden p-2 bg-white/5 border border-white/5">
              <VideoTestimonialCarousel />
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-black text-center mb-10 font-heading text-muted-foreground uppercase tracking-[0.3em]">
              Feedbacks da Comunidade
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
      <section className="py-24 md:py-40 px-6 md:px-12 relative overflow-hidden bg-section-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(142_70%_45%/0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="glow-border rounded-[32px] p-10 md:p-20 shadow-elite">
            <div className="relative inline-block mb-10 md:mb-14">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <img
                src="/selo-garantia.png"
                alt="Selo de Garantia de 7 Dias"
                className="w-32 h-32 md:w-44 md:h-44 relative z-10 drop-shadow-2xl animate-glow-pulse"
                loading="lazy"
                width={176}
                height={176}
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight">
              Sua Satisfação ou <br className="hidden md:block" />
              <span className="text-primary italic">100% do Dinheiro de Volta</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg md:text-xl leading-relaxed mb-0">
              Você tem 7 dias para testar todo o nosso acervo. Se não gostar de qualquer coisa, basta nos enviar um e-mail e devolveremos cada centavo. <strong className="text-foreground">Sem burocracia, sem perguntas.</strong> O risco é todo nosso.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL */}
      <section className="py-24 md:py-40 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(38_85%_50%/0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-heading mb-10 tracking-tighter leading-[1.1]">
            Transforme sua forma de tocar saxofone <br className="hidden md:block" />
            <span className="text-primary italic">ainda hoje.</span>
          </h2>
          
          <p className="text-xl md:text-2xl font-bold font-heading text-primary mb-8 tracking-wide uppercase">
            A decisão está em suas mãos.
          </p>
          
          <p className="text-muted-foreground font-medium text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Mais de 10.000 partituras com playback profissional, organizadas por gênero, numa plataforma estilo Netflix. Acesso vitalício por apenas <strong className="text-foreground">R$ 9,90</strong>.
          </p>

          <div className="flex flex-col items-center gap-8">
            <button
              onClick={scrollToOffers}
              className="gradient-cta text-white font-black uppercase tracking-wider py-5 px-10 md:px-14 rounded-2xl text-base md:text-xl shadow-cta hover:shadow-cta-lg hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-3"
            >
              QUERO MEU ACESSO AGORA
              <ArrowRight className="w-6 h-6 animate-arrow-bounce" />
            </button>
            
            <p className="text-sm text-muted-foreground font-medium tracking-wide flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <Lock className="w-4 h-4 text-primary" />
                <span>Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span>Garantia de 7 Dias</span>
              </div>
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 md:py-8 px-4 border-t border-border text-center">
        <img src={logoClubedoSax} alt="ClubedoSax" className="h-24 mx-auto mb-6 md:mb-8" />

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
          © {new Date().getFullYear()} ClubedoSax. Todos os direitos reservados.
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
