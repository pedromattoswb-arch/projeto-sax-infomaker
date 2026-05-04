
# Plano: Bônus Visuais + Upsell & Downsell

## Parte 1 — Melhorar os Bônus Existentes

Os 3 bônus atuais (Rotina de Estudo, Mapa de Tonalidades, 100 Músicas) são páginas web com texto e PDFs gerados via jsPDF. Falta conteúdo visual real (cifras, notação musical, diagramas de digitação).

**O que muda:**
- **Bônus Rotina de Estudo**: Adicionar diagramas visuais de exercícios (escalas escritas em notação simplificada com cifras), tabela semanal visual de rotina
- **Bônus Mapa de Tonalidades**: Adicionar Ciclo de Quintas visual interativo, tabelas de escalas com as notas destacadas graficamente, cifras escritas por extenso com posições
- **Bônus 100 Músicas**: Adicionar cifras/acordes de referência de cada música, tonalidade original e transposta para Sax Alto/Tenor, nível visual com estrelas

Os PDFs também serão atualizados com layouts mais ricos (diagramas ASCII de digitação do sax, tabelas de cifras formatadas).

---

## Parte 2 — Produto Upsell: "Kit Ferramentas do Saxofonista" (R$ 27,90)

**Conceito:** Um conjunto de 3 ferramentas interativas web que nenhum app de partituras oferece integrado. Algo que o saxofonista usa TODA VEZ que vai estudar — e que complementa perfeitamente o acervo de partituras.

### Ferramenta 1: Afinador Cromático para Sax (Web Audio API)
- Usa o microfone do celular/PC para detectar a nota tocada em tempo real
- Mostra a nota detectada, cents de desvio (+/- afinação), e a nota correta
- Já calibrado para Sax Alto (Eb) e Sax Tenor (Bb) — mostra a nota de concerto e a nota transposta
- Visual bonito com ponteiro analógico e indicador verde/vermelho

### Ferramenta 2: Metrônomo Inteligente
- Metrônomo visual + sonoro com BPM ajustável (40-220)
- Fórmulas de compasso: 2/4, 3/4, 4/4, 6/8
- Modo "progressivo": aumenta o BPM automaticamente a cada X compassos (para exercícios de velocidade)
- Som de clique claro, com acento no primeiro tempo

### Ferramenta 3: Gerador de Escalas e Arpejos
- Selecione: tonalidade + tipo de escala (maior, menor, pentatônica, blues, modos)
- Mostra: as notas da escala já transpostas para Sax Alto ou Tenor
- Mostra: os arpejos derivados (tríade, tétrade)
- Botão para ouvir a escala (sons sintetizados)
- Referência rápida de consulta — substitui decorar

**Por que vai vender:** O saxofonista que comprou o acervo PRECISA dessas ferramentas para estudar. Afinador + metrônomo são apps separados que ele paga individualmente. Aqui vem tudo integrado, com transposição automática para sax, na mesma plataforma.

**Entrega:** Uma página web protegida (rota obfuscada tipo `/cx/k9t3m7`) com as 3 ferramentas em abas.

---

## Parte 3 — Produto Downsell: "Metrônomo + Afinador Pro" (R$ 14,90)

Se a pessoa recusar o upsell de R$ 27,90, oferecemos apenas as 2 ferramentas mais essenciais:
- Afinador Cromático para Sax
- Metrônomo Inteligente

Sem o gerador de escalas. Preço mais baixo, mas ainda entrega valor imediato.

**Entrega:** Mesma página web mas com acesso apenas às 2 primeiras ferramentas.

---

## Parte 4 — Páginas de Venda (Upsell e Downsell)

### Página Upsell (inserida na Thank You page)
- Seção com headline impactante: "Espera! Falta uma coisa para você estudar de verdade..."
- Apresentação visual das 3 ferramentas com mockups/ícones
- Preço de R$ 27,90 (pagamento único)
- Botão CTA "QUERO O KIT COMPLETO"
- Botão menor "Não, obrigado" que leva ao downsell

### Página Downsell
- Headline: "Tudo bem! Que tal só o Afinador + Metrônomo por R$ 14,90?"
- Apresentação simplificada
- CTA + botão de recusar que vai para a thank you page final

---

## Implementação Técnica

1. **Bônus**: Editar `BonusRotina.tsx`, `BonusTonalidades.tsx`, `BonusMusicas.tsx` e seus respectivos geradores PDF em `pdfGenerators.ts`
2. **Ferramentas Upsell**: Criar componentes `Tuner.tsx`, `Metronome.tsx`, `ScaleGenerator.tsx` + página `ToolkitPage.tsx`
3. **Páginas de venda**: Criar `UpsellToolkit.tsx` e `DownsellToolkit.tsx`
4. **Thank You pages**: Modificar `ThankYouBasico.tsx` e `ThankYouCompleto.tsx` para incluir seção de upsell antes das instruções de acesso
5. **Rotas**: Adicionar rotas obfuscadas no `App.tsx`

Tudo é front-end puro (Web Audio API para o afinador, AudioContext para o metrônomo, dados estáticos para escalas). Nenhuma dependência de backend adicional.
