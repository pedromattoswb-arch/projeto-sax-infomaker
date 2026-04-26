import jsPDF from "jspdf";
import logoSrc from "@/assets/logo-clube-do-sax.png";

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
    addText(doc, "CLUBE DO SAX", PAGE_W / 2, 28, { size: 12, color: COLORS.muted, style: "normal", align: "center" });
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
    addText(doc, `\u2713  ${item}`, MARGIN + 20, 134 + i * 9, { size: 9, color: COLORS.white });
  });
  
  // Footer
  addText(doc, `\u00A9 ${new Date().getFullYear()} Clube do Sax \u2014 Todos os direitos reservados`, PAGE_W / 2, PAGE_H - 20, { size: 7, color: COLORS.muted, align: "center" });
  addText(doc, "Material exclusivo para membros. Proibida a reproducao.", PAGE_W / 2, PAGE_H - 14, { size: 7, color: COLORS.muted, align: "center" });
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
    doc.setFillColor(...color);
    doc.roundedRect(MARGIN + 30, y + 2, CONTENT_W - 60, 1.5, 0.75, 0.75, "F");
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
    try {
      doc.addImage(logoBase64, "PNG", PAGE_W - MARGIN - 28, 5, 28, 8);
    } catch { /* ignore */ }
    addText(doc, `${i} / ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 10, { size: 7, color: COLORS.muted, align: "right" });
    addText(doc, "Clube do Sax", MARGIN, PAGE_H - 10, { size: 7, color: COLORS.muted });
  }
}

/* ═══════════════════════════════════════════════════════════
   PDF 1 — DIGITACAO COMPLETA
   ═══════════════════════════════════════════════════════════ */

export async function generateDigitacaoPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const registros = [
    {
      titulo: "Registro Grave", subtitulo: "Sib grave \u2192 Sol", color: COLORS.blue,
      notas: [
        { nota: "Sib (Bb)", chaves: "Todas fechadas + Sib (pinky esquerdo)", dica: "Nota mais grave. Sopro lento, apoio firme do diafragma." },
        { nota: "Si (B)", chaves: "Todas fechadas (sem Sib)", dica: "Embocadura bem aberta, garganta relaxada como bocejo." },
        { nota: "Do (C)", chaves: "ME: 1a, 2a, 3a | MD: 1a, 2a, 3a", dica: "Dedos proximos as chaves mesmo quando nao pressionados." },
        { nota: "Do# (C#)", chaves: "ME: 1a, 2a, 3a | MD: 1a, 2a, 3a + Do# (pinky dir.)", dica: "Use o pinky sem tensao \u2014 apenas o peso do dedo." },
        { nota: "Re (D)", chaves: "ME: 1a, 2a, 3a | MD: 1a, 2a", dica: "Referencia de afinacao para iniciantes." },
        { nota: "Mib (Eb)", chaves: "ME: 1a, 2a, 3a | MD: 1a", dica: "Levante apenas o dedo 3 da MD \u2014 minimo movimento." },
        { nota: "Mi (E)", chaves: "ME: 1a, 2a, 3a | MD: nenhuma", dica: "Transicao Mi\u2192Fa e uma das mais usadas." },
        { nota: "Fa (F)", chaves: "ME: 1a, 2a | MD: nenhuma", dica: "Embocadura comeca a ficar mais neutra." },
        { nota: "Fa# (F#)", chaves: "ME: 1a, 3a | MD: nenhuma", dica: "Salto do dedo 2 para 3 requer pratica." },
        { nota: "Sol (G)", chaves: "ME: 1a | MD: nenhuma", dica: "Nota aberta. Boa para calibrar embocadura." },
        { nota: "Sol# (G#)", chaves: "ME: 1a + Sol# (pinky esq.)", dica: "Pratique independencia do pinky." },
      ],
    },
    {
      titulo: "Registro Medio (com oitava)", subtitulo: "La \u2192 Do#", color: COLORS.emerald,
      notas: [
        { nota: "La (A)", chaves: "Oitava + ME: 1a, 2a, 3a | MD: 1a, 2a, 3a", dica: "Primeira nota com oitava. Pressao do polegar constante." },
        { nota: "Sib (Bb)", chaves: "Oitava + mesma digitacao de Sib grave", dica: "Use chave Bis para transicoes rapidas La\u2192Sib." },
        { nota: "Si (B)", chaves: "Oitava + todas fechadas (sem Sib)", dica: "A oitava muda automaticamente." },
        { nota: "Do (C)", chaves: "Oitava + ME: 1a, 2a, 3a | MD: 1a, 2a, 3a", dica: "Compare afinacao com Do grave." },
        { nota: "Do# (C#)", chaves: "Oitava + ME: 1a, 2a, 3a | MD: 1a, 2a, 3a + Do#", dica: "Transicao para registro agudo." },
      ],
    },
    {
      titulo: "Registro Agudo", subtitulo: "Re \u2192 Fa#", color: COLORS.amber,
      notas: [
        { nota: "Re (D)", chaves: "Oitava + Palm D (lateral sup. ME)", dica: "Pressione com lateral da mao, nao ponta do dedo." },
        { nota: "Mib (Eb)", chaves: "Oitava + Palm D + Palm Eb", dica: "Relaxe o punho para alcancar ambas." },
        { nota: "Mi (E)", chaves: "Oitava + Palm D + Eb + F (ou Side E)", dica: "Ar bastante. Apoie com diafragma." },
        { nota: "Fa (F)", chaves: "Oitava + todas palm keys ou Front F", dica: "Front F e mais agil em passagens rapidas." },
        { nota: "Fa# (F#)", chaves: "Oitava + Fa# auxiliar ou Front F + ajuste", dica: "Nota mais aguda do registro 'normal'." },
      ],
    },
    {
      titulo: "Registro Altissimo", subtitulo: "Sol \u2192 Do (acima)", color: COLORS.red,
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
    { titulo: "Bis Key (Sib)", contexto: "La \u2192 Sib \u2192 La", como: "Chave Bis entre 1a e 2a da ME. Dedo 1 rola para baixo.", quando: "Sib entre notas da mao esquerda." },
    { titulo: "Side C (Do agudo)", contexto: "Passagens rapidas no agudo", como: "Chave lateral de Do (lado direito).", quando: "Sequencias Si\u2192Do\u2192Re no agudo." },
    { titulo: "Side Bb (Sib agudo)", contexto: "Alternativa ao Sib com oitava", como: "Chave lateral de Sib.", quando: "Trinados e cromaticos no agudo." },
    { titulo: "Fork F (Fa com forquilha)", contexto: "Mib \u2192 Fa \u2192 Mib", como: "ME: 1a, 3a (sem 2a).", quando: "Fa entre notas que usam 1a e 3a." },
    { titulo: "Trinado Re-Mib", contexto: "Trinados e ornamentos", como: "Segure Re + chave trinado lateral MD.", quando: "Qualquer trinado Re-Mib." },
    { titulo: "Front F (Fa agudo)", contexto: "Fa agudo rapido", como: "Chave frontal acima de Si.", quando: "Passagens rapidas no agudo." },
  ];

  const embocadura = [
    { registro: "Grave", dicas: ["Mandibula relaxada e mais aberta", "Mais palheta dentro da boca", "Sopro quente e lento \u2014 vogal 'O'", "Apoio firme do diafragma", "Se guincha, esta apertando demais"] },
    { registro: "Medio", dicas: ["Embocadura neutra", "Coluna de ar constante e centrada", "Lingua levemente curvada para cima", "Registro de referencia \u2014 calibre aqui", "Pratique notas longas"] },
    { registro: "Agudo", dicas: ["Mandibula levemente mais fechada", "Sopro mais rapido \u2014 vogal 'I'", "Menos palheta na boca", "Sem excesso de pressao labial", "Use o ouvido para afinacao"] },
    { registro: "Altissimo", dicas: ["Garganta muito estreita \u2014 como assobiar", "Ar extremamente rapido", "Embocadura firme mas nao tensa", "Pratique harmonicos naturais primeiro", "Comece pelo Sol e va subindo"] },
  ];

  // COVER PAGE
  drawCoverPage(doc, "Tabela de Digitacao", "Sax Alto & Tenor \u2014 Inclui Altissimas", "GUIA PROFISSIONAL \u2022 26+ PAGINAS", COLORS.violet, [
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
    "1. Registro Grave (Sib \u2192 Sol) .......... pag. 3",
    "2. Registro Medio com Oitava (La \u2192 Do#) .......... pag. 5",
    "3. Registro Agudo (Re \u2192 Fa#) .......... pag. 6",
    "4. Registro Altissimo (Sol \u2192 Do) .......... pag. 7",
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
      addText(doc, `\u2192 ${nota.dica}`, MARGIN + 5, y + 19, { size: 10, color: reg.color, style: "italic" });
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
      addText(doc, `\u2022 ${d}`, MARGIN + 8, y + 17 + j * 7, { size: 11, color: COLORS.white });
    });
    y += reg.dicas.length * 7 + 18;
  });

  // EXERCICIOS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Preparacao para o Altissimo", "Exercicios de harmonicos que destravam o registro", COLORS.red);
  y += 3;

  const exercicios = [
    { titulo: "Exercicio 1 \u2014 Harmonicos do Sib grave", passos: ["Toque Sib grave normalmente", "Sem mudar digitacao, faca soar Sib uma oitava acima", "Depois tente Fa (quinta acima)", "Depois Sib duas oitavas acima", "Esse controle e o mesmo do altissimo"] },
    { titulo: "Exercicio 2 \u2014 Harmonicos do Si grave", passos: ["Repita partindo do Si grave", "Si grave \u2192 Si oitava \u2192 Fa# \u2192 Si duas oitavas", "Cada fundamental gera serie harmonica diferente"] },
    { titulo: "Exercicio 3 \u2014 Conexao com digitacao", passos: ["Toque harmonico de Sol (partindo do Do grave)", "Quando estavel, mude para digitacao altissima de Sol", "O som deve continuar \u2014 mesma embocadura", "Repita para Sol#, La, etc."] },
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
  addText(doc, "Nao decore \u2014 internalize.", MARGIN + 8, y + 12, { size: 14, color: COLORS.violet, style: "bold" });
  y = addWrappedText(doc, "Pratique cada nota ate que seus dedos se movam automaticamente. A tabela e para consulta, nao para decorar.", MARGIN + 8, y + 22, CONTENT_W - 16, { size: 12, color: COLORS.white });
  y += 5;
  addText(doc, "ROTINA SUGERIDA:", MARGIN + 8, y, { size: 12, color: COLORS.amber, style: "bold" });
  y = addWrappedText(doc, "Escolha 1 registro por dia. Toque cada nota 4 tempos (q = 60), foco em timbre e afinacao. Em 4 dias, voce cobriu todo o sax.", MARGIN + 8, y + 7, CONTENT_W - 16, { size: 11, color: COLORS.white });

  addPageNumber(doc, logoBase64);
  doc.save("Tabela-Digitacao-Completa-Clube do Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF 2 — TRANSPOSICAO INSTANTANEA
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
    { tom: "Do Maior / La menor", acidentes: "\u2014", notas: "Nenhum acidente" },
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
    { n: "1", titulo: "Identifique seu sax", desc: "Alto/Baritono = Mib (Eb) \u2192 soma 3 semitons. Tenor/Soprano = Sib (Bb) \u2192 soma 2 semitons." },
    { n: "2", titulo: "Ache a nota na tabela", desc: "Encontre a nota Concert Pitch (nota 'real', como piano) na primeira coluna." },
    { n: "3", titulo: "Leia a coluna do seu sax", desc: "A nota na coluna do seu instrumento e o que voce deve tocar." },
  ];

  // COVER
  drawCoverPage(doc, "Kit Transposicao", "Alto \u2022 Tenor \u2022 Soprano \u2022 Baritono", "GUIA PROFISSIONAL \u2022 18+ PAGINAS", COLORS.blue, [
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
    "2. Tabela de Transposicao \u2014 12 Tonalidades .......... pag. 4",
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
  let y = drawSectionHeader(doc, MARGIN, "Como Transpor \u2014 3 Passos", "Metodo visual e pratico", COLORS.blue);
  y += 5;

  passos.forEach((p) => {
    y = ensureSpace(doc, y, 30);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    drawRoundedRect(doc, MARGIN + 3, y + 3, 18, 18, 9, COLORS.blue);
    addText(doc, p.n, MARGIN + 12, y + 15, { size: 14, color: COLORS.white, style: "bold", align: "center" });
    addText(doc, p.titulo, MARGIN + 26, y + 9, { size: 12, color: COLORS.white, style: "bold" });
    addText(doc, p.desc, MARGIN + 26, y + 16, { size: 9, color: COLORS.muted, maxWidth: CONTENT_W - 32 });
    y += 27;
  });

  y += 3;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.lightCardBg);
  addText(doc, "REGRA RAPIDA:", MARGIN + 5, y + 6, { size: 10, color: COLORS.blue, style: "bold" });
  addText(doc, "Alto/Baritono (Eb) = sobe 3 semitons | Tenor/Soprano (Bb) = sobe 2 semitons", MARGIN + 5, y + 11.5, { size: 9, color: COLORS.white });

  // TABELA DE TRANSPOSICAO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Tabela de Transposicao", "12 tonalidades \u2014 Concert Pitch \u2192 Alto \u2192 Tenor", COLORS.blue);
  y += 3;

  // Table header
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.blue);
  addText(doc, "CONCERT PITCH", MARGIN + 5, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "SAX ALTO (Eb)", MARGIN + 60, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "SAX TENOR (Bb)", MARGIN + 115, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  y += 12;

  tabelaTransposicao.forEach((row, i) => {
    y = ensureSpace(doc, y, 10);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 9, 1, bg);
    addText(doc, row.concert, MARGIN + 5, y + 6.5, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, row.alto, MARGIN + 60, y + 6.5, { size: 11, color: COLORS.cyan });
    addText(doc, row.tenor, MARGIN + 115, y + 6.5, { size: 11, color: COLORS.amber });
    y += 10;
  });

  y += 4;
  drawRoundedRect(doc, MARGIN, y, CONTENT_W / 2 - 2, 14, 3, COLORS.lightCardBg);
  addText(doc, "Soprano (Bb):", MARGIN + 5, y + 6, { size: 10, color: COLORS.cyan, style: "bold" });
  addText(doc, "= coluna Tenor", MARGIN + 5, y + 11.5, { size: 9, color: COLORS.white });

  drawRoundedRect(doc, MARGIN + CONTENT_W / 2 + 2, y, CONTENT_W / 2 - 2, 14, 3, COLORS.lightCardBg);
  addText(doc, "Baritono (Eb):", MARGIN + CONTENT_W / 2 + 7, y + 6, { size: 10, color: COLORS.violet, style: "bold" });
  addText(doc, "= coluna Alto (oitava abaixo)", MARGIN + CONTENT_W / 2 + 7, y + 11.5, { size: 9, color: COLORS.white });

  // ARMADURAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Armaduras de Clave", "Quantos sustenidos ou bemois cada tonalidade tem", COLORS.blue);
  y += 3;

  // Table header
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
  addText(doc, "Sustenidos: Fa, Do, Sol, Re, La, Mi, Si  |  Bemois: inverso \u2014 Si, Mi, La, Re, Sol, Do, Fa", MARGIN + 5, y + 11, { size: 9, color: COLORS.white });

  // CIFRAS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cifras Comuns \u2014 Ja Transpostas", "As progressoes que voce mais encontra \u2014 prontas para tocar", COLORS.blue);
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

  // DICAS PRATICAS
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
    addText(doc, d.titulo, MARGIN + 5, y + 7, { size: 11, color: COLORS.blue, style: "bold" });
    addText(doc, d.texto, MARGIN + 5, y + 14, { size: 9, color: COLORS.white, maxWidth: CONTENT_W - 10 });
    y += 21;
  });

  // RESUMO RAPIDO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Resumo Rapido para Decorar", "Cole na estante ou dentro do case", COLORS.blue);
  y += 5;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 50, 4, COLORS.cardBg);
  addText(doc, "SAX ALTO / BARITONO (Eb)", MARGIN + 8, y + 12, { size: 14, color: COLORS.cyan, style: "bold" });
  addText(doc, "Toque uma terca menor acima (3 semitons) da nota Concert.", MARGIN + 8, y + 20, { size: 12, color: COLORS.white });
  addText(doc, "Exemplo: Concert Do = voce toca La.", MARGIN + 8, y + 28, { size: 11, color: COLORS.muted, style: "italic" });
  
  addText(doc, "SAX TENOR / SOPRANO (Bb)", MARGIN + 8, y + 38, { size: 14, color: COLORS.amber, style: "bold" });
  addText(doc, "Toque um tom acima (2 semitons) da nota Concert.", MARGIN + 8, y + 46, { size: 12, color: COLORS.white });
  y += 55;
  addText(doc, "Exemplo: Concert Do = voce toca Re.", MARGIN + 8, y - 3, { size: 11, color: COLORS.muted, style: "italic" });

  // TABELA DE BOLSO
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Tabela de Bolso", "Recorte e guarde dentro do case", COLORS.blue);
  y += 5;

  // Compact table
  const cellH = 8;
  const col1W = 35;
  const col2W = 35;
  const col3W = 35;
  const tableW = col1W + col2W + col3W + 10;
  const tableX = (PAGE_W - tableW) / 2;

  // Header
  drawRoundedRect(doc, tableX, y, tableW, cellH + 2, 2, COLORS.blue);
  addText(doc, "Concert", tableX + 5, y + 6, { size: 8, color: COLORS.white, style: "bold" });
  addText(doc, "Alto (Eb)", tableX + col1W + 5, y + 6, { size: 8, color: COLORS.white, style: "bold" });
  addText(doc, "Tenor (Bb)", tableX + col1W + col2W + 5, y + 6, { size: 8, color: COLORS.white, style: "bold" });
  y += cellH + 3;

  tabelaTransposicao.forEach((row, i) => {
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, tableX, y, tableW, cellH, 1, bg);
    addText(doc, row.concert, tableX + 5, y + 5.5, { size: 8, color: COLORS.white, style: "bold" });
    addText(doc, row.alto, tableX + col1W + 5, y + 5.5, { size: 8, color: COLORS.cyan });
    addText(doc, row.tenor, tableX + col1W + col2W + 5, y + 5.5, { size: 8, color: COLORS.amber });
    y += cellH + 0.5;
  });

  y += 5;
  addText(doc, "Soprano = coluna Tenor  |  Baritono = coluna Alto", PAGE_W / 2, y, { size: 10, color: COLORS.muted, align: "center" });

  addPageNumber(doc, logoBase64);
  doc.save("Kit-Transposicao-Instantanea-Clube do Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF 3 — MANUTENCAO DO SAX
   ═══════════════════════════════════════════════════════════ */

export async function generateManutencaoPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const cuidadosDiarios = [
    { acao: "Passar o swab (flanela) interno", como: "Insira o swab pelo sino e puxe pela campana. Repita 2-3x ate sair seco.", porque: "Remove umidade que causa oxidacao e mau cheiro." },
    { acao: "Secar a boquilha", como: "Remova a boquilha. Passe pano macio por dentro e fora.", porque: "Umidade cria depositos minerais que alteram o som." },
    { acao: "Remover e secar a palheta", como: "Tire a palheta. Seque com pano. Guarde no protetor (reed guard).", porque: "Palheta molhada empenha, cria mofo e perde vida util." },
    { acao: "Limpar o exterior do sax", como: "Pano de microfibra no corpo, chaves e campana. Sem produtos quimicos.", porque: "Suor das maos e acido e corroi o acabamento." },
    { acao: "Guardar no case", como: "Chaves para cima. Feche o case completamente.", porque: "Case aberto acumula poeira nas sapatilhas." },
  ];

  const cuidadosSemanais = [
    { acao: "Limpar as sapatilhas", como: "Papel de seda sob a chave. Pressione e puxe suavemente.", porque: "Sapatilhas grudadas = notas que nao respondem." },
    { acao: "Verificar folgas nas chaves", como: "Pressione cada chave. Se tem jogo lateral ou barulho, anote.", porque: "Folga = ar escapando = notas falhando." },
    { acao: "Lubrificar articulacoes", como: "1 gota de oleo fino em cada articulacao de chave.", porque: "Chaves sem lubrificacao ficam duras." },
    { acao: "Teste cromatico completo", como: "Todas as notas do Sib grave ao Fa# agudo, em piano (p).", porque: "Notas que falham em piano revelam vazamentos." },
  ];

  const cuidadosMensais = [
    { acao: "Inspecionar corticas", como: "Olhe cada cortica. Procure rachaduras ou ressecamento.", porque: "Cortica gasta = chave sem vedacao = vazamento." },
    { acao: "Verificar cortica do tudel", como: "Encaixe a boquilha. Deve ter resistencia leve e firme.", porque: "Boquilha solta desafina. Troca custa R$15-30." },
    { acao: "Teste de vazamento", como: "Feche chaves. Papel sob sapatilha, feche e puxe.", porque: "Detecta vazamentos antes de afetar o som." },
    { acao: "Verificar feltros", como: "Pequenos feltros que limitam movimento das chaves.", porque: "Feltros achatados = regulagem comprometida." },
    { acao: "Limpar interior do tudel", como: "Escova flexivel especifica. Passe suavemente.", porque: "Depositos afetam fluxo de ar." },
  ];

  const sinaisAlerta = [
    { sinal: "Notas graves nao saem ou saem fracas", gravidade: "ALTA", causa: "Sapatilha com vazamento", acao: "Leve ao luthier. NAO use Super Bonder.", custo: "R$ 30-80/sapatilha" },
    { sinal: "Barulho metalico ao tocar", gravidade: "MEDIA", causa: "Parafuso solto ou mola desencaixada", acao: "Luthier resolve em 5-10 min.", custo: "R$ 20-50" },
    { sinal: "Boquilha nao encaixa", gravidade: "MEDIA", causa: "Cortica do tudel gasta", acao: "Troca de cortica. Fita veda-rosca como emergencia.", custo: "R$ 15-30" },
    { sinal: "Chave travada ou dura", gravidade: "MEDIA", causa: "Falta de lubrificacao ou sujeira", acao: "1 gota de oleo. Se persistir, luthier.", custo: "R$ 20-40" },
    { sinal: "Afinacao muito instavel", gravidade: "MEDIA", causa: "Multiplas causas possiveis", acao: "Teste palheta nova primeiro.", custo: "R$ 100-250 (regulagem)" },
    { sinal: "Cheiro forte ou mofo no case", gravidade: "BAIXA", causa: "Umidade acumulada", acao: "Lave com bicarbonato. Sachet de silica gel.", custo: "R$ 0" },
  ];

  const guiaPalhetas = [
    {
      titulo: "Como Escolher a Forca (Numero)",
      itens: [
        "Iniciante (0-1 ano): palhetas 1.5 a 2",
        "Intermediario (1-3 anos): palhetas 2.5 a 3",
        "Avancado (3+ anos): palhetas 3 a 3.5+",
        "Boquilha mais aberta = palheta mais macia",
      ],
    },
    {
      titulo: "Como Amaciar Palhetas Novas",
      itens: [
        "Dia 1: toque apenas 5 minutos",
        "Dia 2: toque 10 minutos",
        "Dia 3-4: aumente para 15-20 min",
        "Dia 5+: use normalmente",
        "NUNCA toque palheta nova por 1 hora direto",
      ],
    },
    {
      titulo: "Quanto Tempo Dura Cada Palheta",
      itens: [
        "Uso diario: 2 a 4 semanas",
        "Uso esporadico: 4 a 8 semanas",
        "Descartar quando som fica abafado",
        "Sinteticas duram 3-6 meses",
      ],
    },
    {
      titulo: "Comparativo de Marcas",
      itens: [
        "Vandoren Tradicional (azul) \u2014 equilibrada",
        "Vandoren Java (verde) \u2014 jazz/pop",
        "Vandoren V12 (cinza) \u2014 erudito/bossa",
        "D'Addario Select Jazz \u2014 improvisacao",
        "Rico Royal \u2014 custo-beneficio",
        "Legere Signature (sintetica) \u2014 premium",
      ],
    },
  ];

  // COVER
  drawCoverPage(doc, "Checklist Manutencao", "Sax + Guia Completo de Palhetas", "GUIA PROFISSIONAL \u2022 22+ PAGINAS", COLORS.emerald, [
    "5 cuidados diarios essenciais",
    "4 cuidados semanais preventivos",
    "5 inspecoes mensais",
    "6 sinais de alerta com custos estimados",
    "Guia completo de palhetas com comparativo",
    "Checklist imprimivel",
    "Tabela de economia",
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
    "3. Cuidados Semanais .......... pag. 6",
    "4. Cuidados Mensais .......... pag. 7",
    "5. Sinais de Alerta .......... pag. 9",
    "6. Guia de Palhetas .......... pag. 11",
    "7. Tabela de Economia .......... pag. 14",
  ];
  
  drawRoundedRect(doc, MARGIN + 5, 45, CONTENT_W - 10, tocItems.length * 10 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 57 + i * 10, { size: 10, color: COLORS.white });
  });

  // CHECKLIST VISUAL
  doc.addPage();
  drawPageBg(doc);
  let y = drawSectionHeader(doc, MARGIN, "Checklist Imprimivel", "Recorte e cole no espaco de estudo", COLORS.emerald);
  y += 5;

  const checklists = [
    { freq: "DIARIO", cor: COLORS.emerald, items: ["Swab interno (2-3x)", "Secar boquilha", "Remover/secar palheta", "Limpar exterior", "Guardar no case fechado"] },
    { freq: "SEMANAL", cor: COLORS.blue, items: ["Limpar sapatilhas", "Verificar folgas", "Lubrificar articulacoes", "Teste cromatico"] },
    { freq: "MENSAL", cor: COLORS.amber, items: ["Inspecionar corticas", "Testar vazamentos", "Verificar feltros", "Limpar tudel", "Cortica do bocal ok?"] },
  ];

  checklists.forEach((cl) => {
    y = ensureSpace(doc, y, cl.items.length * 8 + 18);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, cl.items.length * 8 + 14, 4, COLORS.cardBg);
    drawRoundedRect(doc, MARGIN + 3, y + 3, 40, 8, 2, cl.cor);
    addText(doc, cl.freq, MARGIN + 23, y + 8.5, { size: 8, color: COLORS.white, style: "bold", align: "center" });
    cl.items.forEach((item, j) => {
      addText(doc, `\u25A1  ${item}`, MARGIN + 8, y + 16 + j * 8, { size: 10, color: COLORS.white });
    });
    y += cl.items.length * 8 + 18;
  });

  // CUIDADOS DIARIOS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Diarios", "5 minutos que salvam seu sax", COLORS.emerald);
  y += 3;

  cuidadosDiarios.forEach((item) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, `\u2713 ${item.acao}`, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 14, { size: 10, color: COLORS.muted });
    addText(doc, `\u2192 ${item.porque}`, MARGIN + 5, y + 20, { size: 10, color: COLORS.emerald, style: "italic" });
    y += 27;
  });

  // CUIDADOS SEMANAIS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Semanais", "15 minutos por semana \u2014 manutencao preventiva", COLORS.blue);
  y += 3;

  cuidadosSemanais.forEach((item) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, `\u2713 ${item.acao}`, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 14, { size: 10, color: COLORS.muted });
    addText(doc, `\u2192 ${item.porque}`, MARGIN + 5, y + 20, { size: 10, color: COLORS.blue, style: "italic" });
    y += 27;
  });

  // CUIDADOS MENSAIS
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Cuidados Mensais", "Inspecao completa \u2014 detecte problemas cedo", COLORS.amber);
  y += 3;

  cuidadosMensais.forEach((item) => {
    y = ensureSpace(doc, y, 28);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 24, 3, COLORS.cardBg);
    addText(doc, `\u2713 ${item.acao}`, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, `Como: ${item.como}`, MARGIN + 5, y + 14, { size: 10, color: COLORS.muted });
    addText(doc, `\u2192 ${item.porque}`, MARGIN + 5, y + 20, { size: 10, color: COLORS.amber, style: "italic" });
    y += 27;
  });

  // SINAIS DE ALERTA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Sinais de Alerta", "Quando procurar o luthier \u2014 com custos estimados", COLORS.red);
  y += 3;

  sinaisAlerta.forEach((item) => {
    y = ensureSpace(doc, y, 32);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 28, 3, COLORS.cardBg);
    addText(doc, item.sinal, MARGIN + 5, y + 7, { size: 11, color: COLORS.white, style: "bold" });
    addText(doc, `Gravidade: ${item.gravidade}  |  Causa: ${item.causa}`, MARGIN + 5, y + 14, { size: 9, color: COLORS.muted });
    addText(doc, `Acao: ${item.acao}`, MARGIN + 5, y + 20, { size: 9, color: COLORS.emerald });
    addText(doc, `Custo estimado: ${item.custo}`, MARGIN + 5, y + 25, { size: 9, color: COLORS.amber, style: "italic" });
    y += 31;
  });

  // GUIA DE PALHETAS
  guiaPalhetas.forEach((secao) => {
    doc.addPage();
    drawPageBg(doc);
    y = drawSectionHeader(doc, MARGIN, secao.titulo, "Guia completo de palhetas", COLORS.violet);
    y += 3;

    secao.itens.forEach((item) => {
      y = ensureSpace(doc, y, 12);
      drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.cardBg);
      addText(doc, `\u2022 ${item}`, MARGIN + 5, y + 7, { size: 10, color: COLORS.white });
      y += 12;
    });
  });

  // TABELA DE ECONOMIA
  doc.addPage();
  drawPageBg(doc);
  y = drawSectionHeader(doc, MARGIN, "Quanto Voce Economiza", "Comparativo: com e sem manutencao preventiva", COLORS.emerald);
  y += 5;

  const economia = [
    { item: "Sapatilha grudenta", sem: "R$ 50-80 / 2 meses", com: "R$ 0 (limpeza semanal)" },
    { item: "Regulagem geral", sem: "R$ 200-350 / 6 meses", com: "R$ 200-350 / 2 anos" },
    { item: "Troca de sapatilhas", sem: "R$ 300-600/ano", com: "R$ 100-200/ano" },
    { item: "Palhetas desperdicadas", sem: "R$ 40-60/mes", com: "R$ 20-35/mes" },
  ];

  // Header
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.emerald);
  addText(doc, "ITEM", MARGIN + 5, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "SEM CUIDADO", MARGIN + 55, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "COM CUIDADO", MARGIN + 115, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  y += 12;

  economia.forEach((row, i) => {
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 1, bg);
    addText(doc, row.item, MARGIN + 5, y + 7, { size: 9, color: COLORS.white, style: "bold" });
    addText(doc, row.sem, MARGIN + 55, y + 7, { size: 9, color: COLORS.red });
    addText(doc, row.com, MARGIN + 115, y + 7, { size: 9, color: COLORS.emerald });
    y += 11;
  });

  // REGRA DE OURO
  y += 8;
  y = ensureSpace(doc, y, 50);
  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 45, 4, COLORS.emerald);
  drawRoundedRect(doc, MARGIN + 1.5, y + 1.5, CONTENT_W - 3, 42, 3, COLORS.cardBg);
  doc.setFillColor(...COLORS.emerald);
  doc.roundedRect(MARGIN + 1.5, y + 6, 2.5, 33, 1, 1, "F");
  addText(doc, "REGRA DE OURO", MARGIN + 10, y + 14, { size: 16, color: COLORS.emerald, style: "bold" });
  addText(doc, "5 minutos de cuidado apos cada sessao", MARGIN + 8, y + 23, { size: 13, color: COLORS.white });
  addText(doc, "economizam horas no luthier e", MARGIN + 8, y + 31, { size: 13, color: COLORS.white });
  addText(doc, "centenas de reais por ano.", MARGIN + 8, y + 39, { size: 13, color: COLORS.white });

  addPageNumber(doc, logoBase64);
  doc.save("Checklist-Manutencao-Sax-Clube do Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF BONUS 1 — ROTINA DE ESTUDO PARA SAXOFONISTAS
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
        "Notas longas: Sib, Do, Re \u2014 8 tempos cada, foco em timbre",
        "Respiracao diafragmatica: inspire 4, segure 4, expire 8 \u2014 5x",
        "Escalas cromaticas lentas: Sib grave ao Fa# agudo",
        "Glissandos suaves entre notas vizinhas",
      ],
    },
    {
      titulo: "Tecnica (15-20 min)",
      color: COLORS.blue,
      icon: "TECHNIQUE",
      items: [
        "Escalas maiores: 2 tonalidades por dia",
        "Escalas menores: natural, harmonica e melodica",
        "Arpejos: maior, menor, dominante e diminuto",
        "Intervalos de tercas e quartas",
        "Articulacao: staccato, legato, acentuacao com metronomo",
        "Padroes ritmicos: colcheias, tercinas, semicolcheias",
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
        "Toque sobre um backing track em tom maior \u2014 use apenas a escala pentatonica",
        "Adicione a blue note e cromatismos conforme ganhar confianca",
        "Pratique frases de 2 compassos: crie, repita, varie",
        "Copie solos de referencia (Charlie Parker, Stan Getz, Cannonball)",
        "Grave seus improvisos e analise o que funcionou",
      ],
    },
    {
      titulo: "Revisao e Desafio Semanal",
      color: COLORS.cyan,
      icon: "REVIEW",
      items: [
        "Domingo: Revise o que praticou na semana e anote progresso",
        "Escolha 1 musica desafiadora acima do seu nivel atual",
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

  // COVER
  drawCoverPage(doc, "Rotina de Estudo", "Guia Completo para Saxofonistas", "BONUS EXCLUSIVO PREMIUM", COLORS.emerald, [
    "5 etapas da rotina diaria ideal",
    "Aquecimento, tecnica, repertorio, improvisacao",
    "Rotina semanal dia a dia",
    "Dicas de ouro para evolucao rapida",
    "Pronto para imprimir e colar na estante",
  ], logoBase64);

  // TOC
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.emerald);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 18, color: COLORS.white, style: "bold", align: "center" });

  const tocItems = [
    "1. Aquecimento (10-15 min) .......... pag. 3",
    "2. Tecnica (15-20 min) .......... pag. 4",
    "3. Repertorio (20-30 min) .......... pag. 5",
    "4. Improvisacao (10-15 min) .......... pag. 6",
    "5. Revisao Semanal .......... pag. 7",
    "6. Rotina Semanal Sugerida .......... pag. 8",
    "7. Dicas de Ouro .......... pag. 9",
  ];

  drawRoundedRect(doc, MARGIN + 5, 45, CONTENT_W - 10, tocItems.length * 10 + 15, 6, COLORS.cardBg);
  tocItems.forEach((item, i) => {
    addText(doc, item, MARGIN + 15, 57 + i * 10, { size: 10, color: COLORS.white });
  });

  // SECTIONS
  sections.forEach((sec, secIdx) => {
    doc.addPage();
    drawPageBg(doc);
    doc.setFillColor(...sec.color);
    doc.rect(0, 0, PAGE_W, 3, "F");
    
    let y = drawSectionHeader(doc, MARGIN + 5, sec.titulo, "Etapa da rotina diaria", sec.color);
    y += 4;

    sec.items.forEach((item, idx) => {
      y = ensureSpace(doc, y, 18);
      drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.cardBg);
      drawAccentBar(doc, y + 1, sec.color);
      addText(doc, `${idx + 1}.`, MARGIN + 8, y + 9, { size: 12, color: sec.color, style: "bold" });
      addText(doc, item, MARGIN + 16, y + 9, { size: 10, color: COLORS.white, maxWidth: CONTENT_W - 24 });
      y += 17;
    });

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
    drawRoundedRect(doc, MARGIN + 3, y + 2, 28, 10, 2, dayColors[i] || COLORS.emerald);
    addText(doc, day.day, MARGIN + 17, y + 9, { size: 9, color: COLORS.white, style: "bold", align: "center" });
    addText(doc, day.focus, MARGIN + 36, y + 9, { size: 10, color: COLORS.white, maxWidth: CONTENT_W - 42 });
    y += 17;
  });

  y = drawSeparator(doc, y + 4, COLORS.emerald, "gradient");

  // DICAS DE OURO
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.amber);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Dicas de Ouro", "Principios que aceleram sua evolucao", COLORS.amber);
  y += 4;

  const dicasOuro = [
    "Consistencia > intensidade: 30 min/dia > 3 horas no fim de semana",
    "Use metronomo SEMPRE: comece devagar, aumente 5 BPM por dia",
    "Grave-se: ouvir de fora revela erros que voce nao percebe tocando",
    "Varie os generos: desenvolve versatilidade e mantem motivacao",
    "Descanse: se a embocadura cansar, pare. Forcar causa maus habitos",
  ];

  dicasOuro.forEach((dica, idx) => {
    y = ensureSpace(doc, y, 18);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.cardBg);
    drawAccentBar(doc, y + 1, COLORS.amber);
    drawRoundedRect(doc, MARGIN + 7, y + 2, 10, 10, 5, COLORS.amber);
    addText(doc, `${idx + 1}`, MARGIN + 12, y + 9, { size: 10, color: COLORS.white, style: "bold", align: "center" });
    addText(doc, dica, MARGIN + 22, y + 9, { size: 10, color: COLORS.white, maxWidth: CONTENT_W - 28 });
    y += 18;
  });

  y += 6;
  y = drawHighlightBox(doc, y, "Lembre-se:", "A pratica consistente e o segredo de todo grande saxofonista.", COLORS.emerald);

  addPageNumber(doc, logoBase64);
  doc.save("Rotina-de-Estudo-Saxofonistas-Clube do Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF BONUS 2 — MAPA DE TONALIDADES PARA SAX
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

  const escalas = [
    { tom: "Do Maior", notas: "Do Re Mi Fa Sol La Si", acidentes: "0" },
    { tom: "Sol Maior", notas: "Sol La Si Do Re Mi Fa#", acidentes: "1#" },
    { tom: "Re Maior", notas: "Re Mi Fa# Sol La Si Do#", acidentes: "2#" },
    { tom: "La Maior", notas: "La Si Do# Re Mi Fa# Sol#", acidentes: "3#" },
    { tom: "Mi Maior", notas: "Mi Fa# Sol# La Si Do# Re#", acidentes: "4#" },
    { tom: "Si Maior", notas: "Si Do# Re# Mi Fa# Sol# La#", acidentes: "5#" },
    { tom: "Fa Maior", notas: "Fa Sol La Sib Do Re Mi", acidentes: "1b" },
    { tom: "Sib Maior", notas: "Sib Do Re Mib Fa Sol La", acidentes: "2b" },
    { tom: "Mib Maior", notas: "Mib Fa Sol Lab Sib Do Re", acidentes: "3b" },
    { tom: "Lab Maior", notas: "Lab Sib Do Reb Mib Fa Sol", acidentes: "4b" },
  ];

  const relativas = [
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
    { nome: "Dorico (II)", caracter: "Menor suave, jazzy", uso: "Jazz, Funk" },
    { nome: "Frigio (III)", caracter: "Exotico, tenso", uso: "Flamenco" },
    { nome: "Lidio (IV)", caracter: "Sonhador, aberto", uso: "Film scoring" },
    { nome: "Mixolidio (V)", caracter: "Dominante, bluesy", uso: "Blues, Rock, Baiao" },
    { nome: "Eolio (VI)", caracter: "Melancolico, natural", uso: "Baladas, Gospel" },
    { nome: "Locrio (VII)", caracter: "Instavel, dissonante", uso: "Jazz avancado" },
  ];

  // COVER
  drawCoverPage(doc, "Mapa de Tonalidades", "Referencia Visual para Sax", "BONUS EXCLUSIVO PREMIUM", COLORS.blue, [
    "Tabela de transposicao para 4 saxofones",
    "10 escalas maiores com notas",
    "Tonalidades relativas",
    "Os 7 modos gregos",
    "Dicas praticas de uso",
  ], logoBase64);

  // TRANSPOSICAO
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, PAGE_W, 3, "F");
  let y = drawSectionHeader(doc, MARGIN + 5, "Tabela de Transposicao", "O saxofone e um instrumento transpositor", COLORS.blue);
  y += 4;

  transposicao.forEach((t) => {
    y = ensureSpace(doc, y, 22);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 18, 3, COLORS.cardBg);
    addText(doc, t.sax, MARGIN + 5, y + 7, { size: 11, color: COLORS.blue, style: "bold" });
    addText(doc, `Regra: ${t.regra}`, MARGIN + 5, y + 13, { size: 9, color: COLORS.muted });
    addText(doc, `Exemplo: ${t.exemplo}`, MARGIN + 5, y + 17, { size: 9, color: COLORS.cyan, style: "italic" });
    y += 21;
  });

  // ESCALAS
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.emerald);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Escalas Maiores", "Concert Pitch \u2014 nota real", COLORS.emerald);
  y += 3;

  drawRoundedRect(doc, MARGIN, y, CONTENT_W, 10, 2, COLORS.emerald);
  addText(doc, "TONALIDADE", MARGIN + 5, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "NOTAS", MARGIN + 45, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  addText(doc, "ACIDENTES", MARGIN + 135, y + 7, { size: 9, color: COLORS.white, style: "bold" });
  y += 12;

  escalas.forEach((e, i) => {
    y = ensureSpace(doc, y, 10);
    const bg = i % 2 === 0 ? COLORS.cardBg : COLORS.lightCardBg;
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 9, 1, bg);
    addText(doc, e.tom, MARGIN + 5, y + 6.5, { size: 10, color: COLORS.white, style: "bold" });
    addText(doc, e.notas, MARGIN + 45, y + 6.5, { size: 9, color: COLORS.muted });
    addText(doc, e.acidentes, MARGIN + 135, y + 6.5, { size: 10, color: COLORS.amber, style: "bold" });
    y += 10;
  });

  // RELATIVAS
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.violet);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Tonalidades Relativas", "Cada maior tem uma relativa menor com as mesmas notas", COLORS.violet);
  y += 4;

  relativas.forEach((r, i) => {
    y = ensureSpace(doc, y, 14);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 12, 3, COLORS.cardBg);
    addText(doc, r.maior, MARGIN + 8, y + 8, { size: 11, color: COLORS.violet, style: "bold" });
    addText(doc, "\u2194", MARGIN + CONTENT_W / 2, y + 8, { size: 12, color: COLORS.muted, align: "center" });
    addText(doc, r.menor, MARGIN + CONTENT_W - 8, y + 8, { size: 11, color: COLORS.cyan, style: "bold", align: "right" });
    y += 15;
  });

  // MODOS
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.amber);
  doc.rect(0, 0, PAGE_W, 3, "F");
  y = drawSectionHeader(doc, MARGIN + 5, "Os 7 Modos Gregos", "Variacoes da escala maior com diferentes 'cores' sonoras", COLORS.amber);
  y += 4;

  const modeColors: [number, number, number][] = [COLORS.emerald, COLORS.blue, COLORS.red, COLORS.cyan, COLORS.amber, COLORS.violet, COLORS.muted];

  modos.forEach((m, i) => {
    y = ensureSpace(doc, y, 20);
    drawRoundedRect(doc, MARGIN, y, CONTENT_W, 16, 3, COLORS.cardBg);
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
  doc.save("Mapa-de-Tonalidades-Sax-Clube do Sax.pdf");
}

/* ═══════════════════════════════════════════════════════════
   PDF BONUS 3 — 100 MUSICAS QUE TODO SAXOFONISTA PRECISA SABER
   ═══════════════════════════════════════════════════════════ */

export async function generateMusicasPDF() {
  const logoBase64 = await loadLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  type Song = { name: string; artist: string; genre: string; difficulty: "Iniciante" | "Intermediario" | "Avancado"; tip: string };

  const songs: Song[] = [
    { name: "Careless Whisper", artist: "George Michael", genre: "Pop", difficulty: "Intermediario", tip: "O riff de sax mais famoso do mundo." },
    { name: "Baker Street", artist: "Gerry Rafferty", genre: "Rock", difficulty: "Intermediario", tip: "Solo iconico de sax. Registro agudo." },
    { name: "Take Five", artist: "Dave Brubeck", genre: "Jazz", difficulty: "Avancado", tip: "Compasso 5/4 \u2014 pratique com metronomo." },
    { name: "The Pink Panther", artist: "Henry Mancini", genre: "Jazz", difficulty: "Iniciante", tip: "Tema simples e divertido." },
    { name: "Fly Me to the Moon", artist: "Frank Sinatra", genre: "Jazz", difficulty: "Intermediario", tip: "Standard essencial." },
    { name: "Shape of You", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Melodia moderna e acessivel." },
    { name: "Perfect", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Balada para casamentos." },
    { name: "All of Me", artist: "John Legend", genre: "Pop", difficulty: "Iniciante", tip: "Melodia emotiva." },
    { name: "Garota de Ipanema", artist: "Tom Jobim", genre: "MPB/Bossa", difficulty: "Intermediario", tip: "O classico brasileiro." },
    { name: "Carinhoso", artist: "Pixinguinha", genre: "Choro/MPB", difficulty: "Intermediario", tip: "Hino do sax brasileiro." },
    { name: "Quao Grande E o Meu Deus", artist: "Soraya Moraes", genre: "Gospel", difficulty: "Iniciante", tip: "Hino de adoracao." },
    { name: "Amazing Grace", artist: "Tradicional", genre: "Gospel", difficulty: "Iniciante", tip: "O hino mais tocado do mundo." },
    { name: "Autumn Leaves", artist: "Joseph Kosma", genre: "Jazz", difficulty: "Intermediario", tip: "O standard mais tocado." },
    { name: "So What", artist: "Miles Davis", genre: "Jazz", difficulty: "Intermediario", tip: "Modal jazz. Escala dorica." },
    { name: "Summertime", artist: "George Gershwin", genre: "Jazz", difficulty: "Intermediario", tip: "Melodia belissima." },
    { name: "My Funny Valentine", artist: "Chet Baker", genre: "Jazz", difficulty: "Avancado", tip: "Balada jazz de referencia." },
    { name: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", difficulty: "Avancado", tip: "Arranjo desafiador." },
    { name: "Hotel California", artist: "Eagles", genre: "Rock", difficulty: "Intermediario", tip: "Muito pedido em eventos." },
    { name: "Bondade de Deus", artist: "Isaias Saad", genre: "Gospel", difficulty: "Iniciante", tip: "Hit moderno da adoracao." },
    { name: "Oceanos", artist: "Hillsong", genre: "Gospel", difficulty: "Intermediario", tip: "Adoracao profunda." },
    { name: "Wave", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediario", tip: "Harmonia sofisticada." },
    { name: "Mas Que Nada", artist: "Jorge Ben Jor", genre: "MPB", difficulty: "Iniciante", tip: "Energia pura." },
    { name: "Evidencias", artist: "Chitozinho & Xororo", genre: "MPB", difficulty: "Iniciante", tip: "Hino do karaoke brasileiro." },
    { name: "The Thrill Is Gone", artist: "B.B. King", genre: "Blues", difficulty: "Intermediario", tip: "Blues menor." },
    { name: "Feeling Good", artist: "Nina Simone", genre: "Blues/Soul", difficulty: "Intermediario", tip: "Build dramatico." },
    { name: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz/Soul", difficulty: "Iniciante", tip: "Atemporal." },
    { name: "My Heart Will Go On", artist: "Celine Dion", genre: "Soundtrack", difficulty: "Iniciante", tip: "Tema reconhecivel." },
    { name: "Hallelujah", artist: "Leonard Cohen", genre: "Folk/Pop", difficulty: "Iniciante", tip: "Universal." },
    { name: "Blue Bossa", artist: "Kenny Dorham", genre: "Jazz", difficulty: "Intermediario", tip: "Bossa + jazz." },
    { name: "Cantaloupe Island", artist: "Herbie Hancock", genre: "Jazz", difficulty: "Intermediario", tip: "Groove funky." },
    { name: "Nada Alem do Sangue", artist: "Fernandinho", genre: "Gospel", difficulty: "Iniciante", tip: "Adoracao intensa." },
    { name: "Way Maker", artist: "Sinach", genre: "Gospel", difficulty: "Iniciante", tip: "Internacional." },
    { name: "Besame Mucho", artist: "Consuelo Velazquez", genre: "Bolero", difficulty: "Iniciante", tip: "Romance latino." },
    { name: "Tequila", artist: "The Champs", genre: "Rock/Latina", difficulty: "Iniciante", tip: "Divertida e energetica." },
    { name: "Smooth Operator", artist: "Sade", genre: "Jazz/Pop", difficulty: "Intermediario", tip: "Groove suave." },
    { name: "Giant Steps", artist: "John Coltrane", genre: "Jazz", difficulty: "Avancado", tip: "Monte Everest do jazz." },
    { name: "Donna Lee", artist: "Charlie Parker", genre: "Bebop", difficulty: "Avancado", tip: "Teste supremo de tecnica." },
    { name: "Spain", artist: "Chick Corea", genre: "Jazz/Fusion", difficulty: "Avancado", tip: "Fusao latina brilhante." },
    { name: "Naima", artist: "John Coltrane", genre: "Jazz", difficulty: "Intermediario", tip: "Beleza pura." },
    { name: "Watermelon Man", artist: "Herbie Hancock", genre: "Jazz/Funk", difficulty: "Intermediario", tip: "Funky e acessivel." },
    { name: "Moanin'", artist: "Art Blakey", genre: "Hard Bop", difficulty: "Intermediario", tip: "Hard bop essencial." },
    { name: "Pais Tropical", artist: "Jorge Ben Jor", genre: "Samba", difficulty: "Iniciante", tip: "Alegre e festivo." },
    { name: "Brasileirinho", artist: "Waldir Azevedo", genre: "Choro", difficulty: "Avancado", tip: "Velocidade e precisao." },
    { name: "Moon River", artist: "Henry Mancini", genre: "Jazz/Soundtrack", difficulty: "Iniciante", tip: "Elegancia pura." },
    { name: "Yesterday", artist: "The Beatles", genre: "Pop/Rock", difficulty: "Iniciante", tip: "Simplicidade e tudo." },
    { name: "Imagine", artist: "John Lennon", genre: "Pop/Rock", difficulty: "Iniciante", tip: "Hino da paz." },
    { name: "Stand By Me", artist: "Ben E. King", genre: "Soul", difficulty: "Iniciante", tip: "Groove constante." },
    { name: "Georgia on My Mind", artist: "Ray Charles", genre: "Jazz/Blues", difficulty: "Intermediario", tip: "Classico atemporal." },
    { name: "Misty", artist: "Erroll Garner", genre: "Jazz", difficulty: "Intermediario", tip: "Ideal para shows." },
    { name: "Cinema Paradiso", artist: "Ennio Morricone", genre: "Soundtrack", difficulty: "Intermediario", tip: "Obra-prima." },
  ];

  const diffColor: Record<string, [number, number, number]> = {
    Iniciante: COLORS.green,
    Intermediario: COLORS.amber,
    Avancado: COLORS.red,
  };

  const iniciantes = songs.filter(s => s.difficulty === "Iniciante").length;
  const intermediarios = songs.filter(s => s.difficulty === "Intermediario").length;
  const avancados = songs.filter(s => s.difficulty === "Avancado").length;

  // COVER
  drawCoverPage(doc, "100 Musicas Essenciais", "Todo Saxofonista Precisa Saber", "BONUS EXCLUSIVO PREMIUM", COLORS.amber, [
    `${songs.length} musicas curadas por especialistas`,
    "Pop, Jazz, MPB, Gospel, Blues, Rock e mais",
    "Nivel de dificuldade para cada musica",
    "Dicas de interpretacao",
    "Lista completa em formato PDF",
  ], logoBase64);

  // TOC with stats
  doc.addPage();
  drawPageBg(doc);
  doc.setFillColor(...COLORS.amber);
  doc.rect(0, 0, PAGE_W, 4, "F");
  addText(doc, "SUMARIO", PAGE_W / 2, 35, { size: 18, color: COLORS.white, style: "bold", align: "center" });

  let yToc = 50;
  drawRoundedRect(doc, MARGIN + 5, yToc, CONTENT_W - 10, 35, 6, COLORS.lightCardBg);
  addText(doc, "RESUMO DA LISTA", MARGIN + 15, yToc + 9, { size: 11, color: COLORS.amber, style: "bold" });
  
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
    
    drawRoundedRect(doc, MARGIN + 2, y + 2, 12, 12, 2, dc);
    addText(doc, num, MARGIN + 8, y + 10, { size: 9, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, song.name, MARGIN + 18, y + 6.5, { size: 10, color: COLORS.white, style: "bold" });
    
    drawRoundedRect(doc, MARGIN + CONTENT_W - 28, y + 2, 26, 6, 3, dc);
    addText(doc, song.difficulty, MARGIN + CONTENT_W - 15, y + 6.5, { size: 6.5, color: COLORS.white, style: "bold", align: "center" });
    
    addText(doc, `${song.artist}  |  ${song.genre}`, MARGIN + 18, y + 11, { size: 8, color: COLORS.muted });
    addText(doc, song.tip, MARGIN + 18, y + 14.5, { size: 7.5, color: dc, style: "italic", maxWidth: CONTENT_W - 24 });
    y += 18;
    
    if ((i + 1) % 25 === 0 && i < songs.length - 1) {
      y = drawSeparator(doc, y, COLORS.amber, "dots");
    }
  });

  addPageNumber(doc, logoBase64);
  doc.save("100-Musicas-Saxofonista-Clube do Sax.pdf");
}
