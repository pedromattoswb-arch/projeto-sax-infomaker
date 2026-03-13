import { ArrowLeft, Download, CheckCircle2, ArrowRightLeft, Music, BookOpen, Printer, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logoSaxplay from "@/assets/logo-saxplay.png";
import { generateTransposicaoPDF } from "@/lib/pdfGenerators";
import useNoIndex from "@/hooks/useNoIndex";

/* ─── DADOS ─── */

const tabelaTransposicao = [
  { concert: "Dó (C)", altoEb: "Lá (A)", tenorBb: "Ré (D)" },
  { concert: "Dó# / Réb", altoEb: "Lá# / Sib", tenorBb: "Ré# / Mib" },
  { concert: "Ré (D)", altoEb: "Si (B)", tenorBb: "Mi (E)" },
  { concert: "Ré# / Mib", altoEb: "Dó (C)", tenorBb: "Fá (F)" },
  { concert: "Mi (E)", altoEb: "Dó# (C#)", tenorBb: "Fá# (F#)" },
  { concert: "Fá (F)", altoEb: "Ré (D)", tenorBb: "Sol (G)" },
  { concert: "Fá# / Solb", altoEb: "Ré# / Mib", tenorBb: "Sol# / Láb" },
  { concert: "Sol (G)", altoEb: "Mi (E)", tenorBb: "Lá (A)" },
  { concert: "Sol# / Láb", altoEb: "Fá (F)", tenorBb: "Lá# / Sib" },
  { concert: "Lá (A)", altoEb: "Fá# (F#)", tenorBb: "Si (B)" },
  { concert: "Lá# / Sib", altoEb: "Sol (G)", tenorBb: "Dó (C)" },
  { concert: "Si (B)", altoEb: "Sol# (G#)", tenorBb: "Dó# (C#)" },
];

const armaduras = [
  { tom: "Dó Maior / Lá menor", acidentes: "—", notas: "Nenhum acidente" },
  { tom: "Sol Maior / Mi menor", acidentes: "1 ♯", notas: "Fá#" },
  { tom: "Ré Maior / Si menor", acidentes: "2 ♯", notas: "Fá#, Dó#" },
  { tom: "Lá Maior / Fá# menor", acidentes: "3 ♯", notas: "Fá#, Dó#, Sol#" },
  { tom: "Mi Maior / Dó# menor", acidentes: "4 ♯", notas: "Fá#, Dó#, Sol#, Ré#" },
  { tom: "Si Maior / Sol# menor", acidentes: "5 ♯", notas: "Fá#, Dó#, Sol#, Ré#, Lá#" },
  { tom: "Fá# Maior / Ré# menor", acidentes: "6 ♯", notas: "Fá#, Dó#, Sol#, Ré#, Lá#, Mi#" },
  { tom: "Fá Maior / Ré menor", acidentes: "1 ♭", notas: "Sib" },
  { tom: "Sib Maior / Sol menor", acidentes: "2 ♭", notas: "Sib, Mib" },
  { tom: "Mib Maior / Dó menor", acidentes: "3 ♭", notas: "Sib, Mib, Láb" },
  { tom: "Láb Maior / Fá menor", acidentes: "4 ♭", notas: "Sib, Mib, Láb, Réb" },
  { tom: "Réb Maior / Sib menor", acidentes: "5 ♭", notas: "Sib, Mib, Láb, Réb, Solb" },
  { tom: "Solb Maior / Mib menor", acidentes: "6 ♭", notas: "Sib, Mib, Láb, Réb, Solb, Dób" },
];

const cifrasComuns = [
  { nome: "Pop/Worship Padrão", original: "C - G - Am - F", altoEb: "A - E - F#m - D", tenorBb: "D - A - Bm - G" },
  { nome: "Pop/Rock Alternativo", original: "G - Em - C - D", altoEb: "E - C#m - A - B", tenorBb: "A - F#m - D - E" },
  { nome: "Country/Folk", original: "D - A - Bm - G", altoEb: "B - F# - G#m - E", tenorBb: "E - B - C#m - A" },
  { nome: "Jazz Standard (ii-V-I)", original: "Dm7 - G7 - Cmaj7", altoEb: "Bm7 - E7 - Amaj7", tenorBb: "Em7 - A7 - Dmaj7" },
  { nome: "Blues em Fá", original: "F7 - Bb7 - C7", altoEb: "D7 - G7 - A7", tenorBb: "G7 - C7 - D7" },
  { nome: "Gospel Clássico", original: "Bb - F - Gm - Eb", altoEb: "G - D - Em - C", tenorBb: "C - G - Am - F" },
  { nome: "Bossa Nova", original: "Dm7 - G7 - Cmaj7 - A7", altoEb: "Bm7 - E7 - Amaj7 - F#7", tenorBb: "Em7 - A7 - Dmaj7 - B7" },
  { nome: "Worship Contemporâneo", original: "Eb - Bb - Cm - Ab", altoEb: "C - G - Am - F", tenorBb: "F - C - Dm - Bb" },
];

const passosTransposicao = [
  {
    numero: "1",
    titulo: "Identifique seu sax",
    descricao: "Sax Alto e Barítono são instrumentos em Mib (Eb) — somam 3 semitons acima. Sax Tenor e Soprano são em Sib (Bb) — somam 2 semitons acima.",
    dica: "Se alguém te dá uma partitura de piano e você toca Alto, precisa tocar 'uma terça menor acima' do escrito.",
  },
  {
    numero: "2",
    titulo: "Ache a nota na tabela",
    descricao: "Encontre a nota Concert Pitch (a nota 'real', como um piano tocaria) na primeira coluna da tabela abaixo.",
    dica: "Concert Pitch = o som real. A nota que você lê na partitura do sax NÃO é concert pitch.",
  },
  {
    numero: "3",
    titulo: "Leia a coluna do seu sax",
    descricao: "A nota que aparece na coluna do seu instrumento é o que você deve tocar para soar na afinação correta com o grupo.",
    dica: "Exemplo: se a cifra diz 'Dó' e você toca Alto, toque 'Lá'. Simples assim.",
  },
];

const dicasPraticas = [
  {
    titulo: "🎹 Tocando com pianista",
    texto: "O pianista está em Concert Pitch. Se ele diz 'Tom de Sol', e você toca Alto, seu tom é Mi. Se toca Tenor, seu tom é Lá.",
  },
  {
    titulo: "🎸 Tocando com guitarrista",
    texto: "Guitarra/violão também é Concert Pitch. Mesma regra do piano. Peça a cifra e consulte a tabela.",
  },
  {
    titulo: "⛪ Tocando na igreja",
    texto: "Se o líder de louvor diz 'a música é em Ré', consulte a tabela. Alto toca em Si, Tenor toca em Mi. Cole a tabela no seu caderno de cifras.",
  },
  {
    titulo: "🎺 Tocando com outro sopro",
    texto: "Se o trompete (Bb) passa uma partitura para o Alto (Eb), precisa transpor. Use a tabela: note Concert Pitch da partitura do trompete, depois ache a coluna do Alto.",
  },
  {
    titulo: "📱 Dica rápida de emergência",
    texto: "Alto: suba 3 semitons da nota concert. Tenor: suba 2 semitons. Na dúvida, conte no braço do violão ou no teclado.",
  },
];

/* ─── COMPONENTES ─── */

const CollapsibleSection = ({ titulo, emoji, children }: { titulo: string; emoji: string; children: React.ReactNode }) => {
  const [aberto, setAberto] = useState(true);
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-lg md:text-xl font-bold font-heading text-left">{titulo}</h2>
        </div>
        {aberto ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {aberto && <div className="px-5 md:px-6 pb-5 md:pb-6">{children}</div>}
    </div>
  );
};

/* ─── PÁGINA ─── */

const OrderBumpTransposicao = () => {
  useNoIndex();
  return (
    <div className="min-h-screen bg-background">
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <img src={logoSaxplay} alt="SaxPlay" className="h-6 w-auto" />
        </div>
      </header>

      <main className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <ArrowRightLeft className="w-10 h-10 text-white" />
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              GUIA PROFISSIONAL • 18+ PÁGINAS
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Kit Transposição Instantânea
            </h1>
            <p className="text-lg md:text-xl font-heading font-bold text-primary mb-2">
              Alto • Tenor • Soprano • Barítono
            </p>
            <p className="text-muted-foreground font-body text-base max-w-2xl mx-auto">
              Acabou o sofrimento de transpor partitura. Consulta em 3 segundos, qualquer tom, qualquer sax. Indispensável para quem toca em banda, igreja ou evento.
            </p>
          </div>

          {/* O que está incluído */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
            <h3 className="font-bold font-heading text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              O que está incluído neste kit:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Tabela de 12 tonalidades",
                "4 saxofones cobertos",
                "Método de 3 passos",
                "13 armaduras de clave",
                "8 cifras transpostas",
                "Dicas práticas por contexto",
                "PDF para imprimir",
                "Tabela de bolso",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-body text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-center mb-10 shadow-lg shadow-blue-500/15">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Printer className="w-5 h-5 text-white/80" />
              <h3 className="text-white font-bold font-heading text-lg">Baixar Kit Completo em PDF</h3>
            </div>
            <p className="text-white/70 text-sm font-body mb-4">18+ páginas • Imprima a tabela de bolso • Guarde dentro do case</p>
            <button
              onClick={generateTransposicaoPDF}
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-5 h-5" />
              BAIXAR PDF COMPLETO
            </button>
          </div>

          {/* 3 Passos */}
          <CollapsibleSection titulo="Como Transpor — Método de 3 Passos" emoji="🧭">
            <div className="space-y-4">
              {passosTransposicao.map((p, i) => (
                <div key={i} className="rounded-xl border border-border p-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                      {p.numero}
                    </span>
                    <div>
                      <h3 className="font-bold font-heading text-sm mb-1">{p.titulo}</h3>
                      <p className="text-xs font-body text-foreground mb-1.5">{p.descricao}</p>
                      <p className="text-xs font-body text-primary/80 italic">💡 {p.dica}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary/5 border border-primary/15 rounded-xl p-4">
              <p className="text-xs font-body text-foreground">
                <strong>Regra rápida de memória:</strong> Alto/Barítono (Eb) = sobe 3 semitons | Tenor/Soprano (Bb) = sobe 2 semitons. Em poucos dias, você não vai nem precisar da tabela.
              </p>
            </div>
          </CollapsibleSection>

          {/* Tabela de Transposição */}
          <div className="mt-4">
            <CollapsibleSection titulo="Tabela de Transposição — 12 Tonalidades" emoji="🔄">
              <p className="text-sm text-muted-foreground font-body mb-4">
                Encontre a nota Concert Pitch na primeira coluna e leia a nota correspondente no seu saxofone. Soprano = mesmo que Tenor. Barítono = mesmo que Alto (uma oitava abaixo).
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left py-3 px-3 font-heading text-xs text-muted-foreground border-b border-border">🎹 Concert Pitch</th>
                      <th className="text-left py-3 px-3 font-heading text-xs border-b border-border">
                        <span className="text-foreground font-bold">🎷 Alto (Eb)</span>
                      </th>
                      <th className="text-left py-3 px-3 font-heading text-xs border-b border-border">
                        <span className="text-foreground font-bold">🎷 Tenor (Bb)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabelaTransposicao.map((row, i) => (
                      <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-muted/10' : ''} hover:bg-primary/5 transition-colors`}>
                        <td className="py-2.5 px-3 font-bold font-heading text-xs">{row.concert}</td>
                        <td className="py-2.5 px-3 font-body text-xs font-medium">{row.altoEb}</td>
                        <td className="py-2.5 px-3 font-body text-xs font-medium">{row.tenorBb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid md:grid-cols-2 gap-2">
                <div className="bg-blue-500/5 border border-blue-500/15 rounded-lg p-3">
                  <p className="text-xs font-body text-foreground">
                    <strong>🎷 Soprano (Bb):</strong> Mesma transposição do Tenor — leia a coluna Tenor.
                  </p>
                </div>
                <div className="bg-violet-500/5 border border-violet-500/15 rounded-lg p-3">
                  <p className="text-xs font-body text-foreground">
                    <strong>🎷 Barítono (Eb):</strong> Mesma transposição do Alto — leia a coluna Alto (soa uma oitava abaixo).
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Armaduras de Clave */}
          <div className="mt-4">
            <CollapsibleSection titulo="Armaduras de Clave — Referência Visual" emoji="🎼">
              <p className="text-sm text-muted-foreground font-body mb-4">
                Quantos sustenidos (♯) ou bemóis (♭) cada tonalidade tem. Essencial para ler partituras corretamente.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left py-3 px-3 font-heading text-xs text-muted-foreground border-b border-border">Tonalidade</th>
                      <th className="text-left py-3 px-3 font-heading text-xs text-muted-foreground border-b border-border">Acidentes</th>
                      <th className="text-left py-3 px-3 font-heading text-xs text-muted-foreground border-b border-border">Notas Alteradas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {armaduras.map((row, i) => (
                      <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-muted/10' : ''}`}>
                        <td className="py-2.5 px-3 font-bold font-heading text-xs">{row.tom}</td>
                        <td className="py-2.5 px-3 font-body text-xs font-semibold">{row.acidentes}</td>
                        <td className="py-2.5 px-3 font-body text-xs text-muted-foreground">{row.notas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 bg-primary/5 border border-primary/15 rounded-xl p-4">
                <p className="text-xs font-body text-foreground">
                  <strong>Macete:</strong> Ordem dos sustenidos = Fá, Dó, Sol, Ré, Lá, Mi, Si. Ordem dos bemóis = o inverso: Si, Mi, Lá, Ré, Sol, Dó, Fá.
                </p>
              </div>
            </CollapsibleSection>
          </div>

          {/* Cifras Comuns */}
          <div className="mt-4">
            <CollapsibleSection titulo="Cifras Mais Comuns — Já Transpostas" emoji="⛪">
              <p className="text-sm text-muted-foreground font-body mb-4">
                As progressões que você mais vai encontrar em igrejas, bandas e eventos — já prontas para Alto e Tenor. Só ler e tocar.
              </p>
              <div className="space-y-3">
                {cifrasComuns.map((row, i) => (
                  <div key={i} className="rounded-xl border border-border p-4 hover:bg-muted/10 transition-colors">
                    <h4 className="font-bold font-heading text-xs text-primary mb-2">{row.nome}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-body">
                      <div>
                        <span className="text-muted-foreground font-semibold">🎹 Original:</span>
                        <span className="ml-1 font-mono text-foreground">{row.original}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">🎷 Alto:</span>
                        <span className="ml-1 font-mono text-foreground">{row.altoEb}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">🎷 Tenor:</span>
                        <span className="ml-1 font-mono text-foreground">{row.tenorBb}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Dicas Práticas por Contexto */}
          <div className="mt-4">
            <CollapsibleSection titulo="Dicas Práticas por Situação" emoji="💡">
              <div className="space-y-3">
                {dicasPraticas.map((dica, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <h3 className="font-bold font-heading text-sm mb-1">{dica.titulo}</h3>
                    <p className="text-xs font-body text-foreground">{dica.texto}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Dica final */}
          <div className="mt-6 bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold font-heading mb-3">🎯 Resumo Rápido para Decorar</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-bold font-heading text-sm mb-2">🎷 Sax Alto / Barítono (Eb)</h3>
                <p className="text-xs font-body text-foreground">
                  Toque <strong>uma terça menor acima</strong> (3 semitons) da nota Concert. Se a cifra é Dó, toque Lá. Se é Fá, toque Ré.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-bold font-heading text-sm mb-2">🎷 Sax Tenor / Soprano (Bb)</h3>
                <p className="text-xs font-body text-foreground">
                  Toque <strong>um tom acima</strong> (2 semitons) da nota Concert. Se a cifra é Dó, toque Ré. Se é Fá, toque Sol.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Download CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={generateTransposicaoPDF}
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              BAIXAR KIT COMPLETO EM PDF (18+ PÁG)
            </button>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Imprima a tabela de bolso e nunca mais sofra pra transpor
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 px-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} SaxPlay. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default OrderBumpTransposicao;
