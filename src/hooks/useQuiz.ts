import { useState, useCallback } from 'react';
import { QuizState, QuizAnswer, QuizLevel, InstrumentType, DreamType, quizQuestions } from '@/types/quiz';

export type FunnelStep = 'landing' | 'quiz' | 'diagnosis' | 'offer';

export const useQuiz = () => {
  const [funnelStep, setFunnelStep] = useState<FunnelStep>('landing');
  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: 0,
    answers: [],
    level: null,
    instrument: null,
    dream: null,
  });

  const startQuiz = useCallback(() => {
    setFunnelStep('quiz');
    setQuizState({
      currentStep: 0,
      answers: [],
      level: null,
      instrument: null,
      dream: null,
    });
  }, []);

  const answerQuestion = useCallback((questionId: number, answer: string) => {
    setQuizState((prev) => {
      const newAnswers = [...prev.answers, { questionId, answer }];
      let newLevel = prev.level;
      let newInstrument = prev.instrument;
      let newDream = prev.dream;

      // Extract special answers
      if (questionId === 1) {
        newLevel = answer as QuizLevel;
      } else if (questionId === 2) {
        newInstrument = answer as InstrumentType;
      } else if (questionId === 3) {
        newDream = answer as DreamType;
      }

      const nextStep = prev.currentStep + 1;
      const isQuizComplete = nextStep >= quizQuestions.length;

      if (isQuizComplete) {
        // Move to diagnosis after a small delay
        setTimeout(() => setFunnelStep('diagnosis'), 300);
      }

      return {
        ...prev,
        answers: newAnswers,
        currentStep: nextStep,
        level: newLevel,
        instrument: newInstrument,
        dream: newDream,
      };
    });
  }, []);

  const completeDiagnosis = useCallback(() => {
    setFunnelStep('offer');
  }, []);

  const resetQuiz = useCallback(() => {
    setFunnelStep('landing');
    setQuizState({
      currentStep: 0,
      answers: [],
      level: null,
      instrument: null,
      dream: null,
    });
  }, []);

  return {
    funnelStep,
    quizState,
    startQuiz,
    answerQuestion,
    completeDiagnosis,
    resetQuiz,
    currentQuestion: quizQuestions[quizState.currentStep] || null,
    totalQuestions: quizQuestions.length,
    progress: (quizState.currentStep / quizQuestions.length) * 100,
  };
};
