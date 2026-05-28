# Otimização da `/lp-2` — Seção "Tudo que você recebe" + copy demonstrativa

## Objetivo

Deixar 100% claro, logo no início da página, **tudo** que o lead recebe ao entrar no Clube do Sax Brasil, reforçando que as partituras são para **Sax Alto e Sax Tenor**, e otimizar a copy geral para vender melhor.

## 1. Nova seção: "Tudo que você recebe ao entrar hoje"

Inserida **logo depois** da seção *"Partituras de verdade, com playback de estúdio"* e **antes** dos depoimentos.

Estrutura visual (mesma identidade Midnight Gold — `mg-glass`, `mg-display`, `mg-caps`, dourado `var(--mg-gold)`):

- **Eyebrow:** "Acesso Completo"
- **Headline:** "Tudo que você recebe ao entrar no *Clube do Sax Brasil*"
- **Sub:** "Um pacote completo para Sax Alto e Sax Tenor — partituras, playbacks, app e bônus. Tudo organizado, tudo na hora."

**Grid principal — Value Stack (8 cards `mg-glass` em grid 1 col mobile / 2 cols sm / 4 cols lg)**, cada card com ícone dourado, título e descrição curta + um selo dourado de "valor percebido" (sem inventar preço, apenas reforço de valor):

1. **+10.000 partituras** — Sax Alto **e** Sax Tenor, organizadas em 15 estilos.
2. **Playbacks profissionais de estúdio** — Gravados com banda real, em qualidade de estúdio.
3. **Plataforma estilo app** — Funciona no celular, tablet ou PC. Sem instalar nada.
4. **Busca inteligente por voz** — Fala o nome da música e ela aparece em segundos.
5. **Atualizações mensais** — Lançamentos novos toda semana, sem pagar nada a mais.
6. **Harpa Cristã completa** — Hinos clássicos com partitura + playback.
7. **Acesso vitalício** — Pagou uma vez, é seu pra sempre. Sem mensalidade.

**Faixa de reforço Sax Alto + Tenor** abaixo dos cards (`mg-glass` faixa horizontal centralizada com 2 selos dourados lado a lado):

- 🎷 **Sax Alto (Eb)** — Todas as partituras transcritas
- 🎷 **Sax Tenor (Bb)** — Todas as partituras transcritas

**CTA secundário** ao final da seção: botão `mg-gold-btn` "Ver Planos e Garantir Acesso" → scroll para `#planos`.

## 2. Otimização de copy (sem mudar layout)

- **Hero subheadline:** trocar para reforçar Sax Alto **e** Tenor + benefício principal logo de cara.
  - Atual: "Mais de {TOTAL} partituras com playback de estúdio, organizadas em uma plataforma intuitiva..."
  - Novo: "Mais de **10.000 partituras com playback de estúdio para Sax Alto e Sax Tenor**, organizadas em um app que cabe no seu bolso. Estude o que quiser, na hora que quiser."
- **Seção "Partituras de verdade":** ajustar sub para citar Alto + Tenor.
  - Novo: "Diagramação profissional para **Sax Alto (Eb) e Sax Tenor (Bb)**, legível em qualquer tela, sincronizada com playbacks gravados em estúdio."
- **Seção "Pratique em qualquer lugar":** acrescentar Sax Alto/Tenor na intro.
- **Seção "Por que o Clube do Sax":** primeiro card já cita Sax Alto e Tenor — manter, garantir consistência.
- **Planos — Básico:** primeira linha já cita "(Sax Alto e Tenor)" — manter.
- **Planos — Premium:** acrescentar "(para Sax Alto e Tenor)" na primeira linha de partituras.
- **Garantia:** reescrever sem usar a palavra "reembolso" e em tom mais humano e direto (já está compliance — apenas refino curto).
- **Footer descrição:** acrescentar "para Sax Alto e Tenor".

## 3. Arquivos afetados

- `src/components/funnel/v2/SalesPageV2.tsx` — única mudança: inserir a nova seção entre `ACERVO` e `COMUNIDADE`, ajustar 5–6 strings de copy.

Nenhuma mudança em backend, checkout, tracking, rotas, `SongCatalogV2`, `BonusSectionV2`, ou na página `/` principal.

## 4. Detalhes técnicos

- Reutilizar `CATALOG_GENRES.length` e `TOTAL_CATALOG_COUNT` para manter números congruentes.
- Ícones lucide já importados (`BookOpen`, `Music`, `Smartphone`, `Mic`, `Sparkles`, `Crown`, `ShieldCheck`, `Zap`, `MessageCircle`) + adicionar `Headphones` e `Infinity` se precisar.
- Grid mobile-first: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`.
- Sem novas dependências, sem novos assets.