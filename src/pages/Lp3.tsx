import { useEffect } from "react";
import SalesPageV3 from "@/components/funnel/v3/SalesPageV3";
import { trackLandingView } from "@/hooks/useMetaPixel";
import "@/styles/lp3-sax-theme.css";

const Lp3 = () => {
  useEffect(() => {
    document.title = "Clube do Sax | +10.000 Partituras com Playback — Experiência Oficial";
    trackLandingView();
  }, []);

  return <SalesPageV3 />;
};

export default Lp3;
