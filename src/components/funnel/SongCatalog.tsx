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
    <section className="py-24 md:py-40 px-6 md:px-12 section-alt relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(38_85%_50%/0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
            Transparência Total
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight">
            Explore o nosso <br className="hidden md:block" />
            <span className="text-primary italic">acervo real</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto">
            Não vendemos promessas. Pesquise sua música favorita e comprove que ela está esperando por você.
          </p>
        </div>

        {/* Search bar refined */}
        <div className="max-w-xl mx-auto mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-gold/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-elite" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Pesquise por música, artista ou gênero..."
                className="w-full bg-background/80 border border-white/10 rounded-2xl pl-14 pr-14 py-5 text-base font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 backdrop-blur-xl transition-elite shadow-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSearchResults([]); setHasSearched(false); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search results refined */}
          {(searching || hasSearched) && searchQuery.length >= 2 && (
            <div className="mt-6 glass-card rounded-[24px] p-6 shadow-elite border-primary/20 animate-fade-in-up">
              {searching ? (
                <div className="flex items-center justify-center gap-3 py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Consultando acervo...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="flex items-center gap-3 mb-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <p className="text-sm text-foreground font-bold">
                      Encontrada! Esta música está disponível para você tocar agora.
                    </p>
                  </div>
                  <div className="grid gap-2 mb-8">
                    {searchResults.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <Music className="w-4 h-4 text-primary shrink-0 opacity-60" />
                        <span className="text-sm font-semibold text-muted-foreground truncate uppercase tracking-wide">{r.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={scrollToOffers}
                    className="w-full gradient-cta text-white font-black uppercase tracking-[0.1em] py-5 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-elite flex items-center justify-center gap-3"
                  >
                    <Lock className="w-4 h-4" />
                    DESBLOQUEAR ACESSO IMEDIATO
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                    Não encontramos essa música específica nesta prévia, <br />
                    mas nosso acervo conta com <strong className="text-primary">+10.000 títulos</strong> atualizados semanalmente.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <span className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Sincronizando biblioteca...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {visibleGenres.map((genre) => (
                <div
                  key={genre.name}
                  className="glass-card rounded-[24px] p-6 hover:border-primary/20 group"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-elite">{genre.emoji}</span>
                    <h3 className="font-black font-heading text-base tracking-tight uppercase">{genre.name}</h3>
                  </div>
                  <div className="space-y-3">
                    {genre.songs.map((song, i) => (
                      <div key={i} className="flex items-center gap-3 group/song">
                        <Music className="w-3.5 h-3.5 text-primary/40 group-hover/song:text-primary transition-colors shrink-0" />
                        <span className="text-[13px] font-semibold text-muted-foreground/80 truncate group-hover/song:text-foreground transition-colors">{song}</span>
                      </div>
                    ))}
                    {!showAll && genre.songs.length < genres.find(g => g.name === genre.name)!.songs.length && (
                      <div className="pt-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                          +{genres.find(g => g.name === genre.name)!.songs.length - genre.songs.length} músicas
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!showAll && totalSongs > totalVisible && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:text-gold transition-elite border-b border-primary/20 pb-1"
                >
                  Ver amostra completa de {totalSongs} músicas ↓
                </button>
              </div>
            )}

            <div className="text-center mt-20 p-8 md:p-12 glass-card rounded-[32px] border-white/5 shadow-medium max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-muted-foreground mb-8 font-medium leading-relaxed">
                Este é apenas o conteúdo de demonstração. <br className="hidden md:block" />
                Ao garantir seu acesso, você libera <strong className="text-foreground">mais de 10.000 partituras profissionais</strong> organizadas em uma plataforma inteligente.
              </p>
              <button
                onClick={scrollToOffers}
                className="gradient-cta text-white font-black uppercase tracking-widest py-5 px-10 md:px-14 rounded-2xl text-sm md:text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.03] active:scale-[0.97] transition-elite inline-flex items-center gap-3"
              >
                QUERO ACESSAR O ACERVO COMPLETO
                <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SongCatalog;
