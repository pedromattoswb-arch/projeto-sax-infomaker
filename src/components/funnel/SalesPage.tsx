import { useEffect } from "react";
import {
  Music,
  Headphones,
  Monitor,
  FolderOpen,
  Infinity,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  Play,
} from "lucide-react";
import { trackLandingView } from "@/hooks/useMetaPixel";

import logo from "@/assets/logo-clube-sax.webp";
import mockupAcervo from "@/assets/mockup-acervo.png";

import TestimonialCarousel from "./TestimonialCarousel";
import PricingCards from "./PricingCards";
import BonusSection from "./BonusSection";
import FAQ from "./FAQ";

const categories = [
  "Pop",
  "Flashback",
  "MPB",
  "Rock",
  "Gospel",
  "Jazz",
  "Blues",
  "Samba",
];

const features = [
  {
    icon: Music,
    title: "+2.000 Partituras",
    description: "Organizadas por gênero e nível de dificuldade",
  },
  {
    icon: Headphones,
    title: "Playbacks Profissionais",
    description: "Áudio de qualidade sincronizado com a partitura",
  },
  {
    icon: Monitor,
    title: "Formato Interativo",
    description: "Partitura e áudio rodando juntos na tela",
  },
  {
    icon: FolderOpen,
    title: "8 Categorias",
    description: "Pop, MPB, Rock, Gospel, Jazz, Blues, Samba e mais",
  },
  {
    icon: Infinity,
    title: "Acesso Vitalício",
    description: "Pague uma vez, acesse para sempre",
  },
  {
    icon: RefreshCw,
    title: "Atualizações Mensais",
    description: "Novas músicas adicionadas todo mês",
  },
];

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

const SalesPage = () => {
  useEffect(() => {
    trackLandingView();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HEADER ========== */}
      <header className="py-4 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img
            src={logo}
            alt="Clube do Sax Brasil"
            className="h-10 md:h-12 w-auto"
          />
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-body block">
              A partir de
            </span>
            <span className="text-lg font-extrabold text-primary font-heading">
              R$ 9,90
            </span>
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-4">
              🎷 Acervo Digital para Saxofonistas
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading leading-tight mb-4">
              O Maior Acervo de{" "}
              <span className="text-primary">Partituras para Sax</span> do
              Brasil
            </h1>
            <p className="text-base md:text-lg text-foreground font-body mb-6 leading-relaxed">
              Mais de <strong>2.000 partituras</strong> com playbacks
              profissionais para Sax Alto e Tenor. Gospel, MPB, Pop, Rock, Jazz
              e muito mais. Acesso vitalício a partir de{" "}
              <strong className="text-primary">R$ 9,90</strong>.
            </p>

            <div className="space-y-2 mb-8">
              {[
                "Partituras em PDF de alta qualidade",
                "Playbacks profissionais sincronizados",
                "Acesso imediato após a compra",
                "Garantia de 7 dias — risco zero",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium font-body text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={scrollToOffers}
              className="gradient-cta text-primary-foreground font-bold font-heading py-4 px-8 rounded-xl text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.02] transition-all duration-300 animate-cta-pulse flex items-center gap-2"
            >
              GARANTIR MEU ACESSO
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </button>
          </div>

          {/* Mockup */}
          <div className="order-1 md:order-2 flex justify-center">
            <img
              src={mockupAcervo}
              alt="Mockup do acervo de partituras para saxofone"
              className="w-full max-w-md rounded-2xl shadow-2xl border border-border/50"
            />
          </div>
        </div>
      </section>

      {/* ========== O QUE VOCÊ RECEBE ========== */}
      <section className="py-16 px-4 md:px-8 section-alt">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center font-heading mb-2">
            O Que Você Recebe
          </h2>
          <p className="text-center text-foreground font-body text-base mb-10">
            Tudo o que você precisa para evoluir no sax, num só lugar
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold font-heading text-base mb-1">
                  {f.title}
                </h3>
                <p className="text-foreground text-sm font-body">
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-10 text-center">
            <h3 className="text-sm font-bold text-foreground font-heading mb-4 uppercase tracking-wide">
              Categorias disponíveis
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="bg-card border border-border px-4 py-2 rounded-full text-sm font-semibold font-body shadow-sm text-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROVA SOCIAL (DARK SECTION) ========== */}
      <section className="py-16 px-4 md:px-8" style={{ background: 'hsl(240 20% 12%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2 text-white">
              O Que Dizem os Saxofonistas
            </h2>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-accent text-accent"
                />
              ))}
            </div>
            <p className="text-white/70 text-sm font-body">
              Avaliação <strong className="text-white">4.9/5</strong> • +847 saxofonistas satisfeitos
            </p>
          </div>

          <TestimonialCarousel />

          {/* Video testimonials integrated */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-center mb-6 font-heading text-white">
              🎥 Depoimentos em Vídeo
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2"
                  style={{ background: 'hsl(240 20% 16%)' }}
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white/60 ml-0.5" />
                  </div>
                  <span className="text-xs text-white/40 font-body">
                    Em breve
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRICING CARDS ========== */}
      <PricingCards />

      {/* ========== BONUS ========== */}
      <BonusSection />

      {/* ========== GARANTIA (DARK GREEN) ========== */}
      <section className="py-16 px-4 md:px-8 gradient-cta">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-3 text-white">
            Garantia Incondicional de 7 Dias
          </h2>
          <p className="text-white/90 font-body text-base leading-relaxed">
            Se por qualquer motivo você não ficar satisfeito, devolvemos{" "}
            <strong className="text-white">100% do seu dinheiro</strong>. Sem perguntas, sem
            burocracia. O risco é todo nosso.
          </p>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <div className="section-alt">
        <FAQ />
      </div>

      {/* ========== CTA FINAL ========== */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">
            Não Deixe Essa Oportunidade Passar
          </h2>
          <p className="text-foreground font-body text-base mb-8">
            Mais de 2.000 partituras com playbacks profissionais. Acesso
            vitalício a partir de R$ 9,90. Garantia de 7 dias.
          </p>
          <button
            onClick={scrollToOffers}
            className="gradient-cta text-primary-foreground font-bold font-heading py-4 px-10 rounded-xl text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.02] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
          >
            GARANTIR MEU ACESSO AGORA
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-6 px-4 border-t border-border text-center">
        <img
          src={logo}
          alt="Clube do Sax Brasil"
          className="h-8 w-auto mx-auto mb-3"
        />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax Brasil. Todos os direitos
          reservados.
        </p>
      </footer>

      {/* ========== STICKY CTA MOBILE ========== */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border p-3 z-50 shadow-lg">
        <button
          onClick={scrollToOffers}
          className="w-full gradient-cta text-primary-foreground font-bold font-heading py-3.5 rounded-xl text-sm shadow-cta flex items-center justify-center gap-2"
        >
          GARANTIR ACESSO — A partir de R$ 9,90
          <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
        </button>
      </div>

      {/* Bottom spacer for sticky CTA on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default SalesPage;
