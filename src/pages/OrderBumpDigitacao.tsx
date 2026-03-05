import { ArrowLeft, Download, CheckCircle2, Music, Hand, Star, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-clube-sax.webp";

const registroGrave = [
  { nota: "Sib (Bb)", descricao: "Todas as chaves fechadas + chave de Sib" },
  { nota: "Si (B)", descricao: "Todas as chaves fechadas" },
  { nota: "Dó (C)", descricao: "Mão esquerda: 1ª e 2ª chaves | Mão direita: todas" },
  { nota: "Dó# (C#)", descricao: "Mão esquerda: 1ª e 2ª | Mão direita: todas + chave de Dó#" },
  { nota: "Ré (D)", descricao: "Mão esquerda: 1ª e 2ª | Mão direita: 1ª e 2ª" },
  { nota: "Mib (Eb)", descricao: "Mão esquerda: 1ª e 2ª | Mão direita: 1ª" },
  { nota: "Mi (E)", descricao: "Mão esquerda: 1ª e 2ª | Mão direita: nenhuma" },
  { nota: "Fá (F)", descricao: "Mão esquerda: 1ª | Mão direita: nenhuma" },
  { nota: "Fá# (F#)", descricao: "Mão esquerda: 2ª | Mão direita: nenhuma" },
];

const registroMedio = [
  { nota: "Sol (G)", descricao: "Mão esquerda: nenhuma chave principal | Aberta" },
  { nota: "Sol# (G#)", descricao: "Mão esquerda: chave de Sol# (pinky)" },
  { nota: "Lá (A)", descricao: "Chave de oitava + mesma digitação do registro grave (Sib a Dó#)" },
  { nota: "Sib (Bb)", descricao: "Chave de oitava + digitação de Sib grave" },
  { nota: "Si (B)", descricao: "Chave de oitava + digitação de Si grave" },
  { nota: "Dó (C)", descricao: "Chave de oitava + digitação de Dó grave" },
];

const registroAgudo = [
  { nota: "Ré (D)", descricao: "Chave de oitava + 1ª e 2ª mão esquerda" },
  { nota: "Mib (Eb)", descricao: "Chave de oitava + 1ª e 2ª ME + 1ª MD" },
  { nota: "Mi (E)", descricao: "Chave de oitava + 1ª e 2ª ME" },
  { nota: "Fá (F)", descricao: "Chave de oitava + 1ª ME" },
  { nota: "Fá# (F#)", descricao: "Chave de oitava + 2ª ME ou chave auxiliar de Fá#" },
];

const registroAltissimo = [
  { nota: "Sol (G)", descricao: "Chave de oitava + digitação especial (Front F + 1ª e 3ª ME)" },
  { nota: "Sol# (G#)", descricao: "Front F + 1ª ME + chave lateral" },
  { nota: "Lá (A)", descricao: "Front F + 2ª ME + 1ª e 2ª MD" },
  { nota: "Sib (Bb)", descricao: "Front F + 1ª e 3ª ME + 1ª MD" },
  { nota: "Si (B)", descricao: "Front F + 2ª e 3ª ME + 2ª MD" },
  { nota: "Dó (C)", descricao: "Front F + 1ª ME + 2ª e 3ª MD" },
];

const digitacoesAlternativas = [
  {
    situacao: "Trinado Ré-Mib",
    dica: "Use a chave lateral de trinado (side key) em vez da digitação convencional — muito mais fluido",
  },
  {
    situacao: "Passagem rápida Sib-Dó (biskey)",
    dica: "Use a chave Bis (entre 1ª e 2ª da mão esquerda) para Sib em vez do pinky",
  },
  {
    situacao: "Fá#-Sol# legato",
    dica: "Use digitação de Fá# com dedo 2 + chave de Sol# no pinky para transição suave",
  },
  {
    situacao: "Dó#-Ré rápido no agudo",
    dica: "Mantenha a chave de oitava pressionada e use o mínimo de movimento nos dedos",
  },
  {
    situacao: "Side C para Dó agudo",
    dica: "Em passagens rápidas, o Side C (chave lateral) é mais ágil que a digitação padrão",
  },
  {
    situacao: "Palm keys (Ré, Mib, Mi agudos)",
    dica: "Pratique a pressão mínima — excesso de força trava a emissão e prejudica a afinação",
  },
];

const dicasEmbocadura = [
  {
    registro: "Grave",
    emoji: "🔵",
    dicas: [
      "Mandíbula relaxada e mais aberta — garganta como se bocejasse",
      "Mais palheta dentro da boca para volume e ressonância",
      "Sopro quente e lento — pense em 'HÁÁ' aberto",
      "Apoio firme do diafragma sem tensão na garganta",
    ],
  },
  {
    registro: "Médio",
    emoji: "🟢",
    dicas: [
      "Embocadura neutra — nem muito apertada nem relaxada",
      "Foco na coluna de ar constante e centrada",
      "Língua em posição natural, levemente curvada",
      "Este é o registro de referência — calibre afinação aqui",
    ],
  },
  {
    registro: "Agudo",
    emoji: "🟡",
    dicas: [
      "Mandíbula levemente mais fechada — pressão sutil e uniforme",
      "Sopro mais rápido e direcionado — pense em 'IIII' estreito",
      "Menos palheta na boca que no registro grave",
      "Cuidado com o excesso de pressão do lábio inferior",
    ],
  },
  {
    registro: "Altíssimo",
    emoji: "🔴",
    dicas: [
      "Garganta muito estreita — como assobiar uma nota aguda",
      "Ar extremamente rápido e concentrado com apoio máximo do diafragma",
      "Embocadura firme mas nunca tensa — a tensão mata o som",
      "Pratique harmônicos naturais primeiro para encontrar a posição ideal",
    ],
  },
];

const NotaRow = ({ nota, descricao }: { nota: string; descricao: string }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
    <span className="font-bold font-heading text-sm text-primary w-24 shrink-0">{nota}</span>
    <span className="text-sm font-body text-foreground">{descricao}</span>
  </div>
);

const OrderBumpDigitacao = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <img src={logo} alt="Clube do Sax Brasil" className="h-8 w-auto" />
        </div>
      </header>

      <main className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Hand className="w-10 h-10 text-white" />
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              ORDER BUMP EXCLUSIVO
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Tabela de Digitação Completa — Sax Alto e Tenor
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto">
              Nunca mais erre uma nota. Todas as digitações do registro grave ao altíssimo, com digitações alternativas para passagens rápidas.
            </p>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-center mb-10 shadow-lg">
            <h3 className="text-white font-bold font-heading text-lg mb-2">📥 Baixar Tabela Completa em PDF</h3>
            <p className="text-white/80 text-sm font-body mb-4">Imprima e cole na estante — consulta rápida toda vez que pegar o sax</p>
            <a
              href="#download"
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Download className="w-5 h-5" />
              BAIXAR PDF GRATUITO
            </a>
          </div>

          {/* Registro Grave */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <span className="text-lg">🔵</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Registro Grave (Sib → Sol)</h2>
            </div>
            <div className="divide-y divide-border">
              {registroGrave.map((n, i) => <NotaRow key={i} nota={n.nota} descricao={n.descricao} />)}
            </div>
          </div>

          {/* Registro Médio */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <span className="text-lg">🟢</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Registro Médio (Sol# → Dó)</h2>
            </div>
            <div className="divide-y divide-border">
              {registroMedio.map((n, i) => <NotaRow key={i} nota={n.nota} descricao={n.descricao} />)}
            </div>
          </div>

          {/* Registro Agudo */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <span className="text-lg">🟡</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Registro Agudo (Ré → Fá#)</h2>
            </div>
            <div className="divide-y divide-border">
              {registroAgudo.map((n, i) => <NotaRow key={i} nota={n.nota} descricao={n.descricao} />)}
            </div>
          </div>

          {/* Registro Altíssimo */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <span className="text-lg">🔴</span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold font-heading">Registro Altíssimo (Sol → Dó)</h2>
                <span className="text-xs text-muted-foreground font-body">⚠️ Requer embocadura avançada e controle de ar</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {registroAltissimo.map((n, i) => <NotaRow key={i} nota={n.nota} descricao={n.descricao} />)}
            </div>
            <div className="mt-4 bg-primary/5 border border-primary/15 rounded-xl p-4">
              <p className="text-xs font-body text-foreground">
                <strong>💡 Dica:</strong> As digitações do altíssimo variam entre saxofones e boquilhas. Use estas como ponto de partida e ajuste conforme seu setup. Pratique harmônicos naturais antes de tentar o altíssimo.
              </p>
            </div>
          </div>

          {/* Digitações Alternativas */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Digitações Alternativas</h2>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-4">
              Para passagens rápidas, trinados e transições difíceis — use estas alternativas para ganhar agilidade.
            </p>
            <div className="space-y-3">
              {digitacoesAlternativas.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm font-body">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-foreground">{item.situacao}:</strong>{" "}
                    <span className="text-muted-foreground">{item.dica}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas de Embocadura */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Dicas de Embocadura por Registro</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {dicasEmbocadura.map((reg, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border">
                  <h3 className="font-bold font-heading text-sm mb-2">
                    {reg.emoji} {reg.registro}
                  </h3>
                  <ul className="space-y-1.5">
                    {reg.dicas.map((d, j) => (
                      <li key={j} className="text-xs font-body text-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Download CTA */}
          <div className="mt-10 text-center">
            <a
              href="#download"
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5" />
              BAIXAR TABELA EM PDF
            </a>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Imprima e tenha sempre à mão durante seus estudos
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
