import { BookOpen, Map, Music } from "lucide-react";

const bonuses = [
  {
    icon: BookOpen,
    title: "Guia: Rotina de Estudo para Saxofonistas",
    description:
      "Monte uma rotina de prática eficiente com aquecimento, técnica, improvisação e repertório. Do iniciante ao avançado.",
    tag: "BÔNUS 1",
  },
  {
    icon: Map,
    title: "Guia: Mapa de Tonalidades para Sax",
    description:
      "Referência visual completa de transposição, escalas maiores, menores e modos. Ferramenta de consulta rápida indispensável.",
    tag: "BÔNUS 2",
  },
  {
    icon: Music,
    title: "Guia: 100 Músicas que Todo Saxofonista Precisa Saber",
    description:
      "Lista curada com nível de dificuldade, gênero e dicas de interpretação. Do clássico ao contemporâneo, gospel ao jazz.",
    tag: "BÔNUS 3",
  },
];

const BonusSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 section-alt">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-accent/10 text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3 border border-accent/30">
            🎁 EXCLUSIVO DO PREMIUM
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">
            3 Bônus que Vão Acelerar Sua Evolução
          </h2>
          <p className="text-foreground font-body text-base">
            Guias práticos criados para saxofonistas de qualquer nível
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="inline-block text-xs font-bold font-heading gradient-cta text-primary-foreground px-3 py-1 rounded-full mb-4">
                {bonus.tag}
              </span>
              <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center mb-4">
                <bonus.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold font-heading text-base mb-2">
                {bonus.title}
              </h3>
              <p className="text-foreground font-body text-sm leading-relaxed">
                {bonus.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-body">
          Esses 3 guias são <strong>exclusivos do plano Premium</strong> e não estão disponíveis em nenhum outro lugar.
        </p>
      </div>
    </section>
  );
};

export default BonusSection;
