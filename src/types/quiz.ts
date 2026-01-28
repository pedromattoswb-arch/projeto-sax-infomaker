export type QuizLevel = 'iniciante' | 'intermediario' | 'experiente';
export type InstrumentType = 'alto' | 'tenor';
export type DreamType = 'prazer' | 'evolucao' | 'igreja' | 'churrascos' | 'profissional';

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
  style: string | null;
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
    question: "Há quanto tempo você toca saxofone?",
    options: [
      { value: "iniciante", label: "Estou começando agora (menos de 1 ano)", icon: "🌱" },
      { value: "intermediario", label: "Já toco há algum tempo (1-3 anos)", icon: "📈" },
      { value: "experiente", label: "Já tenho experiência (mais de 3 anos)", icon: "🎯" },
    ],
  },
  {
    id: 2,
    question: "Qual é o seu saxofone?",
    options: [
      { value: "alto", label: "Sax Alto", icon: "🎷" },
      { value: "tenor", label: "Sax Tenor", icon: "🎵" },
    ],
  },
  {
    id: 3,
    question: "O que te faz querer pegar o sax e tocar?",
    options: [
      { value: "prazer", label: "Tocar por prazer, relaxar e curtir", icon: "😊" },
      { value: "evolucao", label: "Evoluir e aprender músicas novas", icon: "🚀" },
      { value: "igreja", label: "Tocar na igreja e louvar", icon: "⛪" },
      { value: "churrascos", label: "Animar churrascos e reuniões com a família", icon: "🎉" },
      { value: "profissional", label: "Tocar profissionalmente em eventos", icon: "💼" },
    ],
    feedback: {
      prazer: "Que maravilha! Tocar por prazer é a essência da música. Temos músicas perfeitas para você curtir! 🎶",
      evolucao: "Você está no caminho certo! Nosso acervo vai acelerar demais sua evolução! 🚀",
      igreja: "Que lindo! Temos o acervo de Gospel mais completo, incluindo a Harpa Cristã inteira! 🙏",
      churrascos: "Adoro! Nada como impressionar a família. Nosso acervo de Flashback e Pop é imenso! 🎸",
      profissional: "Incrível! Temos MPB, Internacionais e tudo que você precisa para brilhar! ✨",
    },
  },
  {
    id: 4,
    question: "Que tipo de música faz seu coração bater mais forte?",
    options: [
      { value: "gospel", label: "Gospel e Hinos (Aline Barros, Harpa Cristã)", icon: "🙏" },
      { value: "mpb", label: "MPB e Brasileiras (Djavan, Roupa Nova)", icon: "🇧🇷" },
      { value: "pop", label: "Pop e Flashback (Michael Jackson, Bee Gees)", icon: "🕺" },
      { value: "rock", label: "Rock e Clássicos (Queen, Beatles)", icon: "🎸" },
    ],
  },
  {
    id: 5,
    question: "Qual a sua maior dificuldade hoje para estudar sax?",
    options: [
      { value: "partituras", label: "Encontrar partituras de qualidade é um pesadelo", icon: "😫" },
      { value: "playbacks", label: "Não tenho playbacks bons para acompanhar", icon: "🔇" },
      { value: "direcao", label: "Fico perdido sem saber o que estudar", icon: "🤔" },
      { value: "tempo", label: "Acompanhar o tempo da música é difícil", icon: "⏱️" },
    ],
  },
  {
    id: 6,
    question: "Você já tentou tocar acompanhando um playback profissional?",
    options: [
      { value: "nunca", label: "Nunca tive acesso a um de verdade", icon: "❌" },
      { value: "ruim", label: "Já tentei, mas era ruim e desisti", icon: "😅" },
      { value: "sim", label: "Sim, e faz toda diferença no estudo!", icon: "✅" },
    ],
  },
  {
    id: 7,
    question: "O que mudaria seu estudo de sax para melhor?",
    options: [
      { value: "acervo", label: "Ter milhares de músicas organizadas num só lugar", icon: "📚" },
      { value: "playbacks", label: "Playbacks profissionais para tocar junto", icon: "🎧" },
      { value: "interativo", label: "Ver a partitura e ouvir o áudio ao mesmo tempo", icon: "✨" },
      { value: "tudo", label: "Tudo isso junto seria o sonho!", icon: "🚀" },
    ],
  },
];

export const getDreamFeedback = (dream: DreamType): string => {
  const feedbacks: Record<DreamType, string> = {
    prazer: "Que maravilha! Tocar por prazer é a essência da música. Temos músicas perfeitas para você curtir! 🎶",
    evolucao: "Você está no caminho certo! Nosso acervo vai acelerar demais sua evolução! 🚀",
    igreja: "Que lindo! Temos o acervo de Gospel mais completo, incluindo a Harpa Cristã inteira! 🙏",
    churrascos: "Adoro! Nada como impressionar a família. Nosso acervo de Flashback e Pop é imenso! 🎸",
    profissional: "Incrível! Temos MPB, Internacionais e tudo que você precisa para brilhar! ✨",
  };
  return feedbacks[dream];
};

export const getPersonalizedHeadline = (dream: DreamType): string => {
  const headlines: Record<DreamType, string> = {
    prazer: "O acervo que vai transformar seus momentos com o sax",
    evolucao: "O arsenal que vai acelerar sua evolução no saxofone",
    igreja: "O acervo completo para você brilhar louvando",
    churrascos: "O repertório para você ser o destaque de qualquer momento",
    profissional: "O acervo profissional para elevar seu nível",
  };
  return headlines[dream];
};

export const getCategoryByDream = (dream: DreamType): string => {
  const categories: Record<DreamType, string> = {
    prazer: "suas músicas favoritas",
    evolucao: "repertório variado",
    igreja: "Gospel + Harpa Cristã",
    churrascos: "Flashback e Pop",
    profissional: "MPB e Internacionais",
  };
  return categories[dream];
};

export const getStyleByDream = (dream: DreamType): string => {
  const styles: Record<DreamType, string> = {
    prazer: "Pop e Flashback",
    evolucao: "repertório completo",
    igreja: "Gospel",
    churrascos: "Flashback e Rock",
    profissional: "MPB e Internacionais",
  };
  return styles[dream];
};
