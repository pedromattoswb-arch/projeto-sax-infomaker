

## Plano: Blindagem de Confiança Anti-Golpe (Sutil)

### Estrategia Principal
A chave e **nunca usar a palavra "golpe"** nem linguagem defensiva. Em vez disso, construir confianca atraves de **autoridade institucional**, **transparencia no processo** e **prova social reforçada**. A pessoa deve sentir que esta comprando de uma empresa seria, nao de um site aleatorio.

---

### 1. FAQ.tsx — Reescrever e adicionar perguntas estrategicas

**Reescrever "Como recebo o acesso?"** com detalhes que transmitem processo profissional:
- Mencionar que o acesso e entregue automaticamente pela **plataforma Cakto** (empresa de pagamentos digitais)
- Orientar a verificar caixa de entrada, aba "Promocoes" e pasta de spam
- Informar que o e-mail vem do remetente da Cakto com login e senha

**Nova pergunta: "Quem processa o pagamento?"**
- Explicar que o pagamento e processado pela Cakto, plataforma brasileira de pagamentos digitais usada por milhares de produtores
- Criptografia SSL, dados protegidos, nenhuma informacao bancaria armazenada no site

**Nova pergunta: "Posso confiar neste site?"**
- Resposta focada em: +847 clientes ativos, empresa com CNPJ, garantia de 7 dias com reembolso via propria Cakto, suporte ativo por e-mail e WhatsApp

---

### 2. PricingCards.tsx — Trust Bar compacta abaixo dos cards

Adicionar uma faixa horizontal com 3-4 icones (ShieldCheck, Lock, BadgeCheck) e textos curtos:
- "Pagamento via Cakto" | "Dados protegidos" | "Garantia 7 dias" | "Acesso imediato"
- Estilo discreto, fonte pequena, icones sutis — transmite profissionalismo sem gritar "seguranca"

---

### 3. SalesPage.tsx — Garantia section reforçada

Adicionar uma linha extra na secao de garantia:
- "O reembolso e processado diretamente pela plataforma Cakto — voce nao precisa falar com ninguem."

---

### 4. SalesPage.tsx — Footer profissional com selos

Expandir o footer com:
- Linha de trust: "Pagamento processado por Cakto • Dados protegidos com SSL • Produto digital com entrega imediata"
- Texto de entrega: "Apos a confirmacao, voce recebe o acesso por e-mail. Confira sua caixa de entrada e a pasta de spam."
- Icones de ShieldCheck e Lock para reforço visual

---

### 5. SalesPage.tsx — Micro-copy no CTA final

Abaixo do botao CTA final, adicionar:
- "Pagamento seguro via Cakto • Garantia de 7 dias • +847 saxofonistas ja compraram"

---

### Arquivos editados
- `src/components/funnel/FAQ.tsx` — reescrever 1 pergunta + adicionar 2 novas
- `src/components/funnel/PricingCards.tsx` — trust bar abaixo dos cards
- `src/components/funnel/SalesPage.tsx` — garantia reforçada, footer expandido, micro-copy CTA

### Principio guia
Nunca mencionar golpe, fraude ou inseguranca. Toda a linguagem e **positiva e institucional**: "plataforma Cakto", "empresa brasileira", "+847 clientes", "reembolso automatico". A confianca vem da **normalidade e profissionalismo**, nao de se defender.

