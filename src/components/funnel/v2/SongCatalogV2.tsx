import { useMemo, useState } from "react";
import { Music, ArrowRight, ChevronDown, X, FolderOpen } from "lucide-react";
import { CATALOG_GENRES, TOTAL_CATALOG_COUNT, TOTAL_SAMPLE_COUNT } from "@/data/catalogSongs";

const scrollToOffers = () => {
  document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
};

const SongCatalogV2 = () => {
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [showFullModal, setShowFullModal] = useState(false);

  const totalShown = useMemo(() => TOTAL_SAMPLE_COUNT, []);

  return (
    <section className="py-20 md:py-28 px-5 md:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <span className="mg-caps inline-block mb-4" style={{ color: "var(--mg-gold)" }}>
            Acervo Real
          </span>
          <h2 className="mg-display text-3xl md:text-5xl mb-4">
            Mais de <em className="mg-gold-text">{TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")} músicas</em>{" "}
            <br className="hidden md:block" />
            esperando por você
          </h2>
          <p className="text-[var(--mg-text-dim)] max-w-2xl mx-auto md:text-lg">
            Veja abaixo uma <strong className="text-white">amostra real</strong> do acervo, organizada por gênero.
            Todas com partitura + playback profissional.
          </p>
        </div>

        {/* STATS BAR */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-12 md:mb-16">
          <div className="mg-glass rounded-2xl px-5 py-3 flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <Music className="w-5 h-5" style={{ color: "var(--mg-gold)" }} />
            </div>
            <div>
              <p className="mg-display text-base md:text-lg leading-none">
                {TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")}+
              </p>
              <p className="mg-caps text-[10px] mt-1">Partituras</p>
            </div>
          </div>
          <div className="mg-glass rounded-2xl px-5 py-3 flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <FolderOpen className="w-5 h-5" style={{ color: "var(--mg-gold)" }} />
            </div>
            <div>
              <p className="mg-display text-base md:text-lg leading-none">{CATALOG_GENRES.length}</p>
              <p className="mg-caps text-[10px] mt-1">Gêneros</p>
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
                className="mg-glass p-6 md:p-7 transition-all duration-300 hover:-translate-y-1"
                style={{ borderRadius: 22, border: "1px solid rgba(212,175,55,0.25)" }}
              >
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-3xl md:text-4xl shrink-0">{genre.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="mg-display text-lg leading-tight truncate">{genre.name}</h3>
                    <p
                      className="text-[11px] mt-1 font-bold uppercase tracking-widest"
                      style={{ color: "var(--mg-gold)" }}
                    >
                      +{genre.totalCount.toLocaleString("pt-BR")} no acervo
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {visibleSongs.map((song, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Music
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: "var(--mg-gold)", opacity: 0.7 }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-white truncate leading-tight">{song.title}</p>
                        <p className="text-[11px] text-[var(--mg-text-dim)] truncate">{song.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {genre.songs.length > 6 && (
                  <button
                    onClick={() => setExpandedGenre(isExpanded ? null : genre.id)}
                    className="mt-5 w-full text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all"
                    style={{
                      color: "var(--mg-gold)",
                      background: "rgba(212,175,55,0.06)",
                      border: "1px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    {isExpanded ? "Mostrar menos" : `Ver mais ${genre.songs.length - 6} músicas`}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* SHOW ALL */}
        <div className="text-center mt-12 mb-16">
          <button
            onClick={() => setShowFullModal(true)}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] pb-1 transition-colors"
            style={{ color: "var(--mg-gold)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}
          >
            Ver lista completa de {totalShown}+ músicas da amostra
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* FINAL CTA */}
        <div className="text-center p-8 md:p-12 mg-glass max-w-3xl mx-auto" style={{ borderRadius: 28 }}>
          <p className="text-base md:text-lg text-[var(--mg-text-dim)] mb-8 leading-relaxed">
            Esta é apenas uma amostra. <br className="hidden md:block" />
            Ao garantir seu acesso, você libera{" "}
            <strong className="text-white">
              {TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")}+ partituras profissionais
            </strong>{" "}
            organizadas em uma plataforma inteligente.
          </p>
          <button
            onClick={scrollToOffers}
            className="mg-gold-btn uppercase tracking-widest text-sm md:text-base inline-flex items-center gap-3"
          >
            QUERO ACESSAR O ACERVO COMPLETO
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FULL CATALOG MODAL */}
      {showFullModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
            style={{
              background: "var(--mg-bg)",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 md:px-8 py-5"
              style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}
            >
              <div>
                <h3 className="mg-display text-lg md:text-2xl">Amostra completa do acervo</h3>
                <p className="text-xs md:text-sm text-[var(--mg-text-dim)] mt-1">
                  {totalShown}+ músicas reais — só uma fração das +
                  {TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")} disponíveis
                </p>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">
              {CATALOG_GENRES.map((genre) => (
                <div key={genre.id}>
                  <div
                    className="flex items-center gap-3 mb-4 sticky top-0 py-2 -mx-6 md:-mx-8 px-6 md:px-8 z-10"
                    style={{ background: "var(--mg-bg)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-2xl">{genre.emoji}</span>
                    <h4 className="mg-display text-base md:text-lg">{genre.name}</h4>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{
                        color: "var(--mg-gold)",
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.25)",
                      }}
                    >
                      +{genre.totalCount.toLocaleString("pt-BR")} no acervo
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pl-1">
                    {genre.songs.map((song, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Music
                          className="w-3.5 h-3.5 shrink-0 mt-1"
                          style={{ color: "var(--mg-gold)", opacity: 0.7 }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-white truncate leading-tight">{song.title}</p>
                          <p className="text-[11px] text-[var(--mg-text-dim)] truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="px-6 md:px-8 py-5"
              style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}
            >
              <button
                onClick={() => {
                  setShowFullModal(false);
                  scrollToOffers();
                }}
                className="mg-gold-btn w-full uppercase tracking-widest text-sm inline-flex items-center justify-center gap-3"
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

export default SongCatalogV2;
