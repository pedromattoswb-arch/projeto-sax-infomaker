import { Music } from "lucide-react";

const catalog = [
  { emoji: "🎤", name: "Pop", count: 25, highlights: ["Shape of You", "Blinding Lights", "Someone Like You", "All of Me"] },
  { emoji: "📻", name: "Flashback", count: 25, highlights: ["Careless Whisper", "My Heart Will Go On", "Take On Me", "November Rain"] },
  { emoji: "🇧🇷", name: "MPB", count: 25, highlights: ["Garota de Ipanema", "Carinhoso", "Águas de Março", "Evidências"] },
  { emoji: "🎸", name: "Rock", count: 25, highlights: ["Bohemian Rhapsody", "Hotel California", "Baker Street", "Nothing Else Matters"] },
  { emoji: "🙏", name: "Gospel", count: 25, highlights: ["Quão Grande É o Meu Deus", "Oceanos", "Bondade de Deus", "Harpa Cristã"] },
  { emoji: "🎷", name: "Jazz", count: 25, highlights: ["Take Five", "So What", "Autumn Leaves", "Fly Me to the Moon"] },
  { emoji: "🎵", name: "Blues", count: 20, highlights: ["The Thrill Is Gone", "Feeling Good", "At Last", "What a Wonderful World"] },
  { emoji: "🥁", name: "Samba", count: 20, highlights: ["Aquarela do Brasil", "País Tropical", "Deixa a Vida Me Levar", "As Rosas Não Falam"] },
];

const SongCatalog = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 section-alt">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
            🎵 ACERVO REAL — VEJA O QUE VOCÊ VAI TOCAR
          </span>
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
            +2.000 Partituras Organizadas Por Gênero
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base">
            De clássicos internacionais a sucessos brasileiros — tudo pronto para tocar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {catalog.map((cat) => (
            <div
              key={cat.name}
              className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <h3 className="font-bold font-heading text-sm">{cat.name}</h3>
                  <span className="text-xs text-primary font-semibold font-body">{cat.count}+ músicas</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {cat.highlights.map((song, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-xs font-body text-muted-foreground break-words">{song}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-body">
          Isso é apenas uma <strong>amostra</strong>. O acervo completo tem <strong className="text-primary">+2.000 partituras</strong> — e cresce todo mês.
        </p>
      </div>
    </section>
  );
};

export default SongCatalog;
