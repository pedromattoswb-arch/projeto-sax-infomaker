import { ArrowRight, Gauge, Timer, Music, Zap, Check, X, Shield, Star } from "lucide-react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";

const features = [
  {
    icon: Gauge,
    title: "Afinador Cromático para Sax",
    description: "Detecta a nota que você toca em tempo real. Mostra cents, frequência em Hz e a nota transposta automaticamente para Sax Alto (Eb) ou Tenor (Bb). Indicador visual de precisão.",
    color: "text-primary",
    bgColor: "bg-primary/15",
    borderColor: "border-primary/20",
  },
  {
    icon: Timer,
    title: "Metrônomo Profissional",
    description: "40 a 220 BPM com scheduling de áudio preciso (zero drift). 4 fórmulas de compasso, tap tempo inteligente e modo progressivo que aumenta a velocidade sozinho.",
    color: "text-[hsl(142,70%,45%)]",
    bgColor: "bg-[hsl(142,70%,45%)]/15",
    borderColor: "border-[hsl(142,70%,45%)]/20",
  },
  {
    icon: Music,
    title: "Gerador de Escalas e Arpejos",
    description: "10 tipos de escala + 5 tipos de arpejo em todas as tonalidades. Toque cada nota individual para ouvir. Tudo já transposto para o seu sax — zero cálculo manual.",
    color: "text-primary",
    bgColor: "bg-primary/15",
    borderColor: "border-primary/20",
  },
];

const comparisons = [
  { without: "Estuda desafinado sem perceber", with: "Sabe exatamente se está no pitch certo" },
  { without: "Não tem noção de tempo real", with: "Pratica com metrônomo preciso desde o dia 1" },
  { without: "Perde horas procurando notas transpostas", with: "Vê todas as notas prontas pro seu sax" },
  { without: "Usa apps genéricos que não entendem sax", with: "Ferramentas feitas 100% para saxofonista" },
];

const UpsellToolkit = () => {
  useNoIndex();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-10 md:h-12 w-auto" />
        </div>
      </header>

      {/* Hero */}
      <section className="py-14 md:py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-8">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-xs font-bold font-heading text-primary uppercase tracking-wider">Oferta Exclusiva — Só Aparece Uma Vez</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-5 leading-tight">
            Você tem as partituras.
            <br />
            Agora falta o que vai fazer você{" "}
            <span className="text-primary">tocar de verdade.</span>
          </h1>

          <p className="text-foreground font-body text-base md:text-lg mb-4 leading-relaxed max-w-xl mx-auto">
            Imagina abrir o celular e ter um <strong>afinador que entende sax</strong>, um <strong>metrônomo que treina sua velocidade</strong> e um <strong>gerador de escalas transpostas</strong> — tudo no mesmo lugar das suas partituras.
          </p>

          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            Sem instalar nada. Sem app separado. Feito exclusivamente para saxofonistas.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 px-4 md:px-8">
        <div className="max-w-2xl mx-auto space-y-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className={`glass-card rounded-2xl p-6 md:p-7 flex gap-5 items-start border ${feat.borderColor} hover:scale-[1.01] transition-all`}>
                <div className={`w-14 h-14 rounded-2xl ${feat.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-7 h-7 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-lg mb-1.5">{feat.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-10 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-bold font-heading text-xl md:text-2xl text-center mb-8">
            A diferença entre quem <span className="text-muted-foreground">tenta</span> e quem <span className="text-primary">evolui</span>
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden border border-border">
            <div className="grid grid-cols-2 bg-card border-b border-border">
              <div className="px-4 py-3 text-center">
                <span className="text-xs font-bold font-heading text-red-400 uppercase">❌ Sem Kit</span>
              </div>
              <div className="px-4 py-3 text-center">
                <span className="text-xs font-bold font-heading text-[hsl(142,70%,45%)] uppercase">✅ Com Kit</span>
              </div>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-border last:border-0">
                <div className="px-4 py-3.5 text-sm font-body text-muted-foreground border-r border-border">
                  {c.without}
                </div>
                <div className="px-4 py-3.5 text-sm font-body text-foreground font-medium">
                  {c.with}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-md mx-auto flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[hsl(142,70%,45%)]" />
            <span className="text-xs font-bold font-heading text-muted-foreground">Acesso Vitalício</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-xs font-bold font-heading text-muted-foreground">100% Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-[hsl(142,70%,45%)]" />
            <span className="text-xs font-bold font-heading text-muted-foreground">Feito para Sax</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 md:px-8">
        <div className="max-w-md mx-auto text-center space-y-5">
          <div className="glass-card rounded-2xl p-8 border-2 border-primary/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[hsl(142,70%,45%)] to-primary" />
            <p className="text-xs text-muted-foreground font-heading uppercase tracking-widest mb-2">Kit Ferramentas do Saxofonista</p>
            <div className="text-5xl font-extrabold font-heading text-primary mb-1">
              R$ 27,90
            </div>
            <p className="text-xs text-muted-foreground font-body mb-6">Pagamento único · Acesso vitalício · 3 ferramentas</p>

            <a
              href="#"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-base md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 w-full justify-center"
            >
              QUERO O KIT COMPLETO
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>

            <div className="flex items-center justify-center gap-4 mt-4">
              {["Afinador", "Metrônomo", "Escalas"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-[hsl(142,70%,45%)]" /> {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => window.location.href = "/cx/d5w2n8"}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <X className="w-4 h-4" />
            Não, obrigado. Seguir sem o Kit.
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border text-center">
        <img src={logoClubeSax} alt="Clube do Sax" className="h-8 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default UpsellToolkit;
