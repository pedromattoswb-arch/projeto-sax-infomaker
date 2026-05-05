import { useState, useEffect } from "react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import UpsellSection from "@/components/UpsellSection";
import { Sparkles, Zap } from "lucide-react";

const UpsellToolkit = () => {
  useNoIndex();
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.pathname);
    };
    
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNoThanks = () => {
    window.location.href = "/cx/d5w2n8";
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-10 md:h-12 w-auto" />
        </div>
      </header>

      <UpsellSection onNoThanks={handleNoThanks} />

      {/* Exit Intent Modal / Promotion */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-primary/30 animate-scale-in">
            <div className="bg-primary p-6 text-white text-center relative">
              <Sparkles className="w-12 h-12 absolute -top-4 -left-4 rotate-12 opacity-20" />
              <h3 className="text-2xl font-black font-heading mb-1 uppercase tracking-tight">ESPERE! NÃO VÁ AINDA! 🛑</h3>
              <p className="text-white/80 text-sm font-medium">Liberei uma condição especial para você.</p>
            </div>
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-6 font-medium">
                Você realmente vai deixar passar a chance de tocar afinado e no tempo por menos do que um lanche?
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8">
                <p className="text-xs font-bold text-primary uppercase mb-2">Acesso Promocional</p>
                <div className="text-4xl font-black font-heading text-primary">R$ 14,50</div>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold tracking-wider">(Afinador + Metrônomo Vitalício)</p>
              </div>
              <div className="space-y-4">
                <a
                  href="https://pay.wiapy.com/SSjOIsHzZ"
                  className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-lg shadow-cta hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  SIM! QUERO O DESCONTO <Zap className="w-5 h-5 fill-white" />
                </a>
                <button 
                  onClick={() => window.location.href = "/acervo-basico"} 
                  className="text-xs text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest"
                >
                  Não, quero abrir mão das ferramentas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border text-center">
        <img src={logoClubeSax} alt="Clube do Sax" className="h-8 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default UpsellToolkit;