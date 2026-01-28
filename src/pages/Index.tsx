import { useQuiz } from "@/hooks/useQuiz";
import LandingPage from "@/components/funnel/LandingPage";
import QuizStep from "@/components/funnel/QuizStep";
import DiagnosisScreen from "@/components/funnel/DiagnosisScreen";
import OfferPage from "@/components/funnel/OfferPage";

const Index = () => {
  const {
    funnelStep,
    quizState,
    startQuiz,
    answerQuestion,
    completeDiagnosis,
    currentQuestion,
    totalQuestions,
    progress,
  } = useQuiz();

  return (
    <div className="min-h-screen">
      {funnelStep === "landing" && <LandingPage onStart={startQuiz} />}

      {funnelStep === "quiz" && currentQuestion && (
        <QuizStep
          question={currentQuestion}
          progress={progress}
          currentStep={quizState.currentStep}
          totalQuestions={totalQuestions}
          onAnswer={answerQuestion}
          previousDream={quizState.dream}
        />
      )}

      {funnelStep === "diagnosis" && (
        <DiagnosisScreen quizState={quizState} onComplete={completeDiagnosis} />
      )}

      {funnelStep === "offer" && <OfferPage quizState={quizState} />}
    </div>
  );
};

export default Index;
