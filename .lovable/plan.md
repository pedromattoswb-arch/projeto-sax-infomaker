

## Plano: Reestruturação Completa da Sales Page — SaxBrasil

Reformulação total da comunicação, copy e conteúdo da página de vendas para posicionar o SaxBrasil como **o maior acervo de partituras e playbacks para saxofone do Brasil**, com +10.000 arquivos.

---

### 1. Nova Comunicação e Copy (toda a página)

**Mudança de posicionamento:** De "acervo de partituras" para "plataforma completa para saxofonistas" — maior do Brasil, recomendada por escolas, com inovação tecnológica.

**Arquivo principal:** `src/components/funnel/SalesPage.tsx`

- **Hero:** Reescrever headline para "+10.000 Partituras e Playbacks — O Maior Acervo Para Sax do Brasil". Subheadline destacando: plataforma própria, busca por voz, tutoriais, material de estudo. Badge atualizado para "+10.000 arquivos".
- **Bullet points atualizados:** Mencionar busca inteligente por voz, vídeos tutoriais integrados, material de estudo completo, plataforma própria estilo app.
- **Features array:** Reformular para incluir: Plataforma Exclusiva, +10.000 Arquivos, Busca por Voz, Vídeos Tutoriais, Material de Estudo, Acesso Vitalício.
- **CTA final:** Atualizar números para +10.000. Copy com mais autoridade ("Recomendado por escolas de saxofone").
- **Seção nova: "Conheça a Plataforma por Dentro"** — mockup/simulação visual do app real com tarja "SIMULAÇÃO — ACERVO REAL" mostrando a navegação do acervo (pastas, busca, player). Componente estático que recria visualmente a UI do Acervo com dados reais mas sem funcionalidade — apenas demonstração visual.

---

### 2. Seção de Simulação do App

**Novo componente:** `src/components/funnel/AppSimulation.tsx`

- Recria visualmente a interface do `/acervo` com dados estáticos: lista de pastas reais (Música Popular Brasileira, Jazz, Gospel, etc.), cards de arquivos de exemplo, player de áudio visual
- Tarja superior fixa: "🔒 SIMULAÇÃO DO ACERVO REAL — APENAS PARA DEMONSTRAÇÃO"
- Mockup de celular/tablet com a UI dentro, visual estilo screenshot interativo
- Não funcional — apenas visual para mostrar como é por dentro
- Incluir: pastas de gêneros, filtros, busca, player, tutoriais — tudo que temos

---

### 3. Playbacks de Amostra Atualizados

**Arquivo:** `src/components/funnel/PlaybackSamples.tsx`

Atualizar a lista de tracks com músicas mais famosas e desejadas que existem no acervo real:
- Careless Whisper (mantém), Baker Street, Take Five, The Pink Panther, Fly Me to the Moon
- Garota de Ipanema, Evidências, Asa Branca
- Hallelujah, My Heart Will Go On, Just the Way You Are
- Remover tracks menos conhecidos, priorizar os mais icônicos e reconhecíveis

Atualizar texto: "Ouça alguns dos +10.000 playbacks do acervo"

---

### 4. Catálogo Atualizado

**Arquivo:** `src/components/funnel/SongCatalog.tsx`

- Atualizar números: cada gênero com contagens maiores (total +10.000)
- Adicionar mais gêneros que existem no acervo: Bossa Nova, Forró, Sertanejo, Românticas, Trilhas de Filmes, Músicas de Natal, Casamento
- Headline: "+10.000 Partituras e Playbacks Organizados Por Gênero"
- Expandir grid para mostrar mais categorias (12-16 cards)

---

### 5. Pricing e Bonus Atualizados

**Arquivo:** `src/components/funnel/PricingCards.tsx`
- Atualizar features do Essencial: "+5.000 partituras em PDF"
- Atualizar features do Premium: "+10.000 partituras e playbacks", "Plataforma exclusiva estilo app", "Busca inteligente por voz", "Vídeos tutoriais integrados"
- Adicionar menção a tutoriais nos bônus

**Arquivo:** `src/components/funnel/BonusSection.tsx`
- Manter os 3 bônus existentes
- Adicionar na descrição: "Disponível dentro da plataforma SaxBrasil"

---

### 6. FAQ Atualizado

**Arquivo:** `src/components/funnel/FAQ.tsx`
- Atualizar resposta sobre diferença Essencial/Premium com novos números
- Adicionar pergunta: "O que são os vídeos tutoriais?"
- Adicionar pergunta: "Como funciona a busca por voz?"
- Atualizar todas as menções de "+2.000" para "+10.000"
- Reforçar autoridade: "Recomendado por escolas e professores de saxofone"

---

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/components/funnel/SalesPage.tsx` | Copy completa reescrita, nova seção de simulação |
| `src/components/funnel/AppSimulation.tsx` | **NOVO** — Simulação visual do app |
| `src/components/funnel/PlaybackSamples.tsx` | Tracks atualizados com músicas mais famosas |
| `src/components/funnel/SongCatalog.tsx` | +10.000, mais gêneros, mais cards |
| `src/components/funnel/PricingCards.tsx` | Features e números atualizados |
| `src/components/funnel/BonusSection.tsx` | Menção à plataforma |
| `src/components/funnel/FAQ.tsx` | Novas perguntas, números atualizados |

