import { useState, useRef, useEffect } from "react";
import { MessageCircle, Video, CheckCheck, Star, Users, X, ZoomIn, Play } from "lucide-react";

interface VideoTestimonialItem {
  src: string;
  poster: string;
  name: string;
  city: string;
}

const VIDEO_TESTIMONIALS: VideoTestimonialItem[] = [
  { src: "/testimonials/julio-sampaio-sp.mp4", poster: "/testimonials/posters/julio-sampaio-sp.jpg", name: "Júlio Sampaio", city: "São Paulo" },
  { src: "/testimonials/marcelo-cristian-rj.mp4", poster: "/testimonials/posters/marcelo-cristian-rj.jpg", name: "Marcelo Cristian", city: "Rio de Janeiro" },
  { src: "/testimonials/marcos-mattos-bsb.mp4", poster: "/testimonials/posters/marcos-mattos-bsb.jpg", name: "Marcos Mattos", city: "Brasília" },
  { src: "/testimonials/julia-costa-sp.mp4", poster: "/testimonials/posters/julia-costa-sp.jpg", name: "Júlia Costa", city: "São Paulo" },
  { src: "/testimonials/barbara-oliveira-floripa.mp4", poster: "/testimonials/posters/barbara-oliveira-floripa.jpg", name: "Bárbara Oliveira", city: "Florianópolis" },
  { src: "/testimonials/gabriela-santana-sp.mp4", poster: "/testimonials/posters/gabriela-santana-sp.jpg", name: "Gabriela Santana", city: "São Paulo" },
];

interface PrintItem {
  id: number;
  src: string;
  author: string;
  role: string;
  channel: "WhatsApp" | "Comunidade";
  quoteHighlight: string;
}

const FIXED_TESTIMONIAL_PRINTS: PrintItem[] = [
  {
    id: 2,
    src: "/testimonials/depoimento-2.png",
    author: "Seu Jorge (68 anos)",
    role: "Aluno Novo no WhatsApp",
    channel: "WhatsApp",
    quoteHighlight: "Achei que era tarde demais... agora estou conseguindo tocar!",
  },
  {
    id: 5,
    src: "/testimonials/depoimento-5.png",
    author: "Prof. Carlos",
    role: "Professor de Sax há 15 anos",
    channel: "WhatsApp",
    quoteHighlight: "Arranjos que nunca encontrei em lugar nenhum! Uso com todos os alunos.",
  },
  {
    id: 9,
    src: "/testimonials/depoimento-9.png",
    author: "Lucas",
    role: "Estudante de Conservatório",
    channel: "WhatsApp",
    quoteHighlight: "Salvou minha prova de repertório! Achei 3 peças em 5 minutos.",
  },
  {
    id: 4,
    src: "/testimonials/depoimento-4.png",
    author: "Roberto & Mariana",
    role: "Saxofonistas no WhatsApp",
    channel: "WhatsApp",
    quoteHighlight: "Já encontrei várias músicas que procurava há anos! Qualidade impressionante.",
  },
  {
    id: 8,
    src: "/testimonials/depoimento-8.png",
    author: "Prof. Antônio",
    role: "Maestro • Banda Municipal",
    channel: "WhatsApp",
    quoteHighlight: "Já baixamos mais de 50 partituras pros alunos da banda!",
  },
  {
    id: 10,
    src: "/testimonials/depoimento-10.png",
    author: "Júlia",
    role: "Iniciante (3 meses de Sax)",
    channel: "WhatsApp",
    quoteHighlight: "Comecei há 3 meses e achei o tesouro! Partituras fáceis de entender.",
  },
  {
    id: 1,
    src: "/testimonials/depoimento-1.png",
    author: "Profa. Renata Vieira",
    role: "Professora de Música",
    channel: "Comunidade",
    quoteHighlight: "O material do Clube do Sax Brasil é referência! Nota 10!",
  },
  {
    id: 3,
    src: "/testimonials/depoimento-3.png",
    author: "Patrícia Santos Almeida",
    role: "Aluna Clube do Sax",
    channel: "Comunidade",
    quoteHighlight: "Material de altíssima qualidade, super organizado. Melhor investimento!",
  },
  {
    id: 6,
    src: "/testimonials/depoimento-6.png",
    author: "Lucas Ferreira Costa",
    role: "1 ano estudando Sax",
    channel: "Comunidade",
    quoteHighlight: "Tem TUDO que eu precisava! Partituras lindas, fáceis de ler.",
  },
  {
    id: 7,
    src: "/testimonials/depoimento-7.png",
    author: "Marcos Oliveira",
    role: "Turma da Escola de Música",
    channel: "Comunidade",
    quoteHighlight: "Vale muito cada centavo! Já indiquei para toda a turma da escola.",
  },
];

const WhatsappTestimonialsWallV3 = () => {
  const [selectedPrint, setSelectedPrint] = useState<PrintItem | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (!selectedPrint) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPrint(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedPrint]);

  const handleVideoClick = (index: number) => {
    videoRefs.current.forEach((v, idx) => {
      if (v && idx !== index) v.pause();
    });
    setActiveVideoIndex(index);
    setTimeout(() => {
      videoRefs.current[index]?.play().catch(() => {});
    }, 40);
  };

  return (
    <section id="depoimentos" className="sax-section">
      <div className="sax-container relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#25D366] mb-4">
            <Users className="w-4 h-4 shrink-0" />
            <span>+847 Saxofonistas Reais Satisfeitos</span>
          </div>

          <h2 className="sax-h2 text-white mb-4">
            Veja Quem Já Está Tocando com o <br className="hidden sm:block" />
            <span className="sax-gold-gradient-text italic">Clube do Sax</span>
          </h2>

          <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto">
            De iniciantes realizando o sonho aos 68 anos até professores e maestros de bandas
            municipais — confira vídeos e conversas reais sem cortes:
          </p>
        </div>

        {/* PART 1: FIXED RESPONSIVE VIDEO TESTIMONIALS GRID (2 cols mobile -> 3 cols tablet -> 6 cols desktop, zero lateral scroll!) */}
        <div className="mb-14 md:mb-16">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#f5b942]/15 border border-[#f5b942]/35 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4 text-[#f5b942]" />
            </div>
            <h3 className="sax-h3 text-white">Depoimentos em Vídeo de Alunos Reais</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {VIDEO_TESTIMONIALS.map((t, i) => (
              <div
                key={t.src}
                className="sax-card rounded-2xl overflow-hidden border border-[#f5b942]/25 flex flex-col"
              >
                <div className="relative aspect-[9/16] bg-[#120d08]">
                  {activeVideoIndex === i ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={t.src}
                      poster={t.poster}
                      controls
                      autoPlay
                      playsInline
                      onPlay={() => {
                        videoRefs.current.forEach((v, idx) => {
                          if (v && idx !== i) v.pause();
                        });
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleVideoClick(i)}
                      className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
                      aria-label={`Assistir depoimento em vídeo de ${t.name}`}
                    >
                      <img
                        src={t.poster}
                        alt={`Depoimento de ${t.name}`}
                        width={360}
                        height={640}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/70" />
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-[#f5b942] text-[#1c1102] flex items-center justify-center shadow-[0_8px_24px_rgba(245,185,66,0.5)] group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow">
                          Assistir
                        </span>
                      </div>
                    </button>
                  )}
                </div>
                <div className="p-2.5 sm:p-3 text-left">
                  <p className="text-xs sm:text-sm font-black font-heading text-white truncate">
                    {t.name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#cfc3ae] truncate">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 2: FIXED WHATSAPP & COMMUNITY GALLERY WALL (ALL 10 PRINTS VISIBLE SIDE-BY-SIDE & STACKED) */}
        <div>
          <div className="rounded-3xl bg-gradient-to-r from-[#075E54]/85 via-[#0b3d36]/90 to-[#121c17]/95 border border-[#25D366]/35 px-4 sm:px-7 py-4 sm:py-5 mb-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-[#052912] flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(37,211,102,0.4)]">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                  Mural Fixo de Mensagens no WhatsApp & Comunidade
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/85">
                  Todos os 10 prints listados lado a lado para você ler com total clareza (toque em qualquer print para ampliar)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-full px-4 py-2 shrink-0">
              <div className="flex text-[#f5b942]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-black text-white ml-1">4.9/5</span>
            </div>
          </div>

          {/* Multi-Column Masonry — ALL 10 PRINTS FIXED ON SCREEN */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {FIXED_TESTIMONIAL_PRINTS.map((item) => {
              const isWhatsapp = item.channel === "WhatsApp";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPrint(item)}
                  className={`w-full text-left break-inside-avoid rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group shadow-[0_18px_40px_rgba(0,0,0,0.72)] hover:-translate-y-1 relative block ${
                    isWhatsapp
                      ? "bg-[#0b1813] border-[#25D366]/30 hover:border-[#25D366]"
                      : "bg-[#14100a] border-[#f5b942]/30 hover:border-[#f5b942]"
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 flex items-center justify-between gap-2 border-b ${
                      isWhatsapp
                        ? "bg-[#075E54]/65 border-[#25D366]/20"
                        : "bg-[#1f170c] border-[#f5b942]/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isWhatsapp ? "bg-[#25D366]" : "bg-[#f5b942]"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-extrabold text-white truncate leading-tight">
                          {item.author}
                        </p>
                        <p className="text-[11px] text-white/70 truncate">{item.role}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                        isWhatsapp
                          ? "bg-[#25D366]/20 text-[#25D366]"
                          : "bg-[#f5b942]/20 text-[#ffe49e]"
                      }`}
                    >
                      <CheckCheck className="w-3 h-3 text-[#38bdf8]" />
                      {item.channel}
                    </span>
                  </div>

                  <div className="relative bg-white">
                    <img
                      src={item.src}
                      alt={`Depoimento de ${item.author}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block object-contain"
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/80 text-white px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-[#25D366]" />
                      Ampliar
                    </div>
                  </div>

                  <div className="px-3.5 py-2.5 text-xs text-[#e5dec9] font-medium italic">
                    “{item.quoteHighlight}”
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal when clicking any WhatsApp print */}
      {selectedPrint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Depoimento ampliado de ${selectedPrint.author}`}
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onClick={() => setSelectedPrint(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#0e1713] border border-[#25D366]/45 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-[#075E54]/85 border-b border-white/10">
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-black text-white truncate">
                  {selectedPrint.author} — {selectedPrint.role}
                </h4>
                <p className="text-xs text-emerald-100/85">Print Verificado • Clube do Sax</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrint(null)}
                className="w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 flex items-center justify-center text-white shrink-0 cursor-pointer"
                aria-label="Fechar depoimento"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-5 bg-black/40 max-h-[82vh] overflow-y-auto flex justify-center">
              <img
                src={selectedPrint.src}
                alt={selectedPrint.author}
                className="max-w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WhatsappTestimonialsWallV3;
