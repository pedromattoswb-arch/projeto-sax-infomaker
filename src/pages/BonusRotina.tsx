import { ArrowLeft, Download, CheckCircle2, Clock, Target, Repeat, Music, Headphones, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { generateRotinaPDF } from "@/lib/pdfGenerators";
import logoSaxplay from "@/assets/logo-saxplay.png";
import useNoIndex from "@/hooks/useNoIndex";

const sections = [
  {
    icon: Clock,
    title: "1. Aquecimento (10–15 min)",
    items: [
      "Notas longas: Comece com Sib, Dó, Ré — toque cada nota por 8 tempos, foco em timbre e afinação",
      "Respiração diafragmática: Inspire 4 tempos, segure 4, expire 8 — repita 5x",
      "Escalas cromáticas lentas: Suba e desça do Sib grave ao Fá# agudo, sem pressa",
      "Glissandos suaves entre notas vizinhas para soltar a embocadura",
    ],
  },
  {
    icon: Target,
    title: "2. Técnica (15–20 min)",
    items: [
      "Escalas maiores: Pratique 2 tonalidades por dia (ex: Segunda = Dó e Sol, Terça = Ré e Lá)",
      "Escalas menores: Natural, harmônica e melódica — alterne semanalmente",
      "Arpejos: Maior, menor, dominante e diminuto nas mesmas tonalidades",
      "Intervalos de terças e quartas sobre cada escala",
      "Exercícios de articulação: staccato, legato, acentuação — use metrônomo",
      "Padrões rítmicos: colcheias, tercinas, semicolcheias com swing e straight",
    ],
  },
  {
    icon: Music,
    title: "3. Repertório (20–30 min)",
    items: [
      "Escolha 2–3 músicas do acervo ClubedoSax por semana",
      "Dia 1: Leitura lenta, identificando passagens difíceis",
      "Dia 2: Trabalhe os trechos difíceis isoladamente, em loop",
      "Dia 3: Toque a música inteira com o playback em andamento lento",
      "Dia 4: Toque no andamento original com o playback",
      "Dia 5: Grave-se tocando e ouça criticamente",
      "Mantenha um repertório rotativo de 8–10 músicas sempre em prática",
    ],
  },
  {
    icon: Headphones,
    title: "4. Improvisação (10–15 min)",
    items: [
      "Toque sobre um backing track em tom maior — use apenas a escala pentatônica",
      "Adicione a blue note e cromatismos conforme ganhar confiança",
      "Pratique frases de 2 compassos: crie, repita, varie",
      "Copie solos de referência (Charlie Parker, Stan Getz, Cannonball Adderley)",
      "Grave seus improvisos e analise o que funcionou",
    ],
  },
  {
    icon: Repeat,
    title: "5. Revisão e Desafio Semanal",
    items: [
      "Domingo: Revise o que praticou na semana e anote progresso",
      "Escolha 1 música desafiadora acima do seu nível atual como meta semanal",
      "Alterne gêneros: uma semana jazz, outra gospel, outra pop",
      "Registre seu tempo de prática diário (meta mínima: 30 min/dia)",
      "A cada mês, grave uma performance completa para medir evolução",
    ],
  },
];

const weeklySchedule = [
  { day: "Segunda", focus: "Aquecimento + Técnica (escalas Dó/Sol) + Repertório" },
  { day: "Terça", focus: "Aquecimento + Técnica (arpejos) + Improvisação" },
  { day: "Quarta", focus: "Aquecimento + Repertório (trechos difíceis) + Leitura à primeira vista" },
  { day: "Quinta", focus: "Aquecimento + Técnica (escalas Ré/Lá) + Repertório com playback" },
  { day: "Sexta", focus: "Aquecimento + Improvisação + Gravação de repertório" },
  { day: "Sábado", focus: "Sessão livre: toque o que quiser, explore músicas novas" },
  { day: "Domingo", focus: "Revisão semanal + planejamento da próxima semana" },
];

const BonusRotina = () => {
  useNoIndex();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateRotinaPDF();
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/plano-premium-completo" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Acervo
          </Link>
          <img src={logoSaxplay} alt="ClubedoSax" className="h-6 w-auto" />
        </div>
      </header>

      <main className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">📖</span>
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              BÔNUS EXCLUSIVO PREMIUM
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              Guia: Rotina de Estudo para Saxofonistas
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto">
              Monte uma rotina de prática eficiente com aquecimento, técnica, improvisação e repertório — do iniciante ao avançado.
            </p>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-center mb-10 shadow-lg">
            <h3 className="text-white font-bold font-heading text-lg mb-2">📥 Baixar Guia Completo em PDF</h3>
            <p className="text-white/80 text-sm font-body mb-4">Salve no celular ou imprima para consultar durante seus estudos</p>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {loading ? "GERANDO PDF..." : "BAIXAR PDF GRATUITO"}
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold font-heading">{section.title}</h2>
                </div>
                <ul className="space-y-2.5">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-body text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Weekly Schedule */}
          <div className="mt-10 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold font-heading mb-4 text-center">
              📅 Sugestão de Rotina Semanal
            </h2>
            <div className="space-y-2">
              {weeklySchedule.map((day, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="font-bold font-heading text-sm text-primary w-20 shrink-0">{day.day}</span>
                  <span className="text-sm font-body text-foreground">{day.focus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-10 bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold font-heading mb-3">💡 Dicas Importantes</h2>
            <ul className="space-y-2 text-sm font-body text-foreground">
              <li>• <strong>Consistência &gt; intensidade:</strong> 30 minutos por dia são melhores que 3 horas no fim de semana</li>
              <li>• <strong>Use metrônomo SEMPRE:</strong> Comece devagar e aumente 5 BPM por dia</li>
              <li>• <strong>Grave-se:</strong> Ouvir sua performance de fora revela erros que você não percebe tocando</li>
              <li>• <strong>Varie os gêneros:</strong> Isso desenvolve versatilidade e mantém a motivação</li>
              <li>• <strong>Descanse:</strong> Se a embocadura cansar, pare. Forçar causa maus hábitos</li>
            </ul>
          </div>

          {/* Bottom Download CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {loading ? "GERANDO PDF..." : "BAIXAR GUIA EM PDF"}
            </button>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Conteúdo exclusivo para membros PreClubedoSaxSax
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 px-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} CClubedoSax Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default BonusRotina;
