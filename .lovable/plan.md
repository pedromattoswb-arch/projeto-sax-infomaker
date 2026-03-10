

## Plano de Melhorias do Acervo — Mobile-First

### Resumo
Reformular completamente a página `/acervo` com foco em usabilidade mobile, adicionar cache local, menu hamburger, melhor distinção entre PDFs e áudios, e permitir PDF aberto enquanto áudio toca.

---

### 1. Cache com sessionStorage no hook `useDriveFiles`
- Armazenar resposta de cada `folderId` em `sessionStorage` com chave `drive_cache_{folderId}`
- Ao navegar para pasta já visitada, carregar do cache instantaneamente (sem loading spinner)
- Ainda fazer fetch em background para atualizar se necessário (stale-while-revalidate)

### 2. Menu Hamburger Mobile
- Criar componente `MobileNav` com menu lateral (Sheet/Drawer) contendo:
  - Logo grande (aumentada ~50%)
  - Links para: Acervo, Bônus (Rotina de Estudo, Mapa de Tonalidades, 100 Músicas), Order Bumps
  - Contador de pastas/arquivos
- Header: logo à esquerda, ícone hamburger à direita no mobile
- Desktop: manter header atual com navegação inline

### 3. Renomear Pastas (no frontend)
- Criar mapeamento de nomes originais do Drive para nomes amigáveis:
  - `BOOKS` → `Livros & Métodos`
  - `CHRISTMAS` → `Natal`
  - `CLASSICAL MUSIC` → `Música Clássica`
  - `COLLECTION` → `Coleção Completa`
  - `FILMES E SÉRIES` → `Filmes & Séries`
  - Outros nomes: capitalizar e formatar automaticamente
- Aplicar mapeamento no hook ou no componente antes de renderizar

### 4. Distinção Clara entre PDF e Áudio
- **PDFs**: Badge vermelha "PARTITURA" com ícone de documento, botão grande "Abrir Partitura" em vermelho
- **Áudios**: Badge dourada/primária "PLAYBACK" com ícone de nota musical, botão circular de play proeminente
- Cards separados visualmente: PDFs com borda esquerda vermelha, Áudios com borda esquerda dourada
- Agrupar arquivos por tipo dentro da pasta: primeiro Partituras, depois Playbacks

### 5. PDF sobre Áudio (overlay sem pausar)
- Mudar o PDF viewer de `fixed inset-0` para um painel que ocupa ~70% da tela
- Quando áudio está tocando e PDF é aberto: ajustar z-index para PDF ficar acima do conteúdo mas o player de áudio permanecer visível e funcional no bottom
- No mobile: PDF viewer ocupa tela inteira MAS o mini-player de áudio fica fixo no bottom (abaixo do PDF ou sobreposto com botão flutuante)

### 6. Melhorias de UX/Design Mobile-First
- **Botões maiores**: touch targets mínimos de 48px
- **Logo maior**: `h-12` no mobile, `h-14` no desktop
- **Tipografia**: títulos maiores, labels mais claros
- **Botão "Baixar"**: texto visível "Baixar" com ícone (não apenas ícone)
- **Botão "Abrir PDF"**: texto "Ver Partitura" sempre visível
- **Botão Play**: circular 48px com label "Ouvir"
- **Loading skeleton**: placeholders animados em vez de spinner central
- **Breadcrumbs**: scroll horizontal suave, chips maiores no mobile
- **Pasta cards**: altura maior, ícone maior, texto maior
- **Player de áudio mobile**: progress bar no topo do player, controles centralizados, nome da música em destaque

### 7. Performance
- Usar `React.memo` nos cards de pasta e arquivo
- Debounce no campo de busca (300ms)
- Lazy loading de componentes pesados (PDF viewer)

---

### Arquivos Modificados
| Arquivo | Ação |
|---|---|
| `src/hooks/useDriveFiles.ts` | Adicionar cache sessionStorage + mapeamento de nomes |
| `src/pages/Acervo.tsx` | Reescrever com mobile-first, distinção PDF/áudio, overlay PDF |
| `src/components/acervo/MobileNav.tsx` | Criar menu hamburger |
| `src/components/acervo/FileCard.tsx` | Componente dedicado para arquivo (PDF ou áudio) |
| `src/components/acervo/FolderCard.tsx` | Componente dedicado para pasta |
| `src/components/acervo/AudioPlayerBar.tsx` | Player de áudio fixo refatorado |

