

## Plano: Carrossel Infinito de Partituras de Exemplo

### O que vamos fazer
Criar um carrossel horizontal com scroll infinito e continuo (sem parar), mostrando as partituras enviadas como exemplos visuais do acervo. Sera inserido entre a secao HERO e a secao "O Que Voce Recebe", com um titulo reforçando a quantidade do acervo.

### Implementacao

**1. Copiar as 8 imagens de partitura para `src/assets/partituras-exemplo/`**
- As 8 imagens enviadas (Somewhere Over The Rainbow p1-p2, Alem do Horizonte p1-p2, A Viagem p1, A Sua p1-p2, Ainda Lembro p1-p2)

**2. Criar componente `src/components/funnel/PartituraCarousel.tsx`**
- Tecnica: CSS `@keyframes` scroll infinito (sem biblioteca), duplicando as imagens para efeito seamless
- Duas fileiras (ou uma) de imagens deslizando horizontalmente sem pausa
- Cada imagem com borda arredondada, sombra sutil, leve rotacao/tilt para efeito visual
- Velocidade constante, sem interacao do usuario (puro visual)
- Ao hover, desacelera levemente (opcional)

**3. Editar `SalesPage.tsx`**
- Inserir entre o HERO (linha 107) e "O Que Voce Recebe" (linha 109)
- Titulo: "Veja Alguns Exemplos do Acervo" + subtitulo reforçando "+2.000 partituras profissionais para sax alto e tenor"
- Fundo escuro para destacar as partituras brancas

### Tecnica do scroll infinito CSS
- Duplicar o array de imagens 2x dentro de um container flex
- Aplicar `animation: scroll Xs linear infinite` que translada -50% no eixo X
- Isso cria loop visual perfeito sem JavaScript

### Arquivos
- Copiar 8 imagens para `src/assets/partituras-exemplo/`
- Criar `src/components/funnel/PartituraCarousel.tsx`
- Editar `src/components/funnel/SalesPage.tsx` (importar e inserir)
- Editar `src/index.css` (adicionar keyframe de scroll se necessario)

