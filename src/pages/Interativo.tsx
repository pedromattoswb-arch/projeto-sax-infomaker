import { useEffect } from "react";
import { FunnelController } from "@/features/interativo/FunnelController";
import { FUNNEL_CONFIG } from "@/features/interativo/funnel.config";
import "@/features/interativo/styles/interativo.css";

const Interativo = () => {
  useEffect(() => {
    document.title = FUNNEL_CONFIG.meta.title;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute("content", FUNNEL_CONFIG.meta.description);
    }

    // Preload critical Scene 1 saxophone hero image
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = FUNNEL_CONFIG.assets.saxAltoImage;
    document.head.appendChild(preloadLink);

    return () => {
      preloadLink.remove();
    };
  }, []);

  return <FunnelController />;
};

export default Interativo;
