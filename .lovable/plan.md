

## Plan: Optimize Sales Page for Higher Conversions

### Current Issues
1. **SongCatalog has a search bar** that adds friction and complexity — removing it
2. **Page is too long** with sections that dilute urgency — need to trim and sharpen
3. **Copy is informational, not persuasive** — needs to create urgency and eliminate objections inline
4. **Catalog section is heavy** — simplify to a compact visual showcase (no search, no expand, just show category counts + a few highlight songs)

### Changes

#### 1. `SongCatalog.tsx` — Simplify radically
- Remove search bar entirely
- Remove expandable accordion per category
- Replace with a compact grid showing each category with song count + 3-4 highlight song names
- Keep it visual and scannable — proves the catalog is real without slowing the scroll
- Shorter section overall

#### 2. `SalesPage.tsx` — Sharpen copy throughout
- **Hero headline**: More direct, emotional pain point → "Mais de 2.000 Partituras Profissionais Para Sax — Prontas Para Você Tocar Agora"
- **Hero subtitle**: Emphasize transformation, not features
- **Bullet points**: Rewrite to be benefit-driven with specifics
- **"O que você recebe" section**: Tighten copy — "Seu Arsenal Completo de Partituras" 
- Remove redundant categories section (already shown in catalog)
- **CTA final section**: Sharper urgency copy
- Keep page structure: Hero → Features → Social Proof → Catalog (compact) → Pricing → Bonus → Guarantee → FAQ → Final CTA

#### 3. `PricingCards.tsx` — Improve clarity and persuasion
- Add "Acesso Imediato" badge to both cards
- Sharpen the comparison nudge text
- Make the value proposition crystal clear for each tier

#### 4. `FAQ.tsx` — Minor copy tightening
- Make answers more concise and confident

### Result
- Shorter page with zero friction points
- Every section sells, nothing just informs
- Search removed from catalog — no interactivity that stalls the funnel
- Copy rewritten for conversion, not education

