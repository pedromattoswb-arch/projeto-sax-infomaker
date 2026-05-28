import { BookOpen, Map, Music2, Gift } from "lucide-react";

const bonuses = [
  {
    icon: BookOpen,
    tag: "Bônus 1",
    title: "Guia: Rotina de Estudo para Saxofonistas",
    description:
      "Monte uma rotina de prática eficiente com aquecimento, técnica, improvisação e repertório. Do iniciante ao avançado. Disponível dentro da plataforma Clube do Sax.",
  },
  {
    icon: Map,
    tag: "Bônus 2",
    title: "Guia: Mapa de Tonalidades para Sax",
    description:
      "Referência visual completa de transposição, escalas maiores, menores e modos. Ferramenta de consulta rápida indispensável. Integrado à plataforma.",
  },
  {
    icon: Music2,
    tag: "Bônus 3",
    title: "Guia: 100 Músicas que Todo Saxofonista Precisa Saber",
    description:
      "Lista curada com nível de dificuldade, gênero e dicas de interpretação. Do clássico ao contemporâneo, do gospel ao jazz. Acessível direto na plataforma.",
  },
];

const BonusSectionV2 = () => {
  return (
    <section className="relative px-5 md:px-8 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span
            className="mg-caps inline-flex items-center gap-2 mb-4"
            style={{ color: "var(--mg-gold)" }}
          >
            <Gift className="w-4 h-4" /> Exclusivo do Plano Completo
          </span>
          <h2 className="mg-display text-3xl md:text-5xl mb-4">
            3 Bônus para <em className="mg-gold-text">acelerar</em> sua evolução
          </h2>
          <p className="text-[var(--mg-text-dim)] max-w-2xl mx-auto">
            Além das +10.000 partituras com playback, você recebe 3 guias exclusivos integrados à
            plataforma — sem custo extra.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {bonuses.map((b, i) => (
            <div
              key={i}
              className="mg-glass p-7 flex flex-col"
              style={{ borderRadius: 22, border: "1px solid rgba(212,175,55,0.25)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.35)",
                }}
              >
                <b.icon className="w-5 h-5" style={{ color: "var(--mg-gold)" }} />
              </div>
              <span
                className="mg-caps mb-3 text-[10px]"
                style={{ color: "var(--mg-gold)" }}
              >
                {b.tag}
              </span>
              <h3 className="mg-display text-lg mb-3 leading-snug">{b.title}</h3>
              <p className="text-sm text-[var(--mg-text-dim)] leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--mg-text-dim)] mt-8">
          Os 3 bônus estão <strong className="text-white">inclusos no Plano Completo</strong> e ficam
          disponíveis dentro da plataforma do Clube do Sax.
        </p>
      </div>
    </section>
  );
};

export default BonusSectionV2;
