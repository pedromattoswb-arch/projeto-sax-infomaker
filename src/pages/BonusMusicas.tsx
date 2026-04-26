import { ArrowLeft, Download, Star, Music, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logoClubeSax from "@/assets/logo-clubedosax.png";
import { generateMusicasPDF } from "@/lib/pdfGenerators";
import useNoIndex from "@/hooks/useNoIndex";

type Song = {
  name: string;
  artist: string;
  genre: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  tip: string;
};

const songs: Song[] = [
  // Pop/Internacional
  { name: "Careless Whisper", artist: "George Michael", genre: "Pop", difficulty: "Intermediário", tip: "O riff de sax mais famoso do mundo. Domine o vibrato no tema principal." },
  { name: "Baker Street", artist: "Gerry Rafferty", genre: "Rock", difficulty: "Intermediário", tip: "Solo icônico de sax. Trabalhe o registro agudo com potência." },
  { name: "Just the Two of Us", artist: "Grover Washington Jr.", genre: "Jazz/Pop", difficulty: "Avançado", tip: "Fraseado suave e articulação jazz. Estude os chord changes." },
  { name: "Take Five", artist: "Dave Brubeck", genre: "Jazz", difficulty: "Avançado", tip: "Compasso 5/4 — pratique com metrônomo até internalizar." },
  { name: "The Pink Panther", artist: "Henry Mancini", genre: "Jazz", difficulty: "Iniciante", tip: "Tema simples e divertido. Ótimo para treinar dinâmicas." },
  { name: "Fly Me to the Moon", artist: "Frank Sinatra", genre: "Jazz", difficulty: "Intermediário", tip: "Standards essencial. Decore a melodia e improvise sobre os changes." },
  { name: "Shape of You", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Melodia moderna e acessível. Bom para atrair público jovem." },
  { name: "Perfect", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Balada perfeita para casamentos. Foco em expressividade." },
  { name: "All of Me", artist: "John Legend", genre: "Pop", difficulty: "Iniciante", tip: "Melodia emotiva. Explore dinâmicas piano/forte." },
  { name: "Someone Like You", artist: "Adele", genre: "Pop", difficulty: "Iniciante", tip: "Balada poderosa. Trabalhe o fraseado longo sem perder ar." },
  // Jazz Essentials
  { name: "Autumn Leaves", artist: "Joseph Kosma", genre: "Jazz", difficulty: "Intermediário", tip: "O standard mais tocado. Domine em todas as tonalidades." },
  { name: "So What", artist: "Miles Davis", genre: "Jazz", difficulty: "Intermediário", tip: "Modal jazz. Use escala dórica e pense em espaço entre as notas." },
  { name: "Summertime", artist: "George Gershwin", genre: "Jazz", difficulty: "Intermediário", tip: "Melodia belíssima. Cada versão pode ser única — explore." },
  { name: "My Funny Valentine", artist: "Chet Baker", genre: "Jazz", difficulty: "Avançado", tip: "Balada jazz de referência. Foco em expressão e rubato." },
  { name: "Body and Soul", artist: "Coleman Hawkins", genre: "Jazz", difficulty: "Avançado", tip: "Estude a gravação de Hawkins — definiu o sax tenor no jazz." },
  { name: "Misty", artist: "Erroll Garner", genre: "Jazz", difficulty: "Intermediário", tip: "Melodia romântica. Ideal para shows e eventos." },
  { name: "In a Sentimental Mood", artist: "Duke Ellington", genre: "Jazz", difficulty: "Intermediário", tip: "Expressividade máxima. Cada nota conta." },
  { name: "Georgia on My Mind", artist: "Ray Charles", genre: "Jazz/Blues", difficulty: "Intermediário", tip: "Clássico atemporal. Funciona em qualquer contexto." },
  { name: "Blue Bossa", artist: "Kenny Dorham", genre: "Jazz", difficulty: "Intermediário", tip: "Bossa nova + jazz. Ótimo para praticar ii-V-I menor." },
  { name: "Cantaloupe Island", artist: "Herbie Hancock", genre: "Jazz", difficulty: "Intermediário", tip: "Groove funky. Use pentatônica e divirta-se." },
  // MPB/Brasil
  { name: "Garota de Ipanema", artist: "Tom Jobim", genre: "MPB/Bossa", difficulty: "Intermediário", tip: "O clássico brasileiro. Estude a versão de Stan Getz." },
  { name: "Carinhoso", artist: "Pixinguinha", genre: "Choro/MPB", difficulty: "Intermediário", tip: "Hino do sax brasileiro. Ornamentação é essencial." },
  { name: "Wave", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediário", tip: "Harmonia sofisticada. Decore os acordes para improvisar." },
  { name: "Mas Que Nada", artist: "Jorge Ben Jor", genre: "MPB", difficulty: "Iniciante", tip: "Energia pura. Bom para apresentações ao vivo." },
  { name: "Águas de Março", artist: "Tom Jobim", genre: "MPB", difficulty: "Intermediário", tip: "Melodia falada. Desafio rítmico interessante." },
  { name: "Eu Sei Que Vou Te Amar", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediário", tip: "Uma das mais bonitas de Jobim. Timbre quente é essencial." },
  { name: "Aquarela do Brasil", artist: "Ary Barroso", genre: "Samba", difficulty: "Intermediário", tip: "Hino nacional não-oficial. Toque com grandiosidade." },
  { name: "Chega de Saudade", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Avançado", tip: "Marco da Bossa Nova. Harmonia rica para improvisar." },
  { name: "Detalhes", artist: "Roberto Carlos", genre: "MPB", difficulty: "Iniciante", tip: "Romântica e popular. Funciona em serestas." },
  { name: "Evidências", artist: "Chitãozinho & Xororó", genre: "MPB", difficulty: "Iniciante", tip: "Hino do karaokê brasileiro. Todo mundo reconhece." },
  // Gospel
  { name: "Quão Grande É o Meu Deus", artist: "Soraya Moraes", genre: "Gospel", difficulty: "Iniciante", tip: "Hino de adoração. Simplicidade e reverência." },
  { name: "Nada Além do Sangue", artist: "Fernandinho", genre: "Gospel", difficulty: "Iniciante", tip: "Adoração intensa. Crescendo emocional é chave." },
  { name: "Amazing Grace", artist: "Tradicional", genre: "Gospel", difficulty: "Iniciante", tip: "O hino mais tocado do mundo. Explore variações." },
  { name: "Bondade de Deus", artist: "Isaías Saad", genre: "Gospel", difficulty: "Iniciante", tip: "Hit moderno da adoração. Melodia acessível." },
  { name: "Oceanos", artist: "Hillsong (Ana Nóbrega)", genre: "Gospel", difficulty: "Intermediário", tip: "Adoração profunda. Construa dinâmica ao longo da música." },
  { name: "Way Maker", artist: "Sinach", genre: "Gospel", difficulty: "Iniciante", tip: "Internacional. Melodia simples e poderosa." },
  { name: "10.000 Reasons", artist: "Matt Redman", genre: "Gospel", difficulty: "Iniciante", tip: "Louvor congregacional. Toque com suavidade." },
  { name: "Lugar Secreto", artist: "Gabriela Rocha", genre: "Gospel", difficulty: "Intermediário", tip: "Adoração intimista. Menos é mais." },
  { name: "Yeshua", artist: "Fernandinho", genre: "Gospel", difficulty: "Iniciante", tip: "Nome poderoso. Deixe a melodia falar." },
  { name: "Grandioso És Tu", artist: "Tradicional", genre: "Gospel", difficulty: "Iniciante", tip: "Clássico eterno. Perfeito para cultos." },
  // Blues/Soul
  { name: "The Thrill Is Gone", artist: "B.B. King", genre: "Blues", difficulty: "Intermediário", tip: "Blues menor. Use blue notes com intenção." },
  { name: "At Last", artist: "Etta James", genre: "Blues/Soul", difficulty: "Intermediário", tip: "Clássico romântico. Vibrato suave e sustentado." },
  { name: "Feeling Good", artist: "Nina Simone", genre: "Blues/Soul", difficulty: "Intermediário", tip: "Build dramático. Comece suave, termine potente." },
  { name: "Ain't No Sunshine", artist: "Bill Withers", genre: "Soul", difficulty: "Iniciante", tip: "Simplicidade que emociona. Menos notas, mais sentimento." },
  { name: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz/Soul", difficulty: "Iniciante", tip: "Atemporal. Toque com sinceridade." },
  // Rock/Soundtrack
  { name: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", difficulty: "Avançado", tip: "Arranjo desafiador. Divida em seções." },
  { name: "Hotel California", artist: "Eagles", genre: "Rock", difficulty: "Intermediário", tip: "Arranjo elegante no sax. Muito pedido em eventos." },
  { name: "Nothing Else Matters", artist: "Metallica", genre: "Rock", difficulty: "Intermediário", tip: "Balada rock no sax soa incrível. Explore o timbre." },
  { name: "My Heart Will Go On", artist: "Celine Dion", genre: "Soundtrack", difficulty: "Iniciante", tip: "Titanic. Tema reconhecível instantaneamente." },
  { name: "Cinema Paradiso", artist: "Ennio Morricone", genre: "Soundtrack", difficulty: "Intermediário", tip: "Obra-prima cinematográfica. Emocione o público." },
  // Samba/Choro
  { name: "País Tropical", artist: "Jorge Ben Jor", genre: "Samba", difficulty: "Iniciante", tip: "Alegre e festivo. Toque com energia." },
  { name: "Trem das Onze", artist: "Adoniran Barbosa", genre: "Samba", difficulty: "Iniciante", tip: "Clássico paulistano. Simplicidade charmosa." },
  { name: "Deixa a Vida Me Levar", artist: "Zeca Pagodinho", genre: "Samba/Pagode", difficulty: "Iniciante", tip: "Hit de roda de samba. Todo mundo canta junto." },
  { name: "Preciso Me Encontrar", artist: "Cartola", genre: "Samba", difficulty: "Intermediário", tip: "Poesia em forma de música. Toque com alma." },
  { name: "Brasileirinho", artist: "Waldir Azevedo", genre: "Choro", difficulty: "Avançado", tip: "Velocidade e precisão. Desafio técnico." },
  // Extras
  { name: "Besame Mucho", artist: "Consuelo Velázquez", genre: "Bolero", difficulty: "Iniciante", tip: "Romance latino. Vibrato expressivo é essencial." },
  { name: "Tequila", artist: "The Champs", genre: "Rock/Latina", difficulty: "Iniciante", tip: "Divertida e energética. Boa para animar festas." },
  { name: "Smooth Operator", artist: "Sade", genre: "Jazz/Pop", difficulty: "Intermediário", tip: "Groove suave. Estude o fraseado do sax original." },
  { name: "Yakety Sax", artist: "Boots Randolph", genre: "Country/Fun", difficulty: "Avançado", tip: "Velocidade extrema. Técnica pura." },
  { name: "Harlem Nocturne", artist: "Earle Hagen", genre: "Jazz", difficulty: "Intermediário", tip: "Noir e cinematográfico. Tom misterioso." },
  // Mais clássicos
  { name: "Sway", artist: "Dean Martin", genre: "Bolero/Pop", difficulty: "Iniciante", tip: "Dança e elegância. Perfeito para eventos sociais." },
  { name: "Moon River", artist: "Henry Mancini", genre: "Jazz/Soundtrack", difficulty: "Iniciante", tip: "Audrey Hepburn cantou. Agora é sua vez no sax." },
  { name: "New York, New York", artist: "Frank Sinatra", genre: "Jazz", difficulty: "Intermediário", tip: "Big band feel. Toque com grandiosidade." },
  { name: "Can't Help Falling in Love", artist: "Elvis Presley", genre: "Pop", difficulty: "Iniciante", tip: "Declaração de amor eterna. Suavidade total." },
  { name: "Thinking Out Loud", artist: "Ed Sheeran", genre: "Pop", difficulty: "Iniciante", tip: "Hit de casamento. Público ama." },
  { name: "A Thousand Years", artist: "Christina Perri", genre: "Pop", difficulty: "Iniciante", tip: "Crepúsculo gerou um clássico. Simples e lindo." },
  { name: "Hallelujah", artist: "Leonard Cohen", genre: "Folk/Pop", difficulty: "Iniciante", tip: "Espiritual e universal. Funciona em qualquer contexto." },
  { name: "Unchained Melody", artist: "The Righteous Brothers", genre: "Pop", difficulty: "Intermediário", tip: "Ghost. Melodia inesquecível." },
  { name: "Hello", artist: "Adele", genre: "Pop", difficulty: "Intermediário", tip: "Potência vocal traduzida no sax. Use dinâmicas." },
  { name: "Shallow", artist: "Lady Gaga", genre: "Pop", difficulty: "Intermediário", tip: "Nasce Uma Estrela. Crescendo emocional no final." },
  { name: "Yesterday", artist: "The Beatles", genre: "Pop/Rock", difficulty: "Iniciante", tip: "A música mais regravada da história. Simplicidade é tudo." },
  { name: "Imagine", artist: "John Lennon", genre: "Pop/Rock", difficulty: "Iniciante", tip: "Hino da paz. Toque com serenidade." },
  { name: "Stand By Me", artist: "Ben E. King", genre: "Soul", difficulty: "Iniciante", tip: "Linha de baixo icônica adaptada ao sax. Groove constante." },
  { name: "I Will Always Love You", artist: "Whitney Houston", genre: "Pop", difficulty: "Intermediário", tip: "The Bodyguard. Desafio de registro e potência." },
  { name: "Despacito", artist: "Luis Fonsi", genre: "Pop/Latin", difficulty: "Iniciante", tip: "Reggaeton no sax. Surpreenda o público." },
  { name: "Havana", artist: "Camila Cabello", genre: "Pop/Latin", difficulty: "Iniciante", tip: "Groove cubano moderno. Divertido de tocar." },
  { name: "Mas Que Nada", artist: "Sergio Mendes", genre: "MPB", difficulty: "Iniciante", tip: "Versão instrumental energética e festiva." },
  { name: "Insensatez", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediário", tip: "Harmonia cromática. Estude os movimentos dos acordes." },
  { name: "Dindi", artist: "Tom Jobim", genre: "Bossa Nova", difficulty: "Intermediário", tip: "Doçura e delicadeza. Um dos mais belos de Jobim." },
  { name: "Night and Day", artist: "Cole Porter", genre: "Jazz", difficulty: "Intermediário", tip: "Standard elegante. Fraseado swing." },
  { name: "Donna Lee", artist: "Charlie Parker", genre: "Bebop", difficulty: "Avançado", tip: "Teste supremo de técnica. Pratique em tempos lentos primeiro." },
  { name: "Giant Steps", artist: "John Coltrane", genre: "Jazz", difficulty: "Avançado", tip: "O Monte Everest do jazz. Mudanças de tonalidade extremas." },
  { name: "Spain", artist: "Chick Corea", genre: "Jazz/Fusion", difficulty: "Avançado", tip: "Fusão latina brilhante. Tecnicamente exigente e recompensador." },
  { name: "Stella by Starlight", artist: "Victor Young", genre: "Jazz", difficulty: "Avançado", tip: "Harmonia complexa. Estude com o Real Book." },
  { name: "St. Thomas", artist: "Sonny Rollins", genre: "Jazz", difficulty: "Intermediário", tip: "Calipso jazz. Ritmo contagiante." },
  { name: "All The Things You Are", artist: "Jerome Kern", genre: "Jazz", difficulty: "Avançado", tip: "Progressão harmônica perfeita para estudar jazz." },
  { name: "Round Midnight", artist: "Thelonious Monk", genre: "Jazz", difficulty: "Avançado", tip: "Balada noturna. Atmosfera e expressão." },
  { name: "Naima", artist: "John Coltrane", genre: "Jazz", difficulty: "Intermediário", tip: "Balada dedicada à esposa de Coltrane. Beleza pura." },
  { name: "Watermelon Man", artist: "Herbie Hancock", genre: "Jazz/Funk", difficulty: "Intermediário", tip: "Funky e acessível. Ótimo para shows." },
  { name: "Chameleon", artist: "Herbie Hancock", genre: "Jazz/Funk", difficulty: "Avançado", tip: "Fusion clássico. Groove hipnótico." },
  { name: "Tenor Madness", artist: "Sonny Rollins", genre: "Jazz", difficulty: "Avançado", tip: "Blues em Bb. Base para jam sessions." },
  { name: "Moanin'", artist: "Art Blakey", genre: "Hard Bop", difficulty: "Intermediário", tip: "Hard bop essencial. Call and response poderoso." },
  { name: "Song for My Father", artist: "Horace Silver", genre: "Hard Bop", difficulty: "Intermediário", tip: "Bossa + hard bop. Groove brasileiro no jazz." },
  { name: "Work Song", artist: "Nat Adderley", genre: "Hard Bop", difficulty: "Intermediário", tip: "Blues form com energia gospel." },
];

const difficultyColor = {
  Iniciante: "bg-emerald-100 text-emerald-800",
  Intermediário: "bg-amber-100 text-amber-800",
  Avançado: "bg-rose-100 text-rose-800",
};

const BonusMusicas = () => {
  useNoIndex();
  const [loading, setLoading] = useState(false);
  const genres = [...new Set(songs.map((s) => s.genre))];

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateMusicasPDF();
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/plano-premium-completo" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Acervo
          </Link>
          <img src={logoClubeSax} alt="Clube do Sax" className="h-6 w-auto" />
        </div>
      </header>

      <main className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🎵</span>
            </div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold font-heading mb-3">
              BÔNUS EXCLUSIVO PREMIUM
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3">
              100 Músicas que Todo Saxofonista Precisa Saber
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto">
              Lista curada com nível de dificuldade, gênero e dicas de interpretação. Do clássico ao contemporâneo, gospel ao jazz.
            </p>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-center mb-10 shadow-lg">
            <h3 className="text-white font-bold font-heading text-lg mb-2">📥 Baixar Lista Completa em PDF</h3>
            <p className="text-white/80 text-sm font-body mb-4">Com todas as 100 músicas, dicas e níveis de dificuldade</p>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white text-orange-700 font-bold font-heading px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {loading ? "GERANDO PDF..." : "BAIXAR PDF GRATUITO"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-card rounded-xl border border-border p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold font-heading text-primary">{songs.length}</p>
              <p className="text-xs text-muted-foreground font-body">Músicas</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold font-heading text-primary">{genres.length}</p>
              <p className="text-xs text-muted-foreground font-body">Gêneros</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold font-heading text-primary">3</p>
              <p className="text-xs text-muted-foreground font-body">Níveis</p>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {(["Iniciante", "Intermediário", "Avançado"] as const).map((d) => (
              <span key={d} className={`px-3 py-1 rounded-full text-xs font-bold font-heading ${difficultyColor[d]}`}>
                {d}
              </span>
            ))}
          </div>

          {/* Song List */}
          <div className="space-y-3">
            {songs.map((song, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground font-heading w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Music className="w-3.5 h-3.5 text-primary shrink-0" />
                    <h3 className="font-bold font-heading text-sm truncate">{song.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-heading shrink-0 ${difficultyColor[song.difficulty]}`}>
                    {song.difficulty}
                  </span>
                </div>
                <div className="ml-8 pl-3.5">
                  <p className="text-xs text-muted-foreground font-body">
                    {song.artist} • <span className="text-primary/70">{song.genre}</span>
                  </p>
                  <p className="text-xs font-body text-foreground mt-1 leading-relaxed">
                    💡 {song.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground font-bold font-heading px-8 py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {loading ? "GERANDO PDF..." : "BAIXAR LISTA EM PDF"}
            </button>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Conteúdo exclusivo para mClube do SaxPlaybe do Sax
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 px-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default BonusMusicas;
