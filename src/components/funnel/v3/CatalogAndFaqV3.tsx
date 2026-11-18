import { useMemo, useState } from "react";
import { Music, ArrowRight, ChevronDown, X, FolderOpen, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATALOG_GENRES, TOTAL_CATALOG_COUNT, TOTAL_SAMPLE_COUNT } from "@/data/catalogSongs";

interface SongCatalogV3Props {
  onScrollToOffers: () => void;
}

export const SongCatalogV3 = ({ onScrollToOffers }: SongCatalogV3Props) => {
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [showFullModal, setShowFullModal] = useState(false);

  const totalShown = useMemo(() => TOTAL_SAMPLE_COUNT, []);

  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 md:px-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
            <FolderOpen className="w-3.5 h-3.5 text-[#f5b942]" />
            Repertório Real Organizado por Estilo
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-4">
            Mais de <span className="sax-gold-gradient-text italic">10.000 Músicas</span>{" "}
            Prontas Para Você Tocar
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] max-w-2xl mx-auto">
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
              <div
                key={genre.id}
                className="sax-card rounded-3xl p-6 border border-[#f5b942]/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5 pb-3.5 border-b border-white/10">
                    <span className="text-3xl shrink-0">{genre.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black font-heading text-base sm:text-lg text-white truncate">
                        {genre.name}
                      </h3>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#f5b942]">
                        +{genre.totalCount.toLocaleString("pt-BR")} músicas na pasta
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {visibleSongs.map((song, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Music className="w-3.5 h-3.5 text-[#f5b942]/75 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold text-white/95 truncate leading-tight">
                            {song.title}
                          </p>
                          <p className="text-[11px] text-[#c2b59f]/80 truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {genre.songs.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setExpandedGenre(isExpanded ? null : genre.id)}
                    className="mt-5 w-full text-[11px] font-black text-[#ffe299] uppercase tracking-wider flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#f5b942]/10 hover:bg-[#f5b942]/20 border border-[#f5b942]/25 transition-colors cursor-pointer"
                  >
                    {isExpanded ? "Mostrar menos" : `Ver mais ${genre.songs.length - 6} exemplos`}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Full Sample Modal Trigger */}
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => setShowFullModal(true)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#ffe299] hover:text-white border-b border-[#f5b942]/50 pb-1 transition-colors cursor-pointer"
          >
            Abrir lista com {totalShown}+ exemplos reais do catálogo
            <ArrowRight className="w-4 h-4 text-[#f5b942]" />
          </button>
        </div>
      </div>

      {/* Full Sample Modal */}
      {showFullModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#110c07] border border-[#f5b942]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                  Amostra Real do Catálogo Clube do Sax
                </h3>
                <p className="text-xs text-[#c2b59f]">
                  {totalShown}+ exemplos listados de um total de +{TOTAL_CATALOG_COUNT.toLocaleString("pt-BR")} músicas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
              {CATALOG_GENRES.map((genre) => (
                <div key={genre.id}>
                  <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-white/10">
                    <span className="text-2xl">{genre.emoji}</span>
                    <h4 className="font-black font-heading text-white">{genre.name}</h4>
                    <span className="text-[10px] font-extrabold text-[#ffe299] bg-[#f5b942]/15 px-2.5 py-0.5 rounded-full">
                      +{genre.totalCount.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {genre.songs.map((song, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Music className="w-3.5 h-3.5 text-[#f5b942] shrink-0 mt-1" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{song.title}</p>
                          <p className="text-[11px] text-[#c2b59f] truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40">
              <button
                type="button"
                onClick={() => {
                  setShowFullModal(false);
                  onScrollToOffers();
                }}
                className="sax-cta-btn w-full py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Quero Liberar o Acervo Completo Agora
                <ArrowRight className="w-4 h-4" />
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
    q: "Qual a diferença entre o Plano Básico (R$ 14,90) e o Plano Completo VIP (R$ 24,90)?",
    a: "O Plano Básico (R$ 14,90) entrega +5.000 partituras apenas em PDF. Já o Plano Completo VIP (R$ 24,90 — escolhido por 94% dos alunos) desbloqueia +10.000 partituras COM Playbacks profissionais de estúdio, Busca Inteligente por Voz, Vídeos Tutoriais, Harpa Cristã completa, atualizações mensais e os 3 Guias Bônus VIP.",
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
  <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 relative" id="faq">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-[#f5b942]" />
          Tire Suas Dúvidas
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
          Perguntas <span className="sax-gold-gradient-text italic">Frequentes</span>
        </h2>
      </div>

      <Accordion type="single" collapsible className="space-y-3.5">
        {FAQ_V3_ITEMS.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-v3-${idx}`}
            className="sax-card rounded-2xl px-6 border border-[#f5b942]/20 overflow-hidden"
          >
            <AccordionTrigger className="text-left font-bold font-heading text-sm sm:text-base text-white py-5 hover:no-underline hover:text-[#ffe299]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base text-[#c2b59f] pb-6 leading-relaxed">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
