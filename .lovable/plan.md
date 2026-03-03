

## Reestruturacao Metodo NANO - Pagina de Vendas (Plano Atualizado)

Atualizacao do plano com as correcoes: ambas as ofertas tem acesso vitalicio, todas as categorias, suporte por email, e ancoragem de preco em ambos os cards.

---

## 1. As Duas Ofertas Detalhadas

### Oferta Essencial - R$ 9,90
Link: `https://pay.cakto.com.br/tdt6ypb_738069`

**Ancoragem de preco:** ~~De R$ 197,00~~ por apenas **R$ 9,90**

**O que inclui:**
- 1.600 partituras em PDF
- Todas as categorias (Pop, Flashback, MPB, Rock, Gospel, Jazz, Blues, Samba)
- Sax Alto e Tenor
- Acesso vitalicio
- Suporte por e-mail

**Visual:** Card branco, borda suave, CTA verde outline. Tag "Otimo para comecar".

---

### Oferta Premium - R$ 19,90
Link: `https://pay.cakto.com.br/3djucaz`

**Ancoragem de preco:** ~~De R$ 497,00~~ por apenas **R$ 19,90**

**TUDO do Essencial +:**
- +2.000 partituras (400 a mais)
- Playbacks profissionais sincronizados
- Formato interativo exclusivo (partitura + audio juntos na tela)
- Atualizacoes mensais com musicas novas
- Harpa Crista COMPLETA (exclusivo)
- **BONUS 1:** Guia "Rotina de Estudo para Saxofonistas"
- **BONUS 2:** Guia "Mapa de Tonalidades para Sax"
- **BONUS 3:** Guia "100 Musicas que Todo Saxofonista Precisa Saber"

**Visual:** Card com borda dourada, badge "MAIS ESCOLHIDO", shimmer effect, CTA verde gradiente com pulse. Escala 1.02x maior que o Essencial.

---

## 2. Diferenciadores Claros (Por que o Premium vale mais)

O que o Premium tem que o Essencial NAO tem:
- 400 partituras extras
- Playbacks profissionais (audio de verdade, nao MIDI)
- Formato interativo (o grande diferencial)
- Atualizacoes mensais
- Harpa Crista completa
- 3 bonus exclusivos

Gatilho no card: "Por apenas R$ 10 a mais, voce leva playbacks profissionais, formato interativo e 3 bonus exclusivos"

---

## 3. Ancoragem de Preco nos Cards

Ambos os cards terao o preco antigo riscado acima do preco real:

```text
Card Essencial:
  ~~De R$ 197,00~~
  R$ 9,90
  "Economia de 95%"

Card Premium:
  ~~De R$ 497,00~~
  R$ 19,90
  "Economia de 96%"
```

O valor ancorado do Premium e maior, reforçando que o conteudo extra (playbacks, interativo, bonus) vale muito mais.

---

## 4. Estrutura da Pagina (mantida do plano anterior)

```text
TOPO: Logo + Headline + "A partir de R$ 9,90"
HERO: Mockup + beneficios rapidos + CTA
O QUE VOCE RECEBE: Grid de features + categorias
PROVA SOCIAL: Carrossel prints + slots video
CARDS DE OFERTA: Essencial (9,90) + Premium (19,90) com ancoragem
BONUS: 3 guias exclusivos Premium
GARANTIA: 7 dias
FAQ: Accordion
CTA FINAL + STICKY MOBILE
```

---

## 5. Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| `src/assets/logo-clube-sax.png` | Copiar logo enviada |
| `src/components/funnel/SalesPage.tsx` | NOVO - Pagina de vendas completa |
| `src/components/funnel/PricingCards.tsx` | NOVO - Cards com ancoragem de preco |
| `src/components/funnel/VideoTestimonials.tsx` | NOVO - Slots para videos |
| `src/components/funnel/FAQ.tsx` | NOVO - Perguntas frequentes |
| `src/components/funnel/BonusSection.tsx` | NOVO - Bonus Premium |
| `src/pages/Index.tsx` | Simplificar para SalesPage |
| `src/index.css` | Paleta clean, fontes Poppins/Montserrat, CTAs verdes |
| `tailwind.config.ts` | Cores, fontes, animacoes |
| `index.html` | Google Fonts, meta tags |
| `src/hooks/useMetaPixel.ts` | Eventos para duas ofertas |

---

## 6. Design e Identidade Visual

- **Fontes:** Poppins (headlines, semibold/bold) + Montserrat (body, medium/semibold)
- **Fundo:** Branco (#FAFAFA) com secoes alternando cinza claro
- **CTA:** Verde escuro gradiente (#1B5E20 -> #2E7D32) com pulse e sombra
- **Precos riscados:** Cinza medio com line-through
- **Precos reais:** Grande, bold, cor de destaque (dourado no Premium, verde no Essencial)
- **Card Premium:** Borda dourada, shimmer, badge "MAIS ESCOLHIDO"

