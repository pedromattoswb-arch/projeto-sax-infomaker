import { ArrowRight, Gauge, Timer, X, Check, Shield, Mail, Zap, Smartphone, Sparkles, Music } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import kitBanner from "@/assets/kit-ferramentas-banner.png";

const DownsellToolkit = () => {
  useNoIndex();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  const handleFinalExit = () => {
    // Redireciona para o produto principal baseado na compra
    if (plan === "completo") {
      window.location.href = "/plano-premium-completo";
    } else {
      window.location.href = "/acervo-basico"; 
    }
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
      <section className="py-14 md:py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-5 leading-tight">
            Entendo! Mas pelo menos garanta as{" "}
            <span className="text-[hsl(142,70%,45%)]">2 ferramentas essenciais</span>
          </h1>

          <p className="text-foreground font-body text-base md:text-lg mb-3 leading-relaxed max-w-xl mx-auto">
            Mesmo sem o gerador de escalas, o <strong>Afinador + Metrônomo</strong> já transformam completamente a qualidade do seu estudo.
          </p>

          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            Você vai saber se está afinado e no tempo — as duas coisas que mais separam amadores de músicos sérios.
          </p>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section className="py-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-card/50 rounded-[2.5rem] p-8 border border-border/50">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(142,70%,45%)]/20 to-primary/20 rounded-2xl blur opacity-75" />
              <img 
                src={kitBanner} 
                alt="Kit Essencial" 
                className="relative rounded-xl border border-white/5 shadow-xl w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-500" 
              />
              <div className="absolute top-4 right-4 bg-[hsl(142,70%,45%)] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                OFERTA FINAL
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black font-heading leading-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary fill-primary" />
                Duo de Precisão
              </h3>
              {[
                {
                  icon: Gauge,
                  title: "Afinador Pro",
                  desc: "Detecta Real, Hz e Pitch exato para seu Sax.",
                  color: "text-primary",
                },
                {
                  icon: Timer,
                  title: "Metrônomo Digital",
                  desc: "Ritmo inabalável para nunca perder o compasso.",
                  color: "text-[hsl(142,70%,45%)]",
                },
              ].map((feat, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-background/50 border border-border/50">
                  <feat.icon className={`w-6 h-6 ${feat.color} shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="font-bold text-sm">{feat.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-md mx-auto glass-card rounded-2xl p-6 border border-border">
          <h2 className="font-bold font-heading text-base mb-4 text-center">
            Por que essas 2 ferramentas são indispensáveis?
          </h2>
          <div className="space-y-3">
            {[
              "Sem afinador, cada minuto de estudo reforça erros que ficam cada vez mais difíceis de corrigir",
              "Sem metrônomo, você nunca vai conseguir tocar em grupo com confiança e segurança",
              "Com essas duas ferramentas, você já está na frente de 90% dos saxofonistas amadores",
            ].map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-[hsl(142,70%,45%)] mt-0.5 shrink-0" />
                <p className="text-sm font-body text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-4 px-4 md:px-8">
        <div className="max-w-md mx-auto flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[hsl(142,70%,45%)]" />
            <span className="text-xs font-heading text-muted-foreground">Acesso Vitalício</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[hsl(142,70%,45%)]" />
            <span className="text-xs font-heading text-muted-foreground">100% Online</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 md:px-8">
        <div className="max-w-md mx-auto text-center space-y-5">
          <div className="glass-card rounded-2xl p-8 border-2 border-[hsl(142,70%,45%)]/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(142,70%,45%)] to-primary" />
            <p className="text-xs text-muted-foreground font-heading uppercase tracking-widest mb-2">Afinador + Metrônomo Pro</p>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-lg text-muted-foreground line-through font-heading">R$ 27,90</span>
              <span className="text-5xl font-extrabold font-heading text-[hsl(142,70%,45%)]">R$ 14,50</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-6">
              Pagamento único · Acesso vitalício<br/>
              Acesso enviado por <strong>E-mail</strong>.
            </p>

            <a
              href="https://pay.wiapy.com/SSjOIsHzZ"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-base md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 w-full justify-center"
            >
              SIM! QUERO POR R$ 14,50
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>

            <div className="flex items-center justify-center gap-4 mt-4">
              {["Afinador", "Metrônomo"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-[hsl(142,70%,45%)]" /> {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleFinalExit}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <X className="w-4 h-4" />
            Não, obrigado. Ir para minha plataforma.
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

export default DownsellToolkit;
