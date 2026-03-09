import { ArrowLeft, Download, CheckCircle2, Star, Lightbulb, Printer, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo-clube-sax.webp";
import { generateDigitacaoPDF } from "@/lib/pdfGenerators";

/* ─── DADOS ─── */

const registros = [
  {
    id: "grave",
    titulo: "Registro Grave",
    subtitulo: "Sib grave → Sol",
    emoji: "🔵",
    cor: "from-blue-600 to-blue-800",
    corBadge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    descricaoGeral: "O alicerce do som. Trabalhe embocadura relaxada e ar quente para um grave cheio e ressonante.",
    notas: [
      { nota: "Sib (Bb)", chaves: "Todas fechadas + Sib (pinky esquerdo)", dica: "Nota mais grave do sax. Sopro lento e apoio firme do diafragma." },
      { nota: "Si (B)", chaves: "Todas fechadas (sem Sib)", dica: "Embocadura bem aberta, garganta relaxada como um bocejo." },
      { nota: "Dó (C)", chaves: "ME: 1ª, 2ª, 3ª | MD: 1ª, 2ª, 3ª", dica: "Mantenha os dedos próximos às chaves mesmo quando não pressionados." },
      { nota: "Dó# (C#)", chaves: "ME: 1ª, 2ª, 3ª | MD: 1ª, 2ª, 3ª + Dó# (pinky direito)", dica: "Use o pinky sem tensão — apenas o peso do dedo." },
      { nota: "Ré (D)", chaves: "ME: 1ª, 2ª, 3ª | MD: 1ª, 2ª", dica: "Primeira nota que muitos iniciantes aprendem. Referência de afinação." },
      { nota: "Mib (Eb)", chaves: "ME: 1ª, 2ª, 3ª | MD: 1ª", dica: "Levante apenas o dedo 3 da mão direita — mínimo movimento." },
      { nota: "Mi (E)", chaves: "ME: 1ª, 2ª, 3ª | MD: nenhuma", dica: "Transição Mi→Fá é uma das mais usadas — pratique lenta." },
      { nota: "Fá (F)", chaves: "ME: 1ª, 2ª | MD: nenhuma", dica: "Embocadura começa a ficar mais neutra nessa região." },
      { nota: "Fá# (F#)", chaves: "ME: 1ª, 3ª | MD: nenhuma (ou chave auxiliar)", dica: "O 'salto' do dedo 2 para o 3 requer prática para fluência." },
      { nota: "Sol (G)", chaves: "ME: 1ª | MD: nenhuma", dica: "Nota aberta — só o dedo 1 da mão esquerda. Boa para calibrar embocadura." },
      { nota: "Sol# (G#)", chaves: "ME: 1ª + Sol# (pinky esquerdo)", dica: "O pinky pressiona a chave lateral. Pratique independência do pinky." },
    ],
  },
  {
    id: "medio",
    titulo: "Registro Médio (com oitava)",
    subtitulo: "Lá → Dó#",
    emoji: "🟢",
    cor: "from-emerald-600 to-emerald-800",
    corBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    descricaoGeral: "Mesmas digitações do grave, mas com a chave de oitava pressionada. É o registro de referência — calibre sua afinação aqui.",
    notas: [
      { nota: "Lá (A)", chaves: "Oitava + ME: 1ª, 2ª, 3ª | MD: 1ª, 2ª, 3ª", dica: "Primeira nota com oitava. Mantenha a pressão do polegar constante." },
      { nota: "Sib (Bb)", chaves: "Oitava + mesma digitação de Sib grave", dica: "Use a chave Bis para transições rápidas de Lá para Sib." },
      { nota: "Si (B)", chaves: "Oitava + todas fechadas (sem Sib)", dica: "A oitava muda automaticamente — confie no mecanismo." },
      { nota: "Dó (C)", chaves: "Oitava + ME: 1ª, 2ª, 3ª | MD: 1ª, 2ª, 3ª", dica: "Compare a afinação com o Dó grave. Devem soar em oitava perfeita." },
      { nota: "Dó# (C#)", chaves: "Oitava + ME: 1ª, 2ª, 3ª | MD: 1ª, 2ª, 3ª + Dó#", dica: "Nota de transição para o registro agudo. Embocadura levemente mais firme." },
    ],
  },
  {
    id: "agudo",
    titulo: "Registro Agudo",
    subtitulo: "Ré → Fá#",
    emoji: "🟡",
    cor: "from-amber-500 to-amber-700",
    corBadge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    descricaoGeral: "Aqui as digitações mudam — usam as palm keys (chaves laterais da mão esquerda). Ar mais rápido e direcionado.",
    notas: [
      { nota: "Ré (D)", chaves: "Oitava + Palm D (chave lateral superior ME)", dica: "Primeira palm key. Pressione com a lateral da mão, não com a ponta do dedo." },
      { nota: "Mib (Eb)", chaves: "Oitava + Palm D + Palm Eb", dica: "Duas palm keys juntas. Relaxe o punho para alcançar ambas." },
      { nota: "Mi (E)", chaves: "Oitava + Palm D + Palm Eb + Palm F (ou Side E)", dica: "Nota aguda que exige bastante ar. Apoie forte com o diafragma." },
      { nota: "Fá (F)", chaves: "Oitava + todas as palm keys ou Front F", dica: "O Front F (chave frontal) é mais ágil em passagens rápidas." },
      { nota: "Fá# (F#)", chaves: "Oitava + Fá# auxiliar (chave específica) ou Front F + ajuste", dica: "Nota mais aguda do registro 'normal'. A partir daqui é altíssimo." },
    ],
  },
  {
    id: "altissimo",
    titulo: "Registro Altíssimo",
    subtitulo: "Sol → Dó (acima)",
    emoji: "🔴",
    cor: "from-red-600 to-red-800",
    corBadge: "bg-red-500/10 text-red-400 border-red-500/20",
    descricaoGeral: "Território avançado. Requer embocadura desenvolvida, controle de harmônicos e muita prática. As digitações variam entre setups.",
    notas: [
      { nota: "Sol (G)", chaves: "Front F + ME: 1ª, 3ª | MD: nenhuma", dica: "Comece praticando o harmônico de Sol a partir do Dó grave — mesma embocadura." },
      { nota: "Sol# (G#)", chaves: "Front F + ME: 1ª + chave lateral", dica: "Garganta muito estreita. Pense em assobiar a nota antes de tocar." },
      { nota: "Lá (A)", chaves: "Front F + ME: 2ª | MD: 1ª, 2ª", dica: "Uma das altíssimas mais estáveis. Use como referência para encontrar as outras." },
      { nota: "Sib (Bb)", chaves: "Front F + ME: 1ª, 3ª | MD: 1ª", dica: "Ar extremamente rápido. Embocadura firme mas não tensa." },
      { nota: "Si (B)", chaves: "Front F + ME: 2ª, 3ª | MD: 2ª", dica: "Nota difícil de estabilizar. Pratique notas longas nessa digitação." },
      { nota: "Dó (C)", chaves: "Front F + ME: 1ª | MD: 2ª, 3ª", dica: "Topo do altíssimo usual. Poucos saxofonistas dominam com consistência." },
    ],
  },
];

const digitacoesAlternativas = [
  {
    titulo: "Bis Key (Sib)",
    contexto: "Passagens Lá → Sib → Lá",
    como: "Pressione a chave Bis (entre 1ª e 2ª da ME) em vez do pinky. O dedo 1 rola levemente para baixo.",
    quando: "Sempre que Sib aparece entre Lá e outra nota da mão esquerda. Muito mais ágil.",
  },
  {
    titulo: "Side C (Dó agudo)",
    contexto: "Passagens rápidas no agudo envolvendo Dó",
    como: "Use a chave lateral de Dó (lado direito do sax) em vez da digitação padrão com oitava.",
    quando: "Em sequências rápidas tipo Si→Dó→Ré no registro agudo. Elimina movimentos desnecessários.",
  },
  {
    titulo: "Side Bb (Sib agudo)",
    contexto: "Alternativa ao Sib com oitava",
    como: "Chave lateral de Sib (stack lateral direito).",
    quando: "Útil em trinados e passagens cromáticas no registro agudo.",
  },
  {
    titulo: "Fork F (Fá com forquilha)",
    contexto: "Passagens Mib → Fá → Mib",
    como: "ME: 1ª, 3ª (sem a 2ª) — a 'forquilha'. Resulta no mesmo Fá.",
    quando: "Quando Fá está entre notas que já usam 1ª e 3ª. Evita levantar e abaixar o dedo 2.",
  },
  {
    titulo: "Trinado Ré-Mib (Side Key)",
    contexto: "Trinados e ornamentos",
    como: "Segure a digitação de Ré e toque a chave de trinado lateral com o dedo indicador da MD.",
    quando: "Qualquer trinado entre Ré e Mib — muito mais fluido que alternar as digitações normais.",
  },
  {
    titulo: "Front F (Fá agudo alternativo)",
    contexto: "Fá agudo em passagens rápidas",
    como: "Use a chave frontal (Front F) acima da chave de Si, pressionada com o dedo indicador da ME.",
    quando: "Em passagens rápidas no agudo. Mais ágil que as palm keys tradicionais.",
  },
];

const dicasEmbocadura = [
  {
    registro: "Grave",
    emoji: "🔵",
    cor: "border-blue-500/30 bg-blue-500/5",
    dicas: [
      "Mandíbula relaxada e mais aberta — garganta como se bocejasse",
      "Mais palheta dentro da boca para volume e ressonância",
      "Sopro quente e lento — pense na vogal 'Ó' bem aberta",
      "Apoio firme do diafragma sem tensão na garganta",
      "Se a nota 'guincha', você está apertando demais",
    ],
  },
  {
    registro: "Médio",
    emoji: "🟢",
    cor: "border-emerald-500/30 bg-emerald-500/5",
    dicas: [
      "Embocadura neutra — nem muito apertada nem relaxada",
      "Foco na coluna de ar constante e centrada",
      "Língua em posição natural, levemente curvada para cima",
      "Este é o registro de referência — calibre afinação aqui",
      "Pratique notas longas neste registro para 'encontrar seu som'",
    ],
  },
  {
    registro: "Agudo",
    emoji: "🟡",
    cor: "border-amber-500/30 bg-amber-500/5",
    dicas: [
      "Mandíbula levemente mais fechada — pressão sutil e uniforme",
      "Sopro mais rápido e direcionado — pense na vogal 'I' estreita",
      "Menos palheta na boca que no registro grave",
      "Cuidado: excesso de pressão do lábio inferior = som estridente",
      "Use o ouvido — se está desafinado, ajuste a embocadura, não a força",
    ],
  },
  {
    registro: "Altíssimo",
    emoji: "🔴",
    cor: "border-red-500/30 bg-red-500/5",
    dicas: [
      "Garganta muito estreita — como assobiar uma nota aguda",
      "Ar extremamente rápido com apoio máximo do diafragma",
      "Embocadura firme mas nunca tensa — tensão mata o som",
      "Pratique harmônicos naturais primeiro (overtones)",
      "Comece pelo Sol altíssimo e vá subindo nota por nota",
    ],
  },
];

const exerciciosPreparacaoAltissimo = [
  {
    titulo: "Exercício 1 — Harmônicos do Sib grave",
    passos: [
      "Toque Sib grave normalmente",
      "Sem mudar a digitação, tente fazer soar Sib uma oitava acima",
      "Depois tente Fá (quinta acima do Sib oitavado)",
      "Depois Sib duas oitavas acima",
      "O controle que você desenvolve aqui é o mesmo usado no altíssimo",
    ],
  },
  {
    titulo: "Exercício 2 — Harmônicos do Si grave",
    passos: [
      "Repita o mesmo processo partindo do Si grave",
      "Si grave → Si oitava → Fá# → Si duas oitavas",
      "Cada fundamental gera uma série harmônica diferente",
    ],
  },
  {
    titulo: "Exercício 3 — Conexão com digitação altíssima",
    passos: [
      "Toque o harmônico de Sol (partindo do Dó grave)",
      "Quando o harmônico estiver estável, mude para a digitação altíssima de Sol",
      "O som deve continuar — mesma embocadura, mesma garganta",
      "Repita para Sol#, Lá, etc.",
    ],
  },
];

/* ─── COMPONENTES ─── */

const RegistroSection = ({ registro }: { registro: typeof registros[0] }) => {
  const [aberto, setAberto] = useState(true);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header do registro com gradiente */}
      <button
        onClick={() => setAberto(!aberto)}
        className={`w-full bg-gradient-to-r ${registro.cor} p-5 md:p-6 flex items-center justify-between text-white cursor-pointer hover:opacity-95 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{registro.emoji}</span>
          <div className="text-left">
            <h2 className="text-lg md:text-xl font-bold font-heading">{registro.titulo}</h2>
            <p className="text-white/70 text-xs font-body">{registro.subtitulo}</p>
          </div>
        </div>
        {aberto ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {aberto && (
        <div className="p-5 md:p-6">
          {/* Descrição geral */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border mb-5">
            <p className="text-sm font-body text-foreground flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              {registro.descricaoGeral}
            </p>
          </div>

          {/* Cards de notas individuais */}
          <div className="space-y-3">
            {registro.notas.map((n, i) => (
              <div key={i} className="rounded-xl border border-border p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold font-heading text-base text-foreground">{n.nota}</h3>
                  <span className={`text-[10px] font-bold font-heading px-2 py-0.5 rounded-full border ${registro.corBadge}`}>
                    {registro.id.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-body text-foreground">
                    <strong className="text-muted-foreground">Chaves:</strong> {n.chaves}
                  </p>
                  <p className="text-xs font-body text-primary/80 italic">
                    💡 {n.dica}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── PÁGINA ─── */

const OrderBumpDigitacao = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <span className="font-heading font-bold text-sm text-primary">SaxPlay</span>
        </div>
      </header>

      <main className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
              <span className="text-4xl">🎹</span>
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              GUIA PROFISSIONAL • 26+ PÁGINAS
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Tabela de Digitação Completa
            </h1>
            <p className="text-lg md:text-xl font-heading font-bold text-primary mb-2">
              Sax Alto & Tenor — Inclui Altíssimas
            </p>
            <p className="text-muted-foreground font-body text-base max-w-2xl mx-auto">
              Nunca mais erre uma nota. Cada digitação com instrução de chaves, dica de embocadura e contexto prático — do Sib grave ao Dó altíssimo.
            </p>
          </div>

          {/* O que está incluído */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
            <h3 className="font-bold font-heading text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              O que está incluído neste guia:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "27 notas do registro normal",
                "6 notas altíssimas",
                "6 digitações alternativas",
                "Dicas por registro",
                "Exercícios de harmônicos",
                "PDF para imprimir",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-body text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-center mb-10 shadow-lg shadow-violet-500/15">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Printer className="w-5 h-5 text-white/80" />
              <h3 className="text-white font-bold font-heading text-lg">Baixar Guia Completo em PDF</h3>
            </div>
            <p className="text-white/70 text-sm font-body mb-4">26+ páginas • Imprima e cole na estante do sax • Consulta rápida para sempre</p>
            <button
              onClick={generateDigitacaoPDF}
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-5 h-5" />
              BAIXAR PDF COMPLETO
            </button>
          </div>

          {/* REGISTROS — cada um com accordion */}
          <div className="space-y-4 mb-8">
            <h2 className="text-center font-heading font-bold text-lg text-muted-foreground uppercase tracking-wider text-xs mb-2">
              — Digitações por Registro —
            </h2>
            {registros.map((reg) => (
              <RegistroSection key={reg.id} registro={reg} />
            ))}
          </div>

          {/* Digitações Alternativas */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-5 md:p-6">
              <div className="flex items-center gap-3 text-white">
                <Star className="w-6 h-6" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold font-heading">Digitações Alternativas</h2>
                  <p className="text-white/70 text-xs font-body">Para passagens rápidas, trinados e transições difíceis</p>
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6 space-y-4">
              <p className="text-sm font-body text-muted-foreground">
                As digitações padrão nem sempre são as mais eficientes. Em passagens rápidas, usar uma digitação alternativa pode ser a diferença entre tropeçar e fluir.
              </p>
              {digitacoesAlternativas.map((item, i) => (
                <div key={i} className="rounded-xl border border-border p-4 bg-muted/10">
                  <h3 className="font-bold font-heading text-sm text-foreground mb-1">{item.titulo}</h3>
                  <p className="text-xs text-muted-foreground font-body mb-2 italic">Contexto: {item.contexto}</p>
                  <div className="space-y-1.5">
                    <p className="text-xs font-body text-foreground">
                      <strong>Como fazer:</strong> {item.como}
                    </p>
                    <p className="text-xs font-body text-primary/80">
                      <strong>Quando usar:</strong> {item.quando}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas de Embocadura */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Embocadura por Registro</h2>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-4">
              A embocadura muda sutilmente conforme o registro. Não existe uma posição única — domine as nuances de cada faixa.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {dicasEmbocadura.map((reg, i) => (
                <div key={i} className={`rounded-xl p-4 border ${reg.cor}`}>
                  <h3 className="font-bold font-heading text-sm mb-2.5">
                    {reg.emoji} {reg.registro}
                  </h3>
                  <ul className="space-y-2">
                    {reg.dicas.map((d, j) => (
                      <li key={j} className="text-xs font-body text-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Exercícios Preparação Altíssimo */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <span className="text-lg">🔴</span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold font-heading">Preparação para o Altíssimo</h2>
                <p className="text-xs text-muted-foreground font-body">Exercícios de harmônicos que destravam o registro altíssimo</p>
              </div>
            </div>
            <div className="space-y-4">
              {exerciciosPreparacaoAltissimo.map((ex, i) => (
                <div key={i} className="rounded-xl border border-border p-4">
                  <h3 className="font-bold font-heading text-sm text-foreground mb-2">{ex.titulo}</h3>
                  <ol className="space-y-1.5">
                    {ex.passos.map((p, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs font-body text-foreground">
                        <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary mt-0.5">
                          {j + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* Dica final */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold font-heading mb-3">💡 Dica de Ouro</h2>
            <p className="text-sm font-body text-foreground mb-2">
              <strong>Não decore — internalize.</strong> Pratique cada nota até que seus dedos se movam automaticamente. A tabela é para consulta, não para decorar.
            </p>
            <p className="text-sm font-body text-foreground">
              <strong>Rotina sugerida:</strong> Escolha 1 registro por dia. Toque cada nota 4 tempos (♩= 60), foco em timbre e afinação. Em 4 dias, você cobriu todo o sax.
            </p>
          </div>

          {/* Bottom Download CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={generateDigitacaoPDF}
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              BAIXAR GUIA COMPLETO EM PDF (26+ PÁG)
            </button>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Imprima todas as páginas e tenha sempre à mão
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 px-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax Brasil. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default OrderBumpDigitacao;
