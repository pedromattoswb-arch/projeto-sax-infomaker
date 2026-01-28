export type QuizLevel = 'iniciante' | 'intermediario' | 'profissional';
export type InstrumentType = 'alto' | 'tenor';
export type DreamType = 'igreja' | 'festas' | 'casamentos';

export interface QuizAnswer {
  questionId: number;
  answer: string;
}

export interface QuizState {
  currentStep: number;
  answers: QuizAnswer[];
  level: QuizLevel | null;
  instrument: InstrumentType | null;
  dream: DreamType | null;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  feedback?: Record<string, string>;
}

export interface QuizOption {
  value: string;
  label: string;
  icon?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual seu nível no saxofone?",
    options: [
      { value: "iniciante", label: "Iniciante", icon: "🌱" },
      { value: "intermediario", label: "Intermediário", icon: "📈" },
      { value: "profissional", label: "Profissional", icon: "🎯" },
    ],
  },
  {
    id: 2,
    question: "Você toca Sax Alto ou Tenor?",
    options: [
      { value: "alto", label: "Sax Alto", icon: "🎷" },
      { value: "tenor", label: "Sax Tenor", icon: "🎵" },
    ],
  },
  {
    id: 3,
    question: "Qual é o seu SONHO com o saxofone?",
    options: [
      { value: "igreja", label: "Tocar na Igreja", icon: "⛪" },
      { value: "festas", label: "Brilhar em Festas e Churrascos", icon: "🎉" },
      { value: "casamentos", label: "Tocar Profissionalmente em Casamentos", icon: "💒" },
    ],
    feedback: {
      igreja: "Ótimo! Temos Gospel completo + Harpa Cristã 🙏",
      festas: "Perfeito! Nosso acervo de Flashback e Rock é imenso! 🎸",
      casamentos: "Excelente! MPB e Internacionais românticas esperando por você 💕",
    },
  },
  {
    id: 4,
    question: "Qual seu maior desafio ao estudar hoje?",
    options: [
      { value: "tempo", label: "Acompanhar o tempo da música", icon: "⏱️" },
      { value: "partituras", label: "Encontrar boas partituras", icon: "📄" },
      { value: "repertorio", label: "Montar um repertório variado", icon: "📚" },
      { value: "playback", label: "Tocar sem um playback de qualidade", icon: "🔊" },
    ],
  },
  {
    id: 5,
    question: "Quanto tempo por semana você dedica ao estudo?",
    options: [
      { value: "pouco", label: "Menos de 2 horas", icon: "⏰" },
      { value: "medio", label: "2 a 5 horas", icon: "📅" },
      { value: "muito", label: "Mais de 5 horas", icon: "🔥" },
    ],
  },
  {
    id: 6,
    question: "Você já tocou acompanhando um playback profissional?",
    options: [
      { value: "nunca", label: "Nunca tive acesso", icon: "❌" },
      { value: "poucas", label: "Poucas vezes, com dificuldade", icon: "😅" },
      { value: "sim", label: "Sim, faz toda diferença!", icon: "✅" },
    ],
  },
  {
    id: 7,
    question: "O que faria você praticar mais e evoluir mais rápido?",
    options: [
      { value: "acervo", label: "Um acervo enorme de músicas", icon: "📚" },
      { value: "playbacks", label: "Playbacks profissionais lado a lado", icon: "🎧" },
      { value: "interativo", label: "Partitura e playback rodando juntos", icon: "✨" },
      { value: "tudo", label: "Tudo isso junto!", icon: "🚀" },
    ],
  },
];

export const getDreamFeedback = (dream: DreamType): string => {
  const feedbacks: Record<DreamType, string> = {
    igreja: "Ótimo! Temos Gospel completo + Harpa Cristã 🙏",
    festas: "Perfeito! Nosso acervo de Flashback e Rock é imenso! 🎸",
    casamentos: "Excelente! MPB e Internacionais românticas esperando por você 💕",
  };
  return feedbacks[dream];
};

export const getPersonalizedHeadline = (dream: DreamType): string => {
  const headlines: Record<DreamType, string> = {
    igreja: "O Acervo Definitivo para o Saxofonista que quer brilhar na Igreja",
    festas: "O Acervo Definitivo para ser a estrela de qualquer churrasco ou festa",
    casamentos: "O Acervo Definitivo para o Saxofonista que quer tocar profissionalmente",
  };
  return headlines[dream];
};
