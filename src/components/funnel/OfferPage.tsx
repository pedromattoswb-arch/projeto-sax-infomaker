import { useState, useEffect } from "react";
import { QuizState, getPersonalizedHeadline } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Clock,
  Music,
  Headphones,
  BookOpen,
  Star,
  ChevronRight,
  Check,
  Zap,
  Play,
} from "lucide-react";

interface OfferPageProps {
  quizState: QuizState;
}

const CHECKOUT_URL = "https://pay.cakto.com.br/3djucaz_745080";

const categories = [
  { icon: "🎵", name: "Pop Internacional", artists: "Michael Jackson, Beyoncé, Madonna" },
  { icon: "🕺", name: "Flashback", artists: "Elton John, Bee Gees, Abba" },
  { icon: "🇧🇷", name: "MPB", artists: "Roupa Nova, Djavan, Elis Regina" },
  { icon: "🎸", name: "Rock", artists: "Queen, Beatles, Legião Urbana" },
  { icon: "⛪", name: "Gospel", artists: "Aline Barros, Fernandinho + Harpa Cristã" },
  { icon: "🎷", name: "Técnico", artists: "Kenny G, Eric Marienthal" },
  { icon: "🎁", name: "Bônus", artists: "Blues, Sertanejo, Jazz, Samba" },
];

const testimonials = [
  { name: "João", location: "SP", text: "O playback lado a lado me salvou no ensaio!" },
  { name: "Maria", location: "MG", text: "O acervo de Gospel é gigante, tem tudo!" },
  { name: "Carlos", location: "RJ", text: "Finalmente consigo acompanhar o tempo das músicas" },
];

const benefits = [
  { icon: BookOpen, text: "+2.000 partituras organizadas" },
  { icon: Headphones, text: "Playbacks profissionais" },
  { icon: Zap, text: "Formato Interativo (partitura + playback juntos)" },
  { icon: Clock, text: "Acesso vitalício" },
  { icon: Star, text: "Novidades mensais" },
];

const OfferPage = ({ quizState }: OfferPageProps) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

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
    : "O Acervo Definitivo para Saxofonistas";

  const handleCheckout = () => {
    window.open(CHECKOUT_URL, "_blank");
  };

  return (
    <div className="min-h-screen gradient-purple-radial pb-24">
      {/* Timer bar */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">Oferta especial expira em:</span>
          <span className="font-mono font-bold text-primary text-lg">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* Headline */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Perfil Identificado com Sucesso!</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{headline}</h1>
        </div>

        {/* Transformation copy */}
        <Card className="p-6 bg-secondary/30 border-primary/20 animate-slide-up">
          <p className="text-center text-foreground leading-relaxed">
            Imagine tocar <span className="text-primary font-semibold">"Careless Whisper"</span> no
            próximo churrasco da família, ou emocionar a todos com{" "}
            <span className="text-primary font-semibold">"Todo Azul do Mar"</span> em um casamento...
          </p>
        </Card>

        {/* Interactive format highlight */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/30 border-primary/30 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">🆕 Formato Interativo</h3>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Partitura + Playback rodando JUNTOS</span> na tela.
                Nunca mais perca o tempo ou se confunda com a partitura!
              </p>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-lg font-bold text-foreground text-center">O que você recebe:</h3>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <benefit.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-lg font-bold text-foreground text-center">O Acervo Completo:</h3>
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-card/30 rounded-lg border border-border/50">
                <span className="text-2xl">{category.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{category.artists}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-lg font-bold text-foreground text-center">O que dizem os alunos:</h3>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-4 bg-card/50 border-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {testimonial.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground italic">"{testimonial.text}"</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - {testimonial.name}, {testimonial.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Price */}
        <div className="text-center space-y-3 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <p className="text-muted-foreground">
            <span className="line-through">De R$ 197,00</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-primary">R$ 37,90</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Acesso Vitalício • Parcele em até 6x
          </p>
        </div>

        {/* Guarantee */}
        <Card className="p-4 bg-card/50 border-primary/20 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Garantia de 7 Dias</h4>
              <p className="text-sm text-muted-foreground">
                Risco Zero: Se não amar, devolvemos seu dinheiro. Sem perguntas.
              </p>
            </div>
          </div>
        </Card>

        {/* Main CTA (for larger screens, hidden on mobile where sticky CTA shows) */}
        <div className="hidden sm:block">
          <Button
            onClick={handleCheckout}
            size="lg"
            className="w-full py-7 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-primary-foreground shadow-gold-lg"
          >
            QUERO ACESSAR O ACERVO AGORA
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>

      {/* Sticky CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur border-t border-border sm:hidden z-50">
        <Button
          onClick={handleCheckout}
          size="lg"
          className="w-full py-7 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-primary-foreground shadow-gold-lg animate-pulse-gold"
        >
          QUERO ACESSAR O ACERVO AGORA
          <ChevronRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OfferPage;
