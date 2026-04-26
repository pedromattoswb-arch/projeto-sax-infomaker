# Plano de Execução — Clube do Sax

## 🎯 Objetivos
1. **Rebrand completo** de "SaxPlay" para **"Clube do Sax"** em toda a aplicação
2. **Substituir a logo** atual pela nova logo dourada anexada
3. **Harmonizar o background** — aplicar o efeito `HeroGeometric` em todas as seções com transições suaves
4. **Gerar 8 prompts para Instagram** com legendas, alinhados à identidade visual da nova logo

---

## 📋 Parte 1 — Rebrand: SaxPlay → Clube do Sax

### 1.1 Nova logo
- Copiar `user-uploads://LOGO_-_CLUBE_DO_SAX_1-4.png` para `src/assets/logo-clube-do-sax.png`
- A nova logo é **dourada com saxofone** sobre fundo escuro — combina perfeitamente com o tema dark/elegante do site

### 1.2 Arquivos a atualizar (substituir todas as referências textuais)
**Componentes principais:**
- `src/components/funnel/SalesPage.tsx` — header, alts, footer
- `src/components/funnel/AppSimulation.tsx` — nome no mockup do app
- `src/components/funnel/BonusSection.tsx`
- `src/components/funnel/FAQ.tsx`
- `src/components/funnel/SalesVideoPlayer.tsx`
- `src/components/funnel/WhatsAppButton.tsx` — mensagem pré-definida
- `src/components/acervo/MobileNav.tsx`

**Páginas:**
- `src/pages/Acervo.tsx`
- `src/pages/BonusMusicas.tsx`, `BonusRotina.tsx`, `BonusTonalidades.tsx`
- `src/pages/OrderBumpDigitacao.tsx`, `OrderBumpManutencao.tsx`, `OrderBumpTransposicao.tsx`
- `src/pages/ThankYouBasico.tsx`, `ThankYouCompleto.tsx`

**Hooks/Libs/Meta:**
- `src/hooks/useMetaPixel.ts`
- `src/lib/pdfGenerators.ts` — branding nos PDFs
- `index.html` — `<title>`, meta description, OG tags

### 1.3 Substituições de import de logo
Trocar todos os `import logoSaxplay from "@/assets/logo-saxplay-dark.webp"` por:
```ts
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
```
E atualizar todas as tags `<img>` correspondentes (alt incluso).

---

## 🎨 Parte 2 — Harmonização do Background

### 2.1 Diagnóstico atual
- O `HeroGeometric` envolve toda a `SalesPage`, mas várias **seções internas** ainda têm fundos opacos que **quebram** o efeito:
  - `bg-black/40`, `bg-black/60`, `bg-section-dark` em SalesPage
  - `section-alt` em SongCatalog, FAQ
  - Cores próprias em PricingCards, BonusSection, AppSimulation

### 2.2 Estratégia de unificação
- **Tornar todas as seções `bg-transparent`** para deixar o efeito geométrico de fundo aparecer continuamente
- Adicionar **gradientes radiais sutis** locais (apenas para profundidade) em cada seção
- Implementar **transições suaves entre seções** com:
  - Pseudo-elementos com `gradient overlays` nas bordas superior/inferior de cada seção
  - Padrão consistente: `bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent`
- Padronizar **padding vertical** entre seções (`py-24 md:py-32`) para ritmo visual consistente

### 2.3 Arquivos a ajustar
- `src/components/funnel/SalesPage.tsx` — remover `bg-black/40`, `bg-black/60`, `bg-section-dark`
- `src/components/funnel/PricingCards.tsx` — manter transparente
- `src/components/funnel/SongCatalog.tsx` — remover `section-alt`
- `src/components/funnel/FAQ.tsx` — remover `section-alt`
- `src/components/funnel/AppSimulation.tsx` — manter `bg-transparent`
- `src/components/funnel/BonusSection.tsx` — verificar e ajustar
- `src/index.css` — adicionar utilitário `.section-blend` para transição suave entre seções

---

## 📸 Parte 3 — Prompts para Instagram (Nano Banana)

Gerarei **8 prompts** prontos para copiar e colar no Nano Banana, mantendo:
- **Paleta**: dourado luxuoso + preto profundo + brilhos brancos (idêntica à logo)
- **Estilo**: 3D renderizado, premium, cinematográfico, alta qualidade
- **Identidade**: saxofone como elemento central, notas musicais douradas, partituras
- **Formato**: 1:1 (1080x1080) para feed do Instagram

Cada prompt virá acompanhado de:
- Prompt em **inglês detalhado** (para máxima qualidade no nano banana)
- **Legenda em português** pronta para postar (com hashtags estratégicas)

**Temas dos 8 posts:**
1. Lançamento / Boas-vindas ao Clube
2. +10.000 partituras (autoridade)
3. Playback profissional (diferencial)
4. Acesso pelo celular (estilo app)
5. Depoimento de aluno (prova social)
6. Para Sax Alto e Sax Tenor (segmentação)
7. Acesso vitalício (oferta)
8. Call-to-action final (conversão)

---

## ✅ Resultado Esperado
- 🎷 Identidade visual 100% coesa com **"Clube do Sax"**
- 🌌 Background unificado com efeito geométrico fluindo por toda a página
- 📱 8 prompts prontos para gerar criativos profissionais para o Instagram
- 🚀 Pronto para escalar campanhas com identidade consistente