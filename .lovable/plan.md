## Objetivo

Criar uma segunda landing page de vendas — visualmente reformulada no estilo **"Midnight Gold"** (Playfair Display + Manrope, glassmorphism, dourado metálico sobre obsidiana) baseada no design enviado em `screen.png` / `DESIGN.md` — para rodar teste A/B contra a LP principal (`/`). A nova versão fica em **`/lp-2`** e reaproveita 100% dos vídeos, imagens, copy de oferta, preços, links de checkout e integrações (Pixel, gtag, conversões) já usados na LP atual.

## Estrutura da nova LP (mesma narrativa, novo visual)

Seguindo o screenshot enviado, na ordem:

1. **Header sticky** — logo `logo-clube-do-sax.png`, navegação curta (Início, Acervo, Planos, FAQ) com âncoras, badge "+10.000 Partituras" e CTA dourado "Assinar Agora".
2. **Hero split** — esquerda: eyebrow "Plataforma Número 1 no Brasil", H1 em Playfair "O Maior Acervo de Partituras com Playback do Brasil", parágrafo, CTA gold pill "Quero Meu Acesso Agora", mini prova social com avatares ("+847 saxofonistas ativos"). Direita: `hero-mockup.png` em card escuro com glow dourado.
3. **Excelência Visual e Musical** — grid 4 colunas com cards glass mostrando previews de partituras (reaproveita `PartituraCarousel` redesenhado como grid estático ou o componente atual com tema escuro).
4. **Pratique em qualquer lugar, a qualquer hora** — split: esquerda mockup do app (`AppSimulation` ou imagem do app), direita lista com ícones gold + título Playfair (Acesso Offline, Players Inteligentes, Multi-disponível).
5. **A Comunidade do Sax** — depoimentos: 2 vídeos + 1 print de review + 1 print de WhatsApp + 2 fotos de alunos. Reaproveita os assets do `VideoTestimonialCarousel` e `TestimonialCarousel`.
6. **Invista no seu talento** — bloco de pricing com `PricingCards` re-skinned no tema Midnight Gold (Plano Básico R$ 9,90 e Plano Completo R$ 19,90 destacado com "Recomendado" em dourado). Mantém links de checkout atuais.
7. **Risco Zero para Você** — card glass central com escudo dourado e a garantia (sem usar a palavra proibida; manter "100% satisfação do dinheiro de volta" como já é usado).
8. **Dúvidas Frequentes** — `FAQ` reaproveitado com estilo dark/gold.
9. **Footer** — logo, links Termos / Privacidade, CNPJ 51.919.716/0001-28, newsletter (visual apenas, igual ao screenshot).

## Reaproveitamento

- **Assets**: `logo-clube-do-sax.png`, `hero-mockup.png`, todas as imagens de partituras, prints de WhatsApp, fotos/vídeos de depoimentos, VSL do YouTube — exatamente os mesmos da LP principal.
- **Componentes**: `VideoTestimonialCarousel`, `TestimonialCarousel`, `PartituraCarousel`, `AppSimulation`, `FAQ`, `PricingCards`, `WhatsAppButton` — importados e estilizados via props/wrapper para o tema Midnight Gold (sem alterar a LP `/`).
- **Tracking**: `useMetaPixel`, gtag global já em `index.html`, e os mesmos links de checkout Cakto/Wiapy.
- **Legal/SEO**: Termos, Privacidade e CNPJ no footer; rota indexável (allow no `robots.txt`).

## Implementação técnica

```text
src/
├── pages/
│   └── Lp2.tsx                 ← rota /lp-2, monta SalesPageV2
└── components/
    └── funnel/v2/
        ├── SalesPageV2.tsx     ← orquestra a nova LP
        ├── HeaderV2.tsx
        ├── HeroV2.tsx          ← split com mockup
        ├── VisualGridV2.tsx    ← "Excelência Visual e Musical"
        ├── PracticeAnywhereV2.tsx
        ├── CommunityV2.tsx     ← reusa carousels existentes
        ├── PricingV2.tsx       ← wrapper estiloso do PricingCards
        ├── GuaranteeV2.tsx
        └── FooterV2.tsx
```

- **Tema Midnight Gold escopado** ao container raiz da `/lp-2` via classe `theme-midnight-gold` em `Lp2.tsx`, com tokens CSS (`--mg-bg`, `--mg-surface`, `--mg-gold`, `--mg-gold-grad`) definidos em `src/index.css` dentro de um seletor `.theme-midnight-gold { ... }`. Isso evita qualquer impacto na LP principal `/` ou demais rotas.
- **Fontes**: importar Playfair Display (700) e Manrope (400/600/700) em `index.html` via Google Fonts; aplicar via classes `font-display` e `font-body` registradas no `tailwind.config.ts` apenas escopadas ao tema (`.theme-midnight-gold .font-display { font-family: 'Playfair Display'... }`). Não troca as fontes globais.
- **Glassmorphism**: classes utilitárias `mg-glass`, `mg-gold-btn`, `mg-divider-gold` adicionadas em `index.css` (backdrop-blur, borda gradiente branca, sombra escura difusa, glow dourado).
- **Rota**: adicionar `<Route path="/lp-2" element={<Lp2 />} />` em `src/App.tsx` antes do catch-all.
- **SEO**: title/meta próprios via `<Helmet>`-like approach (ou diretamente via `useEffect` setando `document.title` como já é feito em outras páginas). H1 único, alt em todas as imagens, viewport responsivo já garantido.
- **Indexação**: rota pública e indexável (não adicionar em `robots.txt` Disallow nem em `_headers` noindex).
- **Tracking**: `useMetaPixel()` no topo do `Lp2.tsx`; gtag já é global. CTAs apontam para o mesmo fluxo de checkout (mesmos URLs Cakto) — nada muda no backend.

## Não-objetivos

- Não alterar a LP `/` atual, nem `SalesPage.tsx`, nem temas globais (apenas adicionar tokens escopados).
- Não criar novas rotas de checkout, thank-you ou backend — tudo aponta para o fluxo existente.
- Não mudar preços, copy de oferta, garantia, ou políticas — só layout/visual e microcopy de headings para casar com o screenshot.

## Entrega

Após aprovação, implemento todos os arquivos acima em paralelo e valido visualmente em `/lp-2` no preview (desktop + mobile).