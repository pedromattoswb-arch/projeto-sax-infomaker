

## Plano: Otimizacao de Conversao — Clareza, Desejo e Engajamento

### Problema
Trafico chegando mas baixa taxa de checkout. A pagina precisa comunicar com mais clareza e impacto o que e o SaxPlay, gerar mais desejo e empurrar o usuario para a decisao de compra.

---

### 1. Hero — Clareza Imediata do Produto (SalesPage.tsx)

**Problema atual:** A copy e generica e nao explica claramente o que o usuario recebe.

**Mudancas:**
- Reformular headline principal: "O Maior App de Partituras e Playbacks Para Saxofone do Brasil" — direto, claro, sem rodeios
- Sub-headline mais especifica: "Mais de 1.000 partituras com playback acompanhando, organizadas por genero, para Sax Alto e Sax Tenor. Acesse pelo celular, tablet ou PC."
- Adicionar frase-ancora abaixo do video: "Cada partitura vem com o playback profissional para voce tocar junto. E tudo organizado por genero, numa plataforma que funciona como app."
- Reformular os bullets para enfatizar o par PARTITURA + PLAYBACK em vez de listar features isoladas
- Adicionar um novo counter: "+1.000" com label "Partituras com Playback" (o par e o diferencial)

### 2. Secao "O Que Voce Recebe" — Redesenhar como Lista de Valor (SalesPage.tsx)

**Problema atual:** Os 8 cards de features sao genericos e nao geram desejo.

**Mudancas:**
- Reformular titulo: "Veja TUDO Que Voce Recebe ao Garantir Seu Acesso"
- Reformular as descricoes enfatizando o beneficio real, nao a feature tecnica
- Exemplo: "Busca Inteligente" → "Encontre qualquer musica em 2 segundos — digite o nome e a partitura + playback aparecem na hora"
- Trocar "+10.000 Arquivos" por "+1.000 Partituras com Playback" como destaque principal — e mais crivel e mais claro

### 3. Carrossel de Partituras — Mais Contexto (PartituraCarousel.tsx)

- Mudar titulo para: "Veja a Qualidade das Partituras que Voce Vai Receber"
- Adicionar legenda: "Todas as partituras sao profissionais, revisadas e vem com playback para tocar junto"

### 4. Playbacks — Enfatizar o Par Partitura+Playback (PlaybackSamples.tsx)

- Mudar titulo para: "Ouca os Playbacks — Cada Partitura Vem com o Acompanhamento"
- Mudar subtitulo para explicar: "Na plataforma, voce abre a partitura e da play no playback na mesma tela. E so tocar junto."
- Adicionar CTA abaixo dos playbacks: "QUERO TOCAR JUNTO — ESCOLHER MEU PLANO"

### 5. Simulacao do App — Mais Realismo e Desejo (AppSimulation.tsx)

- Mudar titulo: "Veja Como Funciona Por Dentro — E Simples Assim"
- Enfatizar que cada pasta tem partituras + playbacks juntos
- Nos sample files, mostrar pares claros: "Careless Whisper.pdf" + "Careless Whisper - Playback.mp3"
- Adicionar texto: "Voce abre a pasta, escolhe a musica, abre a partitura e da play no playback. Tudo na mesma tela, sem sair do app."
- Adicionar CTA no final da simulacao

### 6. Catalogo de Musicas — Copy Mais Clara (SongCatalog.tsx)

- Mudar titulo: "Procure Sua Musica Favorita no Acervo"
- Mudar subtitulo: "Se ela esta aqui, voce ja pode tocar com partitura + playback profissional"
- Na busca, quando encontrar resultado, mudar texto para: "Essa musica esta no acervo! Garanta seu acesso e toque agora"

### 7. PricingCards — Mais Clareza e Desejo

**Problema atual:** A diferenciacao entre planos nao e clara o suficiente.

**Mudancas:**
- Basico: Reformular descricao para "Partituras em PDF — sem playback"
- Premium: Reformular para "Partituras + Playbacks + Tudo Incluso"
- Adicionar bloco de comparacao visual mais impactante entre os planos
- Reformular o box "Por apenas R$20 a mais" com copy mais persuasiva: "Por R$20 a mais voce recebe os playbacks profissionais, busca por voz, tutoriais e 3 bonus. E a escolha de 9 em cada 10 saxofonistas."
- Adicionar frase de ancoragem: "Menos que o preco de uma palheta — e voce leva mais de 1.000 partituras com playback pra vida toda"

### 8. Bonus — Conectar ao Produto Principal (BonusSection.tsx)

- Adicionar intro antes dos bonus: "Alem das +1.000 partituras com playback, voce ainda recebe 3 guias exclusivos para acelerar sua evolucao"

### 9. FAQ — Reforcar Clareza (FAQ.tsx)

- Adicionar pergunta: "O que exatamente eu recebo ao comprar?" com resposta detalhada listando tudo
- Reformular respostas existentes para sempre mencionar "partituras com playback" como par

### 10. CTA Final — Mais Urgencia e Desejo (SalesPage.tsx)

- Reformular: "Mais de 1.000 partituras com playback profissional, organizadas por genero, numa plataforma que funciona como app. Para Sax Alto e Sax Tenor. Acesso vitalicio. Garantia de 7 dias. A partir de R$19,90."

### 11. Sticky CTA Mobile — Copy Mais Clara

- Mudar de "QUERO COMECAR A TOCAR — R$19,90" para "GARANTIR MEU ACESSO — A PARTIR DE R$19,90"

---

### Arquivos editados
1. `src/components/funnel/SalesPage.tsx` — Hero, features, CTA final, sticky mobile
2. `src/components/funnel/PricingCards.tsx` — Clareza entre planos, copy persuasiva
3. `src/components/funnel/PartituraCarousel.tsx` — Titulo e legenda
4. `src/components/funnel/PlaybackSamples.tsx` — Titulo, subtitulo, CTA
5. `src/components/funnel/AppSimulation.tsx` — Realismo, pares partitura+playback, CTA
6. `src/components/funnel/SongCatalog.tsx` — Copy de busca e resultados
7. `src/components/funnel/BonusSection.tsx` — Intro contextual
8. `src/components/funnel/FAQ.tsx` — Nova pergunta + reformulacoes

