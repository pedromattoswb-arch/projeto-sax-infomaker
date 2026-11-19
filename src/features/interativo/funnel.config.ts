export type SaxChoice = "alto" | "tenor";
export type MusicalStyleChoice = "gospel" | "jazz" | "pop-mpb" | "sertanejo";

export interface FunnelTrackPreview {
  title: string;
  artist: string;
  genre: string;
  styleKey: MusicalStyleChoice;
  accentFrom: string;
  accentTo: string;
  keyAlto: string;
  keyTenor: string;
}

export const FUNNEL_CONFIG = {
  flags: {
    ENABLE_STYLE_STEP: false,
    ENABLE_THREE_ENHANCEMENT: false,
  },

  meta: {
    title: "Clube do Sax | Experiência Interativa — +10.000 Partituras com Playback",
    description:
      "Viva a experiência do Clube do Sax: escolha seu sax Alto (Eb) ou Tenor (Bb), ouça a diferença com banda real e ative seu acervo com +10.000 partituras e playbacks.",
  },

  links: {
    checkoutPremium: "https://pay.wiapy.com/jyPuib6Uivrl",
    checkoutEssential: "https://pay.wiapy.com/PTslvctv1QE6",
    studentLogin: "https://app.clubedosax.com/login",
    termsUrl: "/termos-de-uso",
    privacyUrl: "/politica-de-privacidade",
  },

  metrics: {
    totalPartituras: 10000,
    totalBasicPartituras: 5000,
    activeStudents: 847,
    genresCount: 18,
    harpaCount: 640,
    ratingValue: "4.9/5",
    premiumOriginalPrice: 197.0,
    premiumPrice: 24.9,
    premiumDiscountPct: 87,
    basicPrice: 14.9,
    bonusTotalValue: 141.0,
    bonusValues: [47, 57, 37] as const,
    guaranteeDays: 7,
    premiumAdoptionPct: 94,
    priceDiffReais: 10,
  },

  assets: {
    /** TODO: substitua se tiver fotos recortadas de estúdio (>= 1200px, fundo transparente) */
    saxAltoImage: "/interativo/images/sax-alto.webp",
    saxTenorImage: "/interativo/images/sax-tenor.webp",
    saxAltoGlb: "/interativo/models/sax-alto.glb",
    saxTenorGlb: "/interativo/models/sax-tenor.glb",
    /** TODO: substitua pela sua textura de fumaça em loop se preferir (<= 150 KB) */
    smokeTexture: "/interativo/fx/smoke-loop.webp",
  },

  audio: {
    bpm: 84,
    loopBars: 4,
    defaultVolume: 0.85,
    stingerUrl: "/interativo/audio/stage-stinger.wav",
    saxAltoCueUrl: "/interativo/audio/sax-alto-cue.wav",
    saxTenorCueUrl: "/interativo/audio/sax-tenor-cue.wav",
    soloDryUrl: "/interativo/audio/scene3-solo-dry.wav",
    soloBandUrl: "/interativo/audio/scene3-full-band.wav",
    libraryReadyChimeUrl: "/interativo/audio/library-ready-chime.wav",
    ambientStageUrl: "",
  },

  copy: {
    global: {
      soundOnLabel: "Áudio ativado",
      soundOffLabel: "Silenciado",
      soundLockedLabel: "Ativar som",
      soundInterruptedLabel: "Reativar som",
      audioSubtleHint: "Verifique se o volume do seu aparelho está ligado.",
      recoveryMessage: "Precisamos reativar o áudio para continuar sua experiência.",
      recoveryCta: "REATIVAR SOM",
      continueMutedCta: "Continuar sem som",
    },
    scene1: {
      eyebrow: "PASSO 1 DE 3 • EXPERIÊNCIA SONORA",
      headline: "Sua experiência está prestes a começar!",
      subtitle: "Para aproveitar todas as etapas, cenas e narrações, ative o som do seu dispositivo.",
      ctaPill: "ATIVAR SOM E COMEÇAR",
      idleHint: "Toque em ATIVAR SOM E COMEÇAR",
      preparingLabel: "Preparando áudio…",
      activatedLabel: "Áudio ativado • Iniciando experiência…",
      errorTitle: "Não foi possível iniciar o áudio.",
      retryLabel: "Toque para tentar novamente",
    },
    scene2: {
      eyebrow: "PASSO 2 DE 3 • TOQUE NO SEU SAX",
      headline: "Qual é o seu sax?",
      subtitle: "Toque abaixo para calibrar todas as partituras e playbacks para o seu tom.",
      altoLabel: "ALTO",
      altoSub: "Mi bemol (Eb)",
      altoAction: "Escolher Alto",
      tenorLabel: "TENOR",
      tenorSub: "Si bemol (Bb)",
      tenorAction: "Escolher Tenor",
      adjustingTemplate: (sax: SaxChoice) =>
        `Ajustando todas as partituras para o seu tom (${sax === "alto" ? "Eb" : "Bb"})…`,
      idleHint: "Toque no Alto ou no Tenor para avançar",
    },
    scene3: {
      eyebrow: "PASSO 3 DE 3 • ARRASTE PARA OUVIR",
      leftLabel: "Sozinho",
      rightLabel: "Com banda",
      sliderGuide: "Deslize a alça dourada para a direita",
      sliderPrompt: "Arraste para a direita →",
      lockedHeadline: "É assim que você vai soar.",
      lockedSub: "Banda de estúdio + partitura revisada na mesma tela.",
      ctaLabel: "Quero tocar assim",
      silentNotice: "Aumente o volume do celular para ouvir a diferença",
      idleHint: "Arraste ou toque no lado direito da barra",
    },
    scene4: {
      eyebrow: "MONTANDO SEU ACERVO VIP",
      headlineTemplate: (sax: SaxChoice) =>
        `Preparando seu palco para Sax ${sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)"}`,
      badgeReadyTemplate: (sax: SaxChoice) =>
        `Acervo Sax ${sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)"} · Pronto para ativar`,
      subCredential: "Acesso vitalício • Login enviado no e-mail na mesma hora",
    },
    scene5: {
      heroSubtitleTemplate: (sax: SaxChoice) =>
        `Você acabou de sentir a diferença entre treinar sozinho e tocar com banda real. Transforme seu celular, tablet ou PC em um verdadeiro Netflix & Spotify do Saxofonista com +10.000 partituras profissionais calibradas para ${
          sax === "alto" ? "Sax Alto (Eb) (com Tenor Bb também incluso)" : "Sax Tenor (Bb) (com Alto Eb também incluso)"
        }, busca por voz e acesso imediato enviado direto no seu e-mail!`,
      primaryCta: "ATIVAR MEU ACERVO IMEDIATO",
    },
  },

  scene4ShowcaseSongs: [
    { title: "Careless Whisper", artist: "George Michael", genre: "Pop & Romântico", styleKey: "pop-mpb", accentFrom: "#9333ea", accentTo: "#4c0519", keyAlto: "Bm", keyTenor: "Em" },
    { title: "Garota de Ipanema", artist: "Tom Jobim", genre: "Bossa & Jazz", styleKey: "jazz", accentFrom: "#059669", accentTo: "#022c22", keyAlto: "D", keyTenor: "G" },
    { title: "Sobre as Águas", artist: "Davi Sacer", genre: "Gospel & Louvor", styleKey: "gospel", accentFrom: "#0d9488", accentTo: "#042f2e", keyAlto: "E", keyTenor: "A" },
    { title: "Your Latest Trick", artist: "Dire Straits", genre: "Rock & Jazz", styleKey: "jazz", accentFrom: "#d97706", accentTo: "#1c1917", keyAlto: "G", keyTenor: "C" },
    { title: "Sozinho", artist: "Caetano Veloso", genre: "MPB & Brasil", styleKey: "pop-mpb", accentFrom: "#0284c7", accentTo: "#082f49", keyAlto: "F#", keyTenor: "B" },
    { title: "Boate Azul", artist: "Clássico Sertanejo", genre: "Sertanejo & Seresta", styleKey: "sertanejo", accentFrom: "#ca8a04", accentTo: "#1c1306", keyAlto: "C#m", keyTenor: "F#m" },
    { title: "Espírito, Espírito", artist: "Harpa & Adoração", genre: "Gospel & Harpa", styleKey: "gospel", accentFrom: "#16a34a", accentTo: "#052e16", keyAlto: "D", keyTenor: "G" },
    { title: "Endless Love", artist: "Lionel Richie & Diana Ross", genre: "Casamentos & Eventos", styleKey: "pop-mpb", accentFrom: "#e11d48", accentTo: "#1f0910", keyAlto: "G", keyTenor: "C" },
    { title: "Evidências", artist: "Chitãozinho & Xororó", genre: "Sertanejo Raiz", styleKey: "sertanejo", accentFrom: "#ea580c", accentTo: "#1a0b05", keyAlto: "C#", keyTenor: "F#" },
    { title: "Wave", artist: "Tom Jobim", genre: "Jazz & Bossa", styleKey: "jazz", accentFrom: "#4f46e5", accentTo: "#0f0d2e", keyAlto: "B", keyTenor: "E" },
    { title: "Tudo É Possível", artist: "Davi Sacer", genre: "Gospel & Adoração", styleKey: "gospel", accentFrom: "#10b981", accentTo: "#064e3b", keyAlto: "A", keyTenor: "D" },
    { title: "Over The Rainbow", artist: "Clássico Internacional", genre: "Cinema & Standards", styleKey: "jazz", accentFrom: "#c026d3", accentTo: "#240626", keyAlto: "F", keyTenor: "Bb" },
  ] as FunnelTrackPreview[],
} as const;
