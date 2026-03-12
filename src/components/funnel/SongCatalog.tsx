import { Music } from "lucide-react";

const catalog = [
  { emoji: "🇧🇷", name: "MPB", count: 850, highlights: ["Garota de Ipanema", "Evidências", "Águas de Março", "Carinhoso"] },
  { emoji: "🙏", name: "Gospel & Louvor", count: 780, highlights: ["Quão Grande É o Meu Deus", "Oceanos", "Bondade de Deus", "Harpa Cristã"] },
  { emoji: "🎷", name: "Jazz Standards", count: 620, highlights: ["Take Five", "So What", "Autumn Leaves", "Fly Me to the Moon"] },
  { emoji: "🎤", name: "Pop Internacional", count: 540, highlights: ["Shape of You", "Blinding Lights", "Someone Like You", "All of Me"] },
  { emoji: "🎸", name: "Rock Clássico", count: 480, highlights: ["Bohemian Rhapsody", "Hotel California", "Baker Street", "Nothing Else Matters"] },
  { emoji: "📻", name: "Flashback", count: 450, highlights: ["Careless Whisper", "My Heart Will Go On", "Take On Me", "November Rain"] },
  { emoji: "🎵", name: "Bossa Nova", count: 350, highlights: ["Chega de Saudade", "Corcovado", "Wave", "Desafinado"] },
  { emoji: "🤠", name: "Sertanejo", count: 320, highlights: ["Boate Azul", "Evidências", "Pense em Mim", "Amor Rebelde"] },
  { emoji: "🥁", name: "Samba & Pagode", count: 310, highlights: ["Aquarela do Brasil", "País Tropical", "Deixa a Vida Me Levar", "As Rosas Não Falam"] },
  { emoji: "💕", name: "Românticas", count: 280, highlights: ["Endless Love", "Unchained Melody", "Just the Way You Are", "My Way"] },
  { emoji: "🎬", name: "Trilhas de Filmes", count: 260, highlights: ["The Pink Panther", "Moon River", "Cinema Paradiso", "Hallelujah"] },
  { emoji: "🎵", name: "Blues & Soul", count: 240, highlights: ["The Thrill Is Gone", "Feeling Good", "At Last", "What a Wonderful World"] },
  { emoji: "🪗", name: "Forró & Nordeste", count: 220, highlights: ["Asa Branca", "Xote das Meninas", "Qui Nem Jiló", "Pagode Russo"] },
  { emoji: "🎄", name: "Músicas de Natal", count: 180, highlights: ["Jingle Bells", "Noite Feliz", "White Christmas", "Então É Natal"] },
  { emoji: "🎹", name: "Música Clássica", count: 170, highlights: ["Ave Maria", "Canon in D", "Clair de Lune", "Bolero de Ravel"] },
  { emoji: "💒", name: "Casamento & Eventos", count: 150, highlights: ["Canon in D", "A Thousand Years", "Perfect", "La Vie en Rose"] },
];

const SongCatalog = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 section-alt">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
            🎵 ACERVO REAL — O MAIOR DO BRASIL
          </span>
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
            +10.000 Partituras e Playbacks Organizados Por Gênero
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base">
            De clássicos internacionais a sucessos brasileiros — tudo pronto para tocar no seu sax
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
                  <span className="text-xs text-primary font-semibold font-body">{cat.count}+ arquivos</span>
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
          Isso é apenas uma <strong>amostra</strong>. O acervo completo tem <strong className="text-primary">+10.000 partituras e playbacks</strong> — e cresce todo mês.
        </p>
      </div>
    </section>
  );
};

export default SongCatalog;
