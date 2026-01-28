import { useState, useEffect } from "react";
import { QuizState, getPersonalizedHeadline } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Clock,
  Headphones,
  BookOpen,
  ChevronRight,
  Check,
  Zap,
  Play,
  Music,
  Infinity,
  RefreshCw,
} from "lucide-react";
import TestimonialCarousel from "./TestimonialCarousel";
import SheetMusicPreview from "./SheetMusicPreview";

interface OfferPageProps {
  quizState: QuizState;
}

const CHECKOUT_URL = "https://pay.cakto.com.br/3djucaz_745080";

const categories = [
  { icon: "🎵", name: "Pop Internacional", artists: "Michael Jackson, Beyoncé" },
  { icon: "🕺", name: "Flashback", artists: "Elton John, Bee Gees" },
  { icon: "🇧🇷", name: "MPB", artists: "Roupa Nova, Djavan" },
  { icon: "🎸", name: "Rock", artists: "Queen, Beatles" },
  { icon: "⛪", name: "Gospel", artists: "Harpa Cristã completa" },
  { icon: "🎁", name: "Bônus", artists: "Jazz, Blues, Samba" },
];

const benefits = [
  { icon: BookOpen, text: "+2.000 partituras organizadas" },
  { icon: Headphones, text: "Playbacks profissionais" },
  { icon: Zap, text: "Partitura + áudio sincronizados" },
  { icon: Music, text: "Sax Alto e Tenor" },
  { icon: Infinity, text: "Acesso vitalício" },
  { icon: RefreshCw, text: "Novidades todo mês" },
];

const OfferPage = ({ quizState }: OfferPageProps) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const headline = quizState.dream
    ? getPersonalizedHeadline(quizState.dream)
    : "O arsenal completo para saxofonistas";

  const handleCheckout = () => {
    window.open(CHECKOUT_URL, "_blank");
  };

  return (
    <div className="min-h-screen gradient-purple-radial pb-20">
      {/* Timer bar */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border py-2 px-3">
        <div className="max-w-sm mx-auto flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs text-foreground">Oferta expira em:</span>
          <span className="font-mono font-bold text-primary text-sm">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-4 space-y-4">
        {/* Headline */}
        <div className="text-center space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
            <Check className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary font-medium">Seu acervo está pronto!</span>
          </div>
          <h1 className="text-lg font-bold text-foreground leading-tight">{headline}</h1>
        </div>

        {/* Interactive format highlight */}
        <Card className="p-3 bg-gradient-to-br from-primary/10 to-secondary/30 border-primary/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm mb-1">🆕 Formato Interativo</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Partitura e playback <span className="text-primary font-medium">rodando JUNTOS</span> na tela.
                Nunca mais se perde no tempo!
              </p>
            </div>
          </div>
        </Card>

        {/* Sheet Music Preview */}
        <SheetMusicPreview />

        {/* Benefits grid */}
        <div className="grid grid-cols-2 gap-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-card/50 rounded-lg border border-border">
              <benefit.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-[11px] text-foreground leading-tight">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground text-center">📚 O Acervo Completo:</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-card/30 rounded-lg border border-border/50">
                <span className="text-lg">{category.icon}</span>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-xs">{category.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{category.artists}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <TestimonialCarousel />

        {/* Price anchoring */}
        <div className="text-center space-y-2 py-2">
          <p className="text-xs text-muted-foreground">
            Valor de mais de <span className="font-semibold">R$ 500,00</span> por apenas:
          </p>
          <p className="text-muted-foreground">
            <span className="line-through text-sm">De R$ 197,00</span>
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl font-bold text-primary">R$ 37,90</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Acesso Vitalício • Parcele em até 6x
          </p>
        </div>

        {/* Guarantee */}
        <Card className="p-3 bg-card/50 border-primary/20">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-bold text-foreground text-sm">Garantia de 7 Dias</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Não amou? Devolvemos <span className="text-primary font-medium">100%</span>. Risco zero.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA for larger screens */}
        <div className="hidden sm:block">
          <Button
            onClick={handleCheckout}
            size="lg"
            className="w-full h-12 text-sm font-bold bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-primary-foreground shadow-gold-lg"
          >
            QUERO MEU ACESSO AGORA
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Sticky CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-card/95 backdrop-blur border-t border-border sm:hidden z-50">
        <Button
          onClick={handleCheckout}
          size="lg"
          className="w-full h-12 text-sm font-bold bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-primary-foreground shadow-gold-lg animate-pulse-gold"
        >
          QUERO MEU ACESSO AGORA
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default OfferPage;
