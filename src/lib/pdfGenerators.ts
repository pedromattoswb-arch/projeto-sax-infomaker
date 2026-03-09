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
    addText(doc, "SAXPLAY", PAGE_W / 2, 28, { size: 12, color: COLORS.muted, style: "normal", align: "center" });
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
  y = ensureSpace(doc, y, 24);
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 22, 4, color);
  addText(doc, title.toUpperCase(), MARGIN + 8, y + 10, { size: 14, color: COLORS.white, style: "bold" });
  addText(doc, subtitle, MARGIN + 8, y + 18, { size: 10, color: [255, 255, 255] });
  return y + 26;
}

function drawSeparator(doc: jsPDF, y: number, color: [number, number, number], style: "line" | "dots" | "gradient" = "line"): number {
  y = ensureSpace(doc, y, 8);
  if (style === "dots") {
    const dotCount = 15;
    const spacing = CONTENT_W / (dotCount + 1);
    for (let i = 1; i <= dotCount; i++) {
      doc.setFillColor(...color);
      doc.circle(MARGIN + i * spacing, y + 3, 0.8, "F");
    }
  } else if (style === "gradient") {
    // Gradient-like bar with accent color
    doc.setFillColor(...color);
    doc.roundedRect(MARGIN + 30, y + 2, CONTENT_W - 60, 1.5, 0.75, 0.75, "F");
    // Small diamond accent in center
    doc.setFillColor(...color);
    const cx = PAGE_W / 2;
    doc.circle(cx, y + 2.75, 2, "F");
    doc.setFillColor(...COLORS.darkBg);
    doc.circle(cx, y + 2.75, 1, "F");
  } else {
    doc.setFillColor(...color);
    doc.roundedRect(MARGIN + 20, y + 2.5, CONTENT_W - 40, 0.8, 0.4, 0.4, "F");
  }
  return y + 8;
}

function drawAccentBar(doc: jsPDF, y: number, color: [number, number, number]): number {
  doc.setFillColor(...color);
  doc.roundedRect(MARGIN, y, 3, 12, 1.5, 1.5, "F");
  return y;
}

function drawHighlightBox(doc: jsPDF, y: number, title: string, text: string, color: [number, number, number]): number {
  y = ensureSpace(doc, y, 40);
  doc.setFillColor(...color);
  doc.roundedRect(MARGIN, y, CONTENT_W, 35, 4, 4, "F");
  drawRoundedRect(doc, MARGIN + 1.5, y + 1.5, CONTENT_W - 3, 32, 3, COLORS.cardBg);
  doc.setFillColor(...color);
  doc.roundedRect(MARGIN + 1.5, y + 6, 2.5, 22, 1, 1, "F");
  addText(doc, title, MARGIN + 10, y + 15, { size: 16, color, style: "bold" });
  addText(doc, text, MARGIN + 10, y + 25, { size: 12, color: COLORS.white });
  return y + 40;
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
      y = ensureSpace(doc, y, 26);
      drawRoundedRect(doc, MARGIN, y, CONTENT_W, 22, 3, COLORS.cardBg);
      addText(doc, nota.nota, MARGIN + 5, y + 7, { size: 13, color: COLORS.white, style: "bold" });
      addText(doc, `Chaves: ${nota.chaves}`, MARGIN + 5, y + 13, { size: 10, color: COLORS.muted, maxWidth: CONTENT_W - 10 });
      addText(doc, `→ ${nota.dica}`, MARGIN + 5, y + 19, { size: 10, color: reg.color, style: "italic" });
      y += 25;
    });
  });

  // ALTERNATIVAS
  doc.addPage();
  drawPageBg(doc);
  let y = drawSectionHeader(doc, MARGIN, "Digitacoes Alternativas", "Para passagens rapidas, trinados e transicoes dificeis", COLORS.violet);
  y += 3;

  alternativas.forEach((alt) => {
    y = ensureSpace(doc, y, 30);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 26, 3, COLORS.cardBg);
    addText(doc, alt.titulo, MARGIN + 5, y + 7, { size: 12, color: COLORS.white, style: "bold" });
    addText(doc, `Contexto: ${alt.contexto}`, MARGIN + 5, y + 13, { size: 10, color: COLORS.muted, style: "italic" });
    addText(doc, `Como: ${alt.como}`, MARGIN + 5, y + 18.5, { size: 10, color: COLORS.white });
    addText(doc, `Quando usar: ${alt.quando}`, MARGIN + 5, y + 23.5, { size: 10, color: COLORS.violet });
    y += 29;
  });

  // EMBOCADURA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Embocadura por Registro", "A embocadura muda conforme o registro", COLORS.violet);
  y += 3;

  embocadura.forEach((reg) => {
    y = ensureSpace(doc, y, 40);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, reg.dicas.length * 7 + 14, 3, COLORS.cardBg);
    addText(doc, reg.registro.toUpperCase(), MARGIN + 5, y + 9, { size: 12, color: COLORS.violet, style: "bold" });
    reg.dicas.forEach((d, j) => {
      addText(doc, `• ${d}`, MARGIN + 8, y + 17 + j * 7, { size: 11, color: COLORS.white });
    });
    y += reg.dicas.length * 7 + 18;
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
    y = ensureSpace(doc, y, 40);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, ex.passos.length * 7 + 14, 3, COLORS.cardBg);
    addText(doc, ex.titulo, MARGIN + 5, y + 9, { size: 12, color: COLORS.red, style: "bold" });
    ex.passos.forEach((p, j) => {
      addText(doc, `${j + 1}. ${p}`, MARGIN + 8, y + 17 + j * 7, { size: 11, color: COLORS.white });
    });
    y += ex.passos.length * 7 + 18;
  });

  // DICA DE OURO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Dica de Ouro", "Rotina sugerida de pratica", COLORS.violet);
  y += 5;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 50, 4, COLORS.cardBg);
  addText(doc, "Nao decore — internalize.", MARGIN + 8, y + 12, { size: 14, color: COLORS.violet, style: "bold" });
  y = addWrappedText(doc, "Pratique cada nota ate que seus dedos se movam automaticamente. A tabela e para consulta, nao para decorar.", MARGIN + 8, y + 22, CONTENT_W - 16, { size: 12, color: COLORS.white });
  y += 5;
  addText(doc, "ROTINA SUGERIDA:", MARGIN + 8, y, { size: 12, color: COLORS.amber, style: "bold" });
  y = addWrappedText(doc, "Escolha 1 registro por dia. Toque cada nota 4 tempos (q = 60), foco em timbre e afinacao. Em 4 dias, voce cobriu todo o sax.", MARGIN + 8, y + 7, CONTENT_W - 16, { size: 11, color: COLORS.white });

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
    y = ensureSpace(doc, y, 26);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 22, 3, COLORS.cardBg);
    drawRoundedRect(doc, MARGIN + 4, y + 3, 14, 14, 7, COLORS.blue);
    addText(doc, p.n, MARGIN + 11, y + 12.5, { size: 14, color: COLORS.white, style: "bold", align: "center" });
    addText(doc, p.titulo, MARGIN + 22, y + 8, { size: 13, color: COLORS.white, style: "bold" });
    addText(doc, p.desc, MARGIN + 22, y + 15, { size: 10, color: COLORS.muted, maxWidth: CONTENT_W - 30 });
    y += 25;
  });

  y += 5;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 16, 3, COLORS.lightCardBg);
  addText(doc, "REGRA RAPIDA:", MARGIN + 5, y + 6.5, { size: 11, color: COLORS.amber, style: "bold" });
  addText(doc, "Alto/Baritono (Eb) = sobe 3 semitons  |  Tenor/Soprano (Bb) = sobe 2 semitons", MARGIN + 5, y + 12.5, { size: 10, color: COLORS.white });

  // TABELA DE TRANSPOSIÇÃO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Tabela de Transposicao", "12 Tonalidades — Concert Pitch → Alto (Eb) → Tenor (Bb)", COLORS.blue);
  y += 3;

  // Table header
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 12, 2, COLORS.blue);
  addText(doc, "CONCERT PITCH", MARGIN + 5, y + 8, { size: 10, color: COLORS.white, style: "bold" });
  addText(doc, "SAX ALTO (Eb)", MARGIN + 65, y + 8, { size: 10, color: COLORS.white, style: "bold" });
  addText(doc, "SAX TENOR (Bb)", MARGIN + 125, y + 8, { size: 10, color: COLORS.white, style: "bold" });
  y += 14;

  tabelaTransposicao.forEach((row, i) => {
    y = ensureSpace(doc, y, 12);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 11, 1, bg);
    addText(doc, row.concert, MARGIN + 5, y + 7.5, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, row.alto, MARGIN + 65, y + 7.5, { size: 11, color: COLORS.cyan });
    addText(doc, row.tenor, MARGIN + 125, y + 7.5, { size: 11, color: COLORS.amber });
    y += 12;
  });

  y += 3;
  y = ensureSpace(doc, y, 18);
  drawRoundedRect(doc, MARGIN, y, CONTENT_W / 2 - 2, 16, 3, COLORS.lightCardBg);
  addText(doc, "Soprano (Bb):", MARGIN + 5, y + 7, { size: 10, color: COLORS.cyan, style: "bold" });
  addText(doc, "Mesma coluna do Tenor", MARGIN + 5, y + 13, { size: 10, color: COLORS.muted });

  drawRoundedRect(doc, MARGIN + CONTENT_W / 2 + 2, y, CONTENT_W / 2 - 2, 16, 3, COLORS.lightCardBg);
  addText(doc, "Baritono (Eb):", MARGIN + CONTENT_W / 2 + 7, y + 7, { size: 10, color: COLORS.cyan, style: "bold" });
  addText(doc, "Mesma coluna do Alto (oitava abaixo)", MARGIN + CONTENT_W / 2 + 7, y + 13, { size: 10, color: COLORS.muted });

  // ARMADURAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Armaduras de Clave", "Quantos sustenidos (#) ou bemois (b) por tonalidade", COLORS.blue);
  y += 3;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.blue);
  addText(doc, "TONALIDADE", MARGIN + 5, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "ACIDENTES", MARGIN + 80, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "NOTAS ALTERADAS", MARGIN + 105, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  y += 11;

  armaduras.forEach((row, i) => {
    y = ensureSpace(doc, y, 10);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 9, 1, bg);
    addText(doc, row.tom, MARGIN + 5, y + 6.5, { size: 10, color: COLORS.white, style: "bold" });
    addText(doc, row.acidentes, MARGIN + 80, y + 6.5, { size: 10, color: COLORS.amber, style: "bold" });
    addText(doc, row.notas, MARGIN + 105, y + 6.5, { size: 9, color: COLORS.muted });
    y += 10;
  });

  y += 4;
  y = ensureSpace(doc, y, 14);
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.lightCardBg);
  addText(doc, "MACETE:", MARGIN + 5, y + 5.5, { size: 10, color: COLORS.amber, style: "bold" });
  addText(doc, "Sustenidos: Fa, Do, Sol, Re, La, Mi, Si  |  Bemois: inverso — Si, Mi, La, Re, Sol, Do, Fa", MARGIN + 5, y + 11, { size: 9, color: COLORS.white });

  // CIFRAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cifras Comuns — Ja Transpostas", "As progressoes que voce mais encontra — prontas para tocar", COLORS.blue);
  y += 3;

  cifras.forEach((c) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, c.nome, MARGIN + 5, y + 7, { size: 11, color: COLORS.blue, style: "bold" });
    addText(doc, `Original: ${c.original}`, MARGIN + 5, y + 13.5, { size: 10, color: COLORS.muted });
    addText(doc, `Alto: ${c.alto}`, MARGIN + 5, y + 19.5, { size: 10, color: COLORS.cyan });
    addText(doc, `Tenor: ${c.tenor}`, MARGIN + CONTENT_W / 2, y + 19.5, { size: 10, color: COLORS.amber });
    y += 27;
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
    y = ensureSpace(doc, y, 22);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 18, 3, COLORS.cardBg);
    addText(doc, d.titulo, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, d.texto, MARGIN + 5, y + 14, { size: 10, color: COLORS.muted, maxWidth: CONTENT_W - 10 });
    y += 21;
  });

  // RESUMO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Resumo Rapido para Decorar", "Cole esta pagina no seu caderno de cifras", COLORS.blue);
  y += 8;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W / 2 - 3, 40, 4, COLORS.cardBg);
  addText(doc, "SAX ALTO / BARITONO (Eb)", MARGIN + 5, y + 9, { size: 12, color: COLORS.cyan, style: "bold" });
  addText(doc, "Toque uma terca menor acima", MARGIN + 5, y + 17, { size: 11, color: COLORS.white, style: "bold" });
  addText(doc, "(3 semitons) da nota Concert.", MARGIN + 5, y + 23, { size: 11, color: COLORS.white });
  addText(doc, "Cifra Do → toque La", MARGIN + 5, y + 30, { size: 11, color: COLORS.amber });
  addText(doc, "Cifra Fa → toque Re", MARGIN + 5, y + 36, { size: 11, color: COLORS.amber });

  drawRoundedRect(doc, MARGIN + CONTENT_W / 2 + 3, y, CONTENT_W / 2 - 3, 40, 4, COLORS.cardBg);
  addText(doc, "SAX TENOR / SOPRANO (Bb)", MARGIN + CONTENT_W / 2 + 8, y + 9, { size: 12, color: COLORS.amber, style: "bold" });
  addText(doc, "Toque um tom acima", MARGIN + CONTENT_W / 2 + 8, y + 17, { size: 11, color: COLORS.white, style: "bold" });
  addText(doc, "(2 semitons) da nota Concert.", MARGIN + CONTENT_W / 2 + 8, y + 23, { size: 11, color: COLORS.white });
  addText(doc, "Cifra Do → toque Re", MARGIN + CONTENT_W / 2 + 8, y + 30, { size: 11, color: COLORS.amber });
  addText(doc, "Cifra Fa → toque Sol", MARGIN + CONTENT_W / 2 + 8, y + 36, { size: 11, color: COLORS.amber });

  // TABELA DE BOLSO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Tabela de Bolso", "Recorte e guarde no case do sax", COLORS.blue);
  y += 5;

  // Compact table
  doc.setDrawColor(100, 100, 100);
  const colW = CONTENT_W / 3;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.blue);
  addText(doc, "CONCERT", MARGIN + colW * 0.5, y + 7, { size: 10, color: COLORS.white, style: "bold", align: "center" });
  addText(doc, "ALTO (Eb)", MARGIN + colW * 1.5, y + 7, { size: 10, color: COLORS.white, style: "bold", align: "center" });
  addText(doc, "TENOR (Bb)", MARGIN + colW * 2.5, y + 7, { size: 10, color: COLORS.white, style: "bold", align: "center" });
  y += 11;

  tabelaTransposicao.forEach((row, i) => {
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 9, 1, bg);
    addText(doc, row.concert, MARGIN + colW * 0.5, y + 6.5, { size: 10, color: COLORS.white, style: "bold", align: "center" });
    addText(doc, row.alto, MARGIN + colW * 1.5, y + 6.5, { size: 10, color: COLORS.cyan, align: "center" });
    addText(doc, row.tenor, MARGIN + colW * 2.5, y + 6.5, { size: 10, color: COLORS.amber, align: "center" });
    y += 9.5;
  });

  y += 5;
  addText(doc, "Soprano = coluna Tenor  |  Baritono = coluna Alto", PAGE_W / 2, y, { size: 10, color: COLORS.muted, align: "center" });

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
    addText(doc, group.freq, x + colW / 2, y + 7, { size: 10, color: COLORS.white, style: "bold", align: "center" });
    group.items.forEach((item, j) => {
      addText(doc, `☐  ${item}`, x + 5, y + 17 + j * 9, { size: 10, color: COLORS.white });
    });
  });

  // CUIDADOS DIÁRIOS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Diarios", "5 minutos que salvam seu sax — previnem 80% dos problemas", COLORS.green);
  y += 3;

  cuidadosDiarios.forEach((item) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, `✓ ${item.acao}`, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 14, { size: 10, color: COLORS.muted });
    addText(doc, `→ ${item.porque}`, MARGIN + 5, y + 20, { size: 10, color: COLORS.emerald, style: "italic" });
    y += 27;
  });

  // CUIDADOS SEMANAIS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Semanais", "15 minutos por semana — manutencao preventiva", COLORS.blue);
  y += 3;

  cuidadosSemanais.forEach((item) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, `✓ ${item.acao}`, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 14, { size: 10, color: COLORS.muted });
    addText(doc, `→ ${item.porque}`, MARGIN + 5, y + 20, { size: 10, color: COLORS.blue, style: "italic" });
    y += 27;
  });

  // CUIDADOS MENSAIS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Mensais", "Inspecao completa — detecte problemas cedo", COLORS.amber);
  y += 3;

  cuidadosMensais.forEach((item) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, `✓ ${item.acao}`, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 14, { size: 10, color: COLORS.muted });
    addText(doc, `→ ${item.porque}`, MARGIN + 5, y + 20, { size: 10, color: COLORS.amber, style: "italic" });
    y += 27;
  });

  // SINAIS DE ALERTA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Sinais de Alerta", "Quando procurar o luthier — com custos estimados", COLORS.red);
  y += 3;

  sinaisAlerta.forEach((item) => {
    y = ensureSpace(doc, y, 32);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 28, 3, COLORS.cardBg);
    addText(doc, item.sinal, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    const gravColor = item.gravidade === "ALTA" ? COLORS.red : item.gravidade === "MEDIA" ? COLORS.amber : COLORS.green;
    addText(doc, item.gravidade, MARGIN + CONTENT_W - 25, y + 7, { size: 9, color: gravColor, style: "bold" });
    addText(doc, `Causa: ${item.causa}`, MARGIN + 5, y + 13.5, { size: 10, color: COLORS.muted });
    addText(doc, `Acao: ${item.acao}`, MARGIN + 5, y + 19.5, { size: 10, color: COLORS.white });
    addText(doc, `Custo estimado: ${item.custo}`, MARGIN + 5, y + 25, { size: 10, color: COLORS.amber, style: "italic" });
    y += 31;
  });

  // GUIA DE PALHETAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Guia Completo de Palhetas", "Escolher, amaciar e cuidar — economia real", COLORS.emerald);
  y += 3;

  palhetas.forEach((sec) => {
    y = ensureSpace(doc, y, sec.itens.length * 7 + 18);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, sec.itens.length * 7 + 14, 3, COLORS.cardBg);
    addText(doc, sec.titulo, MARGIN + 5, y + 8, { size: 12, color: COLORS.emerald, style: "bold" });
    sec.itens.forEach((item, j) => {
      addText(doc, `• ${item}`, MARGIN + 8, y + 16 + j * 7, { size: 10, color: COLORS.white });
    });
    y += sec.itens.length * 7 + 18;
  });

  // TABELA DE ECONOMIA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Quanto Voce Economiza", "Comparativo real: com vs sem manutencao preventiva", COLORS.emerald);
  y += 3;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 12, 2, COLORS.emerald);
  addText(doc, "PROBLEMA", MARGIN + 5, y + 8, { size: 10, color: COLORS.white, style: "bold" });
  addText(doc, "SEM CUIDADO", MARGIN + 75, y + 8, { size: 10, color: COLORS.red, style: "bold" });
  addText(doc, "COM ESTE GUIA", MARGIN + 130, y + 8, { size: 10, color: COLORS.green, style: "bold" });
  y += 14;

  economia.forEach((row, i) => {
    y = ensureSpace(doc, y, 12);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 11, 1, bg);
    addText(doc, row.item, MARGIN + 5, y + 7.5, { size: 10, color: COLORS.white, style: "bold" });
    addText(doc, row.sem, MARGIN + 75, y + 7.5, { size: 10, color: COLORS.red });
    addText(doc, row.com, MARGIN + 130, y + 7.5, { size: 10, color: COLORS.green });
    y += 12;
  });

  y += 6;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 16, 3, COLORS.lightCardBg);
  addText(doc, "ECONOMIA ESTIMADA:", MARGIN + 5, y + 7, { size: 11, color: COLORS.amber, style: "bold" });
  addText(doc, "R$ 500 a R$ 1.000 por ano seguindo este checklist. O guia se paga na primeira semana.", MARGIN + 5, y + 13, { size: 10, color: COLORS.white });

  // REGRA DE OURO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Regra de Ouro", "O segredo dos profissionais", COLORS.emerald);
  y += 8;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 45, 4, COLORS.cardBg);
  addText(doc, "5 minutos de cuidado apos cada sessao", MARGIN + 8, y + 14, { size: 15, color: COLORS.emerald, style: "bold" });
  addText(doc, "economizam horas no luthier e", MARGIN + 8, y + 23, { size: 13, color: COLORS.white });
  addText(doc, "centenas de reais por ano.", MARGIN + 8, y + 31, { size: 13, color: COLORS.white });
  addText(doc, "Imprima o checklist. Cole no espaco de estudo. Transforme em habito.", MARGIN + 8, y + 40, { size: 11, color: COLORS.muted, style: "italic" });

  addPageNumber(doc, logoBase64);
  doc.save("Checklist-Manutencao-Sax-Clube-do-Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF BÔNUS 1 — ROTINA DE ESTUDO PARA SAXOFONISTAS
   ═══════════════════════════════════════════════════════════ */

export async function generateRotinaPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const sections = [
    {
      titulo: "Aquecimento (10-15 min)",
      color: COLORS.emerald,
      icon: "WARM-UP",
      items: [
        "Notas longas: Comece com Sib, Do, Re — toque cada nota por 8 tempos, foco em timbre e afinacao",
        "Respiracao diafragmatica: Inspire 4 tempos, segure 4, expire 8 — repita 5x",
        "Escalas cromaticas lentas: Suba e desca do Sib grave ao Fa# agudo, sem pressa",
        "Glissandos suaves entre notas vizinhas para soltar a embocadura",
      ],
    },
    {
      titulo: "Tecnica (15-20 min)",
      color: COLORS.blue,
      icon: "TECHNIQUE",
      items: [
        "Escalas maiores: Pratique 2 tonalidades por dia (ex: Segunda = Do e Sol, Terca = Re e La)",
        "Escalas menores: Natural, harmonica e melodica — alterne semanalmente",
        "Arpejos: Maior, menor, dominante e diminuto nas mesmas tonalidades",
        "Intervalos de tercas e quartas sobre cada escala",
        "Exercicios de articulacao: staccato, legato, acentuacao — use metronomo",
        "Padroes ritmicos: colcheias, tercinas, semicolcheias com swing e straight",
      ],
    },
    {
      titulo: "Repertorio (20-30 min)",
      color: COLORS.amber,
      icon: "REPERTOIRE",
      items: [
        "Escolha 2-3 musicas do acervo Clube do Sax por semana",
        "Dia 1: Leitura lenta, identificando passagens dificeis",
        "Dia 2: Trabalhe os trechos dificeis isoladamente, em loop",
        "Dia 3: Toque a musica inteira com o playback em andamento lento",
        "Dia 4: Toque no andamento original com o playback",
        "Dia 5: Grave-se tocando e ouca criticamente",
        "Mantenha um repertorio rotativo de 8-10 musicas sempre em pratica",
      ],
    },
    {
      titulo: "Improvisacao (10-15 min)",
      color: COLORS.violet,
      icon: "IMPROV",
      items: [
        "Toque sobre um backing track em tom maior — use apenas a escala pentatonica",
        "Adicione a blue note e cromatismos conforme ganhar confianca",
        "Pratique frases de 2 compassos: crie, repita, varie",
        "Copie solos de referencia (Charlie Parker, Stan Getz, Cannonball Adderley)",
        "Grave seus improvisos e analise o que funcionou",
      ],
    },
    {
      titulo: "Revisao e Desafio Semanal",
      color: COLORS.green,
      icon: "REVIEW",
      items: [
        "Domingo: Revise o que praticou na semana e anote progresso",
        "Escolha 1 musica desafiadora acima do seu nivel atual como meta semanal",
        "Alterne generos: uma semana jazz, outra gospel, outra pop",
        "Registre seu tempo de pratica diario (meta minima: 30 min/dia)",
        "A cada mes, grave uma performance completa para medir evolucao",
      ],
    },
  ];

  const weeklySchedule = [
    { day: "Segunda", focus: "Aquecimento + Tecnica (escalas Do/Sol) + Repertorio" },
    { day: "Terca", focus: "Aquecimento + Tecnica (arpejos) + Improvisacao" },
    { day: "Quarta", focus: "Aquecimento + Repertorio (trechos dificeis) + Leitura a primeira vista" },
    { day: "Quinta", focus: "Aquecimento + Tecnica (escalas Re/La) + Repertorio com playback" },
    { day: "Sexta", focus: "Aquecimento + Improvisacao + Gravacao de repertorio" },
    { day: "Sabado", focus: "Sessao livre: toque o que quiser, explore musicas novas" },
    { day: "Domingo", focus: "Revisao semanal + planejamento da proxima semana" },
  ];

  const dicas = [
    "Consistencia > intensidade: 30 minutos por dia sao melhores que 3 horas no fim de semana",
    "Use metronomo SEMPRE: Comece devagar e aumente 5 BPM por dia",
    "Grave-se: Ouvir sua performance de fora revela erros que voce nao percebe tocando",
    "Varie os generos: Isso desenvolve versatilidade e mantem a motivacao",
    "Descanse: Se a embocadura cansar, pare. Forcar causa maus habitos",
  ];

  // COVER
  drawCoverPage(doc, "Rotina de Estudo", "Para Saxofonistas — Do Iniciante ao Avancado", "BONUS EXCLUSIVO PREMIUM", COLORS.emerald, [
    "Aquecimento estruturado (10-15 min)",
    "Tecnica com escalas, arpejos e articulacao",
    "Repertorio com metodo de 5 dias por musica",
    "Improvisacao guiada com backing tracks",
    "Rotina semanal completa dia a dia",
    "Dicas essenciais dos profissionais",
  ], logoBase64);

  // TOC
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.emerald);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 20, color: COLORS.white, style: "bold", align: "center" });

  // Decorative line under title
  doc.setFillColor(...COLORS.emerald);
  doc.roundedRect(PAGE_W / 2 - 20, 39, 40, 1.5, 0.75, 0.75, "F");

  const tocItems = [
    "1. Aquecimento (10-15 min) .......... pag. 3",
    "2. Tecnica (15-20 min) .......... pag. 4",
    "3. Repertorio (20-30 min) .......... pag. 5",
    "4. Improvisacao (10-15 min) .......... pag. 6",
    "5. Revisao e Desafio Semanal .......... pag. 7",
    "6. Rotina Semanal Sugerida .......... pag. 8",
    "7. Dicas Importantes .......... pag. 9",
  ];

  drawRoundedRect(doc, MARGIN + 5, 48, CONTENT_W - 10, tocItems.length * 12 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 61 + i * 12, { size: 11, color: COLORS.white });
  });

  // SECTIONS
  sections.forEach((sec, secIdx) => {
    doc.addPage();
    drawPageBg(doc);
    
    // Decorative accent bar at top
    doc.setFillColor(...sec.color);
    doc.rect(0, 0, PAGE_W, 3, "F");
    
    let y = drawSectionHeader(doc, MARGIN + 5, sec.titulo, "Etapa da rotina diaria", sec.color);
    y += 4;

    sec.items.forEach((item, idx) => {
      y = ensureSpace(doc, y, 18);
      
      // Card with left accent bar
      drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.cardBg);
      drawAccentBar(doc, y + 1, sec.color);
      
      addText(doc, `${idx + 1}.`, MARGIN + 8, y + 9, { size: 12, color: sec.color, style: "bold" });
      addText(doc, item, MARGIN + 16, y + 9, { size: 10, color: COLORS.white, maxWidth: CONTENT_W - 24 });
      y += 17;
    });

    // Separator between sections
    if (secIdx < sections.length - 1) {
      y = drawSeparator(doc, y + 2, sec.color, "dots");
    }
  });

  // WEEKLY SCHEDULE
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.emerald);
  doc.rect(0, 0, PAGE_W, 3, "F");
  
  let y = drawSectionHeader(doc, MARGIN + 5, "Rotina Semanal Sugerida", "Planejamento dia a dia para maxima evolucao", COLORS.emerald);
  y += 4;

  const dayColors: [number, number, number][] = [COLORS.blue, COLORS.violet, COLORS.amber, COLORS.blue, COLORS.emerald, COLORS.cyan, COLORS.green];

  weeklySchedule.forEach((day, i) => {
    y = ensureSpace(doc, y, 18);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.cardBg);
    
    // Day badge
    drawRoundedRect(doc, MARGIN + 3, y + 2, 28, 10, 2, dayColors[i] || COLORS.emerald);
    addText(doc, day.day, MARGIN + 17, y + 9, { size: 9, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, day.focus, MARGIN + 36, y + 9, { size: 10, color: COLORS.white, maxWidth: CONTENT_W - 42 });
    y += 17;
  });

  // Separator
  y = drawSeparator(doc, y + 4, COLORS.emerald, "gradient");

  // DICAS
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.amber);
  doc.rect(0, 0, PAGE_W, 3, "F");
  
  y = drawSectionHeader(doc, MARGIN + 5, "Dicas Importantes", "Conselhos que fazem a diferenca na sua evolucao", COLORS.amber);
  y += 4;

  dicas.forEach((dica, idx) => {
    y = ensureSpace(doc, y, 20);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 16, 3, COLORS.cardBg);
    drawAccentBar(doc, y + 2, COLORS.amber);
    
    // Number circle
    drawRoundedRect(doc, MARGIN + 7, y + 3, 10, 10, 5, COLORS.amber);
    addText(doc, `${idx + 1}`, MARGIN + 12, y + 10, { size: 10, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, dica, MARGIN + 22, y + 10, { size: 10, color: COLORS.white, maxWidth: CONTENT_W - 28 });
    y += 20;
  });

  // Final highlight box
  y += 6;
  y = drawHighlightBox(doc, y, "Lembre-se:", "A pratica consistente e o segredo de todo grande saxofonista.", COLORS.emerald);

  addPageNumber(doc, logoBase64);
  doc.save("Rotina-de-Estudo-Saxofonistas-Clube-do-Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF BÔNUS 2 — MAPA DE TONALIDADES PARA SAX
   ═══════════════════════════════════════════════════════════ */

export async function generateTonalidadesPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const transposicao = [
    { sax: "Sax Alto (Eb)", regra: "Sobe 3 semitons (uma terca menor)", exemplo: "Do no piano = La no Sax Alto" },
    { sax: "Sax Tenor (Bb)", regra: "Sobe 1 tom (uma segunda maior)", exemplo: "Do no piano = Re no Sax Tenor" },
    { sax: "Sax Soprano (Bb)", regra: "Mesma transposicao do Tenor", exemplo: "Do no piano = Re no Soprano" },
    { sax: "Sax Baritono (Eb)", regra: "Mesma transposicao do Alto (oitava abaixo)", exemplo: "Do no piano = La no Baritono" },
  ];

  const escalasMaiores = [
    { tom: "Do Maior", notas: "Do - Re - Mi - Fa - Sol - La - Si", acidentes: "Nenhum" },
    { tom: "Sol Maior", notas: "Sol - La - Si - Do - Re - Mi - Fa#", acidentes: "1 sustenido" },
    { tom: "Re Maior", notas: "Re - Mi - Fa# - Sol - La - Si - Do#", acidentes: "2 sustenidos" },
    { tom: "La Maior", notas: "La - Si - Do# - Re - Mi - Fa# - Sol#", acidentes: "3 sustenidos" },
    { tom: "Mi Maior", notas: "Mi - Fa# - Sol# - La - Si - Do# - Re#", acidentes: "4 sustenidos" },
    { tom: "Si Maior", notas: "Si - Do# - Re# - Mi - Fa# - Sol# - La#", acidentes: "5 sustenidos" },
    { tom: "Fa Maior", notas: "Fa - Sol - La - Sib - Do - Re - Mi", acidentes: "1 bemol" },
    { tom: "Sib Maior", notas: "Sib - Do - Re - Mib - Fa - Sol - La", acidentes: "2 bemois" },
    { tom: "Mib Maior", notas: "Mib - Fa - Sol - Lab - Sib - Do - Re", acidentes: "3 bemois" },
    { tom: "Lab Maior", notas: "Lab - Sib - Do - Reb - Mib - Fa - Sol", acidentes: "4 bemois" },
  ];

  const escalasRelativas = [
    { maior: "Do Maior", menor: "La menor" },
    { maior: "Sol Maior", menor: "Mi menor" },
    { maior: "Re Maior", menor: "Si menor" },
    { maior: "La Maior", menor: "Fa# menor" },
    { maior: "Fa Maior", menor: "Re menor" },
    { maior: "Sib Maior", menor: "Sol menor" },
    { maior: "Mib Maior", menor: "Do menor" },
  ];

  const modos = [
    { nome: "Jonio (I)", caracter: "Alegre, brilhante", uso: "Pop, MPB" },
    { nome: "Dorico (II)", caracter: "Menor suave, jazzy", uso: "Jazz, Funk, Fusion" },
    { nome: "Frigio (III)", caracter: "Exotico, tenso", uso: "Flamenco, Metal" },
    { nome: "Lidio (IV)", caracter: "Sonhador, aberto", uso: "Film scoring, Fusion" },
    { nome: "Mixolidio (V)", caracter: "Dominante, bluesy", uso: "Blues, Rock, Baiao" },
    { nome: "Eolio (VI)", caracter: "Melancolico, natural", uso: "Baladas, Gospel" },
    { nome: "Locrio (VII)", caracter: "Instavel, dissonante", uso: "Jazz avancado" },
  ];

  // COVER
  drawCoverPage(doc, "Mapa de Tonalidades", "Para Sax — Referencia Completa", "BONUS EXCLUSIVO PREMIUM", COLORS.blue, [
    "Tabela de transposicao para 4 saxofones",
    "10 escalas maiores com notas e acidentes",
    "7 tonalidades relativas (maior/menor)",
    "Os 7 modos gregos com aplicacao pratica",
    "Dicas de como usar no dia a dia",
    "Pronto para imprimir e consultar",
  ], logoBase64);

  // TOC
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 20, color: COLORS.white, style: "bold", align: "center" });
  doc.setFillColor(...COLORS.blue);
  doc.roundedRect(PAGE_W / 2 - 20, 39, 40, 1.5, 0.75, 0.75, "F");

  const tocItems = [
    "1. Tabela de Transposicao .......... pag. 3",
    "2. Escalas Maiores .......... pag. 4",
    "3. Tonalidades Relativas .......... pag. 6",
    "4. Os 7 Modos Gregos .......... pag. 7",
    "5. Como Usar Este Mapa .......... pag. 8",
  ];

  drawRoundedRect(doc, MARGIN + 5, 48, CONTENT_W - 10, tocItems.length * 12 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 61 + i * 12, { size: 11, color: COLORS.white });
  });

  // TRANSPOSIÇÃO
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, PAGE_W, 3, "F");
  let y = drawSectionHeader(doc, MARGIN + 5, "Tabela de Transposicao", "O sax e um instrumento transpositor — use esta referencia", COLORS.blue);
  y += 4;

  transposicao.forEach((t) => {
    y = ensureSpace(doc, y, 26);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 22, 3, COLORS.cardBg);
    drawAccentBar(doc, y + 3, COLORS.blue);
    addText(doc, t.sax, MARGIN + 8, y + 8, { size: 13, color: COLORS.blue, style: "bold" });
    addText(doc, `Regra: ${t.regra}`, MARGIN + 8, y + 14, { size: 10, color: COLORS.white });
    addText(doc, `Exemplo: ${t.exemplo}`, MARGIN + 8, y + 19.5, { size: 10, color: COLORS.muted, style: "italic" });
    y += 26;
  });

  y = drawSeparator(doc, y, COLORS.blue, "dots");

  // ESCALAS MAIORES
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Escalas Maiores", "Concert Pitch — nota real", COLORS.blue);
  y += 4;

  // Table header
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 11, 2, COLORS.blue);
  addText(doc, "TONALIDADE", MARGIN + 5, y + 7.5, { size: 10, color: COLORS.white, style: "bold" });
  addText(doc, "NOTAS", MARGIN + 50, y + 7.5, { size: 10, color: COLORS.white, style: "bold" });
  addText(doc, "ACIDENTES", MARGIN + 140, y + 7.5, { size: 10, color: COLORS.white, style: "bold" });
  y += 13;

  escalasMaiores.forEach((e, i) => {
    y = ensureSpace(doc, y, 11);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 1, bg);
    addText(doc, e.tom, MARGIN + 5, y + 7, { size: 10, color: COLORS.white, style: "bold" });
    addText(doc, e.notas, MARGIN + 50, y + 7, { size: 9, color: COLORS.cyan });
    addText(doc, e.acidentes, MARGIN + 140, y + 7, { size: 9, color: COLORS.amber });
    y += 12;
  });

  y = drawSeparator(doc, y + 2, COLORS.blue, "gradient");

  // RELATIVAS
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.cyan);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Tonalidades Relativas", "Cada maior tem uma menor que compartilha as mesmas notas", COLORS.cyan);
  y += 4;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 11, 2, COLORS.cyan);
  addText(doc, "TONALIDADE MAIOR", MARGIN + 5, y + 7.5, { size: 10, color: COLORS.white, style: "bold" });
  addText(doc, "RELATIVA MENOR", MARGIN + CONTENT_W / 2 + 5, y + 7.5, { size: 10, color: COLORS.white, style: "bold" });
  y += 13;

  escalasRelativas.forEach((r, i) => {
    y = ensureSpace(doc, y, 12);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 11, 1, bg);
    addText(doc, r.maior, MARGIN + 5, y + 7.5, { size: 11, color: COLORS.white, style: "bold" });
    // Arrow connector
    addText(doc, "-->", MARGIN + CONTENT_W / 2 - 5, y + 7.5, { size: 9, color: COLORS.muted });
    addText(doc, r.menor, MARGIN + CONTENT_W / 2 + 5, y + 7.5, { size: 11, color: COLORS.cyan });
    y += 13;
  });

  y = drawSeparator(doc, y + 2, COLORS.cyan, "dots");

  // MODOS
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.violet);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Os 7 Modos Gregos", "Variacoes da escala maior que criam diferentes cores sonoras", COLORS.violet);
  y += 4;

  const modeColors: [number, number, number][] = [COLORS.green, COLORS.blue, COLORS.red, COLORS.cyan, COLORS.amber, COLORS.emerald, COLORS.violet];

  modos.forEach((m, i) => {
    y = ensureSpace(doc, y, 20);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 16, 3, COLORS.cardBg);
    drawAccentBar(doc, y + 2, modeColors[i]);
    
    // Mode number badge
    drawRoundedRect(doc, MARGIN + 7, y + 2, 8, 12, 2, modeColors[i]);
    addText(doc, `${i + 1}`, MARGIN + 11, y + 10, { size: 10, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, m.nome, MARGIN + 20, y + 7, { size: 12, color: modeColors[i], style: "bold" });
    addText(doc, m.caracter, MARGIN + 65, y + 7, { size: 10, color: COLORS.white });
    addText(doc, `Usado em: ${m.uso}`, MARGIN + 20, y + 13.5, { size: 10, color: COLORS.muted, style: "italic" });
    y += 19;
  });

  // COMO USAR
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Como Usar Este Mapa", "Dicas praticas para aplicar no seu dia a dia", COLORS.blue);
  y += 4;

  const dicasUso = [
    "Antes de tocar: Identifique a tonalidade da musica e confira a escala correspondente",
    "Transposicao: Se receber uma partitura de piano, use a tabela para encontrar as notas do seu sax",
    "Improvisacao: Identifique o modo adequado ao estilo que esta tocando",
    "Imprima: Tenha este guia ao lado da estante durante os estudos",
  ];

  dicasUso.forEach((dica, idx) => {
    y = ensureSpace(doc, y, 18);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.cardBg);
    drawAccentBar(doc, y + 1, COLORS.blue);
    
    drawRoundedRect(doc, MARGIN + 7, y + 2, 10, 10, 5, COLORS.blue);
    addText(doc, `${idx + 1}`, MARGIN + 12, y + 9, { size: 10, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, dica, MARGIN + 22, y + 9, { size: 10, color: COLORS.white, maxWidth: CONTENT_W - 28 });
    y += 18;
  });

  y += 6;
  y = drawHighlightBox(doc, y, "Este mapa e sua bussola musical.", "Consulte sempre que precisar e internalize as tonalidades aos poucos.", COLORS.blue);

  addPageNumber(doc, logoBase64);
  doc.save("Mapa-de-Tonalidades-Sax-Clube-do-Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF BÔNUS 3 — 100 MÚSICAS QUE TODO SAXOFONISTA PRECISA SABER
   ═══════════════════════════════════════════════════════════ */

export async function generateMusicasPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const songs = [
    { name: "Careless Whisper", artist: "George Michael", genre: "Pop", difficulty: "Intermediario", tip: "O riff de sax mais famoso do mundo. Domine o vibrato no tema principal." },
    { name: "Baker Street", artist: "Gerry Rafferty", genre: "Rock", difficulty: "Intermediario", tip: "Solo iconico de sax. Trabalhe o registro agudo com potencia." },
    { name: "Just the Two of Us", artist: "Grover Washington Jr.", genre: "Jazz/Pop", difficulty: "Avancado", tip: "Fraseado suave e articulacao jazz." },
    { name: "Take Five", artist: "Dave Brubeck", genre: "Jazz", difficulty: "Avancado", tip: "Compasso 5/4 — pratique com metronomo." },
    { name: "The Pink Panther", artist: "Henry Mancini", genre: "Jazz", difficulty: "Iniciante", tip: "Tema simples e divertido. Otimo para treinar dinamicas." },
    { name: "Fly Me to the Moon", artist: "Frank Sinatra", genre: "Jazz", difficulty: "Intermediario", tip: "Standard essencial. Decore a melodia e improvise." },
    { name: "Shape of You", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Melodia moderna e acessivel." },
    { name: "Perfect", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Balada perfeita para casamentos." },
    { name: "All of Me", artist: "John Legend", genre: "Pop", difficulty: "Iniciante", tip: "Melodia emotiva. Explore dinamicas piano/forte." },
    { name: "Someone Like You", artist: "Adele", genre: "Pop", difficulty: "Iniciante", tip: "Balada poderosa. Trabalhe o fraseado longo." },
    { name: "Autumn Leaves", artist: "Joseph Kosma", genre: "Jazz", difficulty: "Intermediario", tip: "O standard mais tocado. Domine em todas as tonalidades." },
    { name: "So What", artist: "Miles Davis", genre: "Jazz", difficulty: "Intermediario", tip: "Modal jazz. Use escala dorica." },
    { name: "Summertime", artist: "George Gershwin", genre: "Jazz", difficulty: "Intermediario", tip: "Melodia belissima. Cada versao pode ser unica." },
    { name: "My Funny Valentine", artist: "Chet Baker", genre: "Jazz", difficulty: "Avancado", tip: "Balada jazz de referencia. Foco em expressao." },
    { name: "Body and Soul", artist: "Coleman Hawkins", genre: "Jazz", difficulty: "Avancado", tip: "Definiu o sax tenor no jazz." },
    { name: "Misty", artist: "Erroll Garner", genre: "Jazz", difficulty: "Intermediario", tip: "Melodia romantica. Ideal para shows." },
    { name: "In a Sentimental Mood", artist: "Duke Ellington", genre: "Jazz", difficulty: "Intermediario", tip: "Expressividade maxima. Cada nota conta." },
    { name: "Georgia on My Mind", artist: "Ray Charles", genre: "Jazz/Blues", difficulty: "Intermediario", tip: "Classico atemporal." },
    { name: "Blue Bossa", artist: "Kenny Dorham", genre: "Jazz", difficulty: "Intermediario", tip: "Bossa nova + jazz. Otimo para praticar ii-V-I." },
    { name: "Cantaloupe Island", artist: "Herbie Hancock", genre: "Jazz", difficulty: "Intermediario", tip: "Groove funky. Use pentatonica." },
    { name: "Garota de Ipanema", artist: "Tom Jobim", genre: "MPB/Bossa", difficulty: "Intermediario", tip: "O classico brasileiro. Estude a versao de Stan Getz." },
    { name: "Carinhoso", artist: "Pixinguinha", genre: "Choro/MPB", difficulty: "Intermediario", tip: "Hino do sax brasileiro. Ornamentacao essencial." },
    { name: "Wave", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediario", tip: "Harmonia sofisticada." },
    { name: "Mas Que Nada", artist: "Jorge Ben Jor", genre: "MPB", difficulty: "Iniciante", tip: "Energia pura. Bom para apresentacoes." },
    { name: "Aguas de Marco", artist: "Tom Jobim", genre: "MPB", difficulty: "Intermediario", tip: "Desafio ritmico interessante." },
    { name: "Eu Sei Que Vou Te Amar", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediario", tip: "Uma das mais bonitas de Jobim." },
    { name: "Aquarela do Brasil", artist: "Ary Barroso", genre: "Samba", difficulty: "Intermediario", tip: "Toque com grandiosidade." },
    { name: "Chega de Saudade", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Avancado", tip: "Marco da Bossa Nova." },
    { name: "Detalhes", artist: "Roberto Carlos", genre: "MPB", difficulty: "Iniciante", tip: "Romantica e popular." },
    { name: "Evidencias", artist: "Chitozinho & Xororo", genre: "MPB", difficulty: "Iniciante", tip: "Hino do karaoke brasileiro." },
    { name: "Quao Grande E o Meu Deus", artist: "Soraya Moraes", genre: "Gospel", difficulty: "Iniciante", tip: "Hino de adoracao." },
    { name: "Nada Alem do Sangue", artist: "Fernandinho", genre: "Gospel", difficulty: "Iniciante", tip: "Adoracao intensa." },
    { name: "Amazing Grace", artist: "Tradicional", genre: "Gospel", difficulty: "Iniciante", tip: "O hino mais tocado do mundo." },
    { name: "Bondade de Deus", artist: "Isaias Saad", genre: "Gospel", difficulty: "Iniciante", tip: "Hit moderno da adoracao." },
    { name: "Oceanos", artist: "Hillsong (Ana Nobrega)", genre: "Gospel", difficulty: "Intermediario", tip: "Adoracao profunda." },
    { name: "Way Maker", artist: "Sinach", genre: "Gospel", difficulty: "Iniciante", tip: "Melodia simples e poderosa." },
    { name: "10.000 Reasons", artist: "Matt Redman", genre: "Gospel", difficulty: "Iniciante", tip: "Louvor congregacional." },
    { name: "Lugar Secreto", artist: "Gabriela Rocha", genre: "Gospel", difficulty: "Intermediario", tip: "Adoracao intimista." },
    { name: "Yeshua", artist: "Fernandinho", genre: "Gospel", difficulty: "Iniciante", tip: "Deixe a melodia falar." },
    { name: "Grandioso Es Tu", artist: "Tradicional", genre: "Gospel", difficulty: "Iniciante", tip: "Classico eterno." },
    { name: "The Thrill Is Gone", artist: "B.B. King", genre: "Blues", difficulty: "Intermediario", tip: "Blues menor. Use blue notes." },
    { name: "At Last", artist: "Etta James", genre: "Blues/Soul", difficulty: "Intermediario", tip: "Classico romantico." },
    { name: "Feeling Good", artist: "Nina Simone", genre: "Blues/Soul", difficulty: "Intermediario", tip: "Build dramatico." },
    { name: "Ain't No Sunshine", artist: "Bill Withers", genre: "Soul", difficulty: "Iniciante", tip: "Menos notas, mais sentimento." },
    { name: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz/Soul", difficulty: "Iniciante", tip: "Toque com sinceridade." },
    { name: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", difficulty: "Avancado", tip: "Arranjo desafiador." },
    { name: "Hotel California", artist: "Eagles", genre: "Rock", difficulty: "Intermediario", tip: "Muito pedido em eventos." },
    { name: "Nothing Else Matters", artist: "Metallica", genre: "Rock", difficulty: "Intermediario", tip: "Balada rock no sax soa incrivel." },
    { name: "My Heart Will Go On", artist: "Celine Dion", genre: "Soundtrack", difficulty: "Iniciante", tip: "Tema reconhecivel instantaneamente." },
    { name: "Cinema Paradiso", artist: "Ennio Morricone", genre: "Soundtrack", difficulty: "Intermediario", tip: "Obra-prima cinematografica." },
    { name: "Pais Tropical", artist: "Jorge Ben Jor", genre: "Samba", difficulty: "Iniciante", tip: "Alegre e festivo." },
    { name: "Trem das Onze", artist: "Adoniran Barbosa", genre: "Samba", difficulty: "Iniciante", tip: "Classico paulistano." },
    { name: "Deixa a Vida Me Levar", artist: "Zeca Pagodinho", genre: "Samba/Pagode", difficulty: "Iniciante", tip: "Hit de roda de samba." },
    { name: "Preciso Me Encontrar", artist: "Cartola", genre: "Samba", difficulty: "Intermediario", tip: "Poesia em forma de musica." },
    { name: "Brasileirinho", artist: "Waldir Azevedo", genre: "Choro", difficulty: "Avancado", tip: "Velocidade e precisao." },
    { name: "Besame Mucho", artist: "Consuelo Velazquez", genre: "Bolero", difficulty: "Iniciante", tip: "Romance latino." },
    { name: "Tequila", artist: "The Champs", genre: "Rock/Latina", difficulty: "Iniciante", tip: "Divertida e energetica." },
    { name: "Smooth Operator", artist: "Sade", genre: "Jazz/Pop", difficulty: "Intermediario", tip: "Groove suave." },
    { name: "Yakety Sax", artist: "Boots Randolph", genre: "Country/Fun", difficulty: "Avancado", tip: "Velocidade extrema. Tecnica pura." },
    { name: "Harlem Nocturne", artist: "Earle Hagen", genre: "Jazz", difficulty: "Intermediario", tip: "Noir e cinematografico." },
    { name: "Sway", artist: "Dean Martin", genre: "Bolero/Pop", difficulty: "Iniciante", tip: "Perfeito para eventos sociais." },
    { name: "Moon River", artist: "Henry Mancini", genre: "Jazz/Soundtrack", difficulty: "Iniciante", tip: "Agora e sua vez no sax." },
    { name: "New York, New York", artist: "Frank Sinatra", genre: "Jazz", difficulty: "Intermediario", tip: "Big band feel." },
    { name: "Can't Help Falling in Love", artist: "Elvis Presley", genre: "Pop", difficulty: "Iniciante", tip: "Suavidade total." },
    { name: "Thinking Out Loud", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Hit de casamento." },
    { name: "A Thousand Years", artist: "Christina Perri", genre: "Pop", difficulty: "Iniciante", tip: "Simples e lindo." },
    { name: "Hallelujah", artist: "Leonard Cohen", genre: "Folk/Pop", difficulty: "Iniciante", tip: "Universal. Funciona em qualquer contexto." },
    { name: "Unchained Melody", artist: "The Righteous Brothers", genre: "Pop", difficulty: "Intermediario", tip: "Melodia inesquecivel." },
    { name: "Hello", artist: "Adele", genre: "Pop", difficulty: "Intermediario", tip: "Potencia vocal traduzida no sax." },
    { name: "Shallow", artist: "Lady Gaga", genre: "Pop", difficulty: "Intermediario", tip: "Crescendo emocional no final." },
    { name: "Yesterday", artist: "The Beatles", genre: "Pop/Rock", difficulty: "Iniciante", tip: "Simplicidade e tudo." },
    { name: "Imagine", artist: "John Lennon", genre: "Pop/Rock", difficulty: "Iniciante", tip: "Hino da paz." },
    { name: "Stand By Me", artist: "Ben E. King", genre: "Soul", difficulty: "Iniciante", tip: "Groove constante." },
    { name: "I Will Always Love You", artist: "Whitney Houston", genre: "Pop", difficulty: "Intermediario", tip: "Desafio de registro e potencia." },
    { name: "Despacito", artist: "Luis Fonsi", genre: "Pop/Latin", difficulty: "Iniciante", tip: "Surpreenda o publico." },
    { name: "Havana", artist: "Camila Cabello", genre: "Pop/Latin", difficulty: "Iniciante", tip: "Groove cubano moderno." },
    { name: "Insensatez", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediario", tip: "Harmonia cromatica." },
    { name: "Dindi", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediario", tip: "Docura e delicadeza." },
    { name: "Night and Day", artist: "Cole Porter", genre: "Jazz", difficulty: "Intermediario", tip: "Standard elegante." },
    { name: "Donna Lee", artist: "Charlie Parker", genre: "Bebop", difficulty: "Avancado", tip: "Teste supremo de tecnica." },
    { name: "Giant Steps", artist: "John Coltrane", genre: "Jazz", difficulty: "Avancado", tip: "O Monte Everest do jazz." },
    { name: "Spain", artist: "Chick Corea", genre: "Jazz/Fusion", difficulty: "Avancado", tip: "Fusao latina brilhante." },
    { name: "Stella by Starlight", artist: "Victor Young", genre: "Jazz", difficulty: "Avancado", tip: "Harmonia complexa." },
    { name: "St. Thomas", artist: "Sonny Rollins", genre: "Jazz", difficulty: "Intermediario", tip: "Calipso jazz. Ritmo contagiante." },
    { name: "All The Things You Are", artist: "Jerome Kern", genre: "Jazz", difficulty: "Avancado", tip: "Progressao harmonica perfeita." },
    { name: "Round Midnight", artist: "Thelonious Monk", genre: "Jazz", difficulty: "Avancado", tip: "Balada noturna." },
    { name: "Naima", artist: "John Coltrane", genre: "Jazz", difficulty: "Intermediario", tip: "Beleza pura." },
    { name: "Watermelon Man", artist: "Herbie Hancock", genre: "Jazz/Funk", difficulty: "Intermediario", tip: "Funky e acessivel." },
    { name: "Chameleon", artist: "Herbie Hancock", genre: "Jazz/Funk", difficulty: "Avancado", tip: "Groove hipnotico." },
    { name: "Tenor Madness", artist: "Sonny Rollins", genre: "Jazz", difficulty: "Avancado", tip: "Blues em Bb. Base para jam sessions." },
    { name: "Moanin'", artist: "Art Blakey", genre: "Hard Bop", difficulty: "Intermediario", tip: "Call and response poderoso." },
    { name: "Song for My Father", artist: "Horace Silver", genre: "Hard Bop", difficulty: "Intermediario", tip: "Bossa + hard bop." },
    { name: "Work Song", artist: "Nat Adderley", genre: "Hard Bop", difficulty: "Intermediario", tip: "Blues form com energia gospel." },
    { name: "Mas Que Nada (Mendes)", artist: "Sergio Mendes", genre: "MPB", difficulty: "Iniciante", tip: "Versao instrumental energetica." },
    { name: "Preciso Me Encontrar (samba)", artist: "Cartola", genre: "Samba", difficulty: "Intermediario", tip: "Toque com alma." },
  ];

  const diffColor: Record<string, [number, number, number]> = {
    Iniciante: COLORS.green,
    Intermediario: COLORS.amber,
    Avancado: COLORS.red,
  };

  // COVER
  drawCoverPage(doc, "100 Musicas", "Que Todo Saxofonista Precisa Saber", "BONUS EXCLUSIVO PREMIUM", COLORS.amber, [
    "100 musicas curadas por genero e nivel",
    "Pop, Jazz, MPB, Gospel, Blues, Rock e mais",
    "3 niveis: Iniciante, Intermediario, Avancado",
    "Dicas de interpretacao para cada musica",
    "Pronto para imprimir e usar como guia",
  ], logoBase64);

  // TOC
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.amber);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 20, color: COLORS.white, style: "bold", align: "center" });
  doc.setFillColor(...COLORS.amber);
  doc.roundedRect(PAGE_W / 2 - 20, 39, 40, 1.5, 0.75, 0.75, "F");

  const tocItems = [
    "1. Lista Completa — 100 Musicas .......... pag. 3-14",
    "2. Organizadas por numero com genero e nivel",
    "3. Dica de interpretacao para cada musica",
  ];

  drawRoundedRect(doc, MARGIN + 5, 48, CONTENT_W - 10, tocItems.length * 12 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 61 + i * 12, { size: 11, color: COLORS.white });
  });

  // Stats
  const iniciantes = songs.filter(s => s.difficulty === "Iniciante").length;
  const intermediarios = songs.filter(s => s.difficulty === "Intermediario").length;
  const avancados = songs.filter(s => s.difficulty === "Avancado").length;
  
  let yToc = 61 + tocItems.length * 12 + 10;
  drawRoundedRect(doc, MARGIN + 5, yToc, CONTENT_W - 10, 35, 6, COLORS.lightCardBg);
  addText(doc, "RESUMO DA LISTA", MARGIN + 15, yToc + 9, { size: 11, color: COLORS.amber, style: "bold" });
  
  // Stat badges
  const statY = yToc + 15;
  const badgeW = (CONTENT_W - 30) / 3;
  
  drawRoundedRect(doc, MARGIN + 10, statY, badgeW, 14, 3, COLORS.green);
  addText(doc, `${iniciantes}`, MARGIN + 10 + badgeW / 2, statY + 6, { size: 12, color: COLORS.white, style: "bold", align: "center" });
  addText(doc, "Iniciante", MARGIN + 10 + badgeW / 2, statY + 11.5, { size: 8, color: COLORS.white, align: "center" });
  
  drawRoundedRect(doc, MARGIN + 10 + badgeW + 5, statY, badgeW, 14, 3, COLORS.amber);
  addText(doc, `${intermediarios}`, MARGIN + 10 + badgeW + 5 + badgeW / 2, statY + 6, { size: 12, color: COLORS.white, style: "bold", align: "center" });
  addText(doc, "Intermediario", MARGIN + 10 + badgeW + 5 + badgeW / 2, statY + 11.5, { size: 8, color: COLORS.white, align: "center" });
  
  drawRoundedRect(doc, MARGIN + 10 + (badgeW + 5) * 2, statY, badgeW, 14, 3, COLORS.red);
  addText(doc, `${avancados}`, MARGIN + 10 + (badgeW + 5) * 2 + badgeW / 2, statY + 6, { size: 12, color: COLORS.white, style: "bold", align: "center" });
  addText(doc, "Avancado", MARGIN + 10 + (badgeW + 5) * 2 + badgeW / 2, statY + 11.5, { size: 8, color: COLORS.white, align: "center" });

  const genres = [...new Set(songs.map(s => s.genre))];
  addText(doc, `${genres.length} generos: Pop, Jazz, MPB, Gospel, Blues, Rock e mais`, PAGE_W / 2, yToc + 33, { size: 9, color: COLORS.muted, align: "center" });

  // SONG LIST
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.amber);
  doc.rect(0, 0, PAGE_W, 3, "F");
  let y = drawSectionHeader(doc, MARGIN + 5, "100 Musicas Essenciais", "Lista completa com genero, nivel e dicas", COLORS.amber);
  y += 3;

  songs.forEach((song, i) => {
    y = ensureSpace(doc, y, 19);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 16, 2, COLORS.cardBg);
    
    const num = String(i + 1).padStart(2, "0");
    const dc = diffColor[song.difficulty] || COLORS.white;
    
    // Number badge
    drawRoundedRect(doc, MARGIN + 2, y + 2, 12, 12, 2, dc);
    addText(doc, num, MARGIN + 8, y + 10, { size: 9, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, song.name, MARGIN + 18, y + 6.5, { size: 10, color: COLORS.white, style: "bold" });
    
    // Difficulty badge on right
    drawRoundedRect(doc, MARGIN + CONTENT_W - 28, y + 2, 26, 6, 3, dc);
    addText(doc, song.difficulty, MARGIN + CONTENT_W - 15, y + 6.5, { size: 6.5, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, `${song.artist}  |  ${song.genre}`, MARGIN + 18, y + 11, { size: 8, color: COLORS.muted });
    addText(doc, song.tip, MARGIN + 18, y + 14.5, { size: 7.5, color: dc, style: "italic", maxWidth: CONTENT_W - 24 });
    y += 18;
    
    // Add separator every 25 songs
    if ((i + 1) % 25 === 0 && i < songs.length - 1) {
      y = drawSeparator(doc, y, COLORS.amber, "dots");
    }
  });

  addPageNumber(doc, logoBase64);
  doc.save("100-Musicas-Saxofonista-Clube-do-Sax.pdf");
}
