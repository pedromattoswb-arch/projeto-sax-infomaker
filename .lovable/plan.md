

## Plano: Redesign dos Playbacks — Playlist Compacta + Novas Músicas

### Novas músicas a adicionar (5)

| Arquivo | Nome exibido | Gênero |
|---------|-------------|--------|
| Alguém me disse | Alguém Me Disse | MPB |
| Careless Whisper | Careless Whisper | Pop |
| Endless Love | Endless Love | Pop |
| Tan Enamorados | Tan Enamorados | Romântico |
| Tudo É Possível ao Que Crê | Tudo É Possível ao Que Crê | Gospel |

### Mudanças principais

**1. Copiar 5 MP3s para `public/playbacks/`** com nomes limpos (sem "youtube", "karaoke", etc.)

**2. Redesign do `PlaybackSamples.tsx` — formato playlist compacta**

Em vez de grid de cards grandes, usar uma **lista vertical compacta tipo playlist** (como Spotify/YouTube Music):
- Cada item é uma linha horizontal com: botão play circular, nome da música (fonte maior e bold), badge do gênero, tempo atual/total, e barra de progresso
- Linhas mais estreitas e compactas para não ocupar muito espaço vertical
- Fontes maiores e mais legíveis (pensando no público idoso/leigo)
- Barra de progresso visível em cada item, clicável para seek
- Ao tocar uma música e ela terminar, avança automaticamente para a próxima (comportamento playlist)
- Layout: lista única com scroll interno se necessário, max ~6-7 visíveis, restante com scroll suave
- Botão play bem grande e verde, fácil de identificar
- Container com altura máxima e `overflow-y: auto` com scrollbar estilizada

**3. Detalhes visuais para acessibilidade**
- Nome da música: `text-base md:text-lg` (maior que antes)
- Tempo: `text-xs md:text-sm` (mais legível)
- Badge gênero: `text-xs` com padding generoso
- Botão play: 48x48 mínimo (área de toque confortável)
- Contraste alto: texto branco sobre fundo escuro

**4. Auto-play próxima faixa**
- No `handleEnded`, avançar para o próximo track da lista automaticamente

### Estrutura visual

```text
┌─────────────────────────────────────────┐
│  🎧 Ouça Alguns Playbacks de Amostra    │
│  "Isso é só uma amostra..."            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ▶  Dancing Queen    Pop   1:23  │    │
│  │    ████████░░░░░░░░░░░░░░░░░░░  │    │
│  ├─────────────────────────────────┤    │
│  │ ▶  Estranha Loucura MPB   0:00  │    │
│  │    ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │    │
│  ├─────────────────────────────────┤    │
│  │ ▶  Careless Whisper Pop   0:00  │    │
│  │    ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │    │
│  ├─────────────────────────────────┤    │
│  │ ... mais faixas (scroll)        │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Arquivos alterados
- `public/playbacks/` — 5 novos MP3s
- `src/components/funnel/PlaybackSamples.tsx` — redesign completo para formato playlist compacta com auto-next, fontes maiores, 15 tracks total

