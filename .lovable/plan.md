Mudanças escopadas apenas em `/lp-2` (`SalesPageV2.tsx` + novo `SongCatalogV2.tsx`). Nada na página principal `/`, no checkout, backend ou tracking muda.

## 1. Catálogo no tema Midnight Gold

Criar `src/components/funnel/v2/SongCatalogV2.tsx` — equivalente ao `SongCatalog`, com identidade da /lp-2:
- `mg-display` em títulos, `mg-caps` na tag superior, corpo em `text-[var(--mg-text-dim)]`.
- Cards de gênero em `mg-glass` com borda dourada `rgba(212,175,55,0.25)`.
- Ícones e destaques em `var(--mg-gold)`; remover `text-primary`/`bg-primary` (verde da página principal).
- CTA final usando `mg-gold-btn`. Modal de catálogo completo em fundo `var(--mg-bg)` com bordas douradas.

Substituir `<SongCatalog />` por `<SongCatalogV2 />` em `SalesPageV2.tsx`.

## 2. Números congruentes

Os números do catálogo derivam de `CATALOG_GENRES` (`TOTAL_CATALOG_COUNT`, `CATALOG_GENRES.length`). Auditar `SalesPageV2.tsx` e padronizar todas as menções — hero, "Por que Clube do Sax", features dos planos, bônus e qualquer texto — para refletir exatamente os mesmos valores ("+10.000 partituras", número correto de estilos). Ajustar `basicFeatures[0]` se o número não bater com a realidade do plano.

## 3. Hero mobile — reordenação e centralização

No mobile (`<lg`): ordem visual passa a ser **headline → mockup → subheadline + prova social + CTA**, tudo centralizado (`text-center`, `items-center`, `mx-auto`). No desktop (`lg:`): mantém split atual (texto à esquerda, mockup à direita, alinhado à esquerda). Implementação via `order-*` + `lg:order-none` e `text-center lg:text-left`.

## 4. Amostras de partituras — 1/linha no mobile

Trocar grid de `grid-cols-2 lg:grid-cols-4` para `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`. Desktop intacto.

## 5. Reordenar seções

Nova ordem:
1. Hero
2. Acervo — amostras de partituras
3. **Comunidade (depoimentos)** ← movido para cá
4. Catálogo demonstrativo (SongCatalogV2)
5. Pratique em qualquer lugar
6. Por que o Clube do Sax
7. **Bônus** ← novo (ver §6)
8. Planos / Pricing (com comparação clara — ver §7)
9. Garantia / FAQ / Footer

Divisores `mg-divider-gold` reposicionados.

## 6. Seção de Bônus (reaproveitando os 3 que já existem)

Adicionar uma seção de bônus na /lp-2 reutilizando exatamente os 3 bônus que já existem em `BonusSection.tsx` (Rotina de Estudo, Mapa de Tonalidades, 100 Músicas) — sem inventar bônus novos. Renderização própria no tema Midnight Gold:
- Cards `mg-glass` com selo dourado "BÔNUS 1/2/3", título em `mg-display`, descrição em `text-[var(--mg-text-dim)]`.
- Tag superior `mg-caps` em ouro: "Exclusivo do Premium".
- Reforço de que os 3 bônus estão disponíveis dentro da plataforma do Clube do Sax (apenas no Premium).

Implementação: bloco JSX direto dentro de `SalesPageV2.tsx` (ou um pequeno componente `BonusSectionV2.tsx` no folder `v2/`) com os mesmos textos do `BonusSection.tsx`, sem alterar o componente original.

## 7. Comparação clara entre planos — incluso vs não-incluso

Reformular o bloco de pricing em `SalesPageV2.tsx` para deixar 100% explícito o que cada plano tem e o que **não** tem, principalmente no Básico:

- Cada card mostra **duas listas**:
  - Itens inclusos com check em `var(--mg-gold)`.
  - Itens **não inclusos** com ícone `X` (lucide `XCircle` ou `X`) em vermelho/cinza apagado (`text-[var(--mg-text-dim)]` com opacidade) e texto riscado/atenuado.

- **Plano Básico — Inclusos**: +5.000 partituras em PDF (Sax Alto e Tenor), gêneros organizados, acesso vitalício, atualizações periódicas no PDF.
- **Plano Básico — Não inclusos (X)**: Playbacks profissionais de estúdio, plataforma estilo app, busca por voz, vídeo-aulas integradas, atualizações mensais, Harpa Cristã completa, 3 bônus exclusivos.
- **Plano Premium — Inclusos**: tudo do Básico + todos os itens acima como check em ouro, mais "selo Premium" no card.

Manter preços, links de checkout e copy de CTA atuais — apenas reorganizar a visualização para evidenciar o contraste.

## 8. Reforço da entrega automática (e-mail + WhatsApp)

Adicionar bloco curto e visível de "Como você recebe seu acesso" — para reforçar confiança e remover dúvida:

- Posicionamento: logo abaixo do CTA principal dentro de cada card de plano (linha pequena com ícones), **e** uma faixa dedicada após a seção de planos, antes da Garantia.
- Conteúdo (sem inventar nada além do que o cliente recebe):
  - Ícone `Mail` — "Link de acesso enviado automaticamente no seu **e-mail**"
  - Ícone `MessageCircle` (ou similar) — "Também recebe o link pelo **WhatsApp**"
  - Ícone `Zap` — "Liberação imediata após a confirmação do pagamento"
- Estilo: cápsula `mg-glass` com ícones em `var(--mg-gold)` e texto em branco/dim, totalmente alinhado ao tema Midnight Gold.

## Arquivos afetados

- `src/components/funnel/v2/SongCatalogV2.tsx` (novo)
- `src/components/funnel/v2/BonusSectionV2.tsx` (novo, opcional — pode ficar inline)
- `src/components/funnel/v2/SalesPageV2.tsx` (reordenação, hero mobile, grid partituras, troca catálogo, bônus, pricing comparativo com X, faixa de entrega)

Sem alterações em `/`, no `SalesPage.tsx`, `BonusSection.tsx`, backend, checkout ou tracking.
