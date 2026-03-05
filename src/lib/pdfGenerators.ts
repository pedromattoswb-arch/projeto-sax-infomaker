import jsPDF from "jspdf";
import logoSrc from "@/assets/logo-clube-sax.webp";

/* ═══════════════════════════════════════════════════════════
   UTILIDADES COMPARTILHADAS
   ═══════════════════════════════════════════════════════════ */

let cachedLogoBase64: string | null = null;

async function loadLogoBase64(): Promise<string> {
  if (cachedLogoBase64) return cachedLogoBase64;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      cachedLogoBase64 = canvas.toDataURL("image/png");
      resolve(cachedLogoBase64);
    };
    img.onerror = reject;
    img.src = logoSrc;
  });
}

const COLORS = {
  darkBg: [26, 26, 26] as [number, number, number],
  cardBg: [38, 38, 38] as [number, number, number],
  lightCardBg: [48, 48, 48] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  muted: [160, 160, 160] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  greenDark: [22, 163, 74] as [number, number, number],
  blue: [59, 130, 246] as [number, number, number],
  blueDark: [37, 99, 235] as [number, number, number],
  violet: [139, 92, 246] as [number, number, number],
  violetDark: [124, 58, 237] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  emerald: [16, 185, 129] as [number, number, number],
  cyan: [6, 182, 212] as [number, number, number],
};

const MARGIN = 20;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - 25) {
    doc.addPage();
    drawPageBg(doc);
    return MARGIN + 5;
  }
  return y;
}

function drawPageBg(doc: jsPDF) {
  doc.setFillColor(...COLORS.darkBg);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function drawRoundedRect(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, color: [number, number, number]) {
  doc.setFillColor(...color);
  doc.roundedRect(x, y, w, h, r, r, "F");
}

function addText(doc: jsPDF, text: string, x: number, y: number, opts: { size?: number; color?: [number, number, number]; style?: string; maxWidth?: number; align?: "left" | "center" | "right" } = {}) {
  const { size = 10, color = COLORS.white, style = "normal", maxWidth, align = "left" } = opts;
  doc.setFontSize(size);
  doc.setTextColor(...color);
  doc.setFont("helvetica", style);
  if (maxWidth) {
    doc.text(text, x, y, { maxWidth, align });
  } else {
    doc.text(text, x, y, { align });
  }
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, opts: { size?: number; color?: [number, number, number]; style?: string; lineHeight?: number } = {}): number {
  const { size = 9, color = COLORS.white, style = "normal", lineHeight = 4.5 } = opts;
  doc.setFontSize(size);
  doc.setTextColor(...color);
  doc.setFont("helvetica", style);
  const lines = doc.splitTextToSize(text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    const currentY = y + i * lineHeight;
    if (currentY > PAGE_H - 20) {
      doc.addPage();
      drawPageBg(doc);
      const remaining = lines.slice(i);
      let newY = MARGIN + 5;
      for (const line of remaining) {
        doc.text(line, x, newY);
        newY += lineHeight;
      }
      return newY;
    }
    doc.text(lines[i], x, currentY);
  }
  return y + lines.length * lineHeight;
}

function drawCoverPage(doc: jsPDF, title: string, subtitle: string, badge: string, accentColor: [number, number, number], items: string[], logoBase64: string) {
  drawPageBg(doc);
  
  // Accent bar
  doc.setFillColor(...accentColor);
  doc.rect(0, 0, PAGE_W, 6, "F");
  
  // Logo image
  try {
    const logoW = 50;
    const logoH = 14;
    doc.addImage(logoBase64, "PNG", PAGE_W / 2 - logoW / 2, 18, logoW, logoH);
  } catch {
    // fallback text if image fails
    addText(doc, "CLUBE DO SAX BRASIL", PAGE_W / 2, 28, { size: 12, color: COLORS.muted, style: "normal", align: "center" });
  }
  
  // Badge
  drawRoundedRect(doc, PAGE_W / 2 - 40, 42, 80, 10, 5, [accentColor[0], accentColor[1], accentColor[2]]);
  addText(doc, badge, PAGE_W / 2, 49, { size: 8, color: COLORS.white, style: "bold", align: "center" });
  
  // Title
  addText(doc, title, PAGE_W / 2, 80, { size: 26, color: COLORS.white, style: "bold", align: "center" });
  
  // Subtitle
  addText(doc, subtitle, PAGE_W / 2, 95, { size: 14, color: accentColor, style: "bold", align: "center" });
  
  // Items
  drawRoundedRect(doc, MARGIN + 10, 112, CONTENT_W - 20, items.length * 9 + 16, 6, COLORS.cardBg);
  addText(doc, "O QUE ESTA INCLUIDO:", MARGIN + 20, 124, { size: 9, color: COLORS.muted, style: "bold" });
  items.forEach((item, i) => {
    addText(doc, `✓  ${item}`, MARGIN + 20, 134 + i * 9, { size: 9, color: COLORS.white });
  });
  
  // Footer
  addText(doc, `© ${new Date().getFullYear()} Clube do Sax Brasil — Todos os direitos reservados`, PAGE_W / 2, PAGE_H - 20, { size: 7, color: COLORS.muted, align: "center" });
  addText(doc, "Material exclusivo para membros. Proibida a reprodução.", PAGE_W / 2, PAGE_H - 14, { size: 7, color: COLORS.muted, align: "center" });
}

function drawSectionHeader(doc: jsPDF, y: number, title: string, subtitle: string, color: [number, number, number]): number {
  y = ensureSpace(doc, y, 20);
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 18, 4, color);
  addText(doc, title.toUpperCase(), MARGIN + 8, y + 8, { size: 12, color: COLORS.white, style: "bold" });
  addText(doc, subtitle, MARGIN + 8, y + 14, { size: 8, color: [255, 255, 255] });
  return y + 22;
}

function addPageNumber(doc: jsPDF, logoBase64: string) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    // Small logo on every page (top-right)
    try {
      doc.addImage(logoBase64, "PNG", PAGE_W - MARGIN - 28, 5, 28, 8);
    } catch { /* ignore */ }
    addText(doc, `${i} / ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 10, { size: 7, color: COLORS.muted, align: "right" });
    addText(doc, "Clube do Sax Brasil", MARGIN, PAGE_H - 10, { size: 7, color: COLORS.muted });
  }
}

/* ═══════════════════════════════════════════════════════════
   PDF 1 — DIGITAÇÃO COMPLETA
   ═══════════════════════════════════════════════════════════ */

export async function generateDigitacaoPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const registros = [
    {
      titulo: "Registro Grave", subtitulo: "Sib grave → Sol", color: COLORS.blue,
      notas: [
        { nota: "Sib (Bb)", chaves: "Todas fechadas + Sib (pinky esquerdo)", dica: "Nota mais grave. Sopro lento, apoio firme do diafragma." },
        { nota: "Si (B)", chaves: "Todas fechadas (sem Sib)", dica: "Embocadura bem aberta, garganta relaxada como bocejo." },
        { nota: "Do (C)", chaves: "ME: 1a, 2a, 3a | MD: 1a, 2a, 3a", dica: "Dedos proximos as chaves mesmo quando nao pressionados." },
        { nota: "Do# (C#)", chaves: "ME: 1a, 2a, 3a | MD: 1a, 2a, 3a + Do# (pinky dir.)", dica: "Use o pinky sem tensao — apenas o peso do dedo." },
        { nota: "Re (D)", chaves: "ME: 1a, 2a, 3a | MD: 1a, 2a", dica: "Referencia de afinacao para iniciantes." },
        { nota: "Mib (Eb)", chaves: "ME: 1a, 2a, 3a | MD: 1a", dica: "Levante apenas o dedo 3 da MD — minimo movimento." },
        { nota: "Mi (E)", chaves: "ME: 1a, 2a, 3a | MD: nenhuma", dica: "Transicao Mi→Fa e uma das mais usadas." },
        { nota: "Fa (F)", chaves: "ME: 1a, 2a | MD: nenhuma", dica: "Embocadura comeca a ficar mais neutra." },
        { nota: "Fa# (F#)", chaves: "ME: 1a, 3a | MD: nenhuma", dica: "Salto do dedo 2 para 3 requer pratica." },
        { nota: "Sol (G)", chaves: "ME: 1a | MD: nenhuma", dica: "Nota aberta. Boa para calibrar embocadura." },
        { nota: "Sol# (G#)", chaves: "ME: 1a + Sol# (pinky esq.)", dica: "Pratique independencia do pinky." },
      ],
    },
    {
      titulo: "Registro Medio (com oitava)", subtitulo: "La → Do#", color: COLORS.emerald,
      notas: [
        { nota: "La (A)", chaves: "Oitava + ME: 1a, 2a, 3a | MD: 1a, 2a, 3a", dica: "Primeira nota com oitava. Pressao do polegar constante." },
        { nota: "Sib (Bb)", chaves: "Oitava + mesma digitacao de Sib grave", dica: "Use chave Bis para transicoes rapidas La→Sib." },
        { nota: "Si (B)", chaves: "Oitava + todas fechadas (sem Sib)", dica: "A oitava muda automaticamente." },
        { nota: "Do (C)", chaves: "Oitava + ME: 1a, 2a, 3a | MD: 1a, 2a, 3a", dica: "Compare afinacao com Do grave." },
        { nota: "Do# (C#)", chaves: "Oitava + ME: 1a, 2a, 3a | MD: 1a, 2a, 3a + Do#", dica: "Transicao para registro agudo." },
      ],
    },
    {
      titulo: "Registro Agudo", subtitulo: "Re → Fa#", color: COLORS.amber,
      notas: [
        { nota: "Re (D)", chaves: "Oitava + Palm D (lateral sup. ME)", dica: "Pressione com lateral da mao, nao ponta do dedo." },
        { nota: "Mib (Eb)", chaves: "Oitava + Palm D + Palm Eb", dica: "Relaxe o punho para alcancar ambas." },
        { nota: "Mi (E)", chaves: "Oitava + Palm D + Eb + F (ou Side E)", dica: "Ar bastante. Apoie com diafragma." },
        { nota: "Fa (F)", chaves: "Oitava + todas palm keys ou Front F", dica: "Front F e mais agil em passagens rapidas." },
        { nota: "Fa# (F#)", chaves: "Oitava + Fa# auxiliar ou Front F + ajuste", dica: "Nota mais aguda do registro 'normal'." },
      ],
    },
    {
      titulo: "Registro Altissimo", subtitulo: "Sol → Do (acima)", color: COLORS.red,
      notas: [
        { nota: "Sol (G)", chaves: "Front F + ME: 1a, 3a | MD: nenhuma", dica: "Pratique harmonico de Sol a partir do Do grave." },
        { nota: "Sol# (G#)", chaves: "Front F + ME: 1a + chave lateral", dica: "Garganta muito estreita. Pense em assobiar." },
        { nota: "La (A)", chaves: "Front F + ME: 2a | MD: 1a, 2a", dica: "Uma das altissimas mais estaveis." },
        { nota: "Sib (Bb)", chaves: "Front F + ME: 1a, 3a | MD: 1a", dica: "Ar extremamente rapido. Embocadura firme." },
        { nota: "Si (B)", chaves: "Front F + ME: 2a, 3a | MD: 2a", dica: "Dificil de estabilizar. Pratique notas longas." },
        { nota: "Do (C)", chaves: "Front F + ME: 1a | MD: 2a, 3a", dica: "Topo do altissimo. Poucos dominam com consistencia." },
      ],
    },
  ];

  const alternativas = [
    { titulo: "Bis Key (Sib)", contexto: "La → Sib → La", como: "Chave Bis entre 1a e 2a da ME. Dedo 1 rola para baixo.", quando: "Sib entre notas da mao esquerda." },
    { titulo: "Side C (Do agudo)", contexto: "Passagens rapidas no agudo", como: "Chave lateral de Do (lado direito).", quando: "Sequencias Si→Do→Re no agudo." },
    { titulo: "Side Bb (Sib agudo)", contexto: "Alternativa ao Sib com oitava", como: "Chave lateral de Sib.", quando: "Trinados e cromaticos no agudo." },
    { titulo: "Fork F (Fa com forquilha)", contexto: "Mib → Fa → Mib", como: "ME: 1a, 3a (sem 2a).", quando: "Fa entre notas que usam 1a e 3a." },
    { titulo: "Trinado Re-Mib", contexto: "Trinados e ornamentos", como: "Segure Re + chave trinado lateral MD.", quando: "Qualquer trinado Re-Mib." },
    { titulo: "Front F (Fa agudo)", contexto: "Fa agudo rapido", como: "Chave frontal acima de Si.", quando: "Passagens rapidas no agudo." },
  ];

  const embocadura = [
    { registro: "Grave", dicas: ["Mandibula relaxada e mais aberta", "Mais palheta dentro da boca", "Sopro quente e lento — vogal 'O'", "Apoio firme do diafragma", "Se guincha, esta apertando demais"] },
    { registro: "Medio", dicas: ["Embocadura neutra", "Coluna de ar constante e centrada", "Lingua levemente curvada para cima", "Registro de referencia — calibre aqui", "Pratique notas longas"] },
    { registro: "Agudo", dicas: ["Mandibula levemente mais fechada", "Sopro mais rapido — vogal 'I'", "Menos palheta na boca", "Sem excesso de pressao labial", "Use o ouvido para afinacao"] },
    { registro: "Altissimo", dicas: ["Garganta muito estreita — como assobiar", "Ar extremamente rapido", "Embocadura firme mas nao tensa", "Pratique harmonicos naturais primeiro", "Comece pelo Sol e va subindo"] },
  ];

  // COVER PAGE
  drawCoverPage(doc, "Tabela de Digitacao", "Sax Alto & Tenor — Inclui Altissimas", "GUIA PROFISSIONAL • 26+ PAGINAS", COLORS.violet, [
    "27 notas do registro normal (Sib grave ao Fa#)",
    "6 notas altissimas (Sol ao Do acima)",
    "6 digitacoes alternativas para passagens rapidas",
    "Dicas de embocadura por registro",
    "Exercicios de harmonicos para altissimo",
    "Tabela pronta para imprimir e colar na estante",
  ], logoBase64);

  // TABLE OF CONTENTS
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.violet);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 18, color: COLORS.white, style: "bold", align: "center" });
  
  const tocItems = [
    "1. Registro Grave (Sib → Sol) .......... pag. 3",
    "2. Registro Medio com Oitava (La → Do#) .......... pag. 5",
    "3. Registro Agudo (Re → Fa#) .......... pag. 6",
    "4. Registro Altissimo (Sol → Do) .......... pag. 7",
    "5. Digitacoes Alternativas .......... pag. 8",
    "6. Embocadura por Registro .......... pag. 9",
    "7. Exercicios de Harmonicos .......... pag. 10",
    "8. Dica de Ouro & Rotina Sugerida .......... pag. 11",
  ];
  
  drawRoundedRect(doc, MARGIN + 5, 45, CONTENT_W - 10, tocItems.length * 10 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 57 + i * 10, { size: 10, color: COLORS.white });
  });

  // REGISTROS
  registros.forEach((reg) => {
    doc.addPage();
    drawPageBg(doc);
    let y = drawSectionHeader(doc, MARGIN, reg.titulo, reg.subtitulo, reg.color);
    y += 3;

    reg.notas.forEach((nota) => {
      y = ensureSpace(doc, y, 22);
      drawRoundedRect(doc, MARGIN, y, CONTENT_W, 18, 3, COLORS.cardBg);
      addText(doc, nota.nota, MARGIN + 5, y + 6, { size: 11, color: COLORS.white, style: "bold" });
      addText(doc, `Chaves: ${nota.chaves}`, MARGIN + 5, y + 11, { size: 8, color: COLORS.muted, maxWidth: CONTENT_W - 10 });
      addText(doc, `→ ${nota.dica}`, MARGIN + 5, y + 15.5, { size: 8, color: reg.color, style: "italic" });
      y += 21;
    });
  });

  // ALTERNATIVAS
  doc.addPage();
  drawPageBg(doc);
  let y = drawSectionHeader(doc, MARGIN, "Digitacoes Alternativas", "Para passagens rapidas, trinados e transicoes dificeis", COLORS.violet);
  y += 3;

  alternativas.forEach((alt) => {
    y = ensureSpace(doc, y, 26);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 22, 3, COLORS.cardBg);
    addText(doc, alt.titulo, MARGIN + 5, y + 6, { size: 10, color: COLORS.white, style: "bold" });
    addText(doc, `Contexto: ${alt.contexto}`, MARGIN + 5, y + 11, { size: 8, color: COLORS.muted, style: "italic" });
    addText(doc, `Como: ${alt.como}`, MARGIN + 5, y + 15.5, { size: 8, color: COLORS.white });
    addText(doc, `Quando usar: ${alt.quando}`, MARGIN + 5, y + 19.5, { size: 8, color: COLORS.violet });
    y += 25;
  });

  // EMBOCADURA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Embocadura por Registro", "A embocadura muda conforme o registro", COLORS.violet);
  y += 3;

  embocadura.forEach((reg) => {
    y = ensureSpace(doc, y, 36);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, reg.dicas.length * 5.5 + 10, 3, COLORS.cardBg);
    addText(doc, reg.registro.toUpperCase(), MARGIN + 5, y + 7, { size: 10, color: COLORS.violet, style: "bold" });
    reg.dicas.forEach((d, j) => {
      addText(doc, `• ${d}`, MARGIN + 8, y + 13 + j * 5.5, { size: 8.5, color: COLORS.white });
    });
    y += reg.dicas.length * 5.5 + 14;
  });

  // EXERCÍCIOS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Preparacao para o Altissimo", "Exercicios de harmonicos que destravam o registro", COLORS.red);
  y += 3;

  const exercicios = [
    { titulo: "Exercicio 1 — Harmonicos do Sib grave", passos: ["Toque Sib grave normalmente", "Sem mudar digitacao, faca soar Sib uma oitava acima", "Depois tente Fa (quinta acima)", "Depois Sib duas oitavas acima", "Esse controle e o mesmo do altissimo"] },
    { titulo: "Exercicio 2 — Harmonicos do Si grave", passos: ["Repita partindo do Si grave", "Si grave → Si oitava → Fa# → Si duas oitavas", "Cada fundamental gera serie harmonica diferente"] },
    { titulo: "Exercicio 3 — Conexao com digitacao", passos: ["Toque harmonico de Sol (partindo do Do grave)", "Quando estavel, mude para digitacao altissima de Sol", "O som deve continuar — mesma embocadura", "Repita para Sol#, La, etc."] },
  ];

  exercicios.forEach((ex) => {
    y = ensureSpace(doc, y, 35);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, ex.passos.length * 5.5 + 12, 3, COLORS.cardBg);
    addText(doc, ex.titulo, MARGIN + 5, y + 7, { size: 10, color: COLORS.red, style: "bold" });
    ex.passos.forEach((p, j) => {
      addText(doc, `${j + 1}. ${p}`, MARGIN + 8, y + 13 + j * 5.5, { size: 8.5, color: COLORS.white });
    });
    y += ex.passos.length * 5.5 + 16;
  });

  // DICA DE OURO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Dica de Ouro", "Rotina sugerida de pratica", COLORS.violet);
  y += 5;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 45, 4, COLORS.cardBg);
  addText(doc, "Nao decore — internalize.", MARGIN + 8, y + 10, { size: 12, color: COLORS.violet, style: "bold" });
  y = addWrappedText(doc, "Pratique cada nota ate que seus dedos se movam automaticamente. A tabela e para consulta, nao para decorar.", MARGIN + 8, y + 18, CONTENT_W - 16, { size: 10, color: COLORS.white });
  y += 5;
  addText(doc, "ROTINA SUGERIDA:", MARGIN + 8, y, { size: 10, color: COLORS.amber, style: "bold" });
  y = addWrappedText(doc, "Escolha 1 registro por dia. Toque cada nota 4 tempos (q = 60), foco em timbre e afinacao. Em 4 dias, voce cobriu todo o sax.", MARGIN + 8, y + 6, CONTENT_W - 16, { size: 9, color: COLORS.white });

  addPageNumber(doc, logoBase64);
  doc.save("Tabela-Digitacao-Completa-Clube-do-Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF 2 — TRANSPOSIÇÃO INSTANTÂNEA
   ═══════════════════════════════════════════════════════════ */

export async function generateTransposicaoPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const tabelaTransposicao = [
    { concert: "Do (C)", alto: "La (A)", tenor: "Re (D)" },
    { concert: "Do# / Reb", alto: "La# / Sib", tenor: "Re# / Mib" },
    { concert: "Re (D)", alto: "Si (B)", tenor: "Mi (E)" },
    { concert: "Re# / Mib", alto: "Do (C)", tenor: "Fa (F)" },
    { concert: "Mi (E)", alto: "Do# (C#)", tenor: "Fa# (F#)" },
    { concert: "Fa (F)", alto: "Re (D)", tenor: "Sol (G)" },
    { concert: "Fa# / Solb", alto: "Re# / Mib", tenor: "Sol# / Lab" },
    { concert: "Sol (G)", alto: "Mi (E)", tenor: "La (A)" },
    { concert: "Sol# / Lab", alto: "Fa (F)", tenor: "La# / Sib" },
    { concert: "La (A)", alto: "Fa# (F#)", tenor: "Si (B)" },
    { concert: "La# / Sib", alto: "Sol (G)", tenor: "Do (C)" },
    { concert: "Si (B)", alto: "Sol# (G#)", tenor: "Do# (C#)" },
  ];

  const armaduras = [
    { tom: "Do Maior / La menor", acidentes: "—", notas: "Nenhum acidente" },
    { tom: "Sol Maior / Mi menor", acidentes: "1 #", notas: "Fa#" },
    { tom: "Re Maior / Si menor", acidentes: "2 #", notas: "Fa#, Do#" },
    { tom: "La Maior / Fa# menor", acidentes: "3 #", notas: "Fa#, Do#, Sol#" },
    { tom: "Mi Maior / Do# menor", acidentes: "4 #", notas: "Fa#, Do#, Sol#, Re#" },
    { tom: "Si Maior / Sol# menor", acidentes: "5 #", notas: "Fa#, Do#, Sol#, Re#, La#" },
    { tom: "Fa# Maior / Re# menor", acidentes: "6 #", notas: "Fa#, Do#, Sol#, Re#, La#, Mi#" },
    { tom: "Fa Maior / Re menor", acidentes: "1 b", notas: "Sib" },
    { tom: "Sib Maior / Sol menor", acidentes: "2 b", notas: "Sib, Mib" },
    { tom: "Mib Maior / Do menor", acidentes: "3 b", notas: "Sib, Mib, Lab" },
    { tom: "Lab Maior / Fa menor", acidentes: "4 b", notas: "Sib, Mib, Lab, Reb" },
    { tom: "Reb Maior / Sib menor", acidentes: "5 b", notas: "Sib, Mib, Lab, Reb, Solb" },
    { tom: "Solb Maior / Mib menor", acidentes: "6 b", notas: "Sib, Mib, Lab, Reb, Solb, Dob" },
  ];

  const cifras = [
    { nome: "Pop/Worship Padrao", original: "C - G - Am - F", alto: "A - E - F#m - D", tenor: "D - A - Bm - G" },
    { nome: "Pop/Rock Alternativo", original: "G - Em - C - D", alto: "E - C#m - A - B", tenor: "A - F#m - D - E" },
    { nome: "Country/Folk", original: "D - A - Bm - G", alto: "B - F# - G#m - E", tenor: "E - B - C#m - A" },
    { nome: "Jazz Standard (ii-V-I)", original: "Dm7 - G7 - Cmaj7", alto: "Bm7 - E7 - Amaj7", tenor: "Em7 - A7 - Dmaj7" },
    { nome: "Blues em Fa", original: "F7 - Bb7 - C7", alto: "D7 - G7 - A7", tenor: "G7 - C7 - D7" },
    { nome: "Gospel Classico", original: "Bb - F - Gm - Eb", alto: "G - D - Em - C", tenor: "C - G - Am - F" },
    { nome: "Bossa Nova", original: "Dm7 - G7 - Cmaj7 - A7", alto: "Bm7 - E7 - Amaj7 - F#7", tenor: "Em7 - A7 - Dmaj7 - B7" },
    { nome: "Worship Contemporaneo", original: "Eb - Bb - Cm - Ab", alto: "C - G - Am - F", tenor: "F - C - Dm - Bb" },
  ];

  const passos = [
    { n: "1", titulo: "Identifique seu sax", desc: "Alto/Baritono = Mib (Eb) → soma 3 semitons. Tenor/Soprano = Sib (Bb) → soma 2 semitons." },
    { n: "2", titulo: "Ache a nota na tabela", desc: "Encontre a nota Concert Pitch (nota 'real', como piano) na primeira coluna." },
    { n: "3", titulo: "Leia a coluna do seu sax", desc: "A nota na coluna do seu instrumento e o que voce deve tocar." },
  ];

  // COVER
  drawCoverPage(doc, "Kit Transposicao", "Alto • Tenor • Soprano • Baritono", "GUIA PROFISSIONAL • 18+ PAGINAS", COLORS.blue, [
    "Tabela completa de 12 tonalidades",
    "4 saxofones cobertos (Alto, Tenor, Soprano, Baritono)",
    "Metodo pratico de 3 passos",
    "13 armaduras de clave com notas alteradas",
    "8 cifras comuns ja transpostas",
    "Dicas praticas por situacao (igreja, banda, evento)",
    "Tabela de bolso para imprimir",
  ], logoBase64);

  // TOC
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 18, color: COLORS.white, style: "bold", align: "center" });
  
  const tocItems = [
    "1. Metodo de 3 Passos .......... pag. 3",
    "2. Tabela de Transposicao — 12 Tonalidades .......... pag. 4",
    "3. Armaduras de Clave .......... pag. 6",
    "4. Cifras Comuns Transpostas .......... pag. 8",
    "5. Dicas Praticas por Situacao .......... pag. 10",
    "6. Resumo Rapido para Decorar .......... pag. 11",
    "7. Tabela de Bolso (imprimir) .......... pag. 12",
  ];
  
  drawRoundedRect(doc, MARGIN + 5, 45, CONTENT_W - 10, tocItems.length * 10 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 57 + i * 10, { size: 10, color: COLORS.white });
  });

  // 3 PASSOS
  doc.addPage();
  drawPageBg(doc);
  let y = drawSectionHeader(doc, MARGIN, "Como Transpor — 3 Passos", "Metodo visual e pratico", COLORS.blue);
  y += 5;

  passos.forEach((p) => {
    y = ensureSpace(doc, y, 22);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 18, 3, COLORS.cardBg);
    drawRoundedRect(doc, MARGIN + 4, y + 3, 12, 12, 6, COLORS.blue);
    addText(doc, p.n, MARGIN + 10, y + 11, { size: 12, color: COLORS.white, style: "bold", align: "center" });
    addText(doc, p.titulo, MARGIN + 20, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, p.desc, MARGIN + 20, y + 13, { size: 8, color: COLORS.muted, maxWidth: CONTENT_W - 30 });
    y += 22;
  });

  y += 5;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.lightCardBg);
  addText(doc, "REGRA RAPIDA:", MARGIN + 5, y + 5.5, { size: 9, color: COLORS.amber, style: "bold" });
  addText(doc, "Alto/Baritono (Eb) = sobe 3 semitons  |  Tenor/Soprano (Bb) = sobe 2 semitons", MARGIN + 5, y + 10.5, { size: 8, color: COLORS.white });

  // TABELA DE TRANSPOSIÇÃO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Tabela de Transposicao", "12 Tonalidades — Concert Pitch → Alto (Eb) → Tenor (Bb)", COLORS.blue);
  y += 3;

  // Table header
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.blue);
  addText(doc, "CONCERT PITCH", MARGIN + 5, y + 7, { size: 8, color: COLORS.white, style: "bold" });
  addText(doc, "SAX ALTO (Eb)", MARGIN + 65, y + 7, { size: 8, color: COLORS.white, style: "bold" });
  addText(doc, "SAX TENOR (Bb)", MARGIN + 125, y + 7, { size: 8, color: COLORS.white, style: "bold" });
  y += 12;

  tabelaTransposicao.forEach((row, i) => {
    y = ensureSpace(doc, y, 10);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 9, 1, bg);
    addText(doc, row.concert, MARGIN + 5, y + 6.5, { size: 9, color: COLORS.white, style: "bold" });
    addText(doc, row.alto, MARGIN + 65, y + 6.5, { size: 9, color: COLORS.cyan });
    addText(doc, row.tenor, MARGIN + 125, y + 6.5, { size: 9, color: COLORS.amber });
    y += 10;
  });

  y += 3;
  y = ensureSpace(doc, y, 18);
  drawRoundedRect(doc, MARGIN, y, CONTENT_W / 2 - 2, 14, 3, COLORS.lightCardBg);
  addText(doc, "Soprano (Bb):", MARGIN + 5, y + 6, { size: 8, color: COLORS.cyan, style: "bold" });
  addText(doc, "Mesma coluna do Tenor", MARGIN + 5, y + 11, { size: 8, color: COLORS.muted });

  drawRoundedRect(doc, MARGIN + CONTENT_W / 2 + 2, y, CONTENT_W / 2 - 2, 14, 3, COLORS.lightCardBg);
  addText(doc, "Baritono (Eb):", MARGIN + CONTENT_W / 2 + 7, y + 6, { size: 8, color: COLORS.cyan, style: "bold" });
  addText(doc, "Mesma coluna do Alto (oitava abaixo)", MARGIN + CONTENT_W / 2 + 7, y + 11, { size: 8, color: COLORS.muted });

  // ARMADURAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Armaduras de Clave", "Quantos sustenidos (#) ou bemois (b) por tonalidade", COLORS.blue);
  y += 3;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 8, 2, COLORS.blue);
  addText(doc, "TONALIDADE", MARGIN + 5, y + 5.5, { size: 7, color: COLORS.white, style: "bold" });
  addText(doc, "ACIDENTES", MARGIN + 80, y + 5.5, { size: 7, color: COLORS.white, style: "bold" });
  addText(doc, "NOTAS ALTERADAS", MARGIN + 105, y + 5.5, { size: 7, color: COLORS.white, style: "bold" });
  y += 9;

  armaduras.forEach((row, i) => {
    y = ensureSpace(doc, y, 8);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 7.5, 1, bg);
    addText(doc, row.tom, MARGIN + 5, y + 5.5, { size: 7.5, color: COLORS.white, style: "bold" });
    addText(doc, row.acidentes, MARGIN + 80, y + 5.5, { size: 7.5, color: COLORS.amber, style: "bold" });
    addText(doc, row.notas, MARGIN + 105, y + 5.5, { size: 7, color: COLORS.muted });
    y += 8;
  });

  y += 4;
  y = ensureSpace(doc, y, 12);
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 12, 3, COLORS.lightCardBg);
  addText(doc, "MACETE:", MARGIN + 5, y + 5, { size: 8, color: COLORS.amber, style: "bold" });
  addText(doc, "Sustenidos: Fa, Do, Sol, Re, La, Mi, Si  |  Bemois: inverso — Si, Mi, La, Re, Sol, Do, Fa", MARGIN + 5, y + 10, { size: 7.5, color: COLORS.white });

  // CIFRAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cifras Comuns — Ja Transpostas", "As progressoes que voce mais encontra — prontas para tocar", COLORS.blue);
  y += 3;

  cifras.forEach((c) => {
    y = ensureSpace(doc, y, 24);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 20, 3, COLORS.cardBg);
    addText(doc, c.nome, MARGIN + 5, y + 6, { size: 9, color: COLORS.blue, style: "bold" });
    addText(doc, `Original: ${c.original}`, MARGIN + 5, y + 12, { size: 8, color: COLORS.muted });
    addText(doc, `Alto: ${c.alto}`, MARGIN + 5, y + 16.5, { size: 8, color: COLORS.cyan });
    addText(doc, `Tenor: ${c.tenor}`, MARGIN + CONTENT_W / 2, y + 16.5, { size: 8, color: COLORS.amber });
    y += 23;
  });

  // DICAS PRÁTICAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Dicas Praticas por Situacao", "Como aplicar a transposicao na vida real", COLORS.blue);
  y += 3;

  const dicas = [
    { titulo: "Tocando com pianista", texto: "Pianista esta em Concert Pitch. Se ele diz 'Tom de Sol', Alto toca Mi, Tenor toca La." },
    { titulo: "Tocando com guitarrista", texto: "Guitarra/violao tambem e Concert Pitch. Mesma regra do piano." },
    { titulo: "Tocando na igreja", texto: "Se o lider diz 'a musica e em Re', Alto toca Si, Tenor toca Mi." },
    { titulo: "Tocando com outro sopro", texto: "Trompete (Bb) passa partitura pro Alto (Eb): ache Concert Pitch, depois coluna do Alto." },
    { titulo: "Dica rapida de emergencia", texto: "Alto: suba 3 semitons. Tenor: suba 2 semitons. Conte no teclado." },
  ];

  dicas.forEach((d) => {
    y = ensureSpace(doc, y, 18);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.cardBg);
    addText(doc, d.titulo, MARGIN + 5, y + 6, { size: 9, color: COLORS.white, style: "bold" });
    addText(doc, d.texto, MARGIN + 5, y + 11, { size: 8, color: COLORS.muted, maxWidth: CONTENT_W - 10 });
    y += 17;
  });

  // RESUMO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Resumo Rapido para Decorar", "Cole esta pagina no seu caderno de cifras", COLORS.blue);
  y += 8;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W / 2 - 3, 35, 4, COLORS.cardBg);
  addText(doc, "SAX ALTO / BARITONO (Eb)", MARGIN + 5, y + 8, { size: 10, color: COLORS.cyan, style: "bold" });
  addText(doc, "Toque uma terca menor acima", MARGIN + 5, y + 15, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "(3 semitons) da nota Concert.", MARGIN + 5, y + 20.5, { size: 9, color: COLORS.white });
  addText(doc, "Cifra Do → toque La", MARGIN + 5, y + 27, { size: 9, color: COLORS.amber });
  addText(doc, "Cifra Fa → toque Re", MARGIN + 5, y + 32, { size: 9, color: COLORS.amber });

  drawRoundedRect(doc, MARGIN + CONTENT_W / 2 + 3, y, CONTENT_W / 2 - 3, 35, 4, COLORS.cardBg);
  addText(doc, "SAX TENOR / SOPRANO (Bb)", MARGIN + CONTENT_W / 2 + 8, y + 8, { size: 10, color: COLORS.amber, style: "bold" });
  addText(doc, "Toque um tom acima", MARGIN + CONTENT_W / 2 + 8, y + 15, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "(2 semitons) da nota Concert.", MARGIN + CONTENT_W / 2 + 8, y + 20.5, { size: 9, color: COLORS.white });
  addText(doc, "Cifra Do → toque Re", MARGIN + CONTENT_W / 2 + 8, y + 27, { size: 9, color: COLORS.amber });
  addText(doc, "Cifra Fa → toque Sol", MARGIN + CONTENT_W / 2 + 8, y + 32, { size: 9, color: COLORS.amber });

  // TABELA DE BOLSO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Tabela de Bolso", "Recorte e guarde no case do sax", COLORS.blue);
  y += 5;

  // Compact table
  doc.setDrawColor(100, 100, 100);
  const colW = CONTENT_W / 3;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 8, 2, COLORS.blue);
  addText(doc, "CONCERT", MARGIN + colW * 0.5, y + 5.5, { size: 8, color: COLORS.white, style: "bold", align: "center" });
  addText(doc, "ALTO (Eb)", MARGIN + colW * 1.5, y + 5.5, { size: 8, color: COLORS.white, style: "bold", align: "center" });
  addText(doc, "TENOR (Bb)", MARGIN + colW * 2.5, y + 5.5, { size: 8, color: COLORS.white, style: "bold", align: "center" });
  y += 9;

  tabelaTransposicao.forEach((row, i) => {
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 7, 1, bg);
    addText(doc, row.concert, MARGIN + colW * 0.5, y + 5, { size: 8, color: COLORS.white, style: "bold", align: "center" });
    addText(doc, row.alto, MARGIN + colW * 1.5, y + 5, { size: 8, color: COLORS.cyan, align: "center" });
    addText(doc, row.tenor, MARGIN + colW * 2.5, y + 5, { size: 8, color: COLORS.amber, align: "center" });
    y += 7.5;
  });

  y += 5;
  addText(doc, "Soprano = coluna Tenor  |  Baritono = coluna Alto", PAGE_W / 2, y, { size: 8, color: COLORS.muted, align: "center" });

  addPageNumber(doc, logoBase64);
  doc.save("Kit-Transposicao-Instantanea-Clube-do-Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF 3 — MANUTENÇÃO DO SAX
   ═══════════════════════════════════════════════════════════ */

export async function generateManutencaoPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const cuidadosDiarios = [
    { acao: "Passar o swab (flanela) interno", como: "Insira o swab pelo sino e puxe pela campana. Repita 2-3x ate sair seco.", porque: "Remove umidade que causa oxidacao e mau cheiro." },
    { acao: "Secar a boquilha", como: "Remova a boquilha. Passe pano macio por dentro e fora.", porque: "Umidade cria depositos minerais que alteram o som." },
    { acao: "Remover e secar a palheta", como: "Tire a palheta. Seque com pano. Guarde no protetor (reed guard).", porque: "Palheta molhada empenha, cria mofo e perde vida util." },
    { acao: "Limpar o exterior do sax", como: "Pano de microfibra no corpo, chaves e campana. Sem quimicos.", porque: "Suor das maos e acido e corroi o acabamento." },
    { acao: "Guardar corretamente no case", como: "Sax no case com chaves para cima. Feche completamente.", porque: "Case aberto acumula poeira nas sapatilhas." },
  ];

  const cuidadosSemanais = [
    { acao: "Limpar as sapatilhas", como: "Papel de seda sob a sapatilha, pressione e puxe suavemente.", porque: "Sapatilhas grudadas = notas que nao respondem." },
    { acao: "Verificar folgas nas chaves", como: "Pressione cada chave. Se tem 'jogo' lateral ou barulho, anote.", porque: "Folga = ar escapando = notas falhando." },
    { acao: "Lubrificar articulacoes", como: "1 gota de oleo fino para instrumentos em cada articulacao.", porque: "Chaves sem lubrificacao ficam duras." },
    { acao: "Teste cromatico completo", como: "Toque Sib grave ao Fa# agudo, uma por uma, em piano (p).", porque: "Notas que falham em piano revelam vazamentos." },
  ];

  const cuidadosMensais = [
    { acao: "Inspecionar todas as corticas", como: "Procure rachaduras, ressecamento ou corticas soltas.", porque: "Cortica gasta = chave sem vedacao = vazamento." },
    { acao: "Verificar cortica do tudel", como: "Encaixe a boquilha. Deve ter resistencia leve e firme.", porque: "Boquilha solta desafina. Troca custa R$15-30." },
    { acao: "Teste de vazamento", como: "Feche tudo, papel sob sapatilha, feche chave e puxe.", porque: "Detecta vazamentos antes de afetar o som." },
    { acao: "Verificar feltros de batente", como: "Pequenos feltros que limitam chaves. Se achatados, regulagem muda.", porque: "Feltros achatados = afinacao comprometida." },
    { acao: "Limpar interior do tudel", como: "Escova flexivel especifica. Passe suavemente.", porque: "Depositos afetam fluxo de ar e resposta." },
  ];

  const sinaisAlerta = [
    { sinal: "Notas graves nao saem ou saem fracas", gravidade: "ALTA", causa: "Sapatilha com vazamento", acao: "Leve ao luthier. NAO use Super Bonder.", custo: "R$ 30-80/sapatilha" },
    { sinal: "Barulho metalico ao tocar", gravidade: "MEDIA", causa: "Parafuso solto ou mola desencaixada", acao: "Luthier resolve em 5-10 min.", custo: "R$ 20-50" },
    { sinal: "Boquilha nao encaixa ou fica solta", gravidade: "MEDIA", causa: "Cortica do tudel gasta", acao: "Troca de cortica. Veda-rosca temporario.", custo: "R$ 15-30" },
    { sinal: "Chave travada ou muito dura", gravidade: "MEDIA", causa: "Falta de lubrificacao ou sujeira", acao: "Tente 1 gota de oleo. Se persistir, luthier.", custo: "R$ 20-40" },
    { sinal: "Afinacao muito instavel", gravidade: "MEDIA", causa: "Multiplas causas possiveis", acao: "Teste palheta nova → boquilha → regulagem.", custo: "R$ 100-250" },
    { sinal: "Cheiro forte ou mofo no case", gravidade: "BAIXA", causa: "Umidade acumulada", acao: "Lave com bicarbonato. Silica gel.", custo: "R$ 0" },
  ];

  const palhetas = [
    { titulo: "Como Escolher a Forca", itens: [
      "Iniciante (0-1 ano): palhetas 1.5 a 2",
      "Intermediario (1-3 anos): palhetas 2.5 a 3",
      "Avancado (3+ anos): palhetas 3 a 3.5+",
      "Boquilha mais aberta = palheta mais macia",
    ]},
    { titulo: "Como Amaciar Palhetas", itens: [
      "Dia 1: toque apenas 5 minutos",
      "Dia 2: toque 10 minutos",
      "Dia 3-4: aumente para 15-20 min",
      "Dia 5+: use normalmente",
      "NUNCA toque palheta nova por 1h direto",
    ]},
    { titulo: "Quanto Tempo Dura", itens: [
      "Uso diario (1-2h): 2 a 4 semanas",
      "Uso esporadico: 4 a 8 semanas",
      "Descartar: som 'abafado' ou ponta rachada",
      "Sinteticas duram 3-6 meses (R$80-150)",
    ]},
    { titulo: "Comparativo de Marcas", itens: [
      "Vandoren Tradicional (azul) — Classica, equilibrada",
      "Vandoren Java (verde) — Jazz, pop, MPB",
      "Vandoren V12 (cinza) — Erudito, bossa",
      "D'Addario Select Jazz — Improvisacao",
      "Rico Royal — Bom custo-beneficio",
      "Legere Signature — Sintetica premium",
    ]},
  ];

  const economia = [
    { item: "Sapatilha grudenta", sem: "R$ 50-80 a cada 2 meses", com: "R$ 0 (limpeza semanal)" },
    { item: "Regulagem geral", sem: "R$ 200-350 / 6 meses", com: "R$ 200-350 / 2 anos" },
    { item: "Troca de sapatilhas", sem: "R$ 300-600/ano", com: "R$ 100-200/ano" },
    { item: "Palhetas desperdicadas", sem: "R$ 40-60/mes", com: "R$ 20-35/mes" },
  ];

  // COVER
  drawCoverPage(doc, "Checklist de Manutencao", "+ Guia Completo de Palhetas", "GUIA PROFISSIONAL • 22+ PAGINAS", COLORS.emerald, [
    "5 cuidados diarios essenciais",
    "4 cuidados semanais preventivos",
    "5 inspecoes mensais completas",
    "6 sinais de alerta com custos estimados",
    "Guia completo de palhetas (escolha, amaciamento, marcas)",
    "Checklist imprimivel + Tabela de economia",
  ], logoBase64);

  // TOC
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.emerald);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 18, color: COLORS.white, style: "bold", align: "center" });
  
  const tocItems = [
    "1. Checklist Visual Imprimivel .......... pag. 3",
    "2. Cuidados Diarios (5 minutos) .......... pag. 4",
    "3. Cuidados Semanais (15 minutos) .......... pag. 6",
    "4. Cuidados Mensais (inspecao) .......... pag. 7",
    "5. Sinais de Alerta — Quando ir ao Luthier .......... pag. 9",
    "6. Guia Completo de Palhetas .......... pag. 10",
    "7. Tabela de Economia .......... pag. 12",
    "8. Regra de Ouro .......... pag. 13",
  ];
  
  drawRoundedRect(doc, MARGIN + 5, 45, CONTENT_W - 10, tocItems.length * 10 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 57 + i * 10, { size: 10, color: COLORS.white });
  });

  // CHECKLIST VISUAL
  doc.addPage();
  drawPageBg(doc);
  let y = drawSectionHeader(doc, MARGIN, "Checklist Visual Imprimivel", "Imprima esta pagina e cole no seu espaco de estudo", COLORS.emerald);
  y += 5;

  const colW = (CONTENT_W - 8) / 3;
  const checkGroups = [
    { freq: "DIARIO", color: COLORS.green, items: ["Swab interno (2-3x)", "Secar boquilha", "Secar palheta", "Limpar exterior", "Guardar no case"] },
    { freq: "SEMANAL", color: COLORS.blue, items: ["Limpar sapatilhas", "Verificar folgas", "Lubrificar chaves", "Teste cromatico"] },
    { freq: "MENSAL", color: COLORS.amber, items: ["Inspecionar corticas", "Testar vazamentos", "Verificar feltros", "Limpar tudel", "Cortica bocal ok?"] },
  ];

  checkGroups.forEach((group, gi) => {
    const x = MARGIN + gi * (colW + 4);
    const h = group.items.length * 8 + 14;
    drawRoundedRect(doc, x, y, colW, h, 3, COLORS.cardBg);
    drawRoundedRect(doc, x, y, colW, 10, 3, group.color);
    // Fix bottom corners of header
    doc.setFillColor(...group.color);
    doc.rect(x, y + 6, colW, 4, "F");
    addText(doc, group.freq, x + colW / 2, y + 7, { size: 9, color: COLORS.white, style: "bold", align: "center" });
    group.items.forEach((item, j) => {
      addText(doc, `☐  ${item}`, x + 5, y + 17 + j * 8, { size: 8, color: COLORS.white });
    });
  });

  // CUIDADOS DIÁRIOS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Diarios", "5 minutos que salvam seu sax — previnem 80% dos problemas", COLORS.green);
  y += 3;

  cuidadosDiarios.forEach((item) => {
    y = ensureSpace(doc, y, 24);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 20, 3, COLORS.cardBg);
    addText(doc, `✓ ${item.acao}`, MARGIN + 5, y + 6, { size: 9, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 11.5, { size: 8, color: COLORS.muted });
    addText(doc, `→ ${item.porque}`, MARGIN + 5, y + 16.5, { size: 8, color: COLORS.emerald, style: "italic" });
    y += 23;
  });

  // CUIDADOS SEMANAIS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Semanais", "15 minutos por semana — manutencao preventiva", COLORS.blue);
  y += 3;

  cuidadosSemanais.forEach((item) => {
    y = ensureSpace(doc, y, 24);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 20, 3, COLORS.cardBg);
    addText(doc, `✓ ${item.acao}`, MARGIN + 5, y + 6, { size: 9, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 11.5, { size: 8, color: COLORS.muted });
    addText(doc, `→ ${item.porque}`, MARGIN + 5, y + 16.5, { size: 8, color: COLORS.blue, style: "italic" });
    y += 23;
  });

  // CUIDADOS MENSAIS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Mensais", "Inspecao completa — detecte problemas cedo", COLORS.amber);
  y += 3;

  cuidadosMensais.forEach((item) => {
    y = ensureSpace(doc, y, 24);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 20, 3, COLORS.cardBg);
    addText(doc, `✓ ${item.acao}`, MARGIN + 5, y + 6, { size: 9, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 11.5, { size: 8, color: COLORS.muted });
    addText(doc, `→ ${item.porque}`, MARGIN + 5, y + 16.5, { size: 8, color: COLORS.amber, style: "italic" });
    y += 23;
  });

  // SINAIS DE ALERTA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Sinais de Alerta", "Quando procurar o luthier — com custos estimados", COLORS.red);
  y += 3;

  sinaisAlerta.forEach((item) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, item.sinal, MARGIN + 5, y + 6, { size: 9, color: COLORS.white, style: "bold" });
    const gravColor = item.gravidade === "ALTA" ? COLORS.red : item.gravidade === "MEDIA" ? COLORS.amber : COLORS.green;
    addText(doc, item.gravidade, MARGIN + CONTENT_W - 25, y + 6, { size: 7, color: gravColor, style: "bold" });
    addText(doc, `Causa: ${item.causa}`, MARGIN + 5, y + 11.5, { size: 8, color: COLORS.muted });
    addText(doc, `Acao: ${item.acao}`, MARGIN + 5, y + 16.5, { size: 8, color: COLORS.white });
    addText(doc, `Custo estimado: ${item.custo}`, MARGIN + 5, y + 21, { size: 8, color: COLORS.amber, style: "italic" });
    y += 27;
  });

  // GUIA DE PALHETAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Guia Completo de Palhetas", "Escolher, amaciar e cuidar — economia real", COLORS.emerald);
  y += 3;

  palhetas.forEach((sec) => {
    y = ensureSpace(doc, y, sec.itens.length * 6 + 16);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, sec.itens.length * 6 + 12, 3, COLORS.cardBg);
    addText(doc, sec.titulo, MARGIN + 5, y + 7, { size: 10, color: COLORS.emerald, style: "bold" });
    sec.itens.forEach((item, j) => {
      addText(doc, `• ${item}`, MARGIN + 8, y + 14 + j * 6, { size: 8, color: COLORS.white });
    });
    y += sec.itens.length * 6 + 16;
  });

  // TABELA DE ECONOMIA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Quanto Voce Economiza", "Comparativo real: com vs sem manutencao preventiva", COLORS.emerald);
  y += 3;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.emerald);
  addText(doc, "PROBLEMA", MARGIN + 5, y + 7, { size: 8, color: COLORS.white, style: "bold" });
  addText(doc, "SEM CUIDADO", MARGIN + 75, y + 7, { size: 8, color: COLORS.red, style: "bold" });
  addText(doc, "COM ESTE GUIA", MARGIN + 130, y + 7, { size: 8, color: COLORS.green, style: "bold" });
  y += 12;

  economia.forEach((row, i) => {
    y = ensureSpace(doc, y, 10);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 9, 1, bg);
    addText(doc, row.item, MARGIN + 5, y + 6.5, { size: 8, color: COLORS.white, style: "bold" });
    addText(doc, row.sem, MARGIN + 75, y + 6.5, { size: 8, color: COLORS.red });
    addText(doc, row.com, MARGIN + 130, y + 6.5, { size: 8, color: COLORS.green });
    y += 10;
  });

  y += 6;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.lightCardBg);
  addText(doc, "ECONOMIA ESTIMADA:", MARGIN + 5, y + 6, { size: 9, color: COLORS.amber, style: "bold" });
  addText(doc, "R$ 500 a R$ 1.000 por ano seguindo este checklist. O guia se paga na primeira semana.", MARGIN + 5, y + 11.5, { size: 8, color: COLORS.white });

  // REGRA DE OURO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Regra de Ouro", "O segredo dos profissionais", COLORS.emerald);
  y += 8;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 40, 4, COLORS.cardBg);
  addText(doc, "5 minutos de cuidado apos cada sessao", MARGIN + 8, y + 12, { size: 13, color: COLORS.emerald, style: "bold" });
  addText(doc, "economizam horas no luthier e", MARGIN + 8, y + 20, { size: 12, color: COLORS.white });
  addText(doc, "centenas de reais por ano.", MARGIN + 8, y + 27, { size: 12, color: COLORS.white });
  addText(doc, "Imprima o checklist. Cole no espaco de estudo. Transforme em habito.", MARGIN + 8, y + 35, { size: 9, color: COLORS.muted, style: "italic" });

  addPageNumber(doc, logoBase64);
  doc.save("Checklist-Manutencao-Sax-Clube-do-Sax.pdf");
}
