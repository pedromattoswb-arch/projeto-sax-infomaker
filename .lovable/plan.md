

## Plano: 3 Order Bumps Digitais — Refinados para Conversão Máxima

Mantemos os **Order Bumps 1 e 2** com promessas mais fortes e substituímos o 3 por algo realmente útil no dia a dia.

---

### Order Bump 1 — "Tabela de Digitação Completa — Sax Alto e Tenor (com Altíssimas)"

**Promessa forte para o checkout:**
> "Nunca mais erre uma nota. A tabela que você vai consultar toda vez que pegar o sax."

**Por que converte:** Digitação é consulta obrigatória — do iniciante ao avançado. Incluir as **notas altíssimas** (que quase ninguém ensina organizado) torna o produto irresistível. É o tipo de material que o saxofonista imprime e cola na estante.

**Conteúdo da página (`/orderbump/digitacao`):**
- Todas as digitações do registro grave ao agudo (Sib grave → Fá#)
- Seção especial: **Registro Altíssimo** (Fá# a Dó acima) — com diagramas visuais
- **Digitações alternativas** para passagens rápidas e trinados
- Dicas de embocadura por registro (grave, médio, agudo, altíssimo)
- Download em PDF de alta qualidade para imprimir

**Título no checkout Cakto:**
`🎯 Tabela de Digitação Completa — Inclui Notas Altíssimas`

**Descrição curta:**
`Todas as digitações do sax alto e tenor numa tabela visual profissional. Inclui registro altíssimo e digitações alternativas — o material que você vai consultar pra sempre.`

---

### Order Bump 2 — "Kit Transposição Instantânea — Toque Qualquer Partitura em Qualquer Sax"

**Promessa forte para o checkout:**
> "Acabou o sofrimento de transpor partitura. Consulta em 3 segundos, qualquer tom, qualquer sax."

**Por que converte:** Quem toca em igreja, banda ou evento SEMPRE precisa transpor. É uma dor real e frequente. Ter uma tabela de bolso resolve isso pra sempre.

**Conteúdo da página (`/orderbump/transposicao`):**
- Tabela de conversão: Concert Pitch ↔ Sax Alto (Eb) ↔ Sax Tenor (Bb) ↔ Soprano ↔ Barítono
- Todas as 12 tonalidades convertidas
- "Como transpor na prática em 3 passos" — método visual
- Tabela de armaduras de clave (quantos # e b por tom)
- Cifras mais comuns transpostas (pra quem toca com banda/igreja)
- Download em PDF

**Título no checkout Cakto:**
`🔄 Kit Transposição Instantânea — Alto, Tenor, Soprano e Barítono`

**Descrição curta:**
`Tabela de transposição completa entre todos os saxofones. Consulta em segundos, qualquer tom. Indispensável pra quem toca em banda, igreja ou evento.`

---

### Order Bump 3 (NOVO) — "Checklist de Manutenção do Sax — Cuide do Seu Instrumento Como Profissional"

**Promessa forte para o checkout:**
> "Seu sax dura 10x mais com os cuidados certos. O guia que evita consertos caros."

**Por que converte:** Todo saxofonista gasta dinheiro com luthier por falta de manutenção básica. Um guia prático de cuidados diários, semanais e mensais é algo que **ninguém oferece organizado** e que gera economia real. É o tipo de conteúdo que o cara lê uma vez e muda o comportamento pra sempre.

**Conteúdo da página (`/orderbump/manutencao`):**
- **Cuidados diários:** limpeza pós-uso, secagem de palheta, armazenamento correto
- **Cuidados semanais:** limpeza de sapatilhas, verificação de chaves, lubrificação
- **Cuidados mensais:** inspeção de cortiças, parafusos, verificação de vazamentos
- **Sinais de alerta:** quando levar ao luthier (e o que NÃO tentar consertar sozinho)
- **Checklist imprimível:** quadro visual para o saxofonista acompanhar a rotina
- **Guia de palhetas:** como escolher, amaciar, quanto tempo dura cada uma, comparativo de marcas
- Download em PDF

**Título no checkout Cakto:**
`🔧 Checklist de Manutenção do Sax — Evite Consertos Caros`

**Descrição curta:**
`Guia prático de cuidados diários, semanais e mensais com seu saxofone. Inclui checklist imprimível + guia completo de palhetas. Economize centenas de reais em luthier.`

---

### Implementação Técnica

1. Criar 3 páginas em `src/pages/`: `OrderBumpDigitacao.tsx`, `OrderBumpTransposicao.tsx`, `OrderBumpManutencao.tsx`
2. Seguir o mesmo layout das páginas de bônus existentes (header com logo, hero com gradiente, conteúdo em cards, botão de download PDF)
3. Registrar as 3 rotas em `src/App.tsx`
4. Cores distintas: Digitação = roxo/violeta, Transposição = azul/ciano, Manutenção = verde/esmeralda

