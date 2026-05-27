import { useEffect } from "react";
import SalesPageV2 from "@/components/funnel/v2/SalesPageV2";
import { trackLandingView } from "@/hooks/useMetaPixel";

const Lp2 = () => {
  useEffect(() => {
    document.title = "Clube do Sax | +10.000 Partituras com Playback — Edição Premium";
    trackLandingView();
  }, []);

  return (
    <div className="theme-midnight-gold min-h-screen">
      <SalesPageV2 />
    </div>
  );
};

export default Lp2;
