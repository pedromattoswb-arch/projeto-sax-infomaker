

## Plano: Otimização de Performance da Página

### Problemas identificados

1. **VideoTestimonialCarousel** — carrega TODOS os 6 vídeos no mount para gerar thumbnails via canvas (`generatePoster`). Isso é o maior gargalo: 6 vídeos baixados simultaneamente só para capturar um frame.

2. **TestimonialCarousel** — 10 imagens PNG com `loading="eager"` e `fetchPriority="high"`. Essa seção fica bem abaixo do fold, não precisa carregar imediatamente.

3. **PlaybackSamples** — 15 elementos `<audio>` com `preload="metadata"` renderizados todos de uma vez. São 15 requests de rede simultâneos.

4. **PartituraCarousel** — imagens importadas via Vite (bundled), mas com `loading="lazy"` mesmo estando perto do topo. Deveria ser `loading="eager"` para as primeiras.

5. **Falta de preload** — a imagem hero e o logo não têm `<link rel="preload">` no HTML.

### Implementação

**1. `index.html` — Preload de assets críticos**
- Adicionar `<link rel="preload">` para o logo e o mockup hero (WebP)
- Adicionar `<link rel="preload">` para as fontes se houver

**2. `VideoTestimonialCarousel.tsx` — Eliminar geração de poster**
- Remover a função `generatePoster` e todo o `useEffect` que carrega 6 vídeos
- Usar apenas o placeholder com gradiente + iniciais (já existe como fallback)
- O vídeo só carrega quando o usuário clica em "Assistir"
- Resultado: elimina 6 downloads de vídeo no carregamento

**3. `TestimonialCarousel.tsx` — Lazy load das imagens**
- Mudar de `loading="eager"` para `loading="lazy"` em todas as imagens
- Remover `fetchPriority="high"` — essa seção está longe do topo

**4. `PlaybackSamples.tsx` — Lazy audio loading**
- Mudar `preload="metadata"` para `preload="none"` em todos os `<audio>`
- O metadata só será carregado quando o usuário clicar play (ou podemos carregar sob demanda)
- Ajustar `handlePlay` para lidar com o caso onde a duração ainda não foi carregada

**5. `PartituraCarousel.tsx` — Eager load das primeiras imagens**
- As primeiras 3 imagens com `loading="eager"`, restante `loading="lazy"`
- Adicionar `width` e `height` para evitar layout shift

**6. `SalesPage.tsx` — Lazy load do selo de garantia**
- Já está com `loading="lazy"`, manter. Verificar se o logo do footer também está lazy.

### Arquivos alterados
- `index.html` — preload de assets críticos
- `src/components/funnel/VideoTestimonialCarousel.tsx` — remover geração de poster
- `src/components/funnel/TestimonialCarousel.tsx` — lazy load imagens
- `src/components/funnel/PlaybackSamples.tsx` — preload="none" nos áudios
- `src/components/funnel/PartituraCarousel.tsx` — eager nas primeiras imagens

### Impacto esperado
- Elimina ~6 downloads de vídeo no carregamento inicial
- Elimina ~15 requests de metadados de áudio
- Adia ~8 imagens de depoimentos para quando forem visíveis
- Hero e logo aparecem mais rápido com preload
- Zero mudanças visuais ou de layout

