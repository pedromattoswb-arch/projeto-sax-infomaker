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
  /** Feature flags */
  flags: {
    /** Cena opcional de escolha de estilo entre Cenas 2 e 3 (desligada por padrão) */
    ENABLE_STYLE_STEP: false,
    /** Habilita Three.js lazy caso um arquivo .glb otimizado seja colocado em public/interativo/models/ */
    ENABLE_THREE_ENHANCEMENT: false,
  },

  /** Meta tags (espelhadas de /lp-3) */
  meta: {
    title: "Clube do Sax | Experiência Interativa — +10.000 Partituras com Playback",
    description:
      "Viva a experiência do Clube do Sax: escolha seu sax Alto (Eb) ou Tenor (Bb), ouça a diferença com banda real e ative seu acervo com +10.000 partituras e playbacks.",
  },

  /** Links oficiais (idênticos a /lp-3 — nunca alterar sem atualizar a oferta) */
  links: {
    checkoutPremium: "https://pay.wiapy.com/jyPuib6Uivrl",
    checkoutEssential: "https://pay.wiapy.com/PTslvctv1QE6",
    studentLogin: "https://app.clubedosax.com/login",
    termsUrl: "/termos-de-uso",
    privacyUrl: "/politica-de-privacidade",
  },

  /** Números reais exclusivamente de /lp-3 (zero números inventados) */
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

  /** Assets visuais e sonoros (caminhos marcados com TODO para substituição por estúdio quando desejar) */
  assets: {
    /** TODO: substitua se tiver fotos recortadas de estúdio (>= 1200px, fundo transparente) */
    saxAltoImage: "/interativo/images/sax-alto.webp",
    saxTenorImage: "/interativo/images/sax-tenor.webp",
    /** TODO: opcional — coloque um .glb Draco (<= 1.5 MB) e ligue ENABLE_THREE_ENHANCEMENT */
    saxAltoGlb: "/interativo/models/sax-alto.glb",
    saxTenorGlb: "/interativo/models/sax-tenor.glb",
    /** TODO: substitua pela sua textura de fumaça em loop se preferir (<= 150 KB) */
    smokeTexture: "/interativo/fx/smoke-loop.webp",
  },

  /** Configuração do motor de áudio (BPM e caminhos opcionais de MP3s <= 250 KB) */
  audio: {
    bpm: 84,
    loopBars: 4,
    /**
     * TODO: Quando gravar seus loops finais em MP3 (128kbps, <= 250KB, mesmo BPM e duração),
     * coloque-os em public/interativo/audio/ e preencha os caminhos abaixo (ex.: "/interativo/audio/solo-seco.mp3").
     * Enquanto vazios (""), o AudioEngine sintetiza localmente via Web Audio API um solo de sax seco
     * e o mesmo solo com banda de jazz completa perfeitamente sincronizados — zero erro e 0 KB de rede.
     */
    stingerUrl: "",
    soloDryUrl: "",
    soloBandUrl: "",
    ambientStageUrl: "",
  },

  /** Textos de todas as cenas (centralizados para facilitar testes A/B) */
  copy: {
    global: {
      skipToOffer: "Ir para a oferta",
      soundOnLabel: "Som ativo",
      soundOffLabel: "Som mudo",
    },
    scene1: {
      eyebrow: "EXPERIÊNCIA CLUBE DO SAX",
      headline: "Toque no sax e ligue o som.",
      /** TODO: alinhe este subtítulo curto diretamente ao gancho do criativo do seu anúncio */
      subtitle: "Sinta em 20 segundos a diferença entre treinar sozinho e tocar com uma banda real.",
      soundHint: "🔊 Melhor com som",
      idleHint: "Toque em qualquer ponto da tela",
    },
    scene2: {
      eyebrow: "AFINAÇÃO AUTOMÁTICA",
      headline: "Qual é o seu sax?",
      subtitle: "Todas as partituras e playbacks já vêm prontos para o seu instrumento.",
      altoLabel: "ALTO",
      altoSub: "Mi bemol (Eb)",
      tenorLabel: "TENOR",
      tenorSub: "Si bemol (Bb)",
      adjustingTemplate: (sax: SaxChoice) =>
        `Ajustando todas as partituras para o seu tom (${sax === "alto" ? "Eb" : "Bb"})…`,
      idleHint: "Toque no seu sax para continuar",
    },
    scene3: {
      eyebrow: "A TRANSFORMAÇÃO EM TEMPO REAL",
      leftLabel: "Sozinho",
      rightLabel: "Com banda",
      sliderPrompt: "Arraste →",
      lockedHeadline: "É assim que você vai soar.",
      lockedSub: "Banda de estúdio + partitura revisada na mesma tela.",
      ctaLabel: "Quero tocar assim",
      silentNotice: "Ative o som e tire do modo silencioso para ouvir a diferença",
      idleHint: "Arraste a alça dourada para a direita",
    },
    scene4: {
      eyebrow: "PREPARANDO SEU PALCO",
      headlineTemplate: (sax: SaxChoice) =>
        `Montando seu acervo para Sax ${sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)"}`,
      badgeReadyTemplate: (sax: SaxChoice) =>
        `Acervo Sax ${sax === "alto" ? "Alto" : "Tenor"} · Pronto para ativar`,
      subCredential: "Acesso vitalício • Login enviado no e-mail na mesma hora",
    },
    scene5: {
      heroHeadlineTemplate: (sax: SaxChoice) =>
        `Seu acervo de Sax ${sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)"} está pronto.`,
      heroSubtitleTemplate: (sax: SaxChoice) =>
        `Você acabou de sentir a diferença de sair do estudo seco para tocar com banda real. Ative agora seu acesso vitalício com +10.000 partituras e playbacks de estúdio já prontos para ${
          sax === "alto" ? "Sax Alto (Eb) — com Tenor (Bb) também incluso" : "Sax Tenor (Bb) — com Alto (Eb) também incluso"
        }.`,
      primaryCta: "Ativar meu acervo",
      vipCta: "Ativar meu acervo VIP",
      basicCta: "Ativar Plano Básico (R$ 14,90)",
    },
  },

  /** Músicas reais do catálogo oficial (catalogSongs.ts) usadas na cascata 3D da Cena 4 (TODO: personalize a ordem se quiser) */
  scene4ShowcaseSongs: [
    {
      title: "Careless Whisper",
      artist: "George Michael",
      genre: "Pop & Romântico",
      styleKey: "pop-mpb",
      accentFrom: "#9333ea",
      accentTo: "#4c0519",
      keyAlto: "Bm",
      keyTenor: "Em",
    },
    {
      title: "Garota de Ipanema",
      artist: "Tom Jobim",
      genre: "Bossa & Jazz",
      styleKey: "jazz",
      accentFrom: "#059669",
      accentTo: "#022c22",
      keyAlto: "D",
      keyTenor: "G",
    },
    {
      title: "Sobre as Águas",
      artist: "Davi Sacer",
      genre: "Gospel & Louvor",
      styleKey: "gospel",
      accentFrom: "#0d9488",
      accentTo: "#042f2e",
      keyAlto: "E",
      keyTenor: "A",
    },
    {
      title: "Your Latest Trick",
      artist: "Dire Straits",
      genre: "Rock & Jazz",
      styleKey: "jazz",
      accentFrom: "#d97706",
      accentTo: "#1c1917",
      keyAlto: "G",
      keyTenor: "C",
    },
    {
      title: "Sozinho",
      artist: "Caetano Veloso",
      genre: "MPB & Brasil",
      styleKey: "pop-mpb",
      accentFrom: "#0284c7",
      accentTo: "#082f49",
      keyAlto: "F#",
      keyTenor: "B",
    },
    {
      title: "Boate Azul",
      artist: "Clássico Sertanejo",
      genre: "Sertanejo & Seresta",
      styleKey: "sertanejo",
      accentFrom: "#ca8a04",
      accentTo: "#1c1306",
      keyAlto: "C#m",
      keyTenor: "F#m",
    },
    {
      title: "Espírito, Espírito",
      artist: "Harpa & Adoração",
      genre: "Gospel & Harpa",
      styleKey: "gospel",
      accentFrom: "#16a34a",
      accentTo: "#052e16",
      keyAlto: "D",
      keyTenor: "G",
    },
    {
      title: "Endless Love",
      artist: "Lionel Richie & Diana Ross",
      genre: "Casamentos & Eventos",
      styleKey: "pop-mpb",
      accentFrom: "#e11d48",
      accentTo: "#1f0910",
      keyAlto: "G",
      keyTenor: "C",
    },
    {
      title: "Evidências",
      artist: "Chitãozinho & Xororó",
      genre: "Sertanejo Raiz",
      styleKey: "sertanejo",
      accentFrom: "#ea580c",
      accentTo: "#1a0b05",
      keyAlto: "C#",
      keyTenor: "F#",
    },
    {
      title: "Wave",
      artist: "Tom Jobim",
      genre: "Jazz & Bossa",
      styleKey: "jazz",
      accentFrom: "#4f46e5",
      accentTo: "#0f0d2e",
      keyAlto: "B",
      keyTenor: "E",
    },
    {
      title: "Tudo É Possível",
      artist: "Davi Sacer",
      genre: "Gospel & Adoração",
      styleKey: "gospel",
      accentFrom: "#10b981",
      accentTo: "#064e3b",
      keyAlto: "A",
      keyTenor: "D",
    },
    {
      title: "Over The Rainbow",
      artist: "Clássico Internacional",
      genre: "Cinema & Standards",
      styleKey: "jazz",
      accentFrom: "#c026d3",
      accentTo: "#240626",
      keyAlto: "F",
      keyTenor: "Bb",
    },
  ] as FunnelTrackPreview[],
} as const;
