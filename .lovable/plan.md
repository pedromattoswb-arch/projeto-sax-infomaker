
# Plano de Otimização de Performance do Acervo

## Diagnóstico

O principal gargalo está na **busca (search-drive)**: cada busca faz chamadas recursivas à API do Google Drive, varrendo ~303 pastas em 3 níveis. Isso é lento e consome muitas requisições. O segundo problema é que o **list-drive-files** também bate no Google Drive a cada request, sem cache no servidor.

---

## Fase 1 — Cache no servidor (Edge Functions)

### 1.1 Adicionar cache em memória no `list-drive-files`
- Cache em memória (Map) com TTL de 10 minutos por folderId
- Resultado: pastas já visitadas carregam instantaneamente no servidor

### 1.2 Reescrever `search-drive` com índice em cache
- Na primeira busca (ou cold start), construir um índice completo de todas as pastas e arquivos (3 níveis) e mantê-lo em memória com TTL de 15 minutos
- Buscas subsequentes fazem apenas filter no índice em memória — resposta em <50ms
- Adicionar header `Cache-Control` para que o browser também cache resultados de busca por 60 segundos

---

## Fase 2 — Otimizações no Frontend

### 2.1 Cache mais inteligente no `useDriveFiles`
- Aumentar TTL do sessionStorage de 5min para 10min (alinhado com servidor)
- Mostrar dados do cache imediatamente (já faz stale-while-revalidate, manter)

### 2.2 Debounce da busca global
- Aumentar debounce de 400ms para 500ms para reduzir requests durante digitação rápida

### 2.3 Virtualização de listas longas
- Quando uma pasta tem muitos arquivos (>50), renderizar apenas os visíveis usando windowing simples (limitar a 50 itens iniciais com botão "Mostrar mais")
- Evita renderizar centenas de FileCards de uma vez

### 2.4 Prefetch da pasta raiz
- Fazer prefetch da pasta raiz no `useEffect` do componente antes do usuário interagir
- Adicionar `loading="lazy"` ao iframe do PDF viewer

### 2.5 Otimizar re-renders
- Memoizar callbacks do GlobalSearchPanel que criam novas funções a cada render (onFolderOpen, onFileOpen inline)

---

## Fase 3 — UX de carregamento

### 3.1 Skeleton loading mais granular
- Mostrar skeletons com layout mais fiel (ícone + texto) em vez de barras genéricas

### 3.2 Transições de estado
- Ao navegar entre pastas, manter o conteúdo anterior visível com opacity reduzida enquanto carrega (evitar flash branco)

---

## Detalhes Técnicos

**Arquivos modificados:**
- `supabase/functions/list-drive-files/index.ts` — cache em memória
- `supabase/functions/search-drive/index.ts` — índice em memória + cache
- `src/hooks/useDriveFiles.ts` — TTL do cache, prefetch
- `src/pages/Acervo.tsx` — virtualização, memoização, skeletons
- `src/components/acervo/GlobalSearchPanel.tsx` — debounce ajustado

**Nenhuma tabela de banco de dados necessária.** As otimizações são todas em cache (memória nas Edge Functions + sessionStorage no client).
