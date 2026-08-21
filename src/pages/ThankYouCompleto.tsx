import { CheckCircle2, ArrowRight, Smartphone, Music, Mail, Crown, Star, Zap, Gauge, Timer, Check, Sparkles, Lock, Gift, ChevronDown, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import kitBanner from "@/assets/kit-ferramentas-banner.png";
import UpsellSection from "@/components/UpsellSection";


// Google Ads conversion event for purchase
const triggerPurchaseConversion = () => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18189363456/2C2hCLWTu7McEIDSruFD",
      value: 1.0,
      currency: "BRL",
      transaction_id: "",
    });
  }
};

const ThankYouCompleto = () => {
  useNoIndex();
  useEffect(() => {
    triggerPurchaseConversion();
  }, []);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleUpsell = () => {
    if (isLoading || showUpsell) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setShowUpsell(true);
      setIsLoading(false);
      setTimeout(() => {
        const element = document.getElementById('upsell-section');
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-10 md:h-12 w-auto" />
        </div>
      </header>

      {/* HERO — Confirmação */}
      <section className="py-14 md:py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6 relative">
            <Crown className="w-10 h-10 md:w-12 md:h-12 text-gold" />
            <Sparkles className="w-5 h-5 text-gold absolute -top-1 -right-1 animate-pulse" />
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3 leading-tight">
            Parabéns! Você Desbloqueou o{" "}
            <span className="text-gold">Acesso Completo</span>! 🎷🔥
          </h1>

          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-4 inline-block max-w-lg">
            <p className="text-gold font-bold text-sm md:text-base flex items-start gap-3 text-left">
              <Mail className="w-5 h-5 mt-0.5 shrink-0" />
              <span>
                O acesso foi enviado agora para seu <strong>E-mail</strong> cadastrado na Wiapy. Verifique sua caixa de entrada e spam.
              </span>
            </p>
          </div>

          <p className="text-foreground font-body text-[15px] md:text-lg mb-4 leading-relaxed max-w-xl mx-auto">
            Você agora tem acesso a <strong>+10.000 partituras e playbacks profissionais para Sax Alto e Sax Tenor</strong>, busca por voz, vídeos tutoriais e todos os bônus exclusivos.
          </p>

          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-5 py-2 mb-6">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold font-heading text-gold">Plano Completo Ativado</span>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={handleToggleUpsell}
              disabled={isLoading}
              className={`gradient-cta text-white font-bold font-heading py-4 px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2 group ${isLoading ? 'opacity-80 cursor-wait animate-pulse' : 'animate-cta-pulse'}`}
            >
              {isLoading ? "DESBLOQUEANDO..." : "VEJA O QUE VOCÊ ACABOU DE DESBLOQUEAR"}
              {!isLoading && <Gift className="w-5 h-5 animate-bounce" />}
            </button>
            <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-1">
              <ChevronDown className="w-3 h-3" /> Clique acima para desbloquear seu kit de ferramentas
            </p>
          </div>
        </div>
      </section>

      {showUpsell && (
        <UpsellSection onNoThanks={() => window.location.href = "/cx/d5w2n8?plan=completo"} />
      )}

      {/* INSTRUÇÕES DE ACESSO */}
      <section className="py-12 md:py-16 px-4 md:px-8" id="acesso">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-3xl font-extrabold font-heading text-center mb-3">
            Como Acessar Sua Plataforma
          </h2>
          <p className="text-center text-muted-foreground font-body text-[15px] md:text-lg mb-8">
            Siga estes 3 passos simples para começar a tocar
          </p>

          <div className="space-y-4">
            {[
              {
                step: "1",
                icon: Mail,
                title: "Verifique seu e-mail",
                description: "A Wiapy enviou automaticamente um e-mail com seu login e senha de acesso. Confira a caixa de entrada, a aba \"Promoções\" e a pasta de spam.",
              },
              {
                step: "2",
                icon: Smartphone,
                title: "Acesse a plataforma",
                description: "Clique no botão abaixo para entrar na plataforma Clube do Sax. Funciona em celular, tablet ou computador — como um app, sem instalar nada.",
              },
              {
                step: "3",
                icon: Music,
                title: "Explore tudo!",
                description: "Navegue pelas categorias, use a busca por voz, ouça os playbacks profissionais, acesse os bônus e toque com partituras para Sax Alto e Sax Tenor.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 glass-card rounded-xl border border-border p-5">
                <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-extrabold font-heading text-gold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold font-heading text-base mb-1">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-[15px] md:text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/plano-premium-completo"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
            >
              ACESSAR MINHA PLATAFORMA COMPLETA
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Plano Completo • +10.000 partituras e playbacks para Sax Alto e Sax Tenor
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-border bg-card">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-10 mx-auto" />
          <div className="space-y-3">
            <h3 className="font-extrabold text-xl">Ficou com alguma dúvida?</h3>
            <p className="text-muted-foreground">Nossa equipe está pronta para te atender agora mesmo.</p>
            <WhatsAppSupport showFooterButton />
          </div>
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
          </p>
        </div>
      </footer>
      
    </div>
  );
};

export default ThankYouCompleto;
