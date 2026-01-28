import { useState, useEffect } from "react";
import { QuizQuestion, getDreamFeedback, DreamType } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
  }, [question.id]);

  // Show feedback for dream question (question 3)
  useEffect(() => {
    if (currentStep === 3 && previousDream) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, previousDream]);

  const handleSelect = (value: string) => {
    if (selectedOption) return; // Prevent double selection
    
    setSelectedOption(value);
    
    // Delay before moving to next question for visual feedback
    setTimeout(() => {
      onAnswer(question.id, value);
    }, 400);
  };

  return (
    <div className="h-[100dvh] gradient-purple-radial flex flex-col px-4 py-4 overflow-hidden">
      {/* Progress bar */}
      <div className="w-full max-w-sm mx-auto mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} de {totalQuestions}
          </span>
          <span className="text-xs text-primary font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-gold-dark transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
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
              onClick={() => handleSelect(option.value)}
              disabled={selectedOption !== null}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition-all duration-300 text-left flex items-center gap-3",
                "animate-slide-up",
                selectedOption === option.value
                  ? "border-primary bg-primary/10 shadow-gold"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30",
                selectedOption !== null && selectedOption !== option.value && "opacity-50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <span className="text-xl flex-shrink-0">{option.icon}</span>
              
              {/* Label */}
              <span className="flex-1 font-medium text-sm text-foreground leading-tight">
                {option.label}
              </span>

              {/* Check indicator */}
              {selectedOption === option.value && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in flex-shrink-0">
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
