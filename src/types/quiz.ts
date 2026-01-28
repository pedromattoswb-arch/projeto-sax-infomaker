export type QuizLevel = 'iniciante' | 'intermediario' | 'profissional';
export type InstrumentType = 'alto' | 'tenor';
export type DreamType = 'igreja' | 'festas' | 'casamentos' | 'prazer' | 'evolucao';

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
      { value: "iniciante", label: "Estou começando agora", icon: "🌱" },
      { value: "intermediario", label: "Já toco algumas músicas", icon: "📈" },
      { value: "profissional", label: "Toco há bastante tempo", icon: "🎯" },
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
    question: "O que mais te motiva a tocar saxofone?",
    options: [
      { value: "prazer", label: "Tocar por prazer e diversão", icon: "😊" },
      { value: "evolucao", label: "Evoluir e aprender músicas novas", icon: "🚀" },
      { value: "igreja", label: "Louvar e tocar na Igreja", icon: "⛪" },
      { value: "festas", label: "Animar festas, churrascos e reuniões", icon: "🎉" },
      { value: "casamentos", label: "Tocar em eventos e casamentos", icon: "💒" },
    ],
    feedback: {
      prazer: "Maravilha! Temos músicas incríveis para você curtir! 🎶",
      evolucao: "Perfeito! Nosso acervo vai acelerar sua evolução! 📈",
      igreja: "Ótimo! Temos Gospel completo + Harpa Cristã 🙏",
      festas: "Perfeito! Nosso acervo de Flashback e Rock é imenso! 🎸",
      casamentos: "Excelente! MPB e Internacionais românticas esperando por você 💕",
    },
  },
  {
    id: 4,
    question: "Qual estilo musical você mais gosta de tocar?",
    options: [
      { value: "gospel", label: "Gospel e Hinos", icon: "🙏" },
      { value: "mpb", label: "MPB e Brasileiras", icon: "🇧🇷" },
      { value: "internacional", label: "Pop e Internacionais", icon: "🌎" },
      { value: "classicos", label: "Flashback e Clássicos", icon: "🕺" },
    ],
  },
  {
    id: 5,
    question: "Qual seu maior desafio ao estudar hoje?",
    options: [
      { value: "tempo", label: "Acompanhar o tempo da música", icon: "⏱️" },
      { value: "partituras", label: "Encontrar boas partituras", icon: "📄" },
      { value: "repertorio", label: "Montar um repertório variado", icon: "📚" },
      { value: "playback", label: "Tocar sem um playback de qualidade", icon: "🔊" },
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
    prazer: "Maravilha! Temos músicas incríveis para você curtir! 🎶",
    evolucao: "Perfeito! Nosso acervo vai acelerar sua evolução! 📈",
    igreja: "Ótimo! Temos Gospel completo + Harpa Cristã 🙏",
    festas: "Perfeito! Nosso acervo de Flashback e Rock é imenso! 🎸",
    casamentos: "Excelente! MPB e Internacionais românticas esperando por você 💕",
  };
  return feedbacks[dream];
};

export const getPersonalizedHeadline = (dream: DreamType): string => {
  const headlines: Record<DreamType, string> = {
    prazer: "O Acervo Perfeito para Quem Ama Tocar Saxofone",
    evolucao: "O Acervo Definitivo para Acelerar sua Evolução no Sax",
    igreja: "O Acervo Definitivo para o Saxofonista que quer Brilhar na Igreja",
    festas: "O Acervo Definitivo para Ser a Estrela de Qualquer Momento",
    casamentos: "O Acervo Definitivo para Tocar em Eventos Inesquecíveis",
  };
  return headlines[dream];
};
