

## Plano: Dois Acervos (Básico e Completo) + Copy para Cakto

### Estratégia

Criar duas rotas separadas (`/acervo` para o Completo e `/acervo-basico` para o Básico), ambas usando o mesmo componente `Acervo.tsx` mas com uma prop `plan` que controla o que é visível. No plano Básico, certas pastas aparecem **bloqueadas** com um overlay de upgrade. Sem autenticação — cada link de checkout na Cakto entrega o link do acervo correspondente.

---

### 1. Rota e Componente

**`src/App.tsx`** — Adicionar rota `/acervo-basico`:
```
<Route path="/acervo-basico" element={<Acervo plan="basic" />} />
<Route path="/acervo" element={<Acervo plan="premium" />} />
```

**`src/pages/Acervo.tsx`** — Receber prop `plan`:
- Definir lista de pastas bloqueadas no plano básico (por nome): `"Playbacks"`, `"Vídeos Tutoriais"`, `"Harpa Cristã"`, `"Bônus"`, `"Material Complementar"`, etc.
- Quando `plan === "basic"`:
  - Pastas bloqueadas aparecem com overlay semitransparente + ícone de cadeado + botão "Fazer Upgrade → R$ 39,90"
  - Esconder seção de Bônus (BonusSection)
  - Esconder seção de Tutoriais (TutorialBanner)
  - Mostrar banner fixo no topo: "Você está no Plano Básico — Faça upgrade para ter acesso completo"
- Quando `plan === "premium"`: tudo liberado (comportamento atual)

### 2. Componente de Pasta Bloqueada

**`src/components/acervo/LockedFolderCard.tsx`** (NOVO):
- Mesmo visual do `FolderCard` mas com opacity reduzida
- Overlay com ícone Lock + texto "Disponível no Plano Completo"
- Botão/link para a página de upgrade (link Cakto Premium ou página de vendas)

### 3. Banner de Upgrade (Plano Básico)

No `Acervo.tsx`, quando `plan === "basic"`:
- Banner sticky abaixo do header com gradiente dourado
- "Plano Básico — Faça upgrade para o Completo por apenas R$ 20 a mais"
- Botão CTA direto para o link Cakto Premium

### 4. Navegação Separada

**`src/components/acervo/MobileNav.tsx`** — Receber prop `plan`:
- Quando `basic`: esconder itens de bônus, mostrar item "Fazer Upgrade" com destaque
- Quando `premium`: manter como está + adicionar itens de bônus

### 5. Copy para Cadastro na Cakto

Fornecer textos prontos para copiar e colar na Cakto para os dois produtos:

**Produto 1 — SaxPlay Básico (R$ 19,90)**
- Nome, descrição, bullets, e-mail de entrega com link `/acervo-basico`

**Produto 2 — SaxPlay Completo (R$ 39,90)**
- Nome, descrição, bullets, e-mail de entrega com link `/acervo`

---

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/App.tsx` | Nova rota `/acervo-basico` |
| `src/pages/Acervo.tsx` | Prop `plan`, lógica de pastas bloqueadas, banner upgrade |
| `src/components/acervo/LockedFolderCard.tsx` | **NOVO** — Card de pasta bloqueada |
| `src/components/acervo/MobileNav.tsx` | Prop `plan`, item de upgrade |

