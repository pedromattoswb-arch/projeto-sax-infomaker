

## Plano: Visualizador de PDF embutido para partituras

### O que será feito

Criar um modal/dialog de visualização de partituras que abre ao clicar no card da música. Como estamos no mockup (sem Google Drive ainda), usaremos as imagens de partitura existentes em `src/assets/partituras-exemplo/` como conteúdo de exemplo.

### Componentes

**1. `PdfViewer.tsx`** — Modal fullscreen com:
- Exibição da partitura (imagem no mockup, `<iframe>` para PDFs reais futuramente)
- Controles de zoom (+ / - / reset) via CSS `transform: scale()`
- Navegação de páginas (prev/next) para partituras multi-página
- Botão de download
- Botão de fechar
- Scroll para navegar na partitura com zoom
- Design responsivo, otimizado para mobile

**2. Atualizar `SongCard.tsx`**:
- Tornar o badge "PDF" clicável — abre o visualizador
- Adicionar prop `onViewPdf` callback

**3. Atualizar `mockSongs.ts`**:
- Preencher `pdfUrl` com caminhos para as imagens de partitura existentes (mock)

**4. Atualizar `Acervo.tsx`**:
- Gerenciar estado do viewer (qual música está aberta)
- Renderizar o componente `PdfViewer`

### Arquivos

| Arquivo | Ação |
|---------|------|
| `src/components/acervo/PdfViewer.tsx` | Criar |
| `src/components/acervo/SongCard.tsx` | Editar — PDF clicável |
| `src/data/mockSongs.ts` | Editar — preencher pdfUrl |
| `src/pages/Acervo.tsx` | Editar — estado + render do viewer |

### UX
- Modal ocupa tela inteira com fundo escuro
- Gestos de pinch-to-zoom no mobile (via CSS touch-action)
- Botões grandes e visíveis para o público-alvo (leigo/idoso)
- Transição suave ao abrir/fechar

