import { ArrowRight, Gauge, Timer, Music, Zap, Check, X, Shield, Star, Smartphone, Lock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import kitBanner from "@/assets/kit-ferramentas-banner.png";

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
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.pathname);
    };
    
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNoThanks = () => {
    window.location.href = "/downsell-toolkit";
  };

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

      {/* Visual Demo Section */}
      <section className="py-10 px-4 md:px-8 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Visual Column */}
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-3xl opacity-50" />
              <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
                <img 
                  src={kitBanner} 
                  alt="Demonstração do Kit" 
                  className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Acesso Exclusivo
                  </div>
                </div>
              </div>

              {/* Tool Mini Cards */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Pitch", icon: Gauge, desc: "Afinador Real" },
                  { label: "Tempo", icon: Timer, desc: "Digital Pro" },
                  { label: "Study", icon: Music, desc: "Escalas/Arpejos" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-card border border-border/50 p-3 rounded-xl text-center shadow-sm">
                    <item.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-[10px] font-black uppercase">{item.label}</div>
                    <div className="text-[8px] text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-black font-heading leading-tight">
                O que você vai levar no <span className="text-primary underline decoration-primary/20">Kit de Elite</span>
              </h2>
              <div className="space-y-4">
                {features.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group">
                      <div className={`w-10 h-10 rounded-xl ${feat.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${feat.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-0.5">{feat.title}</h3>
                        <p className="text-sm text-muted-foreground leading-snug">{feat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
              href="https://pay.wiapy.com/ymgWWLcrw9"
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
            onClick={handleNoThanks}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body underline underline-offset-4"
          >
            Não, obrigado. Prefiro seguir sem as ferramentas.
          </button>
        </div>
      </section>

      {/* Exit Intent Modal / Promotion */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-primary/30 animate-scale-in">
            <div className="bg-primary p-6 text-white text-center relative">
              <Sparkles className="w-12 h-12 absolute -top-4 -left-4 rotate-12 opacity-20" />
              <h3 className="text-2xl font-black font-heading mb-1 uppercase tracking-tight">ESPERE! NÃO VÁ AINDA! 🛑</h3>
              <p className="text-white/80 text-sm font-medium">Liberei uma condição especial para você.</p>
            </div>
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-6 font-medium">
                Você realmente vai deixar passar a chance de tocar afinado e no tempo por menos do que um lanche?
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8">
                <p className="text-xs font-bold text-primary uppercase mb-2">Acesso Promocional</p>
                <div className="text-4xl font-black font-heading text-primary">R$ 14,50</div>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold tracking-wider">(Afinador + Metrônomo Vitalício)</p>
              </div>
              <div className="space-y-4">
                <a
                  href="https://pay.wiapy.com/SSjOIsHzZ"
                  className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-lg shadow-cta hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  SIM! QUERO O DESCONTO <Zap className="w-5 h-5 fill-white" />
                </a>
                <button 
                  onClick={() => window.location.href = "/acervo-basico"} 
                  className="text-xs text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest"
                >
                  Não, quero abrir mão das ferramentas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
