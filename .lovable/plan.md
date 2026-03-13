
Objetivo: eliminar os bugs visuais do acervo com prioridade em celular, cobrindo vídeo tutorial, listas/cards e barra fixa de áudio.

1) Levantamento do que está quebrado hoje (confirmado)
- Vídeo tutorial (premium): está renderizando `<video controls>` já no estado inicial no mobile, aparecendo controles nativos/“0:00” antes do play e visual inconsistente.
- Vídeo tutorial (basic): o card bloqueado ainda renderiza `<video>` por baixo (com blur), o que mantém artefatos visuais desnecessários.
- Barra fixa de áudio: ao tocar playback, o conteúdo de baixo fica encoberto (falta padding reativo da página).
- Botão “X” do player: não fecha de verdade (player continua visível).
- PDF + áudio: comportamento de “player visível enquanto vê partitura” fica inconsistente por estado fora de sincronia.
- Navegação em pastas: ao entrar em subpastas profundas, o scroll não volta ao topo e a tela parece “quebrada/cortada”.

2) Plano de correção (ordem de execução)
- Etapa A — Corrigir arquitetura de estado do player
  - Sincronizar estado do `AudioPlayerBar` com o `Acervo` (faixa ativa + tocando/pausado + visibilidade).
  - Remover dependência visual de `playerRef.current` no render (não reativo).
  - Fazer o “X” limpar faixa ativa internamente e externamente.
  - Derivar `hasAudioPlaying` de estado real do player e aplicar padding inferior correto no layout.
  - Ajustar overlay de PDF para respeitar player visível no mobile/desktop.

- Etapa B — Reestruturar vídeo tutorial para evitar glitches
  - Trocar o estado inicial para thumbnail estática com botão de play customizado.
  - Montar o `<video>` apenas após clique (lazy mount), com autoplay/controls só no estado de reprodução.
  - No plano básico, não renderizar `<video>` por baixo: usar apenas imagem + overlay de bloqueio.
  - Garantir carregamento rápido do thumbnail sem piscar/artefatos.

- Etapa C — Polimento de cards/listas e navegação
  - Ajustar quebra de texto e ações dos cards para evitar desalinhamento em nomes longos.
  - Garantir que botões dos cards mantenham layout estável no mobile.
  - Aplicar scroll-to-top ao abrir pasta, voltar e clicar breadcrumb (evita sensação de tela “bugada” ao navegar profundo).

3) Detalhes técnicos (implementação)
- Arquivos principais:
  - `src/pages/Acervo.tsx`
  - `src/components/acervo/AudioPlayerBar.tsx`
  - `src/components/acervo/FileCard.tsx`
- Refactor do player:
  - Introduzir callback de estado do player (`onStateChange`) para o pai.
  - `onClose` passa a limpar `internalFile` + pausar áudio + resetar estado.
  - UI de lista usa estado reativo do pai (não `ref` mutável) para “tocando agora”.
- Tutorial:
  - Estado `isTutorialPlaying` no banner.
  - Pré-play = `<img>` + CTA; pós-play = `<video>`.
  - Locked = thumbnail estática com overlay de upgrade (sem `<video>` ativo).

4) Validação final (obrigatória)
- Mobile primeiro (390x844), depois desktop (1366x768).
- Rotas: `/plano-premium-completo` e `/acervo-basico`.
- Cenários:
  1. Abrir página e validar tutorial sem controles quebrados antes do play.
  2. Entrar em múltiplas pastas e confirmar topo/navegação estáveis.
  3. Tocar playback, rolar até o fim e validar que nada fica escondido pela barra.
  4. Fechar player no “X” e confirmar desaparecimento total.
  5. Com áudio ativo, abrir partitura e confirmar comportamento visual correto.
  6. Repetir no desktop para garantir paridade visual.

Sem mudanças de backend: correção é 100% frontend e de estado/UX.
