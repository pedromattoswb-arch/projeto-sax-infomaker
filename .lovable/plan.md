

## Plano: Seção de Playbacks de Amostra na Área de Exemplos do Acervo

### O que vamos fazer
Criar uma seção de reprodutores de áudio logo abaixo do carrossel de partituras (dentro da mesma área escura de exemplos), com players estilizados mostrando nome da música e gênero musical. Os 10 MP3s enviados serão copiados para `public/playbacks/` e reproduzidos via elemento `<audio>` nativo com controles customizados (botão play/pause grande e visível, barra de progresso).

### Arquivos dos playbacks e nomes limpos

| Arquivo | Nome exibido | Gênero |
|---------|-------------|--------|
| ABBA - Dancing Queen | Dancing Queen | Pop |
| Alcione - Estranha Loucura | Estranha Loucura | MPB |
| Bruno e Marrone - Boate Azul | Boate Azul | Sertanejo |
| Caetano Veloso - Sozinho | Sozinho | MPB |
| Dire Straits - Your Latest Trick | Your Latest Trick | Rock |
| Amigo de Deus - Adhemar Campos | Amigo de Deus | Gospel |
| Jingle Bells | Jingle Bells | Clássico |
| Prince Ali | Prince Ali | Trilha Sonora |
| Alegria Está no Coração | Alegria Está no Coração | Gospel |
| Espírito Espírito | Espírito Espírito | Gospel |

### Implementação

**1. Copiar os 10 MP3s para `public/playbacks/`**
- Usar `public/` pois áudio não precisa de bundling via Vite

**2. Criar componente `src/components/funnel/PlaybackSamples.tsx`**
- Grid responsivo (2 colunas mobile, 3 desktop) de cards de áudio
- Cada card: botão play/pause circular grande e chamativo (verde/primary), nome da música em bold, gênero em tag/badge pequena
- Player customizado com `useRef<HTMLAudioElement>` + estado play/pause + barra de progresso
- Apenas um áudio toca por vez (ao dar play em um, pausa os outros)
- Visual: cards com fundo semi-transparente (glass effect), ícone de play grande, borda sutil
- Texto de chamada: "🎧 Ouça Alguns Playbacks de Amostra" + subtítulo "Isso é só uma amostra — no acervo completo você terá acesso a muito mais"

**3. Editar `SalesPage.tsx`**
- Importar e inserir `<PlaybackSamples />` logo após `<PartituraCarousel />`
- Ficará dentro do mesmo bloco visual (fundo escuro continua)

**4. Editar `PartituraCarousel.tsx`**
- Remover o padding-bottom da section para que a transição para os playbacks seja fluida (ou manter e ajustar visualmente)

### Estrutura visual

```text
┌─────────────────────────────────────┐
│  Veja Alguns Exemplos do Acervo     │  ← título existente
│  [carrossel de partituras]          │  ← já existe
│                                     │
│  🎧 Ouça Alguns Playbacks de Amostra│  ← NOVO subtítulo
│  "Isso é só uma amostra..."        │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ ▶ DQ │ │ ▶ EL │ │ ▶ BA │        │  ← cards com play
│  │ Pop  │ │ MPB  │ │Sert. │        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ ▶ Sz │ │ ▶ YLT│ │ ▶ AD │        │
│  └──────┘ └──────┘ └──────┘        │
│  ... mais cards                     │
└─────────────────────────────────────┘
```

### Detalhes técnicos
- Player customizado via `<audio>` nativo (sem biblioteca extra)
- Estado global dentro do componente: `playingId` para garantir que só um toca por vez
- Barra de progresso com `timeupdate` event + slider ou div animada
- Botão play grande (48x48) com animação de pulse quando tocando
- Responsivo: 1 coluna em telas muito pequenas, 2 em mobile, 3 em desktop

