## Plano de Execução

### 1. Duplicar página de vendas em `/nova-oferta`

- Criar um novo componente `PricingCardsNovaOferta.tsx` baseado no `PricingCards.tsx` com as seguintes mudanças:
  - Preço do Plano Completo: **R$ 29,90** (em vez de R$ 19,90)
  - Link de checkout do Completo: `https://pay.cakto.com.br/rbva2ch_869767`
  - Texto de comparação ajustado ("Por apenas R$ 20 a mais" em vez de "R$ 10 a mais")
- Criar página `src/pages/NovaOferta.tsx` que renderiza o `SalesPage` mas usa o `PricingCardsNovaOferta`
  - Para isso, o `SalesPage` receberá uma prop opcional para alternar qual PricingCards usar
- Adicionar rota `/nova-oferta` no `App.tsx`

### 2. Simplificar páginas de obrigado

Ambas as páginas (`ThankYouBasico.tsx` e `ThankYouCompleto.tsx`) serão reduzidas para conter apenas:

- Header com logo
- Hero de confirmação (icone + titulo + parabéns)
- Seção "Como Acessar Sua Plataforma" (3 passos + botão de acesso)
- Footer simples

Removido de **ThankYouBasico**:
- Seção "Upgrade Banner" (oferta do plano completo por R$ 6,90)
- Seção "Suporte"

Removido de **ThankYouCompleto**:
- Seção "O Que Você Desbloqueou" (grid de features + bônus)
- Seção "Suporte"

### 3. Revisão geral de performance

- Verificar se as otimizações de cache nas Edge Functions estão funcionando corretamente
- Confirmar que o debounce de busca, virtualização de listas e lazy loading do PDF estão ativos
- Rodar perfil de performance no browser para identificar gargalos restantes

---

### Detalhes técnicos

**Arquivos criados:**
- `src/components/funnel/PricingCardsNovaOferta.tsx`
- `src/pages/NovaOferta.tsx`

**Arquivos editados:**
- `src/App.tsx` — nova rota `/nova-oferta`
- `src/components/funnel/SalesPage.tsx` — prop para alternar PricingCards
- `src/pages/ThankYouBasico.tsx` — remover upgrade banner e suporte
- `src/pages/ThankYouCompleto.tsx` — remover features grid, bônus e suporte
