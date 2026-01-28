import { useState, useEffect } from "react";
import { QuizState, getCategoryByDream } from "@/types/quiz";
import { Check, Loader2 } from "lucide-react";

interface DiagnosisScreenProps {
  quizState: QuizState;
  onComplete: () => void;
}

const DiagnosisScreen = ({ quizState, onComplete }: DiagnosisScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const saxType = quizState.instrument === "alto" ? "Sax Alto" : "Sax Tenor";
  const category = getCategoryByDream(quizState.dream);

  const steps = [
    "Analisando suas preferências musicais...",
    `Separando partituras de ${category} para você...`,
    `Organizando playbacks para ${saxType}...`,
    "Desbloqueando acesso ao acervo completo...",
  ];

  useEffect(() => {
    const stepDuration = 1000;
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 1500);
          }, 800);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  return (
    <div className="h-[100dvh] gradient-purple-radial flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden">
      {/* Confetti effect when complete */}
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--gold))",
                animationDelay: `${Math.random() * 0.5}s`,
                borderRadius: i % 3 === 0 ? "50%" : "0",
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-sm w-full text-center space-y-6">
        {!isComplete ? (
          <>
            {/* Loading animation */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2.5">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-500 ${
                    index < currentStep
                      ? "bg-primary/10 border border-primary/30"
                      : index === currentStep
                      ? "bg-secondary/50 border border-border animate-pulse"
                      : "opacity-30"
                  }`}
                >
                  {index < currentStep ? (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  ) : index === currentStep ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                  )}
                  <span className="text-xs text-foreground text-left">{step}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Success state */
          <div className="animate-scale-in space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold-lg animate-pulse-gold">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Pronto! Seu acervo está liberado! 🎷
            </h2>
            <p className="text-sm text-muted-foreground">
              Mais de <span className="text-primary font-semibold">2.000 partituras e playbacks</span> esperando por você
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisScreen;
