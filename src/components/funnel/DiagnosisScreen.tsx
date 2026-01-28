import { useState, useEffect, useRef } from "react";
import { QuizState, getCategoryByDream } from "@/types/quiz";
import { Check } from "lucide-react";
import { trackQuizComplete } from "@/hooks/useMetaPixel";

interface DiagnosisScreenProps {
  quizState: QuizState;
  onComplete: () => void;
}

const DiagnosisScreen = ({ quizState, onComplete }: DiagnosisScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const saxType = quizState.instrument === "alto" ? "Sax Alto" : "Sax Tenor";
  const category = getCategoryByDream(quizState.dream);

  const phases = [
    { threshold: 25, text: "Analisando suas preferências musicais..." },
    { threshold: 50, text: `Separando partituras de ${category} para você...` },
    { threshold: 75, text: `Organizando playbacks para ${saxType}...` },
    { threshold: 100, text: "Desbloqueando acesso ao acervo completo..." },
  ];

  // Track Lead event on mount (quiz completed)
  useEffect(() => {
    trackQuizComplete({
      instrument: quizState.instrument || undefined,
      level: quizState.level || undefined,
      dream: quizState.dream || undefined,
    });
  }, [quizState.instrument, quizState.level, quizState.dream]);

  // Smooth progress animation
  useEffect(() => {
    const totalDuration = 5000; // 5 seconds total
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min((elapsed / totalDuration) * 100, 100);
      
      // Ease-out effect for smoother progression
      const easedProgress = rawProgress < 100 
        ? rawProgress + Math.sin((rawProgress / 100) * Math.PI) * 3 
        : 100;
      
      setProgress(Math.min(easedProgress, 100));
      
      // Update phase based on progress
      const newPhase = phases.findIndex(p => rawProgress < p.threshold);
      setCurrentPhase(newPhase === -1 ? 3 : newPhase);
      
      if (rawProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Complete!
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 1800);
        }, 300);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onComplete]);

  // Circle SVG parameters
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-[100dvh] gradient-purple-radial flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden">
      {/* Enhanced Confetti effect when complete */}
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                backgroundColor: i % 3 === 0 
                  ? "hsl(var(--primary))" 
                  : i % 3 === 1 
                    ? "hsl(var(--gold-light))" 
                    : "hsl(var(--accent))",
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${Math.random() * 1.5 + 1.5}s`,
                borderRadius: i % 2 === 0 ? "50%" : "2px",
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-sm w-full text-center space-y-6">
        {!isComplete ? (
          <>
            {/* Circular Progress with Percentage */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Background circle */}
                <svg width={size} height={size} className="transform -rotate-90">
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--purple-light))"
                    strokeWidth={strokeWidth}
                    className="opacity-30"
                  />
                  {/* Progress circle */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: strokeDashoffset,
                      transition: 'stroke-dashoffset 0.1s ease-out',
                    }}
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--gold-light))" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Percentage in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-3xl font-bold text-primary tabular-nums"
                    style={{
                      textShadow: '0 0 20px hsl(var(--primary) / 0.5)',
                    }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>

                {/* Pulse ring on milestone */}
                {[25, 50, 75].includes(Math.round(progress)) && (
                  <div 
                    className="absolute inset-0 rounded-full animate-milestone-pulse"
                    style={{
                      border: '2px solid hsl(var(--primary))',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Current step text */}
            <p className="text-sm text-foreground font-medium animate-fade-in min-h-[40px]">
              {phases[currentPhase]?.text}
            </p>

            {/* Steps checklist */}
            <div className="space-y-2">
              {phases.map((phase, index) => {
                const isCompleted = progress >= phase.threshold;
                const isCurrent = currentPhase === index;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2.5 p-2 rounded-lg transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary/15 border border-primary/40"
                        : isCurrent
                        ? "bg-secondary/40 border border-border"
                        : "opacity-40"
                    }`}
                  >
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 animate-scale-in">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                    )}
                    <span className={`text-xs text-left transition-colors duration-300 ${
                      isCompleted ? 'text-foreground' : isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {phase.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Success state with enhanced celebration */
          <div className="animate-bounce-in space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-gold to-gold-light flex items-center justify-center shadow-gold-lg animate-pulse-gold relative">
                <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full animate-ping-slow opacity-50 bg-primary/30" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Pronto! Seu acervo está liberado! 🎷
            </h2>
            <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Mais de <span className="text-primary font-semibold">2.000 partituras e playbacks</span> esperando por você
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisScreen;
