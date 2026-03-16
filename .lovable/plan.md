

## Plano: Catalogo Real do Drive (max 30) + CTAs Verdes + Psicologia das Cores

### Resumo
Tres mudancas principais: (1) puxar musicas reais do Google Drive para o catalogo na pagina de vendas (max 30, as mais populares), (2) trocar todos os botoes CTA para verde, (3) aplicar psicologia das cores para conversao.

---

### 1. SongCatalog.tsx — Musicas reais do Drive (max 30)

**Abordagem**: Chamar a edge function `search-drive` ou `list-drive-files` no carregamento para buscar nomes reais de pastas/arquivos do acervo. Selecionar no maximo 30 itens, priorizando nomes populares e reconheciveis.

**Implementacao**:
- Manter os 16 generos como categorias estaticas (nao mudar isso)
- Para cada genero, buscar 2 nomes reais de musicas via `list-drive-files` (total ~30 musicas)
- Exibir apenas os nomes, sem links ou acoes — e uma vitrine, nao um player
- Reduzir o grid de 16 cards para ~8 generos mais populares (MPB, Gospel, Jazz, Pop, Rock, Flashback, Bossa Nova, Sertanejo)
- Cada card mostra 3-4 musicas reais do Drive
- Adicionar um CTA verde embaixo do catalogo direcionando para a secao de ofertas
- Loading skeleton enquanto carrega

**Fallback**: Se a API falhar, usar os nomes hardcoded atuais (graceful degradation).

---

### 2. Botoes CTA — Todos verdes

**Arquivos afetados**: `src/index.css`, `SalesPage.tsx`, `PricingCards.tsx`

- Alterar `.gradient-cta` de dourado/amber para verde:
  ```css
  .gradient-cta {
    background: linear-gradient(135deg, hsl(142 70% 42%) 0%, hsl(142 65% 32%) 100%);
  }
  ```
- Alterar `.shadow-cta` e `.shadow-cta-lg` para tom verde
- Botao do plano Basico (atualmente cinza/transparente): trocar para verde solido mais sutil
- Sticky CTA mobile: tambem verde
- Manter o botao Premium com mais destaque (verde mais vibrante + borda dourada)

---

### 3. Psicologia das cores — Ajustes gerais

- **Verde nos CTAs**: transmite seguranca, "ir em frente", acao positiva
- **Manter dourado no card Premium**: exclusividade e valor percebido (border, badges, precos)
- **Vermelho sutil no timer de urgencia**: ja esta correto (destructive)
- **Garantia**: manter verde no selo para reforcar confianca
- Nao alterar o esquema de cores geral da pagina (fundo escuro, cards neutros) — apenas os botoes de acao

---

### 4. FAQ.tsx — Nova pergunta sobre indice

- Adicionar: "Posso ver quais musicas estao no acervo antes de comprar?" com resposta mencionando o catalogo na pagina e que o acervo cresce mensalmente

---

### Arquivos editados
1. `src/components/funnel/SongCatalog.tsx` — Fetch real do Drive, max 30, fallback hardcoded
2. `src/index.css` — gradient-cta e shadows para verde
3. `src/components/funnel/PricingCards.tsx` — Botao basico em verde
4. `src/components/funnel/FAQ.tsx` — Nova pergunta

