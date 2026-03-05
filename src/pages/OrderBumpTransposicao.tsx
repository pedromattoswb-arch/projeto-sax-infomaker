import { ArrowLeft, Download, CheckCircle2, ArrowRightLeft, Music, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-clube-sax.webp";

const tabelaTransposicao = [
  { concert: "Dó (C)", altoEb: "Lá (A)", tenorBb: "Ré (D)", soprano: "Ré (D)", baritono: "Lá (A)" },
  { concert: "Dó# (C#)", altoEb: "Lá# (A#)", tenorBb: "Ré# (D#)", soprano: "Ré# (D#)", baritono: "Lá# (A#)" },
  { concert: "Ré (D)", altoEb: "Si (B)", tenorBb: "Mi (E)", soprano: "Mi (E)", baritono: "Si (B)" },
  { concert: "Mib (Eb)", altoEb: "Dó (C)", tenorBb: "Fá (F)", soprano: "Fá (F)", baritono: "Dó (C)" },
  { concert: "Mi (E)", altoEb: "Dó# (C#)", tenorBb: "Fá# (F#)", soprano: "Fá# (F#)", baritono: "Dó# (C#)" },
  { concert: "Fá (F)", altoEb: "Ré (D)", tenorBb: "Sol (G)", soprano: "Sol (G)", baritono: "Ré (D)" },
  { concert: "Fá# (F#)", altoEb: "Ré# (D#)", tenorBb: "Sol# (G#)", soprano: "Sol# (G#)", baritono: "Ré# (D#)" },
  { concert: "Sol (G)", altoEb: "Mi (E)", tenorBb: "Lá (A)", soprano: "Lá (A)", baritono: "Mi (E)" },
  { concert: "Sol# (G#)", altoEb: "Fá (F)", tenorBb: "Lá# (A#)", soprano: "Lá# (A#)", baritono: "Fá (F)" },
  { concert: "Lá (A)", altoEb: "Fá# (F#)", tenorBb: "Si (B)", soprano: "Si (B)", baritono: "Fá# (F#)" },
  { concert: "Sib (Bb)", altoEb: "Sol (G)", tenorBb: "Dó (C)", soprano: "Dó (C)", baritono: "Sol (G)" },
  { concert: "Si (B)", altoEb: "Sol# (G#)", tenorBb: "Dó# (C#)", soprano: "Dó# (C#)", baritono: "Sol# (G#)" },
];

const armaduras = [
  { tom: "Dó Maior / Lá menor", acidentes: "Nenhum", simbolo: "—" },
  { tom: "Sol Maior / Mi menor", acidentes: "1 #", simbolo: "Fá#" },
  { tom: "Ré Maior / Si menor", acidentes: "2 #", simbolo: "Fá#, Dó#" },
  { tom: "Lá Maior / Fá# menor", acidentes: "3 #", simbolo: "Fá#, Dó#, Sol#" },
  { tom: "Mi Maior / Dó# menor", acidentes: "4 #", simbolo: "Fá#, Dó#, Sol#, Ré#" },
  { tom: "Si Maior / Sol# menor", acidentes: "5 #", simbolo: "Fá#, Dó#, Sol#, Ré#, Lá#" },
  { tom: "Fá Maior / Ré menor", acidentes: "1 b", simbolo: "Sib" },
  { tom: "Sib Maior / Sol menor", acidentes: "2 b", simbolo: "Sib, Mib" },
  { tom: "Mib Maior / Dó menor", acidentes: "3 b", simbolo: "Sib, Mib, Láb" },
  { tom: "Láb Maior / Fá menor", acidentes: "4 b", simbolo: "Sib, Mib, Láb, Réb" },
  { tom: "Réb Maior / Sib menor", acidentes: "5 b", simbolo: "Sib, Mib, Láb, Réb, Solb" },
];

const cifrasComuns = [
  { original: "C - G - Am - F", altoEb: "A - E - F#m - D", tenorBb: "D - A - Bm - G" },
  { original: "G - Em - C - D", altoEb: "E - C#m - A - B", tenorBb: "A - F#m - D - E" },
  { original: "D - A - Bm - G", altoEb: "B - F# - G#m - E", tenorBb: "E - B - C#m - A" },
  { original: "F - C - Dm - Bb", altoEb: "D - A - Bm - G", tenorBb: "G - D - Em - C" },
  { original: "Bb - F - Gm - Eb", altoEb: "G - D - Em - C", tenorBb: "C - G - Am - F" },
  { original: "Eb - Bb - Cm - Ab", altoEb: "C - G - Am - F", tenorBb: "F - C - Dm - Bb" },
];

const passosTransposicao = [
  {
    numero: "1",
    titulo: "Identifique o tipo do seu sax",
    descricao: "Sax Alto e Barítono são em Mib (Eb). Sax Tenor e Soprano são em Sib (Bb).",
  },
  {
    numero: "2",
    titulo: "Encontre a nota Concert Pitch na tabela",
    descricao: "A nota Concert Pitch é a nota 'real' — a que o piano ou violão tocaria.",
  },
  {
    numero: "3",
    titulo: "Leia a coluna do seu sax",
    descricao: "A nota correspondente é o que você deve tocar no seu saxofone para soar na afinação correta.",
  },
];

const OrderBumpTransposicao = () => {
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
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ArrowRightLeft className="w-10 h-10 text-white" />
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              ORDER BUMP EXCLUSIVO
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Kit Transposição Instantânea
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto">
              Acabou o sofrimento de transpor partitura. Consulta em 3 segundos, qualquer tom, qualquer sax.
            </p>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-center mb-10 shadow-lg">
            <h3 className="text-white font-bold font-heading text-lg mb-2">📥 Baixar Kit Completo em PDF</h3>
            <p className="text-white/80 text-sm font-body mb-4">Tabela de bolso — imprima e tenha sempre dentro do case do sax</p>
            <a
              href="#download"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Download className="w-5 h-5" />
              BAIXAR PDF GRATUITO
            </a>
          </div>

          {/* 3 Passos */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Como Transpor na Prática — 3 Passos</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {passosTransposicao.map((p, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold font-heading text-primary">{p.numero}</span>
                  </div>
                  <h3 className="font-bold font-heading text-sm mb-1">{p.titulo}</h3>
                  <p className="text-xs text-muted-foreground font-body">{p.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Transposição Principal */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Tabela de Transposição — 12 Tonalidades</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Concert Pitch</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Alto (Eb)</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Tenor (Bb)</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground hidden md:table-cell">Soprano (Bb)</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground hidden md:table-cell">Barítono (Eb)</th>
                  </tr>
                </thead>
                <tbody>
                  {tabelaTransposicao.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="py-2 px-2 font-bold font-heading text-xs">{row.concert}</td>
                      <td className="py-2 px-2 font-body text-xs">{row.altoEb}</td>
                      <td className="py-2 px-2 font-body text-xs">{row.tenorBb}</td>
                      <td className="py-2 px-2 font-body text-xs hidden md:table-cell">{row.soprano}</td>
                      <td className="py-2 px-2 font-body text-xs hidden md:table-cell">{row.baritono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              💡 <strong>Soprano = mesma transposição do Tenor</strong> | <strong>Barítono = mesma do Alto</strong> (uma oitava abaixo)
            </p>
          </div>

          {/* Armaduras de Clave */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Tabela de Armaduras de Clave</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Tonalidade</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Acidentes</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Notas Alteradas</th>
                  </tr>
                </thead>
                <tbody>
                  {armaduras.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="py-2 px-2 font-bold font-heading text-xs">{row.tom}</td>
                      <td className="py-2 px-2 font-body text-xs font-semibold">{row.acidentes}</td>
                      <td className="py-2 px-2 font-body text-xs text-muted-foreground">{row.simbolo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cifras Comuns Transpostas */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg">⛪</span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold font-heading">Cifras Mais Comuns Transpostas</h2>
                <p className="text-xs text-muted-foreground font-body">Para quem toca com banda, igreja ou evento</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Cifra Original (C)</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Sax Alto (Eb)</th>
                    <th className="text-left py-2 px-2 font-heading text-xs text-muted-foreground">Sax Tenor (Bb)</th>
                  </tr>
                </thead>
                <tbody>
                  {cifrasComuns.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="py-2 px-2 font-bold font-heading text-xs">{row.original}</td>
                      <td className="py-2 px-2 font-body text-xs">{row.altoEb}</td>
                      <td className="py-2 px-2 font-body text-xs">{row.tenorBb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Download CTA */}
          <div className="mt-10 text-center">
            <a
              href="#download"
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5" />
              BAIXAR KIT TRANSPOSIÇÃO EM PDF
            </a>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Imprima a tabela de bolso e nunca mais sofra pra transpor
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

export default OrderBumpTransposicao;
