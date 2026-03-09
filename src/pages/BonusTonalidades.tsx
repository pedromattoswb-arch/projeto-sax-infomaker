import { ArrowLeft, Download, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logoSaxplay from "@/assets/logo-saxplay.png";
import { generateTonalidadesPDF } from "@/lib/pdfGenerators";

const transposicao = [
  { sax: "Sax Alto (Eb)", regra: "Sobe 3 semitons (uma terça menor)", exemplo: "Dó no piano = Lá no Sax Alto" },
  { sax: "Sax Tenor (Bb)", regra: "Sobe 1 tom (uma segunda maior)", exemplo: "Dó no piano = Ré no Sax Tenor" },
  { sax: "Sax Soprano (Bb)", regra: "Mesma transposição do Tenor", exemplo: "Dó no piano = Ré no Soprano" },
  { sax: "Sax Barítono (Eb)", regra: "Mesma transposição do Alto (oitava abaixo)", exemplo: "Dó no piano = Lá no Barítono" },
];

const escalasMaiores = [
  { tom: "Dó Maior", notas: "Dó – Ré – Mi – Fá – Sol – Lá – Si", acidentes: "Nenhum" },
  { tom: "Sol Maior", notas: "Sol – Lá – Si – Dó – Ré – Mi – Fá#", acidentes: "1 sustenido" },
  { tom: "Ré Maior", notas: "Ré – Mi – Fá# – Sol – Lá – Si – Dó#", acidentes: "2 sustenidos" },
  { tom: "Lá Maior", notas: "Lá – Si – Dó# – Ré – Mi – Fá# – Sol#", acidentes: "3 sustenidos" },
  { tom: "Mi Maior", notas: "Mi – Fá# – Sol# – Lá – Si – Dó# – Ré#", acidentes: "4 sustenidos" },
  { tom: "Si Maior", notas: "Si – Dó# – Ré# – Mi – Fá# – Sol# – Lá#", acidentes: "5 sustenidos" },
  { tom: "Fá Maior", notas: "Fá – Sol – Lá – Sib – Dó – Ré – Mi", acidentes: "1 bemol" },
  { tom: "Sib Maior", notas: "Sib – Dó – Ré – Mib – Fá – Sol – Lá", acidentes: "2 bemóis" },
  { tom: "Mib Maior", notas: "Mib – Fá – Sol – Láb – Sib – Dó – Ré", acidentes: "3 bemóis" },
  { tom: "Láb Maior", notas: "Láb – Sib – Dó – Réb – Mib – Fá – Sol", acidentes: "4 bemóis" },
];

const escalasRelativas = [
  { maior: "Dó Maior", menor: "Lá menor" },
  { maior: "Sol Maior", menor: "Mi menor" },
  { maior: "Ré Maior", menor: "Si menor" },
  { maior: "Lá Maior", menor: "Fá# menor" },
  { maior: "Fá Maior", menor: "Ré menor" },
  { maior: "Sib Maior", menor: "Sol menor" },
  { maior: "Mib Maior", menor: "Dó menor" },
];

const modos = [
  { nome: "Jônio (I)", caracter: "Alegre, brilhante", uso: "Pop, MPB" },
  { nome: "Dórico (II)", caracter: "Menor suave, jazzy", uso: "Jazz, Funk, Fusion" },
  { nome: "Frígio (III)", caracter: "Exótico, tenso", uso: "Flamenco, Metal" },
  { nome: "Lídio (IV)", caracter: "Sonhador, aberto", uso: "Film scoring, Fusion" },
  { nome: "Mixolídio (V)", caracter: "Dominante, bluesy", uso: "Blues, Rock, Baião" },
  { nome: "Eólio (VI)", caracter: "Melancólico, natural", uso: "Baladas, Gospel" },
  { nome: "Lócrio (VII)", caracter: "Instável, dissonante", uso: "Jazz avançado" },
];

const BonusTonalidades = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateTonalidadesPDF();
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🗺️</span>
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              BÔNUS EXCLUSIVO PREMIUM
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Guia: Mapa de Tonalidades para Sax
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto">
              Referência visual completa de transposição, escalas maiores, menores e modos. Ferramenta de consulta rápida indispensável.
            </p>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-center mb-10 shadow-lg">
            <h3 className="text-white font-bold font-heading text-lg mb-2">📥 Baixar Mapa Completo em PDF</h3>
            <p className="text-white/80 text-sm font-body mb-4">Imprima e tenha sempre à mão durante seus estudos e ensaios</p>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {loading ? "GERANDO PDF..." : "BAIXAR PDF GRATUITO"}
            </button>
          </div>

          {/* Transposição */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-lg md:text-xl font-bold font-heading mb-4 flex items-center gap-2">
              🔄 Tabela de Transposição
            </h2>
            <p className="text-sm font-body text-muted-foreground mb-4">
              O saxofone é um instrumento transpositor. Isso significa que a nota que você lê na partitura não é a mesma que soa no piano. Use esta tabela:
            </p>
            <div className="space-y-3">
              {transposicao.map((t, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border">
                  <h3 className="font-bold font-heading text-sm text-primary mb-1">{t.sax}</h3>
                  <p className="text-sm font-body"><strong>Regra:</strong> {t.regra}</p>
                  <p className="text-sm font-body text-muted-foreground"><strong>Exemplo:</strong> {t.exemplo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Escalas Maiores */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-lg md:text-xl font-bold font-heading mb-4 flex items-center gap-2">
              🎹 Escalas Maiores (Nota Real / Concert Pitch)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-heading font-bold">Tonalidade</th>
                    <th className="text-left py-2 px-3 font-heading font-bold">Notas</th>
                    <th className="text-left py-2 px-3 font-heading font-bold">Acidentes</th>
                  </tr>
                </thead>
                <tbody>
                  {escalasMaiores.map((e, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 px-3 font-semibold text-primary">{e.tom}</td>
                      <td className="py-2.5 px-3">{e.notas}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{e.acidentes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Relativas */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-lg md:text-xl font-bold font-heading mb-4 flex items-center gap-2">
              🔗 Tonalidades Relativas
            </h2>
            <p className="text-sm font-body text-muted-foreground mb-4">
              Cada tonalidade maior tem uma relativa menor que compartilha as mesmas notas:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {escalasRelativas.map((r, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-3 border border-border text-center">
                  <p className="font-bold font-heading text-sm text-primary">{r.maior}</p>
                  <p className="text-xs text-muted-foreground">↕</p>
                  <p className="font-semibold font-body text-sm">{r.menor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Modos */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-lg md:text-xl font-bold font-heading mb-4 flex items-center gap-2">
              🌈 Os 7 Modos Gregos
            </h2>
            <p className="text-sm font-body text-muted-foreground mb-4">
              Os modos são variações da escala maior que criam diferentes "cores" sonoras:
            </p>
            <div className="space-y-3">
              {modos.map((m, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="font-bold font-heading text-sm text-primary w-32 shrink-0">{m.nome}</span>
                  <div>
                    <p className="text-sm font-body">{m.caracter}</p>
                    <p className="text-xs text-muted-foreground">Usado em: {m.uso}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 mb-10">
            <h2 className="text-lg font-bold font-heading mb-3">💡 Como Usar Este Mapa</h2>
            <ul className="space-y-2 text-sm font-body text-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>Antes de tocar:</strong> Identifique a tonalidade da música e confira a escala correspondente</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>Transposição:</strong> Se receber uma partitura de piano, use a tabela para encontrar as notas do seu sax</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>Improvisação:</strong> Identifique o modo adequado ao estilo que está tocando</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>Imprima:</strong> Tenha este guia ao lado da estante durante os estudos</span>
              </li>
            </ul>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {loading ? "GERANDO PDF..." : "BAIXAR MAPA EM PDF"}
            </button>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Conteúdo exclusivo para mSaxPlayPlaybe do Sax
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

export default BonusTonalidades;
