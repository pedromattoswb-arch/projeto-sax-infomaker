import { useState } from "react";
import { MessageCircle, Video, CheckCheck, Star, Users, X, ZoomIn } from "lucide-react";
import VideoTestimonialCarousel from "@/components/funnel/VideoTestimonialCarousel";

interface PrintItem {
  id: number;
  src: string;
  author: string;
  role: string;
  channel: "WhatsApp" | "Comunidade";
  quoteHighlight: string;
  tiltClass: string;
}

// Accurate metadata matching each of the 10 real prints in /public/testimonials/
const FIXED_TESTIMONIAL_PRINTS: PrintItem[] = [
  {
    id: 2,
    src: "/testimonials/depoimento-2.png",
    author: "Seu Jorge (68 anos)",
    role: "Aluno Novo no WhatsApp",
    channel: "WhatsApp",
    quoteHighlight: "Achei que era tarde demais... agora estou conseguindo tocar!",
    tiltClass: "md:-rotate-[0.6deg]",
  },
  {
    id: 5,
    src: "/testimonials/depoimento-5.png",
    author: "Prof. Carlos",
    role: "Professor de Sax há 15 anos",
    channel: "WhatsApp",
    quoteHighlight: "Arranjos que nunca encontrei em lugar nenhum! Uso com todos os alunos.",
    tiltClass: "md:rotate-[0.6deg]",
  },
  {
    id: 9,
    src: "/testimonials/depoimento-9.png",
    author: "Lucas",
    role: "Estudante de Conservatório",
    channel: "WhatsApp",
    quoteHighlight: "Salvou minha prova de repertório! Achei 3 peças em 5 minutos.",
    tiltClass: "md:-rotate-[0.4deg]",
  },
  {
    id: 4,
    src: "/testimonials/depoimento-4.png",
    author: "Roberto & Mariana",
    role: "Saxofonistas no WhatsApp",
    channel: "WhatsApp",
    quoteHighlight: "Já encontrei várias músicas que procurava há anos! Qualidade impressionante.",
    tiltClass: "md:rotate-[0.5deg]",
  },
  {
    id: 8,
    src: "/testimonials/depoimento-8.png",
    author: "Prof. Antônio",
    role: "Maestro • Banda Municipal",
    channel: "WhatsApp",
    quoteHighlight: "Já baixamos mais de 50 partituras pros alunos da banda!",
    tiltClass: "md:-rotate-[0.5deg]",
  },
  {
    id: 10,
    src: "/testimonials/depoimento-10.png",
    author: "Júlia",
    role: "Iniciante (3 meses de Sax)",
    channel: "WhatsApp",
    quoteHighlight: "Comecei há 3 meses e achei o tesouro! Partituras fáceis de entender.",
    tiltClass: "md:rotate-[0.4deg]",
  },
  {
    id: 1,
    src: "/testimonials/depoimento-1.png",
    author: "Profa. Renata Vieira",
    role: "Professora de Música",
    channel: "Comunidade",
    quoteHighlight: "O material do Clube do Sax Brasil é referência! Nota 10!",
    tiltClass: "md:-rotate-[0.4deg]",
  },
  {
    id: 3,
    src: "/testimonials/depoimento-3.png",
    author: "Patrícia Santos Almeida",
    role: "Aluna Clube do Sax",
    channel: "Comunidade",
    quoteHighlight: "Material de altíssima qualidade, super organizado. Melhor investimento!",
    tiltClass: "md:rotate-[0.5deg]",
  },
  {
    id: 6,
    src: "/testimonials/depoimento-6.png",
    author: "Lucas Ferreira Costa",
    role: "1 ano estudando Sax",
    channel: "Comunidade",
    quoteHighlight: "Tem TUDO que eu precisava! Partituras lindas, fáceis de ler.",
    tiltClass: "md:-rotate-[0.5deg]",
  },
  {
    id: 7,
    src: "/testimonials/depoimento-7.png",
    author: "Marcos Oliveira",
    role: "Turma da Escola de Música",
    channel: "Comunidade",
    quoteHighlight: "Vale muito cada centavo! Já indiquei para toda a turma da escola.",
    tiltClass: "md:rotate-[0.4deg]",
  },
];

const WhatsappTestimonialsWallV3 = () => {
  const [selectedPrint, setSelectedPrint] = useState<PrintItem | null>(null);

  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 md:px-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#25D366] mb-4">
            <Users className="w-3.5 h-3.5" />
            +847 Saxofonistas Reais Satisfeitos
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-4">
            Veja Quem Já Está Tocando com o <br className="hidden sm:block" />
            <span className="sax-gold-gradient-text italic">Clube do Sax</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] max-w-2xl mx-auto">
            De iniciantes realizando o sonho aos 68 anos até professores e maestros de bandas
            municipais — confira vídeos e conversas reais sem cortes:
          </p>
        </div>

        {/* PART 1: VIDEO TESTIMONIALS IN BRASS FRAME */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#f5b942]/15 border border-[#f5b942]/35 flex items-center justify-center">
              <Video className="w-4 h-4 text-[#f5b942]" />
            </div>
            <h3 className="text-lg sm:text-2xl font-black font-heading text-white">
              Depoimentos em Vídeo de Alunos Reais
            </h3>
          </div>

          <div className="sax-card rounded-[28px] p-3 sm:p-5 border border-[#f5b942]/30">
            <VideoTestimonialCarousel />
          </div>
        </div>

        {/* PART 2: FIXED WHATSAPP & COMMUNITY GALLERY WALL (ALL 10 PRINTS VISIBLE SIDE-BY-SIDE & STACKED) */}
        <div>
          {/* WhatsApp Mural Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#075E54]/85 via-[#0b3d36]/90 to-[#121c17]/95 border border-[#25D366]/35 px-5 sm:px-7 py-4 sm:py-5 mb-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-[#052912] flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(37,211,102,0.45)]">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black font-heading text-white flex items-center justify-center sm:justify-start gap-2">
                  Mural Fixo de Mensagens no WhatsApp & Comunidade
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80">
                  Todos os 10 prints listados lado a lado e empilhados para você ler com clareza (clique em qualquer print para dar zoom)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-black/35 border border-white/15 rounded-full px-4 py-2 shrink-0">
              <div className="flex text-[#f5b942]">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-black text-white ml-1">4.9/5</span>
            </div>
          </div>

          {/* Multi-Column Masonry / Stacked Collage — ALL 10 PRINTS FIXED ON SCREEN */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {FIXED_TESTIMONIAL_PRINTS.map((item) => {
              const isWhatsapp = item.channel === "WhatsApp";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPrint(item)}
                  className={`break-inside-avoid rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group shadow-[0_20px_45px_rgba(0,0,0,0.75)] hover:rotate-0 hover:scale-[1.015] hover:z-20 relative ${
                    item.tiltClass
                  } ${
                    isWhatsapp
                      ? "bg-[#0b1813] border-[#25D366]/30 hover:border-[#25D366]"
                      : "bg-[#14100a] border-[#f5b942]/30 hover:border-[#f5b942]"
                  }`}
                >
                  {/* Top Authentic WhatsApp / Community Card Bar */}
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
                        <p className="text-xs font-extrabold text-white truncate leading-tight">
                          {item.author}
                        </p>
                        <p className="text-[10px] text-white/65 truncate">{item.role}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                        isWhatsapp
                          ? "bg-[#25D366]/20 text-[#25D366]"
                          : "bg-[#f5b942]/20 text-[#ffe299]"
                      }`}
                    >
                      <CheckCheck className="w-3 h-3 text-[#38bdf8]" />
                      {item.channel}
                    </span>
                  </div>

                  {/* Full Uncropped Print Image — Always Fixed & Readable */}
                  <div className="relative bg-white">
                    <img
                      src={item.src}
                      alt={`Depoimento de ${item.author}`}
                      className="w-full h-auto block object-contain"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/80 text-white px-2.5 py-1 text-[10px] font-bold inline-flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-[#25D366]" />
                      Ampliar
                    </div>
                  </div>

                  {/* Highlight Caption Strip */}
                  <div className="px-3.5 py-2.5 text-[11px] text-[#e5dec9] font-medium italic flex items-center justify-between gap-2">
                    <span className="line-clamp-2">“{item.quoteHighlight}”</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal when clicking any WhatsApp print */}
      {selectedPrint && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPrint(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#0e1713] border border-[#25D366]/45 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#075E54]/80 border-b border-white/10">
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  {selectedPrint.author} — {selectedPrint.role}
                </h4>
                <p className="text-xs text-emerald-100/80">Print Verificado • Clube do Sax</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrint(null)}
                className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white"
                aria-label="Fechar"
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
