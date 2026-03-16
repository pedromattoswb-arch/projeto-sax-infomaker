import { useState, useEffect } from "react";
import { Music, ArrowRight, Loader2 } from "lucide-react";

const EDGE_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/list-drive-files`;

// 8 gêneros mais populares — IDs serão resolvidos dinamicamente
const GENRE_CONFIG = [
  { emoji: "🇧🇷", keyword: "BRASILEIRA", fallback: ["Garota de Ipanema", "Evidências", "Águas de Março", "Carinhoso"] },
  { emoji: "🙏", keyword: "GOSPEL", fallback: ["Quão Grande É o Meu Deus", "Oceanos", "Bondade de Deus", "Harpa Cristã"] },
  { emoji: "🎷", keyword: "JAZZ", fallback: ["Take Five", "So What", "Autumn Leaves", "Fly Me to the Moon"] },
  { emoji: "🎤", keyword: "POP", fallback: ["Shape of You", "Blinding Lights", "Someone Like You", "All of Me"] },
  { emoji: "🎸", keyword: "ROCK", fallback: ["Bohemian Rhapsody", "Hotel California", "Baker Street", "Nothing Else Matters"] },
  { emoji: "📻", keyword: "ROMANTIC", fallback: ["Careless Whisper", "My Heart Will Go On", "Endless Love", "Unchained Melody"] },
  { emoji: "🎵", keyword: "BOSSA", fallback: ["Chega de Saudade", "Corcovado", "Wave", "Desafinado"] },
  { emoji: "🎬", keyword: "FILM", fallback: ["The Pink Panther", "Moon River", "Cinema Paradiso", "Hallelujah"] },
];

interface GenreData {
  emoji: string;
  name: string;
  songs: string[];
}

function cleanSongName(filename: string): string {
  return filename
    .replace(/\.(pdf|mp3|wav|ogg|m4a)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

const SongCatalog = () => {
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchCatalog() {
      try {
        // 1. Fetch root folders
        const rootRes = await fetch(EDGE_URL);
        if (!rootRes.ok) throw new Error("API error");
        const rootData = await rootRes.json();
        const folders: { id: string; name: string }[] = rootData.folders || [];

        // 2. Match genres to real folders
        const matched: { config: typeof GENRE_CONFIG[0]; folder: { id: string; name: string } }[] = [];
        for (const cfg of GENRE_CONFIG) {
          const found = folders.find(f => f.name.toUpperCase().includes(cfg.keyword));
          if (found) matched.push({ config: cfg, folder: found });
        }

        if (matched.length === 0) throw new Error("No matching folders");

        // 3. Fetch contents for up to 6 folders in parallel (limit API calls)
        const toFetch = matched.slice(0, 6);
        const results = await Promise.allSettled(
          toFetch.map(m =>
            fetch(`${EDGE_URL}?folderId=${m.folder.id}`)
              .then(r => r.ok ? r.json() : Promise.reject())
          )
        );

        if (cancelled) return;

        const genreResults: GenreData[] = [];
        let totalSongs = 0;

        results.forEach((result, i) => {
          const cfg = toFetch[i].config;
          const folderName = toFetch[i].folder.name
            .toLowerCase()
            .replace(/(?:^|\s|[-/])\S/g, match => match.toUpperCase());

          if (result.status === "fulfilled" && result.value) {
            const data = result.value;
            // Get file + subfolder names as song samples
            const allItems = [
              ...(data.folders || []).map((f: any) => f.name),
              ...(data.files || []).map((f: any) => f.name),
            ];
            // Pick up to 4 recognizable names, clean them
            const songs = allItems
              .map(cleanSongName)
              .filter(s => s.length > 2 && s.length < 60)
              .slice(0, 4);

            if (songs.length > 0) {
              genreResults.push({ emoji: cfg.emoji, name: folderName, songs });
              totalSongs += songs.length;
            }
          } else {
            // Fallback for this genre
            genreResults.push({ emoji: cfg.emoji, name: folderName, songs: cfg.fallback.slice(0, 4) });
            totalSongs += cfg.fallback.slice(0, 4).length;
          }

          // Stop at ~30 songs total
          if (totalSongs >= 30) return;
        });

        // Add remaining genres that weren't fetched, using fallback
        for (let i = toFetch.length; i < matched.length && totalSongs < 30; i++) {
          const cfg = matched[i].config;
          const folderName = matched[i].folder.name
            .toLowerCase()
            .replace(/(?:^|\s|[-/])\S/g, match => match.toUpperCase());
          const songs = cfg.fallback.slice(0, 4);
          genreResults.push({ emoji: cfg.emoji, name: folderName, songs });
          totalSongs += songs.length;
        }

        setGenres(genreResults);
      } catch {
        // Full fallback to hardcoded data
        if (!cancelled) {
          setGenres(GENRE_CONFIG.map(cfg => ({
            emoji: cfg.emoji,
            name: cfg.keyword.charAt(0) + cfg.keyword.slice(1).toLowerCase(),
            songs: cfg.fallback,
          })));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCatalog();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 section-alt">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3">
            🎵 ACERVO REAL — PARA SAX ALTO E SAX TENOR
          </span>
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
            Veja Algumas Músicas do Acervo
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base">
            Essas são músicas <strong>reais</strong> disponíveis na plataforma — de um total de <strong className="text-primary">+10.000 arquivos</strong>
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground font-body">Carregando acervo real…</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {genres.map((genre) => (
                <div
                  key={genre.name}
                  className="bg-card rounded-xl border border-border p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{genre.emoji}</span>
                    <h3 className="font-bold font-heading text-sm leading-tight">{genre.name}</h3>
                  </div>
                  <div className="space-y-1.5">
                    {genre.songs.map((song, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Music className="w-3 h-3 text-primary shrink-0" />
                        <span className="text-xs font-body text-muted-foreground break-words">{song}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-muted-foreground mb-4 font-body">
                Isso é apenas uma <strong>amostra</strong>. O acervo completo tem <strong className="text-primary">+10.000 partituras e playbacks para Sax Alto e Sax Tenor</strong> — e cresce todo mês.
              </p>
              <button
                onClick={scrollToOffers}
                className="gradient-cta text-white font-bold font-heading py-3.5 px-8 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2"
              >
                QUERO ACESSAR O ACERVO COMPLETO
                <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SongCatalog;
