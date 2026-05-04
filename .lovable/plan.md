
# Plano: Melhorias nas Ferramentas, PDFs e Páginas de Venda

## 1. Melhorar o Afinador (Tuner.tsx)
- Aumentar `fftSize` de 2048 para 4096 para maior precisão na detecção de frequência
- Adicionar suavização (smoothing) para evitar oscilação entre notas — média móvel das últimas 5 leituras
- Exibir a frequência detectada em Hz para referência
- Melhorar o visual do gauge com indicadores de -50 a +50 cents mais claros
- Adicionar indicador visual de "AFINADO" com animação quando `cents` estiver entre -5 e +5

## 2. Melhorar o Metrônomo (Metronome.tsx)
- Corrigir timing usando `AudioContext.currentTime` scheduling em vez de `setTimeout` (elimina drift)
- Adicionar tap-tempo (tocar 3x para detectar BPM automaticamente)
- Visual mais impactante nos beat indicators com pulse animation
- Adicionar preset de BPM rápido (Lento/Moderado/Rápido)

## 3. Melhorar o Gerador de Escalas (ScaleGenerator.tsx)
- Adicionar seleção de arpejos como tab separada
- Melhorar visual com cards mais destacados para as notas
- Adicionar botão para tocar cada nota individual ao clicar

## 4. Logo nos PDFs
- A logo `logo-clube-do-sax.png` já está importada e usada nos PDFs via `pdfGenerators.ts`
- Verificar e garantir que a logo aparece no header de todas as páginas (já implementado em `addPageNumber`)
- Copiar a logo enviada pelo usuário (image-5.png) para `src/assets/` substituindo a existente, garantindo que é a versão mais atualizada

## 5. Redesign das Páginas de Upsell e Downsell
**UpsellToolkit.tsx** e **DownsellToolkit.tsx**:
- Redesign com visual mais impactante: hero com gradiente, glassmorphism cards, animações
- Copy mais persuasiva e magnética
- **CTA com `<a href="#">` direto para checkout** (sem navegar para outra página intermediária) — substituir Link por `<a>` com href do checkout Cakto
- Adicionar social proof (contadores, garantia)
- Seção de comparação "Com vs Sem" as ferramentas
- Adicionar mockup visual das ferramentas (screenshots estilizados)

## 6. Redesign das Thank You Pages
**ThankYouBasico.tsx** e **ThankYouCompleto.tsx**:
- Melhorar visual geral com mais destaque para a confirmação
- Seção de upsell mais visual com preview animada das ferramentas
- **Mudar o botão de upsell de Link (que abre outra página) para `<a href="#">` direto para checkout** — o clique vai direto para o pagamento sem página intermediária
- Confetti animation no hero de confirmação
- Cards com ícones maiores e gradientes

## 7. Logo atualizada em todos os arquivos
- Copiar a logo enviada (user-uploads://image-5.png) para `src/assets/logo-clube-do-sax.png`
- Como todos os componentes já importam desse path, a atualização será automática em todos os arquivos e PDFs

---

**Detalhes técnicos:**
- Tuner: `analyser.fftSize = 4096`, smoothing buffer de 5 frames, display Hz
- Metronome: `AudioContext` scheduling com `osc.start(nextBeatTime)` em vez de setTimeout
- Upsell/Downsell/ThankYou: remover `<Link to="/cx/v3j8q2">` e substituir por `<a href="#">` (placeholder para link Cakto)
- PDFs: logo já está implementada, apenas garantir que a nova imagem seja a correta
