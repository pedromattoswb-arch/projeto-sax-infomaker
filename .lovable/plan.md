

## Plano: Filtros Visíveis + Textos Completos + Zero Scroll Lateral

### Problema
1. Playbacks ficam abaixo das Partituras — usuário pode não rolar e achar que não tem playback
2. Textos truncados (`truncate`) escondem nomes de pastas/arquivos
3. Breadcrumbs têm `overflow-x-auto` causando scroll lateral
4. Não há filtro visual ativo para alternar entre Partituras e Playbacks

### Solução

#### 1. Tabs/Filtro fixo de tipo (Partituras | Playbacks | Todos)
- Adicionar barra de filtro sticky abaixo do search com 3 botões: **Todos**, **Partituras**, **Playbacks**
- Cada botão com badge de contagem e cor correspondente (vermelho para Partituras, dourado para Playbacks)
- Quando "Partituras" está ativo, mostrar só PDFs. Quando "Playbacks", só áudios. "Todos" mostra ambos
- Visível SEMPRE que a pasta tem arquivos (não apenas pastas)
- Botões grandes, touch-friendly (48px altura), com ícone + texto + contador

#### 2. Eliminar truncamento de texto
- **FolderCard**: remover `truncate` do nome da pasta — usar `break-words` para quebrar linha
- **FileCard**: remover `truncate` do nome do arquivo — usar `break-words` 
- **AudioPlayerBar**: remover `truncate` do nome da música — usar `line-clamp-2`
- **Breadcrumbs**: remover `overflow-x-auto` — fazer wrap (flex-wrap) em vez de scroll lateral
- **PDF viewer header**: remover `truncate` — usar `line-clamp-2`

#### 3. Breadcrumbs sem scroll lateral
- Trocar `overflow-x-auto scrollbar-none` por `flex-wrap` nos breadcrumbs
- Cada chip quebra para próxima linha se não couber

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/pages/Acervo.tsx` | Adicionar estado de filtro, barra de tabs sticky, remover overflow-x dos breadcrumbs |
| `src/components/acervo/FolderCard.tsx` | Remover `truncate`, usar `break-words` |
| `src/components/acervo/FileCard.tsx` | Remover `truncate`, usar `break-words`, "Baixar" sempre visível |
| `src/components/acervo/AudioPlayerBar.tsx` | Remover `truncate`, usar `line-clamp-2` |

