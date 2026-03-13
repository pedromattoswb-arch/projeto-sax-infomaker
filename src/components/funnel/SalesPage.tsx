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
} from "lucide-react";

import logoSaxplay from "@/assets/logo-saxplay.png";
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
  { icon: Smartphone, title: "Plataforma Exclusiva", description: "Sua própria plataforma estilo app — acesse de qualquer dispositivo", gradient: "from-violet-500 to-purple-700" },
  { icon: Music, title: "+10.000 Arquivos", description: "Partituras em PDF + playbacks profissionais sincronizados", gradient: "from-amber-500 to-amber-700" },
  { icon: Search, title: "Busca Inteligente", description: "Encontre qualquer música em segundos — por nome, gênero ou artista", gradient: "from-blue-500 to-indigo-600" },
  { icon: Mic, title: "Busca por Voz", description: "Fale o nome da música e a plataforma encontra pra você", gradient: "from-teal-500 to-cyan-600" },
  { icon: Video, title: "Vídeos Tutoriais", description: "Aprenda a usar cada recurso com tutoriais integrados na plataforma", gradient: "from-rose-500 to-pink-600" },
  { icon: BookOpen, title: "Material de Estudo", description: "Rotina de estudo, mapa de tonalidades e guias exclusivos", gradient: "from-emerald-500 to-green-700" },
  { icon: FolderOpen, title: "+18 Gêneros Musicais", description: "Pop, MPB, Rock, Gospel, Jazz, Bossa Nova, Natal, Casamento…", gradient: "from-purple-500 to-violet-600" },
  { icon: Infinity, title: "Acesso Vitalício", description: "Pague uma vez. Acesse para sempre. Atualizações incluídas", gradient: "from-orange-500 to-red-600" },
];

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

const SalesPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src={logoSaxplay} alt="SaxPlay — O Maior Acervo de Partituras Para Sax do Brasil" className="h-8 md:h-10 w-auto" />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-primary font-bold font-heading bg-primary/10 px-2.5 py-1 rounded-full">
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

      {/* HERO */}
      <section className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <SalesVideoPlayer />

          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-4 md:mb-5">
            🎷 +847 Saxofonistas Já Estão Tocando • Recomendado por Escolas de Sax
          </span>

          <h1 className="text-[26px] md:text-4xl lg:text-5xl font-extrabold font-heading leading-[1.2] mb-5 md:mb-6">
            A SaxPlay é a{" "}
            <span className="text-primary">sua plataforma personalizada</span>{" "}
            para tocar saxofone
          </h1>

          <p className="text-[15px] md:text-lg text-foreground font-body mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
            Escolha a melhor opção e comece a tocar as suas melhores músicas.{" "}
            <strong>+10.000 partituras e playbacks, busca por voz, tutoriais e material de estudo</strong> — tudo na sua própria plataforma.
          </p>

          {/* Bullets em grid profissional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8 md:mb-10 max-w-xl mx-auto text-left">
            {[
              { icon: Music, text: "+10.000 partituras e playbacks profissionais" },
              { icon: Smartphone, text: "Plataforma exclusiva — celular, tablet ou PC" },
              { icon: Mic, text: "Busca inteligente por voz integrada" },
              { icon: Video, text: "Vídeos tutoriais dentro da plataforma" },
              { icon: BookOpen, text: "Material de estudo: rotina e tonalidades" },
              { icon: Zap, text: "Acesso imediato — comece em 2 minutos" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-card/60 rounded-lg px-3 py-2.5 border border-border/50">
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[13px] md:text-sm font-medium font-body text-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={scrollToOffers}
            className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
          >
            ESCOLHER MEU PLANO AGORA
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </button>

          <p className="text-xs text-muted-foreground mt-3 md:mt-4 font-body">
            A partir de <strong className="text-primary">R$ 19,90</strong> — pagamento único, acesso vitalício
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
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
              🏆 PLATAFORMA COMPLETA PARA SAXOFONISTAS
            </span>
            <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
              Tudo Que Você Precisa Para Tocar Sax — Num Só Lugar
            </h2>
            <p className="text-foreground font-body text-[15px] md:text-base">
              O maior acervo do Brasil, com tecnologia de ponta e material exclusivo
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3 md:mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
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
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[hsl(220,30%,12%)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-block bg-white/10 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
              ⭐ RECOMENDADO POR ESCOLAS E PROFESSORES DE SAXOFONE
            </span>
            <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2 text-white">
              Saxofonistas Reais, Resultados Reais
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-white/60 text-sm font-body">
              Avaliação <strong className="text-white">4.9/5</strong> • +847 saxofonistas satisfeitos em todo o Brasil
            </p>
          </div>

          <div className="mb-10 md:mb-12">
            <h3 className="text-base md:text-lg font-bold text-center mb-5 md:mb-6 font-heading text-white flex items-center justify-center gap-2">
              🎥 Depoimentos em Vídeo
            </h3>
            <VideoTestimonialCarousel />
          </div>

          <div>
            <h3 className="text-xs md:text-sm font-semibold text-center mb-3 md:mb-4 font-heading text-white/50 uppercase tracking-wide">
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
      <section className="py-12 md:py-16 px-4 md:px-8 gradient-cta">
        <div className="max-w-2xl mx-auto text-center">
          <img
            src="/selo-garantia.png"
            alt="Selo de Garantia de 7 Dias"
            className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 md:mb-5 drop-shadow-lg"
            loading="lazy"
            width={144}
            height={144}
          />
          <h2 className="text-[22px] md:text-2xl font-bold font-heading mb-2 md:mb-3 text-white">
            7 Dias de Garantia Total
          </h2>
          <p className="text-white/90 font-body text-[15px] md:text-base leading-relaxed">
            Teste a plataforma durante 7 dias com total tranquilidade.
            Se não for exatamente o que você esperava, <strong className="text-white">a gente resolve — sem complicação</strong>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <div className="section-alt">
        <FAQ />
      </div>

      {/* CTA FINAL */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2 md:mb-3">
            Enquanto Você Pensa, Outros Já Estão Tocando
          </h2>
          <p className="text-foreground font-body text-[15px] md:text-base mb-3 md:mb-4">
            +10.000 partituras e playbacks. Plataforma exclusiva. Busca por voz. Tutoriais. Material de estudo. Acesso vitalício. Garantia de 7 dias. A partir de R$ 19,90.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground font-body mb-6 md:mb-8">
            ⚠️ Preço promocional — pode acabar a qualquer momento.
          </p>
          <button
            onClick={scrollToOffers}
            className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
          >
            GARANTIR MEU ACESSO AGORA
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </button>
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
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card/95 backdrop-blur-md border-t border-border p-2.5 z-50 shadow-lg safe-bottom">
        <button
          onClick={scrollToOffers}
          className="w-full gradient-cta text-white font-bold font-heading py-3.5 rounded-xl text-sm shadow-cta flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          ESCOLHER MEU PLANO — A partir de R$ 19,90
          <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
        </button>
      </div>

      <div className="h-14 md:hidden" />
      <WhatsAppButton />
    </div>
  );
};

export default SalesPage;
