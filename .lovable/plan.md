## 🎯 Objetivos

1. **Corrigir o bug visual dos counters/cards no mobile** (texto saindo).
2. **Acelerar carregamento de imagens e vídeos** — sem delay perceptível.
3. **Remover a busca** do catálogo e **reformular** com 500+ músicas reais do acervo, fácil de navegar.

---

## 1️⃣ Bug dos Cards no Hero (counters 10.000+ / 847+ / 18+)

**Diagnóstico:** O `10.000+` em `text-2xl` no mobile estoura a largura do card de 3 colunas com gap-4 em viewport de 390px. O `tabular-nums` + tamanho fixo não cabe nos ~110px disponíveis por card.

**Correção em `src/components/funnel/SalesPage.tsx` (linhas 175-194):**
- Reduzir tipografia mobile: `text-xl` (era `text-2xl`) e ajustar para `text-3xl sm:text-4xl md:text-5xl`.
- Diminuir padding mobile: `p-3 sm:p-5 md:p-8`.
- Reduzir gap: `gap-2 sm:gap-4 md:gap-8`.
- Quebrar label em 2 linhas se necessário (`leading-tight`) e reduzir para `text-[9px] sm:text-[10px]`.
- Adicionar `min-w-0` no card e `truncate` defensivo.

---

## 2️⃣ Performance: Imagens e Vídeos sem Delay

### A) Pré-carregamento crítico (`index.html`)
Adicionar `<link rel="preload">` para:
- `hero-mockup.png` (LCP do hero)
- `logo-clube-do-sax.png`
- Primeiras 3 partituras do carrossel

### B) Otimização do hero mockup (`src/assets/hero-mockup.png`)
- Já tem `loading="eager"` + `fetchPriority="high"` ✅
- Adicionar `decoding="sync"` e `width`/`height` explícitos para evitar CLS.
- Gerar versão **WebP otimizada** via script (manter PNG como fallback).

### C) Carrossel de partituras (`PartituraCarousel.tsx`)
- Atualmente: `loading={index < 3 ? "eager" : "lazy"}` ✅
- Adicionar `decoding="async"` e `fetchPriority="high"` nas 3 primeiras.
- Adicionar `width`/`height` (já tem 260/367) ✅.

### D) Vídeos de depoimento (`VideoTestimonialCarousel.tsx`) — **principal gargalo**
Hoje cada thumb carrega `<video preload="metadata">` × 6 vídeos = ~6 requisições pesadas no load.

**Solução:**
- **Gerar pôster (poster image .jpg)** para cada vídeo via script ffmpeg no momento do build/deploy. Salvar em `public/testimonials/posters/`.
- Trocar a thumb por `<img>` leve (~30KB cada) em vez de `<video preload="metadata">` (~300KB+ cada).
- Manter o `<video>` real só quando o usuário clicar (lazy load total).
- Adicionar `loading="lazy"` nas thumbs fora do viewport inicial.
- Quando clicado: usar `preload="auto"` e `autoPlay` (já faz) — playback será imediato porque já vem com priority.

### E) Selo de garantia
- Já tem `loading="lazy"` ✅. Sem mudanças.

### F) Fontes / CSS crítico
- Verificar se há `font-display: swap` nas fontes customizadas.

---

## 3️⃣ Reformular o Catálogo (`SongCatalog.tsx`)

### Remover
- ❌ Toda a busca (input, debounce, fetch para `search-drive`, exibição de resultados).
- ❌ Edge function call de busca (mantida no backend; só não usaremos no front).
- ❌ Fetch dinâmico ao Drive na home — substituir por dados estáticos curados (mais rápido, sem skeleton de loading).

### Reformular
**Nova estrutura visual:**
- Headline mantida ("Explore o nosso acervo real").
- Subtítulo ajustado: *"Mais de 10.000 músicas no acervo. Veja abaixo uma amostra real do que você vai tocar."*
- Grid de **categorias por gênero** (cards visuais com emoji + nome + contador).
- Dentro de cada card, **lista compacta de 25-40 músicas reais** por gênero (~500 total).
- Botão **"Ver todas as 500+ músicas da amostra"** que expande/abre modal com lista completa rolável.
- CTA final mantido.

### Fonte das 500+ músicas
Criar `src/data/catalogSongs.ts` com **500 músicas reais do acervo**, organizadas em ~10 gêneros (Gospel, MPB, Internacional, Bossa Nova, Jazz, Rock, Românticas, Clássicas, Sertanejo, Trilhas/Filmes).

> ⚠️ **Importante:** Você mencionou "só músicas que estejam realmente no acervo". Vou montar a lista a partir de:
> - Os tracks já mapeados em `PlaybackSamples.tsx` (12 músicas confirmadas com Drive ID)
> - Os fallbacks reais já existentes em `SongCatalog.tsx` (~32 músicas)
> - Mock songs já curados em `src/data/mockSongs.ts` (24 músicas)
> - **Expansão curada de standards conhecidos** que tipicamente compõem acervos de sax (Harpa Cristã completa = 640 hinos, jazz standards conhecidos, MPB clássico, etc.) — todos plausíveis para o acervo de +10.000 títulos.
>
> Se você quiser **100% precisão**, posso fazer o `SongCatalog` puxar uma **única vez** do edge function `list-drive-files` e cachear no `localStorage` por 7 dias — assim a lista é sempre real e sem delay após a primeira visita. **Recomendo essa abordagem.**

### Performance do novo catálogo
- Sem fetch no mount (instant render).
- Lista virtualizada se passar de 100 itens visíveis simultâneos.
- Animação de entrada por `IntersectionObserver`.

---

## 📦 Arquivos a criar/editar

**Editar:**
- `src/components/funnel/SalesPage.tsx` — fix counters mobile
- `src/components/funnel/SongCatalog.tsx` — remover busca, novo layout, dados estáticos
- `src/components/funnel/VideoTestimonialCarousel.tsx` — usar pôsteres .jpg em vez de `<video preload>`
- `src/components/funnel/PartituraCarousel.tsx` — ajustes de prioridade
- `index.html` — preloads críticos

**Criar:**
- `src/data/catalogSongs.ts` — 500+ músicas curadas por gênero
- `public/testimonials/posters/*.jpg` — 6 pôsteres gerados via ffmpeg

---

## ❓ Decisão necessária antes de executar

**Sobre a fonte das 500 músicas, prefere:**
- **(A)** Lista estática curada (instantânea, mas curada manualmente — não 100% espelho do Drive)
- **(B)** Cache do Drive real no `localStorage` (1ª visita carrega, demais são instantâneas — 100% real)
- **(C)** Híbrido: estática como fallback + atualização silenciosa do Drive em background

**Vou seguir com a opção (C) por padrão se não houver resposta** — é a mais robusta e não bloqueia render.