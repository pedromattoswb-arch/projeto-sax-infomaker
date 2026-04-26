import { ArrowLeft, Download, CheckCircle2, Wrench, AlertTriangle, CalendarCheck, Music, Printer, BookOpen, Shield, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logoSaxplay from "@/assets/logo-saxplay.png";
import { generateManutencaoPDF } from "@/lib/pdfGenerators";
import useNoIndex from "@/hooks/useNoIndex";

/* ─── DADOS ─── */

const cuidadosDiarios = [
  {
    acao: "Passar o swab (flanela) interno",
    como: "Insira o swab pelo sino e puxe pela campana. Repita 2-3x até sair seco.",
    porque: "Remove 100% da umidade que causa oxidação e mau cheiro. É o cuidado #1.",
  },
  {
    acao: "Secar a boquilha",
    como: "Remova a boquilha do tudel. Passe pano macio por dentro e por fora. Seque a abraçadeira também.",
    porque: "Umidade na boquilha cria depósitos minerais que alteram o som ao longo do tempo.",
  },
  {
    acao: "Remover e secar a palheta",
    como: "Tire a palheta da boquilha. Seque com pano ou papel. Guarde no protetor (reed guard).",
    porque: "Palheta guardada molhada empenha, cria mofo e perde a vida útil pela metade.",
  },
  {
    acao: "Limpar o exterior do sax",
    como: "Passe pano de microfibra no corpo, chaves e campana. Sem produtos químicos.",
    porque: "Suor das mãos é ácido e corrói o acabamento laqueado ou prateado.",
  },
  {
    acao: "Guardar corretamente no case",
    como: "Coloque o sax no case com as chaves para cima. Feche o case completamente.",
    porque: "Case aberto acumula poeira nas sapatilhas. Sax apoiado nas chaves desregula a mecânica.",
  },
];

const cuidadosSemanais = [
  {
    acao: "Limpar as sapatilhas",
    como: "Use papel de seda ou papel próprio para sapatilhas. Pressione a chave sobre o papel e puxe suavemente. Repita nas sapatilhas maiores.",
    porque: "Sapatilhas grudadas = notas que não respondem. É a causa #1 de visita ao luthier.",
  },
  {
    acao: "Verificar folgas nas chaves",
    como: "Pressione cada chave individualmente. Se alguma tem 'jogo' lateral ou faz barulho metálico, anote.",
    porque: "Folga nas chaves = ar escapando = notas falhando, especialmente no grave.",
  },
  {
    acao: "Lubrificar as articulações",
    como: "Aplique 1 gota de óleo fino para instrumentos em cada articulação de chave (onde o metal gira). Use conta-gotas ou agulha.",
    porque: "Chaves sem lubrificação ficam duras e fazem barulho. O óleo previne desgaste do metal.",
  },
  {
    acao: "Teste cromático completo",
    como: "Toque todas as notas do Sib grave ao Fá# agudo, uma por uma, em dinâmica piano (p).",
    porque: "Notas que falham em piano revelam vazamentos que passam despercebidos tocando forte.",
  },
];

const cuidadosMensais = [
  {
    acao: "Inspecionar todas as cortiças",
    como: "Olhe cada cortiça do sax (são muitas). Procure rachaduras, ressecamento ou cortiças soltas/faltando.",
    porque: "Cortiça gasta = chave sem vedação = vazamento = nota falha. Troca é barata mas essencial.",
  },
  {
    acao: "Verificar a cortiça do tudel",
    como: "Encaixe a boquilha. Deve ter resistência leve e firme. Se fica frouxa ou cai, precisa trocar.",
    porque: "Boquilha solta desafina e pode cair durante performance. Troca custa R$15-30.",
  },
  {
    acao: "Teste de vazamento (método do papel)",
    como: "Feche todas as chaves. Coloque uma tira de papel sob uma sapatilha, feche a chave e puxe. Se sai sem resistência, há vazamento.",
    porque: "Detecta vazamentos antes que afetem seu som. Previne idas desnecessárias ao luthier.",
  },
  {
    acao: "Verificar feltros e cortiças de batente",
    como: "Os pequenos feltros e cortiças que limitam o movimento das chaves. Se achatados, a regulagem muda.",
    porque: "Feltros achatados = chaves abrindo demais ou de menos = afinação comprometida.",
  },
  {
    acao: "Limpar o interior do tudel",
    como: "Use escova flexível específica para tudel. Passe suavemente por dentro, sem forçar.",
    porque: "Depósitos no tudel afetam o fluxo de ar e a resposta do instrumento.",
  },
];

const sinaisAlerta = [
  {
    sinal: "Notas graves não saem ou saem fracas",
    gravidade: "🔴 Alta",
    causa: "Sapatilha com vazamento, descolada ou ressecada",
    acao: "Leve ao luthier. NÃO tente colar com Super Bonder — a cola comum danifica a sapatilha e a chaminé.",
    custoEstimado: "R$ 30-80 por sapatilha",
  },
  {
    sinal: "Barulho metálico ao tocar certas notas",
    gravidade: "🟡 Média",
    causa: "Parafuso de regulagem solto ou mola desencaixada",
    acao: "Luthier resolve em 5-10 minutos. Se for parafuso visível, você pode tentar apertar com chave pequena (sem forçar).",
    custoEstimado: "R$ 20-50 (ajuste simples)",
  },
  {
    sinal: "Boquilha não encaixa ou fica solta no tudel",
    gravidade: "🟡 Média",
    causa: "Cortiça do tudel gasta pelo tempo e uso",
    acao: "Troca de cortiça — serviço simples e barato. Enquanto isso, use fita veda-rosca como emergência temporária.",
    custoEstimado: "R$ 15-30",
  },
  {
    sinal: "Chave travada ou muito dura de pressionar",
    gravidade: "🟡 Média",
    causa: "Falta de lubrificação, sujeira na articulação ou mola muito tensa",
    acao: "Tente lubrificar com 1 gota de óleo de chaves. Se persistir, luthier.",
    custoEstimado: "R$ 20-40",
  },
  {
    sinal: "Afinação muito instável (não segura o tom)",
    gravidade: "🟡 Média",
    causa: "Múltiplas causas: sapatilhas irregulares, boquilha gasta, palheta ruim ou embocadura",
    acao: "Teste primeiro com palheta nova. Depois verifique a boquilha. Se persistir, pode ser regulagem geral.",
    custoEstimado: "R$ 100-250 (regulagem geral)",
  },
  {
    sinal: "Cheiro forte ou mofo no case",
    gravidade: "🟢 Baixa",
    causa: "Umidade acumulada por falta de secagem + case sempre fechado",
    acao: "Lave o interior do case com pano úmido + bicarbonato. Deixe aberto 24h. Coloque sachê de sílica gel dentro.",
    custoEstimado: "R$ 0 (manutenção caseira)",
  },
];

const guiaPalhetas = [
  {
    titulo: "📏 Como Escolher a Força (Número)",
    descricao: "A força da palheta depende do seu nível E da abertura da boquilha.",
    itens: [
      { texto: "Iniciante (0-1 ano): palhetas 1.5 a 2", detalhe: "Mais fáceis de emitir som. Permitem foco na embocadura." },
      { texto: "Intermediário (1-3 anos): palhetas 2.5 a 3", detalhe: "Melhor controle de dinâmica e timbre mais rico." },
      { texto: "Avançado (3+ anos): palhetas 3 a 3.5+", detalhe: "Mais projeção, corpo e controle. Exige embocadura forte." },
      { texto: "Boquilha mais aberta = palheta mais macia", detalhe: "Ex: boquilha abertura 7 pede palheta 2-2.5. Abertura 5 pede 3-3.5." },
    ],
  },
  {
    titulo: "🌊 Como Amaciar Palhetas Novas",
    descricao: "Palheta nova precisa ser 'amaciada' para durar mais e responder melhor.",
    itens: [
      { texto: "Dia 1: toque apenas 5 minutos", detalhe: "Molhe a palheta 30 segundos antes, toque e guarde." },
      { texto: "Dia 2: toque 10 minutos", detalhe: "A fibra da palheta está se adaptando à umidade." },
      { texto: "Dia 3-4: aumente para 15-20 min", detalhe: "A palheta já começa a 'abrir' e mostrar seu som real." },
      { texto: "Dia 5+: use normalmente", detalhe: "A palheta está amaciada. Vida útil maximizada." },
      { texto: "NUNCA toque uma palheta nova por 1 hora direto", detalhe: "Isso satura as fibras e reduz a vida útil pela metade." },
    ],
  },
  {
    titulo: "⏰ Quanto Tempo Dura Cada Palheta",
    descricao: "Depende da frequência de uso e dos cuidados.",
    itens: [
      { texto: "Com uso diário (1-2h): 2 a 4 semanas", detalhe: "Rotacione entre 3-4 palhetas para durar mais." },
      { texto: "Com uso esporádico (2-3x/semana): 4 a 8 semanas", detalhe: "Seque sempre após o uso." },
      { texto: "Hora de descartar: som fica 'abafado' ou 'arenoso'", detalhe: "Ou quando a ponta racha, descola ou fica transparente." },
      { texto: "Palhetas sintéticas duram 3-6 meses", detalhe: "Custam mais (R$80-150) mas compensam no longo prazo." },
    ],
  },
  {
    titulo: "🏷️ Comparativo de Marcas",
    descricao: "As marcas mais populares entre saxofonistas brasileiros.",
    itens: [
      { texto: "Vandoren Tradicional (caixa azul)", detalhe: "A mais clássica. Som equilibrado, consistente. Boa pra tudo." },
      { texto: "Vandoren Java (caixa verde)", detalhe: "Ideal para jazz, pop e MPB. Som mais brilhante e flexível." },
      { texto: "Vandoren V12 (caixa cinza)", detalhe: "Som mais escuro e aveludado. Ótima para erudito e bossa." },
      { texto: "D'Addario Select Jazz", detalhe: "Excelente para improvisação. Resposta rápida, corte preciso." },
      { texto: "Rico Royal / Rico Select Jazz", detalhe: "Boa custo-benefício. Ideal para iniciantes e intermediários." },
      { texto: "Légère Signature (sintética)", detalhe: "Premium sintética. Não precisa molhar. Consistência perfeita. Dura meses." },
    ],
  },
];

const economiaEstimada = [
  { item: "Sapatilha grudenta (visita ao luthier)", semCuidado: "R$ 50-80 a cada 2 meses", comCuidado: "R$ 0 (limpeza semanal previne)" },
  { item: "Regulagem geral (desregulagem por mau uso)", semCuidado: "R$ 200-350 a cada 6 meses", comCuidado: "R$ 200-350 a cada 2 anos" },
  { item: "Troca de sapatilhas (ressecamento)", semCuidado: "R$ 300-600 por ano", comCuidado: "R$ 100-200 por ano" },
  { item: "Palhetas desperdiçadas", semCuidado: "R$ 40-60/mês", comCuidado: "R$ 20-35/mês (rotação + amaciamento)" },
];

/* ─── COMPONENTES ─── */

const CollapsibleSection = ({ titulo, emoji, defaultOpen = true, children }: { titulo: string; emoji: string; defaultOpen?: boolean; children: React.ReactNode }) => {
  const [aberto, setAberto] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-lg md:text-xl font-bold font-heading text-left">{titulo}</h2>
        </div>
        {aberto ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {aberto && <div className="px-5 md:px-6 pb-5 md:pb-6">{children}</div>}
    </div>
  );
};

const CuidadoCard = ({ item }: { item: { acao: string; como: string; porque: string } }) => (
  <div className="rounded-xl border border-border p-4 hover:bg-muted/10 transition-colors">
    <h3 className="font-bold font-heading text-sm text-foreground mb-2 flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      {item.acao}
    </h3>
    <div className="ml-6 space-y-1.5">
      <p className="text-xs font-body text-foreground">
        <strong className="text-muted-foreground">Como:</strong> {item.como}
      </p>
      <p className="text-xs font-body text-primary/80 italic">
        💡 Por quê: {item.porque}
      </p>
    </div>
  </div>
);

/* ─── PÁGINA ─── */

const OrderBumpManutencao = () => {
  useNoIndex();
  return (
    <div className="min-h-screen bg-background">
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <img src={logoSaxplay} alt="ClubedoSax" className="h-6 w-auto" />
        </div>
      </header>

      <main className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Wrench className="w-10 h-10 text-white" />
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              GUIA PROFISSIONAL • 22+ PÁGINAS
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Checklist de Manutenção do Sax
            </h1>
            <p className="text-lg md:text-xl font-heading font-bold text-primary mb-2">
              + Guia Completo de Palhetas
            </p>
            <p className="text-muted-foreground font-body text-base max-w-2xl mx-auto">
              Seu sax dura 10x mais com os cuidados certos. O guia que evita consertos caros e ensina tudo sobre palhetas.
            </p>
          </div>

          {/* O que está incluído */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
            <h3 className="font-bold font-heading text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              O que está incluído neste guia:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "5 cuidados diários",
                "4 cuidados semanais",
                "5 cuidados mensais",
                "6 sinais de alerta",
                "Guia completo de palhetas",
                "Comparativo de marcas",
                "Checklist imprimível",
                "Tabela de economia",
                "PDF para imprimir",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-body text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-700 rounded-2xl p-6 text-center mb-10 shadow-lg shadow-emerald-500/15">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Printer className="w-5 h-5 text-white/80" />
              <h3 className="text-white font-bold font-heading text-lg">Baixar Guia Completo em PDF</h3>
            </div>
            <p className="text-white/70 text-sm font-body mb-4">22+ páginas • Checklist imprimível • Guia de palhetas • Tabela de economia</p>
            <button
              onClick={generateManutencaoPDF}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-5 h-5" />
              BAIXAR PDF COMPLETO
            </button>
          </div>

          {/* Checklist Visual Imprimível */}
          <div className="bg-card rounded-2xl border-2 border-dashed border-primary/30 p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-6 h-6 text-primary" />
                <h2 className="text-lg md:text-xl font-bold font-heading">Checklist Imprimível</h2>
              </div>
              <span className="text-xs text-muted-foreground font-body">🖨️ Imprima esta seção</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { freq: "✅ DIÁRIO", cor: "border-green-500/40 bg-green-500/5", items: ["Swab interno (2-3x)", "Secar boquilha", "Remover e secar palheta", "Limpar exterior", "Guardar no case fechado"] },
                { freq: "✅ SEMANAL", cor: "border-blue-500/40 bg-blue-500/5", items: ["Limpar sapatilhas (papel)", "Verificar folgas nas chaves", "Lubrificar articulações", "Teste cromático completo"] },
                { freq: "✅ MENSAL", cor: "border-amber-500/40 bg-amber-500/5", items: ["Inspecionar cortiças", "Testar vazamentos", "Verificar feltros", "Limpar tudel", "Cortiça do bocal ok?"] },
              ].map((group, i) => (
                <div key={i} className={`rounded-xl p-4 border ${group.cor}`}>
                  <span className="font-bold font-heading text-xs block mb-3">{group.freq}</span>
                  <ul className="space-y-2.5">
                    {group.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-xs font-body text-foreground">
                        <div className="w-4 h-4 rounded border-2 border-border shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Cuidados Diários */}
          <div className="space-y-4 mb-4">
            <CollapsibleSection titulo="Cuidados Diários — 5 Minutos que Salvam seu Sax" emoji="🟢">
              <p className="text-sm text-muted-foreground font-body mb-4">
                Esses 5 passos levam menos de 5 minutos e previnem 80% dos problemas que levam saxofonistas ao luthier.
              </p>
              <div className="space-y-3">
                {cuidadosDiarios.map((item, i) => <CuidadoCard key={i} item={item} />)}
              </div>
            </CollapsibleSection>
          </div>

          {/* Cuidados Semanais */}
          <div className="space-y-4 mb-4">
            <CollapsibleSection titulo="Cuidados Semanais — Manutenção Preventiva" emoji="🔵">
              <p className="text-sm text-muted-foreground font-body mb-4">
                Uma vez por semana, dedique 15 minutos para estes cuidados. Previnem visitas desnecessárias ao luthier.
              </p>
              <div className="space-y-3">
                {cuidadosSemanais.map((item, i) => <CuidadoCard key={i} item={item} />)}
              </div>
            </CollapsibleSection>
          </div>

          {/* Cuidados Mensais */}
          <div className="space-y-4 mb-4">
            <CollapsibleSection titulo="Cuidados Mensais — Inspeção Completa" emoji="🟡">
              <p className="text-sm text-muted-foreground font-body mb-4">
                Uma vez por mês, faça uma inspeção mais detalhada. Detecte problemas cedo, antes que fiquem caros.
              </p>
              <div className="space-y-3">
                {cuidadosMensais.map((item, i) => <CuidadoCard key={i} item={item} />)}
              </div>
            </CollapsibleSection>
          </div>

          {/* Sinais de Alerta */}
          <div className="space-y-4 mb-4">
            <CollapsibleSection titulo="Sinais de Alerta — Quando Procurar o Luthier" emoji="⚠️">
              <p className="text-sm text-muted-foreground font-body mb-4">
                Reconheça esses sinais cedo. Quanto antes resolver, mais barato e rápido o conserto.
              </p>
              <div className="space-y-3">
                {sinaisAlerta.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold font-heading text-sm text-foreground">{item.sinal}</h3>
                      <span className="text-xs font-heading shrink-0 ml-2">{item.gravidade}</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-body">
                      <p><strong className="text-muted-foreground">Causa provável:</strong> {item.causa}</p>
                      <p><strong className="text-muted-foreground">O que fazer:</strong> {item.acao}</p>
                      <p className="text-primary/80 italic"><strong>💰 Custo estimado:</strong> {item.custoEstimado}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Guia de Palhetas */}
          <div className="space-y-4 mb-4">
            <CollapsibleSection titulo="Guia Completo de Palhetas" emoji="🎵">
              <p className="text-sm text-muted-foreground font-body mb-4">
                A palheta é o item mais importante do seu setup (depois do sax). Escolher, amaciar e cuidar corretamente faz toda a diferença no som e no bolso.
              </p>
              <div className="space-y-5">
                {guiaPalhetas.map((sec, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <h3 className="font-bold font-heading text-sm mb-1">{sec.titulo}</h3>
                    <p className="text-xs text-muted-foreground font-body mb-3">{sec.descricao}</p>
                    <div className="space-y-2.5">
                      {sec.itens.map((item, j) => (
                        <div key={j} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-body text-foreground font-semibold">{item.texto}</p>
                            <p className="text-xs font-body text-muted-foreground">{item.detalhe}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Tabela de Economia */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold font-heading">Quanto Você Economiza com Este Guia</h2>
                <p className="text-xs text-muted-foreground font-body">Comparativo real de custos com e sem manutenção preventiva</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left py-3 px-3 font-heading text-xs text-muted-foreground border-b border-border">Problema</th>
                    <th className="text-left py-3 px-3 font-heading text-xs text-red-400 border-b border-border">❌ Sem Cuidado</th>
                    <th className="text-left py-3 px-3 font-heading text-xs text-green-400 border-b border-border">✅ Com Este Guia</th>
                  </tr>
                </thead>
                <tbody>
                  {economiaEstimada.map((row, i) => (
                    <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-muted/10' : ''}`}>
                      <td className="py-2.5 px-3 font-bold font-heading text-xs">{row.item}</td>
                      <td className="py-2.5 px-3 font-body text-xs text-red-400">{row.semCuidado}</td>
                      <td className="py-2.5 px-3 font-body text-xs text-green-400">{row.comCuidado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 bg-primary/5 border border-primary/15 rounded-xl p-4">
              <p className="text-xs font-body text-foreground">
                <strong>Economia estimada:</strong> R$ 500 a R$ 1.000 por ano seguindo este checklist. O guia se paga na primeira semana.
              </p>
            </div>
          </div>

          {/* Dica final */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold font-heading mb-3">💎 Regra de Ouro</h2>
            <p className="text-sm font-body text-foreground mb-2">
              <strong>5 minutos de cuidado após cada sessão economizam horas no luthier e centenas de reais por ano.</strong>
            </p>
            <p className="text-sm font-body text-foreground">
              A manutenção preventiva é o segredo dos saxofonistas que mantêm o instrumento tocando como novo por décadas. Imprima o checklist, cole no seu espaço de estudo e transforme em hábito.
            </p>
          </div>

          {/* Bottom Download CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={generateManutencaoPDF}
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              BAIXAR GUIA COMPLETO EM PDF (22+ PÁG)
            </button>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Checklist + Guia de Palhetas + Tabela de Economia
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 px-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} ClubedoSax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default OrderBumpManutencao;
