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
    <div className="min-h-screen gradient-purple-radial flex flex-col px-4 py-6">
      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Pergunta {currentStep + 1} de {totalQuestions}
          </span>
          <span className="text-sm text-primary font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-gold-dark transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Feedback message (shows after dream question) */}
      {showFeedback && previousDream && (
        <div className="w-full max-w-md mx-auto mb-6 animate-fade-in">
          <div className="bg-secondary/50 border border-primary/30 rounded-xl p-4 text-center">
            <p className="text-foreground font-medium">
              {getDreamFeedback(previousDream)}
            </p>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 animate-fade-in">
          {question.question}
        </h2>

        {/* Options */}
        <div className="w-full space-y-3">
          {question.options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={selectedOption !== null}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-4",
                "animate-slide-up",
                selectedOption === option.value
                  ? "border-primary bg-primary/10 shadow-gold"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30",
                selectedOption !== null && selectedOption !== option.value && "opacity-50"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <span className="text-2xl">{option.icon}</span>
              
              {/* Label */}
              <span className="flex-1 font-medium text-foreground">
                {option.label}
              </span>

              {/* Check indicator */}
              {selectedOption === option.value && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-primary-foreground" />
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
