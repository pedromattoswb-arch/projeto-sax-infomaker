import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Acervo from "./pages/Acervo";
import NotFound from "./pages/NotFound";
import BonusRotina from "./pages/BonusRotina";
import BonusTonalidades from "./pages/BonusTonalidades";
import BonusMusicas from "./pages/BonusMusicas";
import OrderBumpDigitacao from "./pages/OrderBumpDigitacao";
import OrderBumpTransposicao from "./pages/OrderBumpTransposicao";
import OrderBumpManutencao from "./pages/OrderBumpManutencao";
import ThankYouBasico from "./pages/ThankYouBasico";
import ThankYouCompleto from "./pages/ThankYouCompleto";
import NovaOferta from "./pages/NovaOferta";
import UpsellToolkit from "./pages/UpsellToolkit";
import DownsellToolkit from "./pages/DownsellToolkit";
import ToolkitPage from "./pages/ToolkitPage";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Lp2 from "./pages/Lp2";
import ScrollToTop from "./components/ScrollToTop";

const DireStraitsFolder = lazy(() => import("./pages/DireStraitsFolder"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lp-2" element={<Lp2 />} />
            <Route path="/nova-oferta" element={<NovaOferta />} />
            <Route path="/acervo-basico" element={<Acervo plan="basic" />} />
            <Route path="/plano-premium-completo" element={<Acervo plan="premium" />} />
            <Route path="/bonus/rotina-de-estudo" element={<BonusRotina />} />
            <Route path="/bonus/mapa-de-tonalidades" element={<BonusTonalidades />} />
            <Route path="/bonus/100-musicas" element={<BonusMusicas />} />
            <Route path="/orderbump/digitacao" element={<OrderBumpDigitacao />} />
            <Route path="/orderbump/transposicao" element={<OrderBumpTransposicao />} />
            <Route path="/orderbump/manutencao" element={<OrderBumpManutencao />} />
            {/* Thank You pages */}
            <Route path="/cx/r7b2k9" element={<ThankYouBasico />} />
            <Route path="/cx/m4p8x1" element={<ThankYouCompleto />} />
            {/* Upsell / Downsell */}
            <Route path="/upsell-toolkit" element={<UpsellToolkit />} />
            <Route path="/cx/v3j8q2" element={<UpsellToolkit />} />
            <Route path="/cx/d5w2n8" element={<DownsellToolkit />} />
            {/* Toolkit delivery (full kit with scales) */}
            <Route path="/cx/k9t3m7" element={<ToolkitPage showScales={true} />} />
            {/* Toolkit delivery (downsell — tuner + metronome only) */}
            <Route path="/cx/h6f1p4" element={<ToolkitPage showScales={false} />} />
            {/* Legal */}
            <Route path="/termos-de-uso" element={<Termos />} />
            <Route path="/politica-de-privacidade" element={<Privacidade />} />
            {/* Especial */}
            <Route path="/especial/dire-straits" element={<DireStraitsFolder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;