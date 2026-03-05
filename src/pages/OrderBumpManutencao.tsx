import { ArrowLeft, Download, CheckCircle2, Wrench, Shield, AlertTriangle, CalendarCheck, Music } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-clube-sax.webp";

const cuidadosDiarios = [
  "Passe o swab (flanela) por dentro do corpo do sax após cada uso — remove umidade e previne oxidação",
  "Seque a boquilha por dentro e por fora com pano macio",
  "Remova a palheta da boquilha e seque-a — nunca guarde molhada",
  "Guarde a palheta no protetor (reed guard) — evita empenar",
  "Limpe o bocal com escova específica se possível",
  "Guarde o sax no case com as chaves para cima — nunca apoie sobre as chaves",
  "Feche o case completamente para evitar poeira e umidade",
];

const cuidadosSemanais = [
  "Limpe as sapatilhas com papel absorvente fino (papel de seda ou papel próprio para sapatilhas)",
  "Verifique se alguma chave está com folga ou barulho metálico",
  "Passe pano de microfibra no corpo externo para remover marcas de dedos e suor",
  "Verifique o aperto dos parafusos de regulagem (sem apertar demais)",
  "Lubrifique as hastes com óleo fino para chaves (1 gota por articulação)",
  "Teste todas as notas cromaticamente — se alguma falha, pode indicar sapatilha descolando",
];

const cuidadosMensais = [
  "Inspecione todas as cortiças — se estiverem ressecadas, rachadas ou soltas, leve ao luthier",
  "Verifique a cortiça do tudel (encaixe da boquilha) — deve estar firme e sem folga",
  "Teste vazamentos: toque notas graves piano (p) — se falharem, há vazamento de sapatilha",
  "Verifique os feltros das chaves — se estiverem achatados, afetam a regulagem",
  "Limpe o interior do tudel com escova flexível",
  "Confira a mola de oitava — se a nota de oitava atrasa, a mola pode precisar de ajuste",
];

const sinaisAlerta = [
  {
    sinal: "Nota grave não sai ou sai fraca",
    causa: "Sapatilha com vazamento ou descolada",
    acao: "Leve ao luthier — NÃO tente colar sozinho",
  },
  {
    sinal: "Barulho metálico ao tocar",
    causa: "Parafuso solto ou mola desencaixada",
    acao: "Luthier pode resolver em minutos",
  },
  {
    sinal: "Boquilha não encaixa ou fica solta",
    causa: "Cortiça do tudel gasta",
    acao: "Troca de cortiça — serviço simples e barato",
  },
  {
    sinal: "Chave travada ou muito dura",
    causa: "Falta de lubrificação ou sujeira na articulação",
    acao: "Tente lubrificar; se persistir, luthier",
  },
  {
    sinal: "Afinação muito instável",
    causa: "Sapatilhas irregulares, boquilha gasta ou palheta ruim",
    acao: "Descarte primeiro a palheta, depois verifique o setup",
  },
  {
    sinal: "Cheiro forte ou mofo no case",
    causa: "Umidade acumulada + falta de ventilação",
    acao: "Limpe o case, use sílica gel, deixe aberto para arejar",
  },
];

const guiaPalhetas = [
  {
    titulo: "Como escolher a força (número)",
    itens: [
      "Iniciante: palhetas 1.5 a 2 — mais fáceis de emitir som",
      "Intermediário: palhetas 2.5 a 3 — melhor controle e timbre",
      "Avançado: palhetas 3 a 3.5 — mais projeção e corpo no som",
      "A força ideal depende da boquilha — abertura maior = palheta mais macia",
    ],
  },
  {
    titulo: "Como amaciar palhetas novas",
    itens: [
      "Dia 1: toque apenas 5 minutos e guarde",
      "Dia 2: toque 10 minutos",
      "Dia 3-4: aumente para 15-20 minutos",
      "Dia 5+: use normalmente — a palheta está 'amaciada'",
      "Nunca toque uma palheta nova por 1 hora direto — ela vai durar menos",
    ],
  },
  {
    titulo: "Quanto tempo dura cada palheta",
    itens: [
      "Com uso diário: 2 a 4 semanas em média",
      "Rotacione entre 3-4 palhetas — duram mais e mantêm consistência",
      "Descarte quando: som fica 'abafado', difícil de controlar ou a ponta racha",
      "Palhetas sintéticas (Légère, Fiberreed) duram meses mas custam mais",
    ],
  },
  {
    titulo: "Comparativo de marcas populares",
    itens: [
      "Vandoren Tradicional: a mais clássica, som equilibrado e consistente",
      "Vandoren Java: ideal para jazz/pop, som mais brilhante e flexível",
      "D'Addario Select Jazz: excelente para improvisação, resposta rápida",
      "Rico Royal: boa custo-benefício para iniciantes",
      "Légère Signature: sintética premium, não precisa molhar, dura muito",
    ],
  },
];

const checklistItems = [
  { freq: "Diário", cor: "bg-green-500/10 text-green-600", items: ["Swab interno", "Secar boquilha", "Secar palheta", "Guardar no case"] },
  { freq: "Semanal", cor: "bg-blue-500/10 text-blue-600", items: ["Limpar sapatilhas", "Verificar chaves", "Lubrificar hastes", "Testar notas"] },
  { freq: "Mensal", cor: "bg-amber-500/10 text-amber-600", items: ["Inspecionar cortiças", "Testar vazamentos", "Verificar feltros", "Limpar tudel"] },
];

const OrderBumpManutencao = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <img src={logo} alt="Clube do Sax Brasil" className="h-8 w-auto" />
        </div>
      </header>

      <main className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Wrench className="w-10 h-10 text-white" />
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              ORDER BUMP EXCLUSIVO
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Checklist de Manutenção do Sax
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto">
              Seu sax dura 10x mais com os cuidados certos. O guia que evita consertos caros.
            </p>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-700 rounded-2xl p-6 text-center mb-10 shadow-lg">
            <h3 className="text-white font-bold font-heading text-lg mb-2">📥 Baixar Checklist + Guia de Palhetas</h3>
            <p className="text-white/80 text-sm font-body mb-4">Imprima o checklist e cole no seu espaço de estudo</p>
            <a
              href="#download"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Download className="w-5 h-5" />
              BAIXAR PDF GRATUITO
            </a>
          </div>

          {/* Checklist Visual */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Checklist Rápido — Imprima e Acompanhe</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {checklistItems.map((group, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-heading mb-3 ${group.cor}`}>
                    {group.freq}
                  </span>
                  <ul className="space-y-2">
                    {group.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs font-body text-foreground">
                        <div className="w-4 h-4 rounded border border-border shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Cuidados Diários */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <span className="text-lg">🟢</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Cuidados Diários</h2>
            </div>
            <ul className="space-y-2.5">
              {cuidadosDiarios.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-body text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuidados Semanais */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <span className="text-lg">🔵</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Cuidados Semanais</h2>
            </div>
            <ul className="space-y-2.5">
              {cuidadosSemanais.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-body text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuidados Mensais */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <span className="text-lg">🟡</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Cuidados Mensais</h2>
            </div>
            <ul className="space-y-2.5">
              {cuidadosMensais.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-body text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sinais de Alerta */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Sinais de Alerta — Quando Levar ao Luthier</h2>
            </div>
            <div className="space-y-3">
              {sinaisAlerta.map((item, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border">
                  <h3 className="font-bold font-heading text-sm text-foreground mb-1">⚠️ {item.sinal}</h3>
                  <p className="text-xs font-body text-muted-foreground mb-1"><strong>Causa provável:</strong> {item.causa}</p>
                  <p className="text-xs font-body text-foreground"><strong>O que fazer:</strong> {item.acao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Guia de Palhetas */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading">Guia Completo de Palhetas</h2>
            </div>
            <div className="space-y-6">
              {guiaPalhetas.map((sec, i) => (
                <div key={i}>
                  <h3 className="font-bold font-heading text-sm mb-2">{sec.titulo}</h3>
                  <ul className="space-y-1.5">
                    {sec.itens.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm font-body text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Dica Final */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold font-heading mb-3">💡 Regra de Ouro</h2>
            <p className="text-sm font-body text-foreground">
              <strong>5 minutos de cuidado após cada sessão economizam horas no luthier e centenas de reais por ano.</strong> A manutenção preventiva é o segredo dos saxofonistas que mantêm o instrumento tocando como novo por décadas.
            </p>
          </div>

          {/* Bottom Download CTA */}
          <div className="mt-10 text-center">
            <a
              href="#download"
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5" />
              BAIXAR CHECKLIST + GUIA DE PALHETAS
            </a>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Imprima e economize centenas de reais em manutenção
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 px-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax Brasil. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default OrderBumpManutencao;
