import { ArrowRight, Gauge, Timer, X, Check, Shield } from "lucide-react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";

const DownsellToolkit = () => {
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

      {/* Features */}
      <section className="py-6 px-4 md:px-8">
        <div className="max-w-md mx-auto space-y-4">
          {[
            {
              icon: Gauge,
              title: "Afinador Cromático para Sax",
              desc: "Detecta nota em tempo real, mostra cents e frequência, transposição automática para Alto (Eb) ou Tenor (Bb).",
              color: "text-primary",
              bg: "bg-primary/15",
              border: "border-primary/20",
            },
            {
              icon: Timer,
              title: "Metrônomo Profissional",
              desc: "40-220 BPM, scheduling de áudio preciso, 4 fórmulas de compasso, tap tempo e modo progressivo automático.",
              color: "text-[hsl(142,70%,45%)]",
              bg: "bg-[hsl(142,70%,45%)]/15",
              border: "border-[hsl(142,70%,45%)]/20",
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className={`glass-card rounded-2xl p-6 flex gap-5 items-start border ${feat.border}`}>
                <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-7 h-7 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-lg mb-1">{feat.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
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
              <span className="text-5xl font-extrabold font-heading text-[hsl(142,70%,45%)]">R$ 14,90</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-6">Pagamento único · Acesso vitalício</p>

            <a
              href="#"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-base md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 w-full justify-center"
            >
              QUERO POR R$ 14,90
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
            onClick={() => window.location.href = "/cx/r7b2k9"}
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
