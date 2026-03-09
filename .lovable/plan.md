

## Plano: Rebranding "Clube do Sax" → "SaxPlay" + Definição do App

Este é um projeto grande com duas fases. Vou detalhar a **Fase 1** (rebranding) para implementação imediata e apresentar a **Fase 2** (app do acervo) como roadmap.

---

### FASE 1 — Rebranding para "SaxPlay"

#### 1. Nova paleta de cores
Trocar o verde escuro institucional por uma paleta mais moderna e ligada ao saxofone — tons de **dourado/amber** (remetendo ao latão do sax) com **azul escuro/navy** (elegância e profissionalismo):

- **Primary**: Amber/dourado `hsl(38, 85%, 50%)` — cor do saxofone
- **CTA**: Gradiente dourado para amber escuro
- **Seções escuras**: Navy profundo `hsl(220, 30%, 12%)`
- **Accent**: Azul vibrante para destaques

#### 2. Substituição de texto — 12 arquivos afetados
Trocar todas as 163 ocorrências de "Clube do Sax Brasil" / "Clube do Sax" por "SaxPlay" em:

| Arquivo | Ocorrências |
|---------|-------------|
| `index.html` | SEO, OG tags, schema.org |
| `SalesPage.tsx` | Header, hero alt, footer |
| `FAQ.tsx` | Resposta sobre confiança |
| `BonusRotina.tsx` | Header, footer, conteúdo |
| `BonusTonalidades.tsx` | Header, footer |
| `BonusMusicas.tsx` | Header, footer |
| `OrderBumpDigitacao.tsx` | Header, footer |
| `OrderBumpTransposicao.tsx` | Header, footer |
| `OrderBumpManutencao.tsx` | Header, footer |
| `pdfGenerators.ts` | Watermarks, footers nos PDFs |
| `WhatsAppButton.tsx` | Mensagem padrão |
| `PlaybackSamples.tsx` | Se houver referência |

#### 3. Logo
- O usuário disse que tem logo pronto — **precisamos que envie o arquivo** para substituir `src/assets/logo-clube-sax.webp`
- Enquanto isso, usaremos o nome "SaxPlay" estilizado em texto como placeholder

#### 4. CSS e Tailwind
- Atualizar `src/index.css`: novas variáveis `--primary`, `--cta`, `--gold`, gradientes
- Atualizar `tailwind.config.ts`: cores correspondentes
- Atualizar classes `gradient-cta`, `shadow-cta` para a nova paleta

#### 5. Rename do asset
- `src/assets/logo-clube-sax.webp` → referências atualizadas para o novo logo quando enviado

---

### FASE 2 — App do Acervo (roadmap para próximas iterações)

Baseado no relatório, o app web será acessado por link direto com uma verificação simples (captcha ou código) antes de entrar. Os arquivos virão do Google Drive.

**Funcionalidades da v1:**
- Rota `/acervo` — página principal do app
- Tela de verificação simples (reCAPTCHA ou código de acesso) antes de entrar
- Biblioteca com busca por nome, filtro por gênero (Pop, MPB, Gospel, Rock, Jazz, etc.)
- Visualizador de PDF embutido (partituras)
- Player de áudio integrado (playbacks)
- Botão de download para cada arquivo
- Integração com Google Drive API para listar e servir os arquivos
- Interface super simples e intuitiva para público leigo/idoso (botões grandes, fontes grandes)

**Isso requer:**
- Google Drive API key (será configurada via edge function)
- Estrutura de pastas organizada no Drive
- Lovable Cloud habilitado para edge functions

> A Fase 2 será planejada em detalhe após o rebranding estar completo e o logo enviado.

---

### Implementação agora (Fase 1)

**Arquivos a editar:**
- `src/index.css` — nova paleta de cores (dourado + navy)
- `tailwind.config.ts` — cores atualizadas
- `index.html` — SEO, OG tags, schema
- `src/components/funnel/SalesPage.tsx` — textos + logo placeholder
- `src/components/funnel/FAQ.tsx` — texto
- `src/components/funnel/WhatsAppButton.tsx` — texto
- `src/components/funnel/PlaybackSamples.tsx` — se houver referência
- `src/pages/BonusRotina.tsx` — textos
- `src/pages/BonusTonalidades.tsx` — textos
- `src/pages/BonusMusicas.tsx` — textos
- `src/pages/OrderBumpDigitacao.tsx` — textos
- `src/pages/OrderBumpTransposicao.tsx` — textos
- `src/pages/OrderBumpManutencao.tsx` — textos
- `src/lib/pdfGenerators.ts` — watermarks e footers

**Importante:** Envie o logo do SaxPlay para que eu possa incluí-lo. Enquanto isso, posso avançar com todo o rebranding de textos e cores.

