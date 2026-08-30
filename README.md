# Projeto Sax - SaxPlay

# CONTEXTO E OBJETIVO PRINCIPAL:
Quero criar um funil gamificado em formato de quiz para vender um produto que basicamente é uma plataforma com mais de 2000 partituras e playbacks para Saxofone... 

Esse funil de vendas deve ser um funil de alto engajamento que vai ter o trabalho de aquecer o lead e converter ele na tela final que é a tela de oferta que vai leva-lo até o checkout externo da Cakto que já temos pronto. 

Precisamos criar uma experiência única, leve, mas impactante e transformadora. O Lead precisa enxergar essa transformação e praticidade que a nossa plataforma vai oferecer a ele, seja ele profissional, iniciante, toca por hobbie e etc... 

Precisamos criar esse funil de vendas de alta conversão! Pois vamos trabalhar nele esse produto validado já e em escala... E precisamos destravar urgentemente essas vendas 

O preço do produto é de R$37,90 acesso vitalício a plataforma... 

E também pode ser parcelado em até 6x (não especificar o valor das parcelas)

---

# DIRETRIZES DE ENGENHARIA DE CONVERSÃO E UX (Complemento Obrigatório):

Para garantir a "Dopamina" e a Alta Conversão mencionadas, siga estritamente estes pontos adicionais na construção do layout e da lógica:

1. ESTRUTURA DE MICRO-COMPROMETIMENTOS (O Quiz):
   - Comece com perguntas fáceis e de "sim/não" para reduzir a carga cognitiva inicial e fazer o lead começar a clicar (efeito de consistência).
   - Barra de Progresso Visível: Mantenha uma barra de progresso no topo que avança a cada resposta, dando a sensação de conclusão iminente.
   - Segmentação Disfarçada de Personalização: Pergunte o nível (Iniciante, Intermediário, Profissional) e o estilo musical favorito. Use essa informação para mudar a "Headline" da página de oferta final (Ex: "O acervo definitivo para o Saxofonista Iniciante tocar suas primeiras músicas hoje").

2. A TELA DE "DIAGNÓSTICO" (O Pico de Dopamina):
   - Antes de mostrar a oferta, insira uma tela de transição de 3 a 5 segundos com animações de "Calculando perfil...", "Selecionando as melhores partituras...", "Personalizando plataforma...".
   - Finalize essa tela com uma mensagem de sucesso ("Seu perfil foi aprovado" ou "Plataforma compatível encontrada") para gerar a gratificação instantânea antes da venda.

3. PÁGINA DE OFERTA (Sales Page Híbrida):
   - Headline de Transformação Imediata: Foque na eliminação da dor de "procurar partituras ruins na internet". Promessa de "Tudo organizado em um só lugar".
   - Design Mobile-First: Botões de CTA (Chamada para Ação) grandes, largos e fixos no rodapé (Sticky Button) enquanto o usuário rola a página, garantindo que o checkout esteja sempre a um clique do polegar.
   - Ancoragem de Preço Visual: Mostre claramente o valor que seria cobrado individualmente (ex: "Valor real: R$ 297,00") riscado, destacando o preço de R$ 37,90 em tamanho maior e cor de contraste (verde ou laranja).
   - Prova Social Imediata: Abaixo do botão de compra, insira prints curtos de "Saxofonistas reais" elogiando a organização e qualidade dos playbacks.

4. VELOCIDADE E FLUIDEZ:
   - O carregamento entre as perguntas do quiz deve ser instantâneo (sem reload de página, apenas transição de slides).
   - Use cores vibrantes mas profissionais (dourado/preto para ar premium, ou azul/branco para clareza), evitando poluição visual. O foco deve ser 100% na próxima ação.

5. CHECKOUT EXTERNO:
   - O botão final "QUERO MEU ACESSO VITALÍCIO" deve abrir o link da Cakto em uma nova aba ou, preferencialmente, carregar rápido, mantendo a coerência visual (cores) do funil para passar segurança.

6. GATILHOS FINAIS:
   - Adicione um contador regressivo (Scarcity) de 10 ou 15 minutos na página de oferta ofertando uma condição especial "apenas para quem completou o quiz agora".
   - Reforce a Garantia: Ícone de "Risco Zero" Garantia de 7 dias próximo ao botão de compra.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://melody-path-finder.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe22c347-d4a4-45f0-a0cb-327f23c24ecb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
