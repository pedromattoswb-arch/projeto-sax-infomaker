import { Button } from "@/components/ui/button";
import { Music, ArrowRight, Sparkles } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen gradient-purple-radial flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating music notes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/20 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${24 + i * 8}px`,
            }}
          >
            🎵
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold-lg animate-pulse-gold">
              <Music className="w-12 h-12 text-primary-foreground" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-bounce" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30">
          <span className="text-primary text-sm font-medium">🎷 Clube do Sax Brasil</span>
        </div>

        {/* Headline - Pain focused */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          <span className="text-primary">Chega de perder tempo</span>
          <span className="text-foreground"> procurando partituras ruins na internet</span>
        </h1>

        {/* Subheadline - Transformation focused */}
        <p className="text-lg text-muted-foreground leading-relaxed">
          Mais de <span className="text-primary font-semibold">2.000 partituras e playbacks</span> prontos para você tocar agora. 
          Do iniciante ao avançado. Do Gospel ao Jazz. 
          <span className="text-foreground font-medium"> Tudo organizado na palma da sua mão.</span>
        </p>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="w-full sm:w-auto px-10 py-7 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-primary-foreground shadow-gold-lg hover:shadow-gold transition-all duration-300 animate-pulse-gold"
        >
          QUERO CONHECER O ACERVO
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>

        {/* Micro-copy */}
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Responda 7 perguntas rápidas e veja se combina com você
        </p>

        {/* Trust badges - More specific */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="text-primary">✓</span> Sax Alto e Tenor
          </span>
          <span className="flex items-center gap-1">
            <span className="text-primary">✓</span> Playbacks Profissionais
          </span>
          <span className="flex items-center gap-1">
            <span className="text-primary">✓</span> Formato Interativo
          </span>
          <span className="flex items-center gap-1">
            <span className="text-primary">✓</span> Acesso Vitalício
          </span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
