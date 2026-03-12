const bonuses = [
  {
    emoji: "📖",
    title: "Guia: Rotina de Estudo para Saxofonistas",
    description:
      "Monte uma rotina de prática eficiente com aquecimento, técnica, improvisação e repertório. Do iniciante ao avançado. Disponível dentro da plataforma SaxBrasil.",
    tag: "BÔNUS 1",
    gradient: "from-emerald-600 to-teal-700",
    accent: "🎯",
  },
  {
    emoji: "🗺️",
    title: "Guia: Mapa de Tonalidades para Sax",
    description:
      "Referência visual completa de transposição, escalas maiores, menores e modos. Ferramenta de consulta rápida indispensável. Integrado à plataforma SaxBrasil.",
    tag: "BÔNUS 2",
    gradient: "from-blue-600 to-indigo-700",
    accent: "🎼",
  },
  {
    emoji: "🎵",
    title: "Guia: 100 Músicas que Todo Saxofonista Precisa Saber",
    description:
      "Lista curada com nível de dificuldade, gênero e dicas de interpretação. Do clássico ao contemporâneo, gospel ao jazz. Acessível direto na plataforma.",
    tag: "BÔNUS 3",
    gradient: "from-amber-500 to-orange-600",
    accent: "🏆",
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
            Guias práticos criados para saxofonistas de qualquer nível — todos integrados à plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
            >
              <div className={`bg-gradient-to-br ${bonus.gradient} p-8 flex flex-col items-center justify-center relative`}>
                <span className="text-5xl mb-2">{bonus.emoji}</span>
                <span className="absolute top-3 right-3 text-2xl opacity-30">{bonus.accent}</span>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 mt-2">
                  <span className="text-white text-xs font-bold font-heading">{bonus.tag}</span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold font-heading text-sm mb-2 leading-snug">
                  {bonus.title}
                </h3>
                <p className="text-muted-foreground font-body text-xs leading-relaxed">
                  {bonus.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-body">
          Esses 3 guias são <strong>exclusivos do plano Premium</strong> e estão disponíveis dentro da plataforma SaxBrasil.
        </p>
      </div>
    </section>
  );
};

export default BonusSection;
