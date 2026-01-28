

## Otimização da Experiência de Dopamina no Funil

Vou melhorar significativamente a **Tela de Diagnóstico** com um indicador de porcentagem circular animado e adicionar micro-interações em todo o funil para criar uma experiência mais emocionante e transformadora.

---

## 1. Nova Tela de Diagnóstico (Foco Principal)

### Indicador de Progresso Circular com Porcentagem

Substituir o ícone de loading atual por um **círculo de progresso animado** que vai de 0% a 100%, similar à imagem de referência:

**Componente Visual:**
- Círculo SVG com stroke animado (progress ring)
- Número grande no centro mostrando a porcentagem: **0% → 100%**
- Cores: borda dourada preenchendo gradualmente sobre fundo roxo
- Ao completar 100%: transforma-se no ícone de check com animação de "pop"

**Timing (Total ~5 segundos):**
| Fase | Porcentagem | Duração | Mensagem |
|------|-------------|---------|----------|
| 1 | 0% → 25% | 1.2s | "Analisando suas preferências musicais..." |
| 2 | 25% → 50% | 1.2s | "Separando partituras de [CATEGORIA] para você..." |
| 3 | 50% → 75% | 1.2s | "Organizando playbacks para Sax [Alto/Tenor]..." |
| 4 | 75% → 100% | 1.4s | "Desbloqueando acesso ao acervo completo..." |

**Feedback Visual Adicional:**
- Cada etapa completada: pequeno "pulse" no círculo
- Número da porcentagem com efeito de "contagem" suave (não pulos bruscos)
- Som de "tick" mental (via animação visual de vibração sutil)

---

## 2. Celebração Final Aprimorada

Quando atinge 100%:

1. **Explosão de confetti** mais elaborada (mais partículas, cores douradas)
2. **Círculo transforma** em check com animação "bounce-in"
3. **Vibração visual** sutil no ícone (haptic feedback visual)
4. **Texto aparece** com animação sequencial palavra por palavra
5. **Transição suave** para a página de oferta após 1.5s

---

## 3. Micro-Interações no Quiz (Dopamina Adicional)

### Feedback de Seleção Aprimorado

Quando o usuário seleciona uma opção:
- **Escala sutil** no card selecionado (1.02x)
- **Ripple effect** partindo do ponto de toque
- **Check icon** aparece com bounce animation
- **Outros cards** fazem fade-out suave

### Barra de Progresso Gamificada

- **Micro-celebração** a cada 25% de progresso (pequeno flash dourado)
- **Milestone badges** visuais nos pontos 25%, 50%, 75%
- **Texto dinâmico** que celebra: "Ótimo progresso!", "Quase lá!"

---

## 4. Novas Animações CSS Necessárias

Adicionar ao `src/index.css`:

```css
/* Contador de porcentagem suave */
@keyframes count-up {
  from { opacity: 0.7; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Círculo de progresso */
@keyframes progress-ring {
  from { stroke-dashoffset: 283; }
  to { stroke-dashoffset: 0; }
}

/* Pulse no milestone */
@keyframes milestone-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 hsl(45 100% 50% / 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px 5px hsl(45 100% 50% / 0.2); }
}

/* Confetti aprimorado */
@keyframes confetti-fall {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

---

## 5. Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `src/components/funnel/DiagnosisScreen.tsx` | Novo componente de progresso circular, lógica de porcentagem, celebração aprimorada |
| `src/index.css` | Novas keyframes e classes de animação |
| `tailwind.config.ts` | Novas animações registradas |
| `src/components/funnel/QuizStep.tsx` | Micro-interações de seleção aprimoradas (opcional) |

---

## Experiência do Usuário Final

```text
┌─────────────────────────────────────┐
│                                     │
│            ╭──────────╮             │
│           │   47%    │             │
│            ╰──────────╯             │
│         [═══════░░░░░░░]            │
│                                     │
│   Separando partituras de           │
│   Gospel para você...               │
│                                     │
│   ✓ Analisando preferências         │
│   ◉ Separando partituras...         │
│   ○ Organizando playbacks           │
│   ○ Desbloqueando acesso            │
│                                     │
└─────────────────────────────────────┘

         ↓ Ao completar 100% ↓

┌─────────────────────────────────────┐
│        🎊 CONFETTI 🎊               │
│                                     │
│            ╭──────────╮             │
│           │    ✓     │  ← bounce   │
│            ╰──────────╯             │
│                                     │
│    Pronto! Seu acervo está          │
│         liberado! 🎷                │
│                                     │
│    Mais de 2.000 partituras         │
│    esperando por você               │
│                                     │
└─────────────────────────────────────┘
```

---

## Resultado Esperado

Uma experiência de diagnóstico que:
- Gera **antecipação** com o número subindo gradualmente
- Cria **satisfação** visual a cada etapa completada
- Entrega **celebração** no momento do 100%
- Faz o usuário **sentir** que algo especial foi preparado para ele
- Aumenta a **percepção de valor** do acervo

