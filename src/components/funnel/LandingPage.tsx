import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music, ArrowRight, Sparkles } from "lucide-react";
import { trackLandingView, trackQuizStart } from "@/hooks/useMetaPixel";

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  // Track landing page view on mount
  useEffect(() => {
    trackLandingView();
  }, []);

  const handleStart = () => {
    trackQuizStart();
    onStart();
  };
  return (
    <div className="h-[100dvh] gradient-purple-radial flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden">
      {/* Floating music notes background - fewer and smaller */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/15 animate-float"
            style={{
              left: `${20 + i * 20}%`,
              top: `${15 + (i % 2) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${18 + i * 4}px`,
            }}
          >
            🎵
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-sm w-full text-center space-y-4">
        {/* Logo/Icon - smaller */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold-lg animate-pulse-gold">
              <Music className="w-8 h-8 text-primary-foreground" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-bounce" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-primary/30">
          <span className="text-primary text-xs font-medium">🎷 Clube do Sax Brasil</span>
        </div>

        {/* Headline - Pain focused */}
        <h1 className="text-xl font-bold leading-tight">
          <span className="text-primary">Chega de perder tempo</span>
          <span className="text-foreground"> procurando partituras ruins na internet</span>
        </h1>

        {/* Subheadline - Transformation focused */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Mais de <span className="text-primary font-semibold">2.000 partituras e playbacks</span> prontos para você tocar agora. 
          Do iniciante ao avançado. Do Gospel ao Jazz. 
          <span className="text-foreground font-medium"> Tudo organizado na palma da sua mão.</span>
        </p>

        {/* CTA Button - optimized size */}
        <Button
          onClick={handleStart}
          size="lg"
          className="w-full h-12 text-sm font-bold bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-primary-foreground shadow-gold-lg hover:shadow-gold transition-all duration-300 animate-pulse-gold"
        >
          QUERO CONHECER O ACERVO
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        {/* Micro-copy */}
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Responda 7 perguntas rápidas
        </p>

        {/* Trust badges - More specific */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center justify-center gap-1 bg-secondary/30 rounded-md px-2 py-1.5">
            <span className="text-primary text-xs">✓</span> Sax Alto e Tenor
          </span>
          <span className="flex items-center justify-center gap-1 bg-secondary/30 rounded-md px-2 py-1.5">
            <span className="text-primary text-xs">✓</span> Playbacks Pro
          </span>
          <span className="flex items-center justify-center gap-1 bg-secondary/30 rounded-md px-2 py-1.5">
            <span className="text-primary text-xs">✓</span> Formato Interativo
          </span>
          <span className="flex items-center justify-center gap-1 bg-secondary/30 rounded-md px-2 py-1.5">
            <span className="text-primary text-xs">✓</span> Acesso Vitalício
          </span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
