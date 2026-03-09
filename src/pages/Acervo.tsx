import { useState, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, Music, X } from "lucide-react";
import logoSaxplay from "@/assets/logo-saxplay.png";
import { mockSongs, ALL_GENRES } from "@/data/mockSongs";
import type { Song, Genre } from "@/types/acervo";
import SongCard from "@/components/acervo/SongCard";
import AudioPlayer from "@/components/acervo/AudioPlayer";
import PdfViewer from "@/components/acervo/PdfViewer";

const Acervo = () => {
  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewingPdfSong, setViewingPdfSong] = useState<Song | null>(null);
  const filteredSongs = useMemo(() => {
    let result = mockSongs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      );
    }
    if (selectedGenres.length > 0) {
      result = result.filter((s) => selectedGenres.includes(s.genre));
    }
    return result;
  }, [search, selectedGenres]);

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleTogglePlay = useCallback(
    (song: Song) => {
      if (currentSong?.id === song.id) {
        setIsPlaying((p) => !p);
      } else {
        setCurrentSong(song);
        setIsPlaying(true);
      }
    },
    [currentSong?.id]
  );

  const playableSongs = useMemo(
    () => filteredSongs.filter((s) => !!s.audioUrl),
    [filteredSongs]
  );

  const handleNext = useCallback(() => {
    if (!currentSong || playableSongs.length === 0) return;
    const idx = playableSongs.findIndex((s) => s.id === currentSong.id);
    const next = playableSongs[(idx + 1) % playableSongs.length];
    setCurrentSong(next);
    setIsPlaying(true);
  }, [currentSong, playableSongs]);

  const handlePrev = useCallback(() => {
    if (!currentSong || playableSongs.length === 0) return;
    const idx = playableSongs.findIndex((s) => s.id === currentSong.id);
    const prev = playableSongs[(idx - 1 + playableSongs.length) % playableSongs.length];
    setCurrentSong(prev);
    setIsPlaying(true);
  }, [currentSong, playableSongs]);

  return (
    <div className={`min-h-screen bg-background ${currentSong ? "pb-32 md:pb-24" : ""}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logoSaxplay} alt="SaxPlay" className="h-8 md:h-10 w-auto" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Music className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-body font-medium">
              {mockSongs.length} músicas
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* Hero */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-heading font-extrabold text-2xl md:text-4xl text-foreground mb-2">
            Acervo de Partituras
          </h1>
          <p className="text-muted-foreground font-body text-sm md:text-base max-w-lg mx-auto">
            Encontre sua música, ouça o playback e toque junto com a partitura.
          </p>
        </div>

        {/* Search + Filter toggle */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por música ou artista..."
              className="w-full pl-10 pr-4 py-3 md:py-3.5 bg-card border border-border rounded-xl text-sm md:text-base font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 px-3 md:px-4 py-3 rounded-xl border transition-all font-body text-sm flex items-center gap-1.5 ${
              showFilters || selectedGenres.length > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden md:inline">Filtros</span>
            {selectedGenres.length > 0 && (
              <span className="bg-primary-foreground/20 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {selectedGenres.length}
              </span>
            )}
          </button>
        </div>

        {/* Genre filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-card border border-border rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {ALL_GENRES.map((genre) => {
              const active = selectedGenres.includes(genre as Genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre as Genre)}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold font-body transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
            {selectedGenres.length > 0 && (
              <button
                onClick={() => setSelectedGenres([])}
                className="px-3 py-1.5 rounded-full text-xs md:text-sm font-body text-destructive hover:bg-destructive/10 transition-all"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-muted-foreground font-body mb-4">
          {filteredSongs.length === mockSongs.length
            ? `Mostrando todas as ${mockSongs.length} músicas`
            : `${filteredSongs.length} resultado${filteredSongs.length !== 1 ? "s" : ""} encontrado${filteredSongs.length !== 1 ? "s" : ""}`}
        </p>

        {/* Song grid */}
        {filteredSongs.length > 0 ? (
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isPlaying && currentSong?.id === song.id}
                onTogglePlay={handleTogglePlay}
                onViewPdf={(s) => setViewingPdfSong(s)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Music className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-body text-sm">
              Nenhuma música encontrada.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedGenres([]);
              }}
              className="mt-3 text-sm text-primary hover:underline font-body"
            >
              Limpar busca e filtros
            </button>
          </div>
        )}
      </main>

      {/* Audio Player */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying((p) => !p)}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* PDF Viewer */}
      {viewingPdfSong && (
        <PdfViewer song={viewingPdfSong} onClose={() => setViewingPdfSong(null)} />
      )}
    </div>
  );
};

export default Acervo;
