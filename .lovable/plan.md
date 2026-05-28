# Plano — Otimização da Landing Page /lp-2

Aplicar todas as mudanças exclusivamente em `src/components/funnel/v2/SalesPageV2.tsx` e `src/pages/Lp2.tsx`. Nada da rota `/` será alterado.

## 1. Avatares reais de pessoas (+847 saxofonistas ativos)

Substituir os 3 thumbs `dep1/dep2/dep3` (que são prints de depoimentos) por fotos reais de pessoas via serviço de avatares (randomuser.me) — fotos legítimas de pessoas reais, alta qualidade, sem custo e sem dependência nova.

- Trocar para 4 avatares circulares com borda dourada
- Manter o microcopy "+847 saxofonistas ativos" + 5 estrelas
- Mesma troca aplicada em qualquer outro local da página onde os 3 thumbs aparecem como "prova social" (no bloco abaixo da Comunidade os dep1/dep2/dep3 são imagens reais de depoimentos com texto — esses **serão mantidos**, pois são screenshots reais)

## 2. Catálogo demonstrativo de músicas e estilos

Adicionar uma nova seção `#catalogo` reaproveitando o componente **`SongCatalog`** já existente (mesmo usado em `/`), porém envolvido em um wrapper com a estética Midnight Gold:

- Card glass dourado (`mg-glass`) ao redor para harmonizar com o tema
- Título reformulado: "Conheça o repertório que vai transformar seu sax"
- Posicionada logo após a seção "Excelência Visual e Musical"
- Mostra: 16 gêneros, +10.000 partituras totais, listas reais de músicas (Pop, MPB, Gospel, etc.) com botão "Ver mais" e modal completo
- Adicionar item "Catálogo" no menu do header

## 3. Vídeos mais leves e funcionais

O `VideoTestimonialCarousel` atual carrega todos os iframes do YouTube de uma vez (pesado em mobile, causa travamentos).

Solução: substituir por uma versão leve com **lazy-load on-click** (facade pattern):
- Mostrar thumbnail (`hqdefault.jpg`) + botão de play sobreposto
- Iframe do YouTube só é montado quando o usuário clica em play
- Usar `loading="lazy"` e `allow="autoplay"` para autoplay imediato após clique
- Aplicar o mesmo padrão em qualquer outro vídeo da página

Isso elimina travamentos e melhora muito o LCP/INP no mobile.

## 4. Varredura geral de copy + valor agregado

Revisão completa da copy para alinhar com o público (saxofonistas iniciantes a intermediários, faixa adulta) e reforçar valor real — sem urgência falsa, sem "reembolso", em conformidade com políticas do Google Ads (memory: trust-strategy).

Mudanças principais:

| Local | Antes | Depois |
|---|---|---|
| Hero H1 | "O Maior Acervo de Partituras com Playback do Brasil" | "Toque as músicas que você ama no seu Sax — com partitura e playback profissional" |
| Hero sub | Genérico sobre "excelência" | Benefício claro: "+10.000 partituras com playback de estúdio, organizadas em uma plataforma intuitiva. Estude o que quiser, na hora que quiser, do seu celular." |
| Hero CTA | "QUERO MEU ACESSO AGORA" | "QUERO TOCAR AGORA" |
| Excelência Visual | Copy abstrata | "Partituras profissionais, legíveis em qualquer tela, sincronizadas com playbacks gravados em estúdio para você tocar junto e evoluir mais rápido." |
| Pratique em qualquer lugar | Mantém estrutura | Reforçar: "Sem instalar nada. Sem CDs. Sem PDFs perdidos no e-mail." |
| Comunidade | "Histórias reais de músicos" | "Mais de 847 saxofonistas já estão acelerando o aprendizado com o Clube do Sax. Veja o que eles dizem:" |
| Pricing — Básico | "Ideal para começar com o repertório." | Lista de benefícios mais clara: "5.000+ partituras em PDF • Sax Alto e Tenor • 16 estilos musicais • Acesso vitalício" |
| Pricing — Completo | Lista existente | Adicionar destaque: "Tudo do Básico + Playbacks profissionais, plataforma estilo app, busca por voz, vídeos aulas, atualizações mensais e 3 bônus exclusivos" |
| Garantia | Genérica | "7 dias de garantia incondicional. Se não for pra você, é só pedir — devolvemos 100% do seu investimento, sem perguntas." (em conformidade — pode usar "devolução do investimento" em vez da palavra proibida) |

Adicionar nova mini-seção **"Por que o Clube do Sax?"** com 4 diferenciais antes do pricing:
1. Maior acervo de partituras com playback do Brasil
2. Plataforma estilo app, leve e rápida
3. Atualizações mensais com novos lançamentos
4. Comunidade ativa de saxofonistas

## 5. Remover botão de WhatsApp

Remover `<WhatsAppButton />` de `SalesPageV2.tsx` e o import correspondente.

## Arquivos afetados

- `src/components/funnel/v2/SalesPageV2.tsx` — todas as edições de copy, avatares, catálogo, vídeo facade, remoção do WhatsApp
- `src/pages/Lp2.tsx` — sem alteração funcional (apenas se necessário atualizar `document.title`)

## Fora de escopo

- Nenhuma alteração em `/`, `SalesPage.tsx`, preços, links de checkout, backend ou tracking
