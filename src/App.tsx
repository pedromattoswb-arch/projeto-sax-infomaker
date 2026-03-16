import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/acervo-basico" element={<Acervo plan="basic" />} />
          <Route path="/plano-premium-completo" element={<Acervo plan="premium" />} />
          <Route path="/bonus/rotina-de-estudo" element={<BonusRotina />} />
          <Route path="/bonus/mapa-de-tonalidades" element={<BonusTonalidades />} />
          <Route path="/bonus/100-musicas" element={<BonusMusicas />} />
          <Route path="/orderbump/digitacao" element={<OrderBumpDigitacao />} />
          <Route path="/orderbump/transposicao" element={<OrderBumpTransposicao />} />
          <Route path="/orderbump/manutencao" element={<OrderBumpManutencao />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
