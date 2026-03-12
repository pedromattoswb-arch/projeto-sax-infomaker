

## Plano: Busca Global Full-Screen + Acessibilidade + Atualização da Sales Page

Este é um projeto grande com 4 frentes. Vou dividir em fases claras.

---

### Frente 1: Painel de Busca Global Full-Screen

**Novo componente:** `src/components/acervo/GlobalSearchPanel.tsx`

- Ao clicar no campo de busca atual, abre um overlay full-screen (`fixed inset-0 z-50`)
- Input auto-focado no topo com botão de fechar (X)
- Resultados aparecem em tempo real conforme digita (debounce 300ms)
- Resultados agrupados por tipo: **Pastas**, **Partituras**, **Playbacks**
- Cada resultado mostra ícone colorido + nome completo + badge de tipo
- Ao clicar num resultado: navega até a pasta ou abre o arquivo direto
- Botão de "busca por voz" usando Web Speech API (`SpeechRecognition`): ícone de microfone ao lado do input. Ao clicar, ativa reconhecimento de voz e preenche o campo de busca com o que o usuário falar
- Estado vazio: mostra sugestões ("Tente buscar: Careless Whisper, Gospel, Jazz...")
- Sem resultados: mensagem clara com sugestão de limpar filtros
- Acessível: `role="dialog"`, `aria-modal`, trap de foco, ESC para fechar

**Alteração em `Acervo.tsx`:**
- O input de busca atual vira um "trigger" — ao focar/clicar, abre o `GlobalSearchPanel`
- Busca atravessa todas as pastas (precisa de um endpoint ou busca recursiva client-side)

**Novo endpoint ou lógica:** Para busca global, adicionar parâmetro `?search=termo` na edge function `list-drive-files` que busca recursivamente no Drive. Alternativa: buscar apenas na pasta atual (mais simples, menos impacto).

> **Decisão recomendada:** Busca na pasta atual com UI full-screen. Busca global recursiva requer mudança significativa no backend e pode ser lenta — implementar depois se necessário.

---

### Frente 2: Melhorias de Acessibilidade no Acervo

| Melhoria | Detalhe |
|---|---|
| **Labels ARIA** | Adicionar `aria-label` em todos os botões sem texto visível |
| **Roles semânticos** | `role="navigation"` nos breadcrumbs, `role="list"` nas listas de arquivos |
| **Contraste** | Verificar e ajustar badges de contagem (text-[10px] pode ser muito pequeno — subir para 11px) |
| **Focus visible** | Garantir `focus-visible:ring-2` em todos os elementos interativos |
| **Skip navigation** | Botão "Ir para conteúdo" no topo (hidden até focus) |
| **Anúncios** | `aria-live="polite"` na região de resultados para leitores de tela |
| **Font sizes mínimos** | Nenhum texto menor que 11px no mobile |

**Arquivos:** `Acervo.tsx`, `FileCard.tsx`, `FolderCard.tsx`, `AudioPlayerBar.tsx`

---

### Frente 3: Atualização da Sales Page

Atualizar `SalesPage.tsx` e `SongCatalog.tsx` para refletir as novas funcionalidades:

**Features array — atualizar:**
- Trocar "Formato Interativo" por "Busca Inteligente" — "Encontre qualquer música por nome ou por voz"
- Adicionar "Vídeos Tutoriais" — "Aprenda a usar cada recurso do acervo"

**SongCatalog — remover `truncate`** nos nomes de músicas (linha 49)

**Hero — atualizar texto:**
- Mencionar "busca por voz" e "vídeos tutoriais" nos bullet points

**Seção de features — adicionar card:**
- Ícone de microfone + "Busca por Voz" + "Fale o nome da música e encontre na hora"

---

### Frente 4: Listagem Completa do Conteúdo Sax

O projeto contém:
- **Acervo principal** (`/acervo`): +2.000 partituras e playbacks via Google Drive
- **Bonus Rotina** (`/bonus/rotina-de-estudo`): Guia de rotina de estudo para sax
- **Bonus Tonalidades** (`/bonus/mapa-de-tonalidades`): Mapa de tonalidades
- **Bonus 100 Músicas** (`/bonus/100-musicas`): Lista de 100 músicas essenciais
- **Order Bump Digitação** (`/orderbump/digitacao`): Guia de digitação
- **Order Bump Transposição** (`/orderbump/transposicao`): Guia de transposição
- **Order Bump Manutenção** (`/orderbump/manutencao`): Guia de manutenção do sax
- **Playbacks de amostra** na sales page (15 arquivos MP3 em `/public/playbacks/`)
- **Gêneros mapeados**: Pop, MPB, Rock, Gospel, Jazz, Bossa Nova, Sertanejo, Blues, Samba, Reggae, Forró, Música Clássica, Filmes e Séries, Músicas de Natal, Músicas Românticas, Jazz Standards, Saxofonistas Famosos, Músicas para Casamento

---

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/components/acervo/GlobalSearchPanel.tsx` | **NOVO** — Painel full-screen de busca com voz |
| `src/pages/Acervo.tsx` | Integrar GlobalSearchPanel, melhorias ARIA, skip-nav |
| `src/components/acervo/FileCard.tsx` | Melhorias ARIA e contraste |
| `src/components/acervo/FolderCard.tsx` | Melhorias ARIA |
| `src/components/acervo/AudioPlayerBar.tsx` | Melhorias ARIA |
| `src/components/funnel/SalesPage.tsx` | Atualizar features e bullet points |
| `src/components/funnel/SongCatalog.tsx` | Remover truncate, atualizar dados |

