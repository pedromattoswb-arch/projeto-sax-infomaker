

## Melhorias de Design, Visibilidade e Quebra Visual

### Problemas identificados
1. Texto com cor `muted-foreground` (cinza claro) — pouco visivel
2. Depoimentos em print e video sao secoes separadas — unificar
3. Pagina 100% branca/cinza claro — sem quebra de cor
4. Mockup/imagens sem destaque visual suficiente

### Mudancas planejadas

**1. Texto mais escuro e visivel (index.css)**
- Mudar `--foreground` para preto puro (0 0% 5%)
- Mudar `--muted-foreground` de 46% para 35% (mais escuro)
- Descriptions e paragrafos usarao `text-foreground` em vez de `text-muted-foreground` onde faz sentido

**2. Secao dark (quebra de cor) na Prova Social**
- A secao "O Que Dizem os Saxofonistas" tera fundo cinza escuro (`bg-[#1a1a2e]` ou similar) com textos brancos
- Unifica prints + video slots numa unica secao com fundo escuro
- Remove `VideoTestimonials.tsx` como componente separado — integra os slots de video diretamente na secao de prova social dentro de `SalesPage.tsx`

**3. Secao Garantia com fundo escuro verde**
- Fundo `gradient-cta` (verde escuro) com texto branco para criar outra quebra visual

**4. Melhorias visuais gerais**
- Hero mockup com sombra mais forte e borda sutil
- Feature cards com icones maiores
- Category badges com mais contraste
- FAQ section mantém `section-alt` (cinza claro) — ja tem quebra natural

### Arquivos modificados

| Arquivo | Mudanca |
|---------|---------|
| `src/index.css` | Foreground mais escuro, nova classe `section-dark` |
| `src/components/funnel/SalesPage.tsx` | Unificar prova social (prints + videos), secao garantia dark, textos mais visiveis, mockup melhorado |
| `src/components/funnel/VideoTestimonials.tsx` | Deletar (integrado na SalesPage) |
| `src/components/funnel/BonusSection.tsx` | Textos mais escuros |
| `src/components/funnel/FAQ.tsx` | Textos mais escuros |
| `src/components/funnel/PricingCards.tsx` | Textos mais escuros e visiveis |

