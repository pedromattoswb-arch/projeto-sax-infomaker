import { ArrowRight, Gauge, Timer, Music, Zap, X } from "lucide-react";
import { Link } from "react-router-dom";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";

const features = [
  {
    icon: Gauge,
    title: "Afinador Cromático para Sax",
    description: "Detecta a nota que você toca em tempo real pelo microfone. Já mostra a nota transposta para Sax Alto ou Tenor automaticamente. Acaba a dúvida se você está afinado.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Timer,
    title: "Metrônomo Inteligente",
    description: "BPM ajustável de 40 a 220, fórmulas de compasso (2/4, 3/4, 4/4, 6/8) e modo progressivo que aumenta a velocidade sozinho. Ideal para exercícios de técnica.",
    color: "text-[hsl(142,70%,45%)]",
    bgColor: "bg-[hsl(142,70%,45%)]/10",
  },
  {
    icon: Music,
    title: "Gerador de Escalas e Arpejos",
    description: "Escolha qualquer tonalidade e veja todas as notas já transpostas para o seu sax. 10 tipos de escala + 5 tipos de arpejo. Tudo com áudio para conferir.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const UpsellToolkit = () => {
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
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-xs font-bold font-heading text-primary">OFERTA EXCLUSIVA PÓS-COMPRA</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-4 leading-tight">
            Espera! Falta <span className="text-primary">uma coisa</span> para você estudar de verdade
          </h1>

          <p className="text-foreground font-body text-[15px] md:text-lg mb-3 leading-relaxed max-w-xl mx-auto">
            Você tem as partituras. Agora precisa das <strong>ferramentas certas</strong> para estudar com eficiência.
          </p>

          <p className="text-muted-foreground font-body text-sm max-w-lg mx-auto">
            Afinador, metrônomo e escalas — tudo integrado, com transposição automática para sax. Sem instalar nada.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-6 flex gap-5 items-start hover:bg-surface/80 transition-all">
                <div className={`w-12 h-12 rounded-xl ${feat.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-base mb-1">{feat.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 md:p-8">
          <h2 className="font-bold font-heading text-lg mb-4 text-center">
            Por que você precisa disso?
          </h2>
          <div className="space-y-3">
            {[
              "Sem afinador, você estuda desafinado sem perceber — e o ouvido vicia errado",
              "Sem metrônomo, você nunca saberá se está no tempo certo quando for tocar com banda",
              "Sem referência de escalas, você perde horas procurando notas transpostas na internet",
              "Com o Kit, você abre uma aba e tem tudo pronto — na mesma plataforma das partituras",
            ].map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-[hsl(142,70%,45%)] text-lg mt-0.5">✓</span>
                <p className="text-sm font-body text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="glass-card rounded-2xl p-6 border-2 border-primary/30">
            <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider mb-1">Kit Ferramentas do Saxofonista</p>
            <div className="text-4xl font-extrabold font-heading text-primary mb-1">
              R$ 27,90
            </div>
            <p className="text-xs text-muted-foreground font-body mb-4">Pagamento único · Acesso vitalício</p>

            <a
              href="#"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 w-full justify-center"
            >
              QUERO O KIT COMPLETO
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>
          </div>

          <Link
            to="/cx/d5w2n8"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <X className="w-4 h-4" />
            Não, obrigado. Seguir sem o Kit.
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

export default UpsellToolkit;
