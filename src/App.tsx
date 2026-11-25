import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const Lp2 = lazy(() => import("./pages/Lp2"));
const Lp3 = lazy(() => import("./pages/Lp3"));
const Interativo = lazy(() => import("./pages/Interativo"));
const Acervo = lazy(() => import("./pages/Acervo"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PalcoRedirect = lazy(() => import("./pages/PalcoRedirect"));
const BonusRotina = lazy(() => import("./pages/BonusRotina"));
const BonusTonalidades = lazy(() => import("./pages/BonusTonalidades"));
const BonusMusicas = lazy(() => import("./pages/BonusMusicas"));
const OrderBumpDigitacao = lazy(() => import("./pages/OrderBumpDigitacao"));
const OrderBumpTransposicao = lazy(() => import("./pages/OrderBumpTransposicao"));
const OrderBumpManutencao = lazy(() => import("./pages/OrderBumpManutencao"));
const ThankYouBasico = lazy(() => import("./pages/ThankYouBasico"));
const ThankYouCompleto = lazy(() => import("./pages/ThankYouCompleto"));
const NovaOferta = lazy(() => import("./pages/NovaOferta"));
const UpsellToolkit = lazy(() => import("./pages/UpsellToolkit"));
const DownsellToolkit = lazy(() => import("./pages/DownsellToolkit"));
const ToolkitPage = lazy(() => import("./pages/ToolkitPage"));
const Termos = lazy(() => import("./pages/Termos"));
const Privacidade = lazy(() => import("./pages/Privacidade"));
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
            <Route path="/lp-3" element={<Lp3 />} />
            <Route path="/interativo" element={<Interativo />} />
            <Route path="/palco" element={<PalcoRedirect />} />
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
