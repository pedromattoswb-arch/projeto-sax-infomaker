import { useEffect } from "react";
import {
  Music,
  Headphones,
  Monitor,
  FolderOpen,
  Infinity,
  RefreshCw,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { trackLandingView } from "@/hooks/useMetaPixel";

import logo from "@/assets/logo-clube-sax.webp";
import mockupAcervo from "@/assets/mockup-acervo.png";

import VideoTestimonialCarousel from "./VideoTestimonialCarousel";
import TestimonialCarousel from "./TestimonialCarousel";
import PricingCards from "./PricingCards";
import BonusSection from "./BonusSection";
import FAQ from "./FAQ";

const categories = [
  { name: "Pop", emoji: "🎤" },
  { name: "Flashback", emoji: "📻" },
  { name: "MPB", emoji: "🇧🇷" },
  { name: "Rock", emoji: "🎸" },
  { name: "Gospel", emoji: "🙏" },
  { name: "Jazz", emoji: "🎷" },
  { name: "Blues", emoji: "🎵" },
  { name: "Samba", emoji: "🥁" },
];

const features = [
  {
    icon: Music,
    title: "+2.000 Partituras",
    description: "Organizadas por gênero e nível",
    gradient: "from-emerald-500 to-green-700",
  },
  {
    icon: Headphones,
    title: "Playbacks Profissionais",
    description: "Áudio sincronizado com a partitura",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Monitor,
    title: "Formato Interativo",
    description: "Partitura e áudio juntos na tela",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: FolderOpen,
    title: "8 Categorias",
    description: "Pop, MPB, Rock, Gospel, Jazz e mais",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Infinity,
    title: "Acesso Vitalício",
    description: "Pague uma vez, acesse para sempre",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: RefreshCw,
    title: "Atualizações Mensais",
    description: "Novas músicas todo mês",
    gradient: "from-teal-500 to-cyan-600",
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
          <img src={logo} alt="Clube do Sax Brasil" className="h-10 md:h-12 w-auto" />
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-body block">A partir de</span>
            <span className="text-lg font-extrabold text-primary font-heading">R$ 9,90</span>
          </div>
        </div>
      </header>

      {/* ========== HERO — CENTRALIZADO ========== */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src={mockupAcervo}
            alt="Mockup do acervo de partituras para saxofone"
            className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl border border-border/50 mb-8"
          />

          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-5">
            🎷 +847 Saxofonistas Já Garantiram
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading leading-tight mb-5">
            Chega de Perder Horas Procurando{" "}
            <span className="text-primary">Partituras Ruins</span> na Internet
          </h1>

          <p className="text-base md:text-lg text-foreground font-body mb-6 leading-relaxed max-w-2xl mx-auto">
            Tenha agora o maior acervo de partituras para sax do Brasil —{" "}
            <strong>organizado, profissional e pronto para tocar.</strong>{" "}
            Enquanto você busca, outros saxofonistas já estão tocando.
          </p>

          <div className="flex flex-col items-center gap-2.5 mb-8">
            {[
              "Partituras em PDF de alta qualidade",
              "Playbacks profissionais sincronizados",
              "Acesso imediato — comece a tocar em minutos",
              "Garantia de 7 dias — risco zero pra você",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium font-body text-foreground">{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={scrollToOffers}
            className="gradient-cta text-primary-foreground font-bold font-heading py-4 px-10 rounded-xl text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.02] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
          >
            GARANTIR MEU ACESSO AGORA
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </button>

          <p className="text-xs text-muted-foreground mt-4 font-body">
            A partir de <strong className="text-primary">R$ 9,90</strong> — menos que um café ☕
          </p>
        </div>
      </section>

      {/* ========== O QUE VOCÊ RECEBE ========== */}
      <section className="py-16 px-4 md:px-8 section-alt">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center font-heading mb-2">
            Tudo Que Você Precisa Para Evoluir no Sax
          </h2>
          <p className="text-center text-foreground font-body text-base mb-10">
            Pare de improvisar sua evolução. Tenha as ferramentas certas.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold font-heading text-base mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm font-body">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-12 text-center">
            <h3 className="text-sm font-bold text-foreground font-heading mb-5 uppercase tracking-wide">
              🎵 Categorias Disponíveis
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <span
                  key={cat.name}
                  className="bg-card border border-border px-5 py-2.5 rounded-full text-sm font-semibold font-body shadow-sm text-foreground hover:shadow-md hover:border-primary/30 transition-all cursor-default flex items-center gap-2"
                >
                  <span className="text-lg">{cat.emoji}</span>
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROVA SOCIAL (DARK) ========== */}
      <section className="py-16 px-4 md:px-8" style={{ background: "hsl(240 20% 10%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2 text-white">
              Veja o Que Dizem os Saxofonistas
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-white/60 text-sm font-body">
              Avaliação <strong className="text-white">4.9/5</strong> • +847 saxofonistas satisfeitos
            </p>
          </div>

          {/* VIDEO TESTIMONIALS — DESTAQUE PRINCIPAL */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-center mb-6 font-heading text-white flex items-center justify-center gap-2">
              🎥 Depoimentos em Vídeo
            </h3>
            <VideoTestimonialCarousel />
          </div>

          {/* PRINT TESTIMONIALS — COMPLEMENTO */}
          <div>
            <h3 className="text-sm font-semibold text-center mb-4 font-heading text-white/50 uppercase tracking-wide">
              Mais depoimentos
            </h3>
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* ========== PRICING CARDS ========== */}
      <PricingCards />

      {/* ========== BONUS ========== */}
      <BonusSection />

      {/* ========== GARANTIA COM SELO ========== */}
      <section className="py-16 px-4 md:px-8 gradient-cta">
        <div className="max-w-2xl mx-auto text-center">
          <img
            src="/selo-garantia.png"
            alt="Selo de Garantia de 7 Dias"
            className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 drop-shadow-lg"
          />
          <h2 className="text-2xl font-bold font-heading mb-3 text-white">
            Garantia Incondicional de 7 Dias
          </h2>
          <p className="text-white/90 font-body text-base leading-relaxed">
            Se por qualquer motivo você não ficar satisfeito, devolvemos{" "}
            <strong className="text-white">100% do seu dinheiro</strong>. Sem perguntas, sem
            burocracia. O risco é todo nosso — você não tem nada a perder.
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
            Você Está a Um Passo de Nunca Mais Perder Tempo
          </h2>
          <p className="text-foreground font-body text-base mb-4">
            +2.000 partituras profissionais com playbacks. Acesso vitalício. Garantia de 7 dias.
          </p>
          <p className="text-sm text-muted-foreground font-body mb-8">
            ⚠️ Esse preço promocional pode mudar a qualquer momento.
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
        <img src={logo} alt="Clube do Sax Brasil" className="h-8 w-auto mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax Brasil. Todos os direitos reservados.
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

      <div className="h-16 md:hidden" />
    </div>
  );
};

export default SalesPage;
