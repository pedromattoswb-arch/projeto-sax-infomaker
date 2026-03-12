

## Plano: Nomes de Pastas + Layout Mobile + Aba de Tutoriais

### 1. Melhorar mapeamento de nomes de pastas

Expandir `FOLDER_NAME_MAP` em `useDriveFiles.ts` com nomes completos e descritivos (sem abreviações):

| Drive Original | Nome Exibido |
|---|---|
| BOOKS | Livros e Métodos de Estudo |
| CHRISTMAS | Músicas de Natal |
| CLASSICAL MUSIC | Música Clássica |
| COLLECTION | Coleção Completa |
| FILMES E SÉRIES | Trilhas de Filmes e Séries |
| GOSPEL | Músicas Gospel |
| JAZZ | Jazz |
| POP | Pop Internacional |
| MPB | Música Popular Brasileira |
| SERTANEJO | Sertanejo |
| FORRÓ | Forró |
| BOSSA NOVA | Bossa Nova |
| ROCK | Rock |
| BLUES | Blues |
| REGGAE | Reggae |
| SAMBA | Samba |
| INTERNATIONAL | Músicas Internacionais |
| BRASILEIRAS | Músicas Brasileiras |
| ROMANTIC | Músicas Românticas |

**Arquivo:** `src/hooks/useDriveFiles.ts`

---

### 2. Layout mobile do FileCard — eliminar texto espremido

O problema: no mobile, nome da música + botões de ação ficam na mesma linha (`flex items-center`), espremendo o texto quando o nome é longo.

**Solução em `FileCard.tsx`:**
- No mobile, mudar para layout vertical: nome/badge em cima, botões de ação embaixo (full-width)
- Usar `flex-col` no mobile e `flex-row items-center` no desktop
- Botões de ação no mobile viram uma row abaixo do nome, com largura total
- Garantir que o nome da música nunca fique cortado: `break-words` + sem limite de largura

---

### 3. Aba de Vídeos Tutoriais no topo

Adicionar uma seção colapsável/semi-visível logo abaixo do header em `Acervo.tsx`:
- Banner sutil com ícone de vídeo + texto "Vídeos Tutoriais — Aprenda a usar o acervo"
- Ao clicar, expande e mostra cards de vídeos tutoriais (placeholder por agora com links/textos editáveis)
- Usar `Collapsible` do Radix ou simplesmente um `useState` com toggle
- Visual discreto mas visível: bg com opacidade, borda superior colorida

---

### 4. Melhorias gerais de responsividade

- **FolderCard**: nome com `text-sm` no mobile para caber melhor, sem truncamento
- **AudioPlayerBar**: no mobile, layout mais compacto — nome com `line-clamp-1` no player mas visível
- **Breadcrumbs**: font-size menor no mobile (`text-xs`), padding reduzido

---

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/hooks/useDriveFiles.ts` | Expandir FOLDER_NAME_MAP com nomes completos |
| `src/components/acervo/FileCard.tsx` | Layout vertical no mobile (nome + ações em linhas separadas) |
| `src/pages/Acervo.tsx` | Adicionar aba de tutoriais colapsável no topo |
| `src/components/acervo/FolderCard.tsx` | Ajustes de responsividade no texto |

