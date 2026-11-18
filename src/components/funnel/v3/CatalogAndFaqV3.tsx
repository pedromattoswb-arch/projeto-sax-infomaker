import { useMemo, useState, useEffect } from "react";
import { Music, ArrowRight, ChevronDown, X, FolderOpen, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATALOG_GENRES, TOTAL_CATALOG_COUNT, TOTAL_SAMPLE_COUNT } from "@/data/catalogSongs";
import { CinematicReveal, KineticHeading } from "./SaxThematicEffects";

interface SongCatalogV3Props {
  onScrollToOffers: () => void;
}

export const SongCatalogV3 = ({ onScrollToOffers }: SongCatalogV3Props) => {
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [showFullModal, setShowFullModal] = useState(false);

  const totalShown = useMemo(() => TOTAL_SAMPLE_COUNT, []);

  useEffect(() => {
    if (!showFullModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFullModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showFullModal]);

  return (
    <section id="catalogo" className="sax-section">
      <div className="sax-container relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
            <FolderOpen className="w-4 h-4 text-[#f5b942] shrink-0" />
            <span>Repertório Real Organizado por Estilo</span>
          </div>

          <KineticHeading>
            <h2 className="sax-h2 text-white mb-4">
              Mais de <span className="sax-gold-gradient-text italic">10.000 Músicas</span>{" "}
              Prontas Para Você Tocar
            </h2>
          </KineticHeading>

          <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto">
            Explore abaixo uma amostra real das pastas dentro do aplicativo — todas com partitura
            para <strong className="text-white">Sax Alto (Eb) e Sax Tenor (Bb)</strong> + playback:
          </p>
        </div>

        {/* Genre Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATALOG_GENRES.map((genre) => {
            const isExpanded = expandedGenre === genre.id;
            const visibleSongs = isExpanded ? genre.songs : genre.songs.slice(0, 6);

            return (
              <CinematicReveal key={genre.id}>
                <div className="sax-card h-full rounded-3xl p-6 border border-[#f5b942]/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5 pb-3.5 border-b border-white/10">
                    <span className="text-3xl shrink-0" aria-hidden="true">
                      {genre.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black font-heading text-base sm:text-lg text-white truncate">
                        {genre.name}
                      </h3>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#f5b942]">
                        +{genre.totalCount.toLocaleString("pt-BR")} músicas na pasta
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {visibleSongs.map((song, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Music className="w-4 h-4 text-[#f5b942]/80 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white/95 truncate leading-snug">
                            {song.title}
                          </p>
                          <p className="text-xs text-[#cfc3ae]/85 truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {genre.songs.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setExpandedGenre(isExpanded ? null : genre.id)}
                    aria-expanded={isExpanded}
                    className="mt-5 min-h-[42px] w-full text-xs font-black text-[#ffe49e] uppercase tracking-wider flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#f5b942]/10 hover:bg-[#f5b942]/20 border border-[#f5b942]/25 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? "Mostrar menos" : `Ver mais ${genre.songs.length - 6} exemplos`}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
                </div>
              </CinematicReveal>
            );
          })}
        </div>

        {/* Full Sample Modal Trigger */}
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => setShowFullModal(true)}
            className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-[#ffe49e] hover:text-white border-b border-[#f5b942]/50 pb-1 transition-colors cursor-pointer"
          >
            <span>Abrir lista com {totalShown}+ exemplos reais do catálogo</span>
            <ArrowRight className="w-4 h-4 text-[#f5b942] shrink-0" />
          </button>
        </div>
      </div>

      {/* Full Sample Modal */}
      {showFullModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lista completa da amostra do catálogo"
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[86vh] bg-[#110c07] border border-[#f5b942]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/10">
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-black font-heading text-white truncate">
                  Amostra Real do Catálogo Clube do Sax
                </h3>
                <p className="text-xs sm:text-sm text-[#cfc3ae]">
                  {totalShown}+ exemplos listados de um total de +{TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")} músicas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0 cursor-pointer"
                aria-label="Fechar lista"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-7">
              {CATALOG_GENRES.map((genre) => (
                <div key={genre.id}>
                  <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-white/10 flex-wrap">
                    <span className="text-2xl">{genre.emoji}</span>
                    <h4 className="font-black font-heading text-white">{genre.name}</h4>
                    <span className="text-xs font-extrabold text-[#ffe49e] bg-[#f5b942]/15 px-2.5 py-0.5 rounded-full">
                      +{genre.totalCount.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {genre.songs.map((song, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Music className="w-3.5 h-3.5 text-[#f5b942] shrink-0 mt-1" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{song.title}</p>
                          <p className="text-xs text-[#cfc3ae] truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/45">
              <button
                type="button"
                onClick={() => {
                  setShowFullModal(false);
                  onScrollToOffers();
                }}
                className="sax-cta-btn w-full py-4 rounded-2xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Quero Liberar o Acervo Completo Agora</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const FAQ_V3_ITEMS = [
  {
    q: "Como e quando recebo meu acesso e login do aplicativo?",
    a: "Na mesma hora! Assim que seu pagamento (Pix ou Cartão) é confirmado, você recebe automaticamente no seu e-mail o link oficial do aplicativo junto com seu Login e Senha exclusivos. Funciona 24 horas por dia, inclusive de madrugada, domingos e feriados.",
  },
  {
    q: "Serve tanto para Sax Alto (Eb) quanto para Sax Tenor (Bb)?",
    a: "Sim! Todas as partituras com playback estão disponíveis tanto para Sax Alto (Mib / Eb) quanto para Sax Tenor (Sib / Bb). Você não precisa escolher apenas um na hora da compra — ambos já vêm liberados na sua conta!",
  },
  {
    q: "Preciso baixar arquivos pesados ou ocupar a memória do celular?",
    a: "Não! O Clube do Sax funciona como um Web App moderno (estilo Netflix e Spotify). Você faz login pelo navegador do seu iPhone, Android, iPad/Tablet ou Computador, abre a partitura na tela e dá play no playback instantaneamente — ou baixa o PDF quando quiser imprimir.",
  },
  {
    q: "Qual a diferença entre o Plano Completo VIP (R$ 24,90) e o Plano Básico (R$ 14,90)?",
    a: "O Plano Completo VIP (R$ 24,90 — nossa 1ª opção e escolha de 94% dos alunos) libera a experiência completa do aplicativo: +10.000 partituras COM Playbacks profissionais de estúdio, Busca Inteligente por Voz, Vídeos Tutoriais, Harpa Cristã completa, atualizações mensais e os 3 Guias Bônus VIP. Já o Plano Básico (R$ 14,90) é uma opção secundária enxuta com +5.000 partituras apenas em PDF, sem playbacks e sem bônus.",
  },
  {
    q: "O pagamento é realmente único ou tem mensalidade?",
    a: "Pagamento 100% único! Você paga uma única vez e tem acesso vitalício ao seu plano, sem cobranças recorrentes ou surpresas no cartão.",
  },
  {
    q: "E se eu entrar e achar que não é para mim?",
    a: "Você tem 7 dias de Garantia Incondicional! Pode entrar no aplicativo, testar as partituras, dar play nos playbacks e usar a busca por voz. Se por qualquer motivo não amar, basta enviar um e-mail dentro de 7 dias e devolvemos 100% do seu investimento.",
  },
];

export const FaqV3 = () => (
  <section className="sax-section" id="faq">
    <div className="sax-container max-w-3xl">
      <div className="text-center mb-10 md:mb-12">
        <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
          <HelpCircle className="w-4 h-4 text-[#f5b942] shrink-0" />
          <span>Tire Suas Dúvidas</span>
        </div>
        <KineticHeading>
          <h2 className="sax-h2 text-white">
            Perguntas <span className="sax-gold-gradient-text italic">Frequentes</span>
          </h2>
        </KineticHeading>
      </div>

      <Accordion type="single" collapsible className="space-y-3.5">
        {FAQ_V3_ITEMS.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-v3-${idx}`}
            className="sax-card rounded-2xl px-5 sm:px-6 border border-[#f5b942]/20 overflow-hidden"
          >
            <AccordionTrigger className="text-left font-bold font-heading text-base sm:text-lg text-white py-5 hover:no-underline hover:text-[#ffe49e]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="sax-body text-[#cfc3ae] pb-6">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
