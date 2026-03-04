import { useState } from "react";
import { Music, Search, ChevronDown, ChevronUp } from "lucide-react";

const catalog: Record<string, string[]> = {
  "🎤 Pop": [
    "Shape of You – Ed Sheeran",
    "Blinding Lights – The Weeknd",
    "Someone Like You – Adele",
    "Perfect – Ed Sheeran",
    "All of Me – John Legend",
    "Stay – The Kid LAROI & Justin Bieber",
    "Thinking Out Loud – Ed Sheeran",
    "Just the Way You Are – Bruno Mars",
    "Shallow – Lady Gaga",
    "A Thousand Years – Christina Perri",
    "Hello – Adele",
    "Can't Help Falling in Love – Elvis Presley",
    "Let It Be – The Beatles",
    "Photograph – Ed Sheeran",
    "Havana – Camila Cabello",
    "Die With a Smile – Lady Gaga & Bruno Mars",
    "Señorita – Shawn Mendes & Camila Cabello",
    "Love Me Like You Do – Ellie Goulding",
    "Despacito – Luis Fonsi",
    "Night Changes – One Direction",
    "Say You Won't Let Go – James Arthur",
    "Apologize – OneRepublic",
    "Locked Out of Heaven – Bruno Mars",
    "Counting Stars – OneRepublic",
    "Rolling in the Deep – Adele",
  ],
  "📻 Flashback": [
    "Careless Whisper – George Michael",
    "Take On Me – A-ha",
    "Every Breath You Take – The Police",
    "My Heart Will Go On – Celine Dion",
    "Unchained Melody – The Righteous Brothers",
    "I Will Always Love You – Whitney Houston",
    "The Way We Were – Barbra Streisand",
    "Against All Odds – Phil Collins",
    "Right Here Waiting – Richard Marx",
    "Always – Bon Jovi",
    "Lady in Red – Chris de Burgh",
    "November Rain – Guns N' Roses",
    "Nothing's Gonna Change My Love – Glenn Medeiros",
    "Endless Love – Diana Ross & Lionel Richie",
    "Time After Time – Cyndi Lauper",
    "Total Eclipse of the Heart – Bonnie Tyler",
    "Killing Me Softly – Roberta Flack",
    "Woman in Love – Barbra Streisand",
    "How Deep Is Your Love – Bee Gees",
    "Yesterday – The Beatles",
    "Without You – Mariah Carey",
    "Hero – Mariah Carey",
    "Wind of Change – Scorpions",
    "I Just Called to Say I Love You – Stevie Wonder",
    "Sacrifice – Elton John",
  ],
  "🇧🇷 MPB": [
    "Garota de Ipanema – Tom Jobim",
    "Carinhoso – Pixinguinha",
    "Águas de Março – Tom Jobim",
    "Wave – Tom Jobim",
    "Mas Que Nada – Jorge Ben Jor",
    "Eu Sei Que Vou Te Amar – Tom Jobim",
    "Chega de Saudade – Tom Jobim & Vinícius",
    "Corcovado – Tom Jobim",
    "Insensatez – Tom Jobim",
    "Desafinado – Tom Jobim",
    "Aquarela do Brasil – Ary Barroso",
    "Construção – Chico Buarque",
    "O Que É O Que É – Gonzaguinha",
    "Anunciação – Alceu Valença",
    "Como Nossos Pais – Elis Regina",
    "Detalhes – Roberto Carlos",
    "Emoções – Roberto Carlos",
    "Evidências – Chitãozinho & Xororó",
    "Ainda Lembro – Marisa Monte",
    "Pais e Filhos – Legião Urbana",
    "Samba de Uma Nota Só – Tom Jobim",
    "Triste – Tom Jobim",
    "Dindi – Tom Jobim",
    "Coqueiro Verde – Tom Jobim",
    "Só Tinha de Ser Com Você – Tom Jobim",
  ],
  "🎸 Rock": [
    "Bohemian Rhapsody – Queen",
    "Stairway to Heaven – Led Zeppelin",
    "Hotel California – Eagles",
    "Sweet Child O' Mine – Guns N' Roses",
    "Nothing Else Matters – Metallica",
    "Imagine – John Lennon",
    "Wish You Were Here – Pink Floyd",
    "Knockin' on Heaven's Door – Bob Dylan",
    "Hallelujah – Leonard Cohen",
    "Don't Stop Believin' – Journey",
    "Comfortably Numb – Pink Floyd",
    "Dream On – Aerosmith",
    "Under Pressure – Queen & David Bowie",
    "Wonderwall – Oasis",
    "Fix You – Coldplay",
    "Clocks – Coldplay",
    "The Scientist – Coldplay",
    "With or Without You – U2",
    "Creep – Radiohead",
    "Zombie – The Cranberries",
    "Baker Street – Gerry Rafferty",
    "Money – Pink Floyd",
    "Born to Run – Bruce Springsteen",
    "Livin' on a Prayer – Bon Jovi",
    "We Will Rock You – Queen",
  ],
  "🙏 Gospel": [
    "Quão Grande É o Meu Deus",
    "Deus Cuida de Mim – Kleber Lucas",
    "Nada Além do Sangue – Fernandinho",
    "Raridade – Anderson Freire",
    "Todavia Me Alegrarei – Soraya Moraes",
    "Filho Meu – Kleber Lucas",
    "Ressuscita-me – Aline Barros",
    "Lugar Secreto – Gabriela Rocha",
    "Yeshua – Fernandinho",
    "Ninguém Explica Deus – Preto no Branco",
    "Bondade de Deus – Isaías Saad",
    "Me Atraiu – Gabriela Rocha",
    "Oceanos – Hillsong",
    "Amazing Grace",
    "Great Is Thy Faithfulness",
    "10.000 Reasons – Matt Redman",
    "Way Maker – Sinach",
    "Agnus Dei – Michael W. Smith",
    "Diante do Trono",
    "Ele É Exaltado",
    "Santo Espírito – Laura Souguellis",
    "Vim Para Adorar-te",
    "Grandioso És Tu",
    "Harpa Cristã (seleção completa no Premium)",
    "Hinos Clássicos da Igreja",
  ],
  "🎷 Jazz": [
    "Take Five – Dave Brubeck",
    "So What – Miles Davis",
    "Autumn Leaves – Joseph Kosma",
    "All The Things You Are – Jerome Kern",
    "Fly Me to the Moon – Frank Sinatra",
    "My Funny Valentine – Chet Baker",
    "Summertime – George Gershwin",
    "In a Sentimental Mood – Duke Ellington",
    "Blue in Green – Miles Davis",
    "Body and Soul – Coleman Hawkins",
    "Georgia on My Mind – Ray Charles",
    "Misty – Erroll Garner",
    "The Girl from Ipanema – Stan Getz",
    "Round Midnight – Thelonious Monk",
    "A Night in Tunisia – Dizzy Gillespie",
    "All Blues – Miles Davis",
    "Cantaloupe Island – Herbie Hancock",
    "Watermelon Man – Herbie Hancock",
    "Satin Doll – Duke Ellington",
    "Stella by Starlight – Victor Young",
    "Blue Bossa – Kenny Dorham",
    "On Green Dolphin Street",
    "Donna Lee – Charlie Parker",
    "Confirmation – Charlie Parker",
    "St. Thomas – Sonny Rollins",
  ],
  "🎵 Blues": [
    "The Thrill Is Gone – B.B. King",
    "Sweet Home Chicago – Robert Johnson",
    "Stormy Monday – T-Bone Walker",
    "Crossroads – Robert Johnson",
    "Born Under a Bad Sign – Albert King",
    "Red House – Jimi Hendrix",
    "Blues in the Night – Harold Arlen",
    "Mustang Sally – Wilson Pickett",
    "Everyday I Have the Blues – B.B. King",
    "Pride and Joy – Stevie Ray Vaughan",
    "Hoochie Coochie Man – Muddy Waters",
    "I'd Rather Go Blind – Etta James",
    "At Last – Etta James",
    "Ain't No Sunshine – Bill Withers",
    "Lean on Me – Bill Withers",
    "Feeling Good – Nina Simone",
    "Summertime – Ella Fitzgerald",
    "My Baby Just Cares for Me – Nina Simone",
    "Hit the Road Jack – Ray Charles",
    "What a Wonderful World – Louis Armstrong",
  ],
  "🥁 Samba": [
    "Aquarela do Brasil – Ary Barroso",
    "País Tropical – Jorge Ben Jor",
    "Trem das Onze – Adoniran Barbosa",
    "Samba de Verão – Marcos Valle",
    "Eu Não Existo Sem Você – Tom Jobim",
    "Tarde em Itapuã – Toquinho & Vinícius",
    "Onde Anda Você – Vinícius de Moraes",
    "Samba de Uma Nota Só – Tom Jobim",
    "Rosa Morena – Dorival Caymmi",
    "O Barquinho – Roberto Menescal",
    "Chão de Estrelas – Silvio Caldas",
    "Conversa de Botequim – Noel Rosa",
    "Com Que Roupa – Noel Rosa",
    "Feitiço da Vila – Noel Rosa",
    "Deixa a Vida Me Levar – Zeca Pagodinho",
    "Tá Vendo Aquela Lua – Exaltasamba",
    "Meu Lugar – Arlindo Cruz",
    "Preciso Me Encontrar – Cartola",
    "As Rosas Não Falam – Cartola",
    "Alguém Me Avisou – Dona Ivone Lara",
  ],
};

const SongCatalog = () => {
  const [search, setSearch] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const totalSongs = Object.values(catalog).reduce((acc, songs) => acc + songs.length, 0);

  const filteredCatalog = Object.entries(catalog).reduce(
    (acc, [category, songs]) => {
      const filtered = songs.filter((s) =>
        s.toLowerCase().includes(search.toLowerCase())
      );
      if (filtered.length > 0) acc[category] = filtered;
      return acc;
    },
    {} as Record<string, string[]>
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 section-alt">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
            🎵 CATÁLOGO DE MÚSICAS
          </span>
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
            Veja Algumas Músicas do Acervo
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base">
            Mais de <strong className="text-foreground">{totalSongs} exemplos</strong> listados abaixo — e o acervo completo tem <strong className="text-primary">+2.000 partituras</strong>
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Busque uma música..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {Object.entries(filteredCatalog).map(([category, songs]) => {
            const isExpanded = expandedCategory === category;
            const displaySongs = isExpanded ? songs : songs.slice(0, 5);

            return (
              <div
                key={category}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.split(" ")[0]}</span>
                    <div>
                      <span className="font-bold font-heading text-sm">
                        {category.split(" ").slice(1).join(" ")}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2 font-body">
                        ({songs.length} músicas listadas)
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <div className="px-5 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {displaySongs.map((song, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 py-1 text-sm font-body text-foreground"
                      >
                        <Music className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{song}</span>
                      </div>
                    ))}
                  </div>

                  {songs.length > 5 && !isExpanded && (
                    <button
                      onClick={() => toggleCategory(category)}
                      className="mt-3 text-xs text-primary font-semibold font-body hover:underline"
                    >
                      Ver todas as {songs.length} músicas →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(filteredCatalog).length === 0 && (
          <p className="text-center text-muted-foreground text-sm font-body py-8">
            Nenhuma música encontrada para "{search}"
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6 font-body">
          Esta é apenas uma <strong>amostra</strong> do acervo. O acesso completo inclui <strong className="text-primary">+2.000 partituras</strong> em todas as categorias.
        </p>
      </div>
    </section>
  );
};

export default SongCatalog;
