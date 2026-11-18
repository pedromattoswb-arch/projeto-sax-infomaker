import logoClubeSax from "@/assets/lp3/logo-clube-do-sax.webp";
import seloGarantia from "@/assets/lp3/selo-garantia.webp";
import saxStageHeroArt from "@/assets/lp3/sax-stage-hero-art.webp";
import illAcervo from "@/assets/lp3/ill-acervo-partituras.webp";
import illVoz from "@/assets/lp3/ill-voz-inteligente.webp";
import illMulti from "@/assets/lp3/ill-multi-dispositivos.webp";
import illEmail from "@/assets/lp3/ill-acesso-email.webp";
import illBonusVip from "@/assets/lp3/ill-bonus-vip.webp";
import p1 from "@/assets/lp3/partituras/partitura-1.webp";
import p3 from "@/assets/lp3/partituras/partitura-3.webp";
import p4 from "@/assets/lp3/partituras/partitura-4.webp";
import p5 from "@/assets/lp3/partituras/partitura-5.webp";
import p6 from "@/assets/lp3/partituras/partitura-6.webp";
import p8 from "@/assets/lp3/partituras/partitura-8.webp";
import p9 from "@/assets/lp3/partituras/partitura-9.webp";

export const ALL_LP3_MEDIA_URLS: string[] = [
  logoClubeSax,
  seloGarantia,
  saxStageHeroArt,
  illAcervo,
  illVoz,
  illMulti,
  illEmail,
  illBonusVip,
  p1,
  p3,
  p4,
  p5,
  p6,
  p8,
  p9,
  "/lp3/posters/julio-sampaio-sp.webp",
  "/lp3/posters/marcelo-cristian-rj.webp",
  "/lp3/posters/marcos-mattos-bsb.webp",
  "/lp3/posters/julia-costa-sp.webp",
  "/lp3/posters/barbara-oliveira-floripa.webp",
  "/lp3/posters/gabriela-santana-sp.webp",
  "/lp3/testimonials/depoimento-1.webp",
  "/lp3/testimonials/depoimento-2.webp",
  "/lp3/testimonials/depoimento-3.webp",
  "/lp3/testimonials/depoimento-4.webp",
  "/lp3/testimonials/depoimento-5.webp",
  "/lp3/testimonials/depoimento-6.webp",
  "/lp3/testimonials/depoimento-7.webp",
  "/lp3/testimonials/depoimento-8.webp",
  "/lp3/testimonials/depoimento-9.webp",
  "/lp3/testimonials/depoimento-10.webp",
];

let preloaded = false;

export function preloadAllLp3Media() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  ALL_LP3_MEDIA_URLS.forEach((url) => {
    if (typeof document !== "undefined" && document.head) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
    }
    const img = new Image();
    img.decoding = "sync";
    img.src = url;
    if (typeof img.decode === "function") {
      img.decode().catch(() => {});
    }
  });
}
