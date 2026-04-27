import { useMemo, useState } from "react";
import { Music, ArrowRight, ChevronDown, X, FolderOpen } from "lucide-react";
import { CATALOG_GENRES, TOTAL_CATALOG_COUNT, TOTAL_SAMPLE_COUNT } from "@/data/catalogSongs";

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

const SongCatalog = () => {
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [showFullModal, setShowFullModal] = useState(false);

  const totalShown = useMemo(() => TOTAL_SAMPLE_COUNT, []);

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
            Acervo Real
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight">
            Mais de <span className="text-primary">10.000 músicas</span> <br className="hidden md:block" />
            esperando por você
          </h2>
          <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto">
            Veja abaixo uma <strong className="text-foreground">amostra real</strong> do acervo, organizada por gênero. Todas com partitura + playback profissional.
          </p>
        </div>

        {/* STATS BAR */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-12 md:mb-16">
          <div className="glass-card rounded-2xl px-5 py-3 flex items-center gap-3 border-white/10">
            <div className="p-2 rounded-xl bg-primary/15">
              <Music className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <div>
              <p className="text-base md:text-lg font-black font-heading text-foreground leading-none">{TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")}+</p>
              <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider">Partituras</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl px-5 py-3 flex items-center gap-3 border-white/10">
            <div className="p-2 rounded-xl bg-primary/15">
              <FolderOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <div>
              <p className="text-base md:text-lg font-black font-heading text-foreground leading-none">{CATALOG_GENRES.length}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider">Gêneros</p>
            </div>
          </div>
        </div>

        {/* GENRE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CATALOG_GENRES.map((genre) => {
            const isExpanded = expandedGenre === genre.id;
            const visibleSongs = isExpanded ? genre.songs : genre.songs.slice(0, 6);

            return (
              <div
                key={genre.id}
                className="glass-card rounded-3xl p-6 md:p-7 border-white/10 hover:border-primary/30 transition-elite group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-3xl md:text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform shrink-0">{genre.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black font-heading text-base md:text-lg tracking-tight leading-tight truncate">{genre.name}</h3>
                      <p className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                        +{genre.totalCount.toLocaleString("pt-BR")} no acervo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Songs list */}
                <div className="space-y-2.5">
                  {visibleSongs.map((song, i) => (
                    <div key={i} className="flex items-start gap-2.5 group/song">
                      <Music className="w-3.5 h-3.5 text-primary/50 group-hover/song:text-primary transition-colors shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-foreground/90 truncate group-hover/song:text-foreground transition-colors leading-tight">
                          {song.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 truncate font-medium">{song.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expand button */}
                {genre.songs.length > 6 && (
                  <button
                    onClick={() => setExpandedGenre(isExpanded ? null : genre.id)}
                    className="mt-5 w-full text-[11px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/15 transition-elite"
                  >
                    {isExpanded ? "Mostrar menos" : `Ver mais ${genre.songs.length - 6} músicas`}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* SHOW ALL BUTTON */}
        <div className="text-center mt-12 mb-16">
          <button
            onClick={() => setShowFullModal(true)}
            className="inline-flex items-center gap-2 text-sm font-black text-primary uppercase tracking-[0.2em] hover:text-foreground transition-elite border-b border-primary/30 hover:border-foreground pb-1"
          >
            Ver lista completa de {totalShown}+ músicas da amostra
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* FINAL CTA */}
        <div className="text-center p-8 md:p-12 glass-card rounded-[32px] border-white/10 shadow-medium max-w-3xl mx-auto">
          <p className="text-base md:text-lg text-muted-foreground mb-8 font-medium leading-relaxed">
            Esta é apenas uma amostra. <br className="hidden md:block" />
            Ao garantir seu acesso, você libera <strong className="text-foreground">{TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")}+ partituras profissionais</strong> organizadas em uma plataforma inteligente.
          </p>
          <button
            onClick={scrollToOffers}
            className="gradient-cta text-white font-black uppercase tracking-widest py-5 px-10 md:px-14 rounded-2xl text-sm md:text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.03] active:scale-[0.97] transition-elite inline-flex items-center gap-3"
          >
            QUERO ACESSAR O ACERVO COMPLETO
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </button>
        </div>
      </div>

      {/* FULL CATALOG MODAL */}
      {showFullModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#0a0e1a] border border-white/10 rounded-3xl shadow-elite flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02]">
              <div>
                <h3 className="text-lg md:text-2xl font-black font-heading">Amostra completa do acervo</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">{totalShown}+ músicas reais — só uma fração das +{TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")} disponíveis</p>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">
              {CATALOG_GENRES.map((genre) => (
                <div key={genre.id}>
                  <div className="flex items-center gap-3 mb-4 sticky top-0 bg-[#0a0e1a] py-2 -mx-6 md:-mx-8 px-6 md:px-8 z-10 border-b border-white/5">
                    <span className="text-2xl">{genre.emoji}</span>
                    <h4 className="font-black font-heading text-base md:text-lg">{genre.name}</h4>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      +{genre.totalCount.toLocaleString("pt-BR")} no acervo
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pl-1">
                    {genre.songs.map((song, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Music className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-1" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-foreground/90 truncate leading-tight">{song.title}</p>
                          <p className="text-[11px] text-muted-foreground/70 truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal CTA footer */}
            <div className="px-6 md:px-8 py-5 border-t border-white/10 bg-white/[0.02]">
              <button
                onClick={() => { setShowFullModal(false); scrollToOffers(); }}
                className="w-full gradient-cta text-white font-black uppercase tracking-widest py-4 rounded-xl text-sm shadow-cta hover:shadow-cta-lg transition-elite flex items-center justify-center gap-3"
              >
                QUERO ACESSAR O ACERVO COMPLETO
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SongCatalog;
