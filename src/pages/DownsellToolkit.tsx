import { ArrowRight, Gauge, Timer, X } from "lucide-react";
import { Link } from "react-router-dom";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";

const DownsellToolkit = () => {
  useNoIndex();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-8 md:h-10 w-auto" />
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading mb-4 leading-tight">
            Tudo bem! Que tal só o <span className="text-primary">Afinador + Metrônomo</span>?
          </h1>

          <p className="text-foreground font-body text-[15px] md:text-lg mb-6 leading-relaxed max-w-xl mx-auto">
            As duas ferramentas mais essenciais para qualquer saxofonista — com transposição automática e modo progressivo.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-4 px-4 md:px-8">
        <div className="max-w-md mx-auto space-y-4">
          {[
            {
              icon: Gauge,
              title: "Afinador Cromático",
              desc: "Detecta a nota em tempo real e já mostra a transposição para o seu sax (Alto ou Tenor).",
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              icon: Timer,
              title: "Metrônomo Inteligente",
              desc: "40-220 BPM, 4 fórmulas de compasso, modo progressivo automático para treinos de velocidade.",
              color: "text-[hsl(142,70%,45%)]",
              bg: "bg-[hsl(142,70%,45%)]/10",
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-6 flex gap-5 items-start">
                <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-base mb-1">{feat.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="glass-card rounded-2xl p-6 border-2 border-[hsl(142,70%,45%)]/30">
            <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider mb-1">Afinador + Metrônomo Pro</p>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-lg text-muted-foreground line-through font-heading">R$ 27,90</span>
              <span className="text-4xl font-extrabold font-heading text-[hsl(142,70%,45%)]">R$ 14,90</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-4">Pagamento único · Acesso vitalício</p>

            <a
              href="#"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 w-full justify-center"
            >
              QUERO POR R$ 14,90
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>
          </div>

          <Link
            to="/cx/r7b2k9"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <X className="w-4 h-4" />
            Não, obrigado. Ir para minha plataforma.
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border text-center">
        <img src={logoClubeSax} alt="Clube do Sax" className="h-7 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default DownsellToolkit;
