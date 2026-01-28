import { useState, useEffect, useRef } from "react";
import { QuizQuestion, getDreamFeedback, DreamType } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { trackQuizStep } from "@/hooks/useMetaPixel";

interface QuizStepProps {
  question: QuizQuestion;
  progress: number;
  currentStep: number;
  totalQuestions: number;
  onAnswer: (questionId: number, answer: string) => void;
  previousDream?: DreamType | null;
}

const QuizStep = ({
  question,
  progress,
  currentStep,
  totalQuestions,
  onAnswer,
  previousDream,
}: QuizStepProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [ripplePosition, setRipplePosition] = useState<{ x: number; y: number } | null>(null);
  const [showMilestone, setShowMilestone] = useState(false);
  const prevProgressRef = useRef(progress);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setRipplePosition(null);
  }, [question.id]);

  // Show feedback for dream question (question 3)
  useEffect(() => {
    if (currentStep === 3 && previousDream) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, previousDream]);

  // Milestone celebration at 25%, 50%, 75%
  useEffect(() => {
    const milestones = [25, 50, 75];
    const crossedMilestone = milestones.find(
      m => prevProgressRef.current < m && progress >= m
    );
    
    if (crossedMilestone) {
      setShowMilestone(true);
      setTimeout(() => setShowMilestone(false), 600);
    }
    
    prevProgressRef.current = progress;
  }, [progress]);

  const handleSelect = (value: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedOption) return; // Prevent double selection
    
    // Get ripple position relative to button
    const rect = event.currentTarget.getBoundingClientRect();
    setRipplePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    
    setSelectedOption(value);
    
    // Track quiz step
    trackQuizStep(currentStep + 1, totalQuestions, value);
    
    // Delay before moving to next question for visual feedback
    setTimeout(() => {
      onAnswer(question.id, value);
    }, 500);
  };

  // Calculate milestone positions
  const milestones = [25, 50, 75];

  return (
    <div className="h-[100dvh] gradient-purple-radial flex flex-col px-4 py-4 overflow-hidden">
      {/* Progress bar with milestones */}
      <div className="w-full max-w-sm mx-auto mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} de {totalQuestions}
          </span>
          <span className={cn(
            "text-xs font-medium transition-all duration-300",
            showMilestone ? "text-primary scale-110" : "text-primary"
          )}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className={cn(
          "h-2 bg-muted rounded-full overflow-visible relative",
          showMilestone && "animate-milestone-flash"
        )}>
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-primary to-gold-dark transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            {/* Animated glow at the end */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-gold animate-pulse" />
          </div>
          
          {/* Milestone markers */}
          {milestones.map((milestone) => (
            <div
              key={milestone}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300",
                progress >= milestone 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30 scale-100"
              )}
              style={{ left: `${milestone}%`, transform: 'translate(-50%, -50%)' }}
            />
          ))}
        </div>
      </div>

      {/* Feedback message (shows after dream question) */}
      {showFeedback && previousDream && (
        <div className="w-full max-w-sm mx-auto mb-3 animate-fade-in">
          <div className="bg-secondary/50 border border-primary/30 rounded-lg p-2.5 text-center">
            <p className="text-foreground text-xs font-medium">
              {getDreamFeedback(previousDream)}
            </p>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <h2 className="text-lg font-bold text-center mb-4 animate-fade-in leading-tight">
          {question.question}
        </h2>

        {/* Options */}
        <div className="w-full space-y-2">
          {question.options.map((option, index) => (
            <button
              key={option.value}
              onClick={(e) => handleSelect(option.value, e)}
              disabled={selectedOption !== null}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition-all duration-300 text-left flex items-center gap-3 relative overflow-hidden",
                "animate-slide-up",
                selectedOption === option.value
                  ? "border-primary bg-primary/15 shadow-gold scale-[1.02]"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30",
                selectedOption !== null && selectedOption !== option.value && "opacity-40 scale-[0.98]"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Ripple effect */}
              {selectedOption === option.value && ripplePosition && (
                <span
                  className="absolute bg-primary/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripplePosition.x,
                    top: ripplePosition.y,
                    width: 20,
                    height: 20,
                    marginLeft: -10,
                    marginTop: -10,
                  }}
                />
              )}

              {/* Icon */}
              <span className="text-xl flex-shrink-0">{option.icon}</span>
              
              {/* Label */}
              <span className="flex-1 font-medium text-sm text-foreground leading-tight">
                {option.label}
              </span>

              {/* Check indicator with bounce */}
              {selectedOption === option.value && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-bounce-in flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
