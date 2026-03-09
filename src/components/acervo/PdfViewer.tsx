import { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { Song } from "@/types/acervo";

// Mock: map song IDs to partitura images (simulating multi-page PDFs)
const mockPartituraPages: Record<string, string[]> = {
  "1": ["/src/assets/partituras-exemplo/partitura-1.png", "/src/assets/partituras-exemplo/partitura-3.png"],
  "2": ["/src/assets/partituras-exemplo/partitura-4.png"],
  "3": ["/src/assets/partituras-exemplo/partitura-5.png", "/src/assets/partituras-exemplo/partitura-6.png"],
  "4": ["/src/assets/partituras-exemplo/partitura-7.png"],
  "5": ["/src/assets/partituras-exemplo/partitura-8.png", "/src/assets/partituras-exemplo/partitura-9.png"],
  "6": ["/src/assets/partituras-exemplo/partitura-1.png"],
  "7": ["/src/assets/partituras-exemplo/partitura-3.png", "/src/assets/partituras-exemplo/partitura-4.png"],
  "8": ["/src/assets/partituras-exemplo/partitura-5.png"],
  "9": ["/src/assets/partituras-exemplo/partitura-6.png"],
  "10": ["/src/assets/partituras-exemplo/partitura-7.png"],
};

// Import all partitura images
import partitura1 from "@/assets/partituras-exemplo/partitura-1.png";
import partitura3 from "@/assets/partituras-exemplo/partitura-3.png";
import partitura4 from "@/assets/partituras-exemplo/partitura-4.png";
import partitura5 from "@/assets/partituras-exemplo/partitura-5.png";
import partitura6 from "@/assets/partituras-exemplo/partitura-6.png";
import partitura7 from "@/assets/partituras-exemplo/partitura-7.png";
import partitura8 from "@/assets/partituras-exemplo/partitura-8.png";
import partitura9 from "@/assets/partituras-exemplo/partitura-9.png";

const imageMap: Record<string, string> = {
  "/src/assets/partituras-exemplo/partitura-1.png": partitura1,
  "/src/assets/partituras-exemplo/partitura-3.png": partitura3,
  "/src/assets/partituras-exemplo/partitura-4.png": partitura4,
  "/src/assets/partituras-exemplo/partitura-5.png": partitura5,
  "/src/assets/partituras-exemplo/partitura-6.png": partitura6,
  "/src/assets/partituras-exemplo/partitura-7.png": partitura7,
  "/src/assets/partituras-exemplo/partitura-8.png": partitura8,
  "/src/assets/partituras-exemplo/partitura-9.png": partitura9,
};

interface PdfViewerProps {
  song: Song;
  onClose: () => void;
}

const PdfViewer = ({ song, onClose }: PdfViewerProps) => {
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const pages = mockPartituraPages[song.id] || ["/src/assets/partituras-exemplo/partitura-1.png"];
  const totalPages = pages.length;
  const currentImageSrc = imageMap[pages[currentPage - 1]] || partitura1;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground/95 animate-in fade-in duration-200">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/10 backdrop-blur-sm border-b border-border/20">
        <div className="min-w-0 flex-1 mr-3">
          <h3 className="font-heading font-bold text-sm md:text-base text-background truncate">
            {song.title}
          </h3>
          <p className="text-xs text-background/60 font-body truncate">{song.artist}</p>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            className="p-2 md:p-2.5 rounded-lg bg-background/10 hover:bg-background/20 text-background transition-colors"
            aria-label="Diminuir zoom"
          >
            <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={handleZoomReset}
            className="px-2 py-1.5 md:px-3 md:py-2 rounded-lg bg-background/10 hover:bg-background/20 text-background text-xs md:text-sm font-body font-semibold transition-colors min-w-[3rem] text-center"
            aria-label="Resetar zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 md:p-2.5 rounded-lg bg-background/10 hover:bg-background/20 text-background transition-colors"
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="w-px h-6 bg-background/20 mx-1 hidden md:block" />

          {/* Download */}
          <a
            href={currentImageSrc}
            download={`${song.title} - partitura.png`}
            className="p-2 md:p-2.5 rounded-lg bg-background/10 hover:bg-background/20 text-background transition-colors"
            aria-label="Baixar partitura"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 md:p-2.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors ml-1"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4" style={{ touchAction: "pan-x pan-y" }}>
        <img
          src={currentImageSrc}
          alt={`Partitura de ${song.title} — Página ${currentPage}`}
          className="max-w-full transition-transform duration-200 ease-out rounded-lg shadow-2xl"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          draggable={false}
        />
      </div>

      {/* Bottom bar — Page navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-card/10 backdrop-blur-sm border-t border-border/20">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2.5 rounded-lg bg-background/10 hover:bg-background/20 text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-background font-body text-sm font-semibold min-w-[5rem] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-lg bg-background/10 hover:bg-background/20 text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
