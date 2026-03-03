

## Redesign Completo da Pagina de Vendas

### Resumo das mudancas

Grande reestruturacao da pagina com foco em conversao: videos de depoimentos em carrossel com destaque, selo de garantia real, imagens nos bonus, copy mais agressiva com gatilhos de dor/urgencia, hero centralizado, e design mais vivo em todas as secoes.

---

### 1. Assets a copiar para o projeto

Copiar os 6 videos de depoimentos e o selo de garantia:
- `user-uploads://Depoimento_do_Júlio_Sampaio_-_São_Paulo.mp4` → `src/assets/testimonials/julio-sampaio-sp.mp4`
- `user-uploads://Depoimento_de_Marcelo_Cristian_-_Rio_de_Janeiro.mp4` → `src/assets/testimonials/marcelo-cristian-rj.mp4`
- `user-uploads://Depoimento_de_Marcos_Mattos_-_Brasília.mp4` → `src/assets/testimonials/marcos-mattos-bsb.mp4`
- `user-uploads://Depoimento_de_Júlia_Costa_-_São_Paulo.mp4` → `src/assets/testimonials/julia-costa-sp.mp4`
- `user-uploads://Depoimento_de_Bárbara_Oliveira_-_Florianópolis.mp4` → `src/assets/testimonials/barbara-oliveira-floripa.mp4`
- `user-uploads://Depoimento_de_Gabriela_Santana_-_São_Paulo.mp4` → `src/assets/testimonials/gabriela-santana-sp.mp4`
- `user-uploads://image.png` → `src/assets/selo-garantia.png`

---

### 2. Novo componente: VideoTestimonialCarousel

Criar `src/components/funnel/VideoTestimonialCarousel.tsx`:
- Carrossel Embla com 6 videos, cada um com `<video>` nativo, controls, poster frame
- Cada slide mostra nome e cidade da pessoa (ex: "Julio Sampaio - Sao Paulo")
- Layout responsivo: 1 video mobile, 2-3 desktop
- Estilo escuro (integrado na secao dark da prova social)

---

### 3. Reestruturar SalesPage.tsx

**Hero centralizado:**
- Mockup no topo, centralizado
- Headline abaixo, centralizada
- Bullet points centralizados
- CTA centralizado
- Copy mais agressiva: focar na DOR ("Cansado de perder horas procurando partituras ruins na internet?", "Enquanto voce busca, outros saxofonistas ja estao tocando")

**Secao "O Que Voce Recebe":**
- Redesign dos cards com icones maiores (w-14 h-14), gradientes nos backgrounds dos icones, bordas coloridas hover
- Categorias com emojis e cores de fundo individuais por genero

**Prova Social (secao dark):**
- Videos em carrossel PRIMEIRO (destaque principal)
- Prints em carrossel ABAIXO (complemento menor)
- Inverter a hierarquia visual

**Garantia:**
- Remover icone ShieldCheck
- Usar imagem `selo-garantia.png` no lugar

**CTA Final:**
- Copy mais urgente com gatilhos de escassez

---

### 4. Atualizar BonusSection.tsx

- Gerar 3 imagens ilustrativas via emojis/gradientes estilizados (cards com visual de "capa de ebook") em vez de icones lucide
- Cada bonus tera um visual de mockup de guia com gradiente de fundo unico e emoji grande

---

### 5. Atualizar FAQ.tsx

- Adicionar/atualizar a resposta de "Como recebo o acesso?" para mencionar explicitamente: "O acesso e enviado imediatamente apos a aprovacao do pagamento, por e-mail, atraves da plataforma Cakto."

---

### 6. Atualizar PricingCards.tsx

- Copy mais persuasiva no gatilho de upgrade
- Reforcar a dor no card Essencial para fazer o lead sentir que o Premium vale mais
- Adicionar micro-copy tipo "Voce esta a um passo de nunca mais perder tempo procurando partituras"

---

### 7. Copy e gatilhos de conversao

Nova headline hero: "Chega de Perder Horas Procurando Partituras Ruins na Internet"
Sub-headline: "Tenha agora o maior acervo de partituras para sax do Brasil — organizado, profissional e pronto para tocar."

Gatilhos ao longo da pagina:
- Dor: "Enquanto voce procura, outros saxofonistas ja estao tocando"
- Urgencia: "Esse preco pode mudar a qualquer momento"
- Prova: "+847 saxofonistas ja garantiram"
- Ancora: "R$ 9,90 e menos que um cafe"

---

### Arquivos modificados

| Arquivo | Acao |
|---------|------|
| 7 assets | Copiar videos + selo |
| `src/components/funnel/VideoTestimonialCarousel.tsx` | Criar - carrossel de videos |
| `src/components/funnel/SalesPage.tsx` | Reescrever - hero centralizado, copy agressiva, videos em destaque, selo garantia |
| `src/components/funnel/BonusSection.tsx` | Redesign - imagens estilizadas no lugar dos icones |
| `src/components/funnel/PricingCards.tsx` | Copy persuasiva, gatilhos de upgrade |
| `src/components/funnel/FAQ.tsx` | Atualizar resposta sobre acesso via Cakto |
| `src/components/funnel/TestimonialCarousel.tsx` | Ajustar estilo para ser complemento (menor) |
| `src/index.css` | Novas utilidades visuais |

