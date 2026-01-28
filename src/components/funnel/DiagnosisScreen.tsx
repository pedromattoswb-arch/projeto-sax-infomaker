import { useState, useEffect } from "react";
import { QuizState, getCategoryByDream } from "@/types/quiz";
import { Check, Loader2, Music, Sparkles } from "lucide-react";

interface DiagnosisScreenProps {
  quizState: QuizState;
  onComplete: () => void;
}

const DiagnosisScreen = ({ quizState, onComplete }: DiagnosisScreenProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const getInstrumentText = () => {
    return quizState.instrument === "alto" ? "Alto" : "Tenor";
  };

  const getCategoryText = () => {
    if (quizState.dream) {
      return getCategoryByDream(quizState.dream);
    }
    return "repertório exclusivo";
  };

  const loadingSteps = [
    { text: "Analisando suas preferências musicais...", duration: 1200 },
    { text: `Separando partituras de ${getCategoryText()} para você...`, duration: 1500 },
    { text: `Organizando playbacks para Sax ${getInstrumentText()}...`, duration: 1500 },
    { text: "Desbloqueando acesso ao acervo completo...", duration: 1000 },
  ];

  useEffect(() => {
    if (currentStepIndex < loadingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, loadingSteps[currentStepIndex].duration);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      // Wait a bit before transitioning to offer
      setTimeout(onComplete, 2000);
    }
  }, [currentStepIndex, isComplete, onComplete, loadingSteps.length]);

  return (
    <div className="min-h-screen gradient-purple-radial flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                isComplete
                  ? "bg-gradient-to-br from-primary to-gold-dark shadow-gold-lg"
                  : "bg-secondary/50 border-2 border-primary/30"
              }`}
            >
              {isComplete ? (
                <Check className="w-16 h-16 text-primary-foreground animate-bounce-in" />
              ) : (
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              )}
            </div>
            {isComplete && (
              <>
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-bounce" />
                <Music className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
              </>
            )}
          </div>
        </div>

        {/* Loading steps */}
        {!isComplete && (
          <div className="space-y-4">
            {loadingSteps.slice(0, currentStepIndex + 1).map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 justify-center animate-fade-in ${
                  index === currentStepIndex ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                <span className="text-sm md:text-base">{step.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Completion message */}
        {isComplete && (
          <div className="space-y-4 animate-bounce-in">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Check className="w-6 h-6" />
              <span className="text-xl font-bold">Pronto! Seu acervo está liberado!</span>
            </div>
            <p className="text-lg text-foreground">
              Mais de <span className="text-primary font-bold">2.000 partituras e playbacks</span> esperando por você
            </p>

            {/* Confetti effect */}
            <div className="relative h-20 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${10 + i * 8}%`,
                    animationDelay: `${i * 0.1}s`,
                    color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--gold-light))",
                  }}
                >
                  {i % 3 === 0 ? "🎵" : i % 3 === 1 ? "✨" : "🎷"}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisScreen;
