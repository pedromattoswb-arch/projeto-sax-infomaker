import { useState, useEffect, useCallback, useRef } from "react";
import { Music, ArrowRight, Loader2, Search, X, Lock } from "lucide-react";

const EDGE_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/list-drive-files`;
const SEARCH_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/search-drive`;

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

interface SearchResult {
  name: string;
  type: string;
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
  const [showAll, setShowAll] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let cancelled = false;

    async function fetchCatalog() {
      try {
        const rootRes = await fetch(EDGE_URL);
        if (!rootRes.ok) throw new Error("API error");
        const rootData = await rootRes.json();
        const folders: { id: string; name: string }[] = rootData.folders || [];

        const matched: { config: typeof GENRE_CONFIG[0]; folder: { id: string; name: string } }[] = [];
        for (const cfg of GENRE_CONFIG) {
          const found = folders.find(f => f.name.toUpperCase().includes(cfg.keyword));
          if (found) matched.push({ config: cfg, folder: found });
        }

        if (matched.length === 0) throw new Error("No matching folders");

        const results = await Promise.allSettled(
          matched.map(m =>
            fetch(`${EDGE_URL}?folderId=${m.folder.id}`)
              .then(r => r.ok ? r.json() : Promise.reject())
          )
        );

        if (cancelled) return;

        const genreResults: GenreData[] = [];

        results.forEach((result, i) => {
          const cfg = matched[i].config;
          const folderName = matched[i].folder.name
            .toLowerCase()
            .replace(/(?:^|\s|[-/])\S/g, match => match.toUpperCase());

          if (result.status === "fulfilled" && result.value) {
            const data = result.value;
            const allItems = [
              ...(data.folders || []).map((f: any) => f.name),
              ...(data.files || []).map((f: any) => f.name),
            ];
            const songs = allItems
              .map(cleanSongName)
              .filter(s => s.length > 2 && s.length < 60);

            if (songs.length > 0) {
              genreResults.push({ emoji: cfg.emoji, name: folderName, songs });
            }
          } else {
            genreResults.push({ emoji: cfg.emoji, name: folderName, songs: cfg.fallback });
          }
        });

        setGenres(genreResults);
      } catch {
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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(query.trim())}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const combined: SearchResult[] = [
          ...(data.folders || []).map((f: any) => ({ name: f.name, type: "folder" })),
          ...(data.files || []).map((f: any) => ({ name: cleanSongName(f.name), type: f.type })),
        ];
        setSearchResults(combined.slice(0, 8));
        setHasSearched(true);
      } catch {
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setSearching(false);
      }
    }, 250);
  }, []);

  const totalSongs = genres.reduce((sum, g) => sum + g.songs.length, 0);

  const INITIAL_SONGS_PER_GENRE = 6;
  const visibleGenres = genres.map(g => ({
    ...g,
    songs: showAll ? g.songs : g.songs.slice(0, INITIAL_SONGS_PER_GENRE),
  }));
  const totalVisible = visibleGenres.reduce((sum, g) => sum + g.songs.length, 0);

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 section-alt">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3 border border-primary/20">
            🎵 ACERVO REAL — PARA SAX ALTO E SAX TENOR
          </span>
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
            Procure Sua Música Favorita no Acervo
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base">
            Se ela está aqui, você já pode tocar com <strong className="text-primary">partitura + playback profissional</strong>
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Procure uma música no acervo..."
              className="w-full bg-surface/60 border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchResults([]); setHasSearched(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search results */}
          {(searching || hasSearched) && searchQuery.length >= 2 && (
            <div className="mt-3 glass-card rounded-xl p-4 animate-fade-in">
              {searching ? (
                <div className="flex items-center justify-center gap-2 py-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground font-body">Buscando no acervo...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <p className="text-xs text-foreground font-body mb-3 font-semibold">
                    ✅ Essa música está no acervo! Garanta seu acesso e toque agora
                  </p>
                  <div className="space-y-1.5 mb-4">
                    {searchResults.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 py-1">
                        <Lock className="w-3 h-3 text-primary/50 shrink-0" />
                        <span className="text-xs font-body text-muted-foreground truncate">{r.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={scrollToOffers}
                    className="w-full gradient-cta text-white font-bold font-heading py-3 rounded-xl text-xs shadow-cta hover:shadow-cta-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    DESBLOQUEAR ACESSO — ESCOLHER MEU PLANO
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-body text-center py-2">
                  Não encontramos essa música ainda — mas nosso acervo tem <strong className="text-primary">+10.000 partituras com playback</strong> e cresce toda semana!
                </p>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground font-body">Carregando acervo real…</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {visibleGenres.map((genre) => (
                <div
                  key={genre.name}
                  className="glass-card rounded-xl p-4"
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
                    {!showAll && genre.songs.length < genres.find(g => g.name === genre.name)!.songs.length && (
                      <span className="text-[10px] text-primary/60 font-body">
                        +{genres.find(g => g.name === genre.name)!.songs.length - genre.songs.length} mais...
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!showAll && totalSongs > totalVisible && (
              <div className="text-center mt-5">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs text-primary/80 hover:text-primary font-body underline underline-offset-2 transition-colors"
                >
                  Ver todas as {totalSongs} músicas desta amostra ↓
                </button>
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-xs text-muted-foreground mb-4 font-body">
                Isso é apenas uma <strong className="text-foreground">pequena amostra</strong>. Na plataforma você encontra <strong className="text-primary">+1.000 partituras com playback para Sax Alto e Sax Tenor</strong> — e o acervo cresce toda semana.
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
